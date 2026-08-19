import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type TranslationReview = typeof translationReviews.$inferSelect;
export type InsertTranslationReview = typeof translationReviews.$inferInsert;
export type TranslationAuditLog = typeof translationAuditLogs.$inferSelect;
export type TranslationSuggestion = typeof translationSuggestions.$inferSelect;
export type InteractionEvent = typeof interactionEvents.$inferSelect;

// TODO: Add your tables here
