import {
  ArrowRight, ArrowUpRight, Check, Compass, FileText, Mail, MapPin, Plane, Ship, Stamp, Truck, Warehouse,
} from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { Layout } from '@/components/layout/Layout';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Eyebrow, PageHero, PhotoImg, SectionHead } from '@/components/ui-kit/Primitives';
import { GccNetwork } from '@/components/network/GccNetwork';
import { businessContacts } from '@/config/business-contacts';
import { leadership } from '@/config/leadership';
import { gccCountries, warehouseCities } from '@/config/service-catalog';

type Pair = [en: string, ar: string];

/**
 * About Airzone Group: company identity, the three logistics pillars,
 * specialist services, coverage and how the team works. Server-rendered with
 * the rest of the page tree, so all content is in the prerendered HTML.
 *
 * Accuracy: no founding year, headcount, fleet size, facility count, client,
 * certification, award, ranking or named executive is stated. Services that
 * depend on carriers, partners or authorities are described as coordinated.
 */
const nav: [string, Pair, typeof Stamp][] = [
  ['/logistics/customs-clearance', ['Customs clearance services in Saudi Arabia', 'خدمات التخليص الجمركي في المملكة'], Stamp],
  ['/logistics/transportation', ['Road transportation across Saudi Arabia and the GCC', 'النقل البري في المملكة ودول الخليج'], Truck],
  ['/logistics/warehousing', ['Warehousing and temperature-controlled storage', 'التخزين والمستودعات المتحكم بحرارتها'], Warehouse],
  ['/logistics/air-freight', ['Air freight services', 'خدمات الشحن الجوي'], Plane],
  ['/logistics/sea-freight', ['Sea freight services', 'خدمات الشحن البحري'], Ship],
  ['/logistics/exhibition-event-logistics', ['Exhibition and trade show logistics', 'لوجستيات المعارض والمعارض التجارية'], Compass],
  ['/locations', ['Logistics service locations', 'مواقع الخدمات اللوجستية'], MapPin],
];

const pillars: { flag?: Pair; title: Pair; text: Pair; points: Pair[]; note: Pair; links: [string, Pair][] }[] = [
  {
    flag: ['Priority service', 'الخدمة الأولى'],
    title: ['Customs clearance & customs support', 'التخليص الجمركي والدعم الجمركي'],
    text: ['Import and export customs clearance in Saudi Arabia, coordinated for commercial cargo moving by road, air and sea. We prepare and check shipment documents, coordinate declarations with the importer or a licensed customs broker, and support compliance steps such as SABER and SASO conformity or SFDA requirements where they apply.', 'تخليص جمركي للواردات والصادرات في المملكة، بتنسيق متكامل للبضائع التجارية المنقولة براً وجواً وبحراً. نجهز مستندات الشحنة ونراجعها، وننسق البيانات الجمركية مع المستورد أو مخلّص جمركي مرخّص، وندعم خطوات الامتثال مثل مطابقة سابر والهيئة السعودية للمواصفات أو متطلبات الهيئة العامة للغذاء والدواء عند انطباقها.'],
    points: [
      ['Import and export customs clearance coordination', 'تنسيق التخليص الجمركي للاستيراد والتصدير'],
      ['Customs documentation and declaration support', 'دعم المستندات والبيانات الجمركية'],
      ['Conformity documents for SABER, SASO and SFDA, where applicable', 'مستندات المطابقة لسابر والهيئة السعودية للمواصفات والهيئة العامة للغذاء والدواء عند الحاجة'],
      ['Clearance for road freight, air cargo and sea freight', 'التخليص للشحن البري والجوي والبحري'],
      ['GCC cross-border shipment documents', 'مستندات الشحنات العابرة لحدود دول الخليج'],
      ['Temporary imports and exhibition cargo, where eligible', 'الإدخال المؤقت وشحنات المعارض للبضائع المؤهلة'],
    ],
    note: ['Requirements vary by commodity, origin and current Saudi rules. Declarations are lodged on ZATCA’s Fasah platform by the importer or a licensed broker, and release, timings and duties are decided by the authorities.', 'تختلف المتطلبات بحسب السلعة والمنشأ والأنظمة السعودية المعمول بها. ويقدم المستورد أو مخلّص مرخّص البيانات عبر منصة فسح التابعة لهيئة الزكاة والضريبة والجمارك، بينما تقرر الجهات المختصة الفسح والمدد والرسوم.'],
    links: [['/logistics/customs-clearance', ['Customs clearance services in Saudi Arabia', 'خدمات التخليص الجمركي في المملكة']], ['/logistics/customs-documentation', ['Customs documentation & compliance', 'المستندات الجمركية والامتثال']]],
  },
  {
    title: ['Transportation, freight & delivery', 'النقل والشحن والتوصيل'],
    text: ['Road transportation within Saudi Arabia and across confirmed GCC routes, heavy transport on flatbed and curtain-side trailers, Dayana local delivery, and air and sea freight coordination for imports and exports.', 'نقل بري داخل المملكة وعلى مسارات خليجية مؤكدة، ونقل ثقيل بالمقطورات المسطحة وجانبية الستائر، وتوصيل محلي عبر Dayana، وتنسيق الشحن الجوي والبحري للاستيراد والتصدير.'],
    points: [
      ['Intercity and cross-border road freight', 'الشحن البري بين المدن وعبر الحدود'],
      ['Low-bed and oversized cargo, where available', 'المقطورات المنخفضة والشحنات كبيرة الحجم عند توفرها'],
      ['Temperature-controlled transport on request', 'النقل المتحكم بحرارته عند الطلب'],
      ['Dayana local and business-to-business delivery', 'التوصيل المحلي وبين الشركات عبر Dayana'],
      ['Inbound and outbound air and sea freight', 'الشحن الجوي والبحري الوارد والصادر'],
      ['Exhibition cargo and warehouse-to-site delivery', 'شحنات المعارض والتوصيل من المستودع إلى الموقع'],
    ],
    note: ['Vehicle choice depends on dimensions, weight, loading method, temperature, route and site access. Availability, including partner-operated vehicles, is confirmed for each booking.', 'يعتمد اختيار المركبة على الأبعاد والوزن وطريقة التحميل والحرارة والمسار وإمكانية الوصول إلى الموقع. ويُؤكَّد التوفر لكل حجز، بما في ذلك المركبات التي يشغلها الشركاء.'],
    links: [['/logistics/transportation', ['Road transportation across Saudi Arabia and the GCC', 'النقل البري في المملكة ودول الخليج']], ['/logistics/heavy-transport', ['Heavy transport & trailers', 'النقل الثقيل والمقطورات']], ['/logistics/dayana-local-delivery', ['Dayana local delivery', 'Dayana للتوصيل المحلي']]],
  },
  {
    title: ['Warehousing, storage & cargo handling', 'التخزين ومناولة البضائع'],
    text: ['Storage in Riyadh, Dammam, Jeddah and Jubail, with temperature-controlled and ambient options confirmed per facility, inbound receiving, container destuffing, outbound dispatch and connected delivery.', 'تخزين في الرياض والدمام وجدة والجبيل، مع خيارات متحكم بحرارتها أو بحرارة الجو تُؤكَّد لكل منشأة، واستلام الوارد وتفريغ الحاويات وإرسال الصادر والتوصيل المرتبط.'],
    points: [
      ['Temperature-controlled and ambient storage, confirmed per facility', 'تخزين متحكم بحرارته أو بحرارة الجو يُؤكَّد لكل منشأة'],
      ['Short-term and longer-term storage', 'تخزين قصير وطويل المدى'],
      ['Inbound receiving and outbound dispatch', 'استلام الوارد وإرسال الصادر'],
      ['Container unloading and destuffing', 'تفريغ الحاويات'],
      ['Palletised cargo handling', 'مناولة البضائع على منصات'],
      ['Distribution and warehouse-to-customer delivery', 'التوزيع والتوصيل من المستودع إلى العميل'],
    ],
    note: ['Ambient storage keeps goods at normal warehouse conditions; temperature-controlled storage holds a set range for chilled, frozen or sensitive products. Not every facility offers every condition, and specialised approvals are not claimed unless confirmed.', 'يحفظ التخزين بحرارة الجو البضائع في ظروف المستودع العادية، بينما يحافظ التخزين المتحكم بحرارته على نطاق محدد للمنتجات المبردة أو المجمدة أو الحساسة. ولا توفر كل منشأة كل الظروف، ولا ندّعي اعتمادات متخصصة ما لم تُؤكَّد.'],
    links: [['/logistics/warehousing', ['Warehousing and temperature-controlled storage', 'التخزين والمستودعات المتحكم بحرارتها']], ['/logistics/container-destuffing', ['Container destuffing & handling', 'تفريغ الحاويات ومناولتها']]],
  },
];

