/**
 * Design reminder — «دفاتر الرحّالة»: صفحة تجارب بإيقاع استكشافي تحوّل الاهتمامات
 * إلى أبواب للرحلة، مع رموز خطية وأرضية ورقية بدل شبكة سياحية عامة ومزدحمة.
 */
import { ArrowLeft, CalendarDays, Landmark, Mountain, Palette, TentTree, Utensils } from "lucide-react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { assets, experienceFieldNotes, experiences } from "@/lib/content";

const iconMap = { Landmark, Mountain, Utensils, Palette, TentTree, CalendarDays };
const experienceVisuals = [
  { image: assets.greenMountain, label: "الجبل الأخضر · مسار 32°49′N" },
  { image: assets.leptisVerified, label: "لبدة الكبرى · ملف الأثر" },
  { image: assets.couscous, label: "المائدة الليبية · ملاحظة مذاق" },
  { image: assets.pottery, label: "صناعة تقليدية · أثر اليد" },
  { image: assets.horseRiding, label: "فروسية · موسم محلي" },
  { image: assets.acacusRoute, label: "أكاكوس · طريق الصحراء" },
];

export default function Experiences() {
  return (
    <SiteShell>
      <section className="inner-hero experiences-hero"><div className="hero-topography" aria-hidden="true" /><div className="page-frame"><p className="eyebrow light">مسار ميداني · 06 محطات</p><h1>لا تتبع الأماكن فقط،<br /><i>اتبع ما تريد أن تعيشه.</i></h1><p>بين الجبل والبحر والصحراء والمدينة، تتشكل الرحلة من التجارب التي تختارها أنت.</p><div className="experience-hero-ledger"><span>دفتر التجارب · من الساحل إلى الصحراء</span><span>خط مسار قابل للقراءة</span></div></div></section>
      <section className="page-frame experiences-intro"><p className="eyebrow">ستة أبواب للرحلة</p><div><h2>اختر شعورًا،<br />وسنقودك إلى مكانه.</h2><p>اقرأ المحطات كمسار ميداني مستند إلى المواد المرفقة: الطبيعة، الآثار، المائدة، الصناعات التقليدية، الفعاليات، وهدوء الصحراء.</p></div></section>
      <section className="page-frame experiences-list">
        {experiences.map((experience, index) => {
          const Icon = iconMap[experience.icon as keyof typeof iconMap];
          const visual = experienceVisuals[index];
          return <article className="experience-row" data-route={visual.label} key={experience.title}><span className="experience-number">0{index + 1}</span><div className="experience-photo"><img src={visual.image} alt={visual.label} /><span>{visual.label}</span><i className="experience-icon"><Icon size={22} strokeWidth={1.45} /></i></div><div><p className="experience-route">محطة التجربة · 0{index + 1}</p><h2>{experience.title}</h2><p>{experience.text}</p></div><Link href={experience.title === "مدن وحضارات" ? "/heritage" : experience.title === "مذاقات محلية" || experience.title === "حرف وتقاليد" ? "/culture" : "/destinations"} aria-label={`استكشف ${experience.title}`}><ArrowLeft size={20} /></Link></article>;
        })}
      </section>
      <section className="page-frame field-note-grid" aria-label="ملاحظات المسارات">{experienceFieldNotes.map((note, index) => <article key={note.title}><span>0{index + 1}</span><p className="eyebrow">{note.label}</p><h2>{note.title}</h2><p>{note.text}</p></article>)}</section>
      <section className="season-note"><div className="page-frame"><div><p className="eyebrow light">إيقاع السنة</p><h2>لكل فصل طريقته في ليبيا.</h2></div><p>تتحرك الفعاليات والزيارات بين الساحل والجبل والصحراء مع الطقس ومواسم الربيع والحصاد. خطط مسبقًا، خصوصًا للمسارات البعيدة، واسأل الجهات المحلية عن التفاصيل الأحدث.</p><Link href="/services" className="button button-sand">دليل الاستعداد <ArrowLeft size={17} /></Link></div></section>
    </SiteShell>
  );
}
