import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

describe("translation governance and atlas photo layer", () => {
  it("keeps dedicated audit and public-suggestion data models", () => {
    const schema = readFileSync(resolve(root, "drizzle/schema.ts"), "utf8");
    expect(schema).toContain("translationAuditLogs");
    expect(schema).toContain("translationSuggestions");
    expect(schema).toContain('"suggestion_received"');
  });

  it("exposes audit and suggestion contracts with the review surface", () => {
    const router = readFileSync(resolve(root, "server/routers.ts"), "utf8");
    expect(router).toContain("translationReview: router");
    expect(router).toContain("suggestions: adminProcedure");
    expect(router).toContain("translationSuggestion: router");
    const page = readFileSync(resolve(root, "client/src/pages/TranslationReview.tsx"), "utf8");
    expect(page).toContain("سجل التدقيق");
    expect(page).toContain("اقتراحات الجمهور");
  });

  it("keeps public feedback and interactive atlas-layer components available", () => {
    expect(existsSync(resolve(root, "client/src/components/TranslationSuggestionForm.tsx"))).toBe(true);
    const atlas = readFileSync(resolve(root, "client/src/components/AtlasImageLayer.tsx"), "utf8");
    expect(atlas).toContain("atlasImageLabel");
    expect(atlas).toContain("atlas-photo-map");
    expect(existsSync("/home/ubuntu/skills/multilingual-tourism-localization/SKILL.md")).toBe(true);
  });
});
