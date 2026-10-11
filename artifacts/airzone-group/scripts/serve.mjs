import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/public');
const routes = new Set(JSON.parse(await fs.readFile(path.join(root, '../server/routes.json'), 'utf8')));
const origin = 'https://airzonegroup.com';
const port = Number(process.env.PORT);
if (!port || !Number.isInteger(port)) throw new Error('A valid PORT is required');
const mime = { '.html': 'text/html; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const csp = "default-src 'self'; script-src 'self' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'self' https://replit.com https://*.replit.com https://*.replit.dev";
const compress = promisify(gzip);
const compressed = new Map();
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', origin);
    const p = decodeURIComponent(url.pathname);
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].split(':')[0].toLowerCase();
    if (host === 'www.airzonegroup.com') {
      res.writeHead(301, { Location: origin + url.pathname + url.search });
      return res.end();
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    // Monitor first; review actual auth/analytics origins before enforcing.
    res.setHeader(process.env.CSP_ENFORCE === 'true' ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only', csp);
    if (process.env.ENABLE_HSTS === 'true' && host === 'airzonegroup.com' && req.headers['x-forwarded-proto'] === 'https') res.setHeader('Strict-Transport-Security', 'max-age=300');
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
    if (p === '/ar') { res.writeHead(301, { Location: '/ar/' }); return res.end(); }
    const normalized = p.replace(/\/+$/, '') || '/';
    if (p.endsWith('/') && !['/', '/ar/'].includes(p) && routes.has(normalized)) {
      res.writeHead(301, { Location: normalized + url.search }); return res.end();
    }
    const route = p === '/ar/' ? p : normalized;
    const auth = route.match(/^\/(ar\/)?(sign-in|sign-up)\//);
    let file = routes.has(route) ? path.join(root, route, 'index.html') : auth ? path.join(root, auth[1] || '', auth[2], 'index.html') : path.resolve(root, '.' + p);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(400); return res.end(); }
    let status = 200;
    try { if (!(await fs.stat(file)).isFile()) throw new Error('Not a file'); }
    catch { file = path.join(root, '404.html'); status = 404; }
    if (status === 404 || /^\/(?:ar\/)?(?:admin|portal|sign-in|sign-up)(?:\/|$)/.test(route)) res.setHeader('X-Robots-Tag', 'noindex, follow');
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', file.endsWith('.html') ? 'no-cache' : /\/assets\/.*-[A-Za-z0-9_-]{8}\.(js|css)$/.test(file) ? 'public, max-age=31536000, immutable' : 'public, max-age=3600');
    res.statusCode = status;
    let content = await fs.readFile(file);
    res.setHeader('Vary', 'Accept-Encoding');
    if (/\btext\/|xml|json|svg/.test(String(res.getHeader('Content-Type'))) && content.length > 1024 && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
      if (!compressed.has(file)) compressed.set(file, await compress(content));
      content = compressed.get(file);
      res.setHeader('Content-Encoding', 'gzip');
    }
    res.setHeader('Content-Length', content.length);
    res.end(req.method === 'HEAD' ? '' : content);
  } catch { res.writeHead(400); res.end('Bad request'); }
}).listen(port, '0.0.0.0', () => console.log(`Airzone production web server listening on ${port}`));
