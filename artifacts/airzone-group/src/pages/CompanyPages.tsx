import { ArrowRight, ArrowUpRight, Check, Clock, FileText, Mail, MapPin, PackageSearch, Phone, PhoneCall, Route, ThermometerSnowflake, Truck, Warehouse } from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { Layout } from '@/components/layout/Layout';
import { PageHero, PhotoImg, SectionHead, SpotCard } from '@/components/ui-kit/Primitives';
import { GccNetwork } from '@/components/network/GccNetwork';
import { ContactForm } from '@/components/forms/ContactForm';
import { QuoteForm } from '@/components/forms/QuoteForm';
import { businessContacts } from '@/config/business-contacts';
import { gccCountries, serviceCatalog, warehouseCities } from '@/config/service-catalog';

export { AboutPage } from './AboutPage';

const useT = () => {
  const { locale } = useLocale();
  return { locale, ar: locale === 'ar', T: (en: string, a: string) => (locale === 'ar' ? a : en) };
};

export function LocationsPage() {
  const { locale, T } = useT();
  return <Layout>
    <PageHero photo="warehouseFloor" eyebrow={T('Service locations', 'مواقع الخدمة')}
      title={T('Saudi warehouse cities and GCC transportation coverage', 'مدن المستودعات في المملكة وتغطية النقل في الخليج')}
      intro={T('Temperature-controlled warehousing in Riyadh, Dammam, Jeddah and Jubail, connected to road transportation within Saudi Arabia and across the GCC.', 'تخزين متحكم بحرارته في الرياض والدمام وجدة والجبيل، مرتبط بالنقل البري داخل المملكة وفي دول مجلس التعاون الخليجي.')}
      crumbs={[{ href: '/', label: T('Home', 'الرئيسية') }, { label: T('Service locations', 'مواقع الخدمة') }]}>
      <Link href="/logistics/request-quote?service=warehousing" className="az-btn az-btn-primary az-btn-lg" data-hero-item="cta">{T('Ask about storage', 'استفسر عن التخزين')}<ArrowRight size={17} aria-hidden="true" className="az-flip" /></Link>
    </PageHero>

    <section className="az-section" aria-labelledby="loc-wh">
      <div className="az-container">
        <SectionHead eyebrow={T('Temperature-controlled warehousing', 'التخزين المتحكم بحرارته')} id="loc-wh"
          title={T('Warehouse locations in Saudi Arabia', 'مواقع المستودعات في المملكة العربية السعودية')}
          text={T('Each location supports temperature-controlled storage with 24/7 operations. Available temperature ranges, space and handling services vary by site and are confirmed for your requirement. Facility addresses are not published on this website.', 'يدعم كل موقع التخزين المتحكم بحرارته مع عمليات على مدار الساعة. تختلف نطاقات الحرارة والمساحة وخدمات المناولة بحسب الموقع وتُؤكَّد وفق متطلباتك. لا تُنشر عناوين المرافق على هذا الموقع.')} />
        <div className="az-location-grid" data-stagger>
          {warehouseCities.map(city => <SpotCard key={city.id} className="az-location-card">
            <header><span className="az-city-icon"><Warehouse size={22} aria-hidden="true" /></span><div><h3>{T(`Warehousing in ${city.en}`, `التخزين في ${city.ar}`)}</h3><p>{city.region[locale]}</p></div></header>
            <ul className="az-checks">
              <li><ThermometerSnowflake size={16} aria-hidden="true" />{T('Temperature-controlled storage', 'تخزين متحكم بالحرارة')}</li>
              <li><Clock size={16} aria-hidden="true" />{T('24/7 operations', 'عمليات على مدار الساعة')}</li>
              <li><Check size={16} aria-hidden="true" />{T('Inventory handling and dispatch coordination', 'مناولة المخزون وتنسيق الإرسال')}</li>
              <li><Truck size={16} aria-hidden="true" />{T('Connected to road transportation', 'مرتبط بالنقل البري')}</li>
            </ul>
          </SpotCard>)}
        </div>
      </div>
    </section>

    <section className="az-section az-coverage" aria-labelledby="loc-cov">
      <div className="az-container az-coverage-grid">
        <div>
          <SectionHead eyebrow={T('Transportation coverage', 'تغطية النقل')} id="loc-cov" title={T('Saudi Arabia and the GCC, clearly distinguished', 'المملكة ودول الخليج بتمييز واضح')} />
          <div className="az-coverage-cols">
            <div className="az-coverage-card"><h3><MapPin size={18} aria-hidden="true" />{T('Saudi Arabia', 'المملكة العربية السعودية')}</h3>
              <ul className="az-checks">
                <li><Check size={16} aria-hidden="true" />{T('Road transportation between cities', 'النقل البري بين المدن')}</li>
                <li><Check size={16} aria-hidden="true" />{T('Warehousing in four cities', 'التخزين في أربع مدن')}</li>
                <li><Check size={16} aria-hidden="true" />{T('Dayana local delivery; service areas confirmed at booking', 'التوصيل المحلي عبر Dayana مع تأكيد مناطق الخدمة عند الحجز')}</li>
              </ul></div>
            <div className="az-coverage-card is-gcc"><h3><Route size={18} aria-hidden="true" />{T('GCC cross-border', 'عبر حدود الخليج')}</h3>
              <p>{T('Road freight between Saudi Arabia and the following states, arranged route by route and subject to vehicle availability, border procedures and applicable regulations:', 'شحن بري بين المملكة والدول التالية، يُرتَّب لكل مسار ويخضع لتوفر المركبات وإجراءات الحدود والأنظمة المعمول بها:')}</p>
              <ul className="az-chip-list az-chip-list-sm">{gccCountries.filter(g => g.en !== 'Saudi Arabia').map(g => <li key={g.en}><span className="az-chip">{g[locale]}</span></li>)}</ul></div>
          </div>
          <Link href="/logistics/gcc-transportation" className="az-text-link">{T('GCC transportation services', 'خدمات النقل البري الخليجي')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
        <GccNetwork />
      </div>
    </section>

    <section className="az-section-tight" aria-labelledby="loc-services">
      <div className="az-container">
        <SectionHead eyebrow={T('Available from these locations', 'متاح من هذه المواقع')} id="loc-services" title={T('Services connected to our locations', 'خدمات مرتبطة بمواقعنا')} />
        <ul className="az-link-tiles" data-stagger>{serviceCatalog.filter(s => s.featured).map(s => { const Icon = s.icon; return <li key={s.path}><Link href={s.path}><Icon size={20} aria-hidden="true" /><span>{s[locale].name}</span><ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link></li>; })}</ul>
      </div>
    </section>
  </Layout>;
}

export function ContactPage() {
  const { T } = useT();
  const logistics = businessContacts.logistics;
  const travel = businessContacts.travel;
  return <Layout closingCta={false}>
    <PageHero compact photo="boxTruck" eyebrow={T('Contact Airzone Group', 'تواصل مع مجموعة إيرزون')}
      title={T('Talk to our logistics team', 'تحدث إلى فريق الخدمات اللوجستية')}
      intro={T('Tell us what you need to move, store or deliver. Messages are routed to the right team.', 'أخبرنا بما تحتاج إلى نقله أو تخزينه أو توصيله، وسنوجه رسالتك إلى الفريق المناسب.')}
      crumbs={[{ href: '/', label: T('Home', 'الرئيسية') }, { label: T('Contact', 'اتصل بنا') }]} />
    <section className="az-section-tight">
      <div className="az-container az-contact-grid">
        <div className="az-contact-channels">
          <div className="az-card" data-division="logistics">
            <h2>{T('Logistics enquiries', 'استفسارات الخدمات اللوجستية')}</h2>
            <ul className="az-contact-list">
              <li><Mail size={18} aria-hidden="true" /><span><b>{T('Email', 'البريد الإلكتروني')}</b>{logistics.emails.map(e => <a key={e} href={`mailto:${e}`} dir="ltr">{e}</a>)}</span></li>
              {logistics.phone && <li><Phone size={18} aria-hidden="true" /><span><b>{T('Phone', 'الهاتف')}</b><a href={logistics.phone.href} dir="ltr">{logistics.phone.label}</a></span></li>}
              <li><MapPin size={18} aria-hidden="true" /><span><b>{T('Location', 'الموقع')}</b>{T('Saudi Arabia', 'المملكة العربية السعودية')}</span></li>
            </ul>
            <div className="az-inline-actions">
              <Link href="/logistics/request-quote" className="az-btn az-btn-primary az-btn-sm"><FileText size={16} aria-hidden="true" />{T('Request a quote', 'اطلب عرض سعر')}</Link>
              <Link href="/callback" className="az-btn az-btn-outline az-btn-sm"><PhoneCall size={16} aria-hidden="true" />{T('Request a callback', 'اطلب معاودة الاتصال')}</Link>
              <Link href="/track" className="az-btn az-btn-outline az-btn-sm"><PackageSearch size={16} aria-hidden="true" />{T('Track a shipment', 'تتبع شحنة')}</Link>
            </div>
          </div>
          <div className="az-card az-card-muted" data-division="travel">
            <h2>{T('Airzone Travel & Tourism', 'إيرزون للسفر والسياحة')}</h2>
            <p className="az-muted">{T('For flights, holidays, hotels and corporate travel. This office handles travel enquiries only.', 'للطيران والعطلات والفنادق وسفر الأعمال. يختص هذا المكتب باستفسارات السفر فقط.')}</p>
            <ul className="az-contact-list">
              {travel.emails.map(e => <li key={e}><Mail size={18} aria-hidden="true" /><span><a href={`mailto:${e}`} dir="ltr">{e}</a></span></li>)}
              {travel.phone && <li><Phone size={18} aria-hidden="true" /><span><a href={travel.phone.href} dir="ltr">{travel.phone.label}</a></span></li>}
              {travel.officeAddress && <li><MapPin size={18} aria-hidden="true" /><span dir="ltr">{travel.officeAddress}</span></li>}
            </ul>
            <Link href="/travel/enquiry" className="az-text-link">{T('Plan a trip', 'خطط لرحلة')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
          </div>
        </div>
        <div className="az-card az-form-card">
          <h2>{T('Send a message', 'أرسل رسالة')}</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  </Layout>;
}

export function QuotePage() {
  const { T } = useT();
  const email = businessContacts.logistics.emails[0];
  return <Layout closingCta={false}>
    <PageHero compact photo="semiOpenRoad" eyebrow={T('Airzone Logistics · Quotation request', 'إيرزون للخدمات اللوجستية · طلب عرض سعر')}
      title={T('Request a logistics quote', 'اطلب عرض سعر لخدمات لوجستية')}
      intro={T('Share what you know so far: route, cargo, dates and any storage or delivery needs. Optional fields help us quote faster.', 'شاركنا ما تعرفه حتى الآن: المسار والبضاعة والمواعيد وأي احتياجات للتخزين أو التوصيل. تساعدنا الحقول الاختيارية على إعداد العرض أسرع.')}
      crumbs={[{ href: '/', label: T('Home', 'الرئيسية') }, { href: '/logistics', label: T('Logistics services', 'الخدمات اللوجستية') }, { label: T('Request a quote', 'اطلب عرض سعر') }]} />
    <section className="az-section-tight">
      <div className="az-container az-quote-grid">
        <div className="az-card az-form-card"><QuoteForm /></div>
        <aside className="az-quote-aside" aria-label={T('What happens next', 'ماذا يحدث بعد ذلك')}>
          <div className="az-card">
            <h2>{T('What happens next', 'ماذا يحدث بعد ذلك')}</h2>
            <ol className="az-mini-steps">
              <li><b>{T('Review', 'المراجعة')}</b>{T('Our logistics team reviews your request and may ask for missing details.', 'يراجع فريقنا طلبك وقد يطلب تفاصيل ناقصة.')}</li>
              <li><b>{T('Plan', 'التخطيط')}</b>{T('Vehicles, storage and routing are matched to your requirement.', 'تُختار المركبات والتخزين والمسار وفق متطلباتك.')}</li>
              <li><b>{T('Quotation', 'عرض السعر')}</b>{T('Scope, charges and responsibilities are confirmed in writing.', 'يُؤكَّد النطاق والرسوم والمسؤوليات كتابياً.')}</li>
            </ol>
          </div>
          <div className="az-card az-card-muted">
            <h2>{T('Prefer email?', 'تفضل البريد الإلكتروني؟')}</h2>
            <p>{T('Send your shipment details and documents directly to the logistics team.', 'أرسل تفاصيل شحنتك ومستنداتك مباشرة إلى فريق الخدمات اللوجستية.')}</p>
            <a href={`mailto:${email}`} className="az-text-link" dir="ltr"><Mail size={16} aria-hidden="true" />{email}</a>
          </div>
          <figure className="az-quote-photo"><PhotoImg photo="warehouseAisle" sizes="(min-width: 1100px) 30vw, 100vw" className="az-cover" /></figure>
        </aside>
      </div>
    </section>
  </Layout>;
}
