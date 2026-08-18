/**
 * Design reminder — «دفاتر الرحّالة»: المخطط صفحة عملية تشبه ورقة مسار في الدفتر؛
 * لا حجوزات وهمية ولا محاكاة لوحة حجز، فقط ترتيب شفاف للمحطات التي اختارها المستخدم.
 */
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpLeft, Check, Copy, GripVertical, Heart, MapPin, Plus, Printer, Route, Share2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { assets, destinations, experiences, seasonalEvents } from "@/lib/content";
import { useTrip } from "@/contexts/TripContext";
import { buildSharedRouteUrl } from "@/contexts/tripSharing";

type RouteItem = {
  id: string;
  type: "destination" | "experience" | "event";
  title: string;
  label: string;
  description: string;
  image: string;
  alt: string;
  detail: string;
  href: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character] ?? character));
}

export default function TripPlanner() {
  const { stops, toggleStop, moveStop, clearStops, favorites, toggleFavorite, clearFavorites } = useTrip();
  const [draggedStopId, setDraggedStopId] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const routeItems = useMemo<RouteItem[]>(() => stops.flatMap<RouteItem>((stopId): RouteItem[] => {
    const destination = destinations.find((item) => item.id === stopId);
    if (destination) return [{ id: destination.id, type: "destination" as const, title: destination.title, label: destination.region, description: destination.description, image: destination.image, alt: destination.alt, detail: destination.time, href: `/destinations/${destination.id}` }];
    const experience = experiences.find((item) => item.id === stopId);
    if (experience) return [{ id: experience.id, type: "experience" as const, title: experience.title, label: "تجربة محفوظة", description: experience.text, image: experience.image, alt: experience.alt, detail: `${experience.targetPlace} · ${experience.season}`, href: experience.targetRoute }];
    const event = seasonalEvents.find((item) => item.id === stopId);
    if (event) return [{ id: event.id, type: "event" as const, title: event.title, label: "فعالية موسمية", description: event.description, image: event.image, alt: event.alt, detail: `${event.region} · ${event.monthLabel}`, href: `/events#${event.id}` }];
    return [];
  }), [stops]);
  const savedCount = routeItems.length;
  const suggestions = destinations.filter((destination) => !stops.includes(destination.id));
  const savedFavorites = destinations.filter((destination) => favorites.includes(destination.id));
  const shareRoute = async () => {
    const link = buildSharedRouteUrl(window.location.href, stops);
    try {
      if (navigator.share) await navigator.share({ title: "مخطط رحلة Visit Libya", text: "شاهد مسار رحلتي المقترح في ليبيا.", url: link });
      else await navigator.clipboard.writeText(link);
      setShareStatus("تم تجهيز رابط المسار للمشاركة.");
    } catch {
      try {
        await navigator.clipboard.writeText(link);
        setShareStatus("تم نسخ رابط المسار.");
      } catch {
        setShareStatus("تعذر النسخ التلقائي؛ انسخ الرابط من شريط المتصفح.");
      }
    }
  };
  const exportRoutePdf = () => {
    const popup = window.open("", "_blank");
    if (!popup) { setShareStatus("اسمح للنوافذ المنبثقة لحفظ مخططك كملف PDF."); return; }
    const list = routeItems.map((item, index) => `<li><strong>${index + 1}. ${escapeHtml(item.title)}</strong><span>${escapeHtml(item.label)} · ${escapeHtml(item.detail)}</span><p>${escapeHtml(item.description)}</p></li>`).join("");
    popup.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"/><title>مخطط رحلة Visit Libya</title><style>body{font-family:Tahoma,Arial,sans-serif;color:#06294a;margin:42px;line-height:1.8}header{border-bottom:3px solid #c89b3c;padding-bottom:14px;margin-bottom:26px}h1{margin:0;font-size:28px}p{margin:5px 0;color:#50647a}ol{padding-right:26px}li{padding:12px 0;border-bottom:1px solid #d9d2c6}li strong,li span{display:block}li span{color:#8e6a10;font-size:13px}footer{margin-top:30px;color:#50647a;font-size:12px}</style></head><body><header><h1>Visit Libya | مخطط رحلتي</h1><p>${new Date().toLocaleDateString("ar-LY")}</p></header><ol>${list}</ol><footer>تصميم وتنفيذ مركز المعلومات والتوثيق السياحي © 2026</footer><script>window.print()</script></body></html>`);
    popup.document.close();
  };
  return (
    <SiteShell>
      <section className="trip-hero"><div className="page-frame"><p className="eyebrow light">مخطط الرحلة</p><h1>اجمع المحطات،<br /><i>ثم ارسم طريقك.</i></h1><p>احتفظ بما أعجبك أثناء التصفح. هذه مساحة خاصة داخل متصفحك لترتيب أفكار الرحلة، وليست حجزًا أو تأكيدًا للخدمات.</p></div></section>
      <section className="page-frame trip-content">
        <p className="trip-field-note"><Route size={14} /> ملاحظة ميدانية: رتّب المحطات بحسب الموسم والوجهة، ثم راجع تفاصيل الطريق مع الجهة المحلية.</p>
        <div className="trip-head"><div><p className="eyebrow">المحطات المحفوظة</p><h2>{savedCount ? `${savedCount} محطات في الدفتر` : "دفترك ينتظر محطته الأولى"}</h2></div>{savedCount > 0 && <div className="trip-export-actions"><button type="button" onClick={shareRoute}><Share2 size={15} /> مشاركة الرابط</button><button type="button" onClick={exportRoutePdf}><Printer size={15} /> حفظ PDF</button><button className="clear-trip" type="button" onClick={clearStops}><Trash2 size={16} /> إفراغ المسار</button></div>}</div>
        {shareStatus && <p className="trip-share-status"><Copy size={13} /> {shareStatus}</p>}
        {savedCount ? <><p className="trip-sort-hint"><GripVertical size={15} /> اسحب المحطة من المقبض لترتيبها، أو استخدم أزرار التحريك.</p><div className="trip-sortable-list">{routeItems.map((item, index) => <article className={`trip-sortable-item ${draggedStopId === item.id ? "is-dragging" : ""}`} draggable onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; setDraggedStopId(item.id); }} onDragEnd={() => setDraggedStopId(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (draggedStopId) moveStop(draggedStopId, item.id); setDraggedStopId(null); }} key={item.id}><span className="trip-drag-handle" aria-hidden="true"><GripVertical size={18} /></span><img src={item.image} alt={item.alt} /><div className="trip-sortable-copy"><p className="eyebrow">{String(index + 1).padStart(2, "0")} · {item.label}</p><h3>{item.title}</h3><p>{item.description}</p><span><MapPin size={13} /> {item.detail}</span></div><div className="trip-sortable-actions"><Link href={item.href}>افتح <ArrowLeft size={13} /></Link><button type="button" onClick={() => moveStop(item.id, routeItems[index - 1]?.id ?? item.id)} disabled={index === 0} aria-label={`رفع ${item.title}`}><ArrowUp size={13} /> رفع</button><button type="button" onClick={() => moveStop(item.id, routeItems[index + 1]?.id ?? item.id)} disabled={index === routeItems.length - 1} aria-label={`خفض ${item.title}`}><ArrowDown size={13} /> خفض</button><button type="button" className="remove-stop" onClick={() => toggleStop(item.id)} aria-label={`إزالة ${item.title} من المسار`}><Trash2 size={13} /> إزالة</button></div></article>)}</div></> : <div className="empty-state trip-empty"><Route size={32} /><h2>ابدأ من مدينة، أو من طبيعة ترغب في رؤيتها.</h2><p>كل وجهة أو تجربة تضيفها ستظهر هنا كي ترتب المسار وتناقش تفاصيله مع مشغل الرحلات.</p><Link href="/experiences" className="button button-ink">استكشف التجارب <ArrowLeft size={17} /></Link></div>}
      </section>
      {savedFavorites.length > 0 && <section className="page-frame favorites-section"><div className="trip-head"><div><p className="eyebrow"><Heart size={13} /> وجهات مفضلة</p><h2>{savedFavorites.length} وجهات محفوظة للعودة إليها.</h2></div><button className="clear-trip" type="button" onClick={clearFavorites}><Trash2 size={16} /> إفراغ المفضلة</button></div><p className="favorites-intro">تبقى هذه القائمة محفوظة في المتصفح على هذا الجهاز؛ أضف ما يناسب توقيت رحلتك إلى المسار عندما تكون جاهزًا.</p><div className="favorites-grid">{savedFavorites.map((destination) => <article key={destination.id}><img src={destination.image} alt={destination.alt} /><div><p className="eyebrow">{destination.city}</p><h3>{destination.title}</h3><div><button type="button" onClick={() => toggleStop(destination.id)}>{stops.includes(destination.id) ? <Check size={15} /> : <Plus size={15} />}{stops.includes(destination.id) ? "في المسار" : "أضف للمسار"}</button><button type="button" className="remove-favorite" onClick={() => toggleFavorite(destination.id)} aria-label={`إزالة ${destination.title} من المفضلة`}><Trash2 size={15} /></button></div></div></article>)}</div></section>}
      {suggestions.length > 0 && <section className="page-frame trip-suggestions"><div className="section-head split-head"><div><p className="eyebrow">أضف محطة</p><h2>ربما تود التوقف هنا أيضًا.</h2></div><Link href="/destinations" className="underlined-link">كل الوجهات <ArrowLeft size={16} /></Link></div><div className="suggestion-grid">{suggestions.slice(0, 3).map((destination) => <article key={destination.id}><img src={destination.image} alt={destination.alt} /><div><p>{destination.region}</p><h3>{destination.title}</h3><button type="button" onClick={() => toggleStop(destination.id)}><Plus size={16} /> أضف</button></div></article>)}</div></section>}
      <section className="route-reminder"><div className="page-frame"><Check size={22} /><p>عند تثبيت خط سيرك، تحقّق من إجراءات الدخول والموسم والطقس ووسيلة التنقل المناسبة لكل محطة.</p><Link href="/services">دليل السفر <ArrowLeft size={16} /></Link></div></section>
      <section className="trip-atlas-link"><div className="page-frame"><div><p className="eyebrow">أطلس ليبيا السياحي</p><h2>حوّل القائمة إلى مسار ذكي.</h2><p>افتح الأطلس الوطني للبحث في الطبقات الموثقة واستخدام تخطيط المسار وفق المدة والاهتمامات.</p></div><a className="button button-ink" href={assets.atlasPublicUrl} target="_blank" rel="noreferrer">فتح الأطلس <ArrowUpLeft size={17} /></a></div></section>
    </SiteShell>
  );
}
