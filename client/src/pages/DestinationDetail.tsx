/**
 * Design reminder — ملف مدينة مستقل يقرأ كصفحة من الدليل: صورة افتتاحية، ملاحظات
 * مكانية، نشاطات، صور موثقة، ثم خريطة/أطلس ومسار شخصي.
 */
import { ArrowLeft, Check, Compass, ExternalLink, Heart, MapPin, Printer, Route, Sparkles } from "lucide-react";
import { Link, useRoute } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { MapView } from "@/components/Map";
import { assets, destinations } from "@/lib/content";
import { useTrip } from "@/contexts/TripContext";

const activityMap: Record<string, string[]> = {
  tripoli: ["جولة مشي هادئة في الأزقة والأسواق", "التوقف عند قوس ماركوس أوريليوس", "قراءة الواجهة البحرية والسرايا الحمراء"],
  benghazi: ["التنزه على الواجهة البحرية", "اكتشاف الذاكرة الحضرية للمدينة", "إدراجها كبداية لمسار الجبل الأخضر"],
  ghadames: ["استكشاف الممرات المظللة", "التعرف إلى منطق البيت الواحي", "زيارة الحِرف والأسواق المحلية مع مرشد"],
  acacus: ["سفاري منظم مع مرشد محلي", "قراءة الفن الصخري والتكوينات", "التخييم ضمن ترتيب آمن ومسبق"],
  leptis: ["المشي عبر الساحات والأقواس", "تتبع تخطيط المدينة الأثرية", "التوقف عند المشاهد الساحلية القريبة"],
  shahat: ["زيارة المعابد والمدرجات الكلاسيكية", "دمج قورينا مع مسار الجبل الأخضر", "قراءة الطبيعة والآثار في رحلة واحدة"],
  sabratha: ["التأمل في المسرح الأثري", "اتباع مسار المدينة الرومانية", "التوقف عند المشهد الساحلي"],
};

function positionFromCoordinates(value: string) {
  const parts = value.match(/-?\d+(?:\.\d+)?/g) ?? [];
  return { lat: Number(parts[0] ?? 32.887), lng: Number(parts[1] ?? 13.180) };
}

function DestinationMap({ title, coordinates, atlasHref }: { title: string; coordinates: string; atlasHref: string }) {
  const position = positionFromCoordinates(coordinates);
  return <MapView key={coordinates} className="destination-map" initialCenter={position} initialZoom={13} fallbackHref={atlasHref} onMapReady={(map) => {
    new window.google.maps.marker.AdvancedMarkerElement({ map, position, title });
  }} />;
}

