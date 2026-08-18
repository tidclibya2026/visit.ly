import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storageGetSignedUrl, storagePut } from "./storage";
import { audioMimeTypes, fileExtensionForMime, safeAudioBuffer, splitTranslationCards } from "./assistantUtils";
import { destinations } from "../client/src/lib/content";

const translatedLanguages = ["en", "fr", "it", "de", "es", "zh"] as const;
const languageLabels = { en: "English", fr: "French", it: "Italian", de: "German", es: "Spanish", zh: "Simplified Chinese" } as const;
const destinationTranslationCache = new Map<string, unknown>();
const destinationActivityMap: Record<string, string[]> = {
  tripoli: ["جولة مشي هادئة في الأزقة والأسواق", "التوقف عند قوس ماركوس أوريليوس", "قراءة الواجهة البحرية والسرايا الحمراء"],
  benghazi: ["التنزه على الواجهة البحرية", "اكتشاف الذاكرة الحضرية للمدينة", "إدراجها كبداية لمسار الجبل الأخضر"],
  ghadames: ["استكشاف الممرات المظللة", "التعرف إلى منطق البيت الواحي", "زيارة الحِرف والأسواق المحلية مع مرشد"],
  acacus: ["سفاري منظم مع مرشد محلي", "قراءة الفن الصخري والتكوينات", "التخييم ضمن ترتيب آمن ومسبق"],
  leptis: ["المشي عبر الساحات والأقواس", "تتبع تخطيط المدينة الأثرية", "التوقف عند المشاهد الساحلية القريبة"],
  shahat: ["زيارة المعابد والمدرجات الكلاسيكية", "دمج قورينا مع مسار الجبل الأخضر", "قراءة الطبيعة والآثار في رحلة واحدة"],
  sabratha: ["التأمل في المسرح الأثري", "اتباع مسار المدينة الرومانية", "التوقف عند المشهد الساحلي"],
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("translation_timeout")), timeoutMs);
    promise.then(
      (result) => { clearTimeout(timer); resolve(result); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  destination: router({
    translate: publicProcedure.input(z.object({ id: z.string().min(2).max(64), language: z.enum(translatedLanguages) })).query(async ({ input }) => {
      const destination = destinations.find((item) => item.id === input.id);
      if (!destination) throw new TRPCError({ code: "NOT_FOUND", message: "الوجهة غير متاحة." });
      const cacheKey = `${input.id}:${input.language}`;
      const cached = destinationTranslationCache.get(cacheKey);
      if (cached) return cached;
      const activities = destinationActivityMap[destination.id] ?? destination.highlights;
      const source = {
        title: destination.title, city: destination.city, landmarkType: destination.landmarkType, region: destination.region, time: destination.time,
        description: destination.description, fieldNote: destination.fieldNote, highlights: destination.highlights, activities,
        gallery: destination.gallery.map((item) => ({ caption: item.caption, location: item.location })),
      };
      try {
        const result = await withTimeout(invokeLLM({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: `You translate official Libyan tourism content from Arabic to ${languageLabels[input.language]}. Preserve official place names where useful, locations, coordinates, travel guidance, and factual meaning. Do not invent facts or add booking claims. Translate all fields faithfully and concisely. Return JSON matching the supplied schema only.` },
            { role: "user", content: JSON.stringify(source) },
          ],
          response_format: { type: "json_schema", json_schema: { name: "destination_translation", strict: true, schema: { type: "object", properties: { title: { type: "string" }, city: { type: "string" }, landmarkType: { type: "string" }, region: { type: "string" }, time: { type: "string" }, description: { type: "string" }, fieldNote: { type: "string" }, highlights: { type: "array", items: { type: "string" } }, activities: { type: "array", items: { type: "string" } }, gallery: { type: "array", items: { type: "object", properties: { caption: { type: "string" }, location: { type: "string" } }, required: ["caption", "location"], additionalProperties: false } } }, required: ["title", "city", "landmarkType", "region", "time", "description", "fieldNote", "highlights", "activities", "gallery"], additionalProperties: false } } },
        }), 35_000);
        const content = result.choices[0]?.message?.content;
        if (typeof content !== "string") throw new Error("empty_destination_translation");
        const translated = JSON.parse(content);
        const response = { ...translated, translated: true, language: input.language };
        destinationTranslationCache.set(cacheKey, response);
        return response;
      } catch {
        return { ...source, translated: false, language: input.language };
      }
    }),
  }),

  assistant: router({
    translate: publicProcedure.input(z.object({
      question: z.string().min(2).max(800),
      answer: z.string().min(2).max(10000),
    targetLanguage: z.enum(["en", "fr", "it", "de", "es", "zh"]),
  })).mutation(async ({ input }) => {
      const languageLabel = ({ en: "English", fr: "French", it: "Italian", de: "German", es: "Spanish", zh: "Simplified Chinese" } as const)[input.targetLanguage];
      const sourceAnswer = input.answer.length > 3_800
        ? `${input.answer.slice(0, 3_800)}\n\n[The source continues with additional details. Give visitors a concise overview of the material provided.]`
        : input.answer;
      try {
        const result = await withTimeout(invokeLLM({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: `You translate official Libyan tourism knowledge from Arabic to ${languageLabel}. Translate the question and produce a faithful, concise visitor answer in 2 to 6 short cards. Preserve essential travel guidance, names, dates, places, and safety information from the source. Do not invent facts or add claims. Return JSON matching the supplied schema only.` },
            { role: "user", content: `Question:\n${input.question}\n\nSource answer:\n${sourceAnswer}` },
          ],
          response_format: { type: "json_schema", json_schema: { name: "assistant_translation", strict: true, schema: { type: "object", properties: { question: { type: "string" }, cards: { type: "array", items: { type: "string" } } }, required: ["question", "cards"], additionalProperties: false } } },
        }), 25_000);
        const content = result.choices[0]?.message?.content;
        if (typeof content !== "string" || !content.trim()) throw new Error("empty_translation");
        const parsed = JSON.parse(content) as { question?: string; cards?: string[] };
        const cards = Array.isArray(parsed.cards) ? parsed.cards.map((card) => card.trim()).filter(Boolean) : [];
        if (!cards.length) throw new Error("empty_translation_cards");
        return { language: input.targetLanguage, question: parsed.question?.trim() || input.question, cards, translated: true };
      } catch {
        return {
          language: input.targetLanguage,
          question: input.question,
          cards: splitTranslationCards(input.answer),
          translated: false,
        };
      }
    }),
    transcribe: publicProcedure.input(z.object({
      audioBase64: z.string().min(1),
      mimeType: z.enum(audioMimeTypes),
      language: z.enum(["ar", "en", "fr", "it", "de", "es", "zh"]),
    })).mutation(async ({ input }) => {
      let audio: Buffer;
      try {
        audio = safeAudioBuffer(input.audioBase64);
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST", message: "يرجى إرسال تسجيل صوتي صالح وأقل من 10 ميغابايت." });
      }
      const ext = fileExtensionForMime(input.mimeType);
      const uploaded = await storagePut(`voice-assistant/${Date.now()}.${ext}`, audio, input.mimeType);
      const audioUrl = await storageGetSignedUrl(uploaded.key);
      const result = await transcribeAudio({ audioUrl, language: input.language, prompt: "Libya tourism destinations, heritage, visas, food, culture and travel." });
      if ("error" in result) {
        throw new TRPCError({ code: "BAD_GATEWAY", message: "تعذر تفريغ التسجيل الصوتي. جرّب مقطعًا أقصر أو اكتب السؤال." });
      }
      return { text: result.text?.trim() ?? "", language: result.language ?? input.language };
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
