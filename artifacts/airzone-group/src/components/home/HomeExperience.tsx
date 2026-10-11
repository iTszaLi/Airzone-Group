import { useRef, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { AviationStory } from './AviationStory';
import { useMotion } from '@/motion/use-motion';
import { photos, photoSrcSet, photoUrl, type Photo } from '@/config/photography';
import { leadership } from '@/config/leadership';
import type { Locale } from '@/lib/i18n';

type LinkLike = (props: { href: string; className?: string; children?: ReactNode }) => ReactNode;
type LogoLike = (props: { division?: 'group' | 'logistics' | 'travel'; className?: string }) => ReactNode;

function PhotoImg({ photo, sizes, eager = false, className = '', parallax = false, heroBg = false }: { photo: Photo; sizes: string; eager?: boolean; className?: string; parallax?: boolean; heroBg?: boolean }) {
  return <img
    className={className} data-parallax={parallax ? '' : undefined} data-hero-bg={heroBg ? '' : undefined}
    src={photoUrl(photo, 1400)} srcSet={photoSrcSet(photo)} sizes={sizes}
    width={photo.width} height={photo.height} alt={photo.alt}
    loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'} />;
}

const EN = {
  eyebrow: 'AIRZONE GROUP · LOGISTICS & TRAVEL',
  intro: 'Two specialist businesses. One commitment to moving your world forward — through practical logistics support and thoughtfully planned travel.',
  explore: 'Explore our businesses', team: 'Talk to our team',
  insetLabel: 'Travel & Tourism',
  introKicker: '01 / The Group', introTitle: ['One group, built around', 'two specialist businesses.'],
  introBody: 'Airzone Group brings together Logistics and Travel & Tourism under one standard of service: listen first, coordinate carefully and keep every conversation clear.',
  showKicker: '02 / Our businesses',
  logistics: { title: 'Moving business forward.', body: 'Logistics and customs support for cargo movements, documentation, transportation and shipment coordination.', cta: 'DISCOVER LOGISTICS' },
  travel: { title: 'Journeys, made personal.', body: 'Travel assistance for holidays, flights, accommodation, group travel and business journeys.', cta: 'DISCOVER TRAVEL' },
  howKicker: '03 / How we work', howTitle: ['Practical coordination.', 'Dependable service.'],
  steps: [
    ['Understand', 'We begin with what you are moving or where you are going, and the constraints around it.'],
    ['Coordinate', 'The right specialist team organises the details, documents and arrangements.'],
    ['Stay in touch', 'You have a clear point of contact and a clear next step at each stage.'],
  ],
  logCapKicker: 'Logistics and customs', logCapTitle: ['Cargo, paperwork', 'and the path between.'],
  logCapBody: 'From customs clearance to freight by air, sea or road, Airzone Logistics supports the full movement of your goods.',
  logCap: [['Customs clearance', '/logistics/customs-clearance'], ['Freight forwarding', '/logistics/freight-forwarding'], ['Air freight', '/logistics/air-freight'], ['Sea freight', '/logistics/sea-freight'], ['Road transportation', '/logistics/road-transportation'], ['Warehousing', '/logistics/warehousing'], ['Project cargo', '/logistics/project-cargo']],
  trvCapKicker: 'Travel and corporate travel', trvCapTitle: ['Personal journeys.', 'Business travel.'],
  trvCapBody: 'Airzone Travel & Tourism helps individuals, families and companies plan trips with attention to the details that matter.',
  trvCap: [['Flights', '/travel/flights'], ['Holiday packages', '/travel/holiday-packages'], ['Hotels', '/travel/hotels'], ['Visa assistance', '/travel/visa-assistance'], ['Umrah', '/travel/umrah'], ['Airport transfers', '/travel/airport-transfers'], ['Corporate travel', '/travel/corporate-travel']],
  trustKicker: '04 / Service quality', trustTitle: ['The standard', 'we hold ourselves to.'],
  trust: [
    ['Clear communication', 'Plain answers and a named point of contact, so you always know where things stand.'],
    ['Careful detail', 'Documents, dates and requirements checked before they become problems.'],
    ['Specialist focus', 'Logistics and travel handled by teams that work in those fields every day.'],
    ['Respect for your time', 'Direct routes to the right team without being passed around.'],
  ],
  shortKicker: 'Start where you are', shortTitle: ['Four quick', 'ways in.'],
  shortcuts: [['Track a shipment', 'Enter your tracking number for the latest status.', '/track'], ['Request a quote', 'Share your cargo and route with the logistics team.', '/logistics/request-quote'], ['Plan a trip', 'Tell us where you want to go and when.', '/travel/enquiry'], ['Request a callback', 'Leave your number and the right team will call.', '/callback']],
};
const AR: typeof EN = {
  eyebrow: 'مجموعة إيرزون · الخدمات اللوجستية والسفر',
  intro: 'نشاطان متخصصان، والتزام واحد بالمضي بعالمك إلى الأمام — عبر دعم لوجستي عملي وتجارب سفر مخطط لها بعناية.',
  explore: 'استكشف أعمالنا', team: 'تحدث إلى فريقنا',
  insetLabel: 'السفر والسياحة',
  introKicker: '01 / المجموعة', introTitle: ['مجموعة واحدة', 'حول نشاطين متخصصين.'],
  introBody: 'تجمع مجموعة إيرزون بين الخدمات اللوجستية والسفر والسياحة بمعيار خدمة واحد: نصغي أولاً، وننسق بعناية، ونبقي كل حوار واضحاً.',
  showKicker: '02 / أعمالنا',
  logistics: { title: 'نحرّك الأعمال إلى الأمام.', body: 'دعم لوجستي وجمركي لحركة البضائع والمستندات والنقل وتنسيق الشحنات.', cta: 'اكتشف الخدمات اللوجستية' },
  travel: { title: 'رحلات بطابع شخصي.', body: 'مساعدة في السفر للعطلات والطيران والإقامة والسفر الجماعي ورحلات الأعمال.', cta: 'اكتشف السفر' },
  howKicker: '03 / كيف نعمل', howTitle: ['تنسيق عملي.', 'خدمة يُعتمد عليها.'],
  steps: [
    ['نفهم', 'نبدأ بما تنقله أو وجهتك، وبالظروف المحيطة بذلك.'],
    ['ننسّق', 'يتولى الفريق المتخصص المناسب ترتيب التفاصيل والمستندات.'],
    ['نبقى على تواصل', 'لديك جهة اتصال واضحة وخطوة تالية واضحة في كل مرحلة.'],
  ],
  logCapKicker: 'الخدمات اللوجستية والجمارك', logCapTitle: ['البضائع والمستندات', 'والطريق بينهما.'],
  logCapBody: 'من التخليص الجمركي إلى الشحن جواً وبحراً وبراً، تدعم إيرزون للخدمات اللوجستية رحلة بضائعك كاملة.',
  logCap: [['التخليص الجمركي', '/logistics/customs-clearance'], ['الشحن والتوريد', '/logistics/freight-forwarding'], ['الشحن الجوي', '/logistics/air-freight'], ['الشحن البحري', '/logistics/sea-freight'], ['النقل البري', '/logistics/road-transportation'], ['التخزين', '/logistics/warehousing'], ['شحنات المشاريع', '/logistics/project-cargo']],
  trvCapKicker: 'السفر وسفر الأعمال', trvCapTitle: ['رحلات شخصية.', 'سفر أعمال.'],
  trvCapBody: 'تساعد إيرزون للسفر والسياحة الأفراد والعائلات والشركات على تخطيط رحلاتهم بعناية بالتفاصيل المهمة.',
  trvCap: [['الطيران', '/travel/flights'], ['باقات العطلات', '/travel/holiday-packages'], ['الفنادق', '/travel/hotels'], ['مساعدة التأشيرات', '/travel/visa-assistance'], ['العمرة', '/travel/umrah'], ['خدمات المطار', '/travel/airport-transfers'], ['سفر الأعمال', '/travel/corporate-travel']],
  trustKicker: '04 / جودة الخدمة', trustTitle: ['المعيار الذي', 'نلتزم به.'],
  trust: [
    ['تواصل واضح', 'إجابات مباشرة وجهة اتصال محددة، لتعرف دائماً أين وصل طلبك.'],
    ['عناية بالتفاصيل', 'نراجع المستندات والمواعيد والمتطلبات قبل أن تتحول إلى مشكلات.'],
    ['تركيز متخصص', 'فرق تعمل في اللوجستيات والسفر كل يوم.'],
    ['احترام لوقتك', 'طريق مباشر إلى الفريق المناسب دون تنقل بين الجهات.'],
  ],
  shortKicker: 'ابدأ من حيث أنت', shortTitle: ['أربع طرق', 'سريعة للبدء.'],
  shortcuts: [['تتبع شحنة', 'أدخل رقم التتبع لمعرفة آخر حالة.', '/track'], ['اطلب عرض سعر', 'شارك بيانات الشحنة والمسار مع فريق اللوجستيات.', '/logistics/request-quote'], ['خطط لرحلة', 'أخبرنا إلى أين تريد الذهاب ومتى.', '/travel/enquiry'], ['اطلب اتصالاً', 'اترك رقمك وسيتصل بك الفريق المناسب.', '/callback']],
};

function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`hx-kicker ${light ? 'hx-kicker-light' : ''}`} data-reveal><span aria-hidden="true" />{children}</div>;
}
function Title({ lines, className = '' }: { lines: string[]; className?: string }) {
  return <h2 className={`hx-title ${className}`} data-reveal>{lines.map((l, i) => <span key={i}>{l}</span>)}</h2>;
}