const freight: { photo: 'airCargoLoader' | 'jeddahPort'; href: string; title: Pair; points: Pair[]; link: Pair }[] = [
  { photo: 'airCargoLoader', href: '/logistics/air-freight', title: ['Air freight', 'الشحن الجوي'], link: ['Air freight services', 'خدمات الشحن الجوي'], points: [
    ['Inbound and outbound air cargo coordination', 'تنسيق الشحن الجوي الوارد والصادر'],
    ['Air waybill and document coordination', 'تنسيق بوليصة الشحن الجوي والمستندات'],
    ['Airport collection and customs coordination', 'الاستلام من المطار وتنسيق الجمارك'],
    ['Urgent shipments, subject to flight space and schedules', 'الشحنات العاجلة بحسب المساحة المتاحة وجداول الرحلات'],
    ['Exhibition, industrial and business cargo', 'شحنات المعارض والشحنات الصناعية والتجارية'],
  ] },
  { photo: 'jeddahPort', href: '/logistics/sea-freight', title: ['Sea freight', 'الشحن البحري'], link: ['Sea freight services', 'خدمات الشحن البحري'], points: [
    ['Inbound and outbound ocean freight coordination', 'تنسيق الشحن البحري الوارد والصادر'],
    ['FCL and, on selected routes, LCL', 'حاويات كاملة، وشحنات جزئية على مسارات مختارة'],
    ['Port collection and port-to-destination transport', 'الاستلام من الميناء والنقل إلى الوجهة'],
    ['Import and export documents, including advance cargo information', 'مستندات الاستيراد والتصدير، ومنها البيانات المسبقة للشحنات'],
    ['Container delivery, unloading and empty return', 'توصيل الحاويات وتفريغها وإعادتها فارغة'],
  ] },
];

