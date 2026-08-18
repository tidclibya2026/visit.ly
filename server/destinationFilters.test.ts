import { describe, expect, it } from "vitest";
import { filterAndSortDestinations } from "../client/src/lib/destinationFilters";
import { destinations } from "../client/src/lib/content";

const allFilters = {
  query: "",
  city: "الكل",
  landmarkType: "الكل",
  region: "الكل",
  category: "الكل",
  sort: "default" as const,
};

describe("destination filters", () => {
  it("يصفّي الوجهات بحسب المنطقة والفئة معًا", () => {
    const results = filterAndSortDestinations(destinations, {
      ...allFilters,
      region: "الجبل الأخضر",
      category: "تراث",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((destination) => destination.region === "الجبل الأخضر" && destination.category === "تراث")).toBe(true);
  });

  it("يرتب النتائج بحسب المنطقة أو الفئة من دون تغيير بيانات المصدر", () => {
    const originalOrder = destinations.map((destination) => destination.id);
    const byRegion = filterAndSortDestinations(destinations, { ...allFilters, sort: "region" });
    const byCategory = filterAndSortDestinations(destinations, { ...allFilters, sort: "category" });

    expect(byRegion).not.toBe(destinations);
    expect(byCategory).not.toBe(destinations);
    expect(destinations.map((destination) => destination.id)).toEqual(originalOrder);
    expect(byRegion.map((destination) => destination.region)).toEqual([...byRegion.map((destination) => destination.region)].sort((a, b) => a.localeCompare(b, "ar")));
  });
});
