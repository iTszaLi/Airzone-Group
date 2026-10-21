import { travelFaqs } from '@/config/travel-content';
import { businessContacts } from '../config/business-contacts';
import { logisticsContent } from '../config/logistics-content';
import { pillarPages } from '../config/pillars';
import { travelOverviewAr } from '../config/page-localization';
import { catalogByPath, gccCountries } from '../config/service-catalog';
import { hubFaqs } from '../config/logistics-hub-geo';
import { logisticsFooterPhone } from '../config/business-contacts';
import { routeInfo } from './route-info';

// User-selected target hostname. Publishing/DNS/TLS must be verified separately.
export const siteOrigin = 'https://airzonegroup.com';
export type Locale = 'en' | 'ar';
type Copy = [string, string];
export type Page = { en: Copy; ar: Copy; indexable: boolean; updated?: string };
const page = (en: Copy, ar: Copy, indexable = true): Page => ({ en, ar, indexable });
export const pages: Record<string, Page> = {
  '/': page(['Airzone Group | Logistics & Transportation in Saudi Arabia', 'Logistics across Saudi Arabia and the GCC: customs clearance support, road and heavy transport, warehousing, air and sea freight. Request a quote from Airzone.'], ['مجموعة إيرزون | خدمات لوجستية ونقل في السعودية', 'خدمات لوجستية في المملكة ودول الخليج: دعم التخليص الجمركي، والنقل البري والثقيل، والتخزين، والشحن الجوي والبحري. اطلب عرض سعر من إيرزون.']),
  '/logistics': page(['Logistics Services in Saudi Arabia & the GCC | Airzone', 'Airzone Logistics: customs clearance, road and heavy transport, warehousing, air and sea freight and exhibition logistics across Saudi Arabia and the GCC.'], ['الخدمات اللوجستية في السعودية ودول الخليج | إيرزون', 'إيرزون للخدمات اللوجستية: التخليص الجمركي والنقل البري والثقيل والتخزين والشحن الجوي والبحري ولوجستيات المعارض في المملكة ودول الخليج.']),
  '/travel': page(['Airzone Travel & Tourism | Holidays & Travel from Riyadh', 'Holidays, honeymoons, family trips and corporate travel planned from Riyadh: flights, hotels, transfers and visa assistance, confirmed in a written proposal.'], ['إيرزون للسفر والسياحة | عطلات وسفر أعمال من الرياض', 'عطلات وشهر عسل ورحلات عائلية وسفر شركات بتخطيط من الرياض. طيران وفنادق وتنقلات ومساعدة في التأشيرات، مع تأكيد الأسعار في عرض مكتوب واضح.']),
  '/travel/corporate-travel': page(['Corporate Travel Assistance in Riyadh | Airzone', 'Coordinate business journeys, flight options, hotel arrangements and traveller requirements with Airzone Travel & Tourism in Riyadh.'], ['خدمات سفر الشركات في الرياض | إيرزون', 'نسّق رحلات العمل وخيارات الطيران وترتيبات الفنادق ومتطلبات المسافرين مع فريق إيرزون للسفر والسياحة في الرياض.']),
  '/destinations': page(['Holiday Destinations & Travel Ideas | Airzone Travel', 'Explore destination ideas and discuss dates, departure cities, accommodation and travel preferences with the Airzone Travel & Tourism team.'], ['وجهات العطلات وأفكار السفر | إيرزون', 'استكشف أفكار الوجهات وناقش مواعيد السفر ومدن المغادرة والإقامة وتفضيلات رحلتك مع فريق إيرزون للسفر والسياحة.']),
  '/about': page(['About Airzone Group | Logistics in Saudi Arabia & GCC', 'Airzone Group is a Saudi group with two businesses: Airzone Logistics (customs, transport, warehousing, freight across the GCC) and Airzone Travel & Tourism.'], ['عن مجموعة إيرزون | خدمات لوجستية في السعودية والخليج', 'مجموعة إيرزون مجموعة سعودية تضم نشاطين: إيرزون للخدمات اللوجستية (الجمارك والنقل والتخزين والشحن في المملكة والخليج) وإيرزون للسفر والسياحة.']),
  '/contact': page(['Contact Airzone Group | Logistics Enquiries & Quotes', 'Contact Airzone Group about transportation, warehousing, local delivery or customs coordination, or reach the separate travel team. Send an enquiry online.'], ['تواصل مع مجموعة إيرزون | استفسارات الخدمات اللوجستية', 'تواصل مع مجموعة إيرزون بشأن النقل أو التخزين أو التوصيل المحلي أو تنسيق الجمارك، أو مع فريق السفر المستقل. أرسل استفسارك عبر الموقع.']),
  '/locations': page(['Logistics Service Locations in Saudi Arabia | Airzone', 'Temperature-controlled warehousing in Riyadh, Dammam, Jeddah and Jubail, with road transportation across Saudi Arabia and the GCC.'], ['مواقع الخدمات اللوجستية في السعودية | إيرزون', 'تخزين متحكم بحرارته في الرياض والدمام وجدة والجبيل، مع نقل بري داخل المملكة وفي دول مجلس التعاون الخليجي.']),
  '/privacy': page(['Privacy Notice | Airzone Group', 'Read how Airzone Group handles enquiry information and optional analytics choices, and how to contact the relevant business about privacy.'], ['إشعار الخصوصية | مجموعة إيرزون', 'اطّلع على كيفية التعامل مع معلومات الاستفسارات وخيارات التحليلات الاختيارية والتواصل مع القسم المعني بشأن الخصوصية.']),
  '/terms': page(['Website Terms | Airzone Group', 'Read the terms for using the Airzone Group website. Service arrangements, availability, charges and shipment requirements are confirmed separately.'], ['شروط استخدام الموقع | مجموعة إيرزون', 'اطّلع على شروط استخدام موقع مجموعة إيرزون. تُؤكَّد ترتيبات الخدمات والتوافر والتكاليف ومتطلبات الشحن بشكل منفصل.']),
};
const travel: Record<string, [string, string]> = {
  flights: ['Flight Assistance', 'المساعدة في حجز الرحلات الجوية'],
  'holiday-packages': ['Holiday Planning', 'تخطيط العطلات'],
  'international-tours': ['International Travel Planning', 'تخطيط السفر الدولي'],
  'domestic-tours': ['Domestic Travel Planning', 'تخطيط السفر الداخلي'],
  hotels: ['Hotel Arrangement Assistance', 'المساعدة في ترتيبات الفنادق'],
  'airport-transfers': ['Airport Transfer Enquiries', 'استفسارات النقل من وإلى المطار'],
  'visa-assistance': ['Visa Assistance Enquiries', 'استفسارات المساعدة في التأشيرات'],
  umrah: ['Umrah Travel Enquiries', 'استفسارات رحلات العمرة'],
};
for (const [slug, [en, ar]] of Object.entries(travel)) {
  pages[`/travel/${slug}`] = page([`${en} | Airzone Travel & Tourism`, `Discuss ${en.toLowerCase()}, dates and traveller requirements with Airzone Travel & Tourism. Arrangements are confirmed for each enquiry.`],
    [`${ar} | إيرزون للسفر والسياحة`, `ناقش ${ar} ومواعيد السفر ومتطلبات المسافرين مع إيرزون للسفر والسياحة. يُؤكَّد التوافر والترتيبات لكل استفسار.`],
    !['visa-assistance', 'umrah'].includes(slug));
}
/** Visible breadcrumb labels of the travel service pages (Arabic labels come from travelOverviewAr). */
const travelCrumbsEn: Record<string, string> = {
  '/travel/flights': 'Flights', '/travel/holiday-packages': 'Holiday packages', '/travel/international-tours': 'International tours',
  '/travel/domestic-tours': 'Domestic tours', '/travel/hotels': 'Hotels', '/travel/airport-transfers': 'Airport transfers',
};
for (const [path, data] of Object.entries(logisticsContent)) {
  pages[path] = { en: [`${data.en.title} | Airzone Logistics`, shorten(data.en.intro)], ar: [`${data.ar.title} | إيرزون للخدمات اللوجستية`, shorten(data.ar.intro)], indexable: true, updated: data.updatedAt };
}
// Search titles and descriptions for the content-driven service pages: they name the verified
// target country without inventing a local office and are written to fit search snippets.
const serviceSearch: Record<string, { en: Copy; ar: Copy }> = {
  '/logistics/gcc-transportation': {
    en: ['GCC Transportation Services & Cross-Border Freight | Airzone', 'Road freight between Saudi Arabia and the UAE, Kuwait, Qatar, Bahrain and Oman: full truckloads and commercial cargo, with each route confirmed per shipment.'],
    ar: ['خدمات النقل البري الخليجي والشحن عبر الحدود | إيرزون', 'شحن بري بين المملكة والإمارات والكويت وقطر والبحرين وعُمان: شحنات كاملة وبضائع تجارية، مع تأكيد كل مسار لكل شحنة.'],
  },
  '/logistics/heavy-transport': {
    en: ['Heavy Transport, Flatbed & Curtain-Side Trailers | Airzone', 'Heavy transport in Saudi Arabia and the GCC: heavy-duty trucks with flatbed and curtain-side trailers for machinery, steel, building materials and large cargo.'],
    ar: ['النقل الثقيل والمقطورات المسطحة وجانبية الستائر | إيرزون', 'النقل الثقيل في المملكة ودول الخليج: شاحنات ثقيلة بمقطورات مسطحة وجانبية الستائر للمعدات والحديد ومواد البناء والبضائع الكبيرة.'],
  },
  '/logistics/dayana-local-delivery': {
    en: ['Dayana Local Delivery Services in Saudi Arabia | Airzone', 'Dayana local delivery by Airzone Group: 5-metre and 7-metre trucks and vans for city distribution, store replenishment and business deliveries.'],
    ar: ['خدمات Dayana للتوصيل المحلي في السعودية | إيرزون', 'التوصيل المحلي عبر Dayana من مجموعة إيرزون: شاحنات بطول 5 و7 أمتار وعربات فان للتوزيع داخل المدن وتزويد المتاجر وتوصيل الشركات.'],
  },
  '/logistics/freight-forwarding': {
    en: ['Freight Forwarding Saudi Arabia | Airzone Logistics', 'Freight forwarding coordinated by Airzone Logistics: multi-leg road, sea and air shipments to and from Saudi Arabia, planned with customs and delivery.'],
    ar: ['تنسيق الشحن في السعودية | إيرزون للخدمات اللوجستية', 'تنسيق الشحن من إيرزون للخدمات اللوجستية: شحنات برية وبحرية وجوية متعددة المراحل من المملكة وإليها، مخططة مع الجمارك والتوصيل.'],
  },
  '/logistics/import-export': {
    en: ['Import & Export Support Saudi Arabia | Airzone', 'Import and export support in Saudi Arabia: documents, customs steps, freight and delivery brought into one plan for commercial shipments.'],
    ar: ['دعم الاستيراد والتصدير في السعودية | إيرزون', 'دعم الاستيراد والتصدير في المملكة: المستندات والخطوات الجمركية والشحن والتوصيل ضمن خطة واحدة للشحنات التجارية.'],
  },
};
for (const [path, copy] of Object.entries(serviceSearch)) { pages[path].en = copy.en; pages[path].ar = copy.ar; }
// Data-driven logistics pages (customs, transportation, warehousing, cities, industries).
for (const pp of Object.values(pillarPages)) {
  pages[pp.path] = { en: [pp.seo.title.en, pp.seo.description.en], ar: [pp.seo.title.ar, pp.seo.description.ar], indexable: true, updated: pp.updated };
}
for (const [path, en, ar] of [
  ['/travel/enquiry', 'Travel Planning Enquiry', 'استفسار تخطيط السفر'],
  ['/callback', 'Request a Callback', 'اطلب معاودة الاتصال'],
  ['/reviews', 'Customer Feedback', 'ملاحظات العملاء'],
  ['/insights', 'Insights', 'المقالات'],
  ['/portal', 'Client Portal', 'بوابة العملاء'],
  ['/admin', 'Administration', 'الإدارة'],
  ['/sign-in', 'Sign In', 'تسجيل الدخول'],
  ['/sign-up', 'Create an Account', 'إنشاء حساب'],
]) pages[path] = page([`${en} | Airzone Group`, `${en}. Contact the relevant Airzone business for assistance.`], [`${ar} | مجموعة إيرزون`, `${ar}. تواصل مع قسم إيرزون المعني للحصول على المساعدة.`], false);

