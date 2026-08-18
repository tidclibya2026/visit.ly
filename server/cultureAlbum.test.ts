import { describe, expect, it } from "vitest";
import { foodCraftVisualArchive } from "../client/src/lib/content";

describe("food and craft visual archive", () => {
  it("يضم صورًا موثقة للمذاقات والحلويات والحرف من أرشيف المركز", () => {
    expect(foodCraftVisualArchive).toHaveLength(4);
    expect(foodCraftVisualArchive.map((item) => item.label)).toEqual(["عصيدة وضيافة", "مقروض وحلويات", "صناعات تقليدية", "فخار يدوي"]);
    expect(foodCraftVisualArchive.every((item) => item.image.startsWith("/manus-storage/"))).toBe(true);
  });
});
