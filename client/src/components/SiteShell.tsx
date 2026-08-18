/**
 * Design reminder — «دفاتر الرحّالة»: رأس تحريري نظيف، مسارات واضحة، وأختام/إشارات
 * دقيقة بدل عناصر تنقل صاخبة. يجب أن يبقى الإيقاع هادئًا وسهل القراءة بالعربية.
 */
import { ArrowUpLeft, Compass, Globe2, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ReactNode, useEffect, useState } from "react";
import { assets } from "@/lib/content";
import { ImageInspector } from "@/components/ImageInspector";
import { KnowledgeAssistant } from "@/components/KnowledgeAssistant";
import { languageOptions, useLanguage } from "@/contexts/LanguageContext";

const navigation = [
  { href: "/", labelKey: "nav.home" }, { href: "/destinations", labelKey: "nav.destinations" }, { href: "/experiences", labelKey: "nav.experiences" }, { href: "/culture", labelKey: "nav.culture" }, { href: "/heritage", labelKey: "nav.heritage" }, { href: "/events", labelKey: "nav.events" }, { href: "/services", labelKey: "nav.services" }, { href: "/atlas", labelKey: "nav.atlas" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t, isRtl } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`site-root language-${language}`} dir={isRtl ? "rtl" : "ltr"}>
      <a className="skip-link" href="#main-content">{t("nav.skip")}</a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          <Link href="/" className="brand" aria-label={t("nav.home")} onClick={() => setOpen(false)}>
            <img src={assets.brandMark} alt="Visit Libya | زور ليبيا" className="brand-mark" />
            <span className="brand-stamp"><b>Visit Libya</b><span>{t("brand.official")}</span></span>
          </Link>

          <nav className="desktop-nav" aria-label={t("nav.main")}>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={location === item.href ? "is-active" : ""}>{t(item.labelKey)}</Link>
            ))}
          </nav>

          <div className="header-actions">
            <label className="language-picker"><Globe2 size={14} /><span className="sr-only">{t("nav.language")}</span><select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} aria-label={t("nav.language")}>{languageOptions.map((item) => <option value={item.code} key={item.code}>{item.label}</option>)}</select></label>
            <Link href="/trip" className="nav-plan"><Compass size={15} strokeWidth={1.9} /> {t("nav.plan")}</Link>
            <button className="menu-button" type="button" aria-label={open ? t("nav.menuClose") : t("nav.menuOpen")} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
              {open ? <X size={21} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        <div className={`mobile-nav ${open ? "is-open" : ""}`}>
          <nav aria-label={t("nav.mobile")}>
            {navigation.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{t(item.labelKey)}</Link>
            ))}
            <Link href="/trip" onClick={() => setOpen(false)} className="mobile-plan">{t("nav.openPlan")} <ArrowUpLeft size={17} /></Link>
          </nav>
        </div>
      </header>
      <main id="main-content" key={`${location}-${language}`} className="page-content-transition">{children}</main>
      <Footer />
      <ImageInspector />
      <KnowledgeAssistant />
    </div>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-intro">
          <img src={assets.brandMark} alt="Visit Libya | زور ليبيا" className="footer-mark" />
          <p className="eyebrow light">Visit Libya · زور ليبيا <span className="footer-coordinates">32°53′N · 12°34′E</span></p>
          <h2>{t("footer.title")}</h2>
          <p>{t("footer.copy")}</p>
        </div>
        <div className="footer-links">
          <p className="footer-label">{t("footer.explore")}</p>
          <Link href="/destinations">{t("footer.destinations")}</Link><Link href="/experiences">{t("footer.experiences")}</Link><Link href="/culture">{t("footer.culture")}</Link><Link href="/heritage">{t("footer.heritage")}</Link><Link href="/events">{t("footer.events")}</Link>
        </div>
        <div className="footer-links">
          <p className="footer-label">{t("footer.plan")}</p>
          <Link href="/trip">{t("footer.trip")}</Link><Link href="/atlas">{t("footer.atlas")}</Link><Link href="/services">{t("footer.services")}</Link><a href="https://evisa.gov.ly/" target="_blank" rel="noreferrer">{t("footer.visa")}</a><a href="tel:+218">{t("footer.help")}</a>
        </div>
      </div>
      <div className="footer-base">
        <span>{t("footer.credit")}</span>
        <span>Visit Libya · زور ليبيا</span>
      </div>
    </footer>
  );
}
