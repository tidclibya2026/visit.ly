import { ArrowLeft, BookOpenText, Heart, Images, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { culturalGuides, foodCraftVisualArchive } from "@/lib/content";
import { requestImageZoom } from "@/components/ImageInspector";
import { useTrip } from "@/contexts/TripContext";

const source = "مواد مركز المعلومات والتوثيق السياحي · ملفات الصناعات التقليدية والحِرف";

const craftReadings = [
  { title: "الفخار", text: "توضح الأواني الفخارية صلة الصنعة بالاستخدام اليومي؛ من الإناء إلى قطعة العرض، تُقرأ المادة والطينة والأثر اليدوي بوصفها جزءًا من ذاكرة المكان." },
  { title: "المنسوجات", text: "تحمل المنسوجات تدرجات اللون وتكرار الخيط ودقة النسج، وتربط بين الاحتياج العملي والزينة وحضور الموروث في البيت واللباس." },
  { title: "الزخارف", text: "تمنح الزخارف المتكررة القطعة إيقاعًا بصريًا؛ لذلك يستحسن السؤال عن المادة والرمز وطريقة التنفيذ بدل افتراض معنى واحد لكل نقش." },
  { title: "الحُلي", text: "تظهر الحُلي والنحاسيات ضمن لغة للزينة والهدية والمناسبة. عند الاقتناء، دعم الصانع والسؤال عن المنشأ يساعدان على تقدير قيمة القطعة وحكايتها." },
];

export default function CraftsAlbum() {
  const { galleryFavorites, toggleGalleryFavorite } = useTrip();
  const guide = culturalGuides.find((item) => item.section === "حِرف");
  const entries = foodCraftVisualArchive.slice(2);

  return <SiteShell>
    <section className="folklore-hero crafts-hero"><img src={entries[0].image} alt={entries[0].alt} /><div className="folklore-hero-ink" /><div className="page-frame"><Link href="/gallery" className="detail-back">العودة إلى الجاليري <ArrowLeft size={15} /></Link><p className="eyebrow light"><BookOpenText size={14} /> ملف حرفي موثق</p><h1>الحِرف<br />تحكي باليد.</h1><p>ألبوم بصري للصناعات التقليدية، يقرأ الفخار والمنسوجات والزخارف والحُلي من صور ومواد مركز المعلومات والتوثيق السياحي.</p></div></section>
    <section className="page-frame folklore-intro"><div><p className="eyebrow"><Sparkles size={14} /> سياق الزيارة</p><h2>{guide?.title}</h2></div><div><p>{guide?.text}</p><ul>{guide?.items.map((item) => <li key={item}>{item}</li>)}</ul><small>{source}</small></div></section>
    <section className="page-frame folklore-plates"><div className="folklore-plates-heading"><p className="eyebrow"><Images size={14} /> لقطات أرشيفية</p><h2>صورةٌ<br />تتبعها صنعة.</h2></div><div className="folklore-plates-grid">{entries.map((entry, index) => { const favoriteId = `craft:${index}`; const isFavorite = galleryFavorites.includes(favoriteId); return <article key={entry.image}><div data-no-lightbox><button type="button" onClick={() => requestImageZoom(entry.image, entry.alt)}><img src={entry.image} alt={entry.alt} /></button><span>{String(index + 1).padStart(2, "0")}</span><button type="button" className="folklore-favorite" onClick={() => toggleGalleryFavorite(favoriteId)} aria-label="حفظ الصورة"><Heart size={15} fill={isFavorite ? "currentColor" : "none"} /></button></div><p>{entry.label}</p><h3>{index === 0 ? "الصناعة التقليدية" : "الفخار اليدوي"}</h3><p>{index === 0 ? "لقطة تقرّب خامات الصنعة وتفاصيلها، وتدعو إلى التعرف على الحرفيين والأسواق المحلية بوصفها جزءًا من تجربة المكان." : "قطعة فخارية تقرأ مهارة تشكيل الطين والأثر اليدوي؛ تمنح الزيارة مدخلًا إلى وظيفة المادة وجمالها."}</p><small>{source}</small></article>; })}</div></section>
    <section className="page-frame crafts-reading"><div><p className="eyebrow">أربع قراءات</p><h2>من المادة<br />إلى الحكاية.</h2></div><div className="crafts-reading-grid">{craftReadings.map((reading) => <article key={reading.title}><span>{reading.title}</span><p>{reading.text}</p></article>)}</div></section>
    <section className="page-frame folklore-end"><Images size={21} /><div><p className="eyebrow">أرشيف مستمر</p><h2>اكتشف مزيدًا من صور ليبيا الموثقة.</h2></div><Link href="/gallery" className="button button-ink">افتح الجاليري <ArrowLeft size={16} /></Link></section>
  </SiteShell>;
}
