import { Fragment, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowRight, ArrowUpRight, Check, Clock, MapPin, Route, ShieldCheck, Handshake, ClipboardCheck, Headset,
  Stamp, FileText, FileCheck2, Truck, Warehouse, Mail, PackageSearch, Info,
} from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { Layout } from '@/components/layout/Layout';
import { PhotoImg, SectionHead, ServiceCard, Eyebrow, SplitWords, wordCount } from '@/components/ui-kit/Primitives';
import { FleetShowroom } from '@/components/fleet/FleetShowroom';
import { QuoteChooser } from '@/components/layout/QuoteCta';
import { GccNetwork } from '@/components/network/GccNetwork';
import { ContactForm } from '@/components/forms/ContactForm';
import { CinematicOpening } from '@/components/home/CinematicOpening';
import { serviceCatalog, warehouseCities, gccCountries } from '@/config/service-catalog';
import { businessContacts } from '@/config/business-contacts';

// Service strip icons: customs document, transport, warehouse, compliance document.
const STRIP_ICONS = [Stamp, Truck, Warehouse, FileCheck2];
const REGULATORS: Record<string, { en: string; ar: string }> = {
  SABER: { en: 'SABER: Saudi product conformity and shipment certificate platform', ar: 'سابر: منصة مطابقة المنتجات وشهادات الإرساليات' },
  SFDA: { en: 'SFDA: Saudi Food and Drug Authority', ar: 'الهيئة العامة للغذاء والدواء' },
  SASO: { en: 'SASO: Saudi Standards, Metrology and Quality Organization', ar: 'الهيئة السعودية للمواصفات والمقاييس والجودة' },
  IECEE: { en: 'IECEE: conformity certification for electrical and electronic products', ar: 'IECEE: شهادات مطابقة المنتجات الكهربائية والإلكترونية' },
  GACA: { en: 'GACA: General Authority of Civil Aviation', ar: 'الهيئة العامة للطيران المدني' },
  ZATCA: { en: 'ZATCA: Zakat, Tax and Customs Authority', ar: 'هيئة الزكاة والضريبة والجمارك' },
  FASAH: { en: 'FASAH: Saudi electronic platform for customs declarations', ar: 'فسح: المنصة الإلكترونية للبيانات الجمركية' },
};

