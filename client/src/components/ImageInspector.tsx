/**
 * Design reminder — «دفاتر الرحّالة»: كل صورة وثيقة من مسار الرحلة،
 * تحمل اسمها ومصدرها ونقطتها الجغرافية، وتفتح في عارض هادئ يركز على التفاصيل.
 */
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { MapView } from "@/components/Map";
import { assets, destinations } from "@/lib/content";
import { ExternalLink, MapPin, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";

type Position = { lat: number; lng: number };
type ImageRecord = { src: string; alt: string; location?: string; coordinates?: string; position?: Position };
type HoverRecord = ImageRecord & { x: number; y: number };

const sourceLabel = "أرشيف الصور المرفق لمنصة Visit Libya";
const imageZoomEvent = "visit-libya:image-zoom";

export function requestImageZoom(src: string, alt: string) {
  window.dispatchEvent(new CustomEvent(imageZoomEvent, { detail: { src, alt } }));
}

function sameImage(src: string, candidate: string) {
  return src.split("?")[0].endsWith(candidate);
}

function toPosition(value?: string): Position | undefined {
  const values = value?.match(/-?\d+(?:\.\d+)?/g);
  if (!values || values.length < 2) return undefined;
  return { lat: Number(values[0]), lng: Number(values[1]) };
}

function imageRecord(image: HTMLImageElement): ImageRecord {
  const src = image.currentSrc || image.src;
  const destination = destinations.find((item) => sameImage(src, item.image));
  const photo = destinations.flatMap((item) => item.gallery).find((item) => sameImage(src, item.image));
  const match = photo ?? destination?.gallery[0];
  return { src, alt: image.alt || "صورة من المنصة", location: match?.location, coordinates: match?.coordinates, position: toPosition(match?.coordinates) };
}

function canInspect(target: EventTarget | null): target is HTMLImageElement {
  return target instanceof HTMLImageElement && Boolean(target.closest("main")) && !target.closest(".gallery-thumbnails") && !target.closest("[data-no-lightbox]");
}

function AtlasPinMap({ position, title }: { position: Position; title: string }) {
  return <MapView key={`${position.lat}-${position.lng}`} className="lightbox-map" initialCenter={position} initialZoom={14} onMapReady={(map) => {
    new window.google.maps.marker.AdvancedMarkerElement({ map, position, title });
  }} />;
}

export function ImageInspector() {
  const [hovered, setHovered] = useState<HoverRecord | null>(null);
  const [active, setActive] = useState<ImageRecord | null>(null);

  useEffect(() => {
    const onOver = (event: PointerEvent) => {
      if (!canInspect(event.target)) return;
      const image = event.target;
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `تكبير الصورة: ${image.alt || "صورة من المنصة"}`);
      setHovered({ ...imageRecord(image), x: event.clientX, y: event.clientY });
    };
    const onMove = (event: PointerEvent) => {
      if (!canInspect(event.target)) return;
      setHovered((current) => current ? { ...current, x: event.clientX, y: event.clientY } : current);
    };
    const onOut = (event: PointerEvent) => { if (canInspect(event.target)) setHovered(null); };
    const openFromTarget = (target: EventTarget | null) => { if (canInspect(target)) setActive(imageRecord(target)); };
    const onClick = (event: MouseEvent) => {
      if (!canInspect(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      openFromTarget(event.target);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && canInspect(event.target)) {
        event.preventDefault();
        openFromTarget(event.target);
      }
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown);
    const onRequestedZoom = (event: Event) => {
      const detail = (event as CustomEvent<{ src?: string; alt?: string }>).detail;
      const src = detail?.src;
      if (!src) return;
      const image = Array.from(document.images).find((candidate) => sameImage(candidate.currentSrc || candidate.src, src));
      setActive(image ? imageRecord(image) : { src, alt: detail.alt ?? "صورة من المنصة" });
    };
    window.addEventListener(imageZoomEvent, onRequestedZoom);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(imageZoomEvent, onRequestedZoom);
    };
  }, []);

  const atlasHref = active?.position ? `${assets.atlasPublicUrl}#place=${encodeURIComponent(active.location ?? active.alt)}&lat=${active.position.lat}&lng=${active.position.lng}` : assets.atlasPublicUrl;

  return <>
    {hovered && <div className="photo-hover-note" style={{ left: Math.min(hovered.x + 18, window.innerWidth - 290), top: Math.min(hovered.y + 18, window.innerHeight - 90) }}><ZoomIn size={14} /><div><strong>{hovered.alt}</strong><span>{hovered.location ? `${hovered.location} · ${hovered.coordinates}` : `المصدر: ${sourceLabel}`}</span></div></div>}
    <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
      <DialogContent className="image-lightbox" showCloseButton={false} dir="rtl">
        {active && <><button type="button" className="lightbox-close" onClick={() => setActive(null)} aria-label="إغلاق الصورة"><X size={21} /></button><DialogTitle className="sr-only">{active.alt}</DialogTitle><DialogDescription className="sr-only">{sourceLabel}</DialogDescription><img src={active.src} alt={active.alt} /><div className="lightbox-caption"><p><MapPin size={15} /> {active.alt}</p><span>{active.location ? `${active.location} · ${active.coordinates}` : `المصدر: ${sourceLabel}`}</span></div>{active.position && <div className="lightbox-atlas"><div><p className="eyebrow">نقطة الصورة</p><h3>{active.location}</h3><p>{active.coordinates} · أدر الخريطة أو كبّرها لرؤية موضع المعلم.</p></div><AtlasPinMap position={active.position} title={active.location ?? active.alt} /><a href={atlasHref} target="_blank" rel="noreferrer" className="button button-ink">افتح أطلس ليبيا السياحي <ExternalLink size={15} /></a></div>}</>}
      </DialogContent>
    </Dialog>
  </>;
}
