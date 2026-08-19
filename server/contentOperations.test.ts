import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

describe("content operations and safe visa intake", () => {
  it("keeps dedicated database tables for operational content and visa intake", () => {
    const schema = readFileSync(resolve(root, "drizzle/schema.ts"), "utf8");
    expect(schema).toContain("managedDestinations");
    expect(schema).toContain("managedExperiences");
    expect(schema).toContain("managedSections");
    expect(schema).toContain("mediaAssets");
    expect(schema).toContain("visaIntakes");
  });

  it("protects management procedures and limits visa intake to an official-referral pending state", () => {
    const router = readFileSync(resolve(root, "server/routers.ts"), "utf8");
    expect(router).toContain("contentAdmin: router");
    expect(router).toContain("createDestination: adminProcedure");
    expect(router).toContain("uploadImage: adminProcedure");
    expect(router).toContain("visa: router");
    expect(router).toContain('officialReferral: "pending_official_channel"');
    expect(router).not.toContain("fetch(\"https://evisa.gov.ly");
  });

  it("provides public intake and protected operational workspace routes", () => {
    const app = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");
    expect(app).toContain('path={"/admin/content"}');
    expect(app).toContain('path={"/visa-intake"}');
    const admin = readFileSync(resolve(root, "client/src/pages/ContentManagement.tsx"), "utf8");
    expect(admin).toContain("أضف مهرجانًا أو قسمًا");
    expect(admin).toContain("إضافة صورة موثقة");
    const visa = readFileSync(resolve(root, "client/src/pages/VisaIntake.tsx"), "utf8");
    expect(visa).toContain("لا تدخل رقم جواز السفر");
    expect(existsSync(resolve(root, "client/src/pages/VisaIntake.tsx"))).toBe(true);
  });
});
