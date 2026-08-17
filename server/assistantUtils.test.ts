import { describe, expect, it } from "vitest";
import { fileExtensionForMime, safeAudioBuffer, splitTranslationCards } from "./assistantUtils";

describe("assistant voice utilities", () => {
  it("maps supported voice types to a stable file extension", () => {
    expect(fileExtensionForMime("audio/webm")).toBe("webm");
    expect(fileExtensionForMime("audio/mpeg")).toBe("mp3");
  });

  it("decodes a compact base64 recording and rejects empty audio", () => {
    expect(safeAudioBuffer(Buffer.from("visit-libya").toString("base64")).toString()).toBe("visit-libya");
    expect(() => safeAudioBuffer("")).toThrow("invalid_audio_size");
  });

  it("converts a plain-language model response into readable cards", () => {
    expect(splitTranslationCards("• Coastal walks and heritage sites.\n\n• Visit the old city markets.")).toEqual([
      "Coastal walks and heritage sites.",
      "Visit the old city markets.",
    ]);
  });

  it("splits an overlong translation while preserving all of its words", () => {
    const cards = splitTranslationCards("Libya ".repeat(120));
    expect(cards.length).toBeGreaterThan(1);
    expect(cards.every((card) => card.length <= 420)).toBe(true);
    expect(cards.join(" ").split(" ").filter(Boolean)).toHaveLength(120);
  });
});