const C = {
  en: {
    eyebrow: 'Logistics company in Saudi Arabia',
    h1: ['Moving cargo across', 'Saudi Arabia and the GCC.'],
    lead: 'Airzone Group arranges GCC road transportation, heavy trailer solutions, Dayana local delivery, temperature-controlled warehousing in four Saudi cities and customs coordination, planned around your cargo and confirmed in writing.',
    quote: 'Request a quote', explore: 'Explore services',
    // Core services strip, in priority order: customs first (most prominent), then
    // transportation, warehousing and regulatory documentation. No counts or metrics.
    stripLabel: 'Core logistics services',
    stripTitle: 'Airzone Logistics · core services',
    services: [
      { href: '/logistics/customs-clearance', title: '24/7 Customs Clearance Support', items: ['Import & Export Documentation', 'Customs Coordination', 'Regulatory Compliance'] },
      { href: '/logistics/transportation', title: 'Saudi Arabia & GCC Transportation', items: ['Road Freight', 'Heavy Transport', 'Flatbeds', 'Curtain-Side Trailers', 'Local Delivery'] },
      { href: '/logistics/warehousing', title: 'Warehousing Services', items: ['Riyadh', 'Dammam', 'Jeddah', 'Jubail'] },
      { href: '/logistics/customs-documentation', title: 'Regulatory Approvals & Documentation', items: ['SABER', 'SFDA', 'SASO', 'IECEE', 'GACA', 'ZATCA', 'FASAH'] },
    ],
    introEyebrow: 'Who we are',
    introTitle: 'One logistics partner for road freight, storage and delivery.',
    introText: 'Airzone Group is a Saudi-based logistics business. We connect transportation across Saudi Arabia and the GCC with temperature-controlled warehousing, local delivery through Dayana and customs coordination, so a shipment can move from origin to warehouse to customer under one plan.',
    introPoints: ['One point of contact for each shipment', 'Written quotations that set out scope and responsibilities', 'Clear distinction between Saudi and GCC services'],
    servicesEyebrow: 'Core services', servicesTitle: 'Logistics services built around your cargo.',
    servicesText: 'Choose a service to see what is included, who it suits and what information helps us quote.',
    moreServices: 'Also available',
    allServices: 'All logistics services',
    fleetEyebrow: 'Vehicles & trailers', fleetTitle: 'Transportation solutions for every load size.',
    fleetText: 'Explore our fleet of delivery vehicles, commercial trucks and specialist trailers. Select a vehicle to discover its applications and request a quotation for your route.',
    fleetNote: 'Vehicle availability is confirmed for each booking and may include partner-operated equipment.',
    dayanaTitle: 'Dayana: local delivery from Airzone Group.',
    dayanaText: 'Dayana is our local delivery service for city distribution, commercial deliveries and last-mile logistics, with vans and 5- and 7-metre trucks matched to the load.',
    dayanaUses: ['Parcels and cartons', 'Multi-drop city routes', 'Store and branch deliveries', 'Scheduled distribution', 'Warehouse-to-customer runs'],
    dayanaCta: 'Explore Dayana',
    whEyebrow: 'Warehousing in Saudi Arabia', whTitle: 'Temperature-controlled warehousing in four cities.',
    whText: 'Storage, inventory handling and dispatch coordination with 24/7 operations, connected directly to our transportation and Dayana local delivery.',
    whPoints: ['Temperature-controlled storage', 'Receiving and inventory handling', 'Storage and distribution coordination', 'Warehouse-to-transportation integration'],
    whCta: 'Warehousing details', whLocations: 'Service locations',
    covEyebrow: 'Service coverage', covTitle: 'Clear coverage: Saudi Arabia and the GCC.',
    covSaudi: 'Within Saudi Arabia', covSaudiItems: ['Road transportation between Saudi cities', 'Temperature-controlled warehousing in Riyadh, Dammam, Jeddah and Jubail', 'Dayana local delivery, with service areas confirmed at booking'],
    covGcc: 'Across the GCC', covGccItems: ['Cross-border road freight between Saudi Arabia and neighbouring GCC states', 'Each route confirmed for vehicle availability, border procedures and regulations', 'Customs documentation coordinated for cross-border moves'],
    custEyebrow: 'Customs support', custTitle: 'Customs documentation and shipment coordination.',
    custText: 'We coordinate the paperwork and planning around imports, exports and cross-border moves, working with licensed customs brokers and the relevant parties where required.',
    custItems: ['Customs documentation coordination', 'Shipment paperwork review', 'Import and export logistics coordination', 'Coordination with customs brokers and agents', 'Freight movement planning', 'Shipment status communication'],
    custNote: 'Airzone Group provides customs support and coordination. It is not a customs authority, and clearance outcomes and timings are subject to official procedures.',
    custCta: 'Customs support details',
    howEyebrow: 'How we work', howTitle: 'From enquiry to delivery, in four clear steps.',
    how: [
      ['Share the requirement', 'Tell us the cargo, route, dates and any storage or delivery needs.', FileText],
      ['Plan and quote', 'We match vehicles, storage and routing, and confirm scope, charges and responsibilities in writing.', ClipboardCheck],
      ['Coordinate', 'Loading, border documentation, warehousing and delivery are coordinated with one point of contact.', Route],
      ['Keep you informed', 'You receive status updates at agreed milestones until the job is complete.', Headset],
    ] as const,
    whyEyebrow: 'Why work with us', whyTitle: 'Practical logistics, communicated honestly.',
    why: [
      ['Connected services', 'Transportation, warehousing and local delivery planned together, not in isolation.', Handshake],
      ['Written commitments', 'Scope, vehicle, charges and responsibilities are confirmed in the quotation before work begins.', ShieldCheck],
      ['Realistic timelines', 'Schedules are agreed with you, and you are told promptly if anything changes.', Clock],
      ['Saudi footprint', 'Warehousing in four Saudi cities with 24/7 operations, plus GCC road connections.', MapPin],
    ] as const,
    travelEyebrow: 'Also part of Airzone Group', travelTitle: 'Airzone Travel & Tourism',
    travelText: 'A separate business offering flight assistance, holiday planning, hotels and corporate travel from its Riyadh office.',
    travelCta: 'Visit Travel & Tourism',
    contactEyebrow: 'Contact us', contactTitle: 'Tell us what you need to move, store or deliver.',
    contactText: 'Send a message and the right team will reply. For detailed shipments, the quote form captures everything we need.',
    contactQuote: 'Use the detailed quote form',
    contactEmail: 'Email the logistics team',
  },
  ar: {
    eyebrow: 'شركة خدمات لوجستية في المملكة العربية السعودية',
    h1: ['ننقل البضائع في', 'المملكة ودول الخليج.'],
    lead: 'ترتّب مجموعة إيرزون النقل البري الخليجي وحلول المقطورات الثقيلة وخدمة Dayana للتوصيل المحلي والتخزين المتحكم بحرارته في أربع مدن سعودية وتنسيق الجمارك، وفق متطلبات بضاعتك وبتأكيد مكتوب.',
    quote: 'اطلب عرض سعر', explore: 'استكشف الخدمات',
    stripLabel: 'خدماتنا اللوجستية الأساسية',
    stripTitle: 'إيرزون للخدمات اللوجستية · الخدمات الأساسية',
    services: [
      { href: '/logistics/customs-clearance', title: 'دعم التخليص الجمركي على مدار الساعة', items: ['مستندات الاستيراد والتصدير', 'التنسيق الجمركي', 'الامتثال التنظيمي'] },
      { href: '/logistics/transportation', title: 'النقل في المملكة ودول الخليج', items: ['الشحن البري', 'النقل الثقيل', 'المقطورات المسطحة', 'المقطورات جانبية الستائر', 'التوصيل المحلي'] },
      { href: '/logistics/warehousing', title: 'خدمات التخزين', items: ['الرياض', 'الدمام', 'جدة', 'الجبيل'] },
      { href: '/logistics/customs-documentation', title: 'الموافقات التنظيمية والمستندات', items: ['SABER', 'SFDA', 'SASO', 'IECEE', 'GACA', 'ZATCA', 'FASAH'] },
    ],
    introEyebrow: 'من نحن',
    introTitle: 'شريك لوجستي واحد للنقل والتخزين والتوصيل.',
    introText: 'مجموعة إيرزون نشاط لوجستي مقره المملكة العربية السعودية. نربط النقل داخل المملكة وفي دول الخليج بالتخزين المتحكم بحرارته والتوصيل المحلي عبر Dayana وتنسيق الجمارك، لتنتقل الشحنة من المنشأ إلى المستودع ثم إلى العميل ضمن خطة واحدة.',
    introPoints: ['جهة تواصل واحدة لكل شحنة', 'عروض أسعار مكتوبة توضح النطاق والمسؤوليات', 'تمييز واضح بين خدمات المملكة وخدمات الخليج'],
    servicesEyebrow: 'الخدمات الأساسية', servicesTitle: 'خدمات لوجستية مصممة حول بضاعتك.',
    servicesText: 'اختر خدمة لتعرف ما تشمله ولمن تناسب وما المعلومات التي تساعدنا على إعداد عرض السعر.',
    moreServices: 'متاح أيضاً',
    allServices: 'جميع الخدمات اللوجستية',
    fleetEyebrow: 'المركبات والمقطورات', fleetTitle: 'حلول نقل لكل حجم حمولة.',
    fleetText: 'استكشف أسطولنا من مركبات التوصيل والشاحنات التجارية والمقطورات المتخصصة. اختر مركبة لتتعرف على استخداماتها واطلب عرض سعر لمسارك.',
    fleetNote: 'يُؤكَّد توفر المركبات لكل حجز وقد يشمل معدات يشغّلها شركاء.',
    dayanaTitle: 'Dayana: التوصيل المحلي من مجموعة إيرزون.',
    dayanaText: 'Dayana هي خدمة التوصيل المحلي لدينا للتوزيع داخل المدن والتوصيل التجاري والتوصيل للميل الأخير، بعربات فان وشاحنات 5 و7 أمتار تُختار وفق الحمولة.',
    dayanaUses: ['الطرود والكراتين', 'مسارات متعددة النقاط داخل المدينة', 'التوصيل للمتاجر والفروع', 'التوزيع المجدول', 'من المستودع إلى العميل'],
    dayanaCta: 'استكشف Dayana',
    whEyebrow: 'التخزين في المملكة', whTitle: 'تخزين متحكم بحرارته في أربع مدن.',
    whText: 'تخزين ومناولة مخزون وتنسيق إرسال مع عمليات على مدار الساعة، مرتبطة مباشرة بخدمات النقل وبخدمة Dayana للتوصيل المحلي.',
    whPoints: ['تخزين متحكم بالحرارة', 'الاستلام ومناولة المخزون', 'تنسيق التخزين والتوزيع', 'ربط المستودع بالنقل'],
    whCta: 'تفاصيل التخزين', whLocations: 'مواقع الخدمة',
    covEyebrow: 'نطاق الخدمة', covTitle: 'تغطية واضحة: المملكة ودول الخليج.',
    covSaudi: 'داخل المملكة العربية السعودية', covSaudiItems: ['النقل البري بين المدن السعودية', 'تخزين متحكم بحرارته في الرياض والدمام وجدة والجبيل', 'توصيل محلي عبر Dayana مع تأكيد مناطق الخدمة عند الحجز'],
    covGcc: 'في دول الخليج', covGccItems: ['شحن بري عابر للحدود بين المملكة ودول الخليج المجاورة', 'يُؤكَّد كل مسار وفق توفر المركبات وإجراءات الحدود والأنظمة', 'تنسيق المستندات الجمركية للرحلات العابرة للحدود'],
    custEyebrow: 'دعم الجمارك', custTitle: 'المستندات الجمركية وتنسيق الشحنات.',
    custText: 'ننسّق المستندات والتخطيط للاستيراد والتصدير والرحلات العابرة للحدود، بالتعاون مع مخلصين جمركيين مرخّصين والأطراف المعنية عند الحاجة.',
    custItems: ['تنسيق المستندات الجمركية', 'مراجعة أوراق الشحنة', 'تنسيق لوجستيات الاستيراد والتصدير', 'التنسيق مع المخلصين والوكلاء الجمركيين', 'تخطيط حركة الشحن', 'الإفادة بحالة الشحنة'],
    custNote: 'تقدم مجموعة إيرزون دعماً جمركياً وتنسيقاً، وليست جهة جمركية، وتخضع نتائج التخليص ومدده للإجراءات الرسمية.',
    custCta: 'تفاصيل دعم الجمارك',
    howEyebrow: 'كيف نعمل', howTitle: 'من الاستفسار إلى التسليم في أربع خطوات واضحة.',
    how: [
      ['شاركنا المتطلبات', 'أخبرنا بالبضاعة والمسار والمواعيد وأي احتياجات للتخزين أو التوصيل.', FileText],
      ['التخطيط وعرض السعر', 'نختار المركبات والتخزين والمسار، ونؤكد النطاق والرسوم والمسؤوليات كتابياً.', ClipboardCheck],
      ['التنسيق', 'يُنسَّق التحميل ومستندات الحدود والتخزين والتوصيل عبر جهة تواصل واحدة.', Route],
      ['إبقاؤك على اطلاع', 'تصلك إفادات بالحالة عند المراحل المتفق عليها حتى اكتمال المهمة.', Headset],
    ] as const,
    whyEyebrow: 'لماذا نحن', whyTitle: 'خدمات لوجستية عملية وتواصل صادق.',
    why: [
      ['خدمات مترابطة', 'نخطط للنقل والتخزين والتوصيل المحلي معاً لا بمعزل عن بعضها.', Handshake],
      ['التزامات مكتوبة', 'يُؤكَّد النطاق والمركبة والرسوم والمسؤوليات في عرض السعر قبل بدء العمل.', ShieldCheck],
      ['جداول واقعية', 'نتفق معك على الجداول ونبلغك فوراً بأي تغيير.', Clock],
      ['حضور في المملكة', 'مستودعات في أربع مدن سعودية تعمل على مدار الساعة، مع روابط برية خليجية.', MapPin],
    ] as const,
    travelEyebrow: 'من أعمال مجموعة إيرزون', travelTitle: 'إيرزون للسفر والسياحة',
    travelText: 'نشاط مستقل يقدم المساعدة في الطيران وتخطيط العطلات والفنادق وسفر الأعمال من مكتبه في الرياض.',
    travelCta: 'زيارة السفر والسياحة',
    contactEyebrow: 'تواصل معنا', contactTitle: 'أخبرنا بما تحتاج إلى نقله أو تخزينه أو توصيله.',
    contactText: 'أرسل رسالة وسيرد الفريق المناسب. وللشحنات المفصلة، يجمع نموذج عرض السعر كل ما نحتاجه.',
    contactQuote: 'استخدم نموذج عرض السعر المفصل',
    contactEmail: 'راسل فريق الخدمات اللوجستية',
  },
};

