import { businessContacts } from '../config/business-contacts';
import { logisticsContent } from '../config/logistics-content';
import { travelOverviewAr } from '../config/page-localization';

// User-selected target hostname. Publishing/DNS/TLS must be verified separately.
export const siteOrigin = 'https://airzonegroup.com';
export type Locale = 'en' | 'ar';
type Copy = [string, string];
export type Page = { en: Copy; ar: Copy; indexable: boolean; updated?: string };
const page = (en: Copy, ar: Copy, indexable = true): Page => ({ en, ar, indexable });
export const pages: Record<string, Page> = {
  '/': page(['Airzone Group | Logistics & Travel in Saudi Arabia', 'Explore customs clearance, ATA Carnet assistance, exhibition logistics and freight coordination with Airzone Logistics, alongside specialist travel planning.'], ['مجموعة إيرزون | الخدمات اللوجستية والسفر في السعودية', 'تعرّف على دعم التخليص الجمركي ودفاتر ATA Carnet ولوجستيات المعارض وتنسيق الشحن مع إيرزون، إلى جانب خدمات تخطيط السفر.']),
  '/logistics': page(['Logistics & Customs Support in Saudi Arabia | Airzone', 'Discuss customs documentation, ATA Carnet assistance, exhibition freight and import/export coordination for Saudi shipments with Airzone Logistics.'], ['الخدمات اللوجستية والتخليص الجمركي في السعودية | إيرزون', 'ناقش مستندات التخليص الجمركي ودفاتر ATA Carnet وشحن المعارض وتنسيق الاستيراد والتصدير للشحنات المرتبطة بالسعودية مع إيرزون.']),
  '/travel': page(['Travel Planning in Riyadh | Airzone Travel & Tourism', 'Plan flights, holidays, accommodation and business travel with Airzone Travel & Tourism. Contact the Al Malaz office in Riyadh to discuss your journey.'], ['تخطيط السفر في الرياض | إيرزون للسفر والسياحة', 'خطط للرحلات الجوية والعطلات والإقامة وسفر الأعمال مع إيرزون للسفر والسياحة. تواصل مع مكتب الملز في الرياض لمناقشة رحلتك.']),
  '/travel/corporate-travel': page(['Corporate Travel Assistance in Riyadh | Airzone', 'Coordinate business journeys, flight options, hotel arrangements and traveller requirements with Airzone Travel & Tourism in Riyadh.'], ['خدمات سفر الشركات في الرياض | إيرزون', 'نسّق رحلات العمل وخيارات الطيران وترتيبات الفنادق ومتطلبات المسافرين مع فريق إيرزون للسفر والسياحة في الرياض.']),
  '/destinations': page(['Holiday Destinations & Travel Ideas | Airzone Travel', 'Explore destination ideas and discuss dates, departure cities, accommodation and travel preferences with the Airzone Travel & Tourism team.'], ['وجهات العطلات وأفكار السفر | إيرزون', 'استكشف أفكار الوجهات وناقش مواعيد السفر ومدن المغادرة والإقامة وتفضيلات رحلتك مع فريق إيرزون للسفر والسياحة.']),
  '/about': page(['About Airzone Group | Logistics and Travel Businesses', 'Meet Airzone Group: a parent corporate identity connecting Airzone Logistics and Airzone Travel & Tourism, with distinct specialist teams and contacts.'], ['عن مجموعة إيرزون | أعمال الخدمات اللوجستية والسفر', 'تعرّف على مجموعة إيرزون التي تجمع إيرزون للخدمات اللوجستية وإيرزون للسفر والسياحة، مع فرق متخصصة وبيانات تواصل منفصلة.']),
  '/contact': page(['Contact Airzone Logistics & Travel Teams | Airzone Group', 'Contact the right Airzone business for customs and freight coordination or travel planning. Use the enquiry form or the division-specific contact details.'], ['تواصل مع فرق الشحن والسفر | مجموعة إيرزون', 'تواصل مع قسم إيرزون المناسب لتنسيق التخليص والشحن أو تخطيط السفر، عبر نموذج الاستفسار أو بيانات التواصل الخاصة بكل قسم.']),
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
  pages[`/travel/${slug}`] = page([`${en} | Airzone Travel & Tourism`, `Discuss ${en.toLowerCase()}, dates and traveller requirements with Airzone Travel & Tourism. Availability and arrangements are confirmed for each enquiry.`],
    [`${ar} | إيرزون للسفر والسياحة`, `ناقش ${ar} ومواعيد السفر ومتطلبات المسافرين مع إيرزون للسفر والسياحة. يُؤكَّد التوافر والترتيبات لكل استفسار.`],
    !['visa-assistance', 'umrah'].includes(slug));
}
for (const [path, data] of Object.entries(logisticsContent)) {
  pages[path] = { en: [`${data.en.title} | Airzone Logistics`, shorten(data.en.intro)], ar: [`${data.ar.title} | إيرزون للخدمات اللوجستية`, shorten(data.ar.intro)], indexable: true, updated: data.updatedAt };
}
// Search titles identify the verified target country without inventing a local office.
const serviceSearchTitles: Record<string, [string, string]> = {
  '/logistics/customs-clearance': ['Customs Clearance Saudi Arabia & Riyadh | Airzone', 'دعم التخليص الجمركي في السعودية والرياض | إيرزون'],
  '/logistics/ata-carnet': ['ATA Carnet Assistance Saudi Arabia | Airzone Logistics', 'دعم دفاتر ATA Carnet في السعودية | إيرزون'],
  '/logistics/exhibition-event-logistics': ['Exhibition & Event Logistics Saudi Arabia | Airzone', 'لوجستيات المعارض والفعاليات في السعودية | إيرزون'],
  '/logistics/freight-forwarding': ['Freight Forwarding Saudi Arabia | Airzone Logistics', 'تنسيق الشحن في السعودية | إيرزون للخدمات اللوجستية'],
  '/logistics/import-export': ['Import & Export Support Saudi Arabia | Airzone', 'دعم الاستيراد والتصدير في السعودية | إيرزون'],
  '/logistics/air-freight': ['Air Freight Coordination Saudi Arabia | Airzone', 'تنسيق الشحن الجوي في السعودية | إيرزون'],
  '/logistics/sea-freight': ['Sea Freight Coordination Saudi Arabia | Airzone', 'تنسيق الشحن البحري في السعودية | إيرزون'],
};
for (const [path, titles] of Object.entries(serviceSearchTitles)) { pages[path].en[0] = titles[0]; pages[path].ar[0] = titles[1]; }
for (const [path, en, ar] of [
  ['/logistics/road-transportation', 'Road Transportation Enquiries', 'استفسارات النقل البري'],
  ['/logistics/warehousing', 'Warehousing Enquiries', 'استفسارات التخزين'],
  ['/logistics/project-cargo', 'Project Cargo Enquiries', 'استفسارات شحن المشاريع'],
  ['/logistics/request-quote', 'Request a Logistics Quote', 'اطلب عرض سعر للشحن'],
  ['/travel/enquiry', 'Travel Planning Enquiry', 'استفسار تخطيط السفر'],
  ['/callback', 'Request a Callback', 'اطلب معاودة الاتصال'],
  ['/track', 'Shipment Tracking Enquiry', 'استفسار تتبع الشحنات'],
  ['/reviews', 'Customer Feedback', 'ملاحظات العملاء'],
  ['/insights', 'Insights', 'المقالات'],
  ['/portal', 'Client Portal', 'بوابة العملاء'],
  ['/admin', 'Administration', 'الإدارة'],
  ['/sign-in', 'Sign In', 'تسجيل الدخول'],
  ['/sign-up', 'Create an Account', 'إنشاء حساب'],
]) pages[path] = page([`${en} | Airzone Group`, `${en}. Contact the relevant Airzone business for assistance.`], [`${ar} | مجموعة إيرزون`, `${ar}. تواصل مع قسم إيرزون المعني للحصول على المساعدة.`], false);

