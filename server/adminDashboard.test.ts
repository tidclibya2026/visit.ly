import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

describe("admin dashboard", () => {
  it("registers the unified admin route", () => {
    const app = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");
    expect(app).toContain('path={"/admin"} component={AdminDashboard}');
  });

  it("uses the dashboard layout and surfaces live operating indicators", () => {
    const dashboard = readFileSync(resolve(root, "client/src/pages/AdminDashboard.tsx"), "utf8");
    expect(dashboard).toContain("<DashboardLayout>");
    expect(dashboard).toContain("contentAdmin.list.useQuery");
    expect(dashboard).toContain("visa.listIntakes.useQuery");
    expect(dashboard).toContain("adminNotifications.list.useQuery");
    expect(dashboard).toContain("المحتوى المنشور");
    expect(dashboard).toContain("طلبات تأشيرة مفتوحة");
    expect(dashboard).toContain("إشعارات غير مقروءة");
    expect(dashboard).toContain("أولويات التشغيل الآن");
    expect(dashboard).toContain("refreshOperations");
    expect(dashboard).toContain("البيانات التشغيلية متزامنة");
    expect(dashboard).toContain("Visit Libya | زور ليبيا");
    expect(dashboard).toContain("أولويات التشغيل الآن");
  });
});
