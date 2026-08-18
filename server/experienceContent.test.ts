import { describe, expect, it } from "vitest";
import { destinations, experiences } from "../client/src/lib/content";

describe("experience destination mapping", () => {
  it("maps every experience to a real destination page with season and trip metadata", () => {
    const destinationIds = new Set(destinations.map((destination) => destination.id));

    expect(experiences).toHaveLength(6);
    experiences.forEach((experience) => {
      expect(destinationIds.has(experience.targetDestinationId)).toBe(true);
      expect(experience.targetRoute).toBe(`/destinations/${experience.targetDestinationId}`);
      expect(experience.region.trim().length).toBeGreaterThan(0);
      expect(experience.season.trim().length).toBeGreaterThan(0);
      expect(experience.seasonNote.trim().length).toBeGreaterThan(0);
      expect(experience.image).toMatch(/^\/manus-storage\//);
    });
  });
});
