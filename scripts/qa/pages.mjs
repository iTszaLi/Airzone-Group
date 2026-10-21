// Key pages shared by the QA suites. Each English path has an Arabic twin under /ar.
export const PAGES = [
  { name: 'home', path: '/' },
  { name: 'logistics-hub', path: '/logistics' },
  { name: 'customs-clearance', path: '/logistics/customs-clearance' },
  { name: 'warehousing', path: '/logistics/warehousing' },
  { name: 'transportation', path: '/logistics/transportation' },
  { name: 'air-freight', path: '/logistics/air-freight' },
  { name: 'request-quote', path: '/logistics/request-quote' },
  { name: 'track', path: '/track' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
  { name: 'travel', path: '/travel' },
];

/** Arabic twin of an English path: "/" -> "/ar/", "/about" -> "/ar/about". */
export const arPath = path => (path === '/' ? '/ar/' : `/ar${path}`);

/** Both language versions of every key page. */
export const LOCALIZED = PAGES.flatMap(p => [
  { ...p, locale: 'en', url: p.path, lang: 'en', dir: 'ltr' },
  { ...p, locale: 'ar', url: arPath(p.path), lang: 'ar', dir: 'rtl' },
]);

// Hide the analytics consent banner so it never covers content in screenshots.
export const CONSENT = { key: 'airzone-analytics-consent', value: 'denied' };
