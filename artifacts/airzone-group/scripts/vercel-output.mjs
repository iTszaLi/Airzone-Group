// Writes the static half of a Vercel Build Output API (v3) directory, `.vercel/output` at the repo root,
// from the prerendered build in dist/. The routing table reproduces scripts/serve.mjs: www → apex,
// security headers, legacy and trailing-slash redirects, prerendered pages, the 404 page, and /api handed
// to the API function (written by artifacts/api-server/build-vercel.mjs).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { baseSecurityHeaders, contentSecurityPolicy, cspHeaderName } from './headers.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '../dist');
const output = path.resolve(here, '../../../.vercel/output');
const apexHost = 'airzonegroup.com';

const routes = JSON.parse(await fs.readFile(path.join(dist, 'server/routes.json'), 'utf8'));
const redirects = JSON.parse(await fs.readFile(path.join(dist, 'server/redirects.json'), 'utf8').catch(() => '{}'));

await fs.rm(output, { recursive: true, force: true });
await fs.cp(path.join(dist, 'public'), path.join(output, 'static'), { recursive: true });

const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const notApi = '(?!api(?:/|$))';
// Pages without a trailing slash; "/" and "/ar/" are the two directory-style URLs.
const pages = routes.filter(route => route !== '/' && route !== '/ar/');
for (const route of routes) {
  await fs.access(path.join(output, 'static', route, 'index.html')).catch(() => {
    throw new Error(`Prerendered page missing for ${route}`);
  });
}

const securityHeaders = {
  ...baseSecurityHeaders,
  // Unlike the Replit preview, nothing needs to frame the site on Vercel.
  'X-Frame-Options': 'SAMEORIGIN',
  [cspHeaderName(process.env.CSP_ENFORCE === 'true')]: contentSecurityPolicy("'self'"),
};
// Vercel sends HSTS itself on custom domains (max-age=63072000), so ENABLE_HSTS is not needed here.

const config = {
  version: 3,
  routes: [
    { src: '^/(.*)$', has: [{ type: 'host', value: `www.${apexHost}` }], status: 301, headers: { Location: `https://${apexHost}/$1` } },
    { src: `^/${notApi}.*$`, headers: securityHeaders, continue: true },
    // The *.vercel.app addresses duplicate the real domain; keep them out of search results.
    { src: '^/.*$', has: [{ type: 'host', value: { suf: '.vercel.app' } }], headers: { 'X-Robots-Tag': 'noindex' }, continue: true },
    { src: '^/assets/.+-[A-Za-z0-9_-]{8}\\.(?:js|css|woff2?)$', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' }, continue: true },
    { src: '^/(?:ar/)?(?:admin|portal|sign-in|sign-up)(?:/.*)?$', headers: { 'X-Robots-Tag': 'noindex, follow' }, continue: true },
    { src: '^/ar$', status: 301, headers: { Location: '/ar/' } },
    ...Object.entries(redirects).map(([from, to]) => ({ src: `^${escape(from)}/?$`, status: 301, headers: { Location: to } })),
    { src: `^/(${pages.map(page => escape(page.slice(1))).join('|')})/$`, status: 301, headers: { Location: '/$1' } },
    // Rewrites come after the filesystem check with `check: true`, the form Vercel compiles vercel.json
    // rewrites into. Each prerendered page is served from its index.html explicitly, without relying on
    // directory indexes.
    { handle: 'filesystem' },
    { src: '^/api(?:/.*)?$', dest: '/api', check: true },
    { src: '^/$', dest: '/index.html', check: true },
    { src: '^/ar/$', dest: '/ar/index.html', check: true },
    ...pages.map(page => ({ src: `^${escape(page)}$`, dest: `${page}/index.html`, check: true })),
    // Clerk's sign-in and sign-up flows use nested paths under one page.
    { src: '^/ar/(sign-in|sign-up)/.+$', dest: '/ar/$1/index.html', check: true },
    { src: '^/(sign-in|sign-up)/.+$', dest: '/$1/index.html', check: true },
    { handle: 'error' },
    { src: `^/${notApi}.*$`, status: 404, dest: '/404.html', headers: { 'X-Robots-Tag': 'noindex, follow' } },
  ],
};

await fs.writeFile(path.join(output, 'config.json'), JSON.stringify(config, null, 2) + '\n');
console.log(`Vercel output: ${routes.length} pages, ${Object.keys(redirects).length} legacy redirects → ${path.relative(process.cwd(), output)}`);
