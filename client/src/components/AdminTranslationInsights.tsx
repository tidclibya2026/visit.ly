import { BarChart3, BellRing, Languages, MapPinned } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { destinations } from "@/lib/content";
import { languageOptions } from "@/contexts/LanguageContext";

export function AdminTranslationInsights() {
  const analytics = trpc.translationReview.analytics.useQuery();
  const suggestions = trpc.translationReview.suggestions.useQuery();
  const pending = suggestions.data?.filter((item) => item.status === "pending") ?? [];
  const nameForDestination = (id: string | null) => destinations.find((item) => item.id === id)?.title ?? id ?? "بدون معلم";
  const nameForLanguage = (code: string) => languageOptions.find((item) => item.code === code)?.label ?? code;
  return <section className="page-frame admin-insights" aria-labelledby="admin-insights-title"><div className="admin-insights-heading"><p className="eyebrow"><BarChart3 size={14} /> مؤشرات دورية</p><h2 id="admin-insights-title">قراءة آخر 30 يومًا.</h2><p>تعتمد الأرقام على أحداث مجهولة الهوية من استخدام الزوار، وتبدأ المؤشرات من الصفر حتى تتراكم زيارات فعلية.</p></div><div className="admin-insights-grid"><article><Languages size={19} /><p>أكثر اللغات استخدامًا</p>{analytics.data?.languages.length ? <ol>{analytics.data.languages.slice(0, 3).map((item) => <li key={item.language}><span>{nameForLanguage(item.language)}</span><b>{Number(item.total)}</b></li>)}</ol> : <small>لا توجد أحداث لغة مسجلة بعد.</small>}</article><article><MapPinned size={19} /><p>أكثر المعالم تفاعلًا</p>{analytics.data?.destinations.length ? <ol>{analytics.data.destinations.slice(0, 3).map((item) => <li key={item.destinationId}><span>{nameForDestination(item.destinationId)}</span><b>{Number(item.total)}</b></li>)}</ol> : <small>لا توجد تفاعلات معالم مسجلة بعد.</small>}</article><article className={pending.length ? "has-new" : ""}><BellRing size={19} /><p>إشعارات الترجمة</p><strong>{pending.length} اقتراحات جديدة</strong><small>{pending.length ? "تحتاج إلى مراجعة في طابور الاقتراحات أدناه." : "لا توجد اقتراحات معلقة الآن."}</small></article></div></section>;
}