function shorten(text: string) { return text.length <= 165 ? text : text.slice(0, 162).replace(/\s+\S*$/, '') + '…'; }
export function routeInfo(raw: string) {
  const pathname = raw.split(/[?#]/)[0] || '/';
  const locale: Locale = /^\/ar(?:\/|$)/.test(pathname) ? 'ar' : 'en';
  const path = pathname.replace(/^\/ar(?=\/|$)/, '').replace(/\/+$/, '') || '/';
  return { locale, path };
}
export function localizedPath(path: string, locale: Locale) { return locale === 'ar' ? (path === '/' ? '/ar/' : `/ar${path}`) : path; }
export function metadata(raw: string) {
  const { locale, path } = routeInfo(raw);
  const entry = pages[path] ?? (path.startsWith('/sign-in/') ? pages['/sign-in'] : path.startsWith('/sign-up/') ? pages['/sign-up'] : undefined);
  const [title, description] = entry?.[locale] ?? (locale === 'ar' ? ['الصفحة غير موجودة | إيرزون', 'لم نعثر على الصفحة المطلوبة.'] : ['Page Not Found | Airzone Group', 'The requested page could not be found.']);
  return { locale, path, title, description, indexable: !!entry?.indexable, known: !!entry, canonical: entry ? siteOrigin + localizedPath(path, locale) : null, updated: entry?.updated };
}
export const indexableRoutes = () => Object.entries(pages).filter(([, p]) => p.indexable).flatMap(([p]) => [p, localizedPath(p, 'ar')]);
export const allRoutes = () => Object.keys(pages).flatMap(p => [p, localizedPath(p, 'ar')]);
export const privateRoute = (raw: string) => /^\/(?:admin|portal|sign-in|sign-up)(?:\/|$)/.test(routeInfo(raw).path);

export function schemas(raw: string) {
  const m = metadata(raw);
  if (!m.indexable) return [];
  const groupId = `${siteOrigin}/#organization`, logisticsId = `${siteOrigin}/logistics#organization`, travelId = `${siteOrigin}/travel#organization`;
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
      logo: `${siteOrigin}/assets/brand/airzone-${division}-logo@2x.png`,
      contactPoint: c.emails.map(email => ({ '@type': 'ContactPoint', email, contactType: 'customer enquiries' })),
      ...(division === 'travel' ? { telephone: c.phone?.href.replace(/^tel:/, ''), address } : {}),
    };
  };
  const graph: object[] = [
    { '@type': 'Organization', '@id': groupId, name: 'Airzone Group', url: siteOrigin, logo: `${siteOrigin}/assets/brand/airzone-group-logo@2x.png`, subOrganization: [{ '@id': logisticsId }, { '@id': travelId }] },
    entity('logistics'), entity('travel'),
    { '@type': 'WebSite', '@id': `${siteOrigin}/#website`, url: siteOrigin, name: 'Airzone Group', publisher: { '@id': groupId }, inLanguage: ['en', 'ar'] },
    { '@type': 'WebPage', '@id': `${m.canonical}#page`, url: m.canonical, name: m.title, description: m.description, inLanguage: m.locale, isPartOf: { '@id': `${siteOrigin}/#website` } },
  ];
  const data = logisticsContent[m.path as keyof typeof logisticsContent]?.[m.locale];
  if (data) {
    graph.push({ '@type': 'Service', '@id': `${m.canonical}#service`, name: data.title, description: data.intro, provider: { '@id': logisticsId }, areaServed: { '@type': 'Country', name: 'Saudi Arabia' }, url: m.canonical });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: m.locale === 'ar' ? 'الرئيسية' : 'Home', item: siteOrigin + localizedPath('/', m.locale) },
      { '@type': 'ListItem', position: 2, name: m.locale === 'ar' ? 'الخدمات اللوجستية' : 'Logistics', item: siteOrigin + localizedPath('/logistics', m.locale) },
      { '@type': 'ListItem', position: 3, name: data.title, item: m.canonical },
    ] });
    graph.push({ '@type': 'FAQPage', '@id': `${m.canonical}#faq`, mainEntity: data.faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) });
  }
  if (m.path === '/travel' || m.path === '/travel/corporate-travel') {
    const travelLabel = m.locale === 'ar' ? 'السفر والسياحة' : 'Travel & tourism';
    const corporateLabel = m.locale === 'ar' ? travelOverviewAr['/travel/corporate-travel'][0] : 'Corporate travel';
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: m.locale === 'ar' ? 'الرئيسية' : 'Home', item: siteOrigin + localizedPath('/', m.locale) },
      { '@type': 'ListItem', position: 2, name: travelLabel, item: siteOrigin + localizedPath('/travel', m.locale) },
      ...(m.path !== '/travel' ? [{ '@type': 'ListItem', position: 3, name: corporateLabel, item: m.canonical }] : []),
    ] });
    if (m.path !== '/travel') graph.push({ '@type': 'Service', '@id': `${m.canonical}#service`, name: corporateLabel, description: m.description, provider: { '@id': travelId }, url: m.canonical });
  }
  return [{ '@context': 'https://schema.org', '@graph': graph }];
}
