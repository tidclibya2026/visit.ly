import { Check, Download, ExternalLink, Heart, Images, Link2, MapPin, Search, Share2, SlidersHorizontal, X } from "lucide-react";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { assets, cultureVisualArchive, destinations, foodCraftVisualArchive, type Destination } from "@/lib/content";
import { atlasImageHref, atlasImageLabel } from "@/lib/atlasLabels";
import { requestImageZoom } from "@/components/ImageInspector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTrip } from "@/contexts/TripContext";
import { buildSharedGalleryFavoritesUrl } from "@/contexts/tripSharing";

type PhotoCategory = "all" | Destination["category"];
type GalleryPhoto = Destination["gallery"][number] & { destination: Destination };
type Season = "all" | "spring" | "summer" | "autumn" | "winter" | "year";
type Album = "all" | "food" | "craft" | "folklore";

const galleryLabels = {
  ar: { eyebrow: "أرشيف المركز", title: "ليبيا، كما تحفظها الصورة.", copy: "معرض ميداني من صور مركز المعلومات والتوثيق السياحي؛ كل لقطة مرتبطة بمكانها ومصدرها ومعلَمها.", all: "كل الصور", filter: "التصفية", city: "المدينة أو الموقع", type: "نوع الوجهة", season: "موسم الزيارة", albums: "ألبومات موضوعية", favorites: "المفضلة", favoritesOnly: "المفضلة فقط", folkloreFile: "افتح ملف الفلكلور", craftsFile: "افتح ملف الحِرف", exportFavorites: "تصدير المفضلة", shareFavorites: "مشاركة المفضلة", search: "ابحث باسم المكان أو المعلم", count: "لقطة موثقة", zoom: "تكبير الصورة", atlas: "افتح في الأطلس", visit: "ملف الوجهة", archive: "أرشيف الصور المرفق لمنصة Visit Libya", reset: "مسح الفلاتر", share: "نسخ رابط اللقطة", copied: "تم النسخ", empty: "لا توجد لقطات مطابقة للفلاتر الحالية." },
  en: { eyebrow: "Center archive", title: "Libya, preserved in the image.", copy: "A field gallery from the Tourism Information and Documentation Center; every image is linked to its place, source, and landmark.", all: "All photographs", filter: "Filters", city: "City or site", type: "Destination type", season: "Visit season", albums: "Themed albums", favorites: "Favorites", favoritesOnly: "Favorites only", folkloreFile: "Open folklore file", craftsFile: "Open crafts file", exportFavorites: "Export favorites", shareFavorites: "Share favorites", search: "Search a place or landmark", count: "documented photographs", zoom: "Enlarge image", atlas: "Open in Atlas", visit: "Destination file", archive: "Visit Libya supplied image archive", reset: "Clear filters", share: "Copy image link", copied: "Copied", empty: "No photographs match the current filters." },
  fr: { eyebrow: "Archives du Centre", title: "La Libye, préservée par l’image.", copy: "Galerie de terrain du Centre d’information et de documentation touristique.", all: "Toutes les images", filter: "Filtres", city: "Ville ou site", type: "Type de destination", season: "Saison de visite", albums: "Albums thématiques", favorites: "Favoris", favoritesOnly: "Favoris uniquement", folkloreFile: "Ouvrir le dossier folklore", craftsFile: "Ouvrir le dossier artisanat", exportFavorites: "Exporter les favoris", shareFavorites: "Partager les favoris", search: "Rechercher un lieu", count: "images documentées", zoom: "Agrandir", atlas: "Ouvrir dans l’Atlas", visit: "Fiche destination", archive: "Archives photo Visit Libya", reset: "Effacer les filtres", share: "Copier le lien", copied: "Copié", empty: "Aucune image ne correspond aux filtres." },
  it: { eyebrow: "Archivio del Centro", title: "La Libia, custodita nell’immagine.", copy: "Galleria sul campo del Centro di informazione e documentazione turistica.", all: "Tutte le immagini", filter: "Filtri", city: "Città o sito", type: "Tipo di destinazione", season: "Stagione di visita", albums: "Album tematici", favorites: "Preferiti", favoritesOnly: "Solo preferiti", folkloreFile: "Apri dossier folclore", craftsFile: "Apri dossier artigianato", exportFavorites: "Esporta preferiti", shareFavorites: "Condividi preferiti", search: "Cerca un luogo", count: "immagini documentate", zoom: "Ingrandisci", atlas: "Apri nell’Atlante", visit: "Scheda destinazione", archive: "Archivio fotografico Visit Libya", reset: "Cancella filtri", share: "Copia collegamento", copied: "Copiato", empty: "Nessuna immagine corrisponde ai filtri." },
  de: { eyebrow: "Zentrumsarchiv", title: "Libyen, im Bild bewahrt.", copy: "Feldgalerie des Tourismus-Informations- und Dokumentationszentrums.", all: "Alle Bilder", filter: "Filter", city: "Stadt oder Ort", type: "Reisezieltyp", season: "Reisesaison", albums: "Themenalben", favorites: "Favoriten", favoritesOnly: "Nur Favoriten", folkloreFile: "Folklore-Dossier öffnen", craftsFile: "Handwerksdossier öffnen", exportFavorites: "Favoriten exportieren", shareFavorites: "Favoriten teilen", search: "Ort suchen", count: "dokumentierte Bilder", zoom: "Vergrößern", atlas: "Im Atlas öffnen", visit: "Zielprofil", archive: "Visit Libya Bildarchiv", reset: "Filter löschen", share: "Bildlink kopieren", copied: "Kopiert", empty: "Keine Bilder entsprechen den Filtern." },
  es: { eyebrow: "Archivo del Centro", title: "Libia, preservada en la imagen.", copy: "Galería de campo del Centro de Información y Documentación Turística.", all: "Todas las imágenes", filter: "Filtros", city: "Ciudad o sitio", type: "Tipo de destino", season: "Temporada de visita", albums: "Álbumes temáticos", favorites: "Favoritos", favoritesOnly: "Solo favoritos", folkloreFile: "Abrir dossier de folclore", craftsFile: "Abrir dossier de artesanía", exportFavorites: "Exportar favoritos", shareFavorites: "Compartir favoritos", search: "Buscar lugar", count: "imágenes documentadas", zoom: "Ampliar", atlas: "Abrir en el Atlas", visit: "Ficha de destino", archive: "Archivo fotográfico Visit Libya", reset: "Limpiar filtros", share: "Copiar enlace", copied: "Copiado", empty: "No hay imágenes que coincidan con los filtros." },
  zh: { eyebrow: "中心档案", title: "以影像保存的利比亚。", copy: "旅游信息与文献中心的实地图片库。", all: "全部图片", filter: "筛选", city: "城市或遗址", type: "目的地类型", season: "游览季节", albums: "主题相册", favorites: "收藏", favoritesOnly: "仅收藏", folkloreFile: "打开民俗档案", craftsFile: "打开手工艺档案", exportFavorites: "导出收藏", shareFavorites: "分享收藏", search: "搜索地点", count: "已记录图片", zoom: "放大图片", atlas: "在地图集中打开", visit: "目的地档案", archive: "Visit Libya 图片档案", reset: "清除筛选", share: "复制图片链接", copied: "已复制", empty: "没有符合当前筛选条件的图片。" },
} as const;

