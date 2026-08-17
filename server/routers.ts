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

  assistant: router({
    translate: publicProcedure.input(z.object({
      question: z.string().min(2).max(800),
      answer: z.string().min(2).max(10000),
    targetLanguage: z.enum(["en", "fr"]),
  })).mutation(async ({ input }) => {
      const languageLabel = input.targetLanguage === "en" ? "English" : "French";
      const sourceAnswer = input.answer.length > 3_800
        ? `${input.answer.slice(0, 3_800)}\n\n[The source continues with additional details. Give visitors a concise overview of the material provided.]`
        : input.answer;
      try {
        const result = await withTimeout(invokeLLM({
          model: "gpt-5-nano",
          messages: [
            { role: "system", content: `You translate official Libyan tourism knowledge from Arabic to ${languageLabel}. Produce a faithful, concise visitor summary in 2 to 6 short paragraphs of no more than 100 words each. Preserve essential travel guidance, names, dates, places, and safety information from the source supplied. Do not invent or change facts. Return only the translated answer: no JSON, markdown headings, labels, or commentary.` },
            { role: "user", content: `Question:\n${input.question}\n\nSource answer:\n${sourceAnswer}` },
          ],
        }), 25_000);
        const content = result.choices[0]?.message?.content;
        if (typeof content !== "string" || !content.trim()) throw new Error("empty_translation");
        const cards = splitTranslationCards(content);
        if (!cards.length) throw new Error("empty_translation_cards");
        return { language: input.targetLanguage, question: input.question, cards, translated: true };
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
      language: z.enum(["ar", "en", "fr"]),
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