// Conversion and tracking pages that should appear in search alongside the service pages.
pages['/logistics/request-quote'] = page(
  ['Request a Logistics Quote | Airzone Logistics', 'Request a quote for road transport, warehousing, customs clearance or air and sea freight in Saudi Arabia and the GCC. Share your route, cargo and dates.'],
  ['اطلب عرض سعر لخدمات لوجستية | إيرزون', 'اطلب عرض سعر للنقل البري أو التخزين أو التخليص الجمركي أو الشحن الجوي والبحري في المملكة ودول الخليج. شاركنا المسار والبضاعة والمواعيد.']);
/**
 * Last content update of pages that do not carry their own date (data-driven pages set `updated` in
 * their config). Shown in the footer and as dateModified. Change the date when a page's content
 * changes; legal pages and forms carry no date.
 */
const contentUpdated: Record<string, string> = {
  '/': '2026-10-19', '/logistics': '2026-10-20', '/travel': '2026-10-19', '/about': '2026-10-20',
  '/contact': '2026-10-13', '/locations': '2026-10-13', '/destinations': '2026-10-13', '/travel/corporate-travel': '2026-10-13',
  ...Object.fromEntries(Object.keys(travel).map(slug => [`/travel/${slug}`, '2026-10-13'])),
};
pages['/track'] = page(
  ['Track a Shipment | Airzone Logistics', 'Track an Airzone Logistics shipment: enter your tracking number to see the latest status, route and updates available for your cargo.'],
  ['تتبع شحنة | إيرزون للخدمات اللوجستية', 'تتبّع شحنتك لدى إيرزون للخدمات اللوجستية: أدخل رقم التتبع لعرض أحدث حالة ومسار ومستجدات متاحة لشحنتك.']);

