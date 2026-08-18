import { describe, expect, it } from "vitest";
import { reorderStops } from "../client/src/contexts/tripUtils";

describe("reorderStops", () => {
  it("moves a saved experience before a destination while preserving the other stops", () => {
    expect(reorderStops(["ghadames", "heritage-leptis", "tripoli"], "heritage-leptis", "ghadames")).toEqual(["heritage-leptis", "ghadames", "tripoli"]);
  });

  it("keeps the original order when a source or target stop is unavailable", () => {
    const stops = ["ghadames", "heritage-leptis"];
    expect(reorderStops(stops, "unknown", "ghadames")).toBe(stops);
    expect(reorderStops(stops, "ghadames", "unknown")).toBe(stops);
  });
});
