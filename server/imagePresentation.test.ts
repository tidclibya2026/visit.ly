import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");

describe("image presentation", () => {
  it("يعرض هيرو التجارب صورة ميدانية صريحة ويمنح البطاقات معرفًا لموضع الصورة", () => {
    const experiences = readFileSync(resolve(projectRoot, "client/src/pages/Experiences.tsx"), "utf8");

    expect(experiences).toContain("experience-hero-image");
    expect(experiences).toContain("assets.acacusRocks");
    expect(experiences).toContain('data-experience={experience.id}');
  });

  it("يحدد بطاقات الوجهات لعرض مواضع صورها الميدانية", () => {
    const home = readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
    const styles = readFileSync(resolve(projectRoot, "client/src/index.css"), "utf8");
    expect(home).toContain('data-destination={destination.id}');
    expect(styles).toContain("aspect-ratio: 16 / 9");
    expect(styles).toContain(".destination-card-2, .destination-card-3 { min-height: 0; height: auto; aspect-ratio: 16 / 9; margin-top: 0; }");
    expect(styles).toContain('data-destination="tripoli"] img { object-position: 51% 32%');
  });

  it("يعرض هيرو الثقافة لقطة شعبية ميدانية من أرشيف المركز", () => {
    const culture = readFileSync(resolve(projectRoot, "client/src/pages/Culture.tsx"), "utf8");
    expect(culture).toContain("culture-hero-image");
    expect(culture).toContain("assets.cultureFolklore");
  });

  it("يعتمد هيروات الأقسام على صور ميدانية صريحة بدل الخلفيات الزخرفية", () => {
    const pages = ["Destinations.tsx", "Heritage.tsx", "Services.tsx", "TripPlanner.tsx", "Events.tsx", "AtlasGateway.tsx"];
    pages.forEach((page) => {
      const source = readFileSync(resolve(projectRoot, `client/src/pages/${page}`), "utf8");
      expect(source).toContain("landmark-hero");
      expect(source).toContain("landmark-hero-image");
    });
  });
});
