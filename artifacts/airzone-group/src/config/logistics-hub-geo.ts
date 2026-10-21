/**
 * Logistics hub: the service comparison and the question-led FAQ (also emitted as FAQPage schema, so
 * the visible text and the structured data are the same words). Every answer restates facts already
 * published on the site (hub copy, service catalog, customs and warehousing notes); nothing here is a
 * new claim. Keep it in step with those sources when they change.
 */
import type { Locale } from '@/lib/i18n';

type L = Record<Locale, string>;

/** Service comparison rows: names and summaries come from the service catalog; "where" from its coverage copy. */
export const hubCompare: { path: string; where: L }[] = [
  { path: '/logistics/customs-clearance', where: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' } },
  { path: '/logistics/gcc-transportation', where: { en: 'Saudi Arabia and the GCC', ar: 'المملكة ودول الخليج' } },
  { path: '/logistics/heavy-transport', where: { en: 'Saudi Arabia and the GCC', ar: 'المملكة ودول الخليج' } },
  { path: '/logistics/dayana-local-delivery', where: { en: 'Local and regional routes in Saudi Arabia', ar: 'مسارات محلية وإقليمية داخل المملكة' } },
  { path: '/logistics/warehousing', where: { en: 'Riyadh, Dammam, Jeddah and Jubail', ar: 'الرياض والدمام وجدة والجبيل' } },
  { path: '/logistics/air-freight', where: { en: 'To and from Saudi Arabia', ar: 'من المملكة وإليها' } },
  { path: '/logistics/sea-freight', where: { en: 'To and from Saudi Arabia', ar: 'من المملكة وإليها' } },
];

export const hubFaqs: { q: L; a: L }[] = [
  {
    q: { en: 'What does Airzone Logistics do?', ar: 'ما الخدمات التي تقدمها إيرزون للخدمات اللوجستية؟' },
    a: {
      en: 'Airzone Logistics Services Est, part of Airzone Group, provides customs clearance support, road and heavy transportation, temperature-controlled warehousing, air and sea freight coordination and exhibition logistics for businesses in Saudi Arabia, with road transportation across the GCC. Local delivery runs under the Dayana name.',
      ar: 'تقدم مؤسسة إيرزون للخدمات اللوجستية، إحدى شركات مجموعة إيرزون، دعم التخليص الجمركي والنقل البري والثقيل والتخزين المتحكم بحرارته وتنسيق الشحن الجوي والبحري ولوجستيات المعارض للشركات في المملكة العربية السعودية، مع نقل بري عبر دول الخليج. ويتم التوصيل المحلي تحت اسم Dayana.',
    },
  },
  {
    q: { en: 'Does Airzone Logistics clear customs itself?', ar: 'هل تتولى إيرزون التخليص الجمركي بنفسها؟' },
    a: {
      en: 'Customs declarations in Saudi Arabia are lodged on ZATCA’s Fasah platform by the importer or a licensed customs broker. Airzone Logistics coordinates the documents and procedures, working with licensed customs brokers where required. It is not a customs authority, and certificates and permits are issued only by the competent authorities.',
      ar: 'تُقدَّم البيانات الجمركية في المملكة عبر منصة فسح التابعة لهيئة الزكاة والضريبة والجمارك من قِبل المستورد أو مخلص جمركي مرخّص. وتتولى إيرزون للخدمات اللوجستية تنسيق المستندات والإجراءات بالتعاون مع مخلصين جمركيين مرخّصين عند الحاجة، وهي ليست جهة جمركية، ولا تصدر الشهادات والتصاريح إلا عن الجهات المختصة.',
    },
  },
  {
    q: { en: 'Where does Airzone offer warehousing?', ar: 'أين توفر إيرزون خدمات التخزين؟' },
    a: {
      en: 'Temperature-controlled warehousing is available in Riyadh, Dammam, Jeddah and Jubail, with 24/7 operations. Temperature ranges, space and handling services vary by location and are confirmed for your requirement.',
      ar: 'يتوفر التخزين المتحكم بحرارته في الرياض والدمام وجدة والجبيل مع عمليات على مدار الساعة. وتختلف نطاقات الحرارة والمساحة وخدمات المناولة حسب الموقع وتُؤكَّد وفق متطلباتك.',
    },
  },
  {
    q: { en: 'Which countries does Airzone reach by road?', ar: 'إلى أي دول تنقل إيرزون الشحنات براً؟' },
    a: {
      en: 'Road transportation runs within Saudi Arabia and across GCC routes to the United Arab Emirates, Kuwait, Qatar, Bahrain and Oman. Each route is confirmed for the shipment.',
      ar: 'يشمل النقل البري المسارات داخل المملكة العربية السعودية وعبر دول الخليج إلى الإمارات العربية المتحدة والكويت وقطر والبحرين وعُمان، ويُؤكَّد كل مسار وفق الشحنة.',
    },
  },
  {
    q: { en: 'What vehicles and trailers are available?', ar: 'ما المركبات والمقطورات المتاحة؟' },
    a: {
      en: 'Heavy-duty trucks; flatbed, curtain-side and other commercial trailers; specialised transport for heavy and oversized cargo; and, under Dayana, 5-metre and 7-metre delivery trucks and vans. Vehicles are matched to the shipment, and availability is confirmed for each booking and may include partner-operated equipment.',
      ar: 'شاحنات ثقيلة، ومقطورات مسطحة وجانبية الستائر ومقطورات تجارية أخرى، ونقل متخصص للحمولات الثقيلة وكبيرة الحجم، وتحت اسم Dayana شاحنات توصيل بطول 5 و7 أمتار وعربات فان. وتُختار المركبات وفق الشحنة، ويُؤكَّد التوفر لكل حجز وقد يشمل معدات يشغّلها شركاء.',
    },
  },
  {
    q: { en: 'How do I get a quotation?', ar: 'كيف أحصل على عرض سعر؟' },
    a: {
      en: 'Send the origin, destination, cargo type, dimensions or weight and preferred dates through the quote form. The team reviews the route, transport mode and handling requirements and prepares a written quotation based on the information supplied.',
      ar: 'أرسل المنشأ والوجهة ونوع البضاعة والأبعاد أو الوزن والتواريخ المفضلة عبر نموذج طلب عرض السعر. ويراجع الفريق المسار ووسيلة النقل ومتطلبات المناولة ويعد عرض سعر مكتوباً بناءً على المعلومات المقدمة.',
    },
  },
];
