/**
 * Design reminder — «دفاتر الرحّالة»: دليل عملي واضح ومريح بصريًا، يفرّق بين المعلومة
 * الإرشادية والمصدر الرسمي ويعطي المستخدم منافذ عملية بلا وعود أو تفاصيل متغيرة غير مؤكدة.
 */
import { ArrowUpLeft, Banknote, BusFront, CircleAlert, CloudSun, Plane, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { assets, practicalDetails, practicalGuides } from "@/lib/content";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroPhotoCredit } from "@/components/HeroPhotoCredit";

export default function Services() {
  const { t } = useLanguage();
  return (
    <SiteShell>
      <section className="inner-hero services-hero landmark-hero"><img className="landmark-hero-image" src={assets.shahatTemple} alt="معبد شحات الأثري من صور مركز المعلومات والتوثيق السياحي" fetchPriority="high" /><div className="landmark-hero-ink" aria-hidden="true" /><div className="page-frame"><p className="eyebrow light">{t("hero.services.kicker")}</p><h1>{t("hero.services.title")}<br /><i>{t("hero.services.accent")}</i></h1><p>{t("hero.services.copy")}</p></div><HeroPhotoCredit landmark="معالم شحات الأثرية" /></section>
      <section className="notice-strip"><div className="page-frame"><CircleAlert size={19} /><p><strong>تنبيه مهم:</strong> راجع دائمًا الجهات الرسمية والسفارة أو القنصلية ومشغل الرحلات قبل الحجز أو السفر؛ المتطلبات والرسوم والمسارات قد تتغير.</p></div></section>
      <section className="page-frame practical-cards">
        {practicalGuides.map((guide, index) => <article key={guide.title}><span>0{index + 1}</span><h2>{guide.title}</h2><ul>{guide.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}
      </section>
      <section className="page-frame service-icons"><article><Plane size={27} /><h3>التأشيرة والدخول</h3><p>تحقق من نوع التأشيرة والوثائق وصلاحية الجواز والشروط التي تنطبق على جنسيتك قبل بدء الإجراءات.</p><a href="https://evisa.gov.ly/" target="_blank" rel="noreferrer">البوابة الرسمية للتأشيرة <ArrowUpLeft size={16} /></a></article><article><BusFront size={27} /><h3>التنقل</h3><p>تربط الطرق المدن والقرى، بينما تحتاج المناطق الصحراوية إلى تنظيم مناسب ووسيلة مواكبة لطبيعة المسار.</p></article><article><Banknote size={27} /><h3>العملة والخدمات</h3><p>العملة الوطنية هي الدينار الليبي؛ احرص على الاستفسار من المصارف أو الجهات المختصة حول الاستخدام والخدمات المتاحة في المنطقة.</p></article><article><CloudSun size={27} /><h3>الطقس</h3><p>يختلف المناخ بين الساحل والداخل والجنوب. راجع أحوال الطقس المحلية، ولا سيما قبل زيارة الصحراء أو الجبال.</p></article><article><ShieldCheck size={27} /><h3>الاستشفاء</h3><p>رتّب التأمين الصحي، وحدد الخدمات القريبة من وجهتك، وخذ الأدوية والمستلزمات المناسبة لطبيعة خط السير.</p></article></section>
      <section className="page-frame practical-detail-grid" aria-label="ملاحظات عملية">{practicalDetails.map((detail, index) => <article key={detail.title}><span>0{index + 1}</span><h2>{detail.title}</h2><p>{detail.text}</p></article>)}</section>
      <section className="page-frame faq-section"><p className="eyebrow">أسئلة تمهيدية</p><h2>قبل أن تغلق الحقيبة.</h2><details><summary>ما الذي أحتاجه قبل السفر؟</summary><p>ابدأ بجواز سفر صالح، ثم تأكد من إجراءات الدخول المناسبة لك، وحجوزات الإقامة أو خطة الرحلة، والتأمين الصحي، ووسيلة اتصال بمشغل الرحلات أو الجهة المستضيفة.</p></details><details><summary>هل أرتب رحلات الصحراء وحدي؟</summary><p>المسارات الصحراوية تحتاج إلى تخطيط مناسب ومتابعة أحوال الطقس ومختصين محليين لديهم معرفة بالطرق والتجهيزات اللازمة.</p></details><details><summary>كيف أختار الوقت الأنسب؟</summary><p>ضع المنطقة ونوع التجربة أولًا: الساحل والجبل لهما موسمان مختلفان عن الصحراء. راجع الطقس والنشاط الفعلي للوجهة قبل تثبيت الخطة.</p></details></section>
    </SiteShell>
  );
}
