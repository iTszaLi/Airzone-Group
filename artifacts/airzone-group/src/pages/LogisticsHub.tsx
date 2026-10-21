import { useState, type KeyboardEvent } from 'react';
import { AnimatePresence, m } from 'motion/react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Boxes, Clock, Earth, FileCheck2, FileText, MapPin, Route, ShieldCheck, Stamp, ThermometerSnowflake, Truck, Warehouse, Wrench, Layers,
} from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { Layout } from '@/components/layout/Layout';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Breadcrumbs, PhotoImg, SectionHead, SplitWords } from '@/components/ui-kit/Primitives';
import { catalogByPath, warehouseCities } from '@/config/service-catalog';
import { LogisticsScene } from '@/components/logistics/LogisticsScene';
import { hubCompare, hubFaqs } from '@/config/logistics-hub-geo';
import type { PhotoKey } from '@/config/photography';

type Fleet = { id: string; photo: PhotoKey; line: 'gcc' | 'dayana'; href: string; service: string; equipment: string; en: [string, string]; ar: [string, string] };

/** Vehicle and trailer categories stated by the business; photographs show the category, not Airzone vehicles. */
const fleet: Fleet[] = [
  { id: 'tractor', photo: 'semiOpenRoad', line: 'gcc', href: '/logistics/heavy-transport', service: 'heavy-transport', equipment: 'Heavy-duty truck', en: ['Heavy-duty trucks', 'Prime movers for full and heavy loads on domestic and GCC routes.'], ar: ['شاحنات ثقيلة', 'رؤوس قاطرة للحمولات الكاملة والثقيلة على المسارات المحلية والخليجية.'] },
  { id: 'flatbed', photo: 'flatbedTrailer', line: 'gcc', href: '/logistics/heavy-transport', service: 'heavy-transport', equipment: 'Flatbed trailer', en: ['Flatbed trailers', 'Open decks for machinery, steel, construction materials and suitable crane-loaded cargo.'], ar: ['مقطورات مسطحة', 'أسطح مكشوفة للمعدات والحديد ومواد البناء والبضائع المناسبة للتحميل بالرافعة.'] },
  { id: 'curtain', photo: 'curtainTrailer', line: 'gcc', href: '/logistics/heavy-transport', service: 'heavy-transport', equipment: 'Curtain-side trailer', en: ['Curtain-side trailers', 'Covered bodies with sliding curtains for palletised and side-loaded goods.'], ar: ['مقطورات جانبية الستائر', 'هياكل مغطاة بستائر منزلقة للبضائع على منصات والتحميل الجانبي.'] },
  { id: 'box', photo: 'boxTrailer', line: 'gcc', href: '/logistics/gcc-transportation', service: 'gcc-transportation', equipment: 'Other commercial trailer', en: ['Other commercial trailers', 'Closed box and other trailer types, matched to cargo requirements.'], ar: ['مقطورات تجارية أخرى', 'مقطورات صندوقية مغلقة وأنواع أخرى تُختار وفق متطلبات البضاعة.'] },
  { id: 'special', photo: 'oversizeLoad', line: 'gcc', href: '/logistics/heavy-transport', service: 'heavy-transport', equipment: 'Specialised / oversized transport', en: ['Specialised transport', 'Heavy and oversized cargo where suitable equipment, permits and operational arrangements are available.'], ar: ['نقل متخصص', 'للحمولات الثقيلة وكبيرة الحجم عند توفر المعدات والتصاريح والترتيبات التشغيلية المناسبة.'] },
  { id: 'rigid7', photo: 'boxTruck', line: 'dayana', href: '/logistics/dayana-local-delivery', service: 'dayana-local-delivery', equipment: 'Dayana 7-metre truck', en: ['7-metre delivery trucks', 'Larger local consignments and multi-drop distribution with Dayana.'], ar: ['شاحنات توصيل 7 أمتار', 'للشحنات المحلية الأكبر والتوزيع متعدد النقاط مع Dayana.'] },
  { id: 'rigid5', photo: 'boxVan', line: 'dayana', href: '/logistics/dayana-local-delivery', service: 'dayana-local-delivery', equipment: 'Dayana 5-metre truck', en: ['5-metre delivery trucks', 'Medium commercial loads for city and regional deliveries with Dayana.'], ar: ['شاحنات توصيل 5 أمتار', 'للحمولات التجارية المتوسطة داخل المدن والمناطق مع Dayana.'] },
  { id: 'van', photo: 'panelVan', line: 'dayana', href: '/logistics/dayana-local-delivery', service: 'dayana-local-delivery', equipment: 'Dayana van', en: ['Vans', 'Smaller consignments, frequent drops and last-mile deliveries with Dayana.'], ar: ['عربات فان', 'للشحنات الصغيرة والتوصيلات المتكررة والتوصيل للميل الأخير مع Dayana.'] },
];

