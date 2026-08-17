/**
 * Design reminder — «دفاتر الرحّالة»: صفحة تجارب بإيقاع استكشافي تحوّل الاهتمامات
 * إلى أبواب للرحلة، مع رموز خطية وأرضية ورقية بدل شبكة سياحية عامة ومزدحمة.
 */
import { ArrowLeft, CalendarDays, Landmark, Mountain, Palette, TentTree, Utensils } from "lucide-react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { experiences } from "@/lib/content";

const iconMap = { Landmark, Mountain, Utensils, Palette, TentTree, CalendarDays };

export default function Experiences() {
  return (
    <SiteShell>
      <section className="inner-hero experiences-hero"><div className="page-frame"><p className="eyebrow light">ما الذي يمكن أن تفعله؟</p><h1>لا تتبع الأماكن فقط،<br /><i>اتبع ما تريد أن تعيشه.</i></h1><p>بين الجبل والبحر والصحراء والمدينة، تتشكل الرحلة من التجارب التي تختارها أنت.</p></div></section>
      <section className="page-frame experiences-intro"><p className="eyebrow">ستة أبواب للرحلة</p><div><h2>اختر شعورًا،<br />وسنقودك إلى مكانه.</h2><p>يعرض هذا الدليل التجارب التي تستند إلى المواد المرفقة: الطبيعة، الآثار، المائدة، الصناعات التقليدية، الفعاليات، وهدوء الصحراء.</p></div></section>
      <section className="page-frame experiences-list">
        {experiences.map((experience, index) => {
          const Icon = iconMap[experience.icon as keyof typeof iconMap];
          return <article className="experience-row" key={experience.title}><span className="experience-number">0{index + 1}</span><span className="experience-icon"><Icon size={26} strokeWidth={1.45} /></span><div><h2>{experience.title}</h2><p>{experience.text}</p></div><Link href={experience.title === "مدن وحضارات" ? "/heritage" : experience.title === "مذاقات محلية" || experience.title === "حرف وتقاليد" ? "/culture" : "/destinations"} aria-label={`استكشف ${experience.title}`}><ArrowLeft size={20} /></Link></article>;
        })}
      </section>
      <section className="season-note"><div className="page-frame"><div><p className="eyebrow light">إيقاع السنة</p><h2>لكل فصل طريقته في ليبيا.</h2></div><p>تتحرك الفعاليات والزيارات بين الساحل والجبل والصحراء مع الطقس ومواسم الربيع والحصاد. خطط مسبقًا، خصوصًا للمسارات البعيدة، واسأل الجهات المحلية عن التفاصيل الأحدث.</p><Link href="/services" className="button button-sand">دليل الاستعداد <ArrowLeft size={17} /></Link></div></section>
    </SiteShell>
  );
}
