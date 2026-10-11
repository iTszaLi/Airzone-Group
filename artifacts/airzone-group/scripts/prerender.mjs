import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = await import(path.join(root, 'dist/server/entry-server.js'));
const dir = path.join(root, 'dist/public');
const template = await fs.readFile(path.join(dir, 'index.html'), 'utf8');
const routes = app.allRoutes();
for (const route of routes) {
  const destination = path.join(dir, route, 'index.html');
  await fs.mkdir(path.dirname(destination), { recursive: true });
  // Private shells never contain server-rendered user data.
  const privatePath = /^\/(?:ar\/)?(?:admin|portal|sign-in|sign-up)(?:\/|$)/.test(route);
  await fs.writeFile(destination, app.pageHtml(template, route, privatePath ? '' : app.render(route)));
}
await fs.writeFile(path.join(dir, '404.html'), app.pageHtml(template, '/404', app.render('/404')));
await fs.writeFile(path.join(dir, 'robots.txt'), app.robots());
await fs.writeFile(path.join(dir, 'sitemap.xml'), app.sitemap());
await fs.writeFile(path.join(root, 'dist/server/routes.json'), JSON.stringify(routes));
console.log(`Prerendered ${routes.length} bilingual route documents; sitemap includes ${app.indexableRoutes().length} indexable URLs.`);
