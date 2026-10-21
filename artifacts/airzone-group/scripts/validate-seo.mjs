import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = await import(pathToFileURL(path.join(root, 'dist/server/entry-server.js')).href);
const dir = path.join(root, 'dist/public');
const titles = new Set();
const routes = app.allRoutes();
let checkedLinks = 0, checkedImages = 0;
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
for (const route of routes) {
  const html = await fs.readFile(path.join(dir, route, 'index.html'), 'utf8');
  const m = app.metadata(route);
  const bodyText = decode((html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] || '').replace(/<script[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ''));
  const title = html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1];
  assert.equal(decode(title), m.title, `${route}: correct initial title`);
  assert(!titles.has(title), `${route}: title must be unique`); titles.add(title);
  assert.equal((html.match(/<title[\s>]/g) || []).length, 1, `${route}: one title`);
  assert.equal((html.match(/name="description"/g) || []).length, 1, `${route}: one description`);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${route}: one canonical`);
  assert(html.includes(`href="${m.canonical}"`), `${route}: self canonical`);
  assert(html.includes(`lang="${m.locale}" dir="${m.locale === 'ar' ? 'rtl' : 'ltr'}"`));
  // Indexable pages also allow full snippets and large previews in search and AI answers.
  assert(html.includes(`name="robots" content="${m.indexable ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' : 'noindex, follow'}"`));
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const schema = JSON.parse(match[1]);
    for (const node of schema['@graph'] || []) {
      if (node.name === 'Airzone Logistics') { assert.equal(node['@type'], 'Organization'); assert(!node.address && !node.telephone); }
      if (node['@type'] === 'FAQPage') for (const question of node.mainEntity) {
        assert(bodyText.includes(question.name), `${route}: FAQ question visible`);
        assert(bodyText.includes(question.acceptedAnswer.text), `${route}: FAQ answer visible`);
      }
    }
  }
  if (m.indexable) {
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${route}: exactly one H1`);
    const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1];
    if (m.locale === 'ar') assert(/[\u0600-\u06ff]/.test(h1), `${route}: Arabic H1`);
    assert(html.includes('hreflang="en"') && html.includes('hreflang="ar"'));
    assert(!html.includes('hreflang="x-default"'));
  }
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const url = decode(match[1]);
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    const target = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
    const known = app.metadata(target).known;
    if (!known) await fs.access(path.join(dir, target));
    checkedLinks++;
  }
  for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
    const url = decode(match[1]);
    if (url.startsWith('/')) { await fs.access(path.join(dir, url)); checkedImages++; }
  }
}
const xml = await fs.readFile(path.join(dir, 'sitemap.xml'), 'utf8');
assert(xml.startsWith('<?xml')); assert(xml.includes('xmlns:xhtml='));
const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(locations.length, app.indexableRoutes().length);
assert.equal(new Set(locations).size, locations.length);
for (const url of locations) { assert(url.startsWith('https://airzonegroup.com/')); assert(app.metadata(new URL(url).pathname).indexable); }
assert(!xml.includes('replit.dev') && !xml.includes('/admin') && !xml.includes('/callback') && !xml.includes('/travel/enquiry'));
assert.equal(app.leadEvents('travel', 'travel').map(e => e.name).join(','), 'form_submit,generate_lead,travel_enquiry_submit');
assert.equal(app.leadEvents('callback', 'group').map(e => e.name).join(','), 'form_submit,generate_lead,callback_request_submit');
assert.equal(app.serviceCategory('name@example.com personal message'), 'general-logistics');
assert.equal(app.serviceCategory('ATA Carnet assistance'), 'ata-carnet');
assert.equal(app.serviceCategory('__proto__'), 'general-logistics');
assert.equal(app.serviceCategory('constructor'), 'general-logistics');
assert.equal(app.departmentDivision('Corporate Travel'), 'travel');
assert.equal(app.departmentDivision('Customs Clearance'), 'logistics');
assert(!JSON.stringify(app.leadEvents('logistics', 'logistics', 'name@example.com')).includes('@'));
console.log(`PASS: ${routes.length} HTML documents; ${locations.length} sitemap URLs; ${checkedLinks} internal links; ${checkedImages} local images; schema/locale/H1/canonical checks and privacy-safe lead-event construction.`);
