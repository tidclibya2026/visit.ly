/**
 * Design reminder — «دفاتر الرحّالة»: المساعد المعرفي محطة هادئة في الدليل،
 * يجلب جوابًا موثقًا من بنك المركز ولا يدّعي معرفة أو خدمة خارجية.
 */
import { BookOpen, ChevronDown, MessageCircle, Search, Send, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { faqEntries, type FaqEntry } from "@/lib/faqData";

const suggestedQuestions = [
  "ما الذي يميز مدينة بنغازي سياحياً؟",
  "ما أشهر الشواطئ في ليبيا؟",
  "ما أهم المعالم في طرابلس؟",
  "ما الذي يجب معرفته قبل السفر إلى ليبيا؟",
];

function normalize(value: string) {
  return value.toLocaleLowerCase("ar").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function rankEntries(query: string): FaqEntry[] {
  const tokens = normalize(query).split(" ").filter((token) => token.length > 1);
  if (!tokens.length) return faqEntries.slice(0, 4);
  return faqEntries.map((entry) => {
    const question = normalize(entry.question);
    const category = normalize(entry.category);
    const answer = normalize(entry.answer);
    const score = tokens.reduce((total, token) => total + (question.includes(token) ? 5 : 0) + (category.includes(token) ? 2 : 0) + (answer.includes(token) ? 1 : 0), 0);
    return { entry, score };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map(({ entry }) => entry);
}

export function KnowledgeAssistant() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<FaqEntry | null>(null);
  const results = useMemo(() => rankEntries(query), [query]);
  const answer = selected?.answer ?? "";
  const visibleAnswer = answer.length > 1800 ? `${answer.slice(0, 1800)}…` : answer;

  const choose = (entry: FaqEntry) => {
    setQuery(entry.question);
    setSelected(entry);
  };

  return <aside className={`knowledge-assistant ${open ? "is-open" : ""}`} aria-label="المساعد المعرفي">
    {open && <div className="assistant-panel">
      <div className="assistant-head"><div><p className="eyebrow light"><Sparkles size={13} /> مساعد Visit Libya</p><h2>اسأل دليل الرحلة.</h2><p>إجابات من بنك الأسئلة والأجوبة المرفق من المركز.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="إغلاق المساعد"><X size={19} /></button></div>
      <label className="assistant-search"><Search size={17} /><span className="sr-only">اكتب سؤالك</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} onKeyDown={(event) => { if (event.key === "Enter" && results[0]) choose(results[0]); }} placeholder="مثال: ما أبرز معالم بنغازي؟" /><button type="button" onClick={() => results[0] && choose(results[0])} aria-label="ابحث"><Send size={16} /></button></label>
      {selected ? <div className="assistant-answer"><div className="assistant-answer-meta"><BookOpen size={15} /><span>{selected.category}</span></div><h3>{selected.question}</h3><p>{visibleAnswer}</p>{answer.length > visibleAnswer.length && <span className="assistant-truncated">يعرض المساعد مقتطفًا من الإجابة المطوّلة المرفقة.</span>}</div> : <div className="assistant-results"><p className="assistant-label">{query ? "إجابات مقترحة" : "أسئلة للبدء"}</p>{results.length ? results.map((entry) => <button type="button" key={entry.question} onClick={() => choose(entry)}><span>{entry.question}</span><ChevronDown size={16} /></button>) : <p className="assistant-empty">لم أجد تطابقًا مباشرًا. جرّب اسم مدينة أو معلم أو موضوع سفر.</p>}</div>}
      <div className="assistant-foot"><span>مصدر المعرفة: ملف الأسئلة والأجوبة المرفق.</span><span>راجِع الجهات الرسمية للتحديثات.</span></div>
    </div>}
    <button type="button" className="assistant-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={open}><MessageCircle size={21} /><span>{open ? "إخفاء المساعد" : "اسأل الدليل"}</span></button>
  </aside>;
}
