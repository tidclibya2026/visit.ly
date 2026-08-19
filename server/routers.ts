import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storageGetSignedUrl, storagePut } from "./storage";
import { audioMimeTypes, fileExtensionForMime, safeAudioBuffer, splitTranslationCards } from "./assistantUtils";
import { destinations } from "../client/src/lib/content";
import { assignContentRole, createManagedDestination, createManagedExperience, createManagedSection, createMediaAsset, createTranslationReview, createVisaIntake, getContentAccess, getTranslationDashboardMetrics, listContentAccess, listManagedContent, listPublishedContent, listTranslationAuditLogs, listTranslationReviews, listTranslationSuggestions, listVisaIntakeHistory, listVisaIntakes, permissionAllows, recordInteraction, reviewTranslation, setContentPermission, submitTranslationSuggestion, updateManagedDestination, updateManagedExperience, updateManagedSection, updateTranslationSuggestion, updateVisaIntakeStatus } from "./db";

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

type ContentResource = "destinations" | "experiences" | "sections" | "media" | "visa" | "users";
type ContentAction = "create" | "edit" | "publish" | "review";
async function requireContentAction(ctx: { user: { openId: string; role: string } }, resource: ContentResource, action: ContentAction) {
  if (ctx.user.role === "admin") return;
  const access = await getContentAccess(ctx.user.openId, resource);
  if (!permissionAllows(access, action)) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك الصلاحية المطلوبة لهذه العملية." });
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
        void createTranslationReview({ destinationId: destination.id, language: input.language, sourceJson: JSON.stringify(source), machineJson: JSON.stringify(response) });
        return response;
      } catch {
        return { ...source, translated: false, language: input.language };
      }
    }),
  }),

  translationReview: router({
    list: adminProcedure.query(async () => listTranslationReviews()),
    audit: adminProcedure.input(z.object({ reviewId: z.number().int().positive().optional() })).query(async ({ input }) => listTranslationAuditLogs(input.reviewId)),
    suggestions: adminProcedure.query(async () => listTranslationSuggestions()),
    analytics: adminProcedure.query(async () => getTranslationDashboardMetrics()),
    update: adminProcedure.input(z.object({ id: z.number().int().positive(), editedJson: z.string().min(2).max(20000), status: z.enum(["approved", "needs_revision"]) })).mutation(async ({ ctx, input }) => {
      await reviewTranslation(input.id, input.editedJson, input.status, ctx.user.openId);
      return { ok: true };
    }),
    updateSuggestion: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["reviewed", "closed"]) })).mutation(async ({ ctx, input }) => {
      await updateTranslationSuggestion(input.id, input.status, ctx.user.openId);
      return { ok: true };
    }),
  }),

  translationSuggestion: router({
    submit: publicProcedure.input(z.object({ destinationId: z.string().min(2).max(64), language: z.enum(["ar", "en", "fr", "it", "de", "es", "zh"]), originalText: z.string().min(2).max(8000), suggestedText: z.string().min(2).max(8000), contextUrl: z.string().min(1).max(512) })).mutation(async ({ input }) => {
      await submitTranslationSuggestion(input);
      return { ok: true };
    }),
  }),

  interaction: router({
    track: publicProcedure.input(z.object({ eventType: z.enum(["destination_open", "atlas_marker_select", "language_switch"]), destinationId: z.string().min(2).max(64).optional(), language: z.enum(["ar", "en", "fr", "it", "de", "es", "zh"]), sessionKey: z.string().min(8).max(64) })).mutation(async ({ input }) => {
      await recordInteraction(input);
      return { ok: true };
    }),
  }),

  publishedContent: router({
    list: publicProcedure.query(async () => listPublishedContent()),
  }),

  contentAdmin: router({
    list: protectedProcedure.query(async ({ ctx }) => { if (ctx.user.role !== "admin") { const checks = await Promise.all((["destinations", "experiences", "sections", "media", "visa"] as ContentResource[]).map((resource) => getContentAccess(ctx.user.openId, resource))); if (!checks.some((access) => access?.role || access?.permission)) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية الوصول إلى إدارة المحتوى." }); } return listManagedContent(); }),
    access: adminProcedure.query(async () => listContentAccess()),
    assignRole: adminProcedure.input(z.object({ userOpenId: z.string().min(4).max(64), role: z.enum(["editor", "reviewer"]) })).mutation(async ({ ctx, input }) => { await assignContentRole(input, ctx.user.openId); return { ok: true }; }),
    setPermission: adminProcedure.input(z.object({ userOpenId: z.string().min(4).max(64), resource: z.enum(["destinations", "experiences", "sections", "media", "visa", "users"]), canCreate: z.boolean(), canEdit: z.boolean(), canPublish: z.boolean(), canReview: z.boolean() })).mutation(async ({ ctx, input }) => { await setContentPermission(input, ctx.user.openId); return { ok: true }; }),
    createDestination: protectedProcedure.input(z.object({ slug: z.string().regex(/^[a-z0-9-]+$/).max(96), title: z.string().min(2).max(255), city: z.string().min(2).max(160), region: z.string().min(2).max(160), category: z.enum(["city", "heritage", "nature", "coast"]), description: z.string().min(10).max(10000), imageUrl: z.string().max(768).nullable().optional(), status: z.enum(["draft", "published", "archived"]) })).mutation(async ({ ctx, input }) => { await requireContentAction(ctx, "destinations", input.status === "published" ? "publish" : "create"); await createManagedDestination(input, ctx.user.openId); return { ok: true }; }),
    updateDestination: protectedProcedure.input(z.object({ id: z.number().int().positive(), value: z.object({ slug: z.string().regex(/^[a-z0-9-]+$/).max(96), title: z.string().min(2).max(255), city: z.string().min(2).max(160), region: z.string().min(2).max(160), category: z.enum(["city", "heritage", "nature", "coast"]), description: z.string().min(10).max(10000), imageUrl: z.string().max(768).nullable().optional(), status: z.enum(["draft", "published", "archived"]) }) })).mutation(async ({ ctx, input }) => { await requireContentAction(ctx, "destinations", input.value.status === "published" ? "publish" : "edit"); await updateManagedDestination(input.id, input.value, ctx.user.openId); return { ok: true }; }),
    createExperience: protectedProcedure.input(z.object({ slug: z.string().regex(/^[a-z0-9-]+$/).max(96), title: z.string().min(2).max(255), destinationSlug: z.string().max(96).nullable().optional(), region: z.string().min(2).max(160), season: z.string().max(120).nullable().optional(), description: z.string().min(10).max(10000), imageUrl: z.string().max(768).nullable().optional(), status: z.enum(["draft", "published", "archived"]) })).mutation(async ({ ctx, input }) => { await requireContentAction(ctx, "experiences", input.status === "published" ? "publish" : "create"); await createManagedExperience(input, ctx.user.openId); return { ok: true }; }),
    updateExperience: protectedProcedure.input(z.object({ id: z.number().int().positive(), value: z.object({ slug: z.string().regex(/^[a-z0-9-]+$/).max(96), title: z.string().min(2).max(255), destinationSlug: z.string().max(96).nullable().optional(), region: z.string().min(2).max(160), season: z.string().max(120).nullable().optional(), description: z.string().min(10).max(10000), imageUrl: z.string().max(768).nullable().optional(), status: z.enum(["draft", "published", "archived"]) }) })).mutation(async ({ ctx, input }) => { await requireContentAction(ctx, "experiences", input.value.status === "published" ? "publish" : "edit"); await updateManagedExperience(input.id, input.value, ctx.user.openId); return { ok: true }; }),
    createSection: protectedProcedure.input(z.object({ slug: z.string().regex(/^[a-z0-9-]+$/).max(96), sectionType: z.enum(["festival", "culture", "heritage", "travel", "custom"]), title: z.string().min(2).max(255), summary: z.string().min(10).max(10000), imageUrl: z.string().max(768).nullable().optional(), status: z.enum(["draft", "published", "archived"]) })).mutation(async ({ ctx, input }) => { await requireContentAction(ctx, "sections", input.status === "published" ? "publish" : "create"); await createManagedSection(input, ctx.user.openId); return { ok: true }; }),
    updateSection: protectedProcedure.input(z.object({ id: z.number().int().positive(), value: z.object({ slug: z.string().regex(/^[a-z0-9-]+$/).max(96), sectionType: z.enum(["festival", "culture", "heritage", "travel", "custom"]), title: z.string().min(2).max(255), summary: z.string().min(10).max(10000), imageUrl: z.string().max(768).nullable().optional(), status: z.enum(["draft", "published", "archived"]) }) })).mutation(async ({ ctx, input }) => { await requireContentAction(ctx, "sections", input.value.status === "published" ? "publish" : "edit"); await updateManagedSection(input.id, input.value, ctx.user.openId); return { ok: true }; }),
    uploadImage: protectedProcedure.input(z.object({ fileName: z.string().min(1).max(160), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]), dataBase64: z.string().min(16).max(7_000_000), altText: z.string().min(3).max(500), sourceLabel: z.string().min(3).max(255), caption: z.string().max(5000).nullable().optional() })).mutation(async ({ ctx, input }) => {
      await requireContentAction(ctx, "media", "create");
      const encoded = input.dataBase64.includes(",") ? input.dataBase64.split(",").pop()! : input.dataBase64;
      const bytes = Buffer.from(encoded, "base64");
      if (!bytes.length || bytes.length > 5_000_000) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب أن تكون الصورة صالحة وأقل من 5 ميغابايت." });
      const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      const stored = await storagePut(`admin-media/${ctx.user.openId}/${Date.now()}-${safeName}`, bytes, input.mimeType);
      await createMediaAsset({ storageKey: stored.key, url: stored.url, altText: input.altText, sourceLabel: input.sourceLabel, caption: input.caption, mimeType: input.mimeType }, ctx.user.openId);
      return { url: stored.url };
    }),
  }),

  visa: router({
    submitIntake: publicProcedure.input(z.object({ fullName: z.string().min(2).max(255), email: z.string().email().max(320), nationality: z.string().min(2).max(120), residenceCountry: z.string().min(2).max(120), travelPurpose: z.string().min(2).max(255), intendedArrival: z.string().max(32).nullable().optional(), notes: z.string().max(3000).nullable().optional(), consent: z.literal(true) })).mutation(async ({ input }) => {
      const referenceCode = `VL-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
      await createVisaIntake({ ...input, referenceCode });
      return { referenceCode, status: "received" as const, officialReferral: "pending_official_channel" as const };
    }),
    listIntakes: protectedProcedure.query(async ({ ctx }) => { await requireContentAction(ctx, "visa", "review"); return listVisaIntakes(); }),
    history: protectedProcedure.input(z.object({ intakeId: z.number().int().positive().optional() })).query(async ({ ctx, input }) => { await requireContentAction(ctx, "visa", "review"); return listVisaIntakeHistory(input.intakeId); }),
    updateIntakeStatus: protectedProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["received", "under_review", "awaiting_information", "ready_for_official_referral", "closed"]), note: z.string().max(3000).nullable().optional() })).mutation(async ({ ctx, input }) => { await requireContentAction(ctx, "visa", "review"); await updateVisaIntakeStatus(input.id, input.status, ctx.user.openId, input.note); return { ok: true }; }),
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
