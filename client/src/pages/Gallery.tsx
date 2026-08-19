import { ExternalLink, Images, MapPin, Search, SlidersHorizontal, X, ZoomIn } from "lucide-react";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { assets, destinations, type Destination } from "@/lib/content";
import { atlasImageHref, atlasImageLabel } from "@/lib/atlasLabels";
import { requestImageZoom } from "@/components/ImageInspector";
import { useLanguage } from "@/contexts/LanguageContext";

type PhotoCategory = "all" | Destination["category"];
type GalleryPhoto = Destination["gallery"][number] & { destination: Destination };

const galleryLabels = {
  ar: { eyebrow: "أرشيف المركز", title: "ليبيا، كما تحفظها الصورة.", copy: "معرض ميداني من صور مركز المعلومات والتوثيق السياحي؛ كل لقطة مرتبطة بمكانها ومصدرها ومعلَمها.", all: "كل الصور", filter: "التصفية", city: "المدينة أو الموقع", type: "نوع الوجهة", search: "ابحث باسم المكان أو المعلم", count: "لقطة موثقة", zoom: "تكبير الصورة", atlas: "افتح في الأطلس", visit: "ملف الوجهة", archive: "أرشيف الصور المرفق لمنصة Visit Libya", reset: "مسح الفلاتر", empty: "لا توجد لقطات مطابقة للفلاتر الحالية." },
  en: { eyebrow: "Center archive", title: "Libya, preserved in the image.", copy: "A field gallery from the Tourism Information and Documentation Center; every image is linked to its place, source, and landmark.", all: "All photographs", filter: "Filters", city: "City or site", type: "Destination type", search: "Search a place or landmark", count: "documented photographs", zoom: "Enlarge image", atlas: "Open in Atlas", visit: "Destination file", archive: "Visit Libya supplied image archive", reset: "Clear filters", empty: "No photographs match the current filters." },
  fr: { eyebrow: "Archives du Centre", title: "La Libye, préservée par l’image.", copy: "Galerie de terrain du Centre d’information et de documentation touristique.", all: "Toutes les images", filter: "Filtres", city: "Ville ou site", type: "Type de destination", search: "Rechercher un lieu", count: "images documentées", zoom: "Agrandir", atlas: "Ouvrir dans l’Atlas", visit: "Fiche destination", archive: "Archives photo Visit Libya", reset: "Effacer les filtres", empty: "Aucune image ne correspond aux filtres." },
  it: { eyebrow: "Archivio del Centro", title: "La Libia, custodita nell’immagine.", copy: "Galleria sul campo del Centro di informazione e documentazione turistica.", all: "Tutte le immagini", filter: "Filtri", city: "Città o sito", type: "Tipo di destinazione", search: "Cerca un luogo", count: "immagini documentate", zoom: "Ingrandisci", atlas: "Apri nell’Atlante", visit: "Scheda destinazione", archive: "Archivio fotografico Visit Libya", reset: "Cancella filtri", empty: "Nessuna immagine corrisponde ai filtri." },
  de: { eyebrow: "Zentrumsarchiv", title: "Libyen, im Bild bewahrt.", copy: "Feldgalerie des Tourismus-Informations- und Dokumentationszentrums.", all: "Alle Bilder", filter: "Filter", city: "Stadt oder Ort", type: "Reisezieltyp", search: "Ort suchen", count: "dokumentierte Bilder", zoom: "Vergrößern", atlas: "Im Atlas öffnen", visit: "Zielprofil", archive: "Visit Libya Bildarchiv", reset: "Filter löschen", empty: "Keine Bilder entsprechen den Filtern." },
  es: { eyebrow: "Archivo del Centro", title: "Libia, preservada en la imagen.", copy: "Galería de campo del Centro de Información y Documentación Turística.", all: "Todas las imágenes", filter: "Filtros", city: "Ciudad o sitio", type: "Tipo de destino", search: "Buscar lugar", count: "imágenes documentadas", zoom: "Ampliar", atlas: "Abrir en el Atlas", visit: "Ficha del destino", archive: "Archivo fotográfico Visit Libya", reset: "Limpiar filtros", empty: "No hay imágenes que coincidan con los filtros." },
  zh: { eyebrow: "中心档案", title: "以影像保存的利比亚。", copy: "旅游信息与文献中心的实地图片库。", all: "全部图片", filter: "筛选", city: "城市或遗址", type: "目的地类型", search: "搜索地点", count: "已记录图片", zoom: "放大图片", atlas: "在地图集中打开", visit: "目的地档案", archive: "Visit Libya 图片档案", reset: "清除筛选", empty: "没有符合当前筛选条件的图片。" },
} as const;

