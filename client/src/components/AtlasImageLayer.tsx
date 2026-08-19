import { Crosshair, Filter, MapPin, ScanLine } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { assets, destinations } from "@/lib/content";
import { atlasImageHref, atlasImageLabel } from "@/lib/atlasLabels";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";

type AtlasPhoto = { destinationId: string; destinationTitle: string; category: "مدينة" | "تراث" | "طبيعة" | "ساحل"; photoIndex: number; image: string; caption: string; location: string; coordinates: string };
const bounds = { north: 33.2, south: 24.3, west: 9.0, east: 25.0 };
function coordinate(value: string) { const [lat = "30", lng = "15"] = value.match(/-?\d+(?:\.\d+)?/g) ?? []; return { lat: Number(lat), lng: Number(lng) }; }

export function AtlasImageLayer() {
  const photos = useMemo<AtlasPhoto[]>(() => destinations.map((destination) => ({ destinationId: destination.id, destinationTitle: destination.title, category: destination.category, photoIndex: 0, image: destination.gallery[0]?.image ?? destination.image, caption: destination.gallery[0]?.caption ?? destination.title, location: destination.gallery[0]?.location ?? destination.city, coordinates: destination.gallery[0]?.coordinates ?? "" })), []);
  const [category, setCategory] = useState<"الكل" | AtlasPhoto["category"]>("الكل");
  const visiblePhotos = category === "الكل" ? photos : photos.filter((photo) => photo.category === category);
  const [activeId, setActiveId] = useState(photos[0]?.destinationId ?? "");
  const active = visiblePhotos.find((photo) => photo.destinationId === activeId) ?? visiblePhotos[0];
  const trackInteraction = useInteractionTracking();
  const placement = (value: string) => { const point = coordinate(value); return { left: `${Math.min(94, Math.max(6, ((point.lng - bounds.west) / (bounds.east - bounds.west)) * 100))}%`, top: `${Math.min(90, Math.max(8, ((bounds.north - point.lat) / (bounds.north - bounds.south)) * 100))}%` }; };
  if (!active) return null;
  const reference = { destinationId: active.destinationId, destinationTitle: active.destinationTitle, photoIndex: active.photoIndex, location: active.location, coordinates: active.coordinates };
  return <section className="page-frame atlas-image-layer" aria-labelledby="atlas-image-layer-title"><div className="atlas-image-layer-intro"><p className="eyebrow"><ScanLine size={14} /> طبقة الصور الموثقة</p><h2 id="atlas-image-layer-title">افتح المعلم من صورته.</h2><p>كل نقطة تمثل صورة ميدانية موثقة ورمزًا جغرافيًا موحدًا، وتفتح ملف المعلم أو موضعه داخل الأطلس.</p></div><div className="atlas-layer-filters" aria-label="تصفية المعالم"><Filter size={15} />{(["الكل", "تراث", "طبيعة", "ساحل", "مدينة"] as const).map((item) => <button type="button" key={item} className={category === item ? "is-active" : ""} onClick={() => { setCategory(item); if (item !== "الكل") setActiveId(photos.find((photo) => photo.category === item)?.destinationId ?? ""); }}>{item}</button>)}</div><div className="atlas-image-layer-grid"><div className="atlas-photo-map" role="list" aria-label="خريطة صور المعالم">{visiblePhotos.map((photo) => <button type="button" role="listitem" aria-label={`${photo.destinationTitle}: ${photo.caption}`} key={photo.destinationId} className={active.destinationId === photo.destinationId ? "is-active" : ""} style={placement(photo.coordinates)} onClick={() => { setActiveId(photo.destinationId); trackInteraction("atlas_marker_select", photo.destinationId); }}><MapPin size={17} /><span>{photo.destinationTitle}</span></button>)}<div className="atlas-photo-map-scale"><Crosshair size={15} /> {visiblePhotos.length} معالم ظاهرة</div></div><article className="atlas-photo-card"><img src={active.image} alt={active.caption} /><div><p className="eyebrow">{atlasImageLabel(reference)}</p><h3>{active.destinationTitle}</h3><p>{active.caption}</p><small><MapPin size={13} /> {active.location} · {active.coordinates}</small><div><Link href={`/destinations/${active.destinationId}`}>ملف المعلم</Link><a href={atlasImageHref(assets.atlasPublicUrl, reference)} target="_blank" rel="noreferrer">الأطلس الوطني</a></div></div></article></div></section>;
}
