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
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { HeroPhotoCredit } from "@/components/HeroPhotoCredit";
import { atlasImageHref, atlasImageLabel } from "@/lib/atlasLabels";
import { TranslationSuggestionForm } from "@/components/TranslationSuggestionForm";

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
  const [, publicParams] = useRoute("/destinations/:id");
  const [, localizedParams] = useRoute("/:locale/destinations/:id");
  const destination = destinations.find((item) => item.id === (publicParams?.id ?? localizedParams?.id));
  const { stops, toggleStop, favorites, toggleFavorite } = useTrip();
  const { language } = useLanguage();
  const destinationTranslation = trpc.destination.translate.useQuery({ id: destination?.id ?? "missing", language: language === "ar" ? "en" : language }, { enabled: Boolean(destination) && language !== "ar", staleTime: Infinity, retry: 1 });

  if (!destination) return <SiteShell><section className="page-frame destination-missing"><p className="eyebrow">الملف غير متاح</p><h1>لم نعثر على صفحة هذه الوجهة.</h1><Link href="/destinations" className="button button-ink">العودة إلى الوجهات <ArrowLeft size={16} /></Link></section></SiteShell>;

  const translated = destinationTranslation.data?.translated ? destinationTranslation.data : null;
  const view = translated ? { ...destination, ...translated } : destination;
  const gallery = translated ? destination.gallery.map((photo, index) => ({ ...photo, ...translated.gallery[index] })) : destination.gallery;
  const primaryPhoto = gallery[0];
  const isStop = stops.includes(destination.id);
  const isFavorite = favorites.includes(destination.id);
  const activities = translated?.activities ?? activityMap[destination.id] ?? destination.highlights;
  const atlasHref = atlasImageHref(assets.atlasPublicUrl, { destinationId: destination.id, destinationTitle: view.title, photoIndex: 0, location: primaryPhoto.location, coordinates: primaryPhoto.coordinates });
  const exportBrochure = () => {
    const popup = window.open("", "_blank");
    if (!popup) return;
    const highlights = view.highlights.map((item: string) => `<li>${item}</li>`).join("");
    const activityList = activities.map((item: string) => `<li>${item}</li>`).join("");
    popup.document.write(`<!doctype html><html lang="${language}" dir="${language === "ar" ? "rtl" : "ltr"}"><head><meta charset="utf-8"/><title>${view.title} | Visit Libya</title><style>body{font-family:Tahoma,Arial,sans-serif;color:#06294a;margin:36px;line-height:1.8}header{border-bottom:3px solid #c89b3c;padding-bottom:14px;margin-bottom:20px}h1{margin:0;font-size:30px}h2{margin:24px 0 8px;color:#174f64}img{width:100%;max-height:260px;object-fit:cover;margin:15px 0;border:1px solid #d9d2c6}ul{padding-inline-start:22px}footer{margin-top:26px;border-top:1px solid #d9d2c6;padding-top:10px;color:#50647a;font-size:12px}</style></head><body><header><h1>${view.title}</h1><p>${view.city} · ${view.region} · Visit Libya</p></header><img src="${destination.image}" alt="${destination.alt}"/><p>${view.description}</p><h2>${language === "ar" ? "أبرز المعالم" : "Highlights"}</h2><ul>${highlights}</ul><h2>${language === "ar" ? "مقترحات للزيارة" : "Visit suggestions"}</h2><ul>${activityList}</ul><p><strong>${language === "ar" ? "الوقت المقترح" : "Suggested time"}:</strong> ${view.time}</p><footer>Visit Libya · ${language === "ar" ? "راجِع الجهات المحلية لتأكيد المواعيد والخدمات ومسارات الوصول." : "Check local authorities for current arrangements and access."}</footer><script>window.print()</script></body></html>`);
    popup.document.close();
  };

  return <SiteShell>
    <section className="destination-detail-hero landmark-hero">
      <img className="landmark-hero-image" src={destination.image} alt={destination.alt} fetchPriority="high" /><div className="landmark-hero-ink" aria-hidden="true" />
      <div className="page-frame"><Link href="/destinations" className="detail-back">العودة إلى فهرس الوجهات <ArrowLeft size={15} /></Link><p className="eyebrow light"><MapPin size={13} /> {view.city} · {view.region}</p><h1>{view.title}</h1><p>{view.fieldNote}</p>{destinationTranslation.isFetching && <span className="detail-translation-status">جارٍ تجهيز الترجمة المعتمدة…</span>}<div className="detail-hero-actions"><button type="button" className={`button button-light ${isStop ? "is-saved" : ""}`} onClick={() => toggleStop(destination.id)}>{isStop ? <Check size={16} /> : <Route size={16} />}{isStop ? "أُضيف إلى المسار" : "أضف إلى مساري"}</button><button type="button" className={`detail-favorite ${isFavorite ? "is-favorite" : ""}`} onClick={() => toggleFavorite(destination.id)}><Heart size={17} fill={isFavorite ? "currentColor" : "none"} /> {isFavorite ? "محفوظة" : "احفظ الوجهة"}</button><button type="button" className="detail-brochure" onClick={exportBrochure}><Printer size={16} /> كتيب PDF</button></div></div>
      <HeroPhotoCredit landmark={primaryPhoto.caption} />
    </section>
    <section className="page-frame destination-detail-overview"><div><p className="eyebrow">ملف الوجهة · {view.landmarkType}</p><h2>ما الذي يجعلها<br />محطة لا تُنسى؟</h2></div><div><p>{view.description}</p><ul>{view.highlights.map((item: string) => <li key={item}>{item}</li>)}</ul><span><Compass size={15} /> الوقت المقترح: {view.time}</span></div></section>
    <section className="page-frame destination-activity-section"><div className="activity-heading"><p className="eyebrow">اختر التجربة</p><h2>ثلاث طرق<br />لقراءة المكان.</h2></div><div className="activity-list">{activities.map((activity: string, index: number) => <article key={activity}><span>0{index + 1}</span><p>{activity}</p></article>)}</div></section>
    <section className="page-frame destination-detail-gallery"><div className="detail-gallery-heading"><p className="eyebrow">الألبوم الميداني</p><h2>صور من {view.title}</h2><p>انقر على أي صورة لتكبيرها وقراءة نقطة التقاطها وموقعها على الخريطة.</p></div><div className="detail-gallery-grid">{gallery.map((photo, index) => { const reference = { destinationId: destination.id, destinationTitle: view.title, photoIndex: index, location: photo.location, coordinates: photo.coordinates }; return <figure key={photo.image} data-atlas-label={atlasImageLabel(reference)}><img src={photo.image} alt={photo.alt} /><figcaption><span>لقطة {String(index + 1).padStart(2, "0")}</span><h3>{photo.caption}</h3><p><MapPin size={14} /> {photo.location}</p><small>{photo.coordinates}</small><a className="atlas-image-label" href={atlasImageHref(assets.atlasPublicUrl, reference)} target="_blank" rel="noreferrer">{atlasImageLabel(reference)}</a></figcaption></figure>; })}</div></section>
    <section className="destination-atlas-section"><div className="page-frame destination-atlas-grid"><div><p className="eyebrow light">نقطة المعلم</p><h2>{primaryPhoto.location}</h2><p>{primaryPhoto.coordinates} · حرّك الخريطة أو كبّرها لقراءة المحيط، ثم افتح الأطلس لمتابعة الاستكشاف.</p><a href={atlasHref} target="_blank" rel="noreferrer" className="button button-sand">افتح أطلس ليبيا السياحي <ExternalLink size={16} /></a></div><DestinationMap title={view.title} coordinates={primaryPhoto.coordinates} atlasHref={atlasHref} /></div></section>
    <TranslationSuggestionForm destinationId={destination.id} />
    <section className="page-frame detail-route-end"><Sparkles size={20} /><div><p className="eyebrow">المحطة التالية</p><h2>أضفها إلى مسارك، ثم رتّب ما يليها.</h2></div><Link href="/trip" className="button button-ink">افتح مخطط الرحلة <ArrowLeft size={16} /></Link></section>
  </SiteShell>;
}
