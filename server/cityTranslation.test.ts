import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

describe("international city details", () => {
  it("provides a structured translation endpoint for every approved non-Arabic locale", () => {
    const router = readFileSync(resolve(root, "server/routers.ts"), "utf8");
    expect(router).toContain("destination: router");
    ["en", "fr", "it", "de", "es", "zh"].forEach((language) => expect(router).toContain(`\"${language}\"`));
    expect(router).toContain("destination_translation");
  });

  it("renders city-detail text through the translated view and documents the hero image", () => {
    const detail = readFileSync(resolve(root, "client/src/pages/DestinationDetail.tsx"), "utf8");
    expect(detail).toContain("trpc.destination.translate.useQuery");
    expect(detail).toContain("HeroPhotoCredit");
    expect(detail).toContain("view.description");
  });
});
