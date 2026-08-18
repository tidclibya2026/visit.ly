import { CheckCircle2, Languages, Send } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

export function TranslationSuggestionForm({ destinationId }: { destinationId: string }) {
  const { language } = useLanguage();
  const [originalText, setOriginalText] = useState("");
  const [suggestedText, setSuggestedText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = trpc.translationSuggestion.submit.useMutation({ onSuccess: () => { setSubmitted(true); setOriginalText(""); setSuggestedText(""); } });
  const submitSuggestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!originalText.trim() || !suggestedText.trim()) return;
    submit.mutate({ destinationId, language, originalText: originalText.trim(), suggestedText: suggestedText.trim(), contextUrl: window.location.href });
  };
  return <section className="page-frame translation-suggestion" aria-labelledby="translation-suggestion-title"><div><p className="eyebrow"><Languages size={14} /> تحسين مشترك</p><h2 id="translation-suggestion-title">هل ترى صياغة أدق؟</h2><p>اقترح تحسينًا للترجمة. يراجع فريق المحتوى الاقتراح قبل اعتماده، ولا يظهر تلقائيًا للزوار.</p></div>{submitted ? <div className="translation-suggestion-confirm"><CheckCircle2 size={24} /><strong>شكرًا لمساهمتك.</strong><p>سُجل الاقتراح في طابور المراجعة.</p></div> : <form onSubmit={submitSuggestion}><label><span>النص الحالي أو الموضع المقصود</span><textarea value={originalText} onChange={(event) => setOriginalText(event.target.value)} required maxLength={8000} /></label><label><span>الصياغة المقترحة</span><textarea value={suggestedText} onChange={(event) => setSuggestedText(event.target.value)} required maxLength={8000} /></label><button type="submit" className="button button-ink" disabled={submit.isPending}><Send size={16} /> إرسال الاقتراح</button>{submit.isError && <p className="translation-suggestion-error">تعذر حفظ الاقتراح الآن. يرجى المحاولة مرة أخرى.</p>}</form>}</section>;
}
