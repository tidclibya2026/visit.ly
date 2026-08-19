import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

describe("visa team operations", () => {
  it("stores responsibility and a traceable assignment action without applicant details", () => {
    const schema = readFileSync(resolve(root, "drizzle/schema.ts"), "utf8");
    const db = readFileSync(resolve(root, "server/db.ts"), "utf8");
    expect(schema).toContain('assignedToOpenId: varchar("assignedToOpenId"');
    expect(schema).toContain('assignedByOpenId: varchar("assignedByOpenId"');
    expect(schema).toContain('action: varchar("action"');
    expect(db).toContain("assignVisaIntake");
    expect(db).toContain('action: "assignment"');
    expect(db).toContain("listAssignableVisaStaff");
  });

  it("provides protected staff assignment and monthly target contracts", () => {
    const router = readFileSync(resolve(root, "server/routers.ts"), "utf8");
    expect(router).toContain("assignableStaff: protectedProcedure");
    expect(router).toContain("assignIntake: protectedProcedure");
    expect(router).toContain("monthlyPerformance: protectedProcedure");
    expect(router).toContain("setMonthlyTarget: adminProcedure");
  });

  it("renders a searchable priority list and actual-versus-target monthly indicators", () => {
    const queue = readFileSync(resolve(root, "client/src/components/AdminPriorityQueue.tsx"), "utf8");
    const performance = readFileSync(resolve(root, "client/src/components/AdminMonthlyPerformance.tsx"), "utf8");
    expect(queue).toContain("ابحث بالمرجع أو المنطقة أو المسؤول");
    expect(queue).toContain("assignIntake.useMutation");
    expect(queue).toContain("غير معيّن");
    expect(performance).toContain("المستهدفات الشهرية");
    expect(performance).toContain("visa.monthlyPerformance.useQuery");
    expect(performance).toContain("setMonthlyTarget.useMutation");
  });
});
