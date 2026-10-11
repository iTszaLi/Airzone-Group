import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link as WouterLink, Router, useLocation } from 'wouter';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Ship, Plane, PackageCheck,
  Globe2, MapPin, ShieldCheck, Boxes, Truck, Compass, ChevronRight,
  Search, Check, CircleAlert, LoaderCircle, FileText, SlidersHorizontal,
  LogIn, Mail, Phone, CalendarDays, Send, MoveRight, Anchor,
  Landmark, CircleHelp, MessageCircle, Star, Settings2, LogOut,
  Facebook, Instagram, Linkedin, Youtube
} from 'lucide-react';
import {
  useCreateContactEnquiry, useCreateLogisticsEnquiry, useCreateTravelEnquiry,
  useGetShipmentTracking, getGetShipmentTrackingQueryKey, useGetAdminOverview,
  useListAdminEnquiries, useUpdateAdminEnquiry, useGetPublicSiteSettings, getGetPublicSiteSettingsQueryKey,
  useCreateCallbackRequest, useListMyEnquiries, useListAdminShipments,
  useCreateAdminShipment, useUpdateAdminShipment, useUpdateAdminSiteSettings
} from '@workspace/api-client-react';
import type {
  ContactEnquiryInput, LogisticsEnquiryInput, TravelEnquiryInput,
  AdminEnquiryUpdate, CallbackRequestInput, ShipmentInput, AdminSiteSettingsUpdate
} from '@workspace/api-client-react';
import { t, pageDirection, type Locale } from './lib/i18n';
import { businessContacts, corporateTagline } from './config/business-contacts';
import { photos, photoUrl } from './config/photography';
import { BusinessesMenu } from './components/BusinessesMenu';
import { logisticsOverviewAr, travelOverviewAr } from './config/page-localization';
import { TravelGuide } from './components/TravelGuide';
import { ServiceContent } from './components/ServiceContent';
import { logisticsContent } from './config/logistics-content';
import { HomeExperience } from './components/home/HomeExperience';
import { Seo } from './seo/Seo';
import { AnalyticsRuntime, analyticsEvent, recordLead } from './analytics/runtime';
import { departmentDivision } from './analytics/events';
import { ConsentUi, PrivacyChoicesButton } from './analytics/ConsentUi';
import './index.css';

const client = new QueryClient();

type LocaleContextValue = { locale: Locale; changeLocale: (locale: Locale) => void };
const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  changeLocale: () => undefined,
});

function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const locale: Locale = location === '/ar' || location.startsWith('/ar/') ? 'ar' : 'en';
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = pageDirection(locale);
  }, [locale]);
  const changeLocale = (next: Locale) => {
    const cleanPath = location.replace(/^\/(ar|en)(?=\/|$)/, '') || '/';
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    setLocation(next === 'ar'
      ? (normalizedPath === '/' ? '/ar/' : `/ar${normalizedPath}`)
      : normalizedPath);
    window.localStorage.setItem('airzone-locale', next);
  };
  return <LocaleContext.Provider value={{ locale, changeLocale }}>{children}</LocaleContext.Provider>;
}

function useLocale() {
  return useContext(LocaleContext);
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };
function Link(props: LinkProps) {
  const { locale } = useLocale();
  const href = props.href;
  const localizedHref = href.startsWith('/')
    ? (locale === 'ar'
      ? (href === '/' ? '/ar/' : `/ar${href}`)
      : href.replace(/^\/(ar|en)(?=\/|$)/, '') || '/')
    : href;
  return <WouterLink {...props} href={localizedHref} />;
}

function LanguageSwitcher() {
  const { locale, changeLocale } = useLocale();
  return <div className="language-switch" aria-label="Language">
    <button type="button" onClick={() => changeLocale('en')} aria-pressed={locale === 'en'}>EN</button>
    <span aria-hidden="true">|</span>
    <button type="button" onClick={() => changeLocale('ar')} aria-pressed={locale === 'ar'}>العربية</button>
  </div>;
}

function useSiteSettings() {
  return useGetPublicSiteSettings({ query: { queryKey: getGetPublicSiteSettingsQueryKey(), staleTime: 120_000 } });
}

function whatsappHref(phone: string | null | undefined, message: string) {
  const digits = phone?.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}

function trackEvent(event: string, division?: string) {
  // Link interactions are tracked once by the consent-aware delegated listener.
  if (event === 'google_review_click') analyticsEvent(event, { business_division: division || 'group' });
}

const services = [
  ['ATA Carnet assistance', '/logistics/ata-carnet', 'Shipment support for temporary imports under an ATA Carnet.', FileText],
  ['Exhibition and event logistics', '/logistics/exhibition-event-logistics', 'Freight and customs planned around event dates.', Compass],
  ['Import and export support', '/logistics/import-export', 'Documents, customs and freight in one plan.', Globe2],
  ['Customs clearance', '/logistics/customs-clearance', 'A clear path through import and export requirements.', Landmark],
  ['Freight forwarding', '/logistics/freight-forwarding', 'Coordinated movement from origin to destination.', Boxes],
  ['Air freight', '/logistics/air-freight', 'Time-conscious cargo movement by air.', Plane],
  ['Sea freight', '/logistics/sea-freight', 'Flexible ocean freight for cargo of varied scale.', Ship],
  ['Road transportation', '/logistics/road-transportation', 'Road connections across local and regional routes.', Truck],
  ['Warehousing', '/logistics/warehousing', 'Space and handling support for your supply chain.', PackageCheck],
  ['Project cargo', '/logistics/project-cargo', 'Considered coordination for complex cargo movements.', Anchor],
] as const;
const travelLinks = [
  ['Flights', '/travel/flights'], ['Holiday packages', '/travel/holiday-packages'],
  ['International tours', '/travel/international-tours'], ['Domestic tours', '/travel/domestic-tours'],
  ['Hotels', '/travel/hotels'], ['Visa assistance', '/travel/visa-assistance'],
  ['Umrah', '/travel/umrah'], ['Airport transfers', '/travel/airport-transfers'],
] as const;

const brandBase = import.meta.env.BASE_URL;
const brandAsset = (name: string) => `${brandBase}assets/brand/${name}`;
const brandLogos = {
  group: { src: 'airzone-group-logo', alt: 'Airzone Group', w: 184, h: 116 },
  logistics: { src: 'airzone-logistics-logo', alt: 'Airzone Logistics', w: 412, h: 112 },
  travel: { src: 'airzone-travel-logo', alt: 'Airzone Travels & Tourism', w: 196, h: 162 },
} as const;

function BrandLogo({ division = 'group', className = '' }: { division?: keyof typeof brandLogos; className?: string }) {
  const l = brandLogos[division];
  return <img className={`brand-logo brand-logo-${division} ${className}`} src={brandAsset(`${l.src}.png`)} srcSet={`${brandAsset(`${l.src}.png`)} 1x, ${brandAsset(`${l.src}@2x.png`)} 2x`} width={l.w} height={l.h} alt={l.alt} decoding="async" />;
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" className={`brand ${inverse ? 'brand-inverse' : ''}`} data-testid="link-home" aria-label="Airzone Group home">
    <BrandLogo division="group" />
  </Link>;
}

function DivisionLogo({ division }: { division: 'logistics' | 'travel' }) {
  return <div className={`division-logo division-logo-${division}`}><BrandLogo division={division} /></div>;
}

function WhatsAppLink({ department, message, label, className = '' }: { department: 'logistics' | 'travel'; message: string; label: string; className?: string }) {
  const settings = useSiteSettings().data;
  const href = whatsappHref(department === 'logistics' ? settings?.logisticsWhatsapp : settings?.travelWhatsapp, message);
  if (!href) return null;
  return <a className={className} href={href} target="_blank" rel="noreferrer" onClick={() => trackEvent('whatsapp_click', department)}><MessageCircle size={15}/> {label}</a>;
}

function ReviewInvitation({ division }: { division: string }) {
  const { locale } = useLocale();
  const url = useSiteSettings().data?.googleReviewUrl;
  if (!url) return null;
  return <section className="callback-strip"><div><Eyebrow>{locale === 'ar' ? 'رأيك يهمنا' : 'Your feedback'}</Eyebrow><h2>{t(locale, 'common.review')}</h2></div><a className="button button-navy" href={url} target="_blank" rel="noreferrer" onClick={() => trackEvent('google_review_click', division)}>{t(locale, 'common.review')} <Star size={15}/></a></section>;
}

function MobileConversionBar() {
  const { locale } = useLocale();
  return <div className="mobile-bar"><Link href="/logistics/request-quote">{t(locale, 'common.quote')}</Link><Link href="/callback">{t(locale, 'common.callback')}</Link></div>;
}