const C = {
  en: {
    crumbs: ['Home', 'Logistics services'],
    eyebrow: 'Airzone Group · Logistics',
    h1: 'Integrated logistics solutions across Saudi Arabia & the GCC.',
    lead: 'Customs clearance, road transportation and warehousing solutions designed to keep your cargo moving efficiently across Saudi Arabia and the Gulf Cooperation Council.',
    quote: 'Request a logistics quote', explore: 'Speak to our logistics team', place: 'Saudi Arabia · Serving the GCC', scroll: 'Scroll to explore',
    scene: 'A shipment’s journey: a container port, a truck on the open road and a warehouse aisle.',
    shots: ['Customs clearance at the port', 'Road transportation across Saudi Arabia & the GCC', 'Temperature-controlled warehousing'],
    cuGroups: ['Import & export', 'Temporary imports & exhibitions', 'Product conformity & regulatory documents', 'Food, pharmaceutical & medical', 'Industrial, electrical & project cargo'],
    frQuote: 'Request a quote',
    pillEyebrow: 'Three service pillars', pillTitle: 'More than trucking: customs, transport and storage in one plan.',
    pillars: [
      ['Customs clearance', 'Import, export and temporary-admission clearance, product compliance documentation and release, coordinated with licensed brokers where required.', 'Explore customs clearance', '/logistics/customs-clearance', 'customsCover'],
      ['Transportation', 'Flatbed, low-bed, curtain-side and box trailers, refrigerated transport on request, oversized cargo and Dayana local delivery.', 'Explore transportation', '/logistics/transportation', 'transportCover'],
      ['Warehousing', 'Temperature-controlled storage in Riyadh, Dammam, Jeddah and Jubail with 24/7 operations.', 'Explore warehousing', '/logistics/warehousing', 'warehousingCover'],
    ] as [string, string, string, string, PhotoKey][],
    featured: 'Flagship service',
    cuEyebrow: 'Customs clearance', cuTitle: 'Customs clearance & documentation support for complex shipments',
    cuText: 'From commercial imports and exports to regulated products, exhibition equipment, temporary imports and specialised cargo, Airzone Logistics helps businesses navigate shipment documentation and coordinate customs procedures in Saudi Arabia.',
    cuButtons: [['Request customs clearance', '/logistics/customs-clearance#customs-quote'], ['Check shipment documentation', '/logistics/customs-documentation#doc-checker'], ['Request ATA Carnet assistance', '/logistics/ata-carnet'], ['Speak to our customs team', '/contact']],
    branches: [
      ['Import customs clearance', '/logistics/customs-clearance#import'], ['Export customs clearance', '/logistics/customs-clearance#export'],
      ['SABER & product conformity', '/logistics/customs-documentation#saber'], ['SASO & IEC/IECEE documentation', '/logistics/customs-documentation#iecee'],
      ['SFDA-regulated shipments', '/logistics/customs-documentation#sfda'], ['GACA & aviation-related cargo', '/logistics/customs-documentation#gaca'],
      ['ATA Carnet & temporary imports', '/logistics/ata-carnet'], ['Exhibition & event cargo', '/logistics/exhibition-event-logistics'],
      ['Food & beverage shipments', '/logistics/customs-clearance#food'], ['Pharmaceutical & medical device shipments', '/logistics/customs-clearance#pharma'],
      ['Industrial machinery & project cargo', '/logistics/customs-clearance#machinery'], ['Electrical & electronic products', '/logistics/customs-clearance#electrical'],
      ['Specialised & restricted cargo assessment', '/logistics/customs-clearance#chemicals'], ['Customs documentation assistance', '/logistics/customs-documentation#documents'],
      ['Road, sea & air shipment coordination', '/logistics/customs-clearance#modes'],
    ],
    cuNote: 'Declarations are lodged on ZATCA’s Fasah platform by the importer or a licensed customs broker; certificates and permits are issued only by the competent authorities.',
    cityLinks: 'Warehousing by city', industriesTitle: 'Industries we serve', industriesCta: 'See all industries',
    trEyebrow: 'Road transportation', trTitle: 'Transportation across Saudi Arabia and the GCC.',
    trText: 'From full truckloads and cross-border road freight to heavy and oversized cargo, we coordinate road transportation around your cargo requirements, route, delivery schedule and available equipment.',
    tr: [
      ['GCC transportation', 'Full-truckload and cross-border road freight within Saudi Arabia and across the GCC, with route planning and delivery coordination based on shipment requirements.', 'Explore GCC transportation', '/logistics/gcc-transportation', 'semiOpenRoad'],
      ['Heavy transport & trailers', 'Transportation solutions using suitable heavy-duty trucks, flatbed trailers, curtain-side trailers and other commercial equipment, subject to cargo requirements and confirmed availability.', 'Explore heavy transport', '/logistics/heavy-transport', 'flatbedTrailer'],
      ['Dayana local delivery', 'Local and regional distribution using 5-metre and 7-metre delivery trucks and vans, supporting commercial consignments and last-mile delivery requirements.', 'Explore Dayana delivery', '/logistics/dayana-local-delivery', 'boxVan'],
    ] as [string, string, string, string, PhotoKey][],
    discuss: 'Discuss your shipment',
    whEyebrow: 'Warehousing & storage', whTitle: 'Storage built around your operational requirements.',
    whText: 'Airzone Group provides temperature-controlled warehousing services across Riyadh, Dammam, Jeddah and Jubail, with 24/7 operations.',
    whNote: 'Temperature ranges, space and handling services vary by location and are confirmed for your requirement.',
    whOps: '24/7 operations', whTemp: 'Temperature-controlled', whCta: 'Warehousing details',
    frEyebrow: 'Specialist services', frTitle: 'Air freight, sea freight, exhibitions and cargo handling.',
    frText: 'Specialist services connected to the three pillars, customs clearance, transportation and warehousing, so each part of the shipment follows one plan.',
    frNote: 'Airzone Group provides customs support and coordination, working with licensed customs brokers where required. It is not a customs authority, and clearance outcomes and timings are subject to official procedures.',
    details: 'Service details',
    flEyebrow: 'Fleet & equipment', flTitle: 'The right equipment for the load.',
    flText: 'Vehicle and trailer options are matched to the shipment, route and cargo requirements. Availability is confirmed for each booking and may include partner-operated equipment.',
    flNote: 'Photographs show vehicle categories, not specific Airzone vehicles. Equipment availability is confirmed for each booking.',
    flLine: { gcc: 'Saudi Arabia & GCC', dayana: 'Dayana · Local' }, area: 'Service area', flQuote: 'Request this equipment', flLabel: 'Vehicle and trailer categories',
    whyEyebrow: 'Why Airzone Group', whyTitle: 'Logistics that works around your business.',
    why: [
      ['Coordinated solutions', 'Transportation, warehousing, delivery and freight coordination brought together around your requirements.'],
      ['Flexible equipment options', 'Vehicle and trailer solutions matched to the shipment, subject to availability.'],
      ['Operational coordination', 'Clear communication around routes, cargo details, documentation and delivery requirements.'],
      ['Regional coverage', 'Support for transportation within Saudi Arabia and across GCC routes, according to the selected service.'],
    ],
    howEyebrow: 'How it works', howTitle: 'From your requirement to a clear quotation.',
    how: [
      ['Share your shipment details', 'Tell us the origin, destination, cargo type, dimensions or weight, and preferred dates.'],
      ['We assess the requirements', 'Our team reviews the route, transport mode, handling requirements and relevant service availability.'],
      ['Receive a written quotation', 'We prepare a quotation based on the information supplied and the applicable operational requirements.'],
      ['Confirm the arrangements', 'Once the quotation, availability and applicable terms are accepted, the arrangements can be confirmed.'],
    ],
    howCta: 'Request a logistics quotation',
    finalEyebrow: 'Airzone Group · Logistics', finalTitle: 'Planning a shipment, storage or delivery?',
    finalText: 'Send us the route, cargo details and preferred dates. Our team will review your requirements and prepare a written quotation based on the information provided.',
    contact: 'Contact us', allServices: 'All logistics services',
    cmpEyebrow: 'Compare services', cmpTitle: 'Which service fits your shipment?', cmpText: 'The main services side by side. Coverage, equipment and timings are confirmed for each shipment.',
    cmpCaption: 'Airzone Logistics services compared', cmpCols: ['Service', 'What it covers', 'Where'],
    faqEyebrow: 'Questions and answers', faqTitle: 'Questions businesses ask about Airzone Logistics',
  },
  ar: {
    crumbs: ['الرئيسية', 'الخدمات اللوجستية'],
    eyebrow: 'مجموعة إيرزون · الخدمات اللوجستية',
    h1: 'حلول لوجستية متكاملة في المملكة ودول الخليج.',
    lead: 'حلول للتخليص الجمركي والنقل البري والتخزين، مصممة لتبقى بضائعك في حركة فعّالة في المملكة العربية السعودية ودول مجلس التعاون الخليجي.',
    quote: 'اطلب عرض سعر لوجستي', explore: 'تحدث إلى فريق الخدمات اللوجستية', place: 'المملكة العربية السعودية · نخدم دول الخليج', scroll: 'مرّر للاستكشاف',
    scene: 'رحلة شحنة: ميناء حاويات وشاحنة على الطريق وممر في مستودع.',
    shots: ['التخليص الجمركي في الميناء', 'النقل البري في المملكة ودول الخليج', 'تخزين متحكم بحرارته'],
    cuGroups: ['الاستيراد والتصدير', 'الإدخال المؤقت والمعارض', 'مطابقة المنتجات والمستندات التنظيمية', 'الأغذية والأدوية والأجهزة الطبية', 'الشحنات الصناعية والكهربائية والمشاريع'],
    frQuote: 'اطلب عرض سعر',
    pillEyebrow: 'ثلاث ركائز للخدمة', pillTitle: 'أكثر من مجرد نقل: الجمارك والنقل والتخزين في خطة واحدة.',
    pillars: [
      ['التخليص الجمركي', 'تخليص الواردات والصادرات والإدخال المؤقت ومستندات امتثال المنتجات والفسح، بالتنسيق مع مخلصين مرخّصين عند الحاجة.', 'استكشف التخليص الجمركي', '/logistics/customs-clearance', 'customsCover'],
      ['النقل', 'مقطورات مسطحة ومنخفضة وجانبية الستائر وصندوقية، ونقل مبرد عند الطلب، وحمولات استثنائية، وتوصيل محلي عبر Dayana.', 'استكشف النقل', '/logistics/transportation', 'transportCover'],
      ['التخزين', 'تخزين متحكم بحرارته في الرياض والدمام وجدة والجبيل مع عمليات على مدار الساعة.', 'استكشف التخزين', '/logistics/warehousing', 'warehousingCover'],
    ] as [string, string, string, string, PhotoKey][],
    featured: 'الخدمة الرئيسية',
    cuEyebrow: 'التخليص الجمركي', cuTitle: 'التخليص الجمركي ودعم المستندات للشحنات المعقدة',
    cuText: 'من الواردات والصادرات التجارية إلى المنتجات الخاضعة للتنظيم ومعدات المعارض والإدخال المؤقت والشحنات المتخصصة، تساعد إيرزون للخدمات اللوجستية الشركات على التعامل مع مستندات الشحنات وتنسيق الإجراءات الجمركية في المملكة.',
    cuButtons: [['اطلب خدمة التخليص الجمركي', '/logistics/customs-clearance#customs-quote'], ['تحقق من مستندات شحنتك', '/logistics/customs-documentation#doc-checker'], ['اطلب المساعدة في دفتر ATA Carnet', '/logistics/ata-carnet'], ['تحدث إلى فريق الجمارك', '/contact']],
    branches: [
      ['التخليص الجمركي للواردات', '/logistics/customs-clearance#import'], ['التخليص الجمركي للصادرات', '/logistics/customs-clearance#export'],
      ['سابر ومطابقة المنتجات', '/logistics/customs-documentation#saber'], ['مستندات الهيئة السعودية للمواصفات وIEC/IECEE', '/logistics/customs-documentation#iecee'],
      ['الشحنات الخاضعة للهيئة العامة للغذاء والدواء', '/logistics/customs-documentation#sfda'], ['الطيران المدني والشحنات المرتبطة بالطيران', '/logistics/customs-documentation#gaca'],
      ['دفاتر ATA Carnet والإدخال المؤقت', '/logistics/ata-carnet'], ['شحنات المعارض والفعاليات', '/logistics/exhibition-event-logistics'],
      ['شحنات الأغذية والمشروبات', '/logistics/customs-clearance#food'], ['شحنات الأدوية والأجهزة الطبية', '/logistics/customs-clearance#pharma'],
      ['المعدات الصناعية وشحنات المشاريع', '/logistics/customs-clearance#machinery'], ['المنتجات الكهربائية والإلكترونية', '/logistics/customs-clearance#electrical'],
      ['تقييم الشحنات المتخصصة والمقيدة', '/logistics/customs-clearance#chemicals'], ['المساعدة في المستندات الجمركية', '/logistics/customs-documentation#documents'],
      ['تنسيق الشحن البري والبحري والجوي', '/logistics/customs-clearance#modes'],
    ],
    cuNote: 'تُقدَّم البيانات عبر منصة فسح من قِبل المستورد أو مخلص جمركي مرخّص، ولا تصدر الشهادات والتصاريح إلا عن الجهات المختصة.',
    cityLinks: 'التخزين حسب المدينة', industriesTitle: 'القطاعات التي نخدمها', industriesCta: 'عرض جميع القطاعات',
    trEyebrow: 'النقل البري', trTitle: 'النقل في المملكة ودول الخليج.',
    trText: 'من الشحنات الكاملة والشحن البري العابر للحدود إلى الحمولات الثقيلة وكبيرة الحجم، ننسّق النقل البري وفق متطلبات بضاعتك ومسارك وجدول التسليم والمعدات المتاحة.',
    tr: [
      ['النقل البري الخليجي', 'شحن بالشاحنات الكاملة وشحن بري عابر للحدود داخل المملكة وفي دول الخليج، مع تخطيط المسار وتنسيق التسليم وفق متطلبات الشحنة.', 'استكشف النقل الخليجي', '/logistics/gcc-transportation', 'semiOpenRoad'],
      ['النقل الثقيل والمقطورات', 'حلول نقل بشاحنات ثقيلة مناسبة ومقطورات مسطحة وجانبية الستائر ومعدات تجارية أخرى، وفق متطلبات البضاعة والتوفر المؤكد.', 'استكشف النقل الثقيل', '/logistics/heavy-transport', 'flatbedTrailer'],
      ['Dayana للتوصيل المحلي', 'توزيع محلي وإقليمي بشاحنات توصيل 5 و7 أمتار وعربات فان، لدعم الشحنات التجارية ومتطلبات التوصيل للميل الأخير.', 'استكشف توصيل Dayana', '/logistics/dayana-local-delivery', 'boxVan'],
    ] as [string, string, string, string, PhotoKey][],
    discuss: 'ناقش شحنتك',
    whEyebrow: 'التخزين والمستودعات', whTitle: 'تخزين مصمم حول متطلباتك التشغيلية.',
    whText: 'تقدم مجموعة إيرزون خدمات تخزين متحكم بحرارته في الرياض والدمام وجدة والجبيل، مع عمليات على مدار الساعة.',
    whNote: 'تختلف نطاقات الحرارة والمساحة وخدمات المناولة حسب الموقع وتُؤكَّد وفق متطلباتك.',
    whOps: 'عمليات على مدار الساعة', whTemp: 'متحكم بالحرارة', whCta: 'تفاصيل التخزين',
    frEyebrow: 'خدمات متخصصة', frTitle: 'الشحن الجوي والبحري والمعارض ومناولة البضائع.',
    frText: 'خدمات متخصصة مرتبطة بالركائز الثلاث، التخليص الجمركي والنقل والتخزين، لتسير أجزاء الشحنة كلها وفق خطة واحدة.',
    frNote: 'تقدم مجموعة إيرزون دعماً وتنسيقاً جمركياً بالتعاون مع مخلصين جمركيين مرخّصين عند الحاجة، وليست جهة جمركية، وتخضع نتائج التخليص ومدده للإجراءات الرسمية.',
    details: 'تفاصيل الخدمة',
    flEyebrow: 'الأسطول والمعدات', flTitle: 'المعدات المناسبة للحمولة.',
    flText: 'تُختار المركبات والمقطورات وفق الشحنة والمسار ومتطلبات البضاعة. يُؤكَّد التوفر لكل حجز وقد يشمل معدات يشغّلها شركاء.',
    flNote: 'تُظهر الصور فئات المركبات وليست مركبات إيرزون بعينها. يُؤكَّد توفر المعدات لكل حجز.',
    flLine: { gcc: 'المملكة والخليج', dayana: 'Dayana · محلي' }, area: 'نطاق الخدمة', flQuote: 'اطلب هذه المعدات', flLabel: 'فئات المركبات والمقطورات',
    whyEyebrow: 'لماذا مجموعة إيرزون', whyTitle: 'خدمات لوجستية تعمل حول أعمالك.',
    why: [
      ['حلول منسقة', 'النقل والتخزين والتوصيل وتنسيق الشحن مجتمعة حول متطلباتك.'],
      ['خيارات معدات مرنة', 'حلول مركبات ومقطورات تناسب الشحنة، وفق التوفر.'],
      ['تنسيق تشغيلي', 'تواصل واضح بشأن المسارات وتفاصيل البضاعة والمستندات ومتطلبات التسليم.'],
      ['تغطية إقليمية', 'دعم النقل داخل المملكة وعبر المسارات الخليجية، بحسب الخدمة المختارة.'],
    ],
    howEyebrow: 'كيف نعمل', howTitle: 'من متطلباتك إلى عرض سعر واضح.',
    how: [
      ['شارك تفاصيل شحنتك', 'أخبرنا بالمنشأ والوجهة ونوع البضاعة والأبعاد أو الوزن والتواريخ المفضلة.'],
      ['نقيّم المتطلبات', 'يراجع فريقنا المسار ووسيلة النقل ومتطلبات المناولة وتوفر الخدمة.'],
      ['تتسلم عرض سعر مكتوباً', 'نعد عرض السعر بناءً على المعلومات المقدمة والمتطلبات التشغيلية المطبقة.'],
      ['تأكيد الترتيبات', 'بعد قبول عرض السعر والتوفر والشروط المطبقة، يمكن تأكيد الترتيبات.'],
    ],
    howCta: 'اطلب عرض سعر لوجستي',
    finalEyebrow: 'مجموعة إيرزون · الخدمات اللوجستية', finalTitle: 'لديك شحنة أو تخزين أو توصيل تخطط له؟',
    finalText: 'أرسل لنا المسار وتفاصيل البضاعة والتواريخ المفضلة، وسيراجع فريقنا متطلباتك ويعد عرض سعر مكتوباً بناءً على المعلومات المقدمة.',
    contact: 'تواصل معنا', allServices: 'جميع الخدمات اللوجستية',
    cmpEyebrow: 'قارن الخدمات', cmpTitle: 'أي خدمة تناسب شحنتك؟', cmpText: 'الخدمات الرئيسية جنباً إلى جنب. تُؤكَّد التغطية والمعدات والمدد لكل شحنة.',
    cmpCaption: 'مقارنة خدمات إيرزون للخدمات اللوجستية', cmpCols: ['الخدمة', 'ما تشمله', 'النطاق'],
    faqEyebrow: 'أسئلة وأجوبة', faqTitle: 'أسئلة تطرحها الشركات عن إيرزون للخدمات اللوجستية',
  },
};

