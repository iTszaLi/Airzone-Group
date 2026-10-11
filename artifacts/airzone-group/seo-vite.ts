import fs from 'node:fs/promises';
import path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';

/** HTML handling only: Vite continues serving modules, CSS, assets and HMR. */
export function seoPlugin(): Plugin {
  const middleware = (server: ViteDevServer) => {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url || '/', 'http://localhost');
      const p = url.pathname;
      if (/^\/(?:@|src\/|node_modules\/|assets\/|__|api\/)/.test(p) || (path.extname(p) && !['/robots.txt', '/sitemap.xml'].includes(p))) return next();
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      try {
        const mod = await server.ssrLoadModule('/src/entry-server.tsx');
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        res.setHeader('X-Robots-Tag', 'noindex, follow');
        if (p === '/robots.txt' || p === '/sitemap.xml') {
          res.setHeader('Content-Type', p === '/robots.txt' ? 'text/plain; charset=utf-8' : 'application/xml; charset=utf-8');
          return res.end(p === '/robots.txt' ? mod.robots(true) : mod.sitemap());
        }
        const known = mod.metadata(p).known;
        const template = await fs.readFile(path.join(server.config.root, 'index.html'), 'utf8');
        const html = mod.pageHtml(template, p, mod.render(p), true);
        res.statusCode = known ? 200 : 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(req.method === 'HEAD' ? '' : await server.transformIndexHtml(p, html));
      } catch (error) { server.ssrFixStacktrace(error as Error); next(error); }
    });
  };
  return { name: 'airzone-seo-html', configureServer: middleware };
}
