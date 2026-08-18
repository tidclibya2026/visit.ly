/** رزنامة إرشادية: نوافذ موسمية من مادة المركز، لا مواعيد حجز أو إعلان رسمي. */
import { ArrowLeft, CalendarDays, Check, MapPin, Plus, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { seasonalEvents } from "@/lib/content";
import { useTrip } from "@/contexts/TripContext";

const regions = ["الكل", ...Array.from(new Set(seasonalEvents.map((event) => event.region)))];
const months = ["الكل", ...Array.from(new Set(seasonalEvents.flatMap((event) => event.months)))];

export default function Events() {
  const { stops, toggleStop } = useTrip();
  const [region, setRegion] = useState("الكل");
  const [month, setMonth] = useState("الكل");
  const events = useMemo(() => seasonalEvents.filter((event) => (region === "الكل" || event.region === region) && (month === "الكل" || event.months.includes(month))), [region, month]);
  return <SiteShell>
    <section className="inner-hero events-hero"><div className="page-frame"><p className="eyebrow light">رزنامة الموسم</p><h1>اختر نافذة الموسم،<br /><i>ثم رتّب رحلتك.</i></h1><p>دليل أولي من مواد المركز للأنشطة والمهرجانات. الموعد النهائي والبرنامج يحددهما المنظم المحلي.</p></div></section>
    <section className="page-frame events-intro"><div><p className="eyebrow">تقويم إرشادي</p><h2>الفعالية تبدأ<br />بالموسم والمكان.</h2></div><p>صفِّ الفعاليات بحسب الشهر أو المنطقة، ثم أضف ما يناسب خط رحلتك. لا تعني الإضافة حجزًا أو تأكيد حضور.</p></section>
    <section className="page-frame event-filter-bar" aria-label="تصفية الفعاليات"><div><p className="eyebrow"><SlidersHorizontal size={14} /> تصفية الرزنامة</p><p>تظهر الأشهر كنوافذ موسمية إرشادية، لا كمواعيد نهائية.</p></div><div className="event-filter-controls"><div className="category-chips"><span className="filter-label">الشهر</span>{months.map((item) => <button type="button" className={month === item ? "is-active" : ""} onClick={() => setMonth(item)} key={item}>{item}</button>)}</div><div className="category-chips"><span className="filter-label">المنطقة</span>{regions.map((item) => <button type="button" className={region === item ? "is-active" : ""} onClick={() => setRegion(item)} key={item}>{item}</button>)}</div></div></section>
    <section className="page-frame events-results"><p>تظهر الآن <strong>{events.length}</strong> فعاليات موسمية.</p>{(region !== "الكل" || month !== "الكل") && <button type="button" onClick={() => { setRegion("الكل"); setMonth("الكل"); }}>إعادة ضبط التصفية</button>}</section>
    <section className="page-frame events-grid" aria-label="بطاقات الفعاليات">{events.map((event, index) => { const isAdded = stops.includes(event.id); return <article id={event.id} className="event-card" key={event.id}><div className="event-card-image"><img src={event.image} alt={event.alt} /><span>{String(index + 1).padStart(2, "0")}</span></div><div className="event-card-copy"><p className="eyebrow">{event.category}</p><h2>{event.title}</h2><p>{event.description}</p><div className="event-meta"><span><CalendarDays size={15} /> {event.monthLabel}</span><span><MapPin size={15} /> {event.region}</span></div><p className="event-note">{event.planningNote}</p><button type="button" className={isAdded ? "is-added" : ""} onClick={() => toggleStop(event.id)}>{isAdded ? <Check size={16} /> : <Plus size={16} />}{isAdded ? "أضيفت للمسار" : "أضف إلى مخطط الرحلة"}</button></div></article>; })}</section>
    {!events.length && <section className="page-frame event-empty"><p className="eyebrow">لا توجد نتيجة مطابقة</p><h2>جرّب شهرًا أو منطقة أخرى.</h2><button type="button" className="button button-ink" onClick={() => { setRegion("الكل"); setMonth("الكل"); }}>عرض كل الفعاليات</button></section>}
    <section className="events-reminder"><div className="page-frame"><CalendarDays size={21} /><div><p className="eyebrow light">قبل اعتماد الموعد</p><h2>تحقّق محليًا،<br />ثم ابدأ التجربة.</h2></div><p>تتغير البرامج والخدمات والطقس. اتصل بالجهة المنظمة أو مشغل الرحلة لتأكيد التاريخ وطريقة الحضور ومتطلبات السلامة.</p><Link href="/trip" className="button button-sand">افتح مخطط الرحلة <ArrowLeft size={16} /></Link></div></section>
  </SiteShell>;
}
