import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const translationReviews = mysqlTable("translation_reviews", {
  id: int("id").autoincrement().primaryKey(),
  destinationId: varchar("destinationId", { length: 64 }).notNull(),
  language: mysqlEnum("language", ["en", "fr", "it", "de", "es", "zh"]).notNull(),
  sourceJson: text("sourceJson").notNull(),
  machineJson: text("machineJson").notNull(),
  editedJson: text("editedJson"),
  status: mysqlEnum("status", ["pending", "approved", "needs_revision"]).default("pending").notNull(),
  reviewerOpenId: varchar("reviewerOpenId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export const translationAuditLogs = mysqlTable("translation_audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  reviewId: int("reviewId"),
  destinationId: varchar("destinationId", { length: 64 }).notNull(),
  language: mysqlEnum("language", ["ar", "en", "fr", "it", "de", "es", "zh"]).notNull(),
  action: mysqlEnum("action", ["generated", "edited", "approved", "needs_revision", "suggestion_received"]).notNull(),
  actorOpenId: varchar("actorOpenId", { length: 64 }),
  detail: text("detail"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const translationSuggestions = mysqlTable("translation_suggestions", {
  id: int("id").autoincrement().primaryKey(),
  destinationId: varchar("destinationId", { length: 64 }).notNull(),
  language: mysqlEnum("language", ["ar", "en", "fr", "it", "de", "es", "zh"]).notNull(),
  originalText: text("originalText").notNull(),
  suggestedText: text("suggestedText").notNull(),
  contextUrl: varchar("contextUrl", { length: 512 }).notNull(),
  status: mysqlEnum("status", ["pending", "reviewed", "closed"]).default("pending").notNull(),
  reviewedByOpenId: varchar("reviewedByOpenId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export const interactionEvents = mysqlTable("interaction_events", {
  id: int("id").autoincrement().primaryKey(),
  eventType: mysqlEnum("eventType", ["destination_open", "atlas_marker_select", "language_switch"]).notNull(),
  destinationId: varchar("destinationId", { length: 64 }),
  language: mysqlEnum("language", ["ar", "en", "fr", "it", "de", "es", "zh"]).notNull(),
  sessionKey: varchar("sessionKey", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const managedDestinations = mysqlTable("managed_destinations", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  city: varchar("city", { length: 160 }).notNull(),
  region: varchar("region", { length: 160 }).notNull(),
  category: mysqlEnum("category", ["city", "heritage", "nature", "coast"]).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("imageUrl", { length: 768 }),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdByOpenId: varchar("createdByOpenId", { length: 64 }).notNull(),
  updatedByOpenId: varchar("updatedByOpenId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const managedExperiences = mysqlTable("managed_experiences", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  destinationSlug: varchar("destinationSlug", { length: 96 }),
  region: varchar("region", { length: 160 }).notNull(),
  season: varchar("season", { length: 120 }),
  description: text("description").notNull(),
  imageUrl: varchar("imageUrl", { length: 768 }),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdByOpenId: varchar("createdByOpenId", { length: 64 }).notNull(),
  updatedByOpenId: varchar("updatedByOpenId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const managedSections = mysqlTable("managed_sections", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  sectionType: mysqlEnum("sectionType", ["festival", "culture", "heritage", "travel", "custom"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
  imageUrl: varchar("imageUrl", { length: 768 }),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdByOpenId: varchar("createdByOpenId", { length: 64 }).notNull(),
  updatedByOpenId: varchar("updatedByOpenId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const mediaAssets = mysqlTable("media_assets", {
  id: int("id").autoincrement().primaryKey(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  url: varchar("url", { length: 768 }).notNull(),
  altText: varchar("altText", { length: 500 }).notNull(),
  sourceLabel: varchar("sourceLabel", { length: 255 }).notNull(),
  caption: text("caption"),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  uploadedByOpenId: varchar("uploadedByOpenId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const visaIntakes = mysqlTable("visa_intakes", {
  id: int("id").autoincrement().primaryKey(),
  referenceCode: varchar("referenceCode", { length: 32 }).notNull().unique(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  nationality: varchar("nationality", { length: 120 }).notNull(),
  residenceCountry: varchar("residenceCountry", { length: 120 }).notNull(),
  intendedRegion: varchar("intendedRegion", { length: 160 }),
  ageGroup: mysqlEnum("ageGroup", ["not_disclosed", "under_18", "18_24", "25_34", "35_44", "45_54", "55_plus"]).default("not_disclosed").notNull(),
  travelPurpose: varchar("travelPurpose", { length: 255 }).notNull(),
  intendedArrival: varchar("intendedArrival", { length: 32 }),
  notes: text("notes"),
  consentAcceptedAt: timestamp("consentAcceptedAt").notNull(),
  status: mysqlEnum("status", ["received", "under_review", "awaiting_information", "ready_for_official_referral", "closed"]).default("received").notNull(),
  reviewedByOpenId: varchar("reviewedByOpenId", { length: 64 }),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const contentPermissions = mysqlTable("content_permissions", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  resource: mysqlEnum("resource", ["destinations", "experiences", "sections", "media", "visa", "users"]).notNull(),
  canCreate: boolean("canCreate").default(false).notNull(),
  canEdit: boolean("canEdit").default(false).notNull(),
  canPublish: boolean("canPublish").default(false).notNull(),
  canReview: boolean("canReview").default(false).notNull(),
  grantedByOpenId: varchar("grantedByOpenId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const contentUserRoles = mysqlTable("content_user_roles", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull().unique(),
  role: mysqlEnum("role", ["editor", "reviewer"]).notNull(),
  assignedByOpenId: varchar("assignedByOpenId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const visaIntakeHistory = mysqlTable("visa_intake_history", {
  id: int("id").autoincrement().primaryKey(),
  intakeId: int("intakeId").notNull(),
  status: mysqlEnum("status", ["received", "under_review", "awaiting_information", "ready_for_official_referral", "closed"]).notNull(),
  note: text("note"),
  actorOpenId: varchar("actorOpenId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const adminNotifications = mysqlTable("admin_notifications", {
  id: int("id").autoincrement().primaryKey(),
  kind: mysqlEnum("kind", ["visa_status", "visa_note"]).notNull(),
  visaIntakeId: int("visaIntakeId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TranslationReview = typeof translationReviews.$inferSelect;
export type InsertTranslationReview = typeof translationReviews.$inferInsert;
export type TranslationAuditLog = typeof translationAuditLogs.$inferSelect;
export type TranslationSuggestion = typeof translationSuggestions.$inferSelect;
export type InteractionEvent = typeof interactionEvents.$inferSelect;
export type ManagedDestination = typeof managedDestinations.$inferSelect;
export type ManagedExperience = typeof managedExperiences.$inferSelect;
export type ManagedSection = typeof managedSections.$inferSelect;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type VisaIntake = typeof visaIntakes.$inferSelect;
export type ContentPermission = typeof contentPermissions.$inferSelect;
export type ContentUserRole = typeof contentUserRoles.$inferSelect;
export type VisaIntakeHistory = typeof visaIntakeHistory.$inferSelect;
export type AdminNotification = typeof adminNotifications.$inferSelect;

// TODO: Add your tables here