const freightMain: [string, PhotoKey][] = [
  ['/logistics/air-freight', 'airCargoLoader'], ['/logistics/sea-freight', 'jeddahPort'],
  ['/logistics/exhibition-event-logistics', 'exhibitionStand'], ['/logistics/container-destuffing', 'containerYard'],
];
const freightMore: [string, typeof Earth][] = [
  ['/logistics/freight-forwarding', Boxes], ['/logistics/import-export', Earth], ['/logistics/customs-documentation', FileCheck2], ['/logistics/ata-carnet', FileText],
];
const n2 = (i: number) => String(i + 1).padStart(2, '0');
/** The 15 customs categories (C.branches, by index) in five groups, so a visitor finds theirs in seconds.
 *  Ordered so the three columns balance (5 + 5 + 5 links). */
const CU_GROUPS = [[0, 1, 14], [6, 7], [2, 3, 4, 5, 13], [8, 9], [10, 11, 12]];

/** Vehicle categories as accessible tabs (arrow keys, Home/End) with a large photographic panel. */
function FleetShowcase() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const c = C[locale];
  const [active, setActive] = useState(0);
  const v = fleet[active];
  const [name, text] = v[locale];
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: ar ? -1 : 1, ArrowUp: -1, ArrowLeft: ar ? 1 : -1 };
    let next = active;
    if (e.key in keys) next = (active + keys[e.key] + fleet.length) % fleet.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = fleet.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    document.getElementById(`lg-fleet-tab-${fleet[next].id}`)?.focus();
  };
  return <div className="lg-fleet">
    <div className="lg-fleet-tabs" role="tablist" aria-label={c.flLabel} aria-orientation="vertical">
      {fleet.map((f, i) => <button key={f.id} id={`lg-fleet-tab-${f.id}`} type="button" role="tab" aria-selected={i === active} aria-controls="lg-fleet-panel"
        tabIndex={i === active ? 0 : -1} className="lg-fleet-tab" onClick={() => setActive(i)} onKeyDown={onKey}>
        <span>{f[locale][0]}</span>
        <span className={`lg-fleet-line is-${f.line}`}>{f.line === 'dayana' ? 'Dayana' : ar ? 'المملكة والخليج' : 'KSA · GCC'}</span>
      </button>)}
    </div>
    <div id="lg-fleet-panel" role="tabpanel" aria-labelledby={`lg-fleet-tab-${v.id}`} className="lg-fleet-panel" tabIndex={0}>
      <AnimatePresence mode="wait" initial={false}>
        <m.div key={v.id} className="lg-fleet-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
          <div className="lg-fleet-media"><PhotoImg photo={v.photo} sizes="(min-width: 1000px) 62vw, 100vw" /></div>
          <div className="lg-fleet-body">
            <span className={`az-vehicle-tag az-tag-${v.line}`}>{c.flLine[v.line]}</span>
            <h3>{name}</h3>
            <p>{text}</p>
            <div className="lg-fleet-actions">
              <Link href={v.href} className="az-text-link">{c.details}<span className="sr-only"> — {name}</span><ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link>
              <Link href={`/logistics/request-quote?service=${v.service}&equipment=${encodeURIComponent(v.equipment)}`} className="az-btn az-btn-primary az-btn-sm">{c.flQuote}<span className="sr-only"> — {name}</span><ArrowRight size={15} aria-hidden="true" className="az-flip" /></Link>
            </div>
          </div>
        </m.div>
      </AnimatePresence>
    </div>
  </div>;
}