export function HomePage() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const c = C[locale];
  const [, navigate] = useLocation();
  const track = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const n = String(new FormData(e.currentTarget).get('n') || '').trim();
    if (n) navigate(`${ar ? '/ar' : ''}/track?n=${encodeURIComponent(n)}`);
  };
  // Each card links to the detailed page; acronyms carry their full names (the
  // documentation page explains what each body covers and Airzone's role).
  const strip = <ul className="az-svc-strip" aria-label={c.stripLabel}>
    {c.services.map((svc, i) => {
      const Icon = STRIP_ICONS[i];
      const acronyms = i === STRIP_ICONS.length - 1;
      return <li key={svc.href} className={i === 0 ? 'is-primary' : undefined} data-hero-item="aside">
        <Link href={svc.href} className="az-svc">
          <span className="az-svc-head">
            <span className="az-svc-icon"><Icon size={i === 0 ? 22 : 20} aria-hidden="true" /></span>
            <span className="az-svc-title">{svc.title}</span>
          </span>
          {/* Inline items with a separator after each, so wrapped lines never start with one. */}
          <span className={`az-svc-items ${acronyms ? 'is-acronyms' : ''}`} dir={acronyms ? 'ltr' : undefined}>
            {svc.items.map((item, k) => <Fragment key={item}>{k > 0 && ' '}<span>{acronyms ? <abbr title={REGULATORS[item]?.[locale]}>{item}</abbr> : item}</span></Fragment>)}
          </span>
          <ArrowUpRight size={16} aria-hidden="true" className="az-svc-arrow az-flip" />
        </Link>
      </li>;
    })}
  </ul>;
  const featured = serviceCatalog.filter(s => s.featured);
  const secondary = serviceCatalog.filter(s => !s.featured);

  return <Layout>
    {/* Opening: scroll-driven airplane scene with the homepage hero in front of it,
        then the two Airzone businesses (see CinematicOpening). */}
    <CinematicOpening>
      <div className="az-container az-hero-inner">
        <p className="az-eyebrow az-eyebrow-light" data-hero-item="eyebrow">{c.eyebrow}</p>
        <h1 id="az-hero-title"><span className="az-line"><SplitWords text={c.h1[0]} start={1} /></span> <span className="az-line"><SplitWords text={c.h1[1]} start={1 + wordCount(c.h1[0])} /></span></h1>
        <p className="az-hero-lead" data-hero-item="text">{c.lead}</p>
        <div className="az-hero-actions">
          <QuoteChooser className="az-btn az-btn-primary az-btn-lg" placement="below-start" label={c.quote} wrapperProps={{ 'data-hero-item': 'cta' }} />
          <Link href="/logistics" className="az-btn az-btn-outline-light az-btn-lg" data-hero-item="cta">{c.explore}</Link>
        </div>
        <form className="az-hero-track" role="search" aria-labelledby="az-hero-track-label" onSubmit={track} data-hero-item="text">
          <label id="az-hero-track-label" htmlFor="az-hero-track-input">{ar ? 'تتبع شحنة' : 'Track a shipment'}</label>
          <div className="az-hero-track-row">
            <PackageSearch size={18} aria-hidden="true" />
            <input id="az-hero-track-input" name="n" required maxLength={60} autoComplete="off" spellCheck={false} dir="ltr" placeholder={ar ? 'أدخل رقم التتبع' : 'Enter your tracking number'} />
            <button type="submit" className="az-btn az-btn-sm az-btn-primary">{ar ? 'تتبع' : 'Track'}</button>
          </div>
        </form>
      </div>
      <div className="az-container">{strip}</div>
    </CinematicOpening>
    {/* Same service strip for screens too short to show it in the opening (CSS picks one). */}
    <section className="az-facts-band" aria-labelledby="az-facts-label"><div className="az-container"><p className="az-facts-label" id="az-facts-label">{c.stripTitle}</p>{strip}</div></section>

    {/* Introduction */}
    <section className="az-section az-intro">
      <div className="az-container az-intro-grid">
        <div>
          <Eyebrow>{c.introEyebrow}</Eyebrow>
          <h2 data-reveal>{c.introTitle}</h2>
        </div>
        <div data-reveal data-delay="0.08">
          <p className="az-lead">{c.introText}</p>
          <ul className="az-checks">{c.introPoints.map(p => <li key={p}><Check size={17} aria-hidden="true" />{p}</li>)}</ul>
          <Link href="/about" className="az-text-link">{ar ? 'عن مجموعة إيرزون' : 'About Airzone Group'}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </section>

    {/* Services */}
    <section className="az-section az-services" aria-labelledby="az-services-title">
      <div className="az-container">
        <SectionHead eyebrow={c.servicesEyebrow} title={c.servicesTitle} text={c.servicesText} id="az-services-title" />
        <div className="az-service-grid" data-stagger>
          {featured.map((s, i) => <ServiceCard key={s.path} entry={s} large={i === 0} />)}
        </div>
        <div className="az-service-more-row">
          <span className="az-muted-label">{c.moreServices}</span>
          <ul className="az-chip-list">{secondary.map(s => <li key={s.path}><Link href={s.path} className="az-chip">{s[locale].name}</Link></li>)}</ul>
          <Link href="/logistics" className="az-text-link">{c.allServices}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </section>

    {/* Fleet showroom (replaces the vehicle-category cards and the separate Dayana block) */}
    <section className="az-section az-showroom" id="vehicles" aria-labelledby="az-fleet-title">
      <div className="az-container">
        <SectionHead eyebrow={c.fleetEyebrow} title={c.fleetTitle} text={c.fleetText} id="az-fleet-title">
          <p className="az-sr-note"><Info size={16} aria-hidden="true" />{c.fleetNote}</p>
        </SectionHead>
        <FleetShowroom />
        <div className="az-sr-dayana" aria-labelledby="az-dayana-title">
          <div>
            <h3 id="az-dayana-title">{c.dayanaTitle}</h3>
            <p>{c.dayanaText}</p>
          </div>
          <ul className="az-checks az-sr-dayana-uses">{c.dayanaUses.map(u => <li key={u}><Check size={16} aria-hidden="true" />{u}</li>)}</ul>
          <Link href="/logistics/dayana-local-delivery" className="az-btn az-btn-navy">{c.dayanaCta}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </section>

    {/* Warehousing */}
    <section className="az-section az-dark az-warehousing" aria-labelledby="az-wh-title" data-curtain>
      <div className="az-wh-media" aria-hidden="true"><PhotoImg photo="warehouseAisle" sizes="100vw" parallax /></div>
      <div className="az-container az-wh-grid">
        <div className="az-wh-copy">
          <Eyebrow light>{c.whEyebrow}</Eyebrow>
          <h2 id="az-wh-title" data-reveal>{c.whTitle}</h2>
          <p className="az-lead" data-reveal>{c.whText}</p>
          <ul className="az-checks az-checks-light" data-stagger>{c.whPoints.map(p => <li key={p}><Check size={17} aria-hidden="true" />{p}</li>)}</ul>
          <div className="az-inline-actions">
            <Link href="/logistics/warehousing" className="az-btn az-btn-primary">{c.whCta}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
            <Link href="/locations" className="az-btn az-btn-outline-light">{c.whLocations}</Link>
          </div>
        </div>
        <ul className="az-city-list" data-stagger aria-label={ar ? 'مدن المستودعات' : 'Warehouse cities'}>
          {warehouseCities.map(city => <li key={city.id}>
            <Link href={`/logistics/warehousing-${city.id}`} className="az-city">
              <span className="az-city-icon"><Warehouse size={20} aria-hidden="true" /></span>
              <span className="az-city-name">{city[locale]}</span>
              <span className="az-city-region">{city.region[locale]}</span>
              <ArrowUpRight size={18} aria-hidden="true" className="az-city-go az-flip" />
            </Link>
          </li>)}
        </ul>
      </div>
    </section>

    {/* Coverage */}
    <section className="az-section az-coverage" aria-labelledby="az-cov-title">
      <div className="az-container az-coverage-grid">
        <div>
          <SectionHead eyebrow={c.covEyebrow} title={c.covTitle} id="az-cov-title" />
          <div className="az-coverage-cols">
            <div className="az-coverage-card" data-reveal>
              <h3><MapPin size={18} aria-hidden="true" />{c.covSaudi}</h3>
              <ul className="az-checks">{c.covSaudiItems.map(p => <li key={p}><Check size={16} aria-hidden="true" />{p}</li>)}</ul>
            </div>
            <div className="az-coverage-card is-gcc" data-reveal data-delay="0.08">
              <h3><Route size={18} aria-hidden="true" />{c.covGcc}</h3>
              <ul className="az-checks">{c.covGccItems.map(p => <li key={p}><Check size={16} aria-hidden="true" />{p}</li>)}</ul>
              <ul className="az-chip-list az-chip-list-sm" aria-label={ar ? 'دول مجلس التعاون' : 'GCC states'}>{gccCountries.map(g => <li key={g.en}><span className="az-chip">{g[locale]}</span></li>)}</ul>
            </div>
          </div>
        </div>
        <div className="az-coverage-visual" data-reveal><GccNetwork /></div>
      </div>
    </section>

    {/* Customs */}
    <section className="az-section az-customs" aria-labelledby="az-cust-title">
      <div className="az-container az-split az-split-flip">
        <div className="az-split-media" data-img-reveal><PhotoImg photo="portCranes" sizes="(min-width: 1000px) 50vw, 100vw" className="az-cover" /></div>
        <div className="az-split-body">
          <Eyebrow>{c.custEyebrow}</Eyebrow>
          <h2 id="az-cust-title" data-reveal>{c.custTitle}</h2>
          <p className="az-lead" data-reveal>{c.custText}</p>
          <ul className="az-grid-list" data-stagger>{c.custItems.map(p => <li key={p}><Stamp size={16} aria-hidden="true" />{p}</li>)}</ul>
          <p className="az-note"><ShieldCheck size={16} aria-hidden="true" />{c.custNote}</p>
          <Link href="/logistics/customs-clearance" className="az-btn az-btn-navy">{c.custCta}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="az-section az-process" aria-labelledby="az-how-title">
      <div className="az-container az-process-grid">
        <div className="az-process-head" data-pin>
          <SectionHead eyebrow={c.howEyebrow} title={c.howTitle} id="az-how-title" />
          <Link href="/logistics/request-quote" className="az-btn az-btn-primary">{ar ? 'اطلب عرض سعر لوجستي' : 'Request a logistics quote'}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
        <ol className="az-steps">
          <span className="az-steps-line" data-scrub-line aria-hidden="true" />
          {c.how.map(([title, text, Icon], i) => <li key={title} data-reveal>
            <span className="az-step-icon"><Icon size={20} aria-hidden="true" /></span>
            <span className="az-step-n">0{i + 1}</span>
            <h3>{title}</h3><p>{text}</p>
          </li>)}
        </ol>
      </div>
    </section>

    {/* Why */}
    <section className="az-section az-why" aria-labelledby="az-why-title">
      <div className="az-container">
        <SectionHead eyebrow={c.whyEyebrow} title={c.whyTitle} id="az-why-title" />
        <ul className="az-why-list" data-stagger>
          {c.why.map(([title, text, Icon]) => <li key={title} className="az-why-item">
            <Icon size={24} aria-hidden="true" />
            <h3>{title}</h3><p>{text}</p>
          </li>)}
        </ul>
      </div>
    </section>

    {/* Contact */}
    <section className="az-section az-home-contact" aria-labelledby="az-contact-title" id="contact">
      <div className="az-container az-contact-grid">
        <div>
          <Eyebrow>{c.contactEyebrow}</Eyebrow>
          <h2 id="az-contact-title" data-reveal>{c.contactTitle}</h2>
          <p className="az-lead" data-reveal>{c.contactText}</p>
          <ul className="az-contact-list">
            <li><Mail size={18} aria-hidden="true" /><span><b>{c.contactEmail}</b>{businessContacts.logistics.emails.map(e => <a key={e} href={`mailto:${e}`} dir="ltr">{e}</a>)}</span></li>
            <li><FileText size={18} aria-hidden="true" /><span><b>{ar ? 'شحنة مفصلة؟' : 'Detailed shipment?'}</b><Link href="/logistics/request-quote">{c.contactQuote}</Link></span></li>
          </ul>
        </div>
        <div className="az-card az-form-card"><ContactForm compact /></div>
      </div>
    </section>
  </Layout>;
}
