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

const cities = ["الكل", ...Array.from(new Set(destinations.map((destination) => destination.city)))];
const landmarkTypes = ["الكل", ...Array.from(new Set(destinations.map((destination) => destination.landmarkType)))];

export default function Destinations() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("الكل");
  const [landmarkType, setLandmarkType] = useState("الكل");
  const { stops, toggleStop } = useTrip();
  const shownDestinations = useMemo(() => destinations.filter((destination) => {
    const matchesCity = city === "الكل" || destination.city === city;
    const matchesLandmarkType = landmarkType === "الكل" || destination.landmarkType === landmarkType;
    const searchable = `${destination.title} ${destination.city} ${destination.landmarkType} ${destination.region} ${destination.description}`.toLowerCase();
    return matchesCity && matchesLandmarkType && searchable.includes(query.trim().toLowerCase());
  }), [city, landmarkType, query]);

  return (
    <SiteShell>
      <section className="inner-hero destinations-hero">
        <div className="page-frame"><p className="eyebrow light">المتوسط ← الصحراء</p><h1>ابحث عن المكان<br /><i>الذي يشبه مزاج رحلتك.</i></h1><p>مدن عريقة وواحات ومواقع أثرية ومسارات طبيعة؛ ابدأ من الاسم أو من نوع التجربة.</p></div>
        <span className="hero-topography" aria-hidden="true" />
      </section>
      <section className="page-frame destinations-content">
        <div className="filter-bar">
          <label className="search-field"><Search size={18} /><span className="sr-only">ابحث في الوجهات</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="اكتب مدينة أو طبيعة أو تراث..." /></label>
          <div className="filter-groups"><p className="filter-field-note">فهرس ميداني · اختر المدينة ثم حدّد نوع المعلم</p><div className="category-chips" aria-label="تصفية بحسب المدينة"><span className="filter-label">محطة المدينة</span>{cities.map((item) => <button type="button" onClick={() => setCity(item)} className={city === item ? "is-active" : ""} key={item}>{item}</button>)}</div><div className="category-chips" aria-label="تصفية بحسب نوع المعلم"><SlidersHorizontal size={16} /><span className="filter-label">خريطة المعلم</span>{landmarkTypes.map((item) => <button type="button" onClick={() => setLandmarkType(item)} className={landmarkType === item ? "is-active" : ""} key={item}>{item}</button>)}</div></div>
        </div>
        <div className="results-line"><p>تظهر الآن <strong>{shownDestinations.length}</strong> وجهات من الدفتر.</p><Link href="/trip">عرض مساري <ArrowLeft size={15} /></Link></div>
        {shownDestinations.length ? <div className="destination-catalogue">
          {shownDestinations.map((destination, index) => {
            const saved = stops.includes(destination.id);
            return <article className="catalogue-entry" data-stop={destination.id} key={destination.id}>
              <div className="catalogue-count">0{index + 1}</div>
              <div className="catalogue-image"><img src={destination.image} alt={destination.alt} /></div>
              <div className="catalogue-copy"><div className="card-meta ink"><span><MapPin size={13} /> {destination.city} · {destination.region}</span><span>{destination.landmarkType}</span></div><h2>{destination.title}</h2><p>{destination.description}</p><span className="travel-time">الوقت المقترح: {destination.time}</span></div>
              <button type="button" onClick={() => toggleStop(destination.id)} className={`add-to-trip ${saved ? "is-saved" : ""}`}>{saved ? <Check size={17} /> : <Plus size={17} />}{saved ? "أُضيف" : "أضف"}</button>
            </article>;
          })}
        </div> : <div className="empty-state"><p className="eyebrow">لا توجد نتيجة مطابقة</p><h2>جرّب مدينة أو نوع معلم آخر.</h2><button type="button" className="button button-ink" onClick={() => { setQuery(""); setCity("الكل"); setLandmarkType("الكل"); }}>عرض كل الوجهات</button></div>}
      </section>
    </SiteShell>
  );
}
