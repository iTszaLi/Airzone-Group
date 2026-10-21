import {
  Truck, Container, PackageCheck, PackageOpen, ThermometerSnowflake, Stamp, Boxes, Plane, Ship, FileText, Compass, Earth, FileCheck2, Route,
  type LucideIcon,
} from 'lucide-react';
import type { PhotoKey } from './photography';

/**
 * Single source for logistics service names, navigation grouping, icons and
 * illustrative photography. Page copy lives in logistics-content.ts.
 */
export type ServiceGroup = 'transport' | 'storage' | 'trade';
export type CatalogEntry = {
  path: string;
  group: ServiceGroup;
  icon: LucideIcon;
  photo: PhotoKey;
  featured?: boolean;
  en: { name: string; short: string };
  ar: { name: string; short: string };
};

export const serviceCatalog: CatalogEntry[] = [
  {
    path: '/logistics/gcc-transportation', group: 'transport', icon: Truck, photo: 'semiOpenRoad', featured: true,
    en: { name: 'GCC transportation', short: 'Full-truckload and cross-border road freight within Saudi Arabia and across the GCC.' },
    ar: { name: 'النقل البري الخليجي', short: 'نقل بالشاحنات الكاملة وشحن بري عابر للحدود داخل المملكة وفي دول مجلس التعاون.' },
  },
  {
    path: '/logistics/heavy-transport', group: 'transport', icon: Container, photo: 'flatbedTrailer', featured: true,
    en: { name: 'Heavy transport & trailers', short: 'Flatbed and curtain-side trailers, heavy-duty trucks and oversized cargo, where available.' },
    ar: { name: 'النقل الثقيل والمقطورات', short: 'مقطورات مسطحة وجانبية الستائر وشاحنات ثقيلة وشحنات كبيرة الحجم عند توفرها.' },
  },
  {
    path: '/logistics/dayana-local-delivery', group: 'transport', icon: PackageCheck, photo: 'boxVan', featured: true,
    en: { name: 'Dayana local delivery', short: '5-metre and 7-metre delivery trucks and vans for local and last-mile distribution.' },
    ar: { name: 'Dayana للتوصيل المحلي', short: 'شاحنات توصيل بطول 5 و7 أمتار وعربات فان للتوزيع المحلي والتوصيل للميل الأخير.' },
  },
  {
    path: '/logistics/warehousing', group: 'storage', icon: ThermometerSnowflake, photo: 'warehousingCover', featured: true,
    en: { name: 'Temperature-controlled warehousing', short: 'Storage in Riyadh, Dammam, Jeddah and Jubail with 24/7 operations.' },
    ar: { name: 'التخزين المبرّد والمتحكم بحرارته', short: 'تخزين في الرياض والدمام وجدة والجبيل مع عمليات على مدار الساعة.' },
  },
  {
    path: '/logistics/container-destuffing', group: 'storage', icon: PackageOpen, photo: 'containerYard',
    en: { name: 'Container destuffing & cargo handling', short: 'Unloading, counting, palletising and storage after import, and container stuffing for export.' },
    ar: { name: 'تفريغ الحاويات ومناولة البضائع', short: 'التفريغ والعدّ والتحميل على منصات والتخزين بعد الاستيراد، وتحميل الحاويات للتصدير.' },
  },
  {
    path: '/logistics/customs-clearance', group: 'trade', icon: Stamp, photo: 'customsCover', featured: true,
    en: { name: 'Customs clearance', short: 'Import, export and temporary-admission clearance, coordinated with licensed customs brokers where required.' },
    ar: { name: 'التخليص الجمركي', short: 'تخليص الواردات والصادرات والإدخال المؤقت بالتنسيق مع مخلصين جمركيين مرخّصين عند الحاجة.' },
  },
  {
    path: '/logistics/customs-documentation', group: 'trade', icon: FileCheck2, photo: 'containerYard',
    en: { name: 'Customs documentation & compliance', short: 'SABER, SASO and IECEE, SFDA and other requirements, with a document checker.' },
    ar: { name: 'المستندات الجمركية والامتثال', short: 'متطلبات سابر والهيئة السعودية للمواصفات وIECEE والهيئة العامة للغذاء والدواء وغيرها، مع أداة للمستندات.' },
  },
  {
    path: '/logistics/transportation', group: 'transport', icon: Route, photo: 'transportCover',
    en: { name: 'Transportation & fleet', short: 'The full fleet directory, temperature-controlled transport and GCC coverage.' },
    ar: { name: 'النقل والأسطول', short: 'دليل الأسطول الكامل والنقل المتحكم بحرارته والتغطية الخليجية.' },
  },
  {
    path: '/logistics/freight-forwarding', group: 'trade', icon: Boxes, photo: 'containerShip',
    en: { name: 'Freight forwarding', short: 'Multi-leg cargo coordinated from origin to destination.' },
    ar: { name: 'الشحن والتوريد', short: 'تنسيق الشحنات متعددة المراحل من المنشأ إلى الوجهة.' },
  },
  {
    path: '/logistics/import-export', group: 'trade', icon: Earth, photo: 'containerShip',
    en: { name: 'Import & export support', short: 'Documents, customs steps and freight brought into one plan.' },
    ar: { name: 'دعم الاستيراد والتصدير', short: 'المستندات وخطوات الجمارك والشحن في خطة واحدة.' },
  },
  {
    path: '/logistics/air-freight', group: 'trade', icon: Plane, photo: 'airCargoLoader',
    en: { name: 'Air freight', short: 'Import and export air cargo with documents, customs clearance and delivery.' },
    ar: { name: 'الشحن الجوي', short: 'شحن جوي للاستيراد والتصدير مع المستندات والتخليص الجمركي والتوصيل.' },
  },
  {
    path: '/logistics/sea-freight', group: 'trade', icon: Ship, photo: 'jeddahPort',
    en: { name: 'Sea freight', short: 'FCL, LCL and project cargo with port collection and customs coordination.' },
    ar: { name: 'الشحن البحري', short: 'حاويات كاملة وشحنات جزئية وشحنات مشاريع مع الاستلام من الميناء وتنسيق الجمارك.' },
  },
  {
    path: '/logistics/ata-carnet', group: 'trade', icon: FileText, photo: 'portCranes',
    en: { name: 'ATA Carnet & exhibition cargo', short: 'Temporary admission of exhibition stands, samples and equipment, and re-export.' },
    ar: { name: 'دفاتر ATA Carnet وشحنات المعارض', short: 'الإدخال المؤقت لأجنحة المعارض والعينات والمعدات ثم إعادة تصديرها.' },
  },
  {
    path: '/logistics/exhibition-event-logistics', group: 'trade', icon: Compass, photo: 'exhibitionStand',
    en: { name: 'Exhibition & trade show logistics', short: 'Freight, temporary admission, venue delivery and re-export for events.' },
    ar: { name: 'لوجستيات المعارض والفعاليات', short: 'الشحن والإدخال المؤقت والتسليم في الموقع وإعادة التصدير للفعاليات.' },
  },
];

