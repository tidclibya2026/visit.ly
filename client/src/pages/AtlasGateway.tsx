/**
 * Design reminder — Visit Libya الرسمية: أزرق ملكي #0B3A67 وذهبي صحراوي #C89B3C،
 * بوابة مهنية واضحة للأطلس الوطني، ولا تدّعي نقل بيانات أو استجابة AI قبل فتح الأطلس الفعلي.
 */
import { ArrowUpLeft, BrainCircuit, Database, Map, Route, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { assets } from "@/lib/content";
import { useTrip } from "@/contexts/TripContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroPhotoCredit } from "@/components/HeroPhotoCredit";

export default function AtlasGateway() {
  const { stops } = useTrip();
  const { t } = useLanguage();

  return (
    <SiteShell>
      <section className="atlas-hero landmark-hero">
        <img className="landmark-hero-image" src={assets.tolmeitha} alt="طلميثة من صور مركز المعلومات والتوثيق السياحي" fetchPriority="high" /><div className="landmark-hero-ink" aria-hidden="true" />
        <div className="page-frame atlas-hero-content">
          <p className="eyebrow light">{t("hero.atlas.kicker")}</p>
          <h1>{t("hero.atlas.title")}<br /><i>{t("hero.atlas.accent")}</i></h1>
          <p>{t("hero.atlas.copy")}</p>
          <div className="atlas-hero-actions">
            <a className="button button-sand" href={assets.atlasPublicUrl} target="_blank" rel="noreferrer">افتح الأطلس الوطني <ArrowUpLeft size={17} /></a>
            <Link href="/trip" className="text-action light">راجع محطات رحلتك <Route size={17} /></Link>
          </div>
        </div>
        <div className="atlas-coordinates" aria-hidden="true"><span>19°00′E</span><b>GIS · Libya Tourism Atlas</b><span>26°20′N</span></div>
        <HeroPhotoCredit landmark="طلميثة الأثرية" />
      </section>

      <section className="page-frame atlas-intro">
        <div className="atlas-intro-stamp"><Map size={25} /></div>
        <div><p className="eyebrow">خدمات مترابطة</p><h2>خريطتك، بحثك، ومسارك<br />في بوابة واحدة.</h2></div>
        <p>يُستكمل الاستكشاف المتقدم داخل الأطلس المنشور للمركز؛ فهو يوفّر الخريطة التفاعلية والطبقات الوطنية وأدوات البحث والتخطيط المدعومة بالبيانات.</p>
      </section>

      <section className="page-frame atlas-service-grid" aria-label="محطات خدمة الأطلس">
        <article>
          <span className="atlas-card-number">01</span><Map size={28} /><h2>الخريطة الوطنية</h2><p>استكشف المواقع بطبقات متخصصة تشمل التراث والموارد الطبيعية والخدمات والفرص الاستثمارية.</p><a href={assets.atlasPublicUrl} target="_blank" rel="noreferrer">إلى الخريطة <ArrowUpLeft size={15} /></a>
        </article>
        <article>
          <span className="atlas-card-number">02</span><BrainCircuit size={28} /><h2>البحث الذكي الموثق</h2><p>استخدم البحث الذكي داخل الأطلس للسؤال عن المواقع المناسبة، مع الاعتماد على السجلات والطبقات المنشورة.</p><a href={assets.atlasPublicUrl} target="_blank" rel="noreferrer">ابدأ البحث <ArrowUpLeft size={15} /></a>
        </article>
        <article>
          <span className="atlas-card-number">03</span><Route size={28} /><h2>تخطيط مسار الرحلة</h2><p>أدخل مدة الرحلة واهتماماتك في الأطلس للحصول على مقترح مسار مبني على البيانات المتاحة.</p><a href={assets.atlasPublicUrl} target="_blank" rel="noreferrer">خطط مسارًا <ArrowUpLeft size={15} /></a>
        </article>
      </section>

      <section className="atlas-trip-bridge" data-route-note="Visit Libya → أطلس ليبيا السياحي">
        <div className="page-frame atlas-trip-bridge-inner">
          <div className="atlas-trip-status"><Route size={26} /><span>مخطط Visit Libya</span><b>{stops.length} محطات</b></div>
          <div><p className="eyebrow light">منصة Visit Libya × أطلس ليبيا السياحي</p><h2>{stops.length ? "احتفظ بمحطاتك هنا، ثم أكمل التحليل داخل الأطلس." : "ابدأ بالوجهات هنا، وأكمل التخطيط الذكي داخل الأطلس."}</h2><p>تخزن هذه النسخة المحطات في متصفحك لتسهيل المراجعة. عند الانتقال إلى الأطلس، استخدم البحث وتخطيط المسار لإضافة عوامل المكان والوقت واهتمامات الرحلة.</p></div>
          <a className="button button-sand" href={assets.atlasPublicUrl} target="_blank" rel="noreferrer">انتقل إلى الأطلس <ArrowUpLeft size={17} /></a>
        </div>
      </section>

      <section className="page-frame atlas-assurance"><ShieldCheck size={27} /><div><p className="eyebrow">وضوح الخدمة</p><h2>المساعد الذكي ليس دردشة عامة.</h2><p>تظهر بوابته في الأطلس بوصفها أداة بحث وتخطيط مرتبطة بالسجلات والطبقات المنشورة. لا تدّعي منصة Visit Libya هنا إرسال اختياراتك تلقائيًا أو تشغيل مساعد مستقل قبل ربط واجهة التكامل الرسمية.</p></div><a href="https://github.com/tidclibya2026/tidcatlas.ly" target="_blank" rel="noreferrer">مستودع الأطلس <ArrowUpLeft size={15} /></a></section>

      <section className="atlas-sources"><div className="page-frame"><Database size={20} /><p>التكامل الحالي يعتمد على رابط الأطلس العام المنشور. الربط البرمجي المباشر يحتاج عنوان API إنتاجي وتفويضًا صريحًا من فريق الأطلس.</p></div></section>
    </SiteShell>
  );
}
