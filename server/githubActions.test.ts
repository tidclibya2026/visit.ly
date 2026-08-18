import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workflowPath = resolve(process.cwd(), ".github/workflows/ci.yml");

describe("GitHub Actions workflow", () => {
  it("يشغّل الفحص والاختبارات والبناء عند التحديثات", () => {
    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("pull_request:");
    expect(workflow).toContain("pnpm check");
    expect(workflow).toContain("pnpm test");
    expect(workflow).toContain("pnpm build");
  });

  it("يعدّ pnpm قبل طلب ذاكرة pnpm المؤقتة من Node.js", () => {
    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow.indexOf("name: Set up pnpm")).toBeLessThan(workflow.indexOf("name: Set up Node.js"));
  });
});
