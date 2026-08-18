import { describe, expect, it } from "vitest";
import { curatedFaqEntries } from "../client/src/lib/assistantFaqs";
import { localizedFaqs } from "../client/src/components/KnowledgeAssistant";

describe("expanded assistant knowledge", () => {
  it("includes curated food, culture, and folklore guidance", () => {
    expect(curatedFaqEntries).toHaveLength(3);
    expect(curatedFaqEntries.map((entry) => entry.category)).toEqual(["الأكلات الليبية", "الثقافة والتراث", "الفلكلور والمناسبات"]);
    curatedFaqEntries.forEach((entry) => expect(entry.answer.length).toBeGreaterThan(100));
  });

  it("offers direct English and French answers for the curated questions", () => {
    curatedFaqEntries.forEach((entry) => {
      const localized = localizedFaqs.find((item) => item.source === entry.question);
      expect(localized?.en).toBeTruthy();
      expect(localized?.fr).toBeTruthy();
      expect(localized?.enCards.length).toBeGreaterThan(0);
      expect(localized?.frCards.length).toBeGreaterThan(0);
    });
  });

  it("exposes all seven language options through the shared language context", async () => {
    const languageContext = await import("../client/src/contexts/LanguageContext");
    expect(languageContext.languageOptions.map((item) => item.code)).toEqual(["ar", "en", "fr", "it", "de", "es", "zh"]);
  });
});
