/**
 * Design reminder — «دفاتر الرحّالة»: المساعد محطة قراءة ميدانية، يقدّم بطاقات قصيرة
 * من بنك المعرفة المرفق مع مرشحات واضحة، ولا يدّعي معرفة أو خدمة خارجية.
 */
import { ArrowLeft, BookOpen, ChevronDown, Globe2, Loader2, MapPin, MessageCircle, Mic, Search, Send, Sparkles, Square, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { destinations } from "@/lib/content";
import { faqEntries, type FaqEntry } from "@/lib/faqData";
import { trpc } from "@/lib/trpc";

const topics = ["الكل", "التأشيرات", "الوجهات", "الثقافة والتراث", "الطعام", "السفر العملي"] as const;
type Topic = typeof topics[number];
type AssistantLocale = "ar" | "en" | "fr";
type Translation = { language: Exclude<AssistantLocale, "ar">; question: string; cards: string[]; translated: boolean };
type LocalizedFaq = { source: string; topic: Exclude<Topic, "الكل">; en: string; fr: string; enCards: string[]; frCards: string[] };

const localizedFaqs: LocalizedFaq[] = [
  { source: "ما الذي يميز مدينة بنغازي سياحياً؟", topic: "الوجهات", en: "What makes Benghazi a tourism destination?", fr: "Qu'est-ce qui distingue Benghazi comme destination touristique ?", enCards: ["Benghazi is a Mediterranean coastal city and a cultural gateway to eastern Libya.", "Its waterfront and urban heritage can be combined with onward exploration of the Green Mountain and Cyrene. Confirm local arrangements and current conditions before travel."], frCards: ["Benghazi est une ville côtière méditerranéenne et une porte culturelle vers l'est de la Libye.", "Son front de mer et son patrimoine urbain peuvent s'associer à la découverte du Djebel Akhdar et de Cyrène. Confirmez les modalités locales et les conditions actuelles avant le voyage."] },
  { source: "ما أشهر الشواطئ في ليبيا؟ وما الذي يجب أن يعرفه ويُتوقعه السائح قبل زيارتها؟", topic: "الوجهات", en: "Which beaches are notable in Libya, and what should visitors know?", fr: "Quelles plages sont remarquables en Libye et que faut-il savoir avant de les visiter ?", enCards: ["Libya's Mediterranean coast offers beaches and waterfronts in several regions, with conditions and visitor services varying by place and season.", "Confirm access, weather, local guidance, and available services before setting out. Respect local customs and follow safety directions at the site."], frCards: ["La côte méditerranéenne libyenne offre des plages et des fronts de mer dans plusieurs régions ; les conditions et les services varient selon le lieu et la saison.", "Confirmez l'accès, la météo, les conseils locaux et les services disponibles avant de partir. Respectez les usages locaux et les consignes de sécurité sur place."] },
  { source: "ما أفضل مدن الصحراء الليبية للرحلات؟ وما أهم النصائح والمعلومات للسائح قبل الزيارة؟", topic: "الوجهات", en: "Which Libyan desert destinations suit organized trips?", fr: "Quelles destinations désertiques libyennes conviennent aux voyages organisés ?", enCards: ["Ghadames offers oasis architecture and historic lanes, while Tadrart Acacus is known for desert landscapes, rock formations, and rock art.", "Desert itineraries require advance organization, suitable transport, local specialists, and seasonal planning. The cooler months are generally more suitable for desert routes."], frCards: ["Ghadames propose une architecture d'oasis et des ruelles historiques, tandis que le Tadrart Acacus est connu pour ses paysages désertiques, ses formations rocheuses et son art rupestre.", "Les itinéraires désertiques exigent une organisation préalable, un transport adapté, des spécialistes locaux et une planification saisonnière. Les mois plus frais sont généralement plus adaptés aux routes du désert."] },
  { source: "هل يمكن الحصول على التأشيرة عند الوصول بشكل مبسط أو بشكل تفصيلي؟", topic: "التأشيرات", en: "Can a visa be obtained on arrival?", fr: "Peut-on obtenir un visa à l'arrivée ?", enCards: ["Visa and entry requirements can change. Do not rely on an on-arrival visa without confirmation from the relevant official authority.", "Arrange documents in advance and check the official visa channel or your accredited travel organizer before booking travel."], frCards: ["Les conditions de visa et d'entrée peuvent changer. Ne comptez pas sur un visa à l'arrivée sans confirmation de l'autorité officielle compétente.", "Préparez les documents à l'avance et vérifiez le canal officiel des visas ou votre organisateur de voyage accrédité avant de réserver."] },
  { source: "س: ما الذي يجب معرفته قبل الوصول إلى ليبيا من الناحية الأمنية؟", topic: "السفر العملي", en: "What should travelers know about practical safety before arriving in Libya?", fr: "Que faut-il savoir sur la sécurité pratique avant d'arriver en Libye ?", enCards: ["Check official travel advice shortly before departure and coordinate your route, accommodation, and local contact in advance.", "Use a reliable local operator for remote routes, remain aware of local conditions, and keep communication and contingency arrangements in place."], frCards: ["Consultez les conseils officiels aux voyageurs peu avant le départ et coordonnez à l'avance votre itinéraire, votre hébergement et votre contact local.", "Faites appel à un opérateur local fiable pour les itinéraires éloignés, restez attentif aux conditions locales et prévoyez des moyens de communication et de secours."] },
];

function normalize(value: string) {
  return value.toLocaleLowerCase("ar").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function topicFor(entry: FaqEntry): Exclude<Topic, "الكل"> {
  const questionAndCategory = normalize(`${entry.question} ${entry.category}`);
  if (/(تاشير|جواز|وصول|دخول|اقامه)/.test(questionAndCategory)) return "التأشيرات";
  if (/(طعام|اكل|مطبخ|كسكسي|بازين|مطعم|مائده)/.test(questionAndCategory)) return "الطعام";
  if (/(تراث|ثقاف|مهرجان|فلكلور|حرف|صناعات|موسيقى|فروسي|اعراس|عادات|تقاليد)/.test(questionAndCategory)) return "الثقافة والتراث";
  if (/(طرابلس|بنغازي|غدامس|لبده|شحات|قورينا|صبراته|شواطئ|اثار|صحراء|اكاكوس|جبل)/.test(questionAndCategory)) return "الوجهات";
  return "السفر العملي";
}

function rankEntries(query: string, entries: FaqEntry[]): FaqEntry[] {
  const tokens = normalize(query).split(" ").filter((token) => token.length > 1);
  if (!tokens.length) return entries.slice(0, 5);
  return entries.map((entry) => {
    const question = normalize(entry.question);
    const category = normalize(entry.category);
    const answer = normalize(entry.answer);
    const score = tokens.reduce((total, token) => total + (question.includes(token) ? 5 : 0) + (category.includes(token) ? 2 : 0) + (answer.includes(token) ? 1 : 0), 0);
    return { entry, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 5).map(({ entry }) => entry);
}

function answerCards(answer: string) {
  const paragraphs = answer.replace(/\s+(\d+[.)])/g, "\n$1").split(/\n{1,}/).map((item) => item.trim()).filter((item) => item.length > 40);
  const source = paragraphs.length ? paragraphs : [answer];
  return source.flatMap((item) => {
    if (item.length <= 460) return [item];
    const words = item.split(" ");
    const cards: string[] = [];
    let current = "";
    words.forEach((word) => {
      if (`${current} ${word}`.trim().length > 420) { cards.push(current.trim()); current = word; } else current = `${current} ${word}`.trim();
    });
    if (current) cards.push(current);
    return cards;
  }).slice(0, 6);
}

export function KnowledgeAssistant() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic>("الكل");
  const [selected, setSelected] = useState<FaqEntry | null>(null);
  const [locale, setLocale] = useState<AssistantLocale>("ar");
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [translationError, setTranslationError] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const translateMutation = trpc.assistant.translate.useMutation();
  const transcribeMutation = trpc.assistant.transcribe.useMutation();
  const scopedEntries = useMemo(() => topic === "الكل" ? faqEntries : faqEntries.filter((entry) => topicFor(entry) === topic), [topic]);
  const results = useMemo(() => rankEntries(query, scopedEntries), [query, scopedEntries]);
  const localizedResults = useMemo(() => localizedFaqs.filter((item) => (topic === "الكل" || item.topic === topic) && (!query.trim() || (locale === "en" ? item.en : item.fr).toLowerCase().includes(query.trim().toLowerCase()))).map((item) => ({ item, entry: faqEntries.find((entry) => normalize(entry.question) === normalize(item.source)) })).filter((item): item is { item: LocalizedFaq; entry: FaqEntry } => Boolean(item.entry)), [locale, query, topic]);
  const cards = selected ? (translation?.cards ?? answerCards(selected.answer)) : [];
  const question = selected ? (translation?.question ?? selected.question) : "";
  const relatedDestinations = useMemo(() => {
    if (!selected) return [];
    const hasDestination = (source: string, destination: typeof destinations[number]) => [destination.title, destination.city].some((term) => source.includes(normalize(term)));
    const questionMatches = destinations.filter((destination) => hasDestination(normalize(selected.question), destination));
    if (questionMatches.length) return questionMatches.slice(0, 2);
    return destinations.filter((destination) => hasDestination(normalize(selected.answer), destination)).slice(0, 2);
  }, [selected]);
  const languageStatus = locale === "ar" ? "إجابة المصدر بالعربية" : locale === "en" ? "ترجمة موجزة إلى الإنجليزية" : "ترجمة موجزة إلى الفرنسية";

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const translateEntry = (entry: FaqEntry, nextLocale: AssistantLocale) => {
    setTranslation(null);
    setTranslationError("");
    if (nextLocale === "ar") return;
    translateMutation.mutate(
      { question: entry.question, answer: entry.answer, targetLanguage: nextLocale },
      {
        onSuccess: (data) => {
          setTranslation(data);
          if (!data.translated) setTranslationError("تعذرت الترجمة الآن؛ نعرض الإجابة العربية الأصلية.");
        },
        onError: () => setTranslationError("تعذرت الترجمة الآن؛ نعرض الإجابة العربية الأصلية."),
      },
    );
  };

  const choose = (entry: FaqEntry) => {
    setSelected(entry);
    const localized = localizedFaqs.find((item) => normalize(item.source) === normalize(entry.question));
    if (localized && locale !== "ar") {
      setQuery(locale === "en" ? localized.en : localized.fr);
      setTranslationError("");
      setTranslation({ language: locale, question: locale === "en" ? localized.en : localized.fr, cards: locale === "en" ? localized.enCards : localized.frCards, translated: true });
      return;
    }
    setQuery(entry.question);
    translateEntry(entry, locale);
  };
  const chooseTopic = (next: Topic) => { setTopic(next); setQuery(""); setSelected(null); setTranslation(null); };
  const chooseLocale = (nextLocale: AssistantLocale) => { setLocale(nextLocale); if (selected) translateEntry(selected, nextLocale); };
  const stopRecording = () => recorderRef.current?.state === "recording" && recorderRef.current.stop();
  const startRecording = async () => {
    setVoiceError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setVoiceError("لا يدعم هذا المتصفح التسجيل الصوتي. اكتب سؤالك مباشرة."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: mimeType });
        if (blob.size > 10 * 1024 * 1024) { setVoiceError("التسجيل طويل جدًا. سجّل سؤالًا أقصر من فضلك."); return; }
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = String(reader.result).split(",")[1] ?? "";
          transcribeMutation.mutate({ audioBase64: base64, mimeType: mimeType as "audio/webm" | "audio/ogg", language: locale }, { onSuccess: (data) => { setQuery(data.text); setSelected(null); }, onError: () => setVoiceError("تعذر تفريغ الصوت. جرّب مرة أخرى أو اكتب السؤال.") });
        };
        reader.readAsDataURL(blob);
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setVoiceError("لم يتم منح إذن الميكروفون. يمكنك كتابة السؤال بدلًا من ذلك.");
    }
  };

  return <aside className={`knowledge-assistant ${open ? "is-open" : ""}`} aria-label="المساعد المعرفي">
    {open && <div className="assistant-panel">
      <div className="assistant-head"><div><p className="eyebrow light"><Sparkles size={13} /> مساعد Visit Libya</p><h2>اسأل دليل الرحلة.</h2><p>بحث داخل بنك المعرفة المرفق، مع أسئلة شائعة قصيرة بالإنجليزية والفرنسية وروابط للوجهات المرتبطة حين تتوفر.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="إغلاق المساعد"><X size={19} /></button></div>
      <div className="assistant-language-bar" aria-label="لغة الإجابة"><Globe2 size={14} />{(["ar", "en", "fr"] as AssistantLocale[]).map((item) => <button type="button" className={locale === item ? "is-active" : ""} onClick={() => chooseLocale(item)} key={item}>{item === "ar" ? "العربية" : item === "en" ? "English" : "Français"}</button>)}</div>
      <p className="assistant-language-status">{languageStatus}{locale !== "ar" ? " · الأسئلة الشائعة تعرض بطاقات مترجمة مباشرة" : ""}</p>
      <div className="assistant-topic-bar" aria-label="تصفية موضوع المساعد">{topics.map((item) => <button type="button" className={topic === item ? "is-active" : ""} onClick={() => chooseTopic(item)} key={item}>{item}</button>)}</div>
      <div className="assistant-query-row"><label className="assistant-search"><Search size={17} /><span className="sr-only">اكتب سؤالك</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); setTranslation(null); }} onKeyDown={(event) => { if (event.key === "Enter" && results[0]) choose(results[0]); }} placeholder={locale === "ar" ? "مثال: ما أبرز معالم بنغازي؟" : locale === "en" ? "Ask about Libya…" : "Posez une question sur la Libye…"} /><button type="button" onClick={() => results[0] && choose(results[0])} aria-label="ابحث"><Send size={16} /></button></label><button type="button" className={`assistant-mic ${recording ? "is-recording" : ""}`} onClick={recording ? stopRecording : startRecording} disabled={transcribeMutation.isPending} aria-label={recording ? "إيقاف التسجيل" : "سجّل سؤالًا صوتيًا"}>{transcribeMutation.isPending ? <Loader2 size={17} className="spin" /> : recording ? <Square size={15} /> : <Mic size={17} />}</button></div>{voiceError && <p className="assistant-voice-error">{voiceError}</p>}
      {selected ? <div className="assistant-answer"><div className="assistant-answer-meta"><BookOpen size={15} /><span>{topicFor(selected)}</span><button type="button" onClick={() => { setSelected(null); setQuery(""); setTranslation(null); setTranslationError(""); }}>كل الإجابات</button></div><h3>{question}</h3>{translateMutation.isPending ? <p className="assistant-translating"><Loader2 size={15} className="spin" /> جارٍ تجهيز الترجمة…</p> : <><div className="assistant-card-stack">{cards.map((card, index) => <article key={`${selected.question}-${index}`}><span>بطاقة {index + 1}</span><p>{card}</p></article>)}</div>{translationError && <p className="assistant-translation-note" role="status">{translationError}</p>}</>}{relatedDestinations.length > 0 && <nav className="assistant-place-links" aria-label="وجهات مرتبطة بالإجابة"><span><MapPin size={13} /> وجهات مرتبطة</span>{relatedDestinations.map((destination) => <Link href={`/destinations/${destination.id}`} key={destination.id}>{destination.title}<ArrowLeft size={13} /></Link>)}</nav>}{selected.answer.length > cards.join(" ").length && locale === "ar" && <span className="assistant-truncated">اختُصرت الإجابة الطويلة إلى بطاقات قراءة؛ استخدم صياغة أكثر تحديدًا لتضييق البحث.</span>}</div> : <div className="assistant-results"><p className="assistant-label">{query ? "Frequently asked questions" : locale === "ar" ? `أسئلة ${topic === "الكل" ? "للبدء" : topic}` : "Choose a verified question to translate from the source bank."}</p>{locale === "ar" ? (results.length ? results.map((entry) => <button type="button" key={entry.question} onClick={() => choose(entry)}><small>{topicFor(entry)}</small><span>{entry.question}</span><ChevronDown size={16} /></button>) : <p className="assistant-empty">لم أجد تطابقًا مباشرًا ضمن هذا الموضوع. جرّب اسم مدينة أو معلم أو فئة أخرى.</p>) : (localizedResults.length ? localizedResults.map(({ item, entry }) => <button type="button" key={item.source} onClick={() => choose(entry)}><small>{item.topic}</small><span>{locale === "en" ? item.en : item.fr}</span><ChevronDown size={16} /></button>) : <p className="assistant-empty">No matching translated FAQ is available in this topic. Choose another topic or return to Arabic search.</p>)}</div>}
      <div className="assistant-foot"><span>مصدر المعرفة: ملف الأسئلة والأجوبة المرفق.</span><span>راجِع الجهات الرسمية للتحديثات.</span></div>
    </div>}
    <button type="button" className="assistant-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={open}><MessageCircle size={21} /><span>{open ? "إخفاء المساعد" : "اسأل الدليل"}</span></button>
  </aside>;
}
