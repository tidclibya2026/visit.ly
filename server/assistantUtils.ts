export const assistantLanguages = ["ar", "en", "fr"] as const;
export type AssistantLanguage = (typeof assistantLanguages)[number];

export const audioMimeTypes = ["audio/webm", "audio/ogg", "audio/wav", "audio/mpeg", "audio/mp4"] as const;
export type AudioMimeType = (typeof audioMimeTypes)[number];

export function fileExtensionForMime(mimeType: AudioMimeType) {
  const extensions: Record<AudioMimeType, string> = {
    "audio/webm": "webm",
    "audio/ogg": "ogg",
    "audio/wav": "wav",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
  };
  return extensions[mimeType];
}

export function safeAudioBuffer(base64: string, maxBytes = 10 * 1024 * 1024) {
  const normalized = base64.replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(normalized, "base64");
  if (!buffer.length || buffer.length > maxBytes) throw new Error("invalid_audio_size");
  return buffer;
}

export function splitTranslationCards(text: string, maxCards = 6, maxLength = 420) {
  const paragraphs = text
    .replace(/\r/g, "")
    .split(/\n{1,}/)
    .map((item) => item.replace(/^\s*(?:[-•*]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
  const source = paragraphs.length ? paragraphs : [text.trim()];
  const cards: string[] = [];

  for (const paragraph of source) {
    if (paragraph.length <= maxLength) {
      cards.push(paragraph);
      continue;
    }

    let current = "";
    for (const word of paragraph.split(/\s+/)) {
      const next = `${current} ${word}`.trim();
      if (next.length > maxLength && current) {
        cards.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) cards.push(current);
  }

  return cards.filter(Boolean).slice(0, maxCards);
}
