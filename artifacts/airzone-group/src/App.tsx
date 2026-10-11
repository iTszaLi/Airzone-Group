import { createContext, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link as WouterLink, Route, Router, Switch, useLocation } from 'wouter';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Ship, Plane, PackageCheck,
  Globe2, MapPin, ShieldCheck, Boxes, Truck, Compass, ChevronRight,
  Search, Check, CircleAlert, LoaderCircle, FileText, SlidersHorizontal,
  LogIn, Mail, Phone, CalendarDays, Send, MoveRight, Anchor,
  Landmark, CircleHelp, MessageCircle, Star, Settings2, LogOut
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
  const tracker = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  tracker?.('event', event, division ? { division } : {});
}

const services = [
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
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { locale } = useLocale();
  const copy = (key: string) => t(locale, key);
  return <header className="site-header">
    <div className="topline"><span>{locale === 'ar' ? 'مجموعة إيرزون · أعمال متخصصة' : 'AIRZONE GROUP · SPECIALIST BUSINESSES'}</span><span className="top-right"><LanguageSwitcher/><span className="top-dot" /><Link href="/contact">{copy('nav.getInTouch')} <ArrowUpRight size={12}/></Link></span></div>
    <div className="nav-wrap">
      <Brand />
      <button className="mobile-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)} data-testid="button-menu">{open ? <X/> : <Menu/>}</button>
      <nav className={`main-nav ${open ? 'nav-open' : ''}`}>
        <Link onClick={() => setOpen(false)} href="/" className="nav-link">{copy('nav.home')}</Link>
        <div className="nav-group" onMouseEnter={() => setActive('business')} onMouseLeave={() => setActive('')}>
          <button className="nav-link nav-trigger" aria-expanded={active === 'business'} onClick={() => setActive(active === 'business' ? '' : 'business')}>{copy('nav.businesses')} <ChevronRight size={14}/></button>
          <div className={`nav-dropdown ${active === 'business' ? 'dropdown-open' : ''}`}>
            <Link href="/logistics" onClick={() => setOpen(false)}><span className="drop-icon"><Boxes size={18}/></span><span><b>{locale === 'ar' ? 'الخدمات اللوجستية' : 'Logistics'}</b><small>{locale === 'ar' ? 'نُسهم في تقدّم الأعمال' : 'Move business forward'}</small></span><ArrowUpRight size={15}/></Link>
            <Link href="/travel" onClick={() => setOpen(false)}><span className="drop-icon travel-drop"><Compass size={18}/></span><span><b>{locale === 'ar' ? 'السفر والسياحة' : 'Travel & tourism'}</b><small>{locale === 'ar' ? 'نجعل كل رحلة تجربة مميزة' : 'Make every journey count'}</small></span><ArrowUpRight size={15}/></Link>
          </div>
        </div>
        <Link onClick={() => setOpen(false)} href="/destinations" className="nav-link">{copy('nav.destinations')}</Link>
        <Link onClick={() => setOpen(false)} href="/travel/corporate-travel" className="nav-link">{copy('nav.corporate')}</Link>
        <Link onClick={() => setOpen(false)} href="/insights" className="nav-link">{copy('nav.insights')}</Link>
        <Link onClick={() => setOpen(false)} href="/about" className="nav-link">{copy('nav.about')}</Link>
        <Link onClick={() => setOpen(false)} href="/contact" className="nav-link">{copy('nav.contact')}</Link>
        <Link onClick={() => setOpen(false)} href="/track" className="nav-track"><PackageCheck size={15}/> {copy('nav.track')}</Link>
        <Link onClick={() => setOpen(false)} href="/logistics/request-quote" className="nav-quote">{copy('common.quote')}</Link>
      </nav>
    </div>
  </header>;
}