export const catalogByPath = Object.fromEntries(serviceCatalog.map(s => [s.path, s])) as Record<string, CatalogEntry>;

export const serviceGroups: Record<ServiceGroup, { en: string; ar: string }> = {
  transport: { en: 'Transportation', ar: 'النقل' },
  storage: { en: 'Warehousing', ar: 'التخزين' },
  trade: { en: 'Customs clearance & freight', ar: 'التخليص الجمركي والشحن' },
};

/** Legacy URLs consolidated into the new service pages (served as 301s). */
export const legacyRedirects: Record<string, string> = {
  '/logistics/road-transportation': '/logistics/gcc-transportation',
  '/logistics/project-cargo': '/logistics/heavy-transport',
};

/** Saudi warehouse cities stated by the business. No street addresses are published. */
export const warehouseCities = [
  { id: 'riyadh', en: 'Riyadh', ar: 'الرياض', region: { en: 'Central Region', ar: 'المنطقة الوسطى' } },
  { id: 'dammam', en: 'Dammam', ar: 'الدمام', region: { en: 'Eastern Province', ar: 'المنطقة الشرقية' } },
  { id: 'jeddah', en: 'Jeddah', ar: 'جدة', region: { en: 'Western Region', ar: 'المنطقة الغربية' } },
  { id: 'jubail', en: 'Jubail', ar: 'الجبيل', region: { en: 'Eastern Province', ar: 'المنطقة الشرقية' } },
] as const;

export const gccCountries = [
  { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
  { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
  { en: 'Kuwait', ar: 'الكويت' },
  { en: 'Qatar', ar: 'قطر' },
  { en: 'Bahrain', ar: 'البحرين' },
  { en: 'Oman', ar: 'عُمان' },
] as const;
