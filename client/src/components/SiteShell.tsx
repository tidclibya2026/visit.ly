/**
 * Design reminder — «دفاتر الرحّالة»: رأس تحريري نظيف، مسارات واضحة، وأختام/إشارات
 * دقيقة بدل عناصر تنقل صاخبة. يجب أن يبقى الإيقاع هادئًا وسهل القراءة بالعربية.
 */
import { ArrowUpLeft, Compass, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ReactNode, useEffect, useState } from "react";
import { assets } from "@/lib/content";

const navigation = [
  { href: "/", label: "الرئيسية" },
  { href: "/destinations", label: "وجهات" },
  { href: "/experiences", label: "تجارب" },
  { href: "/culture", label: "ثقافة" },
  { href: "/heritage", label: "تراث" },
  { href: "/services", label: "دليل السفر" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-root" dir="rtl">
      <a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="تراث ليبيا، الصفحة الرئيسية" onClick={() => setOpen(false)}>
            <img src={assets.brandMark} alt="" className="brand-mark" />
            <span className="brand-copy"><strong>تراث ليبيا</strong><em>دليل مكتوب على الطريق</em></span>
            <span className="brand-edition" aria-hidden="true">إصدار<br />01</span>
          </Link>

          <nav className="desktop-nav" aria-label="التنقل الرئيسي">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={location === item.href ? "is-active" : ""}>{item.label}</Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link href="/trip" className="nav-plan"><Compass size={15} strokeWidth={1.9} /> خطط مسارك</Link>
            <button className="menu-button" type="button" aria-label={open ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
              {open ? <X size={21} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        <div className={`mobile-nav ${open ? "is-open" : ""}`}>
          <nav aria-label="التنقل على الهاتف">
            {navigation.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</Link>
            ))}
            <Link href="/trip" onClick={() => setOpen(false)} className="mobile-plan">افتح مخطط الرحلة <ArrowUpLeft size={17} /></Link>
          </nav>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-intro">
          <img src={assets.brandMark} alt="" className="footer-mark" />
          <p className="eyebrow light">من ليبيا، إلى مسارك <span className="footer-coordinates">32°53′N · 12°34′E</span></p>
          <h2>كل مدينة تفتح صفحة جديدة.</h2>
          <p>منصة عربية تجمع الوجهات والتجارب والتراث وإرشادات الاستعداد للرحلة في دفتر واحد سهل التصفح.</p>
        </div>
        <div className="footer-links">
          <p className="footer-label">استكشف</p>
          <Link href="/destinations">الوجهات</Link>
          <Link href="/experiences">ما الذي يمكن فعله</Link>
          <Link href="/culture">الثقافة والمذاقات</Link>
          <Link href="/heritage">التراث</Link>
        </div>
        <div className="footer-links">
          <p className="footer-label">رتّب الرحلة</p>
          <Link href="/trip">مخطط الرحلة</Link>
          <Link href="/services">خدمات وإرشادات</Link>
          <a href="https://evisa.gov.ly/" target="_blank" rel="noreferrer">بوابة التأشيرة الرسمية</a>
          <a href="tel:+218">دليل أرقام مفيد</a>
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} تراث ليبيا</span>
        <span>محتوى المنصة من المواد والمستندات التي زُوّدت بها للمشروع.</span>
      </div>
    </footer>
  );
}
