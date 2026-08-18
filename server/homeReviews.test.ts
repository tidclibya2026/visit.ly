import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("verified reviews section", () => {
  it("يظهر حالة مراجعات موثقة شفافة بدل اختلاق شهادات زوار", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(home).toContain("مراجعات موثقة");
    expect(home).toContain("0</span>");
    expect(home).toContain("لا توجد مراجعات زوار موثقة منشورة حاليًا");
  });
});
