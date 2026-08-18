import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

describe("image presentation", () => {
  it("يعرض هيرو التجارب صورة ميدانية صريحة ويمنح البطاقات معرفًا لموضع الصورة", () => {
    const experiences = readFileSync(resolve(projectRoot, "client/src/pages/Experiences.tsx"), "utf8");

    expect(experiences).toContain("experience-hero-image");
    expect(experiences).toContain("assets.desertCaravan");
    expect(experiences).toContain('data-experience={experience.id}');
  });

  it("يحدد بطاقات الوجهات لعرض مواضع صورها الميدانية", () => {
    const home = readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('data-destination={destination.id}');
  });
});
