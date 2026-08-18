import { Check, FileText, Languages, LogIn, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

type ReviewPayload = { title?: string; description?: string; fieldNote?: string; highlights?: string[]; activities?: string[] };

export default function TranslationReview() {
  const { user, loading, isAuthenticated } = useAuth();
  const reviews = trpc.translationReview.list.useQuery(undefined, { enabled: user?.role === "admin" });
  const utils = trpc.useUtils();
  const update = trpc.translationReview.update.useMutation({ onSuccess: () => utils.translationReview.list.invalidate() });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(() => reviews.data?.find((item) => item.id === selectedId) ?? reviews.data?.[0], [reviews.data, selectedId]);
  const [draft, setDraft] = useState("");
  useEffect(() => { if (selected) setDraft(selected.editedJson || selected.machineJson); }, [selected]);

  if (loading) return <SiteShell><section className="page-frame admin-review-state"><RefreshCw className="spin" /><p>جارٍ التحقق من صلاحية المشرف…</p></section></SiteShell>;
  if (!isAuthenticated) return <SiteShell><section className="page-frame admin-review-state"><ShieldCheck size={34} /><h1>مراجعة الترجمات</h1><p>هذه المساحة مخصصة للمشرفين المعتمدين لمراجعة الترجمة الآلية قبل النشر.</p><button className="button button-ink" type="button" onClick={startLogin}><LogIn size={16} /> تسجيل الدخول كمشرف</button></section></SiteShell>;
  if (user?.role !== "admin") return <SiteShell><section className="page-frame admin-review-state"><ShieldCheck size={34} /><h1>وصول مقيّد</h1><p>تحتاج إلى صلاحية مشرف لمراجعة الترجمات واعتمادها.</p><Link href="/" className="button button-ink">العودة إلى المنصة</Link></section></SiteShell>;

  const source = selected ? JSON.parse(selected.sourceJson) as ReviewPayload : null;
  const machine = selected ? JSON.parse(selected.machineJson) as ReviewPayload : null;
  const submit = (status: "approved" | "needs_revision") => selected && update.mutate({ id: selected.id, editedJson: draft, status });
  return <SiteShell><section className="page-frame translation-review-head"><div><p className="eyebrow"><Languages size={14} /> إدارة الترجمة</p><h1>مراجعة قبل الاعتماد.</h1><p>تحقق من الترجمة الآلية وعدّلها ثم اعتمدها أو أعدها للمراجعة. لا يُغيّر هذا الأصل العربي الموثق.</p></div><span><ShieldCheck size={16} /> مشرف معتمد</span></section><section className="page-frame translation-review-layout"><aside className="translation-review-list"><p className="eyebrow">سجل المراجعات</p>{reviews.isLoading ? <p>جارٍ تحميل السجل…</p> : reviews.data?.length ? reviews.data.map((item) => <button type="button" key={item.id} className={selected?.id === item.id ? "is-active" : ""} onClick={() => setSelectedId(item.id)}><span>{item.destinationId} · {item.language.toUpperCase()}</span><small>{item.status === "approved" ? "معتمد" : item.status === "needs_revision" ? "يحتاج تعديل" : "بانتظار المراجعة"}</small></button>) : <p>ستظهر هنا الترجمات التي يطلبها الزوار عند فتح ملفات المدن بلغاتهم.</p>}</aside><main className="translation-review-workspace">{selected && source && machine ? <><div className="translation-review-meta"><FileText size={18} /><span>{selected.destinationId} · {selected.language.toUpperCase()}</span><small>إنشاء: {new Date(selected.createdAt).toLocaleString("ar-LY")}</small></div><div className="translation-compare"><article><p className="eyebrow">المصدر العربي</p><h2>{source.title}</h2><p>{source.description}</p><p>{source.fieldNote}</p></article><article><p className="eyebrow">الترجمة الآلية</p><h2>{machine.title}</h2><p>{machine.description}</p><p>{machine.fieldNote}</p></article></div><label className="translation-editor"><span>النسخة المحررة المعتمدة</span><textarea value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="الترجمة المحررة" /></label><div className="translation-review-actions"><button type="button" className="button button-ink" disabled={update.isPending} onClick={() => submit("approved")}><Check size={16} /> اعتماد الترجمة</button><button type="button" className="review-revision" disabled={update.isPending} onClick={() => submit("needs_revision")}>طلب تعديل لاحق</button></div></> : <div className="admin-review-state"><Languages size={30} /><p>اختر ترجمة من القائمة لبدء المراجعة.</p></div>}</main></section></SiteShell>;
}