function AnalyticsConsent() {
  const { locale } = useLocale();
  return <ConsentUi locale={locale}/>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const { locale } = useLocale();
  const copy = (key: string) => t(locale, key);
  const [rawLoc] = useLocation();
  const path = rawLoc.replace(/^\/ar(?=\/|$)/, '').replace(/\/+$/, '') || '/';
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        setOpen(false);
        mobileToggle.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  const cur = (p: string) => (p === '/' ? path === '/' : path === p || path.startsWith(`${p}/`)) ? 'page' as const : undefined;
  const isHome = path === '/';
  const solid = !isHome || scrolled || open;
  return <header className={`site-header ${isHome ? 'header-home' : ''} ${solid ? 'header-solid' : 'header-clear'}`}>
    <div className="topline"><span>{locale === 'ar' ? 'مجموعة إيرزون · أعمال متخصصة' : 'AIRZONE GROUP · SPECIALIST BUSINESSES'}</span><span className="top-right"><LanguageSwitcher/><span className="top-dot" /><Link href="/contact">{copy('nav.getInTouch')} <ArrowUpRight size={12}/></Link></span></div>
    <div className="nav-wrap">
      <Brand />
      <button ref={mobileToggle} className="mobile-toggle" aria-label={locale === 'ar' ? (open ? 'أغلق قائمة التنقل' : 'افتح قائمة التنقل') : (open ? 'Close navigation' : 'Open navigation')} aria-expanded={open} aria-controls="airzone-main-nav" onClick={() => setOpen(!open)} data-testid="button-menu">{open ? <X/> : <Menu/>}</button>
      <nav id="airzone-main-nav" className={`main-nav ${open ? 'nav-open' : ''}`}>
        <Link onClick={() => setOpen(false)} href="/" aria-current={cur('/')} className="nav-link">{copy('nav.home')}</Link>
        <BusinessesMenu locale={locale} path={rawLoc} Link={Link} BrandLogo={BrandLogo} active={!!(cur('/logistics') || cur('/travel'))} onNavigate={() => setOpen(false)} />
        <Link onClick={() => setOpen(false)} href="/destinations" aria-current={cur('/destinations')} className="nav-link">{copy('nav.destinations')}</Link>
        <Link onClick={() => setOpen(false)} href="/travel/corporate-travel" aria-current={cur('/travel/corporate-travel')} className="nav-link">{copy('nav.corporate')}</Link>
        <Link onClick={() => setOpen(false)} href="/insights" aria-current={cur('/insights')} className="nav-link">{copy('nav.insights')}</Link>
        <Link onClick={() => setOpen(false)} href="/about" aria-current={cur('/about')} className="nav-link">{copy('nav.about')}</Link>
        <Link onClick={() => setOpen(false)} href="/contact" aria-current={cur('/contact')} className="nav-link">{copy('nav.contact')}</Link>
        <Link onClick={() => setOpen(false)} href="/track" aria-current={cur('/track')} className="nav-track"><PackageCheck size={15}/> {copy('nav.track')}</Link>
        <Link onClick={() => setOpen(false)} href="/logistics/request-quote" className="nav-quote">{copy('common.quote')}</Link>
      </nav>
    </div>
  </header>;
}

