import { Suspense, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, useLocation } from 'wouter';
import { LazyMotion, MotionConfig } from 'motion/react';
import {
  ArrowRight, ArrowUpRight, PackageCheck, ShieldCheck, Boxes, Compass,
  Search, Check, CircleAlert, FileText, SlidersHorizontal, LogIn, Mail, Star,
} from 'lucide-react';
import { useGetAdminOverview, useListAdminEnquiries, useUpdateAdminEnquiry, useListMyEnquiries } from '@workspace/api-client-react';
import type { AdminEnquiryUpdate } from '@workspace/api-client-react';
import { t } from './lib/i18n';
import { travelOverviewAr } from './config/page-localization';
import { logisticsContentPaths, pillarPaths } from './config/route-paths';
import { lazyPage } from './site/lazy-page';
import { legacyRedirects } from './config/service-catalog';
import { Seo } from './seo/Seo';
import { AnalyticsRuntime, analyticsEvent } from './analytics/runtime';
import { PrivacyChoicesButton } from './analytics/ConsentUi';
import { LocaleProvider, Link, useLocale } from './site/locale';
import { BrandLogo } from './components/brand/BrandLogo';
import { Layout } from './components/layout/Layout';
import { PageHero, SectionHead } from './components/ui-kit/Primitives';
import { SmoothScroll } from './motion/SmoothScroll';
import { useSiteSettings } from './components/ReviewInvitation';
import { HomePage } from './pages/HomePage';

// Every page except the homepage loads on demand (route-level code splitting). See lazy-page.tsx.
const ServicePage = lazyPage(() => import('./pages/LogisticsPages').then(m => m.ServicePage));
const LogisticsHub = lazyPage(() => import('./pages/LogisticsHub').then(m => m.LogisticsHub));
const PillarRoute = lazyPage(() => import('./components/logistics/PillarRoute').then(m => m.PillarRoute));
const AboutPage = lazyPage(() => import('./pages/CompanyPages').then(m => m.AboutPage));
const ContactPage = lazyPage(() => import('./pages/CompanyPages').then(m => m.ContactPage));
const LocationsPage = lazyPage(() => import('./pages/CompanyPages').then(m => m.LocationsPage));
const QuotePage = lazyPage(() => import('./pages/CompanyPages').then(m => m.QuotePage));
const TravelLanding = lazyPage(() => import('./pages/TravelLanding').then(m => m.TravelLanding));
const TravelEnquiryPage = lazyPage(() => import('./pages/TravelLanding').then(m => m.TravelEnquiryPage));
const TrackPage = lazyPage(() => import('./pages/UtilityPages').then(m => m.TrackPage));
const CallbackPage = lazyPage(() => import('./pages/UtilityPages').then(m => m.CallbackPage));
const TravelServicePage = lazyPage(() => import('./pages/TravelServicePage').then(m => m.TravelServicePage));
const lazyPages = [ServicePage, LogisticsHub, PillarRoute, AboutPage, ContactPage, LocationsPage, QuotePage, TravelLanding, TravelEnquiryPage, TrackPage, CallbackPage, TravelServicePage];
const pillarSet = new Set<string>(pillarPaths);
const logisticsContentSet = new Set<string>(logisticsContentPaths);
import './index.css';
import './styles/airzone.css';

const loadMotionFeatures = () => import('./motion/features').then(m => m.default);

const client = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

function trackEvent(event: string, division?: string) {
  // Link interactions are tracked once by the consent-aware delegated listener.
  if (event === 'google_review_click') analyticsEvent(event, { business_division: division || 'group' });
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" className={`brand ${inverse ? 'brand-inverse' : ''}`} data-testid="link-home" aria-label="Airzone Group home">
    <BrandLogo division="group" sizes="160px" decorative />
  </Link>;
}