const typeLabels: Record<Destination["category"], string> = { مدينة: "مدن", تراث: "تراث", طبيعة: "طبيعة", ساحل: "سواحل" };

export default function Gallery() {
  const { language } = useLanguage();
  const copy = galleryLabels[language];
  const [category, setCategory] = useState<PhotoCategory>("all");
  const [destinationId, setDestinationId] = useState("all");
  const [query, setQuery] = useState("");
  const photos = useMemo<GalleryPhoto[]>(() => destinations.flatMap((destination) => destination.gallery.map((photo) => ({ ...photo, destination }))), []);
  const visiblePhotos = useMemo(() => photos.filter((photo) => {
    const search = query.trim().toLowerCase();
    const matchingCategory = category === "all" || photo.destination.category === category;
    const matchingDestination = destinationId === "all" || photo.destination.id === destinationId;
    const matchingSearch = !search || [photo.destination.title, photo.destination.city, photo.caption, photo.location, photo.alt].join(" ").toLowerCase().includes(search);
    return matchingCategory && matchingDestination && matchingSearch;
  }), [category, destinationId, photos, query]);
  const resetFilters = () => { setCategory("all"); setDestinationId("all"); setQuery(""); };
  const hasFilters = category !== "all" || destinationId !== "all" || Boolean(query);

  return <SiteShell>
    <section className="gallery-hero">
      <div className="page-frame gallery-hero-grid"><div><p className="eyebrow light"><Images size={15} /> {copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.copy}</p></div><div className="gallery-hero-index"><span>01</span><p>{copy.archive}</p><strong>{photos.length}</strong><small>{copy.count}</small></div></div>
    </section>
    <section className="page-frame gallery-controls" aria-label={copy.filter}>
      <div className="gallery-control-heading"><p className="eyebrow"><SlidersHorizontal size={14} /> {copy.filter}</p><strong>{visiblePhotos.length} {copy.count}</strong></div>
      <div className="gallery-filter-row"><label className="gallery-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} /></label><label><span>{copy.city}</span><select value={destinationId} onChange={(event) => setDestinationId(event.target.value)}><option value="all">{copy.all}</option>{destinations.map((destination) => <option value={destination.id} key={destination.id}>{destination.title}</option>)}</select></label><label><span>{copy.type}</span><select value={category} onChange={(event) => setCategory(event.target.value as PhotoCategory)}><option value="all">{copy.all}</option>{Object.entries(typeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>{hasFilters && <button type="button" className="gallery-reset" onClick={resetFilters}><X size={15} /> {copy.reset}</button>}</div>
      <div className="gallery-type-tabs" role="tablist" aria-label={copy.type}><button type="button" className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")}>{copy.all}</button>{Object.entries(typeLabels).map(([value, label]) => <button type="button" key={value} className={category === value ? "is-active" : ""} onClick={() => setCategory(value as PhotoCategory)}>{label}</button>)}</div>
    </section>
    <section className="page-frame gallery-masonry" aria-live="polite">
      {visiblePhotos.map((photo, index) => { const reference = { destinationId: photo.destination.id, destinationTitle: photo.destination.title, photoIndex: photo.destination.gallery.findIndex((item) => item.image === photo.image), location: photo.location, coordinates: photo.coordinates }; return <article className="gallery-photo-card" key={`${photo.destination.id}-${photo.image}`}><div className="gallery-photo-frame" data-no-lightbox><button type="button" onClick={() => requestImageZoom(photo.image, photo.alt)} aria-label={`${copy.zoom}: ${photo.alt}`}><img src={photo.image} alt={photo.alt} loading={index < 8 ? "eager" : "lazy"} /></button><span className="gallery-card-index">{String(index + 1).padStart(2, "0")}</span><span className="gallery-card-place"><MapPin size={13} /> {photo.destination.city}</span></div><div className="gallery-photo-meta"><p>{photo.destination.landmarkType}</p><h2>{photo.caption}</h2><span><MapPin size={13} /> {photo.location}</span><small>{photo.coordinates}</small><div><Link href={`/destinations/${photo.destination.id}`}>{copy.visit}</Link><a href={atlasImageHref(assets.atlasPublicUrl, reference)} target="_blank" rel="noreferrer">{copy.atlas} <ExternalLink size={13} /></a></div><em>{copy.archive}</em></div></article>; })}
      {visiblePhotos.length === 0 && <div className="gallery-empty"><Images size={28} /><p>{copy.empty}</p><button type="button" onClick={resetFilters}>{copy.reset}</button></div>}
    </section>
  </SiteShell>;
}