const equipment: Pair[] = [
  ['Booth and display materials', 'مواد الأجنحة والعرض'], ['LED screens, video walls and digital signage', 'شاشات LED والجدران المرئية واللافتات الرقمية'],
  ['Sound systems, speakers, mixers and microphones', 'أنظمة الصوت والسماعات وطاولات المزج والميكروفونات'], ['Stage lighting and control equipment', 'إضاءة المسارح ومعدات التحكم'],
  ['Truss systems and event structures', 'الجمالونات وهياكل الفعاليات'], ['Computers, networking and interactive displays', 'الحواسيب والشبكات والشاشات التفاعلية'],
  ['Demonstration units and commercial samples', 'وحدات العرض التجريبي والعينات التجارية'],
];

const cityNotes: Record<string, Pair> = {
  riyadh: ['The capital’s distribution market, near King Khalid International Airport and Riyadh Dry Port, which is linked by rail to the east coast.', 'سوق التوزيع في العاصمة، بالقرب من مطار الملك خالد الدولي وميناء الرياض الجاف المرتبط بالسكك الحديدية بالساحل الشرقي.'],
  dammam: ['Eastern Province gateway beside King Abdulaziz Port and close to the GCC land borders.', 'بوابة المنطقة الشرقية بجوار ميناء الملك عبدالعزيز وقريبة من المنافذ البرية الخليجية.'],
  jeddah: ['Red Sea gateway near Jeddah Islamic Port, serving the western region.', 'بوابة البحر الأحمر قرب ميناء جدة الإسلامي، تخدم المنطقة الغربية.'],
  jubail: ['Industrial city on the Gulf coast, for materials, spare parts and project cargo.', 'مدينة صناعية على ساحل الخليج، للمواد وقطع الغيار وشحنات المشاريع.'],
};

const industries: [string, Pair][] = [
  ['trade', ['General trading, importers and exporters', 'التجارة العامة والمستوردون والمصدّرون']],
  ['retail', ['Retail and wholesale distribution', 'التجزئة وتوزيع الجملة']],
  ['manufacturing', ['Manufacturing and industrial supply', 'التصنيع والإمداد الصناعي']],
  ['construction', ['Construction materials and project cargo', 'مواد البناء وشحنات المشاريع']],
  ['automotive', ['Automotive parts and commercial equipment', 'قطع السيارات والمعدات التجارية']],
  ['electronics', ['Electronics and technology equipment', 'الإلكترونيات والمعدات التقنية']],
  ['food', ['Food and beverage, subject to handling and compliance', 'الأغذية والمشروبات بحسب متطلبات المناولة والامتثال']],
  ['healthcare', ['Healthcare products, where requirements can be met', 'منتجات الرعاية الصحية حيث يمكن استيفاء المتطلبات']],
  ['events', ['Events, exhibitions and trade fairs', 'الفعاليات والمعارض والأسواق التجارية']],
  ['stage-led', ['Display, audiovisual and stage equipment', 'معدات العرض والصوتيات والمرئيات والمسارح']],
  ['ecommerce', ['E-commerce and business distribution', 'التجارة الإلكترونية والتوزيع للشركات']],
  ['machinery', ['Industrial machinery and spare parts', 'الآلات الصناعية وقطع الغيار']],
  ['temperature', ['Temperature-sensitive commercial goods', 'البضائع التجارية الحساسة للحرارة']],
];

const process: [Pair, Pair][] = [
  [['Understand the shipment', 'فهم الشحنة'], ['Cargo type, dimensions, weight, origin, destination, deadline and handling conditions.', 'نوع البضاعة وأبعادها ووزنها ومنشؤها ووجهتها وموعدها وظروف مناولتها.']],
  [['Review requirements', 'مراجعة المتطلبات'], ['Transport mode, vehicle, storage condition, paperwork and regulatory points that may apply.', 'وسيلة النقل والمركبة وظروف التخزين والمستندات والجوانب التنظيمية المحتملة.']],
  [['Plan the movement', 'تخطيط الحركة'], ['Transport, freight, storage, handling and customs-related steps coordinated together.', 'تنسيق النقل والشحن والتخزين والمناولة والخطوات الجمركية معاً.']],
  [['Confirm the quotation', 'تأكيد عرض السعر'], ['Scope, charges, exclusions, responsibilities and assumptions stated clearly.', 'توضيح النطاق والرسوم والاستثناءات والمسؤوليات والافتراضات.']],
  [['Coordinate execution', 'تنسيق التنفيذ'], ['The agreed sequence arranged, with relevant updates along the way.', 'ترتيب التسلسل المتفق عليه مع إفادات بالمستجدات المهمة.']],
  [['Complete the handover', 'إتمام التسليم'], ['Delivery or storage handover at the agreed point, with the necessary documents.', 'التسليم أو الإيداع في النقطة المتفق عليها مع المستندات اللازمة.']],
];

