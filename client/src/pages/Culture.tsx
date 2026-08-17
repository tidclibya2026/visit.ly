/**
 * Design reminder — «دفاتر الرحّالة»: الثقافة هنا صفحة محسوسة؛ تتجاور الصورة والملمس
 * والنص بجانب فراغات دافئة، لتبدو التفاصيل الحية جزءًا من الرحلة لا معرضًا مزخرفًا.
 */
import { ArrowLeft, Coffee, Gem, Music2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { assets, cultureTopics } from "@/lib/content";

export default function Culture() {
  return (
    <SiteShell>
      <section className="culture-hero"><img src={assets.traditionalDress} alt="زي تقليدي ليبي" /><div className="culture-hero-wash" /><div className="page-frame culture-hero-copy"><p className="eyebrow light">ثقافة ومذاقات</p><h1>في ليبيا،<br /><i>الثقافة تُعاش.</i></h1><p>تظهر في المائدة، وفي حركة السوق، وفي اليد التي تنسج وتصنع، وفي الاحتفال الذي يجمع الناس.</p></div></section>
      <section className="culture-statement page-frame"><div className="chapter-no">02</div><div><p className="eyebrow">روح مشتركة</p><h2>المكان لا يكتمل دون أن تتعرّف إلى أهله وتفاصيلهم.</h2></div><p>تنقل المواد المرفقة صورة لثقافة تتوارث الضيافة والمهارات والأغنية والعادة، بين المدينة والريف والساحل والواحات.</p></section>
      <section className="culture-feature-grid page-frame">
        {cultureTopics.map((topic, index) => <article className={`culture-topic topic-${index + 1}`} data-field-note={index === 0 ? "حاشية 32°53′N" : index === 1 ? "مسار المجتمع" : "حرفة على الطريق"} key={topic.title}><div className="culture-topic-image"><img src={topic.image} alt={topic.alt} /></div><div className="culture-topic-copy"><p className="eyebrow">{topic.kicker}</p><h2>{topic.title}</h2><p>{topic.description}</p><span className="story-index">0{index + 1} / 03</span></div></article>)}
      </section>
      <section className="culture-notes"><div className="page-frame culture-notes-grid"><div><Coffee size={22} /><h3>عند المائدة</h3><p>التجربة المحلية تبدأ بالتقدير والفضول. اسأل عن الطبق ومكوناته، وتلقّ الضيافة ببساطة واحترام.</p></div><div><ShoppingBag size={22} /><h3>في السوق</h3><p>ابحث عن المنتج الحرفي ومصدره، وخذ وقتك في مشاهدة تفاصيل النسيج والنحاس والفخار قبل الاختيار.</p></div><div><Music2 size={22} /><h3>في الفعالية</h3><p>تختلف التظاهرات بحسب المكان والموسم؛ تابع إعلان الجهة المنظمة واحترم خصوصية المناسبة وتقاليدها.</p></div><div><Gem size={22} /><h3>في الحرفة</h3><p>إن أمكن، اختر قطعة صنعت يدويًا وتعرّف إلى قصتها؛ فالشراء هنا طريقة لدعم استمرار المهارة.</p></div></div></section>
      <section className="page-frame closing-link"><p className="eyebrow">الصفحة التالية</p><h2>الحكاية أقدم من أن تُروى في زيارة واحدة.</h2><Link href="/heritage" className="button button-ink">انتقل إلى التراث <ArrowLeft size={17} /></Link></section>
    </SiteShell>
  );
}
