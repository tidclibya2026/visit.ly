/**
 * Design reminder — «دفاتر الرحّالة»: كل صورة وثيقة من مسار الرحلة،
 * تحمل اسمها ومصدرها وتفتح في عارض هادئ يركز على التفاصيل.
 */
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { MapPin, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";

type ImageRecord = { src: string; alt: string };
type HoverRecord = ImageRecord & { x: number; y: number };

const sourceLabel = "أرشيف الصور المرفق لمنصة Visit Libya";

function canInspect(target: EventTarget | null): target is HTMLImageElement {
  return target instanceof HTMLImageElement && Boolean(target.closest("main")) && !target.closest(".gallery-thumbnails") && !target.closest("[data-no-lightbox]");
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
      setHovered({ src: image.currentSrc || image.src, alt: image.alt || "صورة من المنصة", x: event.clientX, y: event.clientY });
    };
    const onMove = (event: PointerEvent) => {
      if (!canInspect(event.target)) return;
      setHovered((current) => current ? { ...current, x: event.clientX, y: event.clientY } : current);
    };
    const onOut = (event: PointerEvent) => {
      if (canInspect(event.target)) setHovered(null);
    };
    const openFromTarget = (target: EventTarget | null) => {
      if (!canInspect(target)) return;
      const image = target;
      setActive({ src: image.currentSrc || image.src, alt: image.alt || "صورة من المنصة" });
    };
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
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return <>
    {hovered && <div className="photo-hover-note" style={{ left: Math.min(hovered.x + 18, window.innerWidth - 290), top: Math.min(hovered.y + 18, window.innerHeight - 90) }}><ZoomIn size={14} /><div><strong>{hovered.alt}</strong><span>المصدر: {sourceLabel}</span></div></div>}
    <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
      <DialogContent className="image-lightbox" showCloseButton={false} dir="rtl">
        {active && <><button type="button" className="lightbox-close" onClick={() => setActive(null)} aria-label="إغلاق الصورة"><X size={21} /></button><DialogTitle className="sr-only">{active.alt}</DialogTitle><DialogDescription className="sr-only">{sourceLabel}</DialogDescription><img src={active.src} alt={active.alt} /><div className="lightbox-caption"><p><MapPin size={15} /> {active.alt}</p><span>المصدر: {sourceLabel}</span></div></>}
      </DialogContent>
    </Dialog>
  </>;
}