function Footer() {
  const { locale } = useLocale();
  const settings = useSiteSettings().data;
  const reviewUrl = settings?.googleReviewUrl;
  const copy = (key: string) => t(locale, key);
  return <footer className="footer">
    <div className="footer-main">
      <div className="footer-brand"><Brand inverse/><p>{copy('footer.statement')}</p>{settings?.contactEmail && <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>}{settings?.contactPhone && <a href={`tel:${settings.contactPhone}`}>{settings.contactPhone}</a>}{reviewUrl && <a className="footer-review" href={reviewUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent('google_review_click')}>{copy('common.review')}</a>}</div>
      <div className="footer-col"><h4>{copy('footer.businesses')}</h4><Link href="/logistics">{locale === 'ar' ? 'الخدمات اللوجستية' : 'Logistics'}</Link><Link href="/travel">{locale === 'ar' ? 'السفر والسياحة' : 'Travel & tourism'}</Link><Link href="/travel/corporate-travel">{copy('nav.corporate')}</Link><Link href="/track">{copy('nav.track')}</Link></div>
      <div className="footer-col"><h4>{copy('footer.explore')}</h4><Link href="/about">{copy('nav.about')}</Link><Link href="/destinations">{copy('nav.destinations')}</Link><Link href="/insights">{copy('nav.insights')}</Link><Link href="/reviews">{copy('common.review')}</Link><Link href="/portal">{locale === 'ar' ? 'بوابة العملاء' : 'Client portal'}</Link><Link href="/contact">{copy('nav.contact')}</Link></div>
      <div className="footer-callout"><span className="eyebrow">{copy('footer.start')}</span><h3>{locale === 'ar' ? 'لنحدد معاً الخطوة المناسبة.' : 'Let’s find the right way forward.'}</h3><Link href="/contact" className="footer-cta">{copy('common.contact')} <ArrowRight size={15}/></Link></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Airzone Group</span><span className="legal"><Link href="/privacy">{copy('footer.privacy')}</Link><Link href="/terms">{copy('footer.terms')}</Link><Link href="/admin">Admin access</Link></span><span><LanguageSwitcher/></span></div>
  </footer>;
}

function Layout({ children }: { children: React.ReactNode }) {
  return <><Header/><main>{children}</main><Footer/><MobileConversionBar/><AnalyticsConsent/></>;
}

