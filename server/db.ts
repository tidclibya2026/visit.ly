import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { and, desc, gte, isNotNull, sql } from "drizzle-orm";
import { InsertUser, adminNotifications, contentPermissions, contentUserRoles, interactionEvents, managedDestinations, managedExperiences, managedSections, mediaAssets, translationAuditLogs, translationReviews, translationSuggestions, type InsertTranslationReview, users, visaIntakeHistory, visaIntakes } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createTranslationReview(review: InsertTranslationReview) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(translationReviews).values(review);
  const raw = result as unknown as { insertId?: number } | Array<{ insertId?: number }>;
  const reviewId = Array.isArray(raw) ? raw[0]?.insertId : raw.insertId;
  await db.insert(translationAuditLogs).values({ reviewId, destinationId: review.destinationId, language: review.language, action: "generated", detail: "تم إنشاء ترجمة آلية جديدة للمراجعة." });
}

export async function listTranslationReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(translationReviews).orderBy(desc(translationReviews.createdAt));
}

export async function reviewTranslation(id: number, editedJson: string, status: "approved" | "needs_revision", reviewerOpenId: string) {
  const db = await getDb();
  if (!db) return;
  const records = await db.select().from(translationReviews).where(eq(translationReviews.id, id)).limit(1);
  const review = records[0];
  if (!review) return;
  await db.update(translationReviews).set({ editedJson, status, reviewerOpenId, reviewedAt: new Date() }).where(eq(translationReviews.id, id));
  await db.insert(translationAuditLogs).values({ reviewId: id, destinationId: review.destinationId, language: review.language, action: status, actorOpenId: reviewerOpenId, detail: status === "approved" ? "اعتمد المشرف النسخة المحررة." : "أعاد المشرف الترجمة للمراجعة." });
}

export async function listTranslationAuditLogs(reviewId?: number) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(translationAuditLogs).orderBy(desc(translationAuditLogs.createdAt));
  return reviewId ? query.where(eq(translationAuditLogs.reviewId, reviewId)) : query;
}

export async function submitTranslationSuggestion(input: { destinationId: string; language: "ar" | "en" | "fr" | "it" | "de" | "es" | "zh"; originalText: string; suggestedText: string; contextUrl: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(translationSuggestions).values(input);
  await db.insert(translationAuditLogs).values({ destinationId: input.destinationId, language: input.language, action: "suggestion_received", detail: "استلمت المنصة اقتراح تحسين من زائر." });
}

export async function listTranslationSuggestions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(translationSuggestions).orderBy(desc(translationSuggestions.createdAt));
}

export async function updateTranslationSuggestion(id: number, status: "reviewed" | "closed", reviewerOpenId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(translationSuggestions).set({ status, reviewedByOpenId: reviewerOpenId, reviewedAt: new Date() }).where(eq(translationSuggestions.id, id));
}

export async function recordInteraction(input: { eventType: "destination_open" | "atlas_marker_select" | "language_switch"; destinationId?: string; language: "ar" | "en" | "fr" | "it" | "de" | "es" | "zh"; sessionKey: string }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(interactionEvents).values(input);
}

export async function getTranslationDashboardMetrics() {
  const db = await getDb();
  if (!db) return { since: new Date(), languages: [], destinations: [], pendingSuggestions: 0 };
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [languages, destinations, pending] = await Promise.all([
    db.select({ language: interactionEvents.language, total: sql<number>`count(*)` }).from(interactionEvents).where(gte(interactionEvents.createdAt, since)).groupBy(interactionEvents.language).orderBy(desc(sql`count(*)`)),
    db.select({ destinationId: interactionEvents.destinationId, total: sql<number>`count(*)` }).from(interactionEvents).where(isNotNull(interactionEvents.destinationId)).groupBy(interactionEvents.destinationId).orderBy(desc(sql`count(*)`)).limit(8),
    db.select({ total: sql<number>`count(*)` }).from(translationSuggestions).where(eq(translationSuggestions.status, "pending")),
  ]);
  return { since, languages, destinations, pendingSuggestions: Number(pending[0]?.total ?? 0) };
}