export function LogisticsHub() {
  const { locale } = useLocale();
  const c = C[locale];
  const [feature, ...supporting] = c.tr;
  return <Layout closingCta={false}>
    {/* Hero: a shipment's journey in real photography (LogisticsScene) behind the existing copy */}
    <LogisticsScene label={c.scene}
      shots={[
        { photo: 'jeddahPort', label: c.shots[0], icon: <Stamp size={16} aria-hidden="true" /> },
        { photo: 'semiOpenRoad', label: c.shots[1], icon: <Truck size={16} aria-hidden="true" /> },
        { photo: 'warehouseAisle', label: c.shots[2], icon: <Warehouse size={16} aria-hidden="true" /> },
      ]}
      foot={<div className="lg-scene-meta">
        <span className="lg-hero-place"><MapPin size={15} aria-hidden="true" />{c.place}</span>
        <a href="#lg-services" className="lg-scroll"><span>{c.scroll}</span><ArrowDown size={16} aria-hidden="true" /></a>
      </div>}>
      <div className="az-container lg-hero-inner">
        <Breadcrumbs light items={[{ href: '/', label: c.crumbs[0] }, { label: c.crumbs[1] }]} />
        <span className="lg-hero-logo" data-hero-item="eyebrow"><BrandLogo division="logistics" sizes="(max-width: 520px) 220px, 300px" /></span>
        <p className="az-eyebrow az-eyebrow-light" data-hero-item="eyebrow">{c.eyebrow}</p>
        <h1 id="lg-hero-title"><SplitWords text={c.h1} start={1} /></h1>
        <p className="lg-hero-lead" data-hero-item="text">{c.lead}</p>
        <div className="az-hero-actions">
          <Link href="/logistics/request-quote" className="az-btn az-btn-primary az-btn-lg" data-hero-item="cta">{c.quote}<ArrowRight size={17} aria-hidden="true" className="az-flip" /></Link>
          <Link href="/contact" className="az-btn az-btn-outline-light az-btn-lg" data-hero-item="cta">{c.explore}</Link>
        </div>
      </div>
    </LogisticsScene>

    {/* Three service pillars (customs featured) */}
    <section id="lg-services" className="az-section-tight lg-pillars" aria-labelledby="lg-pill-title">
      <div className="az-container">
        <p className="az-eyebrow">{c.pillEyebrow}</p>
        <h2 id="lg-pill-title" className="lg-pill-title">{c.pillTitle}</h2>
        <div className="lg-pill-wrap">
        <span className="lg-pill-rail" data-scrub-line="x" aria-hidden="true" />
        <ul className="lg-pill-grid" data-stagger>
          {c.pillars.map(([t, s, cta, href, photo], i) => <li key={href} className={`lg-pill ${i === 0 ? 'is-featured' : ''}`}>
            <div className="lg-pill-media"><PhotoImg photo={photo} sizes={i === 0 ? '(min-width: 1000px) 50vw, 100vw' : '(min-width: 1000px) 25vw, 100vw'} /></div>
            <div className="lg-pill-body">
              {i === 0 && <span className="lg-pill-flag">{c.featured}</span>}
              <h3>{t}</h3>
              <p>{s}</p>
              <Link href={href} className="lg-pill-link">{cta}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
            </div>
          </li>)}
        </ul>
        </div>
      </div>
    </section>

    {/* Customs clearance (flagship) */}
    <section id="lg-customs" className="az-section az-dark lg-customs" aria-labelledby="lg-cu-title">
      <div className="az-container">
        <SectionHead light eyebrow={c.cuEyebrow} title={c.cuTitle} text={c.cuText} id="lg-cu-title" />
        <div className="lg-cu-groups" data-stagger>
          {CU_GROUPS.map((idx, g) => <div key={g} className="lg-cu-group">
            <h3>{c.cuGroups[g]}</h3>
            <ul className="lg-cu-branches">
              {idx.map(i => { const [t, href] = c.branches[i]; return <li key={href}><Link href={href} className="lg-cu-branch"><span>{t}</span><ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link></li>; })}
            </ul>
          </div>)}
        </div>
        <div className="lg-cu-actions">
          {c.cuButtons.map(([t, href], i) => <Link key={href} href={href} className={`az-btn ${i === 0 ? 'az-btn-primary az-btn-lg' : 'az-btn-outline-light'}`}>{t}{i === 0 && <ArrowRight size={17} aria-hidden="true" className="az-flip" />}</Link>)}
        </div>
        <p className="lg-cu-note"><ShieldCheck size={17} aria-hidden="true" />{c.cuNote}</p>
      </div>
    </section>

    {/* Transportation (flagship) */}
    <section id="lg-transport" className="az-section lg-transport" aria-labelledby="lg-tr-title">
      <div className="az-container">
        <SectionHead eyebrow={c.trEyebrow} title={c.trTitle} text={c.trText} id="lg-tr-title" />
        <article className="lg-tr-feature">
          <div className="lg-tr-media" data-img-reveal><PhotoImg photo={feature[4]} sizes="(min-width: 1000px) 62vw, 100vw" /></div>
          <div className="lg-tr-body" data-reveal>
            <h3>{feature[0]}</h3>
            <p>{feature[1]}</p>
            <Link href={feature[3]} className="az-text-link">{feature[2]}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
          </div>
        </article>
        <div className="lg-tr-support">
          {supporting.map(([t, s, cta, href, photo], i) => <article key={t} className={`lg-tr-card ${i === 0 ? 'is-wide' : 'is-tall'}`}>
            <div className="lg-tr-card-media" data-img-reveal><PhotoImg photo={photo} sizes="(min-width: 1000px) 40vw, 100vw" /></div>
            <div className="lg-tr-card-body" data-reveal>
              <h3>{t}</h3>
              <p>{s}</p>
              <Link href={href} className="az-text-link">{cta}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
            </div>
          </article>)}
        </div>
        <div className="lg-inline-cta">
          <Link href="/logistics/request-quote" className="az-btn az-btn-navy">{c.discuss}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </section>

    {/* Warehousing */}
    <section id="lg-warehousing" className="az-section az-dark lg-warehousing" aria-labelledby="lg-wh-title">
      <div className="az-container lg-wh-grid">
        <div className="lg-wh-media" data-img-reveal>
          <PhotoImg photo="warehouseAisle" sizes="(min-width: 1000px) 50vw, 100vw" />
          <span className="lg-wh-badge"><Clock size={16} aria-hidden="true" />{c.whOps}</span>
        </div>
        <div className="lg-wh-body">
          <SectionHead light eyebrow={c.whEyebrow} title={c.whTitle} id="lg-wh-title" />
          <p className="az-lead" data-reveal>{c.whText}</p>
          <ol className="lg-wh-cities" data-stagger>
            {warehouseCities.map((city, i) => <li key={city.id}>
              <Link href={`/logistics/warehousing-${city.id}`} className="lg-wh-city"><Warehouse size={17} aria-hidden="true" />{city[locale]}</Link>
              <span className="lg-wh-region">{city.region[locale]}</span>
              <span className="lg-wh-tag"><ThermometerSnowflake size={14} aria-hidden="true" />{c.whTemp}</span>
            </li>)}
          </ol>
          <p className="lg-wh-note">{c.whNote}</p>
          <Link href="/logistics/warehousing" className="az-btn az-btn-primary">{c.whCta}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </section>

    {/* Customs & freight */}
    <section id="lg-freight" className="az-section lg-freight" aria-labelledby="lg-fr-title">
      <div className="az-container">
        <SectionHead eyebrow={c.frEyebrow} title={c.frTitle} text={c.frText} id="lg-fr-title" />
        <ul className="lg-fr-grid" data-stagger>
          {freightMain.map(([path, photo]) => { const e = catalogByPath[path]; return <li key={path} className="lg-fr-card">
            <div className="lg-fr-media"><PhotoImg photo={photo} sizes="(min-width: 1000px) 25vw, (min-width: 640px) 50vw, 100vw" /></div>
            <div className="lg-fr-body">
              <h3>{e[locale].name}</h3>
              <p>{e[locale].short}</p>
              <div className="lg-fr-actions">
                <Link href={path} className="lg-fr-link">{c.details}<span className="sr-only"> — {e[locale].name}</span><ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link>
                <Link href={`/logistics/request-quote?service=${path.split('/').pop()}`} className="lg-fr-quote">{c.frQuote}<span className="sr-only"> — {e[locale].name}</span></Link>
              </div>
            </div>
          </li>; })}
        </ul>
        <ul className="lg-fr-more" data-stagger>
          {freightMore.map(([path, Icon]) => { const e = catalogByPath[path]; return <li key={path} className="lg-fr-more-item">
            <Link href={path} className="lg-fr-row">
              <span className="lg-fr-icon"><Icon size={20} aria-hidden="true" /></span>
              <span className="lg-fr-row-text"><b>{e[locale].name}</b><span>{e[locale].short}</span></span>
              <ArrowUpRight size={18} aria-hidden="true" className="az-flip" />
            </Link>
            <Link href={`/logistics/request-quote?service=${path.split('/').pop()}`} className="lg-fr-quote">{c.frQuote}<span className="sr-only"> — {e[locale].name}</span></Link>
          </li>; })}
        </ul>
        <p className="lg-fr-note"><ShieldCheck size={18} aria-hidden="true" />{c.frNote}</p>
      </div>
    </section>

    {/* Fleet & equipment */}
    <section className="az-section lg-fleet-section" aria-labelledby="lg-fl-title">
      <div className="az-container">
        <SectionHead eyebrow={c.flEyebrow} title={c.flTitle} text={c.flText} id="lg-fl-title" />
        <FleetShowcase />
        <p className="tv-note">{c.flNote}</p>
      </div>
    </section>

    {/* Why */}
    <section className="az-section lg-why" aria-labelledby="lg-why-title">
      <div className="az-container lg-why-grid">
        <SectionHead eyebrow={c.whyEyebrow} title={c.whyTitle} id="lg-why-title" />
        <div>
        <ol className="lg-why-list" data-stagger>
          {c.why.map(([t, s], i) => { const Icon = [Layers, Wrench, Route, MapPin][i]; return <li key={t}>
            <span className="lg-why-icon"><Icon size={20} aria-hidden="true" /></span>
            <div><h3>{t}</h3><p>{s}</p></div>
          </li>; })}
        </ol>
        <Link href="/logistics/industries" className="az-text-link lg-why-more">{c.industriesTitle}: {c.industriesCta}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </section>

    {/* Compare services: one table, names and summaries from the service catalog */}
    <section className="az-section is-surface lg-compare" aria-labelledby="lg-cmp-title">
      <div className="az-container">
        <SectionHead eyebrow={c.cmpEyebrow} title={c.cmpTitle} text={c.cmpText} id="lg-cmp-title" />
        <div className="lg-cmp-wrap" data-reveal>
          <table className="lg-cmp" role="table">
            <caption className="sr-only">{c.cmpCaption}</caption>
            <thead role="rowgroup"><tr role="row">{c.cmpCols.map(h => <th key={h} scope="col" role="columnheader">{h}</th>)}</tr></thead>
            <tbody role="rowgroup">
              {hubCompare.map(r => { const e = catalogByPath[r.path][locale]; return <tr key={r.path} role="row">
                <th scope="row" role="rowheader"><Link href={r.path}>{e.name}<ArrowUpRight size={15} aria-hidden="true" className="az-flip" /></Link></th>
                <td role="cell" data-label={c.cmpCols[1]}>{e.short}</td>
                <td role="cell" data-label={c.cmpCols[2]}>{r.where[locale]}</td>
              </tr>; })}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* Process */}
    <section className="az-section az-dark lg-process" aria-labelledby="lg-how-title">
      <div className="az-container">
        <SectionHead light eyebrow={c.howEyebrow} title={c.howTitle} id="lg-how-title" />
        <ol className="tv-steps">
          <span className="tv-steps-line" data-scrub-line="x" aria-hidden="true" />
          {c.how.map(([t, s], i) => <li key={t} data-reveal><span className="tv-step-n">{n2(i)}</span><h3>{t}</h3><p>{s}</p></li>)}
        </ol>
        <div className="tv-process-cta">
          <Link href="/logistics/request-quote" className="az-btn az-btn-primary az-btn-lg">{c.howCta}<ArrowRight size={17} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </section>

    {/* Questions and answers: answer-first, fully visible (same words as the FAQPage schema) */}
    <section className="az-section lg-faq" aria-labelledby="lg-faq-title">
      <div className="az-container">
        <SectionHead eyebrow={c.faqEyebrow} title={c.faqTitle} id="lg-faq-title" />
        <div className="lg-faq-list" data-stagger>
          {hubFaqs.map(f => <div key={f.q.en} className="lg-faq-item"><h3>{f.q[locale]}</h3><p>{f.a[locale]}</p></div>)}
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="tv-final lg-final" aria-labelledby="lg-final-title">
      <div className="tv-final-media" aria-hidden="true"><PhotoImg photo="warehouseFloor" sizes="100vw" parallax /></div>
      <div className="az-container tv-final-inner" data-reveal>
        <p className="az-eyebrow az-eyebrow-light">{c.finalEyebrow}</p>
        <h2 id="lg-final-title">{c.finalTitle}</h2>
        <p>{c.finalText}</p>
        <div className="az-hero-actions">
          <Link href="/logistics/request-quote" className="az-btn az-btn-primary az-btn-lg">{c.quote}<ArrowRight size={17} aria-hidden="true" className="az-flip" /></Link>
          <Link href="/contact" className="az-btn az-btn-outline-light az-btn-lg">{c.contact}</Link>
        </div>
      </div>
    </section>
  </Layout>;
}
