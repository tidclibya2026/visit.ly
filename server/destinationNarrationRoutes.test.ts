import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

describe("destination narration and walking routes", () => {
  it("يعرض سردًا صوتيًا اختياريًا مع صورة أرشيفية لكل محطة", () => {
    const detail = readFileSync(resolve(projectRoot, "client/src/pages/DestinationDetail.tsx"), "utf8");
    expect(detail).toContain("SpeechSynthesisUtterance");
    expect(detail).toContain("timeline-archive-photo");
    expect(detail).toContain("Photo from the Center archive");
  });

  it("يرسم مسار مشي باستخدام خدمة الاتجاهات مع بديل العلامات", () => {
    const detail = readFileSync(resolve(projectRoot, "client/src/pages/DestinationDetail.tsx"), "utf8");
    expect(detail).toContain("DirectionsService");
    expect(detail).toContain("TravelMode.WALKING");
    expect(detail).toContain("destination-walk-section");
  });
});
