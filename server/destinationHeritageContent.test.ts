import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

describe("destination heritage content", () => {
  it("يحفظ سردًا تاريخيًا وثقافيًا موثقًا للوجهات الرئيسة", () => {
    const content = readFileSync(resolve(projectRoot, "client/src/lib/content.ts"), "utf8");
    expect(content).toContain("heritage?:");
    ["ملف طرابلس القديمة", "ملف بنغازي", "ملف غدامس", "ملف أكاكوس", "ملف لبدة", "ملف قورينا ومدينة شحات الأثرية", "ملف صبراتة"].forEach((source) => expect(content).toContain(source));
  });

  it("يعرض الشواهد والمصدر داخل صفحة تفاصيل الوجهة", () => {
    const detail = readFileSync(resolve(projectRoot, "client/src/pages/DestinationDetail.tsx"), "utf8");
    expect(detail).toContain("destination-heritage");
    expect(detail).toContain("سجل الشواهد");
    expect(detail).toContain("destination.heritage.source");
  });

  it("يقدم تكبيرًا صريحًا وصور تجارب أفقية وحركة مرور للوجهات", () => {
    const home = readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
    const experiences = readFileSync(resolve(projectRoot, "client/src/pages/Experiences.tsx"), "utf8");
    const styles = readFileSync(resolve(projectRoot, "client/src/index.css"), "utf8");
    expect(home).toContain("quick-image-zoom");
    expect(experiences).toContain("experience-zoom");
    expect(styles).toContain(".experience-card-photo { width: 100%; aspect-ratio: 16 / 9");
    expect(styles).toContain(".destination-card:hover { transform: translateY(-7px)");
  });
});
