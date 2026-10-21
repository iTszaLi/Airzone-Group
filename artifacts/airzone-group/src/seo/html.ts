import { allRoutes, indexableRoutes, metadata, pages, routeInfo, schemas, siteOrigin, localizedPath, llmsTxt } from './site';
export { allRoutes, indexableRoutes, metadata, llmsTxt };
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export function seoHead(raw: string, preview = false) {
  const m = metadata(raw);
  const meta = (name: string, value: string, property = false) => `<meta data-airzone-seo ${property ? 'property' : 'name'}="${name}" content="${escape(value)}">`;
  // No x-default: there is no language-selection page, and each language has its own URL.
  const alt = m.indexable ? ['en', 'ar'].map(l => `<link data-airzone-seo rel="alternate" hreflang="${l}" href="${siteOrigin}${localizedPath(m.path, l as 'en' | 'ar')}">`).join('\n') : '';
  return `<title data-airzone-seo>${escape(m.title)}</title>\n` +
    [meta('description', m.description), meta('robots', !preview && m.indexable ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' : 'noindex, follow'),
      meta('og:title', m.title, true), meta('og:description', m.description, true), meta('og:type', 'website', true),
      meta('og:site_name', 'Airzone Group', true), meta('og:locale', m.locale === 'ar' ? 'ar_SA' : 'en_US', true),
      meta('og:locale:alternate', m.locale === 'ar' ? 'en_US' : 'ar_SA', true),
      meta('twitter:card', 'summary_large_image'), meta('twitter:title', m.title), meta('twitter:description', m.description),
      meta('og:image', `${siteOrigin}/assets/brand/social-share-v2.png`, true), meta('og:image:width', '1200', true), meta('og:image:height', '630', true),
      meta('og:image:alt', 'Airzone Group logo', true), meta('twitter:image', `${siteOrigin}/assets/brand/social-share-v2.png`),
      ...(m.canonical ? [meta('og:url', m.canonical, true), `<link data-airzone-seo rel="canonical" href="${escape(m.canonical)}">`] : []),
      alt, ...schemas(raw).map(s => `<script data-airzone-seo type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`),
    ].join('\n');
}
export function pageHtml(template: string, raw: string, content: string, preview = false) {
  const { locale, path } = routeInfo(raw);
  if (path !== '/') template = template.replace(/<link\b(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>/g, '');
  return template.replace(/<html[^>]*>/, `<html lang="${locale}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}">`)
    .replace('<!--airzone-head-->', seoHead(raw, preview))
    .replace('<div id="root"></div>', `<div id="root">${content}</div>`);
}
export function sitemap() {
  const entries = Object.entries(pages).filter(([, p]) => p.indexable).flatMap(([path, p]) => ['en', 'ar'].map(locale => `<url><loc>${siteOrigin}${localizedPath(path, locale as 'en' | 'ar')}</loc>${p.updated ? `<lastmod>${p.updated}</lastmod>` : ''}${['en', 'ar'].map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${siteOrigin}${localizedPath(path, l as 'en' | 'ar')}"/>`).join('')}</url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('\n')}</urlset>`;
}
/** Search and AI-answer crawlers named explicitly (a named group replaces the * group for that bot, so it repeats the private paths). */
const ANSWER_BOTS = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'PerplexityBot', 'Perplexity-User', 'Applebot', 'Applebot-Extended', 'Google-Extended'];
const PRIVATE_PATHS = ['/admin', '/portal', '/sign-in', '/sign-up', '/api/', '/ar/admin', '/ar/portal', '/ar/sign-in', '/ar/sign-up'];
export function robots(preview = false) {
  if (preview) return 'User-agent: *\nDisallow: /\n';
  const rules = `Allow: /\n${PRIVATE_PATHS.map(p => `Disallow: ${p}`).join('\n')}`;
  return `# Search engines and AI answer engines are welcome to read and cite the public pages.\n${ANSWER_BOTS.map(b => `User-agent: ${b}`).join('\n')}\n${rules}\n\nUser-agent: *\n${rules}\n\nSitemap: ${siteOrigin}/sitemap.xml\n`;
}
