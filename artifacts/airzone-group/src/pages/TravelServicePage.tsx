import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { Layout } from '@/components/layout/Layout';
import { PageHero, SectionHead } from '@/components/ui-kit/Primitives';
import { TravelGuide } from '@/components/TravelGuide';
import type { PhotoKey } from '@/config/photography';

/** Hero photo per travel service; illustrative third-party images from the photo library. */
const servicePhoto: Record<string, PhotoKey> = {
  '/travel/flights': 'airlinerWing',
  '/travel/holiday-packages': 'familyBeach',
  '/travel/international-tours': 'santorini',
  '/travel/domestic-tours': 'jubail',
  '/travel/hotels': 'luxuryPool',
  '/travel/visa-assistance': 'airportHall',
  '/travel/umrah': 'airportTerminal',
  '/travel/corporate-travel': 'riyadh',
  '/travel/airport-transfers': 'airportTerminal',
};

export type TravelServiceCopy = { title: string; lead: string; text: string };

/** Travel & Tourism service pages (/travel/*), on the shared design system. Copy comes from App's travel overview. */
export function TravelServicePage({ path, copy, related }: { path: string; copy: TravelServiceCopy; related: { href: string; label: string }[] }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const T = (en: string, a: string) => (ar ? a : en);
  return <Layout closingCta={false}>
    <PageHero photo={servicePhoto[path] ?? 'maldivesAtolls'} eyebrow={T('Airzone Travel & Tourism', 'إيرزون للسفر والسياحة')} title={copy.title} intro={copy.lead}
      crumbs={[{ href: '/', label: T('Home', 'الرئيسية') }, { href: '/travel', label: T('Travel & tourism', 'السفر والسياحة') }, { label: copy.title }]}>
      <Link href="/travel/enquiry" className="az-btn az-btn-primary">{T('Plan a journey', 'خطط لرحلة')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
      <Link href="/destinations" className="az-btn az-btn-outline-light">{T('Explore destinations', 'استكشف الوجهات')}</Link>
    </PageHero>

    <section className="az-section" aria-labelledby="tv-svc-plan">
      <div className="az-container az-split">
        <SectionHead eyebrow={T('Travel planning', 'تخطيط السفر')} title={T('A trip that fits you.', 'رحلة تناسبك أنت.')} id="tv-svc-plan" />
        <div className="az-split-body" data-reveal>
          <p className="az-lead">{copy.text}</p>
          <p className="az-muted">{T('Travel needs are personal. Share the dates, places and arrangements you are considering and our team can help you understand the options.', 'احتياجات السفر شخصية. شارك التواريخ والأماكن والترتيبات التي تفكر بها ويساعدك فريقنا على فهم الخيارات.')}</p>
          <ul className="az-checks">
            {[T('A clear starting point', 'بداية واضحة'), T('Planning around your dates', 'تخطيط وفق مواعيدك'), T('Help bringing trip details together', 'مساعدة في جمع تفاصيل الرحلة')]
              .map(p => <li key={p}><Check size={17} aria-hidden="true" />{p}</li>)}
          </ul>
          <div className="az-inline-actions">
            <Link href="/travel/enquiry" className="az-btn az-btn-navy">{T('Make a travel enquiry', 'أرسل استفسار سفر')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
          </div>
        </div>
      </div>
    </section>

    {path === '/travel/corporate-travel' && <TravelGuide locale={locale} corporate />}

    <section className="az-section-tight az-travel-more" aria-labelledby="tv-svc-more">
      <div className="az-container">
        <h2 id="tv-svc-more">{T('Other travel services', 'خدمات سفر أخرى')}</h2>
        <ul className="az-link-tiles">
          {related.map(r => <li key={r.href}><Link href={r.href}><span>{r.label}</span><ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link></li>)}
        </ul>
      </div>
    </section>
  </Layout>;
}
