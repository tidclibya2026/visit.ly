/**
 * Design reminder — «دفاتر الرحّالة»: صفحة تجارب بإيقاع استكشافي تحوّل الاهتمامات
 * إلى أبواب للرحلة، مع رموز خطية وأرضية ورقية بدل شبكة سياحية عامة ومزدحمة.
 */
import { ArrowLeft, CalendarDays, Check, Landmark, MapPin, Mountain, Palette, Plus, Search, TentTree, Utensils, ZoomIn } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { assets, experienceFieldNotes, experiences } from "@/lib/content";
import { useTrip } from "@/contexts/TripContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroPhotoCredit } from "@/components/HeroPhotoCredit";
import { PublishedContentFeed } from "@/components/PublishedContentFeed";
import { requestImageZoom } from "@/components/ImageInspector";

const iconMap = { Landmark, Mountain, Utensils, Palette, TentTree, CalendarDays };
const regions = ["الكل", ...Array.from(new Set(experiences.map((experience) => experience.region)))];
const seasons = ["الكل", ...Array.from(new Set(experiences.map((experience) => experience.season)))];
export default function Experiences() {
  const { stops, toggleStop } = useTrip();
  const { t } = useLanguage();
  const [region, setRegion] = useState("الكل");
  const [season, setSeason] = useState("الكل");
  const [search, setSearch] = useState("");
  const shownExperiences = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ar");
    return experiences.filter((experience) => {
      const searchable = `${experience.title} ${experience.text} ${experience.targetPlace} ${experience.region} ${experience.season}`.toLocaleLowerCase("ar");
      return (region === "الكل" || experience.region === region) && (season === "الكل" || experience.season === season) && (!query || searchable.includes(query));
    });
  }, [region, season, search]);
  return (
    <SiteShell>
      <section className="inner-hero experiences-hero"><img className="experience-hero-image" src={assets.acacusRocks} alt="تكوينات أكاكوس الصخرية من صور المركز" fetchPriority="high" /><div className="experience-hero-ink" aria-hidden="true" /><div className="page-frame"><p className="eyebrow light">{t("hero.experiences.kicker")} · {String(experiences.length).padStart(2, "0")}</p><h1>{t("hero.experiences.title")}<br /><i>{t("hero.experiences.accent")}</i></h1><p>{t("hero.experiences.copy")}</p></div><HeroPhotoCredit landmark="تادرارت أكاكوس" /></section>
      <section className="page-frame experiences-intro experiences-intro-simple"><p className="eyebrow">دليل عملي للاستكشاف</p><div><h2>تجارب متصلة<br />بأماكنها الحقيقية.</h2><p>استخدم البطاقات لاختيار ما يهمك، ثم انتقل مباشرة إلى صفحة الموقع لمشاهدة صوره ومعلوماته وخريطته وتفاصيله الميدانية.</p></div></section>
      <section className="page-frame experience-filter-bar" aria-label="تصفية التجارب"><div><p className="eyebrow">اعثر على التجربة المناسبة</p><p>ابحث باسم نشاط أو مكان، ثم استخدم المنطقة والموسم لتضييق النتائج.</p></div><div className="experience-filter-controls"><label className="experience-search"><Search size={16} /><span className="sr-only">ابحث داخل التجارب</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث: طعام، حرف، صحراء، آثار…" /></label><div className="category-chips"><span className="filter-label">المنطقة</span>{regions.map((item) => <button type="button" className={region === item ? "is-active" : ""} onClick={() => setRegion(item)} key={item}>{item}</button>)}</div><div className="category-chips"><span className="filter-label">الموسم</span>{seasons.map((item) => <button type="button" className={season === item ? "is-active" : ""} onClick={() => setSeason(item)} key={item}>{item}</button>)}</div></div></section>
      <div className="page-frame experience-results-line"><span>تظهر الآن <strong>{shownExperiences.length}</strong> تجارب موثقة.</span>{(region !== "الكل" || season !== "الكل" || search) && <button type="button" onClick={() => { setRegion("الكل"); setSeason("الكل"); setSearch(""); }}>إعادة ضبط البحث والتصفية</button>}</div>
      <section className="page-frame experience-grid" aria-label="تجارب سفر مرتبطة بالوجهات">
        {shownExperiences.map((experience, index) => {
          const Icon = iconMap[experience.icon as keyof typeof iconMap];
          const isInTrip = stops.includes(experience.id);
          return <article className="experience-card" data-experience={experience.id} key={experience.id}><Link href={experience.targetRoute} className="experience-card-photo" aria-label={`افتح صفحة ${experience.targetPlace}`}><img src={experience.image} alt={experience.alt} /><span className="experience-card-index">0{index + 1}</span><i><Icon size={20} strokeWidth={1.55} /></i></Link><button type="button" className="quick-image-zoom experience-zoom" onClick={() => requestImageZoom(experience.image, experience.alt)} aria-label={`تكبير صورة تجربة ${experience.title}`}><ZoomIn size={16} /><span>تكبير الصورة</span></button><div className="experience-card-copy"><p className="experience-place"><MapPin size={13} /> {experience.targetPlace}</p><h2>{experience.title}</h2><p>{experience.text}</p><div className="experience-season"><CalendarDays size={15} /><div><strong>{experience.season}</strong><span>{experience.seasonNote}</span></div></div><div className="experience-card-actions"><Link href={experience.targetRoute}>افتح صفحة المعلم <ArrowLeft size={16} /></Link><button type="button" className={isInTrip ? "is-added" : ""} onClick={() => toggleStop(experience.id)}>{isInTrip ? <Check size={16} /> : <Plus size={16} />}{isInTrip ? "أضيفت للمسار" : "أضف التجربة"}</button></div></div></article>;
        })}
      </section>
      {!shownExperiences.length && <section className="page-frame experience-empty"><p className="eyebrow">لا توجد نتيجة مطابقة</p><h2>جرّب كلمة بحث أو منطقة أو موسمًا مختلفًا.</h2><button type="button" className="button button-ink" onClick={() => { setRegion("الكل"); setSeason("الكل"); setSearch(""); }}>عرض كل التجارب</button></section>}
      <section className="page-frame experience-notes" aria-label="ملاحظات التخطيط">{experienceFieldNotes.map((note, index) => <article key={note.title}><span>0{index + 1}</span><p className="eyebrow">{note.label}</p><h2>{note.title}</h2><p>{note.text}</p></article>)}</section>
      <PublishedContentFeed kind="experiences" />
      <section className="season-note"><div className="page-frame"><div><p className="eyebrow light">إيقاع السنة</p><h2>تحقق من الموسم،<br />ثم ثبّت مسارك.</h2></div><p>تتغير الخدمات والفعاليات والظروف الجوية بحسب المنطقة. استخدم شارة كل تجربة كدليل أولي، ثم راجع الجهة المحلية أو مشغل الرحلة قبل اعتماد الموعد.</p><Link href="/services" className="button button-sand">دليل الاستعداد <ArrowLeft size={17} /></Link></div></section>
    </SiteShell>
  );
}
