import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

describe("visa analytics and exports", () => {
  it("stores optional aggregate-only fields instead of an exact date of birth", () => {
    const schema = readFileSync(resolve(root, "drizzle/schema.ts"), "utf8");
    expect(schema).toContain('intendedRegion: varchar("intendedRegion"');
    expect(schema).toContain('ageGroup: mysqlEnum("ageGroup"');
    expect(schema).not.toContain('dateOfBirth');
  });

  it("provides a review-protected report for time, geography, and age aggregates", () => {
    const db = readFileSync(resolve(root, "server/db.ts"), "utf8");
    const router = readFileSync(resolve(root, "server/routers.ts"), "utf8");
    expect(db).toContain("getAdminOperationsReport");
    expect(db).toContain("visaStatuses");
    expect(db).toContain("ageGroups");
    expect(router).toContain("operationsReport: protectedProcedure");
    expect(router).toContain('requireContentAction(ctx, "visa", "review")');
  });

  it("renders filters, interactive reports, and privacy-preserving CSV/PDF exports", () => {
    const panel = readFileSync(resolve(root, "client/src/components/AdminVisaInsights.tsx"), "utf8");
    expect(panel).toContain("LineChart");
    expect(panel).toContain("BarChart");
    expect(panel).toContain("exportCsv");
    expect(panel).toContain("printPdf");
    expect(panel).toContain("دون الاسم أو البريد الإلكتروني أو الملاحظات");
    expect(panel).toContain("قائمة المتابعة المفلترة");
  });
});