for (const [path, date] of Object.entries(contentUpdated)) if (pages[path] && !pages[path].updated) pages[path].updated = date;

function shorten(text: string) { return text.length <= 165 ? text : text.slice(0, 162).replace(/\s+\S*$/, '') + '…'; }
export { routeInfo, privateRoute } from './route-info';
export function localizedPath(path: string, locale: Locale) { return locale === 'ar' ? (path === '/' ? '/ar/' : `/ar${path}`) : path; }
export function metadata(raw: string) {
  const { locale, path } = routeInfo(raw);
  const entry = pages[path] ?? (path.startsWith('/sign-in/') ? pages['/sign-in'] : path.startsWith('/sign-up/') ? pages['/sign-up'] : undefined);
  const [title, description] = entry?.[locale] ?? (locale === 'ar' ? ['الصفحة غير موجودة | إيرزون', 'لم نعثر على الصفحة المطلوبة.'] : ['Page Not Found | Airzone Group', 'The requested page could not be found.']);
  return { locale, path, title, description, indexable: !!entry?.indexable, known: !!entry, canonical: entry ? siteOrigin + localizedPath(path, locale) : null, updated: entry?.updated };
}
export const indexableRoutes = () => Object.entries(pages).filter(([, p]) => p.indexable).flatMap(([p]) => [p, localizedPath(p, 'ar')]);
export const allRoutes = () => Object.keys(pages).flatMap(p => [p, localizedPath(p, 'ar')]);

