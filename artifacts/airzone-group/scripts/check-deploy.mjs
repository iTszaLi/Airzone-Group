// Smoke test for a deployed site (Vercel, Replit or the local server), read-only: GET requests only.
//   pnpm --filter @workspace/airzone-group run check:deploy -- https://your-deployment.vercel.app
// Checks every prerendered page, the redirects, the 404 page, robots/sitemap/llms.txt, caching and
// security headers, and the API health endpoint. Run it after `pnpm run build` (it reads dist/server).
// Vercel preview deployments behind Deployment Protection need VERCEL_AUTOMATION_BYPASS_SECRET set.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const base = (process.argv.slice(2).find(arg => /^https?:\/\//.test(arg)) || '').replace(/\/+$/, '');
if (!base) { console.error('Usage: node scripts/check-deploy.mjs https://deployment-url'); process.exit(2); }
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/server');
const routes = JSON.parse(await fs.readFile(path.join(dist, 'routes.json'), 'utf8'));
const redirects = JSON.parse(await fs.readFile(path.join(dist, 'redirects.json'), 'utf8').catch(() => '{}'));
const headers = process.env.VERCEL_AUTOMATION_BYPASS_SECRET ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET } : {};

const failures = [];
let checks = 0;
const expect = (condition, message) => { checks++; if (!condition) failures.push(message); };
const get = url => fetch(base + url, { redirect: 'manual', headers });
const target = res => { const loc = res.headers.get('location'); return loc ? new URL(loc, base + '/').pathname : null; };
async function pool(items, worker, size = 6) {
  const queue = [...items];
  await Promise.all(Array.from({ length: size }, async () => { while (queue.length) await worker(queue.shift()); }));
}

await pool(routes, async route => {
  const res = await get(route);
  expect(res.status === 200 && /text\/html/.test(res.headers.get('content-type') || ''), `${route} → ${res.status} ${res.headers.get('content-type')}`);
  const noindex = /^\/(?:ar\/)?(?:admin|portal|sign-in|sign-up)(?:\/|$)/.test(route);
  if (noindex) expect(/noindex/.test(res.headers.get('x-robots-tag') || ''), `${route}: missing X-Robots-Tag noindex`);
  if (route !== '/' && route !== '/ar/') {
    const slash = await get(route + '/');
    expect([301, 308].includes(slash.status) && target(slash) === route, `${route}/ → ${slash.status} ${target(slash)}`);
  }
});
for (const [from, to] of Object.entries(redirects)) {
  const res = await get(from);
  expect([301, 308].includes(res.status) && target(res) === to, `${from} → ${res.status} ${target(res)} (expected ${to})`);
}
const ar = await get('/ar');
expect([301, 308].includes(ar.status) && target(ar) === '/ar/', `/ar → ${ar.status} ${target(ar)}`);

const missing = await get('/this-page-does-not-exist');
const missingBody = await missing.text();
expect(missing.status === 404 && /<html/i.test(missingBody), `unknown page → ${missing.status}`);
expect(/noindex/.test(missing.headers.get('x-robots-tag') || ''), '404 page: missing X-Robots-Tag noindex');

for (const [file, type] of [['/robots.txt', 'text/plain'], ['/sitemap.xml', 'xml'], ['/llms.txt', 'text/plain'], ['/site.webmanifest', 'json']]) {
  const res = await get(file);
  expect(res.status === 200 && (res.headers.get('content-type') || '').includes(type), `${file} → ${res.status} ${res.headers.get('content-type')}`);
}

const home = await get('/');
const html = await home.text();
for (const name of ['x-content-type-options', 'referrer-policy', 'permissions-policy']) expect(home.headers.get(name), `/ missing ${name}`);
expect(home.headers.get('content-security-policy') || home.headers.get('content-security-policy-report-only'), '/ missing Content-Security-Policy(-Report-Only)');
const asset = html.match(/\/assets\/[^"']+-[A-Za-z0-9_-]{8}\.(?:js|css)/)?.[0];
expect(asset, 'no hashed asset found on /');
if (asset) {
  const res = await get(asset);
  expect(res.status === 200 && /immutable/.test(res.headers.get('cache-control') || ''), `${asset} → ${res.status} cache-control ${res.headers.get('cache-control')}`);
}

const health = await get('/api/healthz');
const body = await health.json().catch(() => null);
expect(health.status === 200 && body?.status === 'ok', `/api/healthz → ${health.status} ${JSON.stringify(body)}`);

console.log(`${base}: ${checks} checks, ${failures.length} failed`);
for (const failure of failures.slice(0, 40)) console.log(`  ✗ ${failure}`);
process.exitCode = failures.length ? 1 : 0;
