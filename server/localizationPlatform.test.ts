import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { atlasImageLabel } from "../client/src/lib/atlasLabels";

const root = resolve(import.meta.dirname, "..");

describe("localized platform operations", () => {
  it("keeps a persisted seven-language preference with flag metadata", () => {
    const context = readFileSync(resolve(root, "client/src/contexts/LanguageContext.tsx"), "utf8");
    expect(context).toContain("visit-libya-language");
    ["🇱🇾", "🇬🇧", "🇫🇷", "🇮🇹", "🇩🇪", "🇪🇸", "🇨🇳"].forEach((flag) => expect(context).toContain(flag));
  });

  it("registers language-prefixed routes and an admin translation-review route", () => {
    const app = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");
    expect(app).toContain('/admin/translations');
    expect(app).toContain('/:locale/destinations/:id');
    const review = readFileSync(resolve(root, "client/src/pages/TranslationReview.tsx"), "utf8");
    expect(review).toContain("translationReview.list");
    expect(review).toContain("user?.role !== \"admin\"");
  });

  it("creates stable atlas labels for documented gallery photographs", () => {
    expect(atlasImageLabel({ destinationId: "tripoli", destinationTitle: "طرابلس", photoIndex: 0, location: "المدينة القديمة", coordinates: "32.887°N · 13.180°E" })).toBe("VL-TRIPOLI-01-32.887°N-13.180°E");
  });
});