function FooterContactBlock({ division }: { division: 'logistics' | 'travel' }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const c = businessContacts[division];
  return <div className="azf-contact-block">
    <BrandLogo division={division} className="azf-contact-logo"/>
    <h4>{division === 'logistics' ? (ar ? 'إيرزون للخدمات اللوجستية' : 'AIRZONE LOGISTICS') : (ar ? 'إيرزون للسفر والسياحة' : 'AIRZONE TRAVELS & TOURISM')}</h4>
    <ul>
      {division === 'travel' && <li>Yahya Mal</li>}
      {c.emails.map(e => <li key={e}><a href={`mailto:${e}`} dir="ltr"><Mail size={14} aria-hidden="true"/><span>{e.slice(0, e.indexOf('@') + 1)}<wbr/>{e.slice(e.indexOf('@') + 1)}</span></a></li>)}
      {division === 'travel' && <li><a href="mailto:Ticketing@airzonetravel.net" dir="ltr"><Mail size={14} aria-hidden="true"/><span>Ticketing<br/>Ticketing@<wbr/>airzonetravel.net</span></a></li>}
      {c.phone && <li><a href={c.phone.href} dir="ltr"><Phone size={14} aria-hidden="true"/><span>{c.phone.label}</span></a></li>}
    </ul>
    {c.whatsappNumber && <a className="azf-map" href={`https://wa.me/${c.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} aria-hidden="true"/>{ar ? 'واتساب' : 'WhatsApp'}<span className="azf-sr">{ar ? ' (يفتح في نافذة جديدة)' : ' (opens in a new tab)'}</span></a>}
    {c.socialLinks.length > 0 && <div className="azf-social">{c.socialLinks.map(l => {
      const Icon = { LinkedIn: Linkedin, Instagram, Facebook, YouTube: Youtube, X: null }[l.name];
      return <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={`${c.name} on ${l.name} (opens in a new tab)`}>{Icon ? <Icon size={18} aria-hidden="true"/> : <span aria-hidden="true">X</span>}</a>;
    })}</div>}
  </div>;
}

function Footer() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const T = (en: string, arText: string) => ar ? arText : en;
  const logisticsLinks: [string, string, string][] = [
    ['Logistics overview', 'نظرة عامة', '/logistics'], ['Customs clearance', 'التخليص الجمركي', '/logistics/customs-clearance'],
    ['Freight forwarding', 'الشحن والتوريد', '/logistics/freight-forwarding'], ['Air freight', 'الشحن الجوي', '/logistics/air-freight'],
    ['Sea freight', 'الشحن البحري', '/logistics/sea-freight'], ['Road transportation', 'النقل البري', '/logistics/road-transportation'],
    ['Request a quote', 'اطلب عرض سعر', '/logistics/request-quote'], ['Track shipment', 'تتبع الشحنة', '/track'],
  ];
  const travelFooterLinks: [string, string, string][] = [
    ['Travel overview', 'نظرة عامة', '/travel'], ['Flights', 'الطيران', '/travel/flights'],
    ['Holiday packages', 'باقات العطلات', '/travel/holiday-packages'], ['Destinations', 'الوجهات', '/destinations'],
    ['Hotels', 'الفنادق', '/travel/hotels'], ['Corporate travel', 'سفر الأعمال', '/travel/corporate-travel'],
    ['Plan your trip', 'خطط لرحلتك', '/travel/enquiry'],
  ];
  const travel = businessContacts.travel;
  const logistics = businessContacts.logistics;
  return <>
    <section id="closing-contact-cta" className="azf-cta" aria-labelledby="azf-cta-title">
      <div className="azf-cta-inner">
        <div><div className="azf-eyebrow"><span aria-hidden="true"/>{T('START A CONVERSATION', 'ابدأ محادثة')}</div>
          <h2 id="azf-cta-title">{T("LET'S FIND THE RIGHT WAY FORWARD.", 'لنحدد معاً الخطوة المناسبة.')}</h2>
          <p>{T('Whether you need customs clearance and logistics support or help planning your next journey, our team is ready to hear from you.', 'سواء احتجت إلى التخليص الجمركي والدعم اللوجستي أو إلى المساعدة في تخطيط رحلتك القادمة، فريقنا جاهز للاستماع إليك.')}</p></div>
        <div className="azf-cta-actions">
          <Link href="/logistics/request-quote" className="azf-btn azf-btn-gold">{T('CONTACT OUR LOGISTICS TEAM', 'تواصل مع فريق الخدمات اللوجستية')} <ArrowRight size={15} aria-hidden="true"/></Link>
          <Link href="/travel/enquiry" className="azf-btn azf-btn-line">{T('PLAN YOUR TRIP', 'خطط لرحلتك')} <ArrowRight size={15} aria-hidden="true"/></Link>
        </div>
      </div>
    </section>
    <footer id="site-footer" className="azf-footer">
      <div className="azf-grid">
        <div className="azf-col azf-brand-col">
          <Brand inverse/>
          <p className="azf-tagline" dir="ltr">{corporateTagline}</p>
          <p className="azf-lead">{T('Two specialist businesses. One dependable point of connection.', 'نشاطان متخصصان، ونقطة تواصل موثوقة واحدة.')}</p>
          <p className="azf-copy">{T('Airzone Logistics supports customs clearance and cargo movement, while Airzone Travel & Tourism helps individuals and companies plan journeys with care.', 'تدعم إيرزون للخدمات اللوجستية التخليص الجمركي ونقل البضائع، بينما تساعد إيرزون للسفر والسياحة الأفراد والشركات على تخطيط رحلاتهم بعناية.')}</p>
          <p className="azf-place"><MapPin size={14} aria-hidden="true"/>{T('Saudi Arabia', 'المملكة العربية السعودية')}</p>
        </div>
        <nav className="azf-col" aria-label={T('Airzone Logistics', 'إيرزون للخدمات اللوجستية')}>
          <BrandLogo division="logistics" className="azf-division-logo"/>
          <h3 className="azf-heading">{T('Logistics', 'الخدمات اللوجستية')}</h3>
          <ul>{logisticsLinks.map(([en, a, href]) => <li key={href}><Link href={href}>{T(en, a)}</Link></li>)}</ul>
        </nav>
        <nav className="azf-col" aria-label={T('Airzone Travel & Tourism', 'إيرزون للسفر والسياحة')}>
          <BrandLogo division="travel" className="azf-division-logo"/>
          <h3 className="azf-heading">{T('Travel & Tourism', 'السفر والسياحة')}</h3>
          <ul>{travelFooterLinks.map(([en, a, href]) => <li key={href}><Link href={href}>{T(en, a)}</Link></li>)}</ul>
        </nav>
        <div id="footer-business-contacts" className="azf-col azf-contacts">
          <h3 className="azf-heading">{T('Contact our businesses', 'تواصل مع أعمالنا')}</h3>
          <FooterContactBlock division="logistics"/>
          <FooterContactBlock division="travel"/>
        </div>
        <address className="azf-col azf-office">
          <h3 className="azf-heading">{T('Visit our office', 'زيارة مكتبنا')}</h3>
          <div className="azf-contact-block">
            <h4>{T('AIRZONE TRAVEL & TOURISM', 'إيرزون للسفر والسياحة')}</h4>
            {travel.officeAddress && <p dir="ltr" className="azf-addr">{travel.officeAddress}</p>}
            {travel.mapsUrl && <a className="azf-map" href={travel.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={14} aria-hidden="true"/>{T('Get directions', 'احصل على الاتجاهات')}<ArrowUpRight size={13} aria-hidden="true"/><span className="azf-sr">{T(' (opens in a new tab)', ' (يفتح في نافذة جديدة)')}</span></a>}
          </div>
          <div className="azf-contact-block">
            <h4>{T('AIRZONE LOGISTICS', 'إيرزون للخدمات اللوجستية')}</h4>
            <p className="azf-addr">{logistics.officeAddress ?? T(logistics.country, 'المملكة العربية السعودية')}</p>
            {logistics.mapsUrl && <a className="azf-map" href={logistics.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={14} aria-hidden="true"/>{T('Get directions', 'احصل على الاتجاهات')}<ArrowUpRight size={13} aria-hidden="true"/></a>}
          </div>
          <div className="azf-office-actions">
            <Link href="/contact" className="azf-btn azf-btn-gold">{T('Talk to our team', 'تحدث إلى فريقنا')} <ArrowRight size={15} aria-hidden="true"/></Link>
            <Link href="/contact" className="azf-textlink">{T('Contact us', 'اتصل بنا')}</Link>
          </div>
        </address>
      </div>
      <div className="azf-bottom">
        <span>© {new Date().getFullYear()} Airzone Group. {T('All rights reserved.', 'جميع الحقوق محفوظة.')}</span>
        <nav aria-label={T('Legal', 'قانوني')}><Link href="/privacy">{T('Privacy Policy', 'سياسة الخصوصية')}</Link><Link href="/terms">{T('Terms & Conditions', 'الشروط والأحكام')}</Link><Link href="/admin">{T('Admin Access', 'دخول الإدارة')}</Link></nav>
        <LanguageSwitcher/>
      </div>
    </footer>
  </>;
}

function Layout({ children }: { children: React.ReactNode }) {
  return <><Header/><main>{children}</main><Footer/><MobileConversionBar/><AnalyticsConsent/></>;
}

function Eyebrow({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return <div className={`eyebrow ${gold ? 'eyebrow-gold' : ''}`}><span/>{children}</div>;
}

function Home() {
  const { locale } = useLocale();
  return <Layout>
    <HomeExperience locale={locale} Link={Link} BrandLogo={BrandLogo} />
    <ReviewInvitation division="group"/>
  </Layout>;
}

const logisticsOverview = {
  '/logistics/ata-carnet': ['ATA Carnet assistance', 'Support for the shipment side of temporary imports under an ATA Carnet.', 'Tell us about your goods, event and dates.'],
  '/logistics/exhibition-event-logistics': ['Exhibition and event logistics', 'Freight, customs and delivery planned around fixed event dates.', 'Share your event, venue and delivery deadline.'],
  '/logistics/import-export': ['Import and export support', 'Documents, customs and freight brought together for one shipment.', 'Share what you are moving and where.'],
  '/logistics': ['Logistics that keep business moving', 'A considered approach to cargo movement, customs and the details that connect them.', 'Move your next shipment with a team focused on clear communication and practical coordination.'],
  '/logistics/customs-clearance': ['Customs clearance', 'Support through the formalities that keep goods moving across borders.', 'Clearance requirements can vary by shipment. Share the details and our team can understand what support you need.'],
  '/logistics/freight-forwarding': ['Freight forwarding', 'A coordinated approach to moving cargo from origin to destination.', 'Explore freight options with a team that considers the complete movement, not just one leg of the journey.'],
  '/logistics/air-freight': ['Air freight', 'When time, handling and routing all matter.', 'Discuss your shipment details and timing with the logistics team.'],
  '/logistics/sea-freight': ['Sea freight', 'Ocean cargo movement with room to plan around your needs.', 'Tell us what you are moving, where it is going and when it needs to move.'],
  '/logistics/road-transportation': ['Road transportation', 'Practical connections over local and regional routes.', 'Share your origin, destination and cargo requirements to start a conversation.'],
  '/logistics/warehousing': ['Warehousing', 'Handling and storage as part of your wider logistics picture.', 'Let us understand your space, handling and timing requirements.'],
  '/logistics/project-cargo': ['Project cargo', 'A deliberate plan for complex cargo movements.', 'Start with the scope, route and constraints. Our team can take it from there.'],
};
const travelOverview: Record<string, [string, string, string]> = {
  '/travel': ['Travel, thoughtfully brought together', 'From the first idea to the final detail, plan a journey that feels like yours.', 'A single conversation can bring the moving parts of a trip into focus. Tell us where you want to go.'],
  '/travel/flights': ['Flights', 'Find a flight plan that fits your journey.', 'Share your departure city, destination and dates. Our team can help explore your options.'],
  '/travel/holiday-packages': ['Holiday packages', 'Time away, planned around what matters to you.', 'Tell us the kind of holiday you have in mind and we will help shape the next step.'],
  '/travel/international-tours': ['International tours', 'See somewhere new, with a plan that works for you.', 'Start with a destination or a feeling. We can help explore the details together.'],
  '/travel/domestic-tours': ['Domestic tours', 'Discover more of Saudi Arabia, at your own pace.', 'Share the places and experiences you have in mind.'],
  '/travel/hotels': ['Hotels', 'A stay that fits the rest of your journey.', 'Let us know your destination, dates and preferences.'],
  '/travel/visa-assistance': ['Visa assistance', 'Guidance to help you understand your visa requirements.', 'Requirements depend on your destination and circumstances. Share your plans and we can discuss the right support.'],
  '/travel/umrah': ['Umrah', 'Plan your pilgrimage with considered travel support.', 'Tell us your preferred dates and travel arrangements so our team can help you plan.'],
  '/travel/corporate-travel': ['Corporate travel', 'Travel support for teams, meetings and business journeys.', 'Share your company travel needs and our team can help understand the right arrangements.'],
  '/travel/airport-transfers': ['Airport transfers', 'A smoother connection between arrival and onward travel.', 'Share your flight details and ground transport needs.'],
};

function SectionTitle({ label, title, text }: { label: string; title: string; text: string }) {
  return <div className="page-title"><Eyebrow>{label}</Eyebrow><h1>{title}</h1><p>{text}</p></div>;
}

const serviceLabelsAr: Record<string, [string, string]> = {
  '/logistics/ata-carnet': ['المساعدة في دفتر ATA Carnet', 'دعم الشحنة للاستيراد المؤقت بموجب دفتر ATA Carnet.'],
  '/logistics/exhibition-event-logistics': ['لوجستيات المعارض والفعاليات', 'شحن وجمارك مخططان وفق مواعيد الفعالية.'],
  '/logistics/import-export': ['دعم الاستيراد والتصدير', 'المستندات والجمارك والشحن في خطة واحدة.'],
  '/logistics/customs-clearance': ['التخليص الجمركي', 'مسار واضح عبر متطلبات الاستيراد والتصدير.'],
  '/logistics/freight-forwarding': ['الشحن والتوريد', 'حركة منسقة من المنشأ إلى الوجهة.'],
  '/logistics/air-freight': ['الشحن الجوي', 'نقل بضائع جواً بمراعاة الوقت.'],
  '/logistics/sea-freight': ['الشحن البحري', 'شحن بحري مرن لبضائع بأحجام مختلفة.'],
  '/logistics/road-transportation': ['النقل البري', 'ترتيبات برية على المسارات المحلية والإقليمية.'],
  '/logistics/warehousing': ['التخزين', 'مساحة ومناولة لدعم سلسلة الإمداد.'],
  '/logistics/project-cargo': ['شحنات المشاريع', 'تنسيق مدروس لحركة البضائع المعقدة.'],
};
const travelLinkNamesAr: Record<string, string> = {
  '/travel/flights': 'الطيران', '/travel/holiday-packages': 'باقات العطلات', '/travel/international-tours': 'الجولات الدولية',
  '/travel/domestic-tours': 'الجولات الداخلية', '/travel/hotels': 'الفنادق', '/travel/visa-assistance': 'مساعدة التأشيرات',
  '/travel/umrah': 'العمرة', '/travel/airport-transfers': 'خدمات المطار',
};

function LogisticsPage({ path }: { path: string }) {
  const isLanding = path === '/logistics';
  const { locale } = useLocale();
  const T = <V,>(en: V, ar: V): V => locale === 'ar' ? ar : en;
  const base = logisticsOverview[path as keyof typeof logisticsOverview] ?? logisticsOverview['/logistics'];
  const item: readonly string[] = locale === 'ar' ? (logisticsOverviewAr[path] ?? logisticsOverviewAr['/logistics']) : base;
  const rich = logisticsContent[path];
  const richLang = rich?.[locale];
  return <Layout>
    <div className="subhero subhero-logistics"><div className="subhero-bg logistics-page-bg"/><div className="subhero-inner"><DivisionLogo division="logistics"/><nav className="crumb" aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}><Link href="/">{T('Home','الرئيسية')}</Link><ChevronRight size={13}/><Link href="/logistics">{T('Logistics','الخدمات اللوجستية')}</Link>{!isLanding && <><ChevronRight size={13}/><span aria-current="page">{richLang?.title ?? item[0]}</span></>}</nav><Eyebrow gold>{isLanding ? T('AIRZONE LOGISTICS','إيرزون للخدمات اللوجستية') : T('LOGISTICS SERVICES','الخدمات اللوجستية')}</Eyebrow><h1>{richLang?.title ?? item[0]}</h1><p>{richLang?.intro ?? item[1]}</p><div className="subhero-actions"><Link className="button button-gold" href="/logistics/request-quote">{T('Request a quote','اطلب عرض سعر')} <ArrowRight size={16}/></Link><Link className="text-link light-link" href="/track">{T('Track a shipment','تتبع شحنة')} <ArrowUpRight size={15}/></Link></div></div><span className="subhero-numeral">A / 01</span></div>
    <section className="split-intro"><div><Eyebrow>{isLanding ? T('The logistics business','نشاط الخدمات اللوجستية') : T('A clearer way to move','طريقة أوضح للنقل')}</Eyebrow><h2>{isLanding ? <>{T('Practical expertise.','خبرة عملية.')}<br/><i>{T('Connected thinking.','وتفكير متكامل.')}</i></> : (richLang?.title ?? item[0])}</h2></div><div><p>{item[2]}</p><Link href="/logistics/request-quote" className="under-link">{T('Tell us what you need','أخبرنا بما تحتاجه')} <ArrowRight size={15}/></Link></div></section>
    {isLanding ? <section className="service-section"><div className="section-heading"><div><Eyebrow>{T('Specialist services','خدمات متخصصة')}</Eyebrow><h2>{T(<>Find the right<br/>kind of support.</>,<>اعثر على الدعم<br/>المناسب لك.</>)}</h2></div><p>{T('Choose a service to learn more, or tell us about your shipment.','اختر خدمة لتعرف المزيد، أو أخبرنا عن شحنتك.')}</p></div><div className="service-list">{services.map(([title, href, description, Icon], i) => { const sv = locale === 'ar' ? serviceLabelsAr[href] : undefined; return <Link href={href} className="service-row" key={href} data-testid={`link-service-${i}`}><span className="service-index">0{i + 1}</span><span className="service-symbol"><Icon size={20}/></span><span className="service-copy"><b>{sv?.[0] ?? title}</b><small>{sv?.[1] ?? description}</small></span><ArrowUpRight size={18}/></Link>; })}</div></section> : rich ? null :
      <section className="service-detail"><div className="detail-left"><span className="detail-icon"><Boxes size={23}/></span><span className="detail-label">{T('SERVICE OVERVIEW','نظرة على الخدمة')}</span><h2>{T(<>Every move<br/>starts with<br/><i>the details.</i></>,<>كل شحنة<br/>تبدأ<br/><i>بالتفاصيل.</i></>)}</h2></div><div className="detail-right"><p>{item[2]}</p><p>{T('Share your shipment information through our enquiry form. Include what you know about the cargo, route and expected timing so the team can review your request.','شارك بيانات شحنتك عبر نموذج الاستفسار. أضف ما تعرفه عن البضاعة والمسار والتوقيت المتوقع ليراجع الفريق طلبك.')}</p><div className="detail-points"><span><Check size={15}/> {T('Origin and destination','نقطة الانطلاق والوجهة')}</span><span><Check size={15}/> {T('Cargo and shipment details','تفاصيل البضاعة والشحنة')}</span><span><Check size={15}/> {T('Timing and preferred mode','التوقيت ووسيلة النقل المفضلة')}</span></div><Link href="/logistics/request-quote" className="button button-navy">{T('Request a quote','اطلب عرض سعر')} <ArrowRight size={16}/></Link></div></section>}
    {rich && <ServiceContent locale={locale} data={rich} Link={Link} />}
    <section className="cross-link"><div><Eyebrow gold>{T('Keep things moving','لتبقى الأمور في حركة')}</Eyebrow><h2>{T(<>Have a shipment<br/>to discuss?</>,<>لديك شحنة<br/>للنقاش؟</>)}</h2><p>{T('Give us the details and our team can take a closer look.','أعطنا التفاصيل ويطلع عليها فريقنا عن قرب.')}</p></div><Link href="/logistics/request-quote" className="button button-gold">{T('Start a quote request','ابدأ طلب عرض السعر')} <ArrowRight size={16}/></Link></section>
  </Layout>;
}

function TravelPage({ path }: { path: string }) {
  const isLanding = path === '/travel';
  const { locale: tl } = useLocale();
  const T = <V,>(en: V, ar: V): V => tl === 'ar' ? ar : en;
  const data: readonly string[] = tl === 'ar' ? (travelOverviewAr[path] ?? travelOverviewAr['/travel']) : (travelOverview[path] ?? travelOverview['/travel']);
  const travelPhoto = path === '/travel/corporate-travel' ? photos.riyadh : photos.maldives;
  return <Layout>
    <div className="subhero subhero-travel"><div className="subhero-bg travel-page-bg" style={{ '--tbg': `url(${photoUrl(travelPhoto, 1920)})` } as React.CSSProperties}/><a className="subhero-credit" href={travelPhoto.source} target="_blank" rel="noopener noreferrer">Photo: {travelPhoto.credit}, {travelPhoto.license}</a><div className="subhero-inner"><DivisionLogo division="travel"/><nav className="crumb" aria-label={T('Breadcrumb','مسار التنقل')}><Link href="/">{T('Home','الرئيسية')}</Link><ChevronRight size={13}/><Link href="/travel">{T('Travel & tourism','السفر والسياحة')}</Link>{!isLanding && <><ChevronRight size={13}/><span aria-current="page">{data[0]}</span></>}</nav><Eyebrow gold>{T('AIRZONE TRAVEL & TOURISM','إيرزون للسفر والسياحة')}</Eyebrow><h1>{data[0]}</h1><p>{data[1]}</p><div className="subhero-actions"><Link className="button button-gold" href="/travel/enquiry">{T('Plan a journey','خطط لرحلة')} <ArrowRight size={16}/></Link><Link className="text-link light-link" href="/destinations">{T('Explore destinations','استكشف الوجهات')} <ArrowUpRight size={15}/></Link></div></div><span className="subhero-numeral">B / 02</span></div>
    <section className="split-intro"><div><Eyebrow>{isLanding ? T('Travel & tourism','السفر والسياحة') : T('Travel planning','تخطيط السفر')}</Eyebrow><h2>{isLanding ? <>{T('More than a place.','أكثر من مكان.')}<br/><i>{T('A whole experience.','تجربة متكاملة.')}</i></> : data[0]}</h2></div><div><p>{data[2]}</p><Link href="/travel/enquiry" className="under-link">{T('Tell us about your trip','أخبرنا عن رحلتك')} <ArrowRight size={15}/></Link></div></section>
    {isLanding ? <section className="travel-services"><div className="travel-service-lead"><Eyebrow>{T('What can we help plan?','ماذا يمكننا أن نخطط معك؟')}</Eyebrow><h2>{T(<>One itinerary.<br/><i>Your way of seeing.</i></>,<>برنامج واحد.<br/><i>بطريقتك في الاكتشاف.</i></>)}</h2><p>{T('Start with one part of your trip or bring the full picture. We are here to help with the planning.','ابدأ بجزء من رحلتك أو أحضر الصورة كاملة. نحن هنا للمساعدة في التخطيط.')}</p><Link href="/travel/enquiry" className="button button-navy">{T('Make a travel enquiry','أرسل استفسار سفر')} <ArrowRight size={16}/></Link></div><div className="travel-link-grid">{travelLinks.map(([name, href], i) => <Link href={href} className="travel-link-row" key={href}><span>0{i + 1}</span><b>{tl === 'ar' ? (travelLinkNamesAr[href] ?? name) : name}</b><ArrowUpRight size={16}/></Link>)}</div></section> :
      <section className="service-detail travel-detail"><div className="detail-left"><span className="detail-icon"><Compass size={23}/></span><span className="detail-label">{T('TRAVEL PLANNING','تخطيط السفر')}</span><h2>{T(<>A trip that<br/>fits <i>you.</i></>,<>رحلة<br/>تناسبك <i>أنت.</i></>)}</h2></div><div className="detail-right"><p>{data[2]}</p><p>{T('Travel needs are personal. Share the dates, places and arrangements you are considering and our team can help you understand the options.','احتياجات السفر شخصية. شارك التواريخ والأماكن والترتيبات التي تفكر بها ويساعدك فريقنا على فهم الخيارات.')}</p><div className="detail-points"><span><Check size={15}/> {T('A clear starting point','بداية واضحة')}</span><span><Check size={15}/> {T('Planning around your dates','تخطيط وفق مواعيدك')}</span><span><Check size={15}/> {T('Help bringing trip details together','مساعدة في جمع تفاصيل الرحلة')}</span></div><Link href="/travel/enquiry" className="button button-navy">{T('Make a travel enquiry','أرسل استفسار سفر')} <ArrowRight size={16}/></Link></div></section>}
    {(isLanding || path === '/travel/corporate-travel') && <TravelGuide locale={tl} corporate={path === '/travel/corporate-travel'} Link={Link} />}
    <section className="travel-note"><span><MapPin size={19}/></span><div><Eyebrow>{T('Travel, considered','سفر مدروس')}</Eyebrow><h3>{T(<>Good planning leaves room<br/>for the moments that matter.</>,<>التخطيط الجيد يترك مساحة<br/>للحظات التي تهمك.</>)}</h3></div><Link href="/destinations">{T('Browse destinations','تصفح الوجهات')} <ArrowRight size={15}/></Link></section>
  </Layout>;
}

function Destinations() {
  const { locale } = useLocale();
  const T = <V,>(en: V, ar: V): V => locale === 'ar' ? ar : en;
  return <Layout><div className="page-hero simple-hero"><div className="crumb"><Link href="/">{T('Home','الرئيسية')}</Link><ChevronRight size={13}/><span>{T('Destinations','الوجهات')}</span></div><DivisionLogo division="travel"/><Eyebrow>{T('TRAVEL & TOURISM','السفر والسياحة')}</Eyebrow><h1>{T(<>Where will<br/><i>you go next?</i></>,<>إلى أين<br/><i>ستسافر تالياً؟</i></>)}</h1><p>{T('Start with a place in mind, or tell us the kind of journey you want to take.','ابدأ بمكان في ذهنك، أو أخبرنا بنوع الرحلة التي ترغب بها.')}</p><Link href="/travel/enquiry" className="button button-navy">{T('Plan your journey','خطط لرحلتك')} <ArrowRight size={16}/></Link><div className="destination-art"><div className="globe-lines"/><Globe2 size={150}/><span>{T('THE WORLD, OPEN','العالم مفتوح')}</span></div></div><section className="destinations-copy"><Eyebrow>{T('A personal starting point','بداية شخصية')}</Eyebrow><h2>{T(<>Every itinerary begins<br/>with a conversation.</>,<>كل برنامج سفر<br/>يبدأ بحوار.</>)}</h2><p>{T('Tell us where you would like to go, when you are thinking of travelling, and what matters most. Our team can help you explore the next steps.','أخبرنا إلى أين تود الذهاب، ومتى تفكر بالسفر، وما الأهم بالنسبة لك. يساعدك فريقنا على استكشاف الخطوات التالية.')}</p><div className="destination-steps"><span><b>01</b><small>{T('Share your destination','شارك وجهتك')}</small></span><span><b>02</b><small>{T('Tell us what you need','أخبرنا بما تحتاجه')}</small></span><span><b>03</b><small>{T('Plan with our team','خطط مع فريقنا')}</small></span></div><Link href="/travel/enquiry" className="under-link">{T('Start planning','ابدأ التخطيط')} <ArrowRight size={16}/></Link></section></Layout>;
}

function About() {
  const { locale } = useLocale();
  const T = <V,>(en: V, ar: V): V => locale === 'ar' ? ar : en;
  return <Layout><div className="page-hero about-hero"><div className="crumb"><Link href="/">{T('Home','الرئيسية')}</Link><ChevronRight size={13}/><span>{T('About Airzone','عن إيرزون')}</span></div><BrandLogo className="page-brand-logo"/><Eyebrow>{T('ABOUT AIRZONE GROUP','عن مجموعة إيرزون')}</Eyebrow><h1>{T(<>One group.<br/><i>Two ways forward.</i></>,<>مجموعة واحدة.<br/><i>مساران للمضي قدماً.</i></>)}</h1><p>{T('Airzone Group brings together distinct specialist businesses with a shared commitment to dependable service.','تجمع مجموعة إيرزون أعمالاً متخصصة متمايزة يجمعها التزام مشترك بخدمة يُعتمد عليها.')}</p><div className="about-hero-art"><div className="art-lines"/><span>{T('CONNECTION IS OUR COMMON GROUND','التواصل أرضيتنا المشتركة')}</span></div></div><section className="about-story"><div className="story-label"><Eyebrow>{T('Our point of view','وجهة نظرنا')}</Eyebrow><span>01 / 03</span></div><div><h2>{T(<>Clarity is a service<br/><i>in its own right.</i></>,<>الوضوح خدمة<br/><i>قائمة بذاتها.</i></>)}</h2><p>{T('Good service starts by understanding the need. Airzone Group brings a thoughtful, attentive approach to logistics and travel planning—two different disciplines, connected by the way we work with people.','تبدأ الخدمة الجيدة بفهم الحاجة. تعتمد مجموعة إيرزون نهجاً مدروساً ومنتبهاً في الخدمات اللوجستية وتخطيط السفر، وهما تخصصان مختلفان يجمعهما أسلوبنا في التعامل مع الناس.')}</p><p>{T('We believe the experience should feel clear from the first conversation, with the right specialist focused on the details that matter to you.','نؤمن بأن التجربة ينبغي أن تكون واضحة منذ المحادثة الأولى، مع متخصص مناسب يركز على التفاصيل التي تهمك.')}</p></div></section><section className="about-businesses"><Eyebrow>{T('Our businesses','أعمالنا')}</Eyebrow><h2>{T(<>Focused teams.<br/>One shared standard.</>,<>فرق متخصصة.<br/>ومعيار مشترك واحد.</>)}</h2><div className="about-business-grid"><Link href="/logistics"><span>{T('01 / LOGISTICS','01 / الخدمات اللوجستية')}</span><Boxes size={24}/><h3>{T(<>Movement of goods,<br/><i>made clearer.</i></>,<>حركة البضائع،<br/><i>بوضوح أكبر.</i></>)}</h3><ArrowUpRight/></Link><Link href="/travel"><span>{T('02 / TRAVEL & TOURISM','02 / السفر والسياحة')}</span><Compass size={24}/><h3>{T(<>Journeys shaped<br/><i>around you.</i></>,<>رحلات تُصاغ<br/><i>حولك.</i></>)}</h3><ArrowUpRight/></Link></div></section><section className="about-end"><h2>{T(<>Let’s make the<br/>next step a clear one.</>,<>لنجعل الخطوة<br/>التالية واضحة.</>)}</h2><Link href="/contact" className="button button-gold">{T('Get in touch','تواصل معنا')} <ArrowRight size={16}/></Link></section></Layout>;
}

function Field({ label, name, type = 'text', required = false, placeholder = '', options }: {label: string; name: string; type?: string; required?: boolean; placeholder?: string; options?: string[]}) {
  return <label className="field"><span>{label}{required && <i> *</i>}</span>{options ? <select name={name} required={required} defaultValue=""><option value="" disabled>Select an option</option>{options.map(o => <option key={o}>{o}</option>)}</select> : <input name={name} type={type} required={required} placeholder={placeholder} />}</label>;
}
function FormShell({ title, intro, children, pending, success, error, onSubmit }: { title: string; intro: string; children: React.ReactNode; pending: boolean; success?: string; error?: string; onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void }) {
  const { locale } = useLocale();
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!success || !successRef.current) return;
    successRef.current.focus({ preventScroll: true });
    successRef.current.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, [success]);
  if (success) return <div className="form-success" ref={successRef} tabIndex={-1} role="status" aria-live="polite">{title.startsWith('LOGISTICS') ? <DivisionLogo division="logistics"/> : title.startsWith('TRAVEL') ? <DivisionLogo division="travel"/> : <BrandLogo className="page-brand-logo"/>}<span><Check size={23}/></span><Eyebrow>{locale === 'ar' ? 'تم استلام طلبك' : 'Request received'}</Eyebrow><h2>{locale === 'ar' ? 'شكراً لك.' : 'Thank you.'}<br/><i>{locale === 'ar' ? 'لقد استلمنا بياناتك.' : 'We have your details.'}</i></h2><p>{success}</p><Link href="/" className="under-link">{locale === 'ar' ? 'العودة إلى مجموعة إيرزون' : 'Return to Airzone Group'} <ArrowRight size={16}/></Link></div>;
  return <form className="enquiry-form" onSubmit={onSubmit}><div className="form-heading"><Eyebrow>{title}</Eyebrow><p>{intro}</p></div>{children}{error && <div className="form-error" role="alert"><CircleAlert size={16}/>{error}</div>}<button type="submit" className="button button-navy form-submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" size={16}/> {locale === 'ar' ? 'جارٍ إرسال الطلب' : 'Sending request'}</> : <>{locale === 'ar' ? 'أرسل استفسارك' : 'Send your enquiry'} <Send size={16}/></>}</button><small className="form-privacy">{locale === 'ar' ? 'تُستخدم معلوماتك للرد على هذا الاستفسار. راجع ' : 'Your information is used to respond to this enquiry. See our '}<Link href="/privacy">{locale === 'ar' ? 'إشعار الخصوصية' : 'privacy notice'}</Link>.</small></form>;
}

function LogisticsEnquiry() {
  const mutation = useCreateLogisticsEnquiry();
  const [receipt, setReceipt] = useState('');
  const [error, setError] = useState('');
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const data: LogisticsEnquiryInput = {
      fullName: String(f.get('fullName')), company: String(f.get('company') || '') || undefined,
      email: String(f.get('email')), mobile: String(f.get('mobile')), shipmentType: String(f.get('shipmentType')) as LogisticsEnquiryInput['shipmentType'],
      origin: String(f.get('origin')), destination: String(f.get('destination')), cargoType: String(f.get('cargoType') || '') || undefined,
      packages: f.get('packages') ? Number(f.get('packages')) : undefined, weight: String(f.get('weight') || '') || undefined,
      dimensions: String(f.get('dimensions') || '') || undefined, incoterm: String(f.get('incoterm') || '') || undefined,
      mode: (String(f.get('mode') || '') || undefined) as LogisticsEnquiryInput['mode'],
      service: String(f.get('service')), expectedDate: String(f.get('expectedDate') || '') || null, details: String(f.get('details') || '') || undefined
    };
    setError(''); mutation.mutate({data}, {onSuccess: r => { recordLead('logistics', r.reference, 'logistics', data.service); setReceipt(`${r.message} Reference: ${r.reference}.`); }, onError: () => setError('We could not send your request. Please try again.')});
  };
  return <EnquiryPage label="LOGISTICS ENQUIRY" title={<>Tell us about<br/><i>your shipment.</i></>} intro="Share what you know so far. Our logistics team will review the details." onSubmit={submit} pending={mutation.isPending} error={error} success={receipt}>
    <div className="form-section-title">Your details</div><div className="form-grid"><Field label="Full name" name="fullName" required/><Field label="Company" name="company"/><Field label="Work email" name="email" type="email" required/><Field label="Mobile" name="mobile" type="tel" required/></div>
    <div className="form-section-title">Shipment details</div><div className="form-grid"><Field label="Service" name="service" required options={services.map(s=>s[0])}/><Field label="Shipment type" name="shipmentType" required options={['Import','Export','Domestic','GCC','International']}/><Field label="Origin" name="origin" required placeholder="City, country"/><Field label="Destination" name="destination" required placeholder="City, country"/><Field label="Mode" name="mode" options={['Air','Sea','Road','Multimodal']}/><Field label="Expected date" name="expectedDate" type="date"/><Field label="Cargo type" name="cargoType"/><Field label="Packages" name="packages" type="number"/><Field label="Weight" name="weight" placeholder="e.g. 1,200 kg"/><Field label="Dimensions" name="dimensions"/><Field label="Incoterm" name="incoterm"/></div>
    <label className="field"><span>Additional details</span><textarea name="details" rows={4} placeholder="Anything else we should know about this shipment?"/></label>
  </EnquiryPage>;
}

function TravelEnquiry() {
  const mutation = useCreateTravelEnquiry(); const [receipt, setReceipt] = useState(''); const [error,setError] = useState('');
  const submit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const f=new FormData(e.currentTarget);
    const data: TravelEnquiryInput = {name:String(f.get('name')),mobile:String(f.get('mobile')),email:String(f.get('email')),departureCity:String(f.get('departureCity')),destination:String(f.get('destination')),departureDate:String(f.get('departureDate')||'')||null,returnDate:String(f.get('returnDate')||'')||null,adults:Number(f.get('adults')||1),children:Number(f.get('children')||0),travelType:String(f.get('travelType')),accommodationRequired:f.has('accommodationRequired'),flightRequired:f.has('flightRequired'),visaAssistanceRequired:f.has('visaAssistanceRequired'),airportTransferRequired:f.has('airportTransferRequired'),budget:String(f.get('budget')||'')||undefined,preferredPackage:String(f.get('preferredPackage')||'')||undefined,message:String(f.get('message')||'')||undefined};
    setError(''); mutation.mutate({data},{onSuccess:r=>{recordLead('travel',r.reference,'travel');setReceipt(`${r.message} Reference: ${r.reference}.`);},onError:()=>setError('We could not send your enquiry. Please try again.')}); };
  return <EnquiryPage label="TRAVEL ENQUIRY" title={<>Let's plan<br/><i>your journey.</i></>} intro="Tell us a little about your trip and what would make it right for you." onSubmit={submit} pending={mutation.isPending} error={error} success={receipt}>
    <div className="form-section-title">Your details</div><div className="form-grid"><Field label="Full name" name="name" required/><Field label="Mobile" name="mobile" type="tel" required/><Field label="Email" name="email" type="email" required/></div><div className="form-section-title">Your trip</div><div className="form-grid"><Field label="Departure city" name="departureCity" required/><Field label="Destination" name="destination" required/><Field label="Departure date" name="departureDate" type="date"/><Field label="Return date" name="returnDate" type="date"/><Field label="Travel type" name="travelType" required options={['Flights','Holiday package','International tour','Domestic tour','Hotel','Visa assistance','Umrah','Airport transfer','Other']}/><Field label="Adults" name="adults" type="number"/><Field label="Children" name="children" type="number"/><Field label="Budget" name="budget"/><Field label="Preferred package" name="preferredPackage"/></div>
    <div className="check-grid">{[['flightRequired','Flights'],['accommodationRequired','Accommodation'],['visaAssistanceRequired','Visa assistance'],['airportTransferRequired','Airport transfer']].map(([name,label])=><label key={name}><input type="checkbox" name={name}/><span>{label}</span></label>)}</div><label className="field"><span>Anything else?</span><textarea name="message" rows={4} placeholder="Share preferences, occasions or other details."/></label>
  </EnquiryPage>;
}
function EnquiryPage({label,title,intro,children,onSubmit,pending,error,success}:{label:string;title:React.ReactNode;intro:string;children:React.ReactNode;onSubmit:(e:React.FormEvent<HTMLFormElement>)=>void;pending:boolean;error:string;success:string}) {
  return <Layout><div className="form-page"><div className="form-aside">{label.startsWith('LOGISTICS') ? <DivisionLogo division="logistics"/> : label.startsWith('TRAVEL') ? <DivisionLogo division="travel"/> : null}<div className="crumb"><Link href="/">Home</Link><ChevronRight size={13}/><span>{label}</span></div><Eyebrow>{label}</Eyebrow><h1>{title}</h1><p>{intro}</p><div className="form-aside-note"><span><ShieldCheck/></span><div><b>Handled with care</b><small>We use your details only to respond to your enquiry.</small></div></div></div><FormShell title={label} intro={intro} pending={pending} error={error} success={success} onSubmit={onSubmit}>{children}</FormShell></div></Layout>;
}

function Contact() {
  const { locale } = useLocale();
  const T = <V,>(en: V, ar: V): V => locale === 'ar' ? ar : en;
  const mutation=useCreateContactEnquiry(); const [receipt,setReceipt]=useState(''); const [error,setError]=useState('');
  const submit=(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);const data:ContactEnquiryInput={name:String(f.get('name')),company:String(f.get('company')||'')||undefined,email:String(f.get('email')),phone:String(f.get('phone')||'')||undefined,department:String(f.get('department')) as ContactEnquiryInput['department'],message:String(f.get('message'))}; setError('');mutation.mutate({data},{onSuccess:r=>{recordLead('contact',r.reference,departmentDivision(data.department));setReceipt(`${r.message} ${T('Reference','المرجع')}: ${r.reference}.`);},onError:()=>setError(T('We could not send your message. Please try again.','تعذر إرسال رسالتك. يرجى المحاولة مرة أخرى.'))});};
  return <Layout><div className="contact-layout"><div className="contact-intro"><div className="crumb"><Link href="/">{T('Home','الرئيسية')}</Link><ChevronRight size={13}/><span>{T('Contact','اتصل بنا')}</span></div><BrandLogo className="page-brand-logo"/><Eyebrow>{T('CONTACT AIRZONE GROUP','تواصل مع مجموعة إيرزون')}</Eyebrow><h1>{T(<>Start with<br/><i>a conversation.</i></>,<>ابدأ<br/><i>بحوار.</i></>)}</h1><p>{T('Choose the right area and tell us how we can help. We will make sure your message reaches the right team.','اختر المجال المناسب وأخبرنا كيف يمكننا مساعدتك، وسنحرص على وصول رسالتك إلى الفريق المناسب.')}</p><div className="contact-ways"><div><span><Mail size={17}/></span><b>{T('Email us','راسلنا')}</b><small>{T('Use the form to send your message','استخدم النموذج لإرسال رسالتك')}</small></div><div><span><Phone size={17}/></span><b>{T('Call us','اتصل بنا')}</b><small>{T('Phone details are not listed here','لا تُعرض تفاصيل الهاتف هنا')}</small></div><div><span><MapPin size={17}/></span><b>{T('Saudi Arabia','المملكة العربية السعودية')}</b><small>{T('Serving needs at home and abroad','نلبي الاحتياجات داخل المملكة وخارجها')}</small></div></div></div><div className="contact-form-wrap"><FormShell title={T('Send a message','أرسل رسالة')} intro={T('Fields marked with an asterisk are required.','الحقول المعلّمة بنجمة مطلوبة.')} pending={mutation.isPending} error={error} success={receipt} onSubmit={submit}><div className="form-grid"><Field label={T('Full name','الاسم الكامل')} name="name" required/><Field label={T('Company','الشركة')} name="company"/><Field label={T('Email','البريد الإلكتروني')} name="email" type="email" required/><Field label={T('Phone','الهاتف')} name="phone" type="tel"/><Field label={T('Department','القسم')} name="department" required options={['Logistics','Customs Clearance','Travel & Tourism','Corporate Travel','General Enquiry']}/></div><label className="field"><span>{T('How can we help? *','كيف يمكننا مساعدتك؟ *')}</span><textarea name="message" rows={5} required/></label></FormShell></div></div></Layout>;
}

function Tracking() {
  const [number,setNumber]=useState('');const [submitted,setSubmitted]=useState('');
  const query=useGetShipmentTracking(submitted,{query:{enabled:!!submitted,queryKey:getGetShipmentTrackingQueryKey(submitted),retry:false}});
  const handle=(e:React.FormEvent)=>{e.preventDefault();setSubmitted(number.trim());};
  const shipment=query.data;
  return <Layout><div className="track-page"><div className="track-intro"><div className="crumb"><Link href="/">Home</Link><ChevronRight size={13}/><span>Track a shipment</span></div><Eyebrow>SHIPMENT VISIBILITY</Eyebrow><h1>Know where<br/><i>things stand.</i></h1><p>Enter your tracking number to view the latest information available for your shipment.</p><form className="track-form" onSubmit={handle}><label><Search size={18}/><input aria-label="Tracking number" data-testid="input-tracking-number" placeholder="Enter tracking number" value={number} onChange={e=>setNumber(e.target.value)} required/></label><button type="submit" className="button button-gold" disabled={query.isFetching}>{query.isFetching?'Looking up…':'Track shipment'} <ArrowRight size={16}/></button></form><small>Tracking details are shown when a matching shipment record is available.</small></div><div className="track-panel">{!submitted && <div className="track-empty"><span><PackageCheck size={30}/></span><Eyebrow>Shipment lookup</Eyebrow><h3>Your tracking details<br/>will appear here.</h3><p>Enter a tracking number to get started.</p></div>}{query.isFetching && <div className="track-empty"><div className="skeleton-line"/><div className="skeleton-line short"/><div className="skeleton-stack"><i/><i/><i/></div></div>}{query.isError && !query.isFetching && <div className="track-empty"><span className="error-icon"><CircleHelp size={25}/></span><Eyebrow>We could not find that number</Eyebrow><h3>Check the number<br/>and try again.</h3><p>If you still need help, get in touch with the logistics team.</p><Link href="/contact" className="under-link">Contact Airzone <ArrowRight size={15}/></Link></div>}{shipment && <div className="shipment-result"><div className="shipment-top"><span>TRACKING NUMBER</span><b data-testid="text-tracking-number">{shipment.trackingNumber}</b></div><div className="status-large"><span className="status-dot"/><div><small>CURRENT STATUS</small><h3>{shipment.status}</h3></div></div><div className="shipment-route"><span><small>ORIGIN</small><b>{shipment.origin}</b></span><MoveRight/><span><small>DESTINATION</small><b>{shipment.destination}</b></span></div><div className="shipment-meta"><span><small>SHIPMENT TYPE</small><b>{shipment.shipmentType}</b></span>{shipment.currentLocation&&<span><small>CURRENT LOCATION</small><b>{shipment.currentLocation}</b></span>}{shipment.estimatedDelivery&&<span><small>ESTIMATED DELIVERY</small><b>{shipment.estimatedDelivery}</b></span>}</div><div className="timeline"><h4>Shipment updates</h4>{shipment.events.map((event,i)=><div className="timeline-item" key={`${event.occurredAt}-${i}`}><span className={`timeline-dot ${i===0?'timeline-current':''}`}/><div><b>{event.status}</b>{event.location&&<span>{event.location}</span>}{event.note&&<p>{event.note}</p>}<time>{new Date(event.occurredAt).toLocaleString()}</time></div></div>)}</div></div>}</div></div><section className="track-help"><Eyebrow>Need a hand?</Eyebrow><p>For help with a shipment, contact our logistics team.</p><Link href="/contact" className="under-link">Get in touch <ArrowRight size={15}/></Link></section></Layout>;
}

function Callback() {
  const { locale } = useLocale();
  const mutation = useCreateCallbackRequest();
  const [receipt, setReceipt] = useState('');
  const [error, setError] = useState('');
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const campaign = new URLSearchParams(window.location.search);
    const data: CallbackRequestInput = {
      name: String(form.get('name')),
      mobile: String(form.get('mobile')),
      department: String(form.get('department')) as CallbackRequestInput['department'],
      preferredTime: String(form.get('preferredTime') || ''),
      message: String(form.get('message') || '') || undefined,
      urgency: String(form.get('urgency')) as CallbackRequestInput['urgency'],
      source: 'Website callback',
      landingPage: window.location.pathname,
      referrer: document.referrer || undefined,
      utmSource: campaign.get('utm_source') || undefined,
      utmMedium: campaign.get('utm_medium') || undefined,
      utmCampaign: campaign.get('utm_campaign') || undefined,
    };
    setError('');
    mutation.mutate({ data }, {
      onSuccess: result => { recordLead('callback', result.reference, departmentDivision(data.department)); setReceipt(`${result.message} ${t(locale, 'form.references')}: ${result.reference}`); },
      onError: () => setError(t(locale, 'common.tryAgain')),
    });
  };
  return <EnquiryPage label={t(locale, 'common.callback')} title={t(locale, 'common.callback')} intro={locale === 'ar' ? 'شارك رقمك والقسم المطلوب والوقت المناسب. لا يمثل الوقت المطلوب موعداً مؤكداً.' : 'Share your number, the team you need and a preferred time. A preferred time is not a confirmed appointment.'} onSubmit={submit} pending={mutation.isPending} error={error} success={receipt}>
    <div className="form-grid">
      <Field label={t(locale, 'form.name')} name="name" required/>
      <Field label={t(locale, 'form.phone')} name="mobile" type="tel" required/>
      <Field label={t(locale, 'form.department')} name="department" required options={['Logistics', 'Customs Clearance', 'Travel & Tourism', 'Corporate Travel', 'General Enquiry']}/>
      <Field label={t(locale, 'form.preferredTime')} name="preferredTime" required/>
      <Field label={t(locale, 'form.priority')} name="urgency" required options={['Normal', 'Urgent']}/>
    </div>
    <label className="field"><span>{t(locale, 'form.message')}</span><textarea name="message" rows={4}/></label>
  </EnquiryPage>;
}

function Reviews() {
  const { locale } = useLocale();
  const settings = useSiteSettings();
  const url = settings.data?.googleReviewUrl;
  return <Layout><section className="legal-page"><BrandLogo className="page-brand-logo"/><Eyebrow>{locale === 'ar' ? 'ملاحظات العملاء' : 'Customer feedback'}</Eyebrow><h1>{t(locale, 'reviews.title')}</h1><p>{t(locale, 'reviews.body')}</p>{url ? <a href={url} className="button button-navy" target="_blank" rel="noreferrer" onClick={() => trackEvent('google_review_click')}>{t(locale, 'common.review')} <Star size={16}/></a> : <p>{settings.isLoading ? (locale === 'ar' ? 'جارٍ تحميل الرابط…' : 'Loading review link…') : t(locale, 'common.reviewNotSet')}</p>}<Link href="/contact" className="under-link">{t(locale, 'common.contact')} <ArrowRight size={16}/></Link></section></Layout>;
}

function Insights() {
  const { locale } = useLocale();
  return <Layout><section className="legal-page"><BrandLogo className="page-brand-logo"/><Eyebrow>{t(locale, 'nav.insights')}</Eyebrow><h1>{t(locale, 'nav.insights')}</h1><p>{locale === 'ar' ? 'لم يتم نشر مقالات بعد.' : 'No articles have been published yet.'}</p><Link href="/contact" className="under-link">{t(locale, 'common.contact')} <ArrowRight size={16}/></Link></section></Layout>;
}

function Portal() {
  const { locale } = useLocale();
  const enquiries = useListMyEnquiries({ query: { queryKey: ['portal-enquiries'], retry: false } });
  return <Layout><section className="legal-page"><BrandLogo className="page-brand-logo"/><Eyebrow>{locale === 'ar' ? 'بوابة العملاء' : 'Client portal'}</Eyebrow><h1>{t(locale, 'portal.title')}</h1>{enquiries.isLoading ? <p>{locale === 'ar' ? 'جارٍ التحميل…' : 'Loading enquiries…'}</p> : enquiries.isError ? <><p>{locale === 'ar' ? 'يجري إعداد تسجيل الدخول الآمن للبوابة. تواصل مع فريقنا للحصول على مساعدة بشأن طلبك.' : 'Secure portal sign-in is still being configured. Contact our team for help with your enquiry.'}</p><Link href="/contact" className="under-link">{t(locale, 'common.contact')} <ArrowRight size={16}/></Link></> : enquiries.data?.length ? <div className="legal-copy">{enquiries.data.map(enquiry => <section key={enquiry.id}><FileText size={20}/><p><b>{enquiry.reference}</b><br/>{enquiry.status} · {new Date(enquiry.createdAt).toLocaleDateString(locale === 'ar' ? 'ar' : 'en')}</p></section>)}</div> : <p>{locale === 'ar' ? 'لا توجد طلبات مرتبطة ببريدك الموثق.' : 'No enquiries are linked to your verified email.'}</p>}</section></Layout>;
}

function Privacy() {
  const { locale } = useLocale();
  return <Legal title={locale === 'ar' ? 'إشعار الخصوصية' : 'Privacy notice'} label={locale === 'ar' ? 'الخصوصية' : 'PRIVACY'} paragraphs={locale === 'ar' ? [
    'تُستخدم المعلومات التي تقدمها في نماذج الشحن والسفر والتواصل ومعاودة الاتصال لفهم طلبك والرد عليه. يرجى إرسال المعلومات الضرورية للاستفسار فقط.',
    'التحليلات اختيارية. عند إعداد Google Analytics 4 لا يتم تحميله إلا بعد موافقتك. يمكنك رفض التحليلات أو تغيير اختيارك عبر زر خيارات الخصوصية أدناه.',
    'تقيس التحليلات المشاهدات والنقرات وبدء النماذج والاستفسارات المرسلة بنجاح، دون إرسال أسماء أو عناوين بريد أو أرقام هواتف أو رسائل أو مستندات أو مراجع الطلبات. لا تُرسل معلمات روابط الصفحات إلى التحليلات، ولا نتتبع صفحات الحساب والإدارة.',
    'تُحفظ تفضيلات التحليلات محلياً في متصفحك. عند السماح قد يستخدم Google Analytics ملفات تعريف ارتباط للتحليلات. يؤدي رفض التحليلات لاحقاً إلى إيقاف إرسال الأحداث ومحاولة حذف ملفات تعريف الارتباط التي أنشأها الموقع للتحليلات.',
    'تعمل الإعدادات اللازمة لتقديم الخدمة بشكل منفصل عن التحليلات. للاستفسارات المتعلقة بالخصوصية استخدم نموذج التواصل واختر استفساراً عاماً. يلزم مراجعة هذه المعلومات قبل نشر الموقع.'
  ] : [
    'Information submitted in logistics, travel, contact and callback forms is used to understand and respond to your request. Please provide only information relevant to the enquiry.',
    'Analytics is optional. When a real Google Analytics 4 property is configured, its script loads only after you allow analytics. You can reject analytics or change your choice using the privacy choices button below.',
    'Analytics measures page views, contact clicks, form starts and successfully received enquiries. It does not receive names, email addresses, telephone numbers, messages, documents or enquiry references. URL query parameters are not sent in our analytics events, and account and administration pages are excluded.',
    'Your analytics preference is stored locally in this browser. If allowed, Google Analytics may use analytics cookies. Rejecting later stops event sending and attempts to remove the first-party analytics cookies created for this site.',
    'Settings necessary to provide the requested service operate separately from optional analytics. For privacy questions, use the contact form and select General Enquiry. This notice needs business/legal review before publishing.'
  ]}><PrivacyChoicesButton locale={locale}/></Legal>;
}
function Terms() {
  const { locale } = useLocale();
  const en = ['This website provides general information about Airzone Group and its logistics and travel & tourism services. Content is provided for informational purposes and does not constitute a service offer or commitment.','Service availability, applicable requirements and arrangements depend on the specific request and circumstances. Any service engagement is subject to confirmation and applicable terms.','You agree to use this website lawfully and not to interfere with its operation or attempt to access restricted areas without authorization.','Airzone Group may update this website and these terms from time to time.'];
  const ar = ['يقدم هذا الموقع معلومات عامة عن مجموعة إيرزون وخدماتها في الخدمات اللوجستية والسفر والسياحة. المحتوى مقدم لأغراض إعلامية ولا يُعد عرضاً للخدمة أو التزاماً بها.','يعتمد توفر الخدمات والمتطلبات والترتيبات المنطبقة على الطلب المحدد وظروفه. وأي ارتباط بخدمة يخضع للتأكيد وللشروط المعمول بها.','توافق على استخدام هذا الموقع بصورة مشروعة، وعدم التدخل في تشغيله أو محاولة الوصول إلى المناطق المقيدة دون تصريح.','قد تقوم مجموعة إيرزون بتحديث هذا الموقع وهذه الشروط من حين لآخر.'];
  return locale === 'ar' ? <Legal title="شروط الاستخدام" label="الشروط" paragraphs={ar}/> : <Legal title="Terms of use" label="TERMS" paragraphs={en}/>;
}
function Legal({title,label,paragraphs,children}:{title:string;label:string;paragraphs:string[];children?:React.ReactNode}) {const {locale}=useLocale();return <Layout><section className="legal-page"><div className="crumb"><Link href="/">{locale === 'ar' ? 'الرئيسية' : 'Home'}</Link><ChevronRight size={13}/><span>{title}</span></div><Eyebrow>{label}</Eyebrow><h1>{title}</h1><p className="legal-updated">{locale === 'ar' ? 'معلومات الموقع' : 'Website information'}</p><div className="legal-copy">{paragraphs.map((p,i)=><section key={i}><span>0{i+1}</span><p>{p}</p></section>)}</div>{children}<Link href="/contact" className="under-link">{locale === 'ar' ? 'تواصل مع مجموعة إيرزون' : 'Contact Airzone Group'} <ArrowRight size={15}/></Link></section></Layout>;}

function Admin() {
  const overview=useGetAdminOverview();const [kind,setKind]=useState('');const [status,setStatus]=useState('');const [search,setSearch]=useState('');
  const params={...(kind?{kind:kind as 'logistics'|'travel'|'contact'}:{}),...(status?{status}:{}),...(search?{search}: {})};
  const enquiries=useListAdminEnquiries(params);const update=useUpdateAdminEnquiry();
  const records=enquiries.data??[];
  const changeStatus=(id:number,value:string)=>update.mutate({id,data:{status:value} as AdminEnquiryUpdate});
  return <div className="admin-page"><aside className="admin-sidebar"><Brand inverse/><div className="admin-nav-label">WORKSPACE</div><Link href="/admin" className="admin-nav active"><SlidersHorizontal size={17}/> Overview</Link><Link href="/" className="admin-nav"><ArrowUpRight size={17}/> Public website</Link><div className="admin-sidebar-bottom"><span>Airzone Group</span><small>Management workspace</small></div></aside><main className="admin-main"><div className="admin-topbar"><div><span className="admin-kicker">OPERATIONS / OVERVIEW</span><h1>Enquiry overview</h1></div><Link href="/" className="admin-view-site">View website <ArrowUpRight size={15}/></Link></div>{overview.isLoading?<div className="admin-kpis">{[1,2,3,4].map(n=><div className="kpi skeleton" key={n}/>)}</div>:overview.isError?<div className="admin-error"><CircleAlert/>Unable to load the overview. Refresh to try again.</div>:<div className="admin-kpis">{[['Logistics',overview.data?.logistics,Boxes],['Travel',overview.data?.travel,Compass],['Contact',overview.data?.contact,Mail],['Shipments',overview.data?.shipments,PackageCheck]].map(([label,value,IconRaw])=>{const Icon=IconRaw as React.ComponentType<{size?:number}>|undefined;return <div className="kpi" key={String(label)}><div><span>{label as string}</span>{Icon && <Icon size={17}/>}</div><b data-testid={`text-admin-${String(label).toLowerCase()}`}>{value as number}</b><small>Records available</small></div>})}</div>}<section className="admin-table-panel"><div className="table-heading"><div><span className="admin-kicker">INCOMING</span><h2>Enquiries</h2></div><span className="record-count">{records.length} records</span></div><div className="table-tools"><label className="admin-search"><Search size={16}/><input placeholder="Search enquiries" value={search} onChange={e=>setSearch(e.target.value)}/></label><select value={kind} onChange={e=>setKind(e.target.value)}><option value="">All enquiries</option><option value="logistics">Logistics</option><option value="travel">Travel</option><option value="contact">Contact</option></select><select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option><option>New</option><option>In progress</option><option>Closed</option></select></div>{enquiries.isLoading?<div className="table-skeleton">{[0,1,2,3].map(i=><i key={i}/>)}</div>:enquiries.isError?<div className="admin-empty"><CircleAlert/><b>Could not load enquiries</b><p>Check your access and try again.</p></div>:records.length===0?<div className="admin-empty"><FileText/><b>No enquiries found</b><p>Try another search or filter.</p></div>:<div className="table-scroll"><table><thead><tr><th>REFERENCE</th><th>ENQUIRY</th><th>CONTACT</th><th>RECEIVED</th><th>STATUS</th><th>UPDATE</th></tr></thead><tbody>{records.map(r=><tr key={r.id}><td><b className="reference">{r.reference}</b><small>{r.kind}</small></td><td><b>{r.name}</b><small>{r.company||'—'}</small></td><td><b>{r.email}</b><small>{r.phone||'—'}</small></td><td>{new Date(r.createdAt).toLocaleDateString()}</td><td><span className={`status-pill status-${r.status.toLowerCase().replaceAll(' ','-')}`}>{r.status}</span></td><td><select value={r.status} onChange={e=>changeStatus(r.id,e.target.value)} disabled={update.isPending}><option>New</option><option>In progress</option><option>Closed</option></select></td></tr>)}</tbody></table></div>}</section><div className="admin-footnote"><ShieldCheck size={15}/> Enquiry data is visible to authorized administrators.</div></main></div>;
}

function AuthScreen({signUp=false}:{signUp?:boolean}) {
  return <div className="auth-screen"><div className="auth-brand-side"><Brand inverse/><div><Eyebrow gold>AIRZONE GROUP · ADMIN</Eyebrow><h1>Clear service<br/><i>starts inside.</i></h1><p>Secure access for Airzone Group administrators.</p></div><span>SAUDI ARABIA&nbsp;&nbsp; / &nbsp;&nbsp;GROUP OPERATIONS</span></div><div className="auth-content"><Link className="auth-back" href="/"><ArrowRight className="auth-back-arrow" size={15}/> Back to Airzone Group</Link><div className="auth-card"><span className="auth-lock"><ShieldCheck size={21}/></span><Eyebrow>{signUp?'ADMIN ACCOUNT':'ADMINISTRATOR ACCESS'}</Eyebrow><h2>{signUp?'Create account':'Welcome back'}</h2><p>Continue to the secure Airzone Group workspace.</p><div className="auth-provider-note"><LogIn size={17}/><span>Sign in with your organization account</span></div><Link href="/admin" className="button button-navy auth-continue">{signUp?'Continue to sign up':'Continue to sign in'} <ArrowRight size={16}/></Link><small>Authentication is securely managed by Clerk.</small></div></div></div>;
}

function NotFound() { return <Layout><section className="not-found"><Eyebrow>404 / PAGE NOT FOUND</Eyebrow><h1>This route<br/><i>hasn't arrived.</i></h1><p>The page may have moved, or the address may be incomplete.</p><Link href="/" className="button button-navy">Back to home <ArrowRight size={16}/></Link></section></Layout>; }

function Routes() {
  const [rawLocation] = useLocation();
  const location = (rawLocation.replace(/^\/ar(?=\/|$)/, '').replace(/\/+$/, '')) || '/';
  if (location.startsWith('/sign-in')) return <AuthScreen/>;
  if (location.startsWith('/sign-up')) return <AuthScreen signUp/>;
  if (location === '/admin') return <Admin/>;
  if (location === '/track') return <Tracking/>;
  if (location === '/contact') return <Contact/>;
  if (location === '/callback') return <Callback/>;
  if (location === '/reviews') return <Reviews/>;
  if (location === '/insights') return <Insights/>;
  if (location === '/portal') return <Portal/>;
  if (location === '/destinations') return <Destinations/>;
  if (location === '/about') return <About/>;
  if (location === '/privacy') return <Privacy/>;
  if (location === '/terms') return <Terms/>;
  if (location === '/logistics/request-quote') return <LogisticsEnquiry/>;
  if (location === '/travel/enquiry') return <TravelEnquiry/>;
  if (location in logisticsOverview) return <LogisticsPage path={location}/>;
  if (location in travelOverview) return <TravelPage path={location}/>;
  if (location === '/') return <Home/>;
  return <NotFound/>;
}

function App({ ssrPath }: { ssrPath?: string } = {}) { return <QueryClientProvider client={client}><Router ssrPath={ssrPath} base={import.meta.env.BASE_URL.replace(/\/$/, '')}><LocaleProvider><Seo/><AnalyticsRuntime/><Routes/></LocaleProvider></Router></QueryClientProvider>; }

export default App;