type ContentStatus = "draft" | "published" | "archived";
type DestinationInput = { slug: string; title: string; city: string; region: string; category: "city" | "heritage" | "nature" | "coast"; description: string; imageUrl?: string | null; status: ContentStatus };
type ExperienceInput = { slug: string; title: string; destinationSlug?: string | null; region: string; season?: string | null; description: string; imageUrl?: string | null; status: ContentStatus };
type SectionInput = { slug: string; sectionType: "festival" | "culture" | "heritage" | "travel" | "custom"; title: string; summary: string; imageUrl?: string | null; status: ContentStatus };

export async function listManagedContent() {
  const db = await getDb();
  if (!db) return { destinations: [], experiences: [], sections: [], media: [] };
  const [destinations, experiences, sections, media] = await Promise.all([
    db.select().from(managedDestinations).orderBy(desc(managedDestinations.updatedAt)),
    db.select().from(managedExperiences).orderBy(desc(managedExperiences.updatedAt)),
    db.select().from(managedSections).orderBy(desc(managedSections.updatedAt)),
    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)),
  ]);
  return { destinations, experiences, sections, media };
}

export async function listPublishedContent() {
  const db = await getDb();
  if (!db) return { destinations: [], experiences: [], sections: [] };
  const [destinations, experiences, sections] = await Promise.all([
    db.select().from(managedDestinations).where(eq(managedDestinations.status, "published")).orderBy(desc(managedDestinations.updatedAt)),
    db.select().from(managedExperiences).where(eq(managedExperiences.status, "published")).orderBy(desc(managedExperiences.updatedAt)),
    db.select().from(managedSections).where(eq(managedSections.status, "published")).orderBy(desc(managedSections.updatedAt)),
  ]);
  return { destinations, experiences, sections };
}
export async function getPublishedContentItem(kind: "destinations" | "experiences" | "sections", slug: string) {
  const db = await getDb();
  if (!db) return null;
  if (kind === "destinations") return (await db.select().from(managedDestinations).where(and(eq(managedDestinations.slug, slug), eq(managedDestinations.status, "published"))).limit(1))[0] ?? null;
  if (kind === "experiences") return (await db.select().from(managedExperiences).where(and(eq(managedExperiences.slug, slug), eq(managedExperiences.status, "published"))).limit(1))[0] ?? null;
  return (await db.select().from(managedSections).where(and(eq(managedSections.slug, slug), eq(managedSections.status, "published"))).limit(1))[0] ?? null;
}

export async function createManagedDestination(input: DestinationInput, actor: string) {
  const db = await getDb(); if (!db) return;
  await db.insert(managedDestinations).values({ ...input, createdByOpenId: actor, updatedByOpenId: actor });
}
export async function updateManagedDestination(id: number, input: DestinationInput, actor: string) {
  const db = await getDb(); if (!db) return;
  await db.update(managedDestinations).set({ ...input, updatedByOpenId: actor }).where(eq(managedDestinations.id, id));
}
export async function createManagedExperience(input: ExperienceInput, actor: string) {
  const db = await getDb(); if (!db) return;
  await db.insert(managedExperiences).values({ ...input, createdByOpenId: actor, updatedByOpenId: actor });
}
export async function updateManagedExperience(id: number, input: ExperienceInput, actor: string) {
  const db = await getDb(); if (!db) return;
  await db.update(managedExperiences).set({ ...input, updatedByOpenId: actor }).where(eq(managedExperiences.id, id));
}
export async function createManagedSection(input: SectionInput, actor: string) {
  const db = await getDb(); if (!db) return;
  await db.insert(managedSections).values({ ...input, createdByOpenId: actor, updatedByOpenId: actor });
}
export async function updateManagedSection(id: number, input: SectionInput, actor: string) {
  const db = await getDb(); if (!db) return;
  await db.update(managedSections).set({ ...input, updatedByOpenId: actor }).where(eq(managedSections.id, id));
}
export async function createMediaAsset(input: { storageKey: string; url: string; altText: string; sourceLabel: string; caption?: string | null; mimeType: string }, actor: string) {
  const db = await getDb(); if (!db) return;
  await db.insert(mediaAssets).values({ ...input, uploadedByOpenId: actor });
}

