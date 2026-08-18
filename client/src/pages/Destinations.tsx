/**
 * Design reminder — «دفاتر الرحّالة»: نتائج الوجهات تشبه صفحات مفهرسة في دليل سفر؛
 * تصفية خفيفة، صور صادقة، وإضافة هادئة للمسار بدلاً من واجهة حجوزات تجارية.
 */
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Grid2X2, Images, List, MapPin, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { destinations, type Destination, type GalleryItem } from "@/lib/content";
import { useTrip } from "@/contexts/TripContext";
import { filterAndSortDestinations, type DestinationSort } from "@/lib/destinationFilters";
import { destinationViewStorageKey, parseDestinationView, type DestinationView } from "@/lib/destinationView";

const cities = ["الكل", ...Array.from(new Set(destinations.map((destination) => destination.city)))];
const landmarkTypes = ["الكل", ...Array.from(new Set(destinations.map((destination) => destination.landmarkType)))];
const regions = ["الكل", ...Array.from(new Set(destinations.map((destination) => destination.region)))];
const categories = ["الكل", ...Array.from(new Set(destinations.map((destination) => destination.category)))];

export default function Destinations() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("الكل");
  const [landmarkType, setLandmarkType] = useState("الكل");
  const [region, setRegion] = useState("الكل");
  const [category, setCategory] = useState("الكل");
  const [sort, setSort] = useState<DestinationSort>("default");
  const [viewMode, setViewMode] = useState<DestinationView>(() => parseDestinationView(typeof window === "undefined" ? null : window.sessionStorage.getItem(destinationViewStorageKey)));
  const [galleryDestinationId, setGalleryDestinationId] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const { stops, toggleStop } = useTrip();
  const changeViewMode = (nextView: DestinationView) => {
    setViewMode(nextView);
    window.sessionStorage.setItem(destinationViewStorageKey, nextView);
  };
  const shownDestinations = useMemo(() => filterAndSortDestinations(destinations, { query, city, landmarkType, region, category, sort }), [category, city, landmarkType, query, region, sort]);

  return (
    <SiteShell>
      <section className="inner-hero destinations-hero">
        <div className="page-frame"><p className="eyebrow light">المتوسط ← الصحراء</p><h1>ابحث عن المكان<br /><i>الذي يشبه مزاج رحلتك.</i></h1><p>مدن عريقة وواحات ومواقع أثرية ومسارات طبيعة؛ ابدأ من الاسم أو من نوع التجربة.</p></div>
        <span className="hero-topography" aria-hidden="true" />
      </section>
      <section className="page-frame destinations-content">
        <div className="filter-bar">
          <label className="search-field"><Search size={18} /><span className="sr-only">ابحث في الوجهات</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="اكتب مدينة أو طبيعة أو تراث..." /></label>
          <div className="filter-groups"><p className="filter-field-note">فهرس ميداني · صفِّ المنطقة أو الفئة ثم رتّب النتائج</p><div className="category-chips" aria-label="تصفية بحسب المدينة"><span className="filter-label">محطة المدينة</span>{cities.map((item) => <button type="button" onClick={() => setCity(item)} className={city === item ? "is-active" : ""} key={item}>{item}</button>)}</div><div className="category-chips" aria-label="تصفية بحسب المنطقة"><MapPin size={16} /><span className="filter-label">المنطقة</span>{regions.map((item) => <button type="button" onClick={() => setRegion(item)} className={region === item ? "is-active" : ""} key={item}>{item}</button>)}</div><div className="category-chips" aria-label="تصفية بحسب الفئة"><SlidersHorizontal size={16} /><span className="filter-label">الفئة</span>{categories.map((item) => <button type="button" onClick={() => setCategory(item)} className={category === item ? "is-active" : ""} key={item}>{item}</button>)}</div><div className="category-chips" aria-label="تصفية بحسب نوع المعلم"><SlidersHorizontal size={16} /><span className="filter-label">نوع المعلم</span>{landmarkTypes.map((item) => <button type="button" onClick={() => setLandmarkType(item)} className={landmarkType === item ? "is-active" : ""} key={item}>{item}</button>)}</div></div>
        </div>
        <div className="results-line"><p>تظهر الآن <strong>{shownDestinations.length}</strong> وجهات من الدفتر.</p><div className="destination-display-controls"><label className="destination-sort">رتّب حسب<select value={sort} onChange={(event) => setSort(event.target.value as DestinationSort)}><option value="default">ترتيب الدفتر</option><option value="region">المنطقة</option><option value="category">الفئة</option></select></label><div className="destination-view-toggle" role="group" aria-label="شكل عرض الوجهات"><button type="button" className={viewMode === "grid" ? "is-active" : ""} aria-pressed={viewMode === "grid"} onClick={() => changeViewMode("grid")}><Grid2X2 size={15} /><span>شبكة</span></button><button type="button" className={viewMode === "list" ? "is-active" : ""} aria-pressed={viewMode === "list"} onClick={() => changeViewMode("list")}><List size={16} /><span>قائمة</span></button></div></div><Link href="/trip">عرض مساري <ArrowLeft size={15} /></Link></div>
        {shownDestinations.length ? <div className={`destination-catalogue is-${viewMode}`}>
          {shownDestinations.map((destination: Destination, index: number) => {
            const saved = stops.includes(destination.id);
            const galleryOpen = galleryDestinationId === destination.id;
            const galleryImage = destination.gallery[galleryOpen ? galleryIndex : 0];
            return <div className="destination-record" key={destination.id}>
              <article className="catalogue-entry" data-stop={destination.id}>
                <div className="catalogue-count">0{index + 1}</div>
                <div className="catalogue-image"><img src={destination.image} alt={destination.alt} /></div>
                <div className="catalogue-copy"><div className="card-meta ink"><span><MapPin size={13} /> {destination.city} · {destination.region}</span><span>{destination.landmarkType}</span></div><h2><Link href={`/destinations/${destination.id}`}>{destination.title}</Link></h2><p>{destination.description}</p><div className="destination-field-note"><strong>معلومة عن الموقع</strong><span>{destination.fieldNote}</span><ul>{destination.highlights.map((item: string) => <li key={item}>{item}</li>)}</ul></div><span className="travel-time">الوقت المقترح: {destination.time}</span><div className="catalogue-actions"><Link href={`/destinations/${destination.id}`} className="detail-link">افتح ملف المدينة <ArrowLeft size={15} /></Link><button type="button" className="open-gallery" onClick={() => { setGalleryDestinationId(galleryOpen ? null : destination.id); setGalleryIndex(0); }} aria-expanded={galleryOpen}><Images size={16} /> {galleryOpen ? "إخفاء المعرض" : `عرض ${destination.gallery.length} صور موثقة`}</button></div></div>
                <button type="button" onClick={() => toggleStop(destination.id)} className={`add-to-trip ${saved ? "is-saved" : ""}`}>{saved ? <Check size={17} /> : <Plus size={17} />}{saved ? "أُضيف" : "أضف"}</button>
              </article>
              {galleryOpen && <section className="destination-gallery" aria-label={`معرض صور ${destination.title}`}>
                <div className="gallery-stage"><img src={galleryImage.image} alt={galleryImage.alt} /><div className="gallery-stage-shade" /><div className="gallery-caption"><p className="eyebrow light">سجل الصورة · {String(galleryIndex + 1).padStart(2, "0")} / {String(destination.gallery.length).padStart(2, "0")}</p><h3>{galleryImage.caption}</h3><p><MapPin size={15} /> {galleryImage.location}</p><span>{galleryImage.coordinates}</span></div><div className="gallery-controls"><button type="button" onClick={() => setGalleryIndex((current) => (current - 1 + destination.gallery.length) % destination.gallery.length)} aria-label="الصورة السابقة"><ChevronRight size={20} /></button><button type="button" onClick={() => setGalleryIndex((current) => (current + 1) % destination.gallery.length)} aria-label="الصورة التالية"><ChevronLeft size={20} /></button></div></div>
                <div className="gallery-thumbnails">{destination.gallery.map((item: GalleryItem, galleryItemIndex: number) => <button type="button" className={galleryItemIndex === galleryIndex ? "is-active" : ""} onClick={() => setGalleryIndex(galleryItemIndex)} key={item.image}><img src={item.image} alt="" /><span>{String(galleryItemIndex + 1).padStart(2, "0")}</span></button>)}</div>
              </section>}
            </div>;
          })}
        </div> : <div className="empty-state"><p className="eyebrow">لا توجد نتيجة مطابقة</p><h2>جرّب منطقة أو فئة أو نوع معلم آخر.</h2><button type="button" className="button button-ink" onClick={() => { setQuery(""); setCity("الكل"); setLandmarkType("الكل"); setRegion("الكل"); setCategory("الكل"); setSort("default"); }}>عرض كل الوجهات</button></div>}
      </section>
    </SiteShell>
  );
}
