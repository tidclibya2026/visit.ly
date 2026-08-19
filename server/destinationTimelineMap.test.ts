import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

describe("destination timelines and landmark maps", () => {
  it("يحفظ معالم موقعة ومحطات زمنية للمدن التاريخية الرئيسة", () => {
    const content = readFileSync(resolve(projectRoot, "client/src/lib/content.ts"), "utf8");
    expect(content).toContain("landmarks:");
    expect(content).toContain("timeline:");
    ["163م", "القرن السادس ق.م", "أكثر من 4,000 سنة", "1985م", "1982م"].forEach((period) => expect(content).toContain(period));
  });

  it("يضم عقد الترجمة المنظم سجل الشواهد والزمن والمعالم", () => {
    const router = readFileSync(resolve(projectRoot, "server/routers.ts"), "utf8");
    expect(router).toContain("heritage,\n      }");
    expect(router).toContain("chronological timeline");
    expect(router).toContain('heritage: { type: "object"');
  });

  it("يعرض خطًا زمنيًا وخريطة متعددة النقاط تفاعليًا", () => {
    const detail = readFileSync(resolve(projectRoot, "client/src/pages/DestinationDetail.tsx"), "utf8");
    expect(detail).toContain("destination-timeline");
    expect(detail).toContain("landmark-point-list");
    expect(detail).toContain("AdvancedMarkerElement");
    expect(detail).toContain("coordinates: landmark.coordinates");
  });
});