const typeLabels: Record<Destination["category"], string> = { مدينة: "مدن", تراث: "تراث", طبيعة: "طبيعة", ساحل: "سواحل" };
const seasonLabels: Record<Season, string> = { all: "كل المواسم", spring: "الربيع", summer: "الصيف", autumn: "الخريف", winter: "الشتاء", year: "على مدار العام" };
const albumLabels: Record<Album, string> = { all: "كل الألبومات", food: "المذاقات والحلويات", craft: "الحِرف والصناعات", folklore: "الفلكلور والمناسبات" };
const seasonalContext: Record<string, Season[]> = { tripoli: ["spring", "autumn", "winter"], benghazi: ["spring", "summer", "autumn"], ghadames: ["autumn", "winter", "spring"], acacus: ["autumn", "winter", "spring"], leptis: ["spring", "autumn", "winter"], shahat: ["spring", "summer", "autumn"], sabratha: ["spring", "autumn", "winter"], tolmeitha: ["spring", "summer", "autumn"], qasrLibya: ["spring", "summer", "autumn"], awjila: ["autumn", "winter", "spring"] };

export default function Gallery() {
  const { language } = useLanguage();
  const { galleryFavorites, toggleGalleryFavorite } = useTrip();
  const copy = galleryLabels[language];
  const [category, setCategory] = useState<PhotoCategory>("all");
  const [destinationId, setDestinationId] = useState("all");
  const [season, setSeason] = useState<Season>("all");
  const [album, setAlbum] = useState<Album>("all");
  const [query, setQuery] = useState("");
  const [copiedPhoto, setCopiedPhoto] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoritesStatus, setFavoritesStatus] = useState("");
  const photos = useMemo<GalleryPhoto[]>(() => destinations.flatMap((destination) => destination.gallery.map((photo) => ({ ...photo, destination }))), []);
  const visiblePhotos = useMemo(() => photos.filter((photo) => {
    const search = query.trim().toLowerCase();
    const matchingCategory = category === "all" || photo.destination.category === category;
    const matchingDestination = destinationId === "all" || photo.destination.id === destinationId;
    const matchingSeason = season === "all" || (season === "year" ? ["tripoli", "benghazi"].includes(photo.destination.id) : (seasonalContext[photo.destination.id] ?? []).includes(season));
    const matchingFavorite = !favoritesOnly || galleryFavorites.includes(`photo:${photo.destination.id}-${photo.destination.gallery.findIndex((item) => item.image === photo.image)}`);
    const matchingSearch = !search || [photo.destination.title, photo.destination.city, photo.caption, photo.location, photo.alt].join(" ").toLowerCase().includes(search);
    return matchingCategory && matchingDestination && matchingSeason && matchingFavorite && matchingSearch;
  }), [category, destinationId, favoritesOnly, galleryFavorites, photos, query, season]);
  const themedAlbums = useMemo(() => ({ food: foodCraftVisualArchive.slice(0, 2), craft: foodCraftVisualArchive.slice(2), folklore: cultureVisualArchive }), []);
  const activeAlbumItems = album === "all" ? [] : themedAlbums[album];
  const resetFilters = () => { setCategory("all"); setDestinationId("all"); setSeason("all"); setAlbum("all"); setFavoritesOnly(false); setQuery(""); };
  const hasFilters = category !== "all" || destinationId !== "all" || season !== "all" || album !== "all" || favoritesOnly || Boolean(query);
  const copyPhotoLink = async (photo: GalleryPhoto) => {
    const reference = `${window.location.origin}/gallery#photo=${encodeURIComponent(`${photo.destination.id}-${photo.destination.gallery.findIndex((item) => item.image === photo.image)}`)}`;
    try { await navigator.clipboard.writeText(reference); } catch { window.prompt(copy.share, reference); }
    setCopiedPhoto(`${photo.destination.id}-${photo.image}`);
    window.setTimeout(() => setCopiedPhoto(null), 1800);
  };
  const exportFavorites = () => {
    const favoriteItems = galleryFavorites.map((favoriteId) => ({ id: favoriteId, type: favoriteId.split(":")[0] }));
    const payload = { platform: "Visit Libya", exportedAt: new Date().toISOString(), favorites: favoriteItems };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "visit-libya-gallery-favorites.json";
    anchor.click();
    URL.revokeObjectURL(objectUrl);
    setFavoritesStatus("تم تنزيل قائمة المفضلة بصيغة JSON.");
  };
  const shareFavorites = async () => {
    const link = buildSharedGalleryFavoritesUrl(window.location.href, galleryFavorites);
    try {
      if (navigator.share) await navigator.share({ title: "مفضلات جاليري Visit Libya", text: "استكشف صوري وألبوماتي المفضلة من Visit Libya.", url: link });
      else await navigator.clipboard.writeText(link);
      setFavoritesStatus("تم تجهيز رابط المفضلات للمشاركة.");
    } catch {
      try { await navigator.clipboard.writeText(link); setFavoritesStatus("تم نسخ رابط المفضلات."); }
      catch { window.prompt("انسخ رابط المفضلات", link); }
    }
  };

  return <SiteShell>
    <section className="gallery-hero">
      <div className="page-frame gallery-hero-grid"><div><p className="eyebrow light"><Images size={15} /> {copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.copy}</p></div><div className="gallery-hero-index"><span>01</span><p>{copy.archive}</p><strong>{photos.length}</strong><small>{copy.count}</small></div></div>
    </section>
    <section className="page-frame gallery-controls" aria-label={copy.filter}>
      <div className="gallery-control-heading"><p className="eyebrow"><SlidersHorizontal size={14} /> {copy.filter}</p><div><button type="button" className={favoritesOnly ? "is-active" : ""} onClick={() => setFavoritesOnly((current) => !current)}><Heart size={14} fill={favoritesOnly ? "currentColor" : "none"} /> {copy.favoritesOnly} ({galleryFavorites.filter((id) => id.startsWith("photo:")).length})</button>{galleryFavorites.length > 0 && <><button type="button" onClick={exportFavorites}><Download size={14} /> {copy.exportFavorites}</button><button type="button" onClick={shareFavorites}><Share2 size={14} /> {copy.shareFavorites}</button></>}<strong>{visiblePhotos.length} {copy.count}</strong></div></div>
      {favoritesStatus && <p className="gallery-favorites-status"><Check size={13} /> {favoritesStatus}</p>}
      <div className="gallery-filter-row"><label className="gallery-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} /></label><label><span>{copy.city}</span><select value={destinationId} onChange={(event) => setDestinationId(event.target.value)}><option value="all">{copy.all}</option>{destinations.map((destination) => <option value={destination.id} key={destination.id}>{destination.title}</option>)}</select></label><label><span>{copy.type}</span><select value={category} onChange={(event) => setCategory(event.target.value as PhotoCategory)}><option value="all">{copy.all}</option>{Object.entries(typeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label><span>{copy.season}</span><select value={season} onChange={(event) => setSeason(event.target.value as Season)}>{Object.entries(seasonLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>{hasFilters && <button type="button" className="gallery-reset" onClick={resetFilters}><X size={15} /> {copy.reset}</button>}</div>
      <div className="gallery-type-tabs" role="tablist" aria-label={copy.type}><button type="button" className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")}>{copy.all}</button>{Object.entries(typeLabels).map(([value, label]) => <button type="button" key={value} className={category === value ? "is-active" : ""} onClick={() => setCategory(value as PhotoCategory)}>{label}</button>)}</div>
      <div className="gallery-season-tabs" role="tablist" aria-label={copy.season}>{Object.entries(seasonLabels).map(([value, label]) => <button type="button" key={value} className={season === value ? "is-active" : ""} onClick={() => setSeason(value as Season)}>{label}<small>{value === "all" ? photos.length : photos.filter((photo) => value === "year" ? ["tripoli", "benghazi"].includes(photo.destination.id) : (seasonalContext[photo.destination.id] ?? []).includes(value as Season)).length}</small></button>)}</div>
    </section>
    <section className="page-frame themed-albums" aria-labelledby="themed-albums-title"><div className="themed-albums-heading"><p className="eyebrow">{copy.albums}</p><h2 id="themed-albums-title">ثلاثة مسارات<br />للقراءة الثقافية.</h2></div><div className="themed-albums-grid">{(["food", "craft", "folklore"] as const).map((key) => { const albumFavoriteId = `album:${key}`; const isFavorite = galleryFavorites.includes(albumFavoriteId); return <article key={key} className={album === key ? "is-active" : ""}><button type="button" onClick={() => setAlbum(album === key ? "all" : key)}><img src={themedAlbums[key][0].image} alt={themedAlbums[key][0].alt} /><span>{albumLabels[key]}</span><small>{themedAlbums[key].length} {copy.count}</small></button><button type="button" className="album-favorite" onClick={() => toggleGalleryFavorite(albumFavoriteId)} aria-label={copy.favorites}><Heart size={14} fill={isFavorite ? "currentColor" : "none"} /></button></article>; })}</div></section>
    {album !== "all" && <section className="page-frame active-theme-album" aria-live="polite"><div><p className="eyebrow">{copy.albums}</p><h2>{albumLabels[album]}</h2><p>{copy.archive}</p>{album === "folklore" && <Link href="/albums/folklore" className="folklore-album-link">{copy.folkloreFile} <ExternalLink size={14} /></Link>}{album === "craft" && <Link href="/albums/crafts" className="folklore-album-link">{copy.craftsFile} <ExternalLink size={14} /></Link>}</div><div className="active-theme-album-grid">{activeAlbumItems.map((item) => <article key={item.image}><button type="button" onClick={() => requestImageZoom(item.image, item.alt)}><img src={item.image} alt={item.alt} /><span>{item.label}</span>{"note" in item && <small>{item.note}</small>}</button></article>)}</div></section>}
    <section className="page-frame gallery-masonry" aria-live="polite">
      {visiblePhotos.map((photo, index) => { const photoIndex = photo.destination.gallery.findIndex((item) => item.image === photo.image); const reference = { destinationId: photo.destination.id, destinationTitle: photo.destination.title, photoIndex, location: photo.location, coordinates: photo.coordinates }; const photoId = `${photo.destination.id}-${photo.image}`; const favoriteId = `photo:${photo.destination.id}-${photoIndex}`; const isFavorite = galleryFavorites.includes(favoriteId); return <article className="gallery-photo-card" key={photoId}><div className="gallery-photo-frame" data-no-lightbox><button type="button" onClick={() => requestImageZoom(photo.image, photo.alt)} aria-label={`${copy.zoom}: ${photo.alt}`}><img src={photo.image} alt={photo.alt} loading={index < 8 ? "eager" : "lazy"} /></button><button type="button" className="photo-favorite" onClick={() => toggleGalleryFavorite(favoriteId)} aria-label={copy.favorites}><Heart size={15} fill={isFavorite ? "currentColor" : "none"} /></button><span className="gallery-card-index">{String(index + 1).padStart(2, "0")}</span><span className="gallery-card-place"><MapPin size={13} /> {photo.destination.city}</span></div><div className="gallery-photo-meta"><p>{photo.destination.landmarkType}</p><h2>{photo.caption}</h2><span><MapPin size={13} /> {photo.location}</span><small>{photo.coordinates}</small><div><Link href={`/destinations/${photo.destination.id}`}>{copy.visit}</Link><a href={atlasImageHref(assets.atlasPublicUrl, reference)} target="_blank" rel="noreferrer">{copy.atlas} <ExternalLink size={13} /></a><button type="button" onClick={() => copyPhotoLink(photo)}><Link2 size={13} /> {copiedPhoto === photoId ? <><Check size={13} /> {copy.copied}</> : copy.share}</button></div><em>{copy.archive}</em></div></article>; })}
      {visiblePhotos.length === 0 && <div className="gallery-empty"><Images size={28} /><p>{copy.empty}</p><button type="button" onClick={resetFilters}>{copy.reset}</button></div>}
    </section>
  </SiteShell>;
}