export async function createVisaIntake(input: { referenceCode: string; fullName: string; email: string; nationality: string; residenceCountry: string; travelPurpose: string; intendedArrival?: string | null; notes?: string | null }) {
  const db = await getDb(); if (!db) return;
  const result = await db.insert(visaIntakes).values({ ...input, consentAcceptedAt: new Date() });
  await db.insert(visaIntakeHistory).values({ intakeId: Number(result[0].insertId), status: "received", note: "تم استلام الطلب الأولي من الزائر." });
}
export async function listVisaIntakes() { const db = await getDb(); return db ? db.select().from(visaIntakes).orderBy(desc(visaIntakes.createdAt)) : []; }
export async function listVisaIntakeHistory(intakeId?: number) { const db = await getDb(); if (!db) return []; return intakeId ? db.select().from(visaIntakeHistory).where(eq(visaIntakeHistory.intakeId, intakeId)).orderBy(desc(visaIntakeHistory.createdAt)) : db.select().from(visaIntakeHistory).orderBy(desc(visaIntakeHistory.createdAt)); }
export async function updateVisaIntakeStatus(id: number, status: "received" | "under_review" | "awaiting_information" | "ready_for_official_referral" | "closed", actor: string, note?: string | null) {
  const db = await getDb(); if (!db) return;
  await db.update(visaIntakes).set({ status, reviewedByOpenId: actor, reviewedAt: new Date() }).where(eq(visaIntakes.id, id));
  await db.insert(visaIntakeHistory).values({ intakeId: id, status, note: note || null, actorOpenId: actor });
  const intake = await db.select({ referenceCode: visaIntakes.referenceCode }).from(visaIntakes).where(eq(visaIntakes.id, id)).limit(1);
  await db.insert(adminNotifications).values({ kind: note ? "visa_note" : "visa_status", visaIntakeId: id, title: `تحديث طلب ${intake[0]?.referenceCode ?? id}`, message: note || `تم تغيير حالة الطلب إلى ${status}.` });
}
export async function listAdminNotifications() { const db = await getDb(); return db ? db.select().from(adminNotifications).orderBy(desc(adminNotifications.createdAt)).limit(60) : []; }
export async function markAdminNotificationRead(id: number) { const db = await getDb(); if (!db) return; await db.update(adminNotifications).set({ isRead: true }).where(eq(adminNotifications.id, id)); }

type PermissionResource = "destinations" | "experiences" | "sections" | "media" | "visa" | "users";
type PermissionAction = "create" | "edit" | "publish" | "review";
export async function listContentAccess() { const db = await getDb(); if (!db) return { roles: [], permissions: [] }; const [roles, permissions] = await Promise.all([db.select().from(contentUserRoles).orderBy(desc(contentUserRoles.updatedAt)), db.select().from(contentPermissions).orderBy(desc(contentPermissions.updatedAt))]); return { roles, permissions }; }
export async function assignContentRole(input: { userOpenId: string; role: "editor" | "reviewer" }, actor: string) { const db = await getDb(); if (!db) return; await db.insert(contentUserRoles).values({ ...input, assignedByOpenId: actor }).onDuplicateKeyUpdate({ set: { role: input.role, assignedByOpenId: actor } }); }
export async function setContentPermission(input: { userOpenId: string; resource: PermissionResource; canCreate: boolean; canEdit: boolean; canPublish: boolean; canReview: boolean }, actor: string) { const db = await getDb(); if (!db) return; const existing = await db.select().from(contentPermissions).where(and(eq(contentPermissions.userOpenId, input.userOpenId), eq(contentPermissions.resource, input.resource))).limit(1); if (existing[0]) await db.update(contentPermissions).set({ ...input, grantedByOpenId: actor }).where(eq(contentPermissions.id, existing[0].id)); else await db.insert(contentPermissions).values({ ...input, grantedByOpenId: actor }); }
export async function getContentAccess(openId: string, resource: PermissionResource) { const db = await getDb(); if (!db) return null; const [role, permission] = await Promise.all([db.select().from(contentUserRoles).where(eq(contentUserRoles.userOpenId, openId)).limit(1), db.select().from(contentPermissions).where(and(eq(contentPermissions.userOpenId, openId), eq(contentPermissions.resource, resource))).limit(1)]); return { role: role[0]?.role ?? null, permission: permission[0] ?? null }; }
export function permissionAllows(access: Awaited<ReturnType<typeof getContentAccess>>, action: PermissionAction) { if (!access) return false; if (access.role === "editor" && (action === "create" || action === "edit")) return true; if (access.role === "reviewer" && (action === "review" || action === "publish")) return true; const key = action === "create" ? "canCreate" : action === "edit" ? "canEdit" : action === "publish" ? "canPublish" : "canReview"; return Boolean(access.permission?.[key]); }

// TODO: add feature queries here as your schema grows.
