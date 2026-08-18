import { describe, expect, it } from "vitest";
import { buildSharedRouteUrl, parseSharedStops } from "../client/src/contexts/tripSharing";

describe("trip sharing helpers", () => {
  it("builds a share URL with a deduplicated route", () => {
    const link = buildSharedRouteUrl("https://visit.example/trip?ref=guide", ["tripoli", "leptis", "tripoli"]);
    expect(link).toBe("https://visit.example/trip?ref=guide&route=tripoli%2Cleptis");
  });

  it("parses a shared route without blank or repeated stops", () => {
    expect(parseSharedStops("tripoli,,leptis,tripoli")).toEqual(["tripoli", "leptis"]);
  });
});
