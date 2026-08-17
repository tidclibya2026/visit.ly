/**
 * Design reminder — «دفاتر الرحّالة»: المساعد محطة قراءة ميدانية، يقدّم بطاقات قصيرة
 * من بنك المعرفة المرفق مع مرشحات واضحة، ولا يدّعي معرفة أو خدمة خارجية.
 */
import { BookOpen, ChevronDown, MessageCircle, Search, Send, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { faqEntries, type FaqEntry } from "@/lib/faqData";

const topics = ["الكل", "التأشيرات", "الوجهات", "الثقافة والتراث", "الطعام", "السفر العملي"] as const;
type Topic = typeof topics[number];

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
  const scopedEntries = useMemo(() => topic === "الكل" ? faqEntries : faqEntries.filter((entry) => topicFor(entry) === topic), [topic]);
  const results = useMemo(() => rankEntries(query, scopedEntries), [query, scopedEntries]);
  const cards = selected ? answerCards(selected.answer) : [];

  const choose = (entry: FaqEntry) => { setQuery(entry.question); setSelected(entry); };
  const chooseTopic = (next: Topic) => { setTopic(next); setQuery(""); setSelected(null); };

  return <aside className={`knowledge-assistant ${open ? "is-open" : ""}`} aria-label="المساعد المعرفي">
    {open && <div className="assistant-panel">
      <div className="assistant-head"><div><p className="eyebrow light"><Sparkles size={13} /> مساعد Visit Libya</p><h2>اسأل دليل الرحلة.</h2><p>بطاقات مختصرة من بنك الأسئلة والأجوبة المرفق من المركز.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="إغلاق المساعد"><X size={19} /></button></div>
      <div className="assistant-topic-bar" aria-label="تصفية موضوع المساعد">{topics.map((item) => <button type="button" className={topic === item ? "is-active" : ""} onClick={() => chooseTopic(item)} key={item}>{item}</button>)}</div>
      <label className="assistant-search"><Search size={17} /><span className="sr-only">اكتب سؤالك</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} onKeyDown={(event) => { if (event.key === "Enter" && results[0]) choose(results[0]); }} placeholder="مثال: ما أبرز معالم بنغازي؟" /><button type="button" onClick={() => results[0] && choose(results[0])} aria-label="ابحث"><Send size={16} /></button></label>
      {selected ? <div className="assistant-answer"><div className="assistant-answer-meta"><BookOpen size={15} /><span>{topicFor(selected)}</span><button type="button" onClick={() => setSelected(null)}>كل الإجابات</button></div><h3>{selected.question}</h3><div className="assistant-card-stack">{cards.map((card, index) => <article key={`${selected.question}-${index}`}><span>بطاقة {index + 1}</span><p>{card}</p></article>)}</div>{selected.answer.length > cards.join(" ").length && <span className="assistant-truncated">اختُصرت الإجابة الطويلة إلى بطاقات قراءة؛ استخدم صياغة أكثر تحديدًا لتضييق البحث.</span>}</div> : <div className="assistant-results"><p className="assistant-label">{query ? "إجابات مقترحة" : `أسئلة ${topic === "الكل" ? "للبدء" : topic}`}</p>{results.length ? results.map((entry) => <button type="button" key={entry.question} onClick={() => choose(entry)}><small>{topicFor(entry)}</small><span>{entry.question}</span><ChevronDown size={16} /></button>) : <p className="assistant-empty">لم أجد تطابقًا مباشرًا ضمن هذا الموضوع. جرّب اسم مدينة أو معلم أو فئة أخرى.</p>}</div>}
      <div className="assistant-foot"><span>مصدر المعرفة: ملف الأسئلة والأجوبة المرفق.</span><span>راجِع الجهات الرسمية للتحديثات.</span></div>
    </div>}
    <button type="button" className="assistant-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={open}><MessageCircle size={21} /><span>{open ? "إخفاء المساعد" : "اسأل الدليل"}</span></button>
  </aside>;
}
