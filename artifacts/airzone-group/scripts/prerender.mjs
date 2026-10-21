import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = await import(pathToFileURL(path.join(root, 'dist/server/entry-server.js')).href);
const dir = path.join(root, 'dist/public');
const template = (await fs.readFile(path.join(dir, 'index.html'), 'utf8'))
  .replace(/<script type="module" crossorigin src="(\/assets\/index-[^"]+\.js)"><\/script>/, '<script type="module" crossorigin fetchpriority="low" src="$1"></script>');
// Pages load on demand in the browser; load them all here so rendering is synchronous.
await app.preloadAll();
const routes = app.allRoutes();
// Preload the fonts each language paints first, so text does not reflow when
// the web font replaces the fallback (avoids layout shift). Files are hashed.
const assets = await fs.readdir(path.join(dir, 'assets'));
const font = re => assets.find(f => re.test(f));
const preload = files => files.filter(Boolean).map(f => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`).join('');
const fontPreloads = {
  en: preload([font(/^manrope-latin-wght-normal-.*\.woff2$/), font(/^dm-sans-latin-wght-normal-.*\.woff2$/)]),
  ar: preload([font(/^ibm-plex-sans-arabic-arabic-700-normal-.*\.woff2$/), font(/^ibm-plex-sans-arabic-arabic-400-normal-.*\.woff2$/)]),
};
const withFonts = (html, route) => html.replace('</head>', `${fontPreloads[/^\/ar(\/|$)/.test(route) ? 'ar' : 'en']}</head>`);
// Optional Google Search Console HTML-tag verification on the homepage. Set GOOGLE_SITE_VERIFICATION
// to the token Search Console shows (content value only); nothing is emitted when it is unset.
const verification = (process.env.GOOGLE_SITE_VERIFICATION || '').trim();
if (verification && !/^[\w-]{10,100}$/.test(verification)) throw new Error('GOOGLE_SITE_VERIFICATION must be the token only.');
// Optional Bing Webmaster Tools HTML-tag verification (BING_SITE_VERIFICATION, the msvalidate.01 value only).
const bing = (process.env.BING_SITE_VERIFICATION || '').trim();
if (bing && !/^[A-Za-z0-9]{16,64}$/.test(bing)) throw new Error('BING_SITE_VERIFICATION must be the token only.');
const verificationTags = (verification ? `<meta name="google-site-verification" content="${verification}">` : '') + (bing ? `<meta name="msvalidate.01" content="${bing}">` : '');
const withVerification = (html, route) => verificationTags && route === '/' ? html.replace('</head>', `${verificationTags}</head>`) : html;
for (const route of routes) {
  const destination = path.join(dir, route, 'index.html');
  await fs.mkdir(path.dirname(destination), { recursive: true });
  // Private shells never contain server-rendered user data.
  const privatePath = /^\/(?:ar\/)?(?:admin|portal|sign-in|sign-up)(?:\/|$)/.test(route);
  await fs.writeFile(destination, withVerification(withFonts(app.pageHtml(template, route, privatePath ? '' : app.render(route)), route), route));
}
await fs.writeFile(path.join(dir, '404.html'), withFonts(app.pageHtml(template, '/404', app.render('/404')), '/404'));
await fs.writeFile(path.join(dir, 'robots.txt'), app.robots());
await fs.writeFile(path.join(dir, 'sitemap.xml'), app.sitemap());
await fs.writeFile(path.join(dir, 'llms.txt'), app.llmsTxt());
// IndexNow (Bing, Yandex and others): the key file proves the site owns the key. Set INDEXNOW_KEY
// (8-128 letters, digits or hyphens); submit URLs after a deploy with `pnpm run indexnow -- --confirm`.
const indexNowKey = (process.env.INDEXNOW_KEY || '').trim();
if (indexNowKey) {
  if (!/^[A-Za-z0-9-]{8,128}$/.test(indexNowKey)) throw new Error('INDEXNOW_KEY must be 8-128 letters, digits or hyphens.');
  await fs.writeFile(path.join(dir, `${indexNowKey}.txt`), indexNowKey);
}
await fs.writeFile(path.join(root, 'dist/server/routes.json'), JSON.stringify(routes));
// Consolidated legacy URLs: the Node server answers with 301s; these stubs cover static hosting.
const redirects = {};
for (const [from, to] of Object.entries(app.legacyRedirects)) {
  for (const prefix of ['', '/ar']) {
    const target = prefix + to;
    redirects[prefix + from] = target;
    const stub = `<!DOCTYPE html><html lang="${prefix ? 'ar' : 'en'}"><head><meta charset="utf-8"><title>Redirecting…</title><meta name="robots" content="noindex, follow"><link rel="canonical" href="https://airzonegroup.com${target}"><meta http-equiv="refresh" content="0; url=${target}"></head><body><p><a href="${target}">${target}</a></p></body></html>`;
    await fs.mkdir(path.join(dir, prefix + from), { recursive: true });
    await fs.writeFile(path.join(dir, prefix + from, 'index.html'), stub);
  }
}
await fs.writeFile(path.join(root, 'dist/server/redirects.json'), JSON.stringify(redirects));
console.log(`Prerendered ${routes.length} bilingual route documents; sitemap includes ${app.indexableRoutes().length} indexable URLs.`);
