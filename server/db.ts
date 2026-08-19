import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { desc, gte, isNotNull, sql } from "drizzle-orm";
import { InsertUser, interactionEvents, managedDestinations, managedExperiences, managedSections, mediaAssets, translationAuditLogs, translationReviews, translationSuggestions, type InsertTranslationReview, users, visaIntakes } from "../drizzle/schema";
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
  await db.insert(visaIntakes).values({ ...input, consentAcceptedAt: new Date() });
}
export async function listVisaIntakes() { const db = await getDb(); return db ? db.select().from(visaIntakes).orderBy(desc(visaIntakes.createdAt)) : []; }
export async function updateVisaIntakeStatus(id: number, status: "received" | "ready_for_official_referral" | "closed", actor: string) {
  const db = await getDb(); if (!db) return;
  await db.update(visaIntakes).set({ status, reviewedByOpenId: actor, reviewedAt: new Date() }).where(eq(visaIntakes.id, id));
}

// TODO: add feature queries here as your schema grows.
