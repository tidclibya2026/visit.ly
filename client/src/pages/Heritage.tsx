/**
 * Design reminder — «دفاتر الرحّالة»: ملف التراث يجب أن يبدو كأطلس هادئ؛ كل موقع
 * يملك صفحته البصرية المختلفة، مع ترقيم ومسافة بيضاء تؤكد قيمة الاكتشاف.
 */
import { ArrowLeft, Landmark } from "lucide-react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { heritageSites } from "@/lib/content";

export default function Heritage() {
  return (
    <SiteShell>
      <section className="inner-hero heritage-hero"><div className="page-frame"><p className="eyebrow light">تراث عالمي</p><h1>هنا، التاريخ<br /><i>ليس خلف زجاج.</i></h1><p>تتكشف طبقات من حضارات البحر والصحراء في مدن ومواقع حفظت أثر الإنسان والعمارة والبيئة.</p></div></section>
      <section className="heritage-intro page-frame"><span className="seal-large"><Landmark size={28} /></span><div><p className="eyebrow">{heritageSites.length} محطات موثقة</p><h2>نوافذ على ذاكرة ليبيا.</h2></div><p>تلخّص هذه المحطات المواقع التي وردت في ملفات المنصة: مدن رومانية وكلاسيكية، عمارة الواحة، وفنون صخرية ومتاحف ومواقع أثرية من أرشيف المركز.</p></section>
      <section className="heritage-list page-frame">
        {heritageSites.map((site, index) => <article className={`heritage-entry entry-${index + 1}`} data-catalogue={`ملف التراث · ${String(index + 1).padStart(2, "0")}`} key={site.title}><div className="heritage-image"><img src={site.image} alt={site.alt} /></div><div className="heritage-copy"><span className="heritage-index">0{index + 1}</span><p className="eyebrow">{site.kicker}</p><h2>{site.title}</h2><p>{site.description}</p><Link href={"destinationId" in site && site.destinationId ? `/destinations/${site.destinationId}` : "/trip"} className="underlined-link">{"destinationId" in site && site.destinationId ? "افتح ملف الموقع" : "أضف المنطقة إلى خطتك"} <ArrowLeft size={16} /></Link></div></article>)}
      </section>
      <section className="heritage-cta"><div className="page-frame"><p className="eyebrow light">زيارة مسؤولة</p><h2>خذ من المكان ذكرى،<br />واترك له احترامه.</h2><p>المواقع الأثرية حساسة وثمينة. اتبع اللوائح المحلية، وتجنب لمس أو نقل أي جزء من المعالم أو المخلفات التاريخية.</p><Link href="/services" className="button button-sand">اقرأ إرشادات الرحلة <ArrowLeft size={17} /></Link></div></section>
    </SiteShell>
  );
}