const reasons: [Pair, Pair][] = [
  [['One group, specialist businesses', 'مجموعة واحدة وأنشطة متخصصة'], ['Logistics and travel run as separate businesses, each with its own team.', 'يعمل نشاطا الخدمات اللوجستية والسفر بشكل مستقل، ولكل منهما فريقه.']],
  [['Coordinated services', 'خدمات منسقة'], ['Transportation, storage and customs-related steps planned together.', 'التخطيط للنقل والتخزين والخطوات الجمركية معاً.']],
  [['Cargo-specific planning', 'تخطيط خاص بكل شحنة'], ['Vehicles, storage and documents matched to the actual cargo.', 'اختيار المركبات والتخزين والمستندات بما يناسب البضاعة الفعلية.']],
  [['Written quotations', 'عروض أسعار مكتوبة'], ['Scope, charges, exclusions and responsibilities set out clearly.', 'نطاق ورسوم واستثناءات ومسؤوليات موضحة بجلاء.']],
  [['Realistic expectations', 'توقعات واقعية'], ['Honest timings and prompt updates, without guarantees we cannot keep.', 'مدد صادقة وإفادات سريعة دون ضمانات لا يمكن الوفاء بها.']],
  [['Flexible options', 'خيارات مرنة'], ['Suitable transport and storage combinations, including partner capacity where needed.', 'تركيبات مناسبة من النقل والتخزين، بما فيها طاقة الشركاء عند الحاجة.']],
  [['Saudi focus, GCC reach', 'تركيز سعودي وامتداد خليجي'], ['Saudi Arabia is our home market, with road freight on confirmed GCC routes.', 'المملكة سوقنا الأساسية، مع شحن بري على مسارات خليجية مؤكدة.']],
  [['A clear route to a quote', 'طريق واضح إلى عرض السعر'], ['One enquiry, a review of your requirements and a written quotation.', 'استفسار واحد ومراجعة لمتطلباتك ثم عرض سعر مكتوب.']],
];

const ctaLinks: [string, Pair][] = [
  ['/logistics/customs-clearance', ['Explore customs clearance', 'استكشف التخليص الجمركي']],
  ['/logistics/transportation', ['Explore transportation', 'استكشف النقل']],
  ['/logistics/warehousing', ['Explore warehousing', 'استكشف التخزين']],
  ['/logistics/air-freight', ['Explore air freight', 'استكشف الشحن الجوي']],
  ['/logistics/sea-freight', ['Explore sea freight', 'استكشف الشحن البحري']],
  ['/logistics/exhibition-event-logistics', ['Explore exhibition logistics', 'استكشف لوجستيات المعارض']],
  ['/locations', ['View service locations', 'اعرض مواقع الخدمة']],
];

