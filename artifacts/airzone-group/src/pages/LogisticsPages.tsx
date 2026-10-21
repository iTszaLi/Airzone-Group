import { ArrowRight, MapPin, Route } from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { Layout } from '@/components/layout/Layout';
import { PageHero, SectionHead, PhotoImg } from '@/components/ui-kit/Primitives';
import { ServiceContent } from '@/components/ServiceContent';
import { VehicleCarousel } from '@/components/fleet/VehicleCarousel';
import { GccNetwork } from '@/components/network/GccNetwork';
import { logisticsContent } from '@/config/logistics-content';
import { catalogByPath, gccCountries, serviceGroups } from '@/config/service-catalog';

/** Service-specific highlight block shown between the hero and the detail sections. */
function Highlight({ path }: { path: string }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const T = (en: string, a: string) => (ar ? a : en);

  if (path === '/logistics/gcc-transportation') return <section className="az-section-tight" aria-labelledby="hl-title">
    <div className="az-container az-coverage-grid">
      <div>
        <SectionHead eyebrow={T('Coverage', 'التغطية')} id="hl-title" title={T('Domestic routes and GCC cross-border freight', 'مسارات محلية وشحن عابر لحدود الخليج')} />
        <div className="az-coverage-cols">
          <div className="az-coverage-card"><h3><MapPin size={18} aria-hidden="true" />{T('Within Saudi Arabia', 'داخل المملكة')}</h3><p>{T('Road transportation between Saudi cities, including full truckloads and distribution runs.', 'نقل بري بين المدن السعودية يشمل الشاحنات الكاملة ورحلات التوزيع.')}</p></div>
          <div className="az-coverage-card is-gcc"><h3><Route size={18} aria-hidden="true" />{T('Across the GCC', 'في دول الخليج')}</h3><p>{T('Cross-border road freight, confirmed route by route and subject to border procedures and regulations.', 'شحن بري عابر للحدود يُؤكَّد لكل مسار ويخضع لإجراءات الحدود والأنظمة.')}</p>
            <ul className="az-chip-list az-chip-list-sm">{gccCountries.map(g => <li key={g.en}><span className="az-chip">{g[locale]}</span></li>)}</ul></div>
        </div>
      </div>
      <GccNetwork />
    </div>
  </section>;

  if (path === '/logistics/heavy-transport') return <section className="az-section-tight az-fleet-section" aria-labelledby="hl-title">
    <div className="az-container">
      <SectionHead eyebrow={T('Trailer types', 'أنواع المقطورات')} id="hl-title" title={T('Flatbed, curtain-side and specialised equipment', 'مقطورات مسطحة وجانبية الستائر ومعدات متخصصة')}
        text={T('Equipment is matched to the cargo and confirmed per movement. It may include partner-operated equipment.', 'تُختار المعدات وفق البضاعة وتُؤكَّد لكل رحلة، وقد تشمل معدات يشغّلها شركاء.')} />
      <VehicleCarousel only="gcc" />
      <figure className="az-wide-photo" data-img-reveal><PhotoImg photo="oversizeLoad" sizes="(min-width: 1200px) 1200px, 100vw" /><figcaption>{T('Illustrative photograph of oversized cargo transport; not an Airzone vehicle.', 'صورة توضيحية لنقل حمولة كبيرة الحجم؛ ليست مركبة تابعة لإيرزون.')}</figcaption></figure>
    </div>
  </section>;

  if (path === '/logistics/dayana-local-delivery') return <section className="az-section-tight" aria-labelledby="hl-title">
    <div className="az-container">
      <SectionHead eyebrow="Dayana" id="hl-title" title={T('Choose the right local delivery vehicle', 'اختر مركبة التوصيل المحلي المناسبة')}
        text={T('Dayana is the local delivery service of Airzone Group. Availability and service areas are confirmed when you book.', 'Dayana هي خدمة التوصيل المحلي لمجموعة إيرزون. يُؤكَّد التوفر ومناطق الخدمة عند الحجز.')} />
      <VehicleCarousel only="dayana" layout="grid" />
    </div>
  </section>;

  return null;
}

export function ServicePage({ path }: { path: string }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const T = (en: string, a: string) => (ar ? a : en);
  const data = logisticsContent[path];
  const entry = catalogByPath[path];
  const copy = data[locale];
  const slug = path.split('/').pop();
  return <Layout>
    <PageHero photo={entry?.photo ?? 'containerShip'}
      eyebrow={entry ? serviceGroups[entry.group][locale] : T('Logistics services', 'الخدمات اللوجستية')}
      title={copy.title} intro={copy.intro}
      crumbs={[{ href: '/', label: T('Home', 'الرئيسية') }, { href: '/logistics', label: T('Logistics services', 'الخدمات اللوجستية') }, { label: entry?.[locale].name ?? copy.title }]}>
      <Link href={`/logistics/request-quote?service=${slug}`} className="az-btn az-btn-primary az-btn-lg" data-hero-item="cta">{T('Request a quote', 'اطلب عرض سعر')}<ArrowRight size={17} aria-hidden="true" className="az-flip" /></Link>
      <Link href="/contact" className="az-btn az-btn-outline-light az-btn-lg" data-hero-item="cta">{T('Talk to our team', 'تحدث إلى فريقنا')}</Link>
    </PageHero>
    <Highlight path={path} />
    <ServiceContent locale={locale} data={data} />
  </Layout>;
}