/** Service areas: cities for warehousing, GCC states for road freight, otherwise Saudi Arabia. */
function serviceArea(path: string) {
  if (path === '/logistics/gcc-transportation' || path === '/logistics/heavy-transport') return gccCountries.map(c => ({ '@type': 'Country', name: c.en }));
  return { '@type': 'Country', name: 'Saudi Arabia' };
}

export function schemas(raw: string) {
  const m = metadata(raw);
  if (!m.indexable) return [];
  const groupId = `${siteOrigin}/#organization`, logisticsId = `${siteOrigin}/logistics#organization`, travelId = `${siteOrigin}/travel#organization`;
  // The business whose team wrote the page: travel pages, logistics pages, otherwise the group.
  const authorId = (path: string) => (/^\/(travel|destinations)(\/|$)/.test(path) ? travelId : /^\/(logistics|locations|track)(\/|$)/.test(path) ? logisticsId : groupId);
  const entity = (division: 'logistics' | 'travel') => {
    const c = businessContacts[division];
    const addressParts = c.officeAddress?.split(',').map(p => p.trim()) || [];
    const cityPostal = addressParts.at(-2)?.match(/^(.*?)\s+(\d{5})$/);
    const address = c.officeAddress ? {
      '@type': 'PostalAddress', streetAddress: cityPostal ? addressParts.slice(0, -2).join(', ') : c.officeAddress,
      ...(cityPostal ? { addressLocality: cityPostal[1], postalCode: cityPostal[2] } : {}),
      addressCountry: c.country === 'Saudi Arabia' ? 'SA' : c.country,
    } : undefined;
    return { '@type': division === 'travel' ? 'TravelAgency' : 'Organization', '@id': division === 'travel' ? travelId : logisticsId,
      name: c.name, url: `${siteOrigin}/${division}`, parentOrganization: { '@id': groupId },
      ...(division === 'logistics' ? { legalName: 'Airzone Logistics Services Est', areaServed: gccCountries.map(g => ({ '@type': 'Country', name: g.en })) } : {}),
      logo: `${siteOrigin}/assets/brand/airzone-${division}-logo-${division === 'travel' ? 640 : 1280}.png`,
      contactPoint: c.emails.map(email => ({ '@type': 'ContactPoint', email, contactType: 'customer enquiries' })),
      ...(c.socialLinks.length ? { sameAs: c.socialLinks.map(l => l.url) } : {}),
      ...(division === 'travel' ? { telephone: c.phone?.href.replace(/^tel:/, ''), address } : {}),
    };
  };
  const graph: object[] = [
    { '@type': 'Organization', '@id': groupId, name: 'Airzone Group', alternateName: 'مجموعة إيرزون', url: siteOrigin, logo: `${siteOrigin}/assets/brand/airzone-group-logo-1200.png`,
      description: m.locale === 'ar' ? 'مجموعة أعمال سعودية تضم إيرزون للخدمات اللوجستية وإيرزون للسفر والسياحة.' : 'Saudi business group comprising Airzone Logistics and Airzone Travel & Tourism.',
      subOrganization: [{ '@id': logisticsId }, { '@id': travelId }] },
    entity('logistics'), entity('travel'),
    // Site name shown by Google above the URL; alternate names cover the short and Arabic forms.
    { '@type': 'WebSite', '@id': `${siteOrigin}/#website`, url: siteOrigin, name: 'Airzone Group', alternateName: ['Airzone', 'مجموعة إيرزون'], publisher: { '@id': groupId }, inLanguage: ['en', 'ar'] },
    { '@type': m.path === '/about' ? 'AboutPage' : 'WebPage', '@id': `${m.canonical}#page`, url: m.canonical, name: m.title, description: m.description, inLanguage: m.locale, isPartOf: { '@id': `${siteOrigin}/#website` },
      ...(m.updated ? { dateModified: m.updated } : {}),
      author: { '@id': authorId(m.path), '@type': authorId(m.path) === travelId ? 'TravelAgency' : 'Organization', name: authorId(m.path) === travelId ? businessContacts.travel.name : authorId(m.path) === logisticsId ? businessContacts.logistics.name : 'Airzone Group' },
      publisher: { '@id': groupId },
      ...(m.path === '/about' ? { about: { '@id': groupId }, mainEntity: { '@id': groupId } } : {}) },
  ];
  const data = logisticsContent[m.path as keyof typeof logisticsContent]?.[m.locale];
  if (data) {
    graph.push({ '@type': 'Service', '@id': `${m.canonical}#service`, name: data.title, description: data.intro, provider: { '@id': logisticsId }, areaServed: serviceArea(m.path), url: m.canonical,
      ...(m.path === '/logistics/dayana-local-delivery' ? { brand: { '@type': 'Brand', name: 'Dayana' } } : {}) });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: m.locale === 'ar' ? 'الرئيسية' : 'Home', item: siteOrigin + localizedPath('/', m.locale) },
      { '@type': 'ListItem', position: 2, name: m.locale === 'ar' ? 'الخدمات اللوجستية' : 'Logistics services', item: siteOrigin + localizedPath('/logistics', m.locale) },
      { '@type': 'ListItem', position: 3, name: catalogByPath[m.path]?.[m.locale].name ?? data.title, item: m.canonical },
    ] });
    graph.push({ '@type': 'FAQPage', '@id': `${m.canonical}#faq`, mainEntity: data.faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) });
  }
  const pp = pillarPages[m.path];
  if (pp) {
    const home = { '@type': 'ListItem', position: 1, name: m.locale === 'ar' ? 'الرئيسية' : 'Home', item: siteOrigin + localizedPath('/', m.locale) };
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [home,
      ...pp.parents.map((x, i) => ({ '@type': 'ListItem', position: i + 2, name: x.label[m.locale], item: siteOrigin + localizedPath(x.href, m.locale) })),
      { '@type': 'ListItem', position: pp.parents.length + 2, name: pp.crumb[m.locale], item: m.canonical }] });
    if (pp.service) graph.push({ '@type': 'Service', '@id': `${m.canonical}#service`, name: pp.service[m.locale], description: m.description, provider: { '@id': logisticsId }, url: m.canonical,
      ...(pp.area ? { areaServed: pp.area.names.map(name => pp.area!.type === 'City' ? { '@type': 'City', name, containedInPlace: { '@type': 'Country', name: 'Saudi Arabia' } } : { '@type': 'Country', name }) } : {}) });
    if (pp.faqs.length) graph.push({ '@type': 'FAQPage', '@id': `${m.canonical}#faq`, mainEntity: pp.faqs.map(f => ({ '@type': 'Question', name: f.q[m.locale], acceptedAnswer: { '@type': 'Answer', text: f.a[m.locale] } })) });
  }
  if (m.path === '/logistics') graph.push({ '@type': 'FAQPage', '@id': `${m.canonical}#faq`, mainEntity: hubFaqs.map(f => ({ '@type': 'Question', name: f.q[m.locale], acceptedAnswer: { '@type': 'Answer', text: f.a[m.locale] } })) });
  if (m.path === '/travel' || m.path === '/travel/corporate-travel') {
    // Same labels as the visible breadcrumbs (the landing page capitalises "Tourism").
    const travelLabel = m.locale === 'ar' ? 'السفر والسياحة' : m.path === '/travel' ? 'Travel & Tourism' : 'Travel & tourism';
    const corporateLabel = m.locale === 'ar' ? travelOverviewAr['/travel/corporate-travel'][0] : 'Corporate travel';
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: m.locale === 'ar' ? 'الرئيسية' : 'Home', item: siteOrigin + localizedPath('/', m.locale) },
      { '@type': 'ListItem', position: 2, name: travelLabel, item: siteOrigin + localizedPath('/travel', m.locale) },
      ...(m.path !== '/travel' ? [{ '@type': 'ListItem', position: 3, name: corporateLabel, item: m.canonical }] : []),
    ] });
    if (m.path === '/travel') graph.push({ '@type': 'FAQPage', '@id': `${m.canonical}#faq`, mainEntity: travelFaqs[m.locale].map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
    if (m.path !== '/travel') graph.push({ '@type': 'Service', '@id': `${m.canonical}#service`, name: corporateLabel, description: m.description, provider: { '@id': travelId }, url: m.canonical });
  }
  // Other pages with visible breadcrumbs: the trail between Home and the page, labels as shown on the page.
  const LOGISTICS: [string, string, string] = ['/logistics', 'Logistics services', 'الخدمات اللوجستية'];
  const trails: Record<string, { parents: [string, string, string][]; label: [string, string] }> = {
    '/locations': { parents: [], label: ['Service locations', 'مواقع الخدمة'] },
    '/about': { parents: [], label: ['About', 'من نحن'] },
    '/contact': { parents: [], label: ['Contact', 'اتصل بنا'] },
    '/logistics': { parents: [], label: ['Logistics services', 'الخدمات اللوجستية'] },
    '/logistics/request-quote': { parents: [LOGISTICS], label: ['Request a quote', 'اطلب عرض سعر'] },
    '/track': { parents: [], label: ['Track a shipment', 'تتبع شحنة'] },
    ...Object.fromEntries(Object.entries(travelCrumbsEn).map(([path, en]) => [path, { parents: [['/travel', 'Travel & tourism', 'السفر والسياحة']], label: [en, travelOverviewAr[path]?.[0] ?? en] }])),
  };
  const trail = trails[m.path];
  if (trail) graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: m.locale === 'ar' ? 'الرئيسية' : 'Home', item: siteOrigin + localizedPath('/', m.locale) },
    ...trail.parents.map(([href, en, ar], i) => ({ '@type': 'ListItem', position: i + 2, name: m.locale === 'ar' ? ar : en, item: siteOrigin + localizedPath(href, m.locale) })),
    { '@type': 'ListItem', position: trail.parents.length + 2, name: trail.label[m.locale === 'ar' ? 1 : 0], item: m.canonical },
  ] });
  return [{ '@context': 'https://schema.org', '@graph': graph }];
}

