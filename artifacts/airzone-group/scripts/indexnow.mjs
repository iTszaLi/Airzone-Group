// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver and others) about every URL in the built
// sitemap, after a deploy. Dry run by default: it only sends with --confirm.
//   INDEXNOW_KEY=<same key as at build time> pnpm --filter @workspace/airzone-group run indexnow -- --confirm
// The key file (https://<host>/<key>.txt) is written by the build when INDEXNOW_KEY is set; it must be
// live before submitting, so run this only once the site is published on its domain.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const key = (process.env.INDEXNOW_KEY || '').trim();
if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  console.error('Set INDEXNOW_KEY to the same 8-128 character key used at build time.');
  process.exit(1);
}
const sitemap = await fs.readFile(path.join(root, 'dist/public/sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (!urls.length) { console.error('No URLs in dist/public/sitemap.xml. Build first.'); process.exit(1); }
const host = new URL(urls[0]).host;
const keyLocation = `https://${host}/${key}.txt`;

if (!process.argv.includes('--confirm')) {
  console.log(`Dry run: would submit ${urls.length} URLs for ${host} (key file ${keyLocation}). Add --confirm to send.`);
  process.exit(0);
}
const live = await fetch(keyLocation).then(async r => (r.ok ? (await r.text()).trim() : null)).catch(() => null);
if (live !== key) {
  console.error(`The key file is not live at ${keyLocation}. Publish the build with INDEXNOW_KEY set, then try again.`);
  process.exit(1);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
});
console.log(`IndexNow answered ${res.status} ${res.statusText} for ${urls.length} URLs (200 or 202 means accepted).`);
process.exit(res.ok ? 0 : 1);
