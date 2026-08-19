import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, CalendarDays, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";

const monthLabel = (monthKey: string) => new Intl.DateTimeFormat("ar-LY", { month: "short", year: "numeric" }).format(new Date(`${monthKey}-01T00:00:00Z`));
const completion = (actual: number, target: number) => target > 0 ? Math.min(100, Math.round((actual / target) * 100)) : null;

export function AdminMonthlyPerformance() {
  const utils = trpc.useUtils();
  const performance = trpc.visa.monthlyPerformance.useQuery();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [monthKey, setMonthKey] = useState(currentMonth);
  const selected = performance.data?.months.find((item) => item.monthKey === monthKey);
  const [visaTarget, setVisaTarget] = useState(0);
  const [contentTarget, setContentTarget] = useState(0);
  const saveTarget = trpc.visa.setMonthlyTarget.useMutation({ onSuccess: () => utils.visa.monthlyPerformance.invalidate() });

  useEffect(() => {
    setVisaTarget(selected?.visaTarget ?? 0);
    setContentTarget(selected?.contentTarget ?? 0);
  }, [selected?.monthKey, selected?.visaTarget, selected?.contentTarget]);

  const chartData = useMemo(() => (performance.data?.months ?? []).map((item) => ({ ...item, label: monthLabel(item.monthKey) })), [performance.data?.months]);
  const visaProgress = selected ? completion(selected.visas, selected.visaTarget) : null;
  const contentProgress = selected ? completion(selected.content, selected.contentTarget) : null;

  return <section className="admin-monthly-performance" aria-labelledby="monthly-performance-title">
    <header><div><p className="eyebrow"><BarChart3 size={14} /> متابعة الأداء</p><h2 id="monthly-performance-title">المستهدفات الشهرية</h2><p>قارن الإنجاز الفعلي بالمستهدفات التي يحددها المشرف، من دون أرقام افتراضية.</p></div><span className="admin-station-code">دفتر الأداء · 03</span></header>
    <div className="admin-target-summary">
      <article><span>إنجاز طلبات التأشيرة</span><strong>{selected?.visas ?? 0}</strong><small>{visaProgress === null ? "لم يحدد مستهدف بعد" : `${visaProgress}% من المستهدف`}</small><i><b style={{ width: `${visaProgress ?? 0}%` }} /></i></article>
      <article><span>إنجاز المحتوى</span><strong>{selected?.content ?? 0}</strong><small>{contentProgress === null ? "لم يحدد مستهدف بعد" : `${contentProgress}% من المستهدف`}</small><i><b style={{ width: `${contentProgress ?? 0}%` }} /></i></article>
      <form onSubmit={(event) => { event.preventDefault(); saveTarget.mutate({ monthKey, visaTarget, contentTarget }); }}><label><span><CalendarDays size={14} /> الشهر</span><select value={monthKey} onChange={(event) => setMonthKey(event.target.value)}>{performance.data?.months.map((item) => <option key={item.monthKey} value={item.monthKey}>{monthLabel(item.monthKey)}</option>)}</select></label><label><span>مستهدف التأشيرات</span><input type="number" min="0" value={visaTarget} onChange={(event) => setVisaTarget(Number(event.target.value))} /></label><label><span>مستهدف المحتوى</span><input type="number" min="0" value={contentTarget} onChange={(event) => setContentTarget(Number(event.target.value))} /></label><button type="submit" disabled={saveTarget.isPending}><Save size={15} /> {saveTarget.isPending ? "جارٍ الحفظ" : "حفظ المستهدف"}</button></form>
    </div>
    <div className="admin-sparkline-grid">
      <article><h3>طلبات التأشيرة</h3><ResponsiveContainer width="100%" height={160}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} width={24} /><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} /><Bar dataKey="visas" name="الفعلي" fill="#0b3a67" radius={[2, 2, 0, 0]} /><Bar dataKey="visaTarget" name="المستهدف" fill="#e4c870" radius={[2, 2, 0, 0]} /></BarChart></ResponsiveContainer></article>
      <article><h3>المحتوى المنشأ</h3><ResponsiveContainer width="100%" height={160}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} width={24} /><Tooltip /><Legend wrapperStyle={{ fontSize: 10 }} /><Bar dataKey="content" name="الفعلي" fill="#0b3a67" radius={[2, 2, 0, 0]} /><Bar dataKey="contentTarget" name="المستهدف" fill="#e4c870" radius={[2, 2, 0, 0]} /></BarChart></ResponsiveContainer></article>
    </div>
  </section>;
}
