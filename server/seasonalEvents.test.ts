import { describe, expect, it } from "vitest";
import { destinations, seasonalEvents } from "../client/src/lib/content";

describe("seasonal event content", () => {
  it("provides filterable, non-empty seasonal windows and storage-backed imagery", () => {
    expect(seasonalEvents.length).toBeGreaterThanOrEqual(6);
    for (const event of seasonalEvents) {
      expect(event.months.length).toBeGreaterThan(0);
      expect(event.region).not.toHaveLength(0);
      expect(event.image).toContain("/manus-storage/");
      expect(event.planningNote).not.toHaveLength(0);
    }
  });

  it("adds the three requested sites as detailed, mapped destinations", () => {
    for (const id of ["tolmeitha", "qasr-libya", "awjila"]) {
      const destination = destinations.find((item) => item.id === id);
      expect(destination).toBeDefined();
      expect(destination?.gallery.length).toBeGreaterThanOrEqual(3);
      expect(destination?.gallery[0]?.coordinates).toMatch(/°N.*°E/);
    }
  });
});

