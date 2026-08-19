import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

describe("published content, permissions, and visa workflow", () => {
  it("keeps public content limited to published records", () => {
    const db = readFileSync(resolve(root, "server/db.ts"), "utf8");
    const router = readFileSync(resolve(root, "server/routers.ts"), "utf8");
    expect(db).toContain("listPublishedContent");
    expect(db).toContain('eq(managedDestinations.status, "published")');
    expect(router).toContain("publishedContent: router");
  });

  it("adds granular roles and permissions without relying on a local users table", () => {
    const schema = readFileSync(resolve(root, "drizzle/schema.ts"), "utf8");
    const router = readFileSync(resolve(root, "server/routers.ts"), "utf8");
    expect(schema).toContain("contentUserRoles");
    expect(schema).toContain("contentPermissions");
    expect(router).toContain("requireContentAction");
    expect(router).toContain("assignRole: adminProcedure");
    expect(router).toContain("setPermission: adminProcedure");
  });

  it("records visa status updates as an internal timeline and does not create an external referral", () => {
    const db = readFileSync(resolve(root, "server/db.ts"), "utf8");
    const admin = readFileSync(resolve(root, "client/src/pages/ContentManagement.tsx"), "utf8");
    expect(db).toContain("visaIntakeHistory");
    expect(db).toContain("awaiting_information");
    expect(admin).toContain("خط المتابعة");
    expect(admin).toContain("لا ترسل المنصة أي طلب إلى جهة خارجية تلقائيًا");
  });
});