function Eyebrow({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return <div className={`eyebrow ${gold ? 'eyebrow-gold' : ''}`}><span/>{children}</div>;
}

function Home() {
  const { locale } = useLocale();
  const copy = (key: string) => t(locale, key);
  const settings = useSiteSettings().data;
  return <Layout>
    <section className="hero">
      <div className="hero-image" />
      <div className="hero-shade" />
      <div className="hero-grid">
        <div className="hero-copy">
          <Eyebrow gold>{copy('home.eyebrow')}</Eyebrow>
          <h1>{locale === 'ar' ? <>نحرّك الأعمال.<br/><em>ونصنع الرحلات.</em></> : <>Moving business.<br/><em>Creating journeys.</em></>}</h1>
          <p>{copy('home.intro')}</p>
          <div className="hero-actions"><Link href="/logistics" className="button button-gold">{copy('home.explore')} <ArrowRight size={17}/></Link><Link href="/contact" className="text-link light-link">{copy('home.team')} <ArrowUpRight size={15}/></Link></div>
          <div className="hero-note"><span className="note-rule"/><span>{locale === 'ar' ? <>نبدأ بفهم احتياجك،<br/>ونعمل على خطوتك التالية.</> : <>Built around what<br/>moves you forward.</>}</span></div>
        </div>
        <div className="hero-side"><div className="hero-index">01 <span>/</span> 02</div><div className="vertical-label">CONNECTED BY CARE</div></div>
      </div>
      <div className="hero-bottom"><span>01 / {locale === 'ar' ? 'مجموعة تتحرك معك' : 'A GROUP THAT MOVES WITH YOU'}</span><a href="#businesses">{copy('home.scroll')} <ArrowDown size={14}/></a><span className="hero-coordinate">{locale === 'ar' ? 'الخدمات اللوجستية · السفر والسياحة' : 'LOGISTICS · TRAVEL & TOURISM'}</span></div>
    </section>
    <section className="intro-section">
      <div className="intro-aside"><BrandLogo className="page-brand-logo"/><Eyebrow>{copy('home.introEyebrow')}</Eyebrow><span className="section-number">01 — 03</span></div>
      <div className="intro-body"><h2>{locale === 'ar' ? <>رحلات مختلفة.<br/><span>رؤية واضحة.</span></> : <>Different journeys.<br/><span>One clear point of view.</span></>}</h2><p>{copy('home.introBody')}</p><Link href="/about" className="under-link">{copy('home.approach')} <ArrowRight size={16}/></Link></div>
    </section>
    <section className="businesses-section" id="businesses">
      <div className="section-heading"><div><Eyebrow>{copy('home.businessEyebrow')}</Eyebrow><h2>{locale === 'ar' ? <>خبرات متنوعة<br/>بمعيار مشترك.</> : <>Expertise with<br/>a shared standard.</>}</h2></div><p>{copy('home.businessIntro')}</p></div>
      <div className="business-grid">
        <Link href="/logistics" className="business-card logistics-card"><div className="business-card-top"><span>01 / LOGISTICS</span><ArrowUpRight size={20}/></div><div className="business-card-image logistics-image" role="img" aria-label="Abstract route illustration for logistics"/><div className="business-card-copy"><div className="business-icon"><Boxes size={20}/></div><h3>{copy('home.logisticsTitle')}</h3><p>{copy('home.logisticsBody')}</p><span className="card-link">{copy('home.discoverLogistics')} <ArrowRight size={15}/></span></div></Link>
        <Link href="/travel" className="business-card travel-card"><div className="business-card-top"><span>02 / TRAVEL & TOURISM</span><ArrowUpRight size={20}/></div><div className="business-card-image travel-image" role="img" aria-label="Abstract destination illustration"><div className="sun-disc"/><div className="travel-arch"/></div><div className="business-card-copy"><div className="business-icon"><Compass size={20}/></div><h3>{copy('home.travelTitle')}</h3><p>{copy('home.travelBody')}</p><span className="card-link">{copy('home.discoverTravel')} <ArrowRight size={15}/></span></div></Link>
      </div>
    </section>
    <section className="manifesto">
      <div className="manifesto-side"><Eyebrow gold>{locale === 'ar' ? 'نهج مدروس للمضي قدماً' : 'A considered way forward'}</Eyebrow><span>02 — 03</span></div><div className="manifesto-copy"><h2>{locale === 'ar' ? <>وضوح في الرؤية.<br/><i>تنسيق بعناية.</i><br/>وخطوة أفضل.</> : <>Clear thinking.<br/><i>Careful coordination.</i><br/>A better next step.</>}</h2><Link href="/contact" className="button button-outline">{copy('home.team')} <ArrowRight size={16}/></Link></div>
    </section>
    <section className="pathways">
      <div className="pathways-intro"><Eyebrow>{copy('home.pathwayEyebrow')}</Eyebrow><h2>{locale === 'ar' ? <>ابدأ من<br/>احتياجك.</> : <>Start where<br/>you are.</>}</h2><p>{copy('home.pathwayBody')}</p></div>
      <Link href="/track" className="pathway-row"><span className="pathway-icon"><PackageCheck/></span><span><small>FOR SHIPMENTS</small><b>{copy('home.track')}</b><em>{copy('home.trackDesc')}</em></span><ArrowUpRight className="pathway-arrow"/></Link>
      <Link href="/logistics/request-quote" className="pathway-row"><span className="pathway-icon"><FileText/></span><span><small>FOR BUSINESSES</small><b>{copy('home.quote')}</b><em>{copy('home.quoteDesc')}</em></span><ArrowUpRight className="pathway-arrow"/></Link>
      <Link href="/travel/enquiry" className="pathway-row"><span className="pathway-icon"><CalendarDays/></span><span><small>FOR TRAVELLERS</small><b>{copy('home.plan')}</b><em>{copy('home.planDesc')}</em></span><ArrowUpRight className="pathway-arrow"/></Link>
    </section>
    <ReviewInvitation division="group"/>
    {settings?.googleReviewUrl && <section className="closing-band"><div><BrandLogo className="page-brand-logo"/><div><Eyebrow gold>{locale === 'ar' ? 'مجموعة إيرزون' : 'Airzone Group'}</Eyebrow><h2>{copy('home.closeTitle')}<br/>{copy('home.closeBody')}</h2></div></div><Link className="button button-gold" href="/contact">{copy('common.contact')} <ArrowRight size={16}/></Link></section>}
    <section className="callback-strip"><div><Eyebrow>{locale === 'ar' ? 'نحن هنا للمساعدة' : 'Need help?'}</Eyebrow><h2>{copy('home.callback')}</h2></div><Link href="/callback" className="button button-navy">{copy('common.callback')} <ArrowRight size={16}/></Link><WhatsAppLink department="logistics" className="button button-outline-dark" message="Hello Airzone Logistics, I would like assistance with a logistics or customs clearance requirement." label={locale === 'ar' ? 'تحدث إلى فريق الخدمات اللوجستية' : 'Talk to Logistics'} />
    </section>
  </Layout>;
}

const logisticsOverview = {
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

function LogisticsPage({ path }: { path: string }) {
  const item = logisticsOverview[path as keyof typeof logisticsOverview] ?? logisticsOverview['/logistics'];
  const isLanding = path === '/logistics';
  return <Layout>
    <div className="subhero subhero-logistics"><div className="subhero-bg logistics-page-bg"/><div className="subhero-inner"><DivisionLogo division="logistics"/><div className="crumb"><Link href="/">Home</Link><ChevronRight size={13}/><Link href="/logistics">Logistics</Link>{!isLanding && <><ChevronRight size={13}/><span>{item[0]}</span></>}</div><Eyebrow gold>{isLanding ? 'AIRZONE LOGISTICS' : 'LOGISTICS SERVICES'}</Eyebrow><h1>{item[0]}</h1><p>{item[1]}</p><div className="subhero-actions"><Link className="button button-gold" href="/logistics/request-quote">Request a quote <ArrowRight size={16}/></Link><Link className="text-link light-link" href="/track">Track a shipment <ArrowUpRight size={15}/></Link></div></div><span className="subhero-numeral">A / 01</span></div>
    <section className="split-intro"><div><Eyebrow>{isLanding ? 'The logistics business' : 'A clearer way to move'}</Eyebrow><h2>{isLanding ? <>Practical expertise.<br/><i>Connected thinking.</i></> : item[0]}</h2></div><div><p>{item[2]}</p><Link href="/logistics/request-quote" className="under-link">Tell us what you need <ArrowRight size={15}/></Link></div></section>
    {isLanding ? <section className="service-section"><div className="section-heading"><div><Eyebrow>Specialist services</Eyebrow><h2>Find the right<br/>kind of support.</h2></div><p>Choose a service to learn more, or tell us about your shipment.</p></div><div className="service-list">{services.map(([title, href, description, Icon], i) => <Link href={href} className="service-row" key={href} data-testid={`link-service-${i}`}><span className="service-index">0{i + 1}</span><span className="service-symbol"><Icon size={20}/></span><span className="service-copy"><b>{title}</b><small>{description}</small></span><ArrowUpRight size={18}/></Link>)}</div></section> :
      <section className="service-detail"><div className="detail-left"><span className="detail-icon"><Boxes size={23}/></span><span className="detail-label">SERVICE OVERVIEW</span><h2>Every move<br/>starts with<br/><i>the details.</i></h2></div><div className="detail-right"><p>{item[2]}</p><p>Share your shipment information through our enquiry form. Include what you know about the cargo, route and expected timing so the team can review your request.</p><div className="detail-points"><span><Check size={15}/> Origin and destination</span><span><Check size={15}/> Cargo and shipment details</span><span><Check size={15}/> Timing and preferred mode</span></div><Link href="/logistics/request-quote" className="button button-navy">Request a quote <ArrowRight size={16}/></Link></div></section>}
    <section className="cross-link"><div><Eyebrow gold>Keep things moving</Eyebrow><h2>Have a shipment<br/>to discuss?</h2><p>Give us the details and our team can take a closer look.</p></div><Link href="/logistics/request-quote" className="button button-gold">Start a quote request <ArrowRight size={16}/></Link></section>
  </Layout>;
}

function TravelPage({ path }: { path: string }) {
  const data = travelOverview[path] ?? travelOverview['/travel'];
  const isLanding = path === '/travel';
  return <Layout>
    <div className="subhero subhero-travel"><div className="subhero-bg travel-page-bg"/><div className="subhero-inner"><DivisionLogo division="travel"/><div className="crumb"><Link href="/">Home</Link><ChevronRight size={13}/><Link href="/travel">Travel & tourism</Link>{!isLanding && <><ChevronRight size={13}/><span>{data[0]}</span></>}</div><Eyebrow gold>AIRZONE TRAVEL & TOURISM</Eyebrow><h1>{data[0]}</h1><p>{data[1]}</p><div className="subhero-actions"><Link className="button button-gold" href="/travel/enquiry">Plan a journey <ArrowRight size={16}/></Link><Link className="text-link light-link" href="/destinations">Explore destinations <ArrowUpRight size={15}/></Link></div></div><span className="subhero-numeral">B / 02</span></div>
    <section className="split-intro"><div><Eyebrow>{isLanding ? 'Travel & tourism' : 'Travel planning'}</Eyebrow><h2>{isLanding ? <>More than a place.<br/><i>A whole experience.</i></> : data[0]}</h2></div><div><p>{data[2]}</p><Link href="/travel/enquiry" className="under-link">Tell us about your trip <ArrowRight size={15}/></Link></div></section>
    {isLanding ? <section className="travel-services"><div className="travel-service-lead"><Eyebrow>What can we help plan?</Eyebrow><h2>One itinerary.<br/><i>Your way of seeing.</i></h2><p>Start with one part of your trip or bring the full picture. We are here to help with the planning.</p><Link href="/travel/enquiry" className="button button-navy">Make a travel enquiry <ArrowRight size={16}/></Link></div><div className="travel-link-grid">{travelLinks.map(([name, href], i) => <Link href={href} className="travel-link-row" key={href}><span>0{i + 1}</span><b>{name}</b><ArrowUpRight size={16}/></Link>)}</div></section> :
      <section className="service-detail travel-detail"><div className="detail-left"><span className="detail-icon"><Compass size={23}/></span><span className="detail-label">TRAVEL PLANNING</span><h2>A trip that<br/>fits <i>you.</i></h2></div><div className="detail-right"><p>{data[2]}</p><p>Travel needs are personal. Share the dates, places and arrangements you are considering and our team can help you understand the options.</p><div className="detail-points"><span><Check size={15}/> A clear starting point</span><span><Check size={15}/> Planning around your dates</span><span><Check size={15}/> Help bringing trip details together</span></div><Link href="/travel/enquiry" className="button button-navy">Make a travel enquiry <ArrowRight size={16}/></Link></div></section>}
    <section className="travel-note"><span><MapPin size={19}/></span><div><Eyebrow>Travel, considered</Eyebrow><h3>Good planning leaves room<br/>for the moments that matter.</h3></div><Link href="/destinations">Browse destinations <ArrowRight size={15}/></Link></section>
  </Layout>;
}

function Destinations() {
  return <Layout><div className="page-hero simple-hero"><div className="crumb"><Link href="/">Home</Link><ChevronRight size={13}/><span>Destinations</span></div><DivisionLogo division="travel"/><Eyebrow>TRAVEL & TOURISM</Eyebrow><h1>Where will<br/><i>you go next?</i></h1><p>Start with a place in mind, or tell us the kind of journey you want to take.</p><Link href="/travel/enquiry" className="button button-navy">Plan your journey <ArrowRight size={16}/></Link><div className="destination-art"><div className="globe-lines"/><Globe2 size={150}/><span>THE WORLD, OPEN</span></div></div><section className="destinations-copy"><Eyebrow>A personal starting point</Eyebrow><h2>Every itinerary begins<br/>with a conversation.</h2><p>Tell us where you would like to go, when you are thinking of travelling, and what matters most. Our team can help you explore the next steps.</p><div className="destination-steps"><span><b>01</b><small>Share your destination</small></span><span><b>02</b><small>Tell us what you need</small></span><span><b>03</b><small>Plan with our team</small></span></div><Link href="/travel/enquiry" className="under-link">Start planning <ArrowRight size={16}/></Link></section></Layout>;
}

function About() {
  return <Layout><div className="page-hero about-hero"><div className="crumb"><Link href="/">Home</Link><ChevronRight size={13}/><span>About Airzone</span></div><BrandLogo className="page-brand-logo"/><Eyebrow>ABOUT AIRZONE GROUP</Eyebrow><h1>One group.<br/><i>Two ways forward.</i></h1><p>Airzone Group brings together distinct specialist businesses with a shared commitment to dependable service.</p><div className="about-hero-art"><div className="art-lines"/><span>CONNECTION IS OUR COMMON GROUND</span></div></div><section className="about-story"><div className="story-label"><Eyebrow>Our point of view</Eyebrow><span>01 / 03</span></div><div><h2>Clarity is a service<br/><i>in its own right.</i></h2><p>Good service starts by understanding the need. Airzone Group brings a thoughtful, attentive approach to logistics and travel planning—two different disciplines, connected by the way we work with people.</p><p>We believe the experience should feel clear from the first conversation, with the right specialist focused on the details that matter to you.</p></div></section><section className="about-businesses"><Eyebrow>Our businesses</Eyebrow><h2>Focused teams.<br/>One shared standard.</h2><div className="about-business-grid"><Link href="/logistics"><span>01 / LOGISTICS</span><Boxes size={24}/><h3>Movement of goods,<br/><i>made clearer.</i></h3><ArrowUpRight/></Link><Link href="/travel"><span>02 / TRAVEL & TOURISM</span><Compass size={24}/><h3>Journeys shaped<br/><i>around you.</i></h3><ArrowUpRight/></Link></div></section><section className="about-end"><h2>Let’s make the<br/>next step a clear one.</h2><Link href="/contact" className="button button-gold">Get in touch <ArrowRight size={16}/></Link></section></Layout>;
}

function Field({ label, name, type = 'text', required = false, placeholder = '', options }: {label: string; name: string; type?: string; required?: boolean; placeholder?: string; options?: string[]}) {
  return <label className="field"><span>{label}{required && <i> *</i>}</span>{options ? <select name={name} required={required} defaultValue=""><option value="" disabled>Select an option</option>{options.map(o => <option key={o}>{o}</option>)}</select> : <input name={name} type={type} required={required} placeholder={placeholder} />}</label>;
}
function FormShell({ title, intro, children, pending, success, error, onSubmit }: { title: string; intro: string; children: React.ReactNode; pending: boolean; success?: string; error?: string; onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void }) {
  if (success) return <div className="form-success">{title.startsWith('LOGISTICS') ? <DivisionLogo division="logistics"/> : title.startsWith('TRAVEL') ? <DivisionLogo division="travel"/> : <BrandLogo className="page-brand-logo"/>}<span><Check size={23}/></span><Eyebrow>Request received</Eyebrow><h2>Thank you.<br/><i>We have your details.</i></h2><p>{success}</p><Link href="/" className="under-link">Return to Airzone Group <ArrowRight size={16}/></Link></div>;
  return <form className="enquiry-form" onSubmit={onSubmit}><div className="form-heading"><Eyebrow>{title}</Eyebrow><p>{intro}</p></div>{children}{error && <div className="form-error"><CircleAlert size={16}/>{error}</div>}<button type="submit" className="button button-navy form-submit" disabled={pending}>{pending ? <><LoaderCircle className="spin" size={16}/> Sending request</> : <>Send your enquiry <Send size={16}/></>}</button><small className="form-privacy">Your information is used to respond to this enquiry. See our <Link href="/privacy">privacy notice</Link>.</small></form>;
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
    setError(''); mutation.mutate({data}, {onSuccess: r => setReceipt(`${r.message} Reference: ${r.reference}.`), onError: () => setError('We could not send your request. Please try again.')});
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
    setError(''); mutation.mutate({data},{onSuccess:r=>setReceipt(`${r.message} Reference: ${r.reference}.`),onError:()=>setError('We could not send your enquiry. Please try again.')}); };
  return <EnquiryPage label="TRAVEL ENQUIRY" title={<>Let's plan<br/><i>your journey.</i></>} intro="Tell us a little about your trip and what would make it right for you." onSubmit={submit} pending={mutation.isPending} error={error} success={receipt}>
    <div className="form-section-title">Your details</div><div className="form-grid"><Field label="Full name" name="name" required/><Field label="Mobile" name="mobile" type="tel" required/><Field label="Email" name="email" type="email" required/></div><div className="form-section-title">Your trip</div><div className="form-grid"><Field label="Departure city" name="departureCity" required/><Field label="Destination" name="destination" required/><Field label="Departure date" name="departureDate" type="date"/><Field label="Return date" name="returnDate" type="date"/><Field label="Travel type" name="travelType" required options={['Flights','Holiday package','International tour','Domestic tour','Hotel','Visa assistance','Umrah','Airport transfer','Other']}/><Field label="Adults" name="adults" type="number"/><Field label="Children" name="children" type="number"/><Field label="Budget" name="budget"/><Field label="Preferred package" name="preferredPackage"/></div>
    <div className="check-grid">{[['flightRequired','Flights'],['accommodationRequired','Accommodation'],['visaAssistanceRequired','Visa assistance'],['airportTransferRequired','Airport transfer']].map(([name,label])=><label key={name}><input type="checkbox" name={name}/><span>{label}</span></label>)}</div><label className="field"><span>Anything else?</span><textarea name="message" rows={4} placeholder="Share preferences, occasions or other details."/></label>
  </EnquiryPage>;
}
function EnquiryPage({label,title,intro,children,onSubmit,pending,error,success}:{label:string;title:React.ReactNode;intro:string;children:React.ReactNode;onSubmit:(e:React.FormEvent<HTMLFormElement>)=>void;pending:boolean;error:string;success:string}) {
  return <Layout><div className="form-page"><div className="form-aside">{label.startsWith('LOGISTICS') ? <DivisionLogo division="logistics"/> : label.startsWith('TRAVEL') ? <DivisionLogo division="travel"/> : null}<div className="crumb"><Link href="/">Home</Link><ChevronRight size={13}/><span>{label}</span></div><Eyebrow>{label}</Eyebrow><h1>{title}</h1><p>{intro}</p><div className="form-aside-note"><span><ShieldCheck/></span><div><b>Handled with care</b><small>We use your details only to respond to your enquiry.</small></div></div></div><FormShell title={label} intro={intro} pending={pending} error={error} success={success} onSubmit={onSubmit}>{children}</FormShell></div></Layout>;
}

function Contact() {
  const mutation=useCreateContactEnquiry(); const [receipt,setReceipt]=useState(''); const [error,setError]=useState('');
  const submit=(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);const data:ContactEnquiryInput={name:String(f.get('name')),company:String(f.get('company')||'')||undefined,email:String(f.get('email')),phone:String(f.get('phone')||'')||undefined,department:String(f.get('department')) as ContactEnquiryInput['department'],message:String(f.get('message'))}; setError('');mutation.mutate({data},{onSuccess:r=>setReceipt(`${r.message} Reference: ${r.reference}.`),onError:()=>setError('We could not send your message. Please try again.')});};
  return <Layout><div className="contact-layout"><div className="contact-intro"><div className="crumb"><Link href="/">Home</Link><ChevronRight size={13}/><span>Contact</span></div><BrandLogo className="page-brand-logo"/><Eyebrow>CONTACT AIRZONE GROUP</Eyebrow><h1>Start with<br/><i>a conversation.</i></h1><p>Choose the right area and tell us how we can help. We will make sure your message reaches the right team.</p><div className="contact-ways"><div><span><Mail size={17}/></span><b>Email us</b><small>Use the form to send your message</small></div><div><span><Phone size={17}/></span><b>Call us</b><small>Phone details are not listed here</small></div><div><span><MapPin size={17}/></span><b>Saudi Arabia</b><small>Serving needs at home and abroad</small></div></div></div><div className="contact-form-wrap"><FormShell title="Send a message" intro="Fields marked with an asterisk are required." pending={mutation.isPending} error={error} success={receipt} onSubmit={submit}><div className="form-grid"><Field label="Full name" name="name" required/><Field label="Company" name="company"/><Field label="Email" name="email" type="email" required/><Field label="Phone" name="phone" type="tel"/><Field label="Department" name="department" required options={['Logistics','Customs Clearance','Travel & Tourism','Corporate Travel','General Enquiry']}/></div><label className="field"><span>How can we help? *</span><textarea name="message" rows={5} required/></label></FormShell></div></div></Layout>;
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
      onSuccess: result => setReceipt(`${result.message} ${t(locale, 'form.references')}: ${result.reference}`),
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

function Privacy() { return <Legal title="Privacy notice" label="PRIVACY" paragraphs={['Airzone Group respects your privacy. This notice explains how information submitted through this website may be used to respond to enquiries and provide requested services.','Information you provide in a logistics, travel or contact enquiry is used to understand and respond to your request. Please provide only information relevant to your enquiry.','This website may use technical information necessary to operate and improve its functionality. We do not publish personal contact details through this page.','For privacy-related questions, please use the contact form and select General Enquiry.']}/>; }
function Terms() { return <Legal title="Terms of use" label="TERMS" paragraphs={['This website provides general information about Airzone Group and its logistics and travel & tourism services. Content is provided for informational purposes and does not constitute a service offer or commitment.','Service availability, applicable requirements and arrangements depend on the specific request and circumstances. Any service engagement is subject to confirmation and applicable terms.','You agree to use this website lawfully and not to interfere with its operation or attempt to access restricted areas without authorization.','Airzone Group may update this website and these terms from time to time.']}/>; }
function Legal({title,label,paragraphs}:{title:string;label:string;paragraphs:string[]}) {return <Layout><section className="legal-page"><div className="crumb"><Link href="/">Home</Link><ChevronRight size={13}/><span>{title}</span></div><Eyebrow>{label}</Eyebrow><h1>{title}</h1><p className="legal-updated">Website information</p><div className="legal-copy">{paragraphs.map((p,i)=><section key={i}><span>0{i+1}</span><p>{p}</p></section>)}</div><Link href="/contact" className="under-link">Contact Airzone Group <ArrowRight size={15}/></Link></section></Layout>;}

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

function App() { return <QueryClientProvider client={client}><Router base={import.meta.env.BASE_URL.replace(/\/$/, '')}><LocaleProvider><Switch><Route path="/" component={Routes}/><Route path="/:rest*" component={Routes}/><Route component={NotFound}/></Switch></LocaleProvider></Router></QueryClientProvider>; }

export default App;