export default function DestinationDetail() {
  const [, params] = useRoute("/destinations/:id");
  const destination = destinations.find((item) => item.id === params?.id);
  const { stops, toggleStop, favorites, toggleFavorite } = useTrip();

  if (!destination) return <SiteShell><section className="page-frame destination-missing"><p className="eyebrow">الملف غير متاح</p><h1>لم نعثر على صفحة هذه الوجهة.</h1><Link href="/destinations" className="button button-ink">العودة إلى الوجهات <ArrowLeft size={16} /></Link></section></SiteShell>;

  const primaryPhoto = destination.gallery[0];
  const isStop = stops.includes(destination.id);
  const isFavorite = favorites.includes(destination.id);
  const activities = activityMap[destination.id] ?? destination.highlights;
  const atlasHref = `${assets.atlasPublicUrl}#place=${encodeURIComponent(primaryPhoto.location)}&lat=${positionFromCoordinates(primaryPhoto.coordinates).lat}&lng=${positionFromCoordinates(primaryPhoto.coordinates).lng}`;
  const exportBrochure = () => {
    const popup = window.open("", "_blank");
    if (!popup) return;
    const highlights = destination.highlights.map((item) => `<li>${item}</li>`).join("");
    const activityList = activities.map((item) => `<li>${item}</li>`).join("");
    popup.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"/><title>كتيب ${destination.title} | Visit Libya</title><style>body{font-family:Tahoma,Arial,sans-serif;color:#06294a;margin:36px;line-height:1.8}header{border-bottom:3px solid #c89b3c;padding-bottom:14px;margin-bottom:20px}h1{margin:0;font-size:30px}h2{margin:24px 0 8px;color:#174f64}img{width:100%;max-height:260px;object-fit:cover;margin:15px 0;border:1px solid #d9d2c6}ul{padding-right:22px}footer{margin-top:26px;border-top:1px solid #d9d2c6;padding-top:10px;color:#50647a;font-size:12px}</style></head><body><header><h1>${destination.title}</h1><p>${destination.city} · ${destination.region} · Visit Libya</p></header><img src="${destination.image}" alt="${destination.alt}"/><p>${destination.description}</p><h2>أبرز المعالم</h2><ul>${highlights}</ul><h2>مقترحات للزيارة</h2><ul>${activityList}</ul><p><strong>الوقت المقترح:</strong> ${destination.time}</p><footer>تصميم وتنفيذ مركز المعلومات والتوثيق السياحي © 2026<br/>راجِع الجهات المحلية لتأكيد المواعيد والخدمات ومسارات الوصول.</footer><script>window.print()</script></body></html>`);
    popup.document.close();
  };

  return <SiteShell>
    <section className="destination-detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(4, 31, 58, 0.88), rgba(4, 31, 58, 0.27)), url(${destination.image})` }}>
      <div className="page-frame"><Link href="/destinations" className="detail-back">العودة إلى فهرس الوجهات <ArrowLeft size={15} /></Link><p className="eyebrow light"><MapPin size={13} /> {destination.city} · {destination.region}</p><h1>{destination.title}</h1><p>{destination.fieldNote}</p><div className="detail-hero-actions"><button type="button" className={`button button-light ${isStop ? "is-saved" : ""}`} onClick={() => toggleStop(destination.id)}>{isStop ? <Check size={16} /> : <Route size={16} />}{isStop ? "أُضيف إلى المسار" : "أضف إلى مساري"}</button><button type="button" className={`detail-favorite ${isFavorite ? "is-favorite" : ""}`} onClick={() => toggleFavorite(destination.id)}><Heart size={17} fill={isFavorite ? "currentColor" : "none"} /> {isFavorite ? "محفوظة" : "احفظ الوجهة"}</button><button type="button" className="detail-brochure" onClick={exportBrochure}><Printer size={16} /> كتيب PDF</button></div></div>
    </section>
    <section className="page-frame destination-detail-overview"><div><p className="eyebrow">ملف الوجهة · {destination.landmarkType}</p><h2>ما الذي يجعلها<br />محطة لا تُنسى؟</h2></div><div><p>{destination.description}</p><ul>{destination.highlights.map((item) => <li key={item}>{item}</li>)}</ul><span><Compass size={15} /> الوقت المقترح: {destination.time}</span></div></section>
    <section className="page-frame destination-activity-section"><div className="activity-heading"><p className="eyebrow">اختر التجربة</p><h2>ثلاث طرق<br />لقراءة المكان.</h2></div><div className="activity-list">{activities.map((activity, index) => <article key={activity}><span>0{index + 1}</span><p>{activity}</p></article>)}</div></section>
    <section className="page-frame destination-detail-gallery"><div className="detail-gallery-heading"><p className="eyebrow">الألبوم الميداني</p><h2>صور من {destination.title}</h2><p>انقر على أي صورة لتكبيرها وقراءة نقطة التقاطها وموقعها على الخريطة.</p></div><div className="detail-gallery-grid">{destination.gallery.map((photo, index) => <figure key={photo.image}><img src={photo.image} alt={photo.alt} /><figcaption><span>لقطة {String(index + 1).padStart(2, "0")}</span><h3>{photo.caption}</h3><p><MapPin size={14} /> {photo.location}</p><small>{photo.coordinates}</small></figcaption></figure>)}</div></section>
    <section className="destination-atlas-section"><div className="page-frame destination-atlas-grid"><div><p className="eyebrow light">نقطة المعلم</p><h2>{primaryPhoto.location}</h2><p>{primaryPhoto.coordinates} · حرّك الخريطة أو كبّرها لقراءة المحيط، ثم افتح الأطلس لمتابعة الاستكشاف.</p><a href={atlasHref} target="_blank" rel="noreferrer" className="button button-sand">افتح أطلس ليبيا السياحي <ExternalLink size={16} /></a></div><DestinationMap title={destination.title} coordinates={primaryPhoto.coordinates} atlasHref={atlasHref} /></div></section>
    <section className="page-frame detail-route-end"><Sparkles size={20} /><div><p className="eyebrow">المحطة التالية</p><h2>أضفها إلى مسارك، ثم رتّب ما يليها.</h2></div><Link href="/trip" className="button button-ink">افتح مخطط الرحلة <ArrowLeft size={16} /></Link></section>
  </SiteShell>;
}
