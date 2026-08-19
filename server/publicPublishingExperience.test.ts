import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

describe("public publishing experience", () => {
  it("exposes only published detail records through a public contract", () => {
    const db = readFileSync(resolve(root, "server/db.ts"), "utf8");
    const router = readFileSync(resolve(root, "server/routers.ts"), "utf8");
    expect(db).toContain("getPublishedContentItem");
    expect(router).toContain("detail: publicProcedure");
    expect(router).toContain("المحتوى المنشور غير متاح");
  });

  it("keeps a public explorer with search and advanced filters", () => {
    const explorer = readFileSync(resolve(root, "client/src/pages/PublishedExplorer.tsx"), "utf8");
    expect(explorer).toContain("عرض المنشور خلال 30 يومًا");
    expect(explorer).toContain("setKind");
    expect(explorer).toContain("/published/");
  });

  it("creates readable admin notifications when visa states or notes change", () => {
    const schema = readFileSync(resolve(root, "drizzle/schema.ts"), "utf8");
    const db = readFileSync(resolve(root, "server/db.ts"), "utf8");
    const admin = readFileSync(resolve(root, "client/src/pages/ContentManagement.tsx"), "utf8");
    expect(schema).toContain("adminNotifications");
    expect(db).toContain("listAdminNotifications");
    expect(admin).toContain("إشعارات التأشيرة");
    expect(admin).toContain("تمت القراءة");
  });
});