/**
 * /llms.txt: a short machine-readable map of the site for AI assistants (https://llmstxt.org), built
 * from the same titles and descriptions as the pages, so it never drifts from them.
 */
export function llmsTxt() {
  const entry = (path: string) => {
    const p = pages[path];
    if (!p?.indexable) return null;
    return `- [${p.en[0].replace(/ \| .*$/, '')}](${siteOrigin}${path}): ${p.en[1]}`;
  };
  const indexable = Object.keys(pages).filter(p => pages[p].indexable);
  const logistics = ['/logistics', ...indexable.filter(p => p.startsWith('/logistics/') && p !== '/logistics/request-quote').sort()];
  const travelPaths = ['/travel', ...indexable.filter(p => p.startsWith('/travel/')).sort(), '/destinations'];
  const company = ['/about', '/contact', '/locations', '/logistics/request-quote', '/track'];
  const section = (title: string, paths: string[]) => `## ${title}\n\n${paths.map(entry).filter(Boolean).join('\n')}\n`;
  const l = businessContacts.logistics, t = businessContacts.travel;
  return [
    '# Airzone Group',
    '',
    '> Saudi business group with two businesses: Airzone Logistics (Airzone Logistics Services Est: customs clearance support, road and heavy transport, temperature-controlled warehousing in Riyadh, Dammam, Jeddah and Jubail, air and sea freight and exhibition logistics, with road transportation across the GCC) and Airzone Travel & Tourism (holidays, flights, hotels and corporate travel from Riyadh).',
    '',
    `Every page is also published in Arabic under /ar/ (for example ${siteOrigin}/ar/logistics). Customs declarations in Saudi Arabia are lodged on ZATCA's Fasah platform by the importer or a licensed customs broker; Airzone coordinates documents and procedures and is not a customs authority.`,
    '',
    section('Airzone Logistics', logistics),
    section('Airzone Travel & Tourism', travelPaths),
    section('Company', company),
    '## Contacts',
    '',
    `- Airzone Logistics: ${l.emails.join(', ')}; phone ${logisticsFooterPhone.label}; WhatsApp ${l.whatsappNumber}`,
    `- Airzone Travel & Tourism: ${t.emails.join(', ')}; phone ${t.phone?.label ?? ''}; WhatsApp ${t.whatsappNumber}; office ${t.officeAddress ?? ''}`,
    '',
  ].join('\n');
}