const travelLinks = [
  ['Flights', '/travel/flights'], ['Holiday packages', '/travel/holiday-packages'],
  ['International tours', '/travel/international-tours'], ['Domestic tours', '/travel/domestic-tours'],
  ['Hotels', '/travel/hotels'], ['Visa assistance', '/travel/visa-assistance'],
  ['Umrah', '/travel/umrah'], ['Airport transfers', '/travel/airport-transfers'],
] as const;


function Eyebrow({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return <div className={`eyebrow ${gold ? 'eyebrow-gold' : ''}`}><span/>{children}</div>;
}

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

const travelLinkNamesAr: Record<string, string> = {
  '/travel/flights': 'الطيران', '/travel/holiday-packages': 'باقات العطلات', '/travel/international-tours': 'الجولات الدولية',
  '/travel/domestic-tours': 'الجولات الداخلية', '/travel/hotels': 'الفنادق', '/travel/visa-assistance': 'مساعدة التأشيرات',
  '/travel/umrah': 'العمرة', '/travel/airport-transfers': 'خدمات المطار',
};

/** Travel & Tourism service pages: copy from travelOverview / travelOverviewAr, layout in TravelServicePage. */
function TravelService({ path }: { path: string }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const d = ar ? (travelOverviewAr[path] ?? travelOverview[path]) : travelOverview[path];
  const related = Object.keys(travelOverview).filter(p => p !== '/travel' && p !== path).map(p => ({
    href: p, label: ar ? (travelLinkNamesAr[p] ?? travelOverviewAr[p]?.[0] ?? travelOverview[p][0]) : travelOverview[p][0],
  }));
  return <TravelServicePage path={path} copy={{ title: d[0], lead: d[1], text: d[2] }} related={related} />;
}

function Destinations() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const T = (en: string, a: string) => (ar ? a : en);
  const steps = [T('Share your destination', 'شارك وجهتك'), T('Tell us what you need', 'أخبرنا بما تحتاجه'), T('Plan with our team', 'خطط مع فريقنا')];
  return <Layout closingCta={false}>
    <PageHero photo="maldivesVillas" eyebrow={T('Airzone Travel & Tourism', 'إيرزون للسفر والسياحة')} title={T('Where will you go next?', 'إلى أين ستسافر تالياً؟')}
      intro={T('Start with a place in mind, or tell us the kind of journey you want to take.', 'ابدأ بمكان في ذهنك، أو أخبرنا بنوع الرحلة التي ترغب بها.')}
      crumbs={[{ href: '/', label: T('Home', 'الرئيسية') }, { href: '/travel', label: T('Travel & tourism', 'السفر والسياحة') }, { label: T('Destinations', 'الوجهات') }]}>
      <Link href="/travel/enquiry" className="az-btn az-btn-primary">{T('Plan your journey', 'خطط لرحلتك')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
      <Link href="/travel" className="az-btn az-btn-outline-light">{T('Travel services', 'خدمات السفر')}</Link>
    </PageHero>
    <section className="az-section" aria-labelledby="dest-start">
      <div className="az-container az-split">
        <SectionHead eyebrow={T('A personal starting point', 'بداية شخصية')} title={T('Every itinerary begins with a conversation.', 'كل برنامج سفر يبدأ بحوار.')} id="dest-start" />
        <div className="az-split-body" data-reveal>
          <p className="az-lead">{T('Tell us where you would like to go, when you are thinking of travelling, and what matters most. Our team can help you explore the next steps.', 'أخبرنا إلى أين تود الذهاب، ومتى تفكر بالسفر، وما الأهم بالنسبة لك. يساعدك فريقنا على استكشاف الخطوات التالية.')}</p>
          <ol className="az-step-list">{steps.map((s, i) => <li key={s}><b aria-hidden="true">{i + 1}</b><span>{s}</span></li>)}</ol>
          <Link href="/travel/enquiry" className="az-text-link">{T('Start planning', 'ابدأ التخطيط')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </section>
  </Layout>;
}

function Reviews() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const settings = useSiteSettings();
  const url = settings.data?.googleReviewUrl;
  return <Layout closingCta={false}>
    <PageHero compact eyebrow={ar ? 'ملاحظات العملاء' : 'Customer feedback'} title={t(locale, 'reviews.title')} intro={t(locale, 'reviews.body')}
      crumbs={[{ href: '/', label: ar ? 'الرئيسية' : 'Home' }, { label: t(locale, 'reviews.title') }]} />
    <section className="az-section-tight"><div className="az-container az-prose">
      {url
        ? <a href={url} className="az-btn az-btn-navy" target="_blank" rel="noreferrer" onClick={() => trackEvent('google_review_click')}>{t(locale, 'common.review')}<Star size={16} aria-hidden="true" /><span className="sr-only">{ar ? ' (يفتح في نافذة جديدة)' : ' (opens in a new tab)'}</span></a>
        : <p className="az-muted">{settings.isLoading ? (ar ? 'جارٍ تحميل الرابط…' : 'Loading review link…') : t(locale, 'common.reviewNotSet')}</p>}
      <div className="az-inline-actions"><Link href="/contact" className="az-text-link">{t(locale, 'common.contact')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link></div>
    </div></section>
  </Layout>;
}

function Insights() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  return <Layout closingCta={false}>
    <PageHero compact eyebrow={ar ? 'مجموعة إيرزون' : 'Airzone Group'} title={t(locale, 'nav.insights')} intro={ar ? 'لم يتم نشر مقالات بعد.' : 'No articles have been published yet.'}
      crumbs={[{ href: '/', label: ar ? 'الرئيسية' : 'Home' }, { label: t(locale, 'nav.insights') }]}>
      <Link href="/logistics" className="az-btn az-btn-primary">{ar ? 'الخدمات اللوجستية' : 'Logistics services'}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
      <Link href="/contact" className="az-btn az-btn-outline-light">{t(locale, 'common.contact')}</Link>
    </PageHero>
  </Layout>;
}

function Portal() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const enquiries = useListMyEnquiries({ query: { queryKey: ['portal-enquiries'], retry: false } });
  return <Layout closingCta={false}>
    <PageHero compact eyebrow={ar ? 'بوابة العملاء' : 'Client portal'} title={t(locale, 'portal.title')} intro={t(locale, 'portal.signIn')}
      crumbs={[{ href: '/', label: ar ? 'الرئيسية' : 'Home' }, { label: ar ? 'بوابة العملاء' : 'Client portal' }]} />
    <section className="az-section-tight"><div className="az-container az-prose" aria-live="polite">
      {enquiries.isLoading
        ? <p className="az-muted">{ar ? 'جارٍ التحميل…' : 'Loading enquiries…'}</p>
        : enquiries.isError
          ? <><p>{ar ? 'يجري إعداد تسجيل الدخول الآمن للبوابة. تواصل مع فريقنا للحصول على مساعدة بشأن طلبك.' : 'Secure portal sign-in is still being configured. Contact our team for help with your enquiry.'}</p>
              <Link href="/contact" className="az-text-link">{t(locale, 'common.contact')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link></>
          : enquiries.data?.length
            ? <ul className="az-prose-list">{enquiries.data.map(enquiry => <li key={enquiry.id}><FileText size={20} aria-hidden="true" /><span><b dir="ltr">{enquiry.reference}</b><br />{enquiry.status} · {new Date(enquiry.createdAt).toLocaleDateString(ar ? 'ar' : 'en')}</span></li>)}</ul>
            : <p>{ar ? 'لا توجد طلبات مرتبطة ببريدك الموثق.' : 'No enquiries are linked to your verified email.'}</p>}
    </div></section>
  </Layout>;
}

function Privacy() {
  const { locale } = useLocale();
  return <Legal title={locale === 'ar' ? 'إشعار الخصوصية' : 'Privacy notice'} label={locale === 'ar' ? 'الخصوصية' : 'Privacy'} paragraphs={locale === 'ar' ? [
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
  return locale === 'ar' ? <Legal title="شروط الاستخدام" label="الشروط" paragraphs={ar}/> : <Legal title="Terms of use" label="Terms" paragraphs={en}/>;
}
function Legal({ title, label, paragraphs, children }: { title: string; label: string; paragraphs: string[]; children?: React.ReactNode }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  return <Layout closingCta={false}>
    <PageHero compact eyebrow={label} title={title} intro={ar ? 'معلومات الموقع' : 'Website information'}
      crumbs={[{ href: '/', label: ar ? 'الرئيسية' : 'Home' }, { label: title }]} />
    <section className="az-section-tight"><div className="az-container az-prose">
      {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      {children}
      <div className="az-inline-actions"><Link href="/contact" className="az-text-link">{ar ? 'تواصل مع مجموعة إيرزون' : 'Contact Airzone Group'}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link></div>
    </div></section>
  </Layout>;
}

function Admin() {
  const overview=useGetAdminOverview();const [kind,setKind]=useState('');const [status,setStatus]=useState('');const [search,setSearch]=useState('');
  const params={...(kind?{kind:kind as 'logistics'|'travel'|'contact'}:{}),...(status?{status}:{}),...(search?{search}: {})};
  const enquiries=useListAdminEnquiries(params);const update=useUpdateAdminEnquiry();
  const records=enquiries.data??[];
  const changeStatus=(id:number,value:string)=>update.mutate({id,data:{status:value} as AdminEnquiryUpdate});
  return <div className="admin-page"><aside className="admin-sidebar"><Brand inverse/><div className="admin-nav-label">WORKSPACE</div><Link href="/admin" className="admin-nav active"><SlidersHorizontal size={17}/> Overview</Link><Link href="/" className="admin-nav"><ArrowUpRight size={17} className="az-flip"/> Public website</Link><div className="admin-sidebar-bottom"><span>Airzone Group</span><small>Management workspace</small></div></aside><main className="admin-main"><div className="admin-topbar"><div><span className="admin-kicker">OPERATIONS / OVERVIEW</span><h1>Enquiry overview</h1></div><Link href="/" className="admin-view-site">View website <ArrowUpRight size={15} className="az-flip"/></Link></div>{overview.isLoading?<div className="admin-kpis">{[1,2,3,4].map(n=><div className="kpi skeleton" key={n}/>)}</div>:overview.isError?<div className="admin-error"><CircleAlert/>Unable to load the overview. Refresh to try again.</div>:<div className="admin-kpis">{[['Logistics',overview.data?.logistics,Boxes],['Travel',overview.data?.travel,Compass],['Contact',overview.data?.contact,Mail],['Shipments',overview.data?.shipments,PackageCheck]].map(([label,value,IconRaw])=>{const Icon=IconRaw as React.ComponentType<{size?:number}>|undefined;return <div className="kpi" key={String(label)}><div><span>{label as string}</span>{Icon && <Icon size={17}/>}</div><b data-testid={`text-admin-${String(label).toLowerCase()}`}>{value as number}</b><small>Records available</small></div>})}</div>}<section className="admin-table-panel"><div className="table-heading"><div><span className="admin-kicker">INCOMING</span><h2>Enquiries</h2></div><span className="record-count">{records.length} records</span></div><div className="table-tools"><label className="admin-search"><Search size={16}/><input placeholder="Search enquiries" value={search} onChange={e=>setSearch(e.target.value)}/></label><select value={kind} onChange={e=>setKind(e.target.value)}><option value="">All enquiries</option><option value="logistics">Logistics</option><option value="travel">Travel</option><option value="contact">Contact</option></select><select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option><option>New</option><option>In progress</option><option>Closed</option></select></div>{enquiries.isLoading?<div className="table-skeleton">{[0,1,2,3].map(i=><i key={i}/>)}</div>:enquiries.isError?<div className="admin-empty"><CircleAlert/><b>Could not load enquiries</b><p>Check your access and try again.</p></div>:records.length===0?<div className="admin-empty"><FileText/><b>No enquiries found</b><p>Try another search or filter.</p></div>:<div className="table-scroll"><table><thead><tr><th>REFERENCE</th><th>ENQUIRY</th><th>CONTACT</th><th>RECEIVED</th><th>STATUS</th><th>UPDATE</th></tr></thead><tbody>{records.map(r=><tr key={r.id}><td><b className="reference">{r.reference}</b><small>{r.kind}</small></td><td><b>{r.name}</b><small>{r.company||'—'}</small></td><td><b>{r.email}</b><small>{r.phone||'—'}</small></td><td>{new Date(r.createdAt).toLocaleDateString()}</td><td><span className={`status-pill status-${r.status.toLowerCase().replaceAll(' ','-')}`}>{r.status}</span></td><td><select value={r.status} onChange={e=>changeStatus(r.id,e.target.value)} disabled={update.isPending}><option>New</option><option>In progress</option><option>Closed</option></select></td></tr>)}</tbody></table></div>}</section><div className="admin-footnote"><ShieldCheck size={15}/> Enquiry data is visible to authorized administrators.</div></main></div>;
}

function AuthScreen({signUp=false}:{signUp?:boolean}) {
  return <div className="auth-screen"><div className="auth-brand-side"><Brand inverse/><div><Eyebrow gold>AIRZONE GROUP · ADMIN</Eyebrow><h1>Clear service<br/><i>starts inside.</i></h1><p>Secure access for Airzone Group administrators.</p></div><span>SAUDI ARABIA&nbsp;&nbsp; / &nbsp;&nbsp;GROUP OPERATIONS</span></div><div className="auth-content"><Link className="auth-back" href="/"><ArrowRight className="auth-back-arrow" size={15}/> Back to Airzone Group</Link><div className="auth-card"><span className="auth-lock"><ShieldCheck size={21}/></span><Eyebrow>{signUp?'ADMIN ACCOUNT':'ADMINISTRATOR ACCESS'}</Eyebrow><h2>{signUp?'Create account':'Welcome back'}</h2><p>Continue to the secure Airzone Group workspace.</p><div className="auth-provider-note"><LogIn size={17}/><span>Sign in with your organization account</span></div><Link href="/admin" className="button button-navy auth-continue">{signUp?'Continue to sign up':'Continue to sign in'} <ArrowRight size={16} className="az-flip"/></Link><small>Authentication is securely managed by Clerk.</small></div></div></div>;
}

function NotFound() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  return <Layout closingCta={false}>
    <PageHero compact eyebrow={ar ? 'الصفحة غير موجودة' : 'Page not found'} title={ar ? 'لم نعثر على هذه الصفحة.' : 'We could not find that page.'}
      intro={ar ? 'ربما نُقلت الصفحة أو أن العنوان غير مكتمل.' : 'The page may have moved, or the address may be incomplete.'}
      crumbs={[{ href: '/', label: ar ? 'الرئيسية' : 'Home' }, { label: '404' }]}>
      <Link href="/" className="az-btn az-btn-primary">{ar ? 'العودة إلى الرئيسية' : 'Back to home'}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
      <Link href="/logistics" className="az-btn az-btn-outline-light">{ar ? 'الخدمات اللوجستية' : 'Logistics services'}</Link>
      <Link href="/contact" className="az-btn az-btn-outline-light">{ar ? 'اتصل بنا' : 'Contact'}</Link>
    </PageHero>
  </Layout>;
}

/** Client-side fallback for consolidated legacy URLs (the server answers with 301s). */
function LegacyRedirect({ to }: { to: string }) {
  const { locale } = useLocale();
  const [, navigate] = useLocation();
  useEffect(() => { navigate(locale === 'ar' ? `/ar${to}` : to, { replace: true }); }, [to, locale, navigate]);
  return null;
}

const barePath = (raw: string) => (raw.split(/[?#]/)[0].replace(/^\/ar(?=\/|$)/, '').replace(/\/+$/, '')) || '/';

/** The on-demand page a path needs, if any (used before hydration and for link prefetching). */
function lazyPageFor(location: string) {
  switch (location) {
    case '/track': return TrackPage;
    case '/contact': return ContactPage;
    case '/callback': return CallbackPage;
    case '/about': return AboutPage;
    case '/locations': return LocationsPage;
    case '/logistics': return LogisticsHub;
    case '/logistics/request-quote': return QuotePage;
    case '/travel': return TravelLanding;
    case '/travel/enquiry': return TravelEnquiryPage;
  }
  if (pillarSet.has(location)) return PillarRoute;
  if (logisticsContentSet.has(location)) return ServicePage;
  if (location in travelOverview) return TravelServicePage;
  return null;
}
export const preloadRoute = (raw: string) => lazyPageFor(barePath(raw))?.preload() ?? Promise.resolve();
export const preloadAll = () => Promise.all(lazyPages.map(p => p.preload()));

/** Start loading a page's code as soon as the visitor shows intent (hover, focus, touch). */
function RoutePrefetch() {
  useEffect(() => {
    const seen = new Set<string>();
    const onIntent = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="/"]');
      const href = a?.getAttribute('href');
      if (!href || seen.has(href)) return;
      seen.add(href);
      void preloadRoute(href);
    };
    document.addEventListener('pointerover', onIntent, { passive: true });
    document.addEventListener('focusin', onIntent);
    document.addEventListener('touchstart', onIntent, { passive: true });
    return () => { document.removeEventListener('pointerover', onIntent); document.removeEventListener('focusin', onIntent); document.removeEventListener('touchstart', onIntent); };
  }, []);
  return null;
}

/** Shown only while a not-yet-loaded page's code arrives: the site shell stays in place. */
function RouteFallback() {
  return <Layout closingCta={false}><div className="az-route-wait" aria-busy="true" /></Layout>;
}

function Routes() {
  const [rawLocation] = useLocation();
  const location = barePath(rawLocation);
  if (location.startsWith('/sign-in')) return <AuthScreen/>;
  if (location.startsWith('/sign-up')) return <AuthScreen signUp/>;
  if (location === '/admin') return <Admin/>;
  if (location === '/track') return <TrackPage/>;
  if (location === '/contact') return <ContactPage/>;
  if (location === '/callback') return <CallbackPage/>;
  if (location === '/reviews') return <Reviews/>;
  if (location === '/insights') return <Insights/>;
  if (location === '/portal') return <Portal/>;
  if (location === '/destinations') return <Destinations/>;
  if (location === '/about') return <AboutPage/>;
  if (location === '/locations') return <LocationsPage/>;
  if (location === '/privacy') return <Privacy/>;
  if (location === '/terms') return <Terms/>;
  if (location === '/logistics') return <LogisticsHub/>;
  if (location === '/logistics/request-quote') return <QuotePage/>;
  if (location === '/travel') return <TravelLanding/>;
  if (location === '/travel/enquiry') return <TravelEnquiryPage/>;
  if (location in legacyRedirects) return <LegacyRedirect to={legacyRedirects[location]}/>;
  if (pillarSet.has(location)) return <PillarRoute path={location}/>;
  if (logisticsContentSet.has(location)) return <ServicePage path={location}/>;
  if (location in travelOverview) return <TravelService path={location}/>;
  if (location === '/') return <HomePage/>;
  return <NotFound/>;
}

function App({ ssrPath }: { ssrPath?: string } = {}) {
  return <QueryClientProvider client={client}>
    <Router ssrPath={ssrPath} base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <LocaleProvider><Seo/><AnalyticsRuntime/><SmoothScroll/><RoutePrefetch/><Suspense fallback={<RouteFallback/>}><Routes/></Suspense></LocaleProvider>
        </MotionConfig>
      </LazyMotion>
    </Router>
  </QueryClientProvider>;
}

export default App;
