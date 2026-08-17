/**
 * Design reminder — «دفاتر الرحّالة»: نتائج الوجهات تشبه صفحات مفهرسة في دليل سفر؛
 * تصفية خفيفة، صور صادقة، وإضافة هادئة للمسار بدلاً من واجهة حجوزات تجارية.
 */
import { ArrowLeft, Check, MapPin, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { destinations } from "@/lib/content";
import { useTrip } from "@/contexts/TripContext";

const categories = ["الكل", "مدينة", "تراث", "طبيعة", "ساحل"] as const;

export default function Destinations() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("الكل");
  const { stops, toggleStop } = useTrip();
  const shownDestinations = useMemo(() => destinations.filter((destination) => {
    const matchesCategory = category === "الكل" || destination.category === category;
    const searchable = `${destination.title} ${destination.region} ${destination.description}`.toLowerCase();
    return matchesCategory && searchable.includes(query.trim().toLowerCase());
  }), [category, query]);

  return (
    <SiteShell>
      <section className="inner-hero destinations-hero">
        <div className="page-frame"><p className="eyebrow light">المتوسط ← الصحراء</p><h1>ابحث عن المكان<br /><i>الذي يشبه مزاج رحلتك.</i></h1><p>مدن عريقة وواحات ومواقع أثرية ومسارات طبيعة؛ ابدأ من الاسم أو من نوع التجربة.</p></div>
        <span className="hero-topography" aria-hidden="true" />
      </section>
      <section className="page-frame destinations-content">
        <div className="filter-bar">
          <label className="search-field"><Search size={18} /><span className="sr-only">ابحث في الوجهات</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="اكتب مدينة أو طبيعة أو تراث..." /></label>
          <div className="category-chips" aria-label="تصنيف الوجهات"><SlidersHorizontal size={16} />{categories.map((item) => <button type="button" onClick={() => setCategory(item)} className={category === item ? "is-active" : ""} key={item}>{item}</button>)}</div>
        </div>
        <div className="results-line"><p>تظهر الآن <strong>{shownDestinations.length}</strong> وجهات من الدفتر.</p><Link href="/trip">عرض مساري <ArrowLeft size={15} /></Link></div>
        {shownDestinations.length ? <div className="destination-catalogue">
          {shownDestinations.map((destination, index) => {
            const saved = stops.includes(destination.id);
            return <article className="catalogue-entry" data-stop={destination.id} key={destination.id}>
              <div className="catalogue-count">0{index + 1}</div>
              <div className="catalogue-image"><img src={destination.image} alt={destination.alt} /></div>
              <div className="catalogue-copy"><div className="card-meta ink"><span><MapPin size={13} /> {destination.region}</span><span>{destination.category}</span></div><h2>{destination.title}</h2><p>{destination.description}</p><span className="travel-time">الوقت المقترح: {destination.time}</span></div>
              <button type="button" onClick={() => toggleStop(destination.id)} className={`add-to-trip ${saved ? "is-saved" : ""}`}>{saved ? <Check size={17} /> : <Plus size={17} />}{saved ? "أُضيف" : "أضف"}</button>
            </article>;
          })}
        </div> : <div className="empty-state"><p className="eyebrow">لا توجد نتيجة مطابقة</p><h2>جرّب كلمة أخرى أو أزل الفلتر.</h2><button type="button" className="button button-ink" onClick={() => { setQuery(""); setCategory("الكل"); }}>عرض كل الوجهات</button></div>}
      </section>
    </SiteShell>
  );
}