export function HomeExperience({ locale, Link, BrandLogo }: { locale: Locale; Link: LinkLike; BrandLogo: LogoLike }) {
  const ref = useRef<HTMLDivElement>(null);
  useMotion(ref, locale === 'ar' ? 'rtl' : 'ltr');
  const c = locale === 'ar' ? AR : EN;
  const ar = locale === 'ar';
  const lead = ar ? { eyebrow: leadership.eyebrow.ar, headline: leadership.headline.ar, message: leadership.message.ar, attribution: leadership.attribution.ar }
    : { eyebrow: leadership.eyebrow.en, headline: leadership.headline.en, message: leadership.message.en, attribution: leadership.attribution.en };
  return <div className="hx" ref={ref}>
    <div className="hx-progress" data-progress aria-hidden="true" />

    <AviationStory locale={locale} Link={Link} BrandLogo={BrandLogo} />

    <section className="hx-intro">
      <div className="hx-wrap hx-intro-grid">
        <div><Kicker>{c.introKicker}</Kicker><span className="hx-rule" data-line /></div>
        <div><Title lines={c.introTitle} /><p data-reveal data-delay="0.1">{c.introBody}</p>
          <Link href="/about" className="hx-under">{ar ? 'تعرف على نهجنا' : 'Our approach'} <ArrowRight size={15} aria-hidden="true" /></Link></div>
      </div>
    </section>

    <section className="hx-showcase" id="businesses" aria-label={c.showKicker}>
      <div className="hx-wrap"><Kicker>{c.showKicker}</Kicker></div>
      <div className="hx-panels">
        <article className="hx-panel hx-panel-logistics">
          <div className="hx-panel-media" data-img-reveal><PhotoImg photo={photos.containerShip} sizes="(min-width: 900px) 60vw, 100vw" parallax className="hx-par" /></div>
          <div className="hx-panel-body">
            <BrandLogo division="logistics" className="hx-panel-logo" />
            <h3>{c.logistics.title}</h3><p>{c.logistics.body}</p>
            <Link href="/logistics" className="hx-btn hx-btn-gold">{c.logistics.cta} <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </article>
        <article className="hx-panel hx-panel-travel">
          <div className="hx-panel-media" data-img-reveal><PhotoImg photo={photos.maldives} sizes="(min-width: 900px) 45vw, 100vw" parallax className="hx-par" /></div>
          <div className="hx-panel-body">
            <BrandLogo division="travel" className="hx-panel-logo" />
            <h3>{c.travel.title}</h3><p>{c.travel.body}</p>
            <Link href="/travel" className="hx-btn hx-btn-gold">{c.travel.cta} <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </article>
      </div>
    </section>

    <section className="hx-how">
      <div className="hx-wrap">
        <div className="hx-how-head"><div><Kicker>{c.howKicker}</Kicker><Title lines={c.howTitle} /></div></div>
        <ol className="hx-steps">
          {c.steps.map(([h, b], i) => <li key={h} data-reveal data-delay={String(i * 0.08)}><span className="hx-rule hx-rule-sm" data-line /><i>0{i + 1}</i><h3>{h}</h3><p>{b}</p></li>)}
        </ol>
      </div>
    </section>

    <section className="hx-cap hx-cap-logistics">
      <div className="hx-wrap hx-cap-grid">
        <div><Kicker light>{c.logCapKicker}</Kicker><Title lines={c.logCapTitle} className="hx-title-light" /><p data-reveal>{c.logCapBody}</p></div>
        <ul>{c.logCap.map(([n, h], i) => <li key={h} data-reveal data-delay={String(Math.min(i, 4) * 0.04)}><Link href={h}><i>0{i + 1}</i><span>{n}</span><ArrowUpRight size={17} aria-hidden="true" /></Link></li>)}</ul>
      </div>
    </section>

    <section className="hx-cap hx-cap-travel">
      <div className="hx-wrap hx-cap-grid hx-cap-grid-flip">
        <div><Kicker>{c.trvCapKicker}</Kicker><Title lines={c.trvCapTitle} /><p data-reveal>{c.trvCapBody}</p></div>
        <ul>{c.trvCap.map(([n, h], i) => <li key={h} data-reveal data-delay={String(Math.min(i, 4) * 0.04)}><Link href={h}><i>0{i + 1}</i><span>{n}</span><ArrowUpRight size={17} aria-hidden="true" /></Link></li>)}</ul>
      </div>
    </section>

    <section className="hx-trust">
      <div className="hx-wrap hx-trust-grid">
        <div><Kicker>{c.trustKicker}</Kicker><Title lines={c.trustTitle} /></div>
        <dl>{c.trust.map(([h, b], i) => <div key={h} data-reveal data-delay={String((i % 2) * 0.08)}><dt>{h}</dt><dd>{b}</dd></div>)}</dl>
      </div>
    </section>

    <section className="hx-short">
      <div className="hx-wrap">
        <div className="hx-short-head"><Kicker>{c.shortKicker}</Kicker><Title lines={c.shortTitle} /></div>
        <div className="hx-short-list">{c.shortcuts.map(([h, b, href], i) => <Link key={href} href={href} className="hx-short-row"><i>0{i + 1}</i><span><b>{h}</b><em>{b}</em></span><ArrowUpRight size={20} aria-hidden="true" /></Link>)}</div>
      </div>
    </section>

    <section className="hx-lead" aria-labelledby="hx-lead-title">
      <div className="hx-wrap hx-lead-grid">
        <div className="hx-lead-visual" data-img-reveal>
          {leadership.approvedPortrait
            ? <img src={leadership.approvedPortrait} alt={leadership.name ?? lead.attribution} width={640} height={800} loading="lazy" decoding="async" />
            : <div className="hx-lead-mark"><BrandLogo division="group" className="hx-lead-logo" /></div>}
        </div>
        <div>
          <Kicker>{lead.eyebrow}</Kicker>
          <h2 id="hx-lead-title" className="hx-title" data-reveal>{lead.headline}</h2>
          <span className="hx-rule hx-rule-gold" data-line />
          <p className="hx-lead-msg" data-reveal>{lead.message}</p>
          <p className="hx-lead-by" data-reveal>{leadership.name ? `${leadership.name}, ` : ''}{lead.attribution}</p>
        </div>
      </div>
    </section>
    <details className="hx-credits">
      <summary>{ar ? 'حقوق الصور' : 'Photography credits'}</summary>
      <p>{ar ? 'صور توضيحية من أطراف خارجية، وليست صوراً لموظفي إيرزون أو مكاتبها أو شحناتها. عُدلت أحجام الصور وحُولت إلى WebP.' : 'Illustrative third-party photography, not Airzone employees, offices or shipments. Images resized and converted to WebP.'}</p>
      <ul>{Object.values(photos).map(photo => <li key={photo.base}>
        <span>{photo.alt} — {photo.credit}.</span>{' '}
        <a href={photo.source} target="_blank" rel="noopener noreferrer">{ar ? 'المصدر' : 'Source'}</a>{' · '}
        {photo.license === 'CC BY-SA 4.0'
          ? <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">{photo.license}</a>
          : photo.license === 'CC0'
            ? <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0</a>
            : <span>{photo.license}</span>}
      </li>)}</ul>
    </details>
  </div>;
}
