/**
 * Design reminder — «دفاتر الرحّالة»: بداية بانورامية تفتح الدفتر، ثم مسار تحريري
 * متعرج بمقاطع غير متناظرة؛ لا بطاقات مركزية متطابقة ولا لغة دعائية عامة.
 */
import { ArrowLeft, ArrowUpLeft, ChevronLeft, ChevronRight, Compass, Landmark, MapPinned, Mountain, Plus, Route, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { SiteShell } from "@/components/SiteShell";
import { assets, destinations, heroSlides } from "@/lib/content";
import { useTrip } from "@/contexts/TripContext";

export default function Home() {
  const { stops, toggleStop } = useTrip();
  const featured = destinations.slice(0, 3);
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = heroSlides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 5600);
    return () => window.clearInterval(timer);
  }, []);

  const previousSlide = () => setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setActiveSlide((current) => (current + 1) % heroSlides.length);

  return (
    <SiteShell>
      <section className="home-hero">
        {heroSlides.map((item, index) => <img src={item.image} alt={index === activeSlide ? item.alt : ""} aria-hidden={index !== activeSlide} className={`hero-image ${index === activeSlide ? "is-active" : ""}`} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" key={item.image} />)}
        <div className="hero-ink" />
        <div className="hero-content page-frame" key={slide.image}>
          <p className="eyebrow light hero-eyebrow"><span /> {slide.kicker}</p>
          <p className="hero-field-note"><span>ملاحظة الدليل</span>{slide.note}</p>
          <h1>{slide.title}<br /><i>{slide.accent}</i></h1>
          <p className="hero-copy">{slide.description}</p>
          <div className="hero-actions">
            <Link href="/destinations" className="button button-light">افتح دفتر الوجهات <ArrowLeft size={17} /></Link>
            <Link href="/trip" className="text-action light">رتّب مسارك <ArrowUpLeft size={17} /></Link>
          </div>
        </div>
        <div className="hero-controls" aria-label="اختيار صورة الهيرو"><button type="button" onClick={previousSlide} aria-label="الصورة السابقة"><ChevronRight size={19} /></button><div className="hero-dots">{heroSlides.map((item, index) => <button type="button" onClick={() => setActiveSlide(index)} className={index === activeSlide ? "is-active" : ""} aria-label={`عرض ${item.note}`} key={item.image} />)}</div><button type="button" onClick={nextSlide} aria-label="الصورة التالية"><ChevronLeft size={19} /></button></div>
        <div className="hero-coordinates"><span>{slide.kicker.split(" · ")[1]}</span><b>{slide.note}</b><span>Visit Libya</span></div>
      </section>

      <section className="intro-section page-frame">
        <div className="chapter-no">01</div>
        <div className="intro-copy">
          <p className="eyebrow">دليل الوصول · المحطة 01</p>
          <h2>ليبيا أرض الحضارات<br />وموطن السحر والجمال.</h2>
        </div>
        <div className="intro-body">
          <p>من مدن البحر إلى الواحات والجبال والصحراء، تتغير المشاهد وتبقى روح المكان قريبة: تاريخ حيّ، طبيعة واسعة، وترحاب يسبق السؤال.</p>
          <Link href="/experiences" className="underlined-link">اقرأ ما الذي يمكنك فعله <ArrowLeft size={16} /></Link>
        </div>
      </section>

      <section className="territory-strip">
        <div className="page-frame territory-inner">
          <div><span className="stamp">مدن</span><b>أزقة، أسواق، وواجهات تحكي قرونًا.</b></div>
          <div><span className="stamp">طبيعة</span><b>جبل وساحل وواحات وصحراء مفتوحة.</b></div>
          <div><span className="stamp">تراث</span><b>إغريق ورومان وعرب وحكايات محلية.</b></div>
        </div>
      </section>

      <section className="section page-frame explore-section">
        <div className="section-head split-head">
          <div><p className="eyebrow">اختر الصفحة التالية</p><h2>وجهات تستحق<br />أن تُضاف إلى مسارك.</h2></div>
          <Link href="/destinations" className="button button-ink">كل الوجهات <ArrowLeft size={17} /></Link>
        </div>
        <div className="destination-row">
          {featured.map((destination, index) => {
            const saved = stops.includes(destination.id);
            return (
              <article className={`destination-card destination-card-${index + 1}`} key={destination.id}>
                <img src={destination.image} alt={destination.alt} />
                <div className="destination-shade" />
                <div className="destination-card-content">
                  <div className="card-meta"><span>{destination.region}</span><span>{destination.time}</span></div>
                  <h3>{destination.title}</h3>
                  <p>{destination.description}</p>
                  <button className={`card-plan ${saved ? "is-saved" : ""}`} onClick={() => toggleStop(destination.id)} type="button">
                    <Plus size={16} /> {saved ? "ضمن المسار" : "أضف إلى المسار"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="feature-split page-frame">
        <div className="feature-image green-feature"><img src={assets.greenMountain} alt="الساحل والجبل في شمال ليبيا" /></div>
        <div className="feature-copy">
          <p className="eyebrow">خارج المدينة</p>
          <span className="feature-icon"><Mountain size={23} /></span>
          <h2>تبدّل المشهد،<br />ولا تنتهي الرحلة.</h2>
          <p>من خضرة الجبل الأخضر وإطلالاته إلى هدوء الواحات وجلال الصحراء، ستجد تجربة تناسب الإيقاع الذي تختاره.</p>
          <Link href="/experiences" className="button button-outline">استكشف التجارب <ArrowLeft size={17} /></Link>
        </div>
      </section>

      <section className="heritage-band">
        <div className="page-frame heritage-band-inner">
          <div className="heritage-band-copy">
            <p className="eyebrow light">مسارات من الذاكرة</p>
            <h2>خمس نوافذ<br />على تراث عالمي.</h2>
            <p>لبدة وشحات وصبراتة وأكاكوس وغدامس؛ مواقع تكشف اتساع الحكاية الليبية بين المتوسط والصحراء.</p>
            <Link href="/heritage" className="button button-sand">إلى ملف التراث <ArrowLeft size={17} /></Link>
          </div>
          <div className="heritage-route" aria-hidden="true">
            <span className="route-line" />
            {[["01", "لبدة"], ["02", "شحات"], ["03", "صبراتة"], ["04", "أكاكوس"], ["05", "غدامس"]].map(([num, label]) => <div className="route-stop" key={num}><i>{num}</i><b>{label}</b></div>)}
          </div>
        </div>
      </section>

      <section className="culture-callout page-frame">
        <div className="culture-copy">
          <p className="eyebrow">روح المكان</p>
          <span className="feature-icon warm"><Sparkles size={22} /></span>
          <h2>اسمع الحكاية<br />في المائدة واليد والحركة.</h2>
          <p>المطبخ والتقاليد والفروسية والفخار والنسيج ليست تفاصيل جانبية؛ بل طرق أخرى لقراءة المكان ومقابلة ناسه.</p>
          <Link href="/culture" className="underlined-link">افتح صفحات الثقافة <ArrowLeft size={16} /></Link>
        </div>
        <div className="culture-image"><img src={assets.craftTable} alt="معلم من العمارة التقليدية في غدامس" /></div>
      </section>

      <section className="planner-banner page-frame">
        <div className="planner-symbol"><Route size={31} /></div>
        <div><p className="eyebrow">مخطط الرحلة</p><h2>{stops.length ? `لديك ${stops.length} محطات محفوظة.` : "ابدأ بمحطة، ثم اربط الباقي."}</h2><p>احتفظ بالوجهات التي تستدعيك، ثم راجعها في مخطط رحلتك قبل الانطلاق.</p></div>
        <Link href="/trip" className="button button-ink">افتح مخططي <Compass size={17} /></Link>
      </section>
    </SiteShell>
  );
}