export function AboutPage() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const T = (p: Pair) => (ar ? p[1] : p[0]);
  const t = (en: string, a: string) => (ar ? a : en);
  const lead = leadership;
  const emails = businessContacts.logistics.emails;
  return <Layout closingCta={false}>
    {/* A. Introduction */}
    <PageHero photo="riyadh" eyebrow={t('About Airzone Group', 'عن مجموعة إيرزون')}
      title={t('About Airzone Group — Logistics Services in Saudi Arabia & the GCC', 'عن مجموعة إيرزون: خدمات لوجستية في المملكة العربية السعودية ودول الخليج')}
      intro={t('Airzone Group brings together two distinct specialist businesses. Airzone Logistics Services Est supports business cargo movements through customs clearance support, transportation, freight coordination, warehousing and delivery across Saudi Arabia and confirmed GCC routes. We start by understanding each shipment, identify its handling and documentation requirements, coordinate the right services and confirm responsibilities before work begins.', 'تجمع مجموعة إيرزون نشاطين متخصصين مستقلين. تدعم مؤسسة إيرزون للخدمات اللوجستية حركة البضائع التجارية من خلال دعم التخليص الجمركي والنقل وتنسيق الشحن والتخزين والتوصيل في أنحاء المملكة وعلى مسارات خليجية مؤكدة. نبدأ بفهم كل شحنة، ونحدد متطلبات مناولتها ومستنداتها، وننسق الخدمات المناسبة، ونؤكد المسؤوليات قبل بدء العمل.')}
      crumbs={[{ href: '/', label: t('Home', 'الرئيسية') }, { label: t('About', 'من نحن') }]}>
      <Link href="/logistics/request-quote" className="az-btn az-btn-primary az-btn-lg" data-hero-item="cta">{t('Request a logistics quote', 'اطلب عرض سعر لوجستي')}<ArrowRight size={17} aria-hidden="true" className="az-flip" /></Link>
      <Link href="/contact" className="az-btn az-btn-outline-light az-btn-lg" data-hero-item="cta">{t('Contact the logistics team', 'تواصل مع فريق الخدمات اللوجستية')}</Link>
    </PageHero>

    <nav className="az-section-tight ab-nav" aria-labelledby="ab-nav-title">
      <div className="az-container">
        <h2 id="ab-nav-title" className="ab-nav-title">{t('Find the right service', 'اعثر على الخدمة المناسبة')}</h2>
        <ul className="az-link-tiles" data-stagger>{nav.map(([href, label, Icon]) => <li key={href}><Link href={href}><Icon size={20} aria-hidden="true" /><span>{T(label)}</span><ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link></li>)}</ul>
      </div>
    </nav>

    {/* B. Who we are */}
    <section className="az-section az-intro" aria-labelledby="ab-who">
      <div className="az-container az-intro-grid">
        <div><Eyebrow>{t('Who we are', 'من نحن')}</Eyebrow><h2 id="ab-who" data-reveal>{t('A Saudi business group with two specialist businesses', 'مجموعة أعمال سعودية بنشاطين متخصصين')}</h2></div>
        <div className="ab-prose" data-reveal data-delay="0.08">
          <p className="az-lead">{t('Airzone Group is the parent identity that brings together our logistics business, Airzone Logistics Services Est, and our separate travel business, Airzone Travel & Tourism. Each has its own team and its own enquiries, so a cargo question reaches logistics specialists and a holiday question reaches the travel team.', 'مجموعة إيرزون هي الهوية الأم التي تجمع نشاطنا اللوجستي، مؤسسة إيرزون للخدمات اللوجستية، ونشاطنا المستقل في السفر، إيرزون للسفر والسياحة. لكل منهما فريقه واستفساراته، فيصل سؤال الشحن إلى متخصصي الخدمات اللوجستية ويصل سؤال العطلات إلى فريق السفر.')}</p>
          <p>{t('Airzone Logistics Services Est focuses on commercial cargo for businesses: importers and exporters, manufacturers, distributors, retailers, contractors and event companies. Saudi Arabia is our principal market, and road transportation extends to confirmed routes across the GCC.', 'تركز مؤسسة إيرزون للخدمات اللوجستية على البضائع التجارية للشركات: المستوردون والمصدّرون والمصنّعون والموزعون وتجار التجزئة والمقاولون وشركات الفعاليات. المملكة سوقنا الأساسية، ويمتد النقل البري إلى مسارات مؤكدة في دول الخليج.')}</p>
          <p>{t('Logistics works best when the pieces are planned together. Customs coordination, transportation, freight and warehousing are connected, so an import can move from the port or airport through clearance into storage and on to your customers under one plan.', 'تنجح الخدمات اللوجستية حين تُخطَّط أجزاؤها معاً. فتنسيق الجمارك والنقل والشحن والتخزين مترابطة، لتنتقل الشحنة المستوردة من الميناء أو المطار عبر الفسح إلى التخزين ثم إلى عملائك ضمن خطة واحدة.')}</p>
          <p>{t('Every plan starts with the cargo itself: its type, dimensions, weight, origin, destination, timing and handling needs. The team reviews these before confirming a quotation, so the vehicle, storage condition and documents match the shipment. Domestic transportation, GCC transport, import and export movements, storage and delivery can all be requested through one team.', 'تبدأ كل خطة بالبضاعة نفسها: نوعها وأبعادها ووزنها ومنشؤها ووجهتها وتوقيتها ومتطلبات مناولتها. يراجع الفريق ذلك قبل تأكيد عرض السعر لتتوافق المركبة وظروف التخزين والمستندات مع الشحنة. ويمكن طلب النقل المحلي والنقل الخليجي وحركات الاستيراد والتصدير والتخزين والتوصيل من خلال فريق واحد.')}</p>
          <p>{t('We value clear scope, transparent quotations, practical coordination and realistic schedules. Where something depends on a carrier, a partner or an authority, we say so.', 'نحرص على وضوح النطاق وشفافية عروض الأسعار والتنسيق العملي والجداول الواقعية. وحين يعتمد أمر ما على ناقل أو شريك أو جهة حكومية، نوضح ذلك.')}</p>
        </div>
      </div>
      <div className="az-container">
        <div className="az-structure ab-structure" data-stagger>
          <article className="az-structure-card is-group">
            <BrandLogo sizes="220px" />
            <h3>{t('Airzone Group', 'مجموعة إيرزون')}</h3>
            <p>{t('The parent group for our logistics business and our separate travel business.', 'المجموعة الأم لنشاطنا اللوجستي ونشاطنا المستقل في السفر.')}</p>
          </article>
          <article className="az-structure-card">
            <BrandLogo division="logistics" sizes="260px" />
            <h3>{t('Airzone Logistics Services Est', 'مؤسسة إيرزون للخدمات اللوجستية')}</h3>
            <p>{t('Customs clearance support, transportation, freight coordination, warehousing and cargo handling for businesses. Local delivery runs under the Dayana name.', 'دعم التخليص الجمركي والنقل وتنسيق الشحن والتخزين ومناولة البضائع للشركات، ويُقدَّم التوصيل المحلي باسم Dayana.')}</p>
            <Link href="/logistics" className="az-text-link">{t('Logistics services', 'الخدمات اللوجستية')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
          </article>
          <article className="az-structure-card">
            <BrandLogo division="travel" sizes="120px" />
            <h3>{t('Airzone Travel & Tourism', 'إيرزون للسفر والسياحة')}</h3>
            <p>{t('A separate business for flights, holidays, hotels and corporate travel, with its own team and Riyadh office. It does not handle cargo enquiries.', 'نشاط مستقل للطيران والعطلات والفنادق وسفر الأعمال، بفريقه ومكتبه في الرياض، ولا يتولى استفسارات الشحن.')}</p>
            <Link href="/travel" className="az-text-link">{t('Travel & Tourism', 'السفر والسياحة')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
          </article>
        </div>
      </div>
    </section>

    {/* B2. At a glance: the key facts in one list (from the verified contacts and coverage data) */}
    <section className="az-section-tight ab-facts" aria-labelledby="ab-facts">
      <div className="az-container">
        <h2 id="ab-facts" className="ab-facts-title">{t('Airzone Group at a glance', 'مجموعة إيرزون في سطور')}</h2>
        <dl className="ab-facts-list">
          <div><dt>{t('Group', 'المجموعة')}</dt><dd>{ar
            ? <>مجموعة إيرزون (<span lang="en">Airzone Group</span>)، مجموعة أعمال سعودية تضم نشاطين</>
            : <>Airzone Group (<span lang="ar">مجموعة إيرزون</span>), a Saudi business group with two businesses</>}</dd></div>
          <div><dt>{t('Logistics', 'الخدمات اللوجستية')}</dt><dd>{t('Airzone Logistics Services Est: customs clearance support, road and heavy transport, warehousing, air and sea freight, exhibition logistics and Dayana local delivery', 'مؤسسة إيرزون للخدمات اللوجستية: دعم التخليص الجمركي والنقل البري والثقيل والتخزين والشحن الجوي والبحري ولوجستيات المعارض والتوصيل المحلي عبر Dayana')}</dd></div>
          <div><dt>{t('Travel', 'السفر')}</dt><dd>{t('Airzone Travel & Tourism: flights, holidays, hotels and corporate travel, from its office in Al Malaz, Riyadh', 'إيرزون للسفر والسياحة: الطيران والعطلات والفنادق وسفر الأعمال، من مكتبها في حي الملز بالرياض')}</dd></div>
          <div><dt>{t('Where we work', 'نطاق العمل')}</dt><dd>{t('Saudi Arabia, with road transportation to the United Arab Emirates, Kuwait, Qatar, Bahrain and Oman', 'المملكة العربية السعودية، مع نقل بري إلى الإمارات العربية المتحدة والكويت وقطر والبحرين وعُمان')}</dd></div>
          <div><dt>{t('Warehousing', 'التخزين')}</dt><dd>{t('Temperature-controlled, in Riyadh, Dammam, Jeddah and Jubail, with 24/7 operations', 'تخزين متحكم بحرارته في الرياض والدمام وجدة والجبيل مع عمليات على مدار الساعة')}</dd></div>
          <div><dt>{t('Customs', 'الجمارك')}</dt><dd>{t('Declarations are lodged on ZATCA’s Fasah platform by the importer or a licensed customs broker; Airzone coordinates the documents and procedures', 'تُقدَّم البيانات عبر منصة فسح من قِبل المستورد أو مخلص جمركي مرخّص، وتتولى إيرزون تنسيق المستندات والإجراءات')}</dd></div>
          <div><dt>{t('Contact', 'التواصل')}</dt><dd>
            <span className="ab-fact-line">{t('Logistics', 'الخدمات اللوجستية')}: <a href={`mailto:${businessContacts.logistics.emails[0]}`} dir="ltr">{businessContacts.logistics.emails[0]}</a> · {t('WhatsApp', 'واتساب')} <bdi dir="ltr">{businessContacts.logistics.whatsappNumber}</bdi></span>
            <span className="ab-fact-line">{t('Travel', 'السفر')}: <a href={`mailto:${businessContacts.travel.emails[0]}`} dir="ltr">{businessContacts.travel.emails[0]}</a>{businessContacts.travel.phone && <> · <a href={businessContacts.travel.phone.href} dir="ltr">{businessContacts.travel.phone.label}</a></>}</span>
          </dd></div>
        </dl>
      </div>
    </section>

    {/* C. Three core services */}
    <section className="az-section is-surface ab-pillars-section" aria-labelledby="ab-pillars">
      <div className="az-container">
        <SectionHead eyebrow={t('Our three core logistics services', 'خدماتنا اللوجستية الأساسية الثلاث')} id="ab-pillars"
          title={t('Customs clearance, transportation and warehousing', 'التخليص الجمركي والنقل والتخزين')}
          text={t('Customs clearance leads our logistics offering, with transportation and warehousing alongside. Each has its own detailed page.', 'يتصدر التخليص الجمركي خدماتنا اللوجستية، ويرافقه النقل والتخزين، ولكل منها صفحة تفصيلية.')} />
        <ul className="ab-pillars" data-stagger>
          {pillars.map((p, i) => <li key={p.title[0]} className={`ab-pillar ${p.flag ? 'is-featured' : ''}`}>
            {p.flag && <span className="lg-pill-flag">{T(p.flag)}</span>}
            <h3>{T(p.title)}</h3>
            <p>{T(p.text)}</p>
            <ul className="pk-points">{p.points.map(x => <li key={x[0]}><Check size={15} aria-hidden="true" />{T(x)}</li>)}</ul>
            <p className="ab-pillar-note">{T(p.note)}</p>
            <div className="ab-pillar-links">{p.links.map(([href, label]) => <Link key={href} href={href} className="az-text-link">{T(label)}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>)}</div>
          </li>)}
        </ul>
      </div>
    </section>

    {/* D. Air and sea freight */}
    <section className="az-section" aria-labelledby="ab-freight">
      <div className="az-container">
        <SectionHead eyebrow={t('International freight', 'الشحن الدولي')} id="ab-freight"
          title={t('Air freight, sea freight and international cargo coordination', 'الشحن الجوي والبحري وتنسيق الشحنات الدولية')}
          text={t('Airzone coordinates international freight through airlines, shipping lines and forwarding partners. We do not own aircraft or vessels: our role is to plan the movement, prepare the documents, coordinate customs and deliver by road.', 'تنسق إيرزون الشحن الدولي عبر شركات الطيران والخطوط الملاحية وشركاء الشحن. لا نمتلك طائرات أو سفناً، ودورنا تخطيط الحركة وتجهيز المستندات وتنسيق الجمارك والتوصيل براً.')} />
        <ul className="pk-cards cols-2" data-stagger>
          {freight.map(f => <li key={f.href} className="pk-card has-photo">
            <div className="pk-card-media"><PhotoImg photo={f.photo} sizes="(min-width: 1000px) 50vw, 100vw" /></div>
            <div className="pk-card-body">
              <h3>{T(f.title)}</h3>
              <ul className="pk-points">{f.points.map(x => <li key={x[0]}><Check size={15} aria-hidden="true" />{T(x)}</li>)}</ul>
              <div className="pk-links"><Link href={f.href} className="az-text-link">{T(f.link)}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link></div>
            </div>
          </li>)}
        </ul>
        <p className="pk-note">{t('Container destuffing, port-to-warehouse transport and empty-container return can be added to sea imports.', 'يمكن إضافة تفريغ الحاويات والنقل من الميناء إلى المستودع وإعادة الحاويات الفارغة إلى الواردات البحرية.')} <Link href="/logistics/container-destuffing" className="az-text-link">{t('Container destuffing', 'تفريغ الحاويات')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link></p>
      </div>
    </section>

    {/* E. Exhibition logistics */}
    <section className="az-section is-surface" aria-labelledby="ab-exhibition">
      <div className="az-container ab-split">
        <div>
          <SectionHead eyebrow={t('Exhibitions and events', 'المعارض والفعاليات')} id="ab-exhibition"
            title={t('Exhibition, trade show and event logistics', 'لوجستيات المعارض والمعارض التجارية والفعاليات')}
            text={t('Moving equipment to exhibitions, trade fairs, conferences and corporate events in Saudi Arabia: inbound and outbound exhibition cargo, air and sea freight, customs coordination for eligible temporary imports, venue delivery, temporary storage where available, and post-event collection and return.', 'نقل المعدات إلى المعارض والأسواق التجارية والمؤتمرات وفعاليات الشركات في المملكة: شحنات المعارض الواردة والصادرة، والشحن الجوي والبحري، وتنسيق الجمارك للإدخال المؤقت المؤهل، والتسليم في الموقع، والتخزين المؤقت حيث يتوفر، والاستلام والإعادة بعد الفعالية.')} />
          <ul className="az-chip-list ab-chips">{equipment.map(e => <li key={e[0]}><span className="az-chip">{T(e)}</span></li>)}</ul>
          <p className="pk-note">{t('ATA Carnet or temporary-admission eligibility depends on the goods, the documents and customs requirements; duty-free admission is never automatic.', 'يعتمد التأهل لدفتر ATA Carnet أو الإدخال المؤقت على البضائع والمستندات والمتطلبات الجمركية، والإعفاء من الرسوم ليس تلقائياً أبداً.')}</p>
          <div className="pk-ctas">
            <Link href="/logistics/exhibition-event-logistics" className="az-btn az-btn-navy">{t('Exhibition and trade show logistics', 'لوجستيات المعارض والمعارض التجارية')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
            <Link href="/logistics/ata-carnet" className="az-btn az-btn-outline">{t('ATA Carnet assistance', 'المساعدة في دفاتر ATA Carnet')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
          </div>
        </div>
        <div className="ab-split-media" data-img-reveal><PhotoImg photo="exhibitionStand" sizes="(min-width: 1000px) 45vw, 100vw" /></div>
      </div>
    </section>

    {/* F. Saudi coverage */}
    <section className="az-section" aria-labelledby="ab-coverage">
      <div className="az-container">
        <SectionHead eyebrow={t('Saudi Arabia', 'المملكة العربية السعودية')} id="ab-coverage"
          title={t('Service coverage in Saudi Arabia', 'تغطية الخدمة في المملكة')}
          text={t('Our warehousing covers four Saudi cities, connected to road transportation across the Kingdom. Each city page explains what is available there. Facility addresses are shared once arrangements are confirmed, and no office is implied.', 'يغطي التخزين لدينا أربع مدن سعودية مرتبطة بالنقل البري في أنحاء المملكة، وتوضح صفحة كل مدينة ما يتوفر فيها. تُشارك عناوين المنشآت بعد تأكيد الترتيبات، ولا يعني ذلك وجود مكتب.')} />
        <ul className="ab-cities" data-stagger>
          {warehouseCities.map(c => <li key={c.id} className="ab-city">
            <span className="ab-city-region">{c.region[locale]}</span>
            <h3>{c[locale]}</h3>
            <p>{T(cityNotes[c.id])}</p>
            <Link href={`/logistics/warehousing-${c.id}`} className="az-text-link">{t(`Logistics services in ${c.en}`, `الخدمات اللوجستية في ${c.ar}`)}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
          </li>)}
        </ul>
        <p className="pk-note">{t('Road transportation to other Saudi cities is quoted on request, and each route is confirmed in the quotation.', 'يُسعَّر النقل البري إلى المدن السعودية الأخرى عند الطلب، ويُؤكَّد كل مسار في عرض السعر.')} <Link href="/locations" className="az-text-link">{t('Logistics service locations', 'مواقع الخدمات اللوجستية')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link></p>
      </div>
    </section>

    {/* G. GCC cross-border */}
    <section className="az-section az-coverage is-surface" aria-labelledby="ab-gcc">
      <div className="az-container az-coverage-grid">
        <div>
          <SectionHead eyebrow={t('GCC cross-border', 'عبر حدود الخليج')} id="ab-gcc"
            title={t('GCC transportation and cross-border logistics', 'النقل الخليجي والخدمات اللوجستية عبر الحدود')}
            text={t('Road freight between Saudi Arabia and the other GCC states, arranged route by route. Route feasibility, border procedures, transit time, documents, permits, vehicle availability and cargo restrictions are checked for each shipment; fixed transit times and scheduled departures are not published.', 'شحن بري بين المملكة ودول الخليج الأخرى يُرتَّب لكل مسار على حدة. نتحقق لكل شحنة من إمكانية المسار وإجراءات الحدود ومدة العبور والمستندات والتصاريح وتوفر المركبات وقيود البضائع، ولا ننشر مدد عبور ثابتة أو مواعيد انطلاق مجدولة.')} />
          <ul className="az-chip-list">{gccCountries.filter(g => g.en !== 'Saudi Arabia').map(g => <li key={g.en}><span className="az-chip">{t(`Saudi Arabia to ${g.en === 'United Arab Emirates' ? 'the UAE' : g.en}`, `من المملكة إلى ${g.ar}`)}</span></li>)}</ul>
          <Link href="/logistics/gcc-transportation" className="az-text-link">{t('GCC transportation services', 'خدمات النقل البري الخليجي')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
        <GccNetwork />
      </div>
    </section>

    {/* H. Industries */}
    <section className="az-section" aria-labelledby="ab-industries">
      <div className="az-container">
        <SectionHead eyebrow={t('Industries and cargo types', 'القطاعات وأنواع البضائع')} id="ab-industries"
          title={t('Business requirements we can evaluate', 'متطلبات الأعمال التي يمكننا تقييمها')}
          text={t('Find your sector to see the customs, transport and storage services that usually fit, then request a quotation.', 'ابحث عن قطاعك لترى خدمات الجمارك والنقل والتخزين التي تناسبه عادةً، ثم اطلب عرض سعر.')} />
        <ul className="pk-chips">{industries.map(([id, label]) => <li key={id}><Link href={`/logistics/industries#${id}`} className="pk-chip">{T(label)}<ArrowRight size={15} aria-hidden="true" className="az-flip" /></Link></li>)}</ul>
        <p className="pk-note">{t('Specialised licences, cold-chain certifications and dangerous-goods approvals are not claimed. Regulated cargo is accepted only after its operational and regulatory requirements are confirmed.', 'لا ندّعي تراخيص متخصصة أو شهادات سلسلة تبريد أو موافقات للبضائع الخطرة، ولا تُقبل البضائع الخاضعة للتنظيم إلا بعد تأكيد متطلباتها التشغيلية والتنظيمية.')}</p>
      </div>
    </section>

    {/* I. How we operate */}
    <section className="az-section az-dark" aria-labelledby="ab-process">
      <div className="az-container">
        <SectionHead light eyebrow={t('How we operate', 'كيف نعمل')} id="ab-process" title={t('Six steps from enquiry to handover', 'ست خطوات من الاستفسار حتى التسليم')} />
        <ol className="pk-steps ab-steps">{process.map(([h, p], i) => <li key={h[0]} data-reveal><span className="pk-step-n">{String(i + 1).padStart(2, '0')}</span><h3>{T(h)}</h3><p>{T(p)}</p></li>)}</ol>
      </div>
    </section>

    {/* J. Why businesses choose Airzone */}
    <section className="az-section az-why" aria-labelledby="ab-why">
      <div className="az-container">
        <SectionHead eyebrow={t('Why businesses choose Airzone Group', 'لماذا تختار الشركات مجموعة إيرزون')} id="ab-why" title={t('Principles behind every shipment', 'مبادئ نلتزم بها في كل شحنة')} />
        <ul className="az-why-list" data-stagger>
          {reasons.map(([h, p]) => <li key={h[0]} className="az-why-item"><h3>{T(h)}</h3><p>{T(p)}</p></li>)}
        </ul>
      </div>
    </section>

    {/* K. Leadership message */}
    <section className="az-section-tight az-statement" aria-labelledby="ab-statement">
      <div className="az-container az-statement-inner" data-reveal>
        <Eyebrow>{lead.eyebrow[locale]}</Eyebrow>
        <h2 id="ab-statement">{lead.headline[locale]}</h2>
        <blockquote><p>{lead.message[locale]}</p></blockquote>
        <p className="az-statement-by">{lead.name ? `${lead.name}, ` : ''}{lead.attribution[locale]}</p>
      </div>
    </section>

    {/* L. Conversion */}
    <section className="az-section az-dark ab-cta" aria-labelledby="ab-cta">
      <div className="az-container ab-cta-grid">
        <div>
          <h2 id="ab-cta">{t('Looking for a logistics partner in Saudi Arabia or the GCC?', 'هل تبحث عن شريك لوجستي في المملكة أو دول الخليج؟')}</h2>
          <p>{t('Tell us about your cargo, origin, destination, required service and target date. Our team can review your requirements and confirm the available service scope and quotation.', 'أخبرنا عن بضاعتك ومنشئها ووجهتها والخدمة المطلوبة والموعد المستهدف، وسيراجع فريقنا متطلباتك ويؤكد نطاق الخدمة المتاح وعرض السعر.')}</p>
          <div className="pk-ctas">
            <Link href="/logistics/request-quote" className="az-btn az-btn-primary az-btn-lg"><FileText size={17} aria-hidden="true" />{t('Request a quote', 'اطلب عرض سعر')}</Link>
            <Link href="/contact" className="az-btn az-btn-outline-light az-btn-lg">{t('Contact the logistics team', 'تواصل مع فريق الخدمات اللوجستية')}</Link>
          </div>
          <p className="ab-cta-email"><Mail size={16} aria-hidden="true" />{t('Logistics email', 'البريد الإلكتروني للخدمات اللوجستية')}: {emails.map((e, i) => <span key={e}>{i > 0 && ' · '}<a href={`mailto:${e}`} dir="ltr">{e}</a></span>)}</p>
        </div>
        <ul className="ab-cta-links">{ctaLinks.map(([href, label]) => <li key={href}><Link href={href}>{T(label)}<ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link></li>)}</ul>
      </div>
    </section>
  </Layout>;
}
