/**
 * Design reminder — «دفاتر الرحّالة»: رأس تحريري نظيف، مسارات واضحة، وأختام/إشارات
 * دقيقة بدل عناصر تنقل صاخبة. يجب أن يبقى الإيقاع هادئًا وسهل القراءة بالعربية.
 */
import { ArrowUpLeft, Compass, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ReactNode, useEffect, useState } from "react";
import { assets } from "@/lib/content";
import { ImageInspector } from "@/components/ImageInspector";
import { KnowledgeAssistant } from "@/components/KnowledgeAssistant";

const navigation = [
  { href: "/", label: "الرئيسية" },
  { href: "/destinations", label: "وجهات" },
  { href: "/experiences", label: "تجارب" },
  { href: "/culture", label: "ثقافة" },
  { href: "/heritage", label: "تراث" },
  { href: "/events", label: "فعاليات" },
  { href: "/services", label: "دليل السفر" },
  { href: "/atlas", label: "الأطلس" },
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
            <img src={assets.brandMark} alt="Visit Libya | زور ليبيا" className="brand-mark" />
            <span className="brand-stamp"><b>Visit Libya</b><span>دليل رسمي</span></span>
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
      <main id="main-content" key={location} className="page-content-transition">{children}</main>
      <Footer />
      <ImageInspector />
      <KnowledgeAssistant />
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-intro">
          <img src={assets.brandMark} alt="Visit Libya | زور ليبيا" className="footer-mark" />
          <p className="eyebrow light">Visit Libya · زور ليبيا <span className="footer-coordinates">32°53′N · 12°34′E</span></p>
          <h2>دليل ليبيا الميداني.</h2>
          <p>وجهات وتجارب وتراث ومعلومات عملية من مواد مركز المعلومات والتوثيق السياحي.</p>
        </div>
        <div className="footer-links">
          <p className="footer-label">استكشف</p>
          <Link href="/destinations">الوجهات</Link>
          <Link href="/experiences">ما الذي يمكن فعله</Link>
          <Link href="/culture">الثقافة والمذاقات</Link>
          <Link href="/heritage">التراث</Link>
          <Link href="/events">رزنامة الفعاليات</Link>
        </div>
        <div className="footer-links">
          <p className="footer-label">رتّب الرحلة</p>
          <Link href="/trip">مخطط الرحلة</Link>
          <Link href="/atlas">أطلس ليبيا السياحي</Link>
          <Link href="/services">خدمات وإرشادات</Link>
          <a href="https://evisa.gov.ly/" target="_blank" rel="noreferrer">بوابة التأشيرة الرسمية</a>
          <a href="tel:+218">دليل أرقام مفيد</a>
        </div>
      </div>
      <div className="footer-base">
        <span>تصميم وتنفيذ مركز المعلومات والتوثيق السياحي © 2026</span>
        <span>Visit Libya · زور ليبيا</span>
      </div>
    </footer>
  );
}
