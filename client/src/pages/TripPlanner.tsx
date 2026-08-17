/**
 * Design reminder — «دفاتر الرحّالة»: المخطط صفحة عملية تشبه ورقة مسار في الدفتر؛
 * لا حجوزات وهمية ولا محاكاة لوحة حجز، فقط ترتيب شفاف للمحطات التي اختارها المستخدم.
 */
import { ArrowLeft, ArrowUpLeft, Check, Heart, MapPin, Plus, Route, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { assets, destinations } from "@/lib/content";
import { useTrip } from "@/contexts/TripContext";

export default function TripPlanner() {
  const { stops, toggleStop, clearStops, favorites, toggleFavorite, clearFavorites } = useTrip();
  const selected = destinations.filter((destination) => stops.includes(destination.id));
  const suggestions = destinations.filter((destination) => !stops.includes(destination.id));
  const savedFavorites = destinations.filter((destination) => favorites.includes(destination.id));
  return (
    <SiteShell>
      <section className="trip-hero"><div className="page-frame"><p className="eyebrow light">مخطط الرحلة</p><h1>اجمع المحطات،<br /><i>ثم ارسم طريقك.</i></h1><p>احتفظ بما أعجبك أثناء التصفح. هذه مساحة خاصة داخل متصفحك لترتيب أفكار الرحلة، وليست حجزًا أو تأكيدًا للخدمات.</p></div></section>
      <section className="page-frame trip-content">
        <p className="trip-field-note"><Route size={14} /> ملاحظة ميدانية: رتّب المحطات بحسب الموسم والوجهة، ثم راجع تفاصيل الطريق مع الجهة المحلية.</p>
        <div className="trip-head"><div><p className="eyebrow">المحطات المحفوظة</p><h2>{selected.length ? `${selected.length} محطات في الدفتر` : "دفترك ينتظر محطته الأولى"}</h2></div>{selected.length > 0 && <button className="clear-trip" type="button" onClick={clearStops}><Trash2 size={16} /> إفراغ المسار</button>}</div>
        {selected.length ? <div className="trip-route-list">{selected.map((destination, index) => <article className="trip-stop" key={destination.id}><span className="trip-stop-index">0{index + 1}</span><div className="trip-stop-line" /><img src={destination.image} alt={destination.alt} /><div><p className="eyebrow">{destination.region}</p><h3>{destination.title}</h3><p>{destination.description}</p><span><MapPin size={14} /> {destination.time}</span></div><button type="button" onClick={() => toggleStop(destination.id)} aria-label={`إزالة ${destination.title} من المسار`}><Trash2 size={17} /></button></article>)}</div> : <div className="empty-state trip-empty"><Route size={32} /><h2>ابدأ من مدينة، أو من طبيعة ترغب في رؤيتها.</h2><p>كل وجهة تضيفها ستظهر هنا كي تقارن محطاتك وتناقش ترتيبها مع مشغل الرحلات.</p><Link href="/destinations" className="button button-ink">استكشف الوجهات <ArrowLeft size={17} /></Link></div>}
      </section>
      {savedFavorites.length > 0 && <section className="page-frame favorites-section"><div className="trip-head"><div><p className="eyebrow"><Heart size={13} /> وجهات مفضلة</p><h2>{savedFavorites.length} وجهات محفوظة للعودة إليها.</h2></div><button className="clear-trip" type="button" onClick={clearFavorites}><Trash2 size={16} /> إفراغ المفضلة</button></div><p className="favorites-intro">تبقى هذه القائمة محفوظة في المتصفح على هذا الجهاز؛ أضف ما يناسب توقيت رحلتك إلى المسار عندما تكون جاهزًا.</p><div className="favorites-grid">{savedFavorites.map((destination) => <article key={destination.id}><img src={destination.image} alt={destination.alt} /><div><p className="eyebrow">{destination.city}</p><h3>{destination.title}</h3><div><button type="button" onClick={() => toggleStop(destination.id)}>{stops.includes(destination.id) ? <Check size={15} /> : <Plus size={15} />}{stops.includes(destination.id) ? "في المسار" : "أضف للمسار"}</button><button type="button" className="remove-favorite" onClick={() => toggleFavorite(destination.id)} aria-label={`إزالة ${destination.title} من المفضلة`}><Trash2 size={15} /></button></div></div></article>)}</div></section>}
      {suggestions.length > 0 && <section className="page-frame trip-suggestions"><div className="section-head split-head"><div><p className="eyebrow">أضف محطة</p><h2>ربما تود التوقف هنا أيضًا.</h2></div><Link href="/destinations" className="underlined-link">كل الوجهات <ArrowLeft size={16} /></Link></div><div className="suggestion-grid">{suggestions.slice(0, 3).map((destination) => <article key={destination.id}><img src={destination.image} alt={destination.alt} /><div><p>{destination.region}</p><h3>{destination.title}</h3><button type="button" onClick={() => toggleStop(destination.id)}><Plus size={16} /> أضف</button></div></article>)}</div></section>}
      <section className="route-reminder"><div className="page-frame"><Check size={22} /><p>عند تثبيت خط سيرك، تحقّق من إجراءات الدخول والموسم والطقس ووسيلة التنقل المناسبة لكل محطة.</p><Link href="/services">دليل السفر <ArrowLeft size={16} /></Link></div></section>
      <section className="trip-atlas-link"><div className="page-frame"><div><p className="eyebrow">أطلس ليبيا السياحي</p><h2>حوّل القائمة إلى مسار ذكي.</h2><p>افتح الأطلس الوطني للبحث في الطبقات الموثقة واستخدام تخطيط المسار وفق المدة والاهتمامات.</p></div><a className="button button-ink" href={assets.atlasPublicUrl} target="_blank" rel="noreferrer">فتح الأطلس <ArrowUpLeft size={17} /></a></div></section>
    </SiteShell>
  );
}
