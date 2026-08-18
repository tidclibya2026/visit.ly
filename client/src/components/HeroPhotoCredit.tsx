import { Camera, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroPhotoCredit({ landmark, source = "مركز المعلومات والتوثيق السياحي" }: { landmark: string; source?: string }) {
  const { language } = useLanguage();
  const labels = {
    ar: { landmark: "المعلم السياحي", source: "مصدر الصورة" },
    en: { landmark: "Featured landmark", source: "Photo source" },
    fr: { landmark: "Site mis en avant", source: "Source photo" },
    it: { landmark: "Luogo in evidenza", source: "Fonte della foto" },
    de: { landmark: "Ausgewähltes Wahrzeichen", source: "Bildquelle" },
    es: { landmark: "Lugar destacado", source: "Fuente de la foto" },
    zh: { landmark: "精选地标", source: "图片来源" },
  }[language];
  return <aside className="hero-photo-credit"><span><MapPin size={12} /> {labels.landmark}</span><strong>{landmark}</strong><small><Camera size={11} /> {labels.source}: {source}</small></aside>;
}
