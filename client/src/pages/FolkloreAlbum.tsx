import { ArrowLeft, BookOpenText, Heart, Images, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { cultureTopics, cultureVisualArchive, culturalGuides } from "@/lib/content";
import { requestImageZoom } from "@/components/ImageInspector";
import { useTrip } from "@/contexts/TripContext";

const source = "مواد مركز المعلومات والتوثيق السياحي · ملفات التراث الثقافي والممارسات الشعبية";

export default function FolkloreAlbum() {
  const { galleryFavorites, toggleGalleryFavorite } = useTrip();
  const guide = culturalGuides.find((item) => item.section === "فلكلور");
  const folkloreTopic = cultureTopics.find((item) => item.title.includes("فلكلور"));
  const entries = cultureVisualArchive.map((photo, index) => ({ ...photo, text: index === 0 ? folkloreTopic?.description : index === 1 ? "يعرض الزي التقليدي حضورًا اجتماعيًا مرتبطًا بالمناسبات؛ وتبقى خصوصية المناسبة وطلب الإذن قبل التصوير جزءًا من أخلاقيات الزيارة." : "تظهر المنسوجات والحِرف ضمن ذاكرة الممارسة اليومية، وتفتح مدخلًا لفهم الصنعة والرمز والمهارة المتوارثة." }));
  return <SiteShell>
    <section className="folklore-hero"><img src={cultureVisualArchive[0].image} alt={cultureVisualArchive[0].alt} /><div className="folklore-hero-ink" /><div className="page-frame"><Link href="/gallery" className="detail-back">العودة إلى الجاليري <ArrowLeft size={15} /></Link><p className="eyebrow light"><BookOpenText size={14} /> ملف ثقافي موثق</p><h1>الفلكلور<br />والذاكرة الحيّة.</h1><p>قراءة بصرية للممارسات والزي والصنعة كما وردت في صور ومواد مركز المعلومات والتوثيق السياحي.</p></div></section>
    <section className="page-frame folklore-intro"><div><p className="eyebrow"><Sparkles size={14} /> سياق الزيارة</p><h2>{guide?.title}</h2></div><div><p>{guide?.text}</p><ul>{guide?.items.map((item) => <li key={item}>{item}</li>)}</ul><small>{source}</small></div></section>
    <section className="page-frame folklore-plates"><div className="folklore-plates-heading"><p className="eyebrow"><Images size={14} /> صور مشروحة</p><h2>ثلاث لقطات،<br />وثلاث قراءات.</h2></div><div className="folklore-plates-grid">{entries.map((entry, index) => { const favoriteId = `folklore:${index}`; const isFavorite = galleryFavorites.includes(favoriteId); return <article key={entry.image}><div data-no-lightbox><button type="button" onClick={() => requestImageZoom(entry.image, entry.alt)}><img src={entry.image} alt={entry.alt} /></button><span>{String(index + 1).padStart(2, "0")}</span><button type="button" className="folklore-favorite" onClick={() => toggleGalleryFavorite(favoriteId)} aria-label="حفظ الصورة"><Heart size={15} fill={isFavorite ? "currentColor" : "none"} /></button></div><p>{entry.label}</p><h3>{index === 0 ? "الفروسية والممارسة الشعبية" : index === 1 ? "الزي والحضور الاجتماعي" : "النسيج والصنعة"}</h3><p>{entry.text}</p><small>{source}</small></article>; })}</div></section>
    <section className="page-frame folklore-end"><Images size={21} /><div><p className="eyebrow">أرشيف مستمر</p><h2>استكشف مزيدًا من صور ليبيا الموثقة.</h2></div><Link href="/gallery" className="button button-ink">افتح الجاليري <ArrowLeft size={16} /></Link></section>
  </SiteShell>;
}
