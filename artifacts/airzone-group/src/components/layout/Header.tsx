import { useEffect, useRef, useState } from 'react';
import { m } from 'motion/react';
import { Mail, Menu, PackageSearch, X, ArrowRight } from 'lucide-react';
import { Link, LanguageSwitcher, LanguageToggle, useBarePath, useLocale } from '@/site/locale';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { businessContacts } from '@/config/business-contacts';
import { scrollToTop, setScrollLocked } from '@/motion/SmoothScroll';
import { ServicesMenu } from './ServicesMenu';
import { useDivision } from './WhatsAppButton';
import { QuoteChooser, QuoteLink, QuoteOptions, useQuoteKind } from './QuoteCta';

/** Pages whose hero runs under the header: there it starts fully transparent over the photography. */
const OVERLAY_PATHS = new Set(['/', '/logistics', '/travel']);

const luminance = (color: string) => {
  const m = color.match(/[\d.]+/g);
  if (!m) return null;
  const [r, g, b, a = 1] = m.map(Number);
  return { l: (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255, a };
};

/**
 * True when the section-level backdrop at or above `start` is dark. Only elements at least 60% of
 * the viewport wide count (a button or card crossing the line does not flip the header). An opaque
 * background colour decides; a section without one (photo, gradient or canvas behind it) is judged
 * by its text colour, since light text only ever sits on a dark backdrop.
 */
function onDarkBackground(start: Element | null) {
  const minWidth = window.innerWidth * 0.6;
  for (let n = start; n && n !== document.documentElement; n = n.parentElement) {
    if (n.getBoundingClientRect().width < minWidth) continue;
    const cs = getComputedStyle(n);
    const bg = luminance(cs.backgroundColor);
    if (bg && bg.a >= 0.5) return bg.l < 0.5;
    const text = luminance(cs.color);
    if (text && text.l > 0.7) return true;
    if (cs.backgroundImage !== 'none') return false;
  }
  return false;
}

export function Header() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const path = useBarePath();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const bar = useRef<HTMLElement>(null);
  // Travel pages show the travel team's address; every other page the logistics address.
  const division = useDivision();
  const quoteKind = useQuoteKind();
  const email = businessContacts[division].emails[0];
  const overlay = OVERLAY_PATHS.has(path);

  // Publish the header's real height (--az-header-h) for layouts that sit
  // directly below it, such as the homepage opening's sticky stage.
  // Also the bar alone (--az-nav-h, what stays on screen once the strip has slid away) and the
  // strip (--az-strip-h, how far it slides).
  useEffect(() => {
    const el = bar.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const root = document.documentElement.style;
    const nav = el.querySelector<HTMLElement>('.az-navbar');
    const strip = el.querySelector<HTMLElement>('.az-topbar');
    const ro = new ResizeObserver(() => {
      root.setProperty('--az-header-h', `${Math.round(el.offsetHeight)}px`);
      if (nav) root.setProperty('--az-nav-h', `${Math.round(nav.offsetHeight)}px`);
      if (strip) root.setProperty('--az-strip-h', `${Math.round(strip.offsetHeight)}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The header always stays on screen and blends with what is behind it:
  //  - at the top of the homepage, /logistics and /travel it is fully transparent over the hero
  //    (data-tone="clear"); at the top of other pages it is the standard white bar ("solid");
  //  - once scrolled, the announcement strip slides away (data-lift) and the bar turns to frosted
  //    glass whose tone follows the section underneath: "dark" glass with white text over dark
  //    sections, "light" glass with navy text over light ones.
  // Attributes are set straight on the element from a rAF-throttled scroll check (no React state per frame).
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const nav = el.querySelector<HTMLElement>('.az-navbar');
    let raf = 0;
    let lastHit: Element | null = null;
    let lastDark = false;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      let tone = overlay ? 'clear' : 'solid';
      if (y > 8) {
        const line = (nav?.getBoundingClientRect().bottom ?? 80) + 2;
        const hit = document.elementsFromPoint(window.innerWidth / 2, line)
          .find(n => !el.contains(n) && !n.closest('.az-wa-dock, .az-call-dock, .az-mobile-bar')) ?? null;
        if (hit !== lastHit) { lastHit = hit; lastDark = onDarkBackground(hit); }
        tone = lastDark ? 'dark' : 'light';
      }
      if (el.dataset.tone !== tone) el.dataset.tone = tone;
      const lift = y > 40;
      if (lift !== ('lift' in el.dataset)) { if (lift) el.dataset.lift = ''; else delete el.dataset.lift; }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [overlay, path]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu on navigation. Switching language from the mobile menu closes
  // it too; keyboard focus then returns to the menu button instead of the page.
  const shownLocale = useRef(locale);
  useEffect(() => {
    const switchedLanguage = shownLocale.current !== locale;
    shownLocale.current = locale;
    if (switchedLanguage && open) requestAnimationFrame(() => toggle.current?.focus({ preventScroll: true }));
    setOpen(false);
  }, [path, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setScrollLocked(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // A nested disclosure handles its own Escape first (defaultPrevented).
      if (e.key === 'Escape' && !e.defaultPrevented) { setOpen(false); toggle.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); setScrollLocked(false); };
  }, [open]);

  const cur = (p: string) => (p === '/' ? path === '/' : path === p || path.startsWith(`${p}/`)) ? 'page' as const : undefined;
  const servicesActive = path.startsWith('/logistics') && path !== '/logistics/request-quote';
  const close = () => setOpen(false);
  // After Services: the vehicles and trailers showroom (homepage section), then locations, about, contact.
  const links: [string, string, string][] = [
    ['/', 'Home', 'الرئيسية'],
    ['/#vehicles', 'Vehicles', 'المركبات'],
    ['/locations', 'Locations', 'المواقع'],
    ['/about', 'About', 'من نحن'],
    ['/contact', 'Contact', 'اتصل بنا'],
  ];
  // On narrower desktops (1024–1279px) these step aside: the logo is the way home, and Locations
  // (and, on travel pages, About) stay one click away in the Services menu, footer and mobile menu.
  const extra = new Set(['/', '/locations', ...(division === 'travel' ? ['/about'] : [])]);
  // Travel pages get the travel business's own navigation (its offers, services and destinations)
  // instead of the logistics services menu, locations and shipment tracking; logistics stays one
  // click away in the top bar.
  const travel = division === 'travel';
  const travelLinks: [string, string, string][] = [
    ['/', 'Home', 'الرئيسية'],
    ['/travel', 'Travel & Tourism', 'السفر والسياحة'],
    ['/travel#offers', 'Offers', 'العروض'],
    ['/travel#tv-services', 'Services', 'الخدمات'],
    ['/destinations', 'Destinations', 'الوجهات'],
    ['/about', 'About', 'من نحن'],
    ['/contact', 'Contact', 'اتصل بنا'],
  ];
  const travelCur = (href: string) => (href.includes('#') ? undefined : href === '/travel' ? (path === '/travel' ? 'page' as const : undefined) : cur(href));
  const linkCur = (href: string) => (href.includes('#') ? undefined : cur(href));

  return <header ref={bar} className={`az-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-menu-open' : ''}`}
    data-overlay={overlay ? '' : undefined} data-tone={overlay ? 'clear' : 'solid'}>
    <a className="az-skip" href="#main">{ar ? 'تخطَّ إلى المحتوى' : 'Skip to content'}</a>
    <div className="az-topbar">
      <div className="az-container az-topbar-inner">
        <p>{path === '/'
          ? (ar ? 'التخليص الجمركي · التخزين · النقل · التوصيل — المملكة العربية السعودية ودول الخليج' : 'Custom Clearance · Warehousing · Transportation · Delivery — Saudi Arabia & the GCC')
          : travel
            ? (ar ? 'إيرزون للسفر والسياحة · العطلات والطيران والفنادق وسفر الأعمال من الرياض' : 'Airzone Travel & Tourism · Holidays, flights, hotels and business travel from Riyadh')
            : (ar ? 'النقل · التخزين · التوصيل · الجمارك — المملكة العربية السعودية ودول الخليج' : 'Transportation · Warehousing · Delivery · Customs — Saudi Arabia & the GCC')}</p>
        <div className="az-topbar-right">
          {path !== '/' && <a href={`mailto:${email}`} dir="ltr" className="az-topbar-mail" data-division={division}><Mail size={13} aria-hidden="true" />{email}</a>}
          {travel
            ? <Link href="/logistics" className="az-topbar-link">{ar ? 'إيرزون للخدمات اللوجستية' : 'Airzone Logistics'}</Link>
            : <Link href="/travel" className="az-topbar-link">{ar ? 'السفر والسياحة' : 'Travel & Tourism'}</Link>}
        </div>
      </div>
    </div>
    <div className="az-navbar">
      <div className="az-container az-navbar-inner">
        <Link href="/" className="az-brand" aria-label={ar ? 'مجموعة إيرزون — الصفحة الرئيسية' : 'Airzone Group — Home'} data-testid="link-home"
          onClick={e => {
            // Already on the homepage (either language): the route would not change,
            // so return to the top here; the scroll-driven opening resets itself.
            if (path === '/' && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); setOpen(false); scrollToTop(); }
          }}>
          <BrandLogo eager sizes="(max-width: 760px) 110px, 140px" decorative />
        </Link>
        <nav className="az-nav-desktop" aria-label={ar ? 'التنقل الرئيسي' : 'Main'}>
          {travel
            ? travelLinks.map(([href, en, a]) => <Link key={href} href={href} className="az-nav-link" aria-current={travelCur(href)} data-nav-extra={extra.has(href) ? '' : undefined}>{ar ? a : en}</Link>)
            : <>
              <Link href="/" className="az-nav-link" aria-current={cur('/')} data-nav-extra="">{ar ? 'الرئيسية' : 'Home'}</Link>
              <ServicesMenu variant="desktop" path={path} active={servicesActive} onNavigate={close} />
              {links.slice(1).map(([href, en, a]) => <Link key={href} href={href} className="az-nav-link" aria-current={linkCur(href)} data-nav-extra={extra.has(href) ? '' : undefined}>{ar ? a : en}</Link>)}
            </>}
        </nav>
        <div className="az-nav-actions">
          {!travel && <Link href="/track" className="az-btn az-btn-ghost az-btn-sm az-track" aria-current={cur('/track')} aria-label={ar ? 'تتبع شحنة' : 'Track a shipment'} title={ar ? 'تتبع شحنة' : 'Track a shipment'}><PackageSearch size={16} aria-hidden="true" /><span>{ar ? 'تتبع شحنة' : 'Track'}</span></Link>}
          <LanguageToggle />
          {quoteKind === 'chooser'
            ? <QuoteChooser className="az-btn az-btn-primary az-btn-sm az-quote" placement="below-end" label={ar ? 'اطلب عرض سعر' : 'Request a quote'} />
            : <QuoteLink kind={quoteKind} className="az-btn az-btn-primary az-btn-sm az-quote">{quoteKind === 'travel' ? (ar ? 'اطلب عرض سعر للسفر' : 'Request a travel quote') : (ar ? 'اطلب عرض سعر' : 'Request a quote')}</QuoteLink>}
          <button ref={toggle} type="button" className="az-menu-toggle" aria-expanded={open} aria-controls="az-mobile-nav" data-testid="button-menu"
            aria-label={ar ? (open ? 'أغلق القائمة' : 'افتح القائمة') : (open ? 'Close menu' : 'Open menu')} onClick={() => setOpen(o => !o)}>
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
    <m.div id="az-mobile-nav" className="az-mobile-nav" inert={!open} aria-hidden={!open}
      initial={false}
      animate={open ? { opacity: 1, y: 0, visibility: 'visible' } : { opacity: 0, y: -12, transitionEnd: { visibility: 'hidden' } }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      <nav className="az-container" aria-label={ar ? 'التنقل الرئيسي (الجوال)' : 'Main (mobile)'} data-lenis-prevent>
        {travel
          ? <>
            {travelLinks.map(([href, en, a]) => <Link key={href} href={href} className="az-nav-link" aria-current={travelCur(href)} onClick={close}>{ar ? a : en}</Link>)}
            <Link href="/logistics" className="az-nav-link" onClick={close}>{ar ? 'إيرزون للخدمات اللوجستية' : 'Airzone Logistics'}</Link>
          </>
          : <>
            <Link href="/" className="az-nav-link" aria-current={cur('/')} onClick={close}>{ar ? 'الرئيسية' : 'Home'}</Link>
            <ServicesMenu variant="mobile" path={path} active={servicesActive} onNavigate={close} />
            {links.slice(1).map(([href, en, a]) => <Link key={href} href={href} className="az-nav-link" aria-current={linkCur(href)} onClick={close}>{ar ? a : en}</Link>)}
            <Link href="/track" className="az-nav-link" aria-current={cur('/track')} onClick={close}>{ar ? 'تتبع شحنة' : 'Track a shipment'}</Link>
            <Link href="/travel" className="az-nav-link" onClick={close}>{ar ? 'إيرزون للسفر والسياحة' : 'Airzone Travel & Tourism'}</Link>
          </>}
        <div className="az-mobile-cta">
          {quoteKind === 'chooser'
            ? <div className="az-mobile-quote"><p className="az-qc-title">{ar ? 'اطلب عرض سعر: لأي نشاط؟' : 'Request a quote for:'}</p><QuoteOptions onNavigate={close} /></div>
            : <QuoteLink kind={quoteKind} className="az-btn az-btn-primary" onNavigate={close}>{quoteKind === 'travel' ? (ar ? 'اطلب عرض سعر للسفر' : 'Request a travel quote') : (ar ? 'اطلب عرض سعر' : 'Request a quote')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></QuoteLink>}
          <a href={`mailto:${email}`} className="az-btn az-btn-outline" dir="ltr" data-division={division}><Mail size={16} aria-hidden="true" />{email}</a>
          <LanguageSwitcher className="az-mobile-lang" />
        </div>
      </nav>
    </m.div>
  </header>;
}
