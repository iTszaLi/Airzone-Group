// Repeatable Lighthouse / Core Web Vitals audit of the key pages, on mobile and desktop.
//
//   node qa/lighthouse.mjs                      serve the production build and audit the default pages
//   node qa/lighthouse.mjs --url=http://host:port   audit a server that is already running
//   --pages=home,contact   page names from qa/pages.mjs (default: home, logistics-hub, customs-clearance, request-quote, contact)
//   --locales=en,ar        languages to audit (default: en)
//   --form=mobile|desktop  one form factor only (default: both)
//   --runs=3               runs per page; the median run (by performance score) is reported
//   --no-fail              always exit 0 (otherwise exit 1 when a budget in lighthouse-budgets.json fails)
//
// Reports go to qa-reports/lighthouse/<timestamp>/: an HTML report per page and form factor,
// plus summary.md and summary.json. Lab numbers vary between runs and machines; compare
// trends on the same machine and confirm field data (CrUX / Search Console) after launch.
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { LOCALIZED } from './pages.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const [key, value = 'true'] = a.replace(/^--/, '').split('=');
  return [key, value];
}));
const budgets = JSON.parse(await fs.readFile(path.join(here, 'lighthouse-budgets.json'), 'utf8'));
const pageNames = (args.pages || 'home,logistics-hub,customs-clearance,request-quote,contact').split(',');
const locales = (args.locales || 'en').split(',');
const forms = args.form ? [args.form] : ['mobile', 'desktop'];
const runs = Math.max(1, Number(args.runs) || 1);
const targets = LOCALIZED.filter(p => pageNames.includes(p.name) && locales.includes(p.locale));
if (!targets.length) throw new Error(`No pages match --pages=${pageNames} --locales=${locales}`);

// Google's Core Web Vitals bands (TBT stands in for INP in the lab).
const BANDS = { lcpMs: [2500, 4000], cls: [0.1, 0.25], tbtMs: [200, 600] };
const rate = (metric, value) => (value <= BANDS[metric][0] ? 'good' : value <= BANDS[metric][1] ? 'needs improvement' : 'poor');
const limit = (rule, form) => (typeof rule === 'object' ? rule[form] : rule);

async function startServer() {
  const port = Number(process.env.QA_LH_PORT || 4311);
  const child = spawn(process.execPath, [path.resolve(here, '../../artifacts/airzone-group/scripts/serve.mjs')], {
    env: { ...process.env, PORT: String(port) }, stdio: 'ignore',
  });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(base + '/')).ok) return { base, stop: () => child.kill() }; } catch { /* not up yet */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  child.kill();
  throw new Error('The production server did not start. Run `pnpm run build` first, or pass --url.');
}

const server = args.url ? { base: args.url.replace(/\/$/, ''), stop: () => {} } : await startServer();
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = path.resolve(here, '../qa-reports/lighthouse', stamp);
await fs.mkdir(outDir, { recursive: true });

// chrome-launcher's default --disable-features list also turns off RenderDocument, which
// real Chrome keeps on. Without it, headless Chrome held back the homepage's first paint
// to ~2.5 s in most runs (observed 18 Oct 2026), and the simulated LCP jumped to ~39 s.
// This list replaces the default one: the same features, minus RenderDocument.
const disabledFeatures = ['Translate', 'OptimizationHints', 'MediaRouter', 'DialMediaRouteProvider', 'CalculateNativeWinOcclusion',
  'InterestFeedContentSuggestions', 'CertificateTransparencyComponentUpdater', 'AutofillServerCommunication', 'PrivacySandboxSettings4'];
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-first-run', '--disable-extensions', `--disable-features=${disabledFeatures.join(',')}`] });
const rows = [];
try {
  for (const target of targets) {
    for (const form of forms) {
      const results = [];
      for (let r = 0; r < runs; r++) {
        const result = await lighthouse(server.base + target.url, {
          port: chrome.port, output: ['html', 'json'], logLevel: 'error',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        }, form === 'desktop' ? desktopConfig : undefined);
        results.push(result);
      }
      results.sort((a, b) => (a.lhr.categories.performance.score ?? 0) - (b.lhr.categories.performance.score ?? 0));
      const median = results[Math.floor(results.length / 2)];
      const { lhr } = median;
      const slug = `${target.name}-${target.locale}-${form}`;
      await fs.writeFile(path.join(outDir, `${slug}.html`), median.report[0]);
      const score = key => Math.round((lhr.categories[key]?.score ?? 0) * 100);
      const audit = key => lhr.audits[key]?.numericValue ?? NaN;
      const row = {
        page: target.url, form,
        performance: score('performance'), accessibility: score('accessibility'),
        bestPractices: score('best-practices'), seo: score('seo'),
        lcpMs: Math.round(audit('largest-contentful-paint')), cls: Number(audit('cumulative-layout-shift').toFixed(3)),
        tbtMs: Math.round(audit('total-blocking-time')), fcpMs: Math.round(audit('first-contentful-paint')),
        report: `${slug}.html`, failures: [],
      };
      for (const [key, rule] of Object.entries(budgets.categories)) {
        const value = row[key === 'best-practices' ? 'bestPractices' : key];
        if (value < limit(rule, form)) row.failures.push(`${key} ${value} < ${limit(rule, form)}`);
      }
      for (const [key, rule] of Object.entries(budgets.metrics)) {
        if (row[key] > limit(rule, form)) row.failures.push(`${key} ${row[key]} > ${limit(rule, form)}`);
      }
      rows.push(row);
      console.log(`${row.failures.length ? 'FAIL' : 'ok  '}  ${form.padEnd(7)} ${target.url.padEnd(32)} perf ${row.performance}  a11y ${row.accessibility}  bp ${row.bestPractices}  seo ${row.seo}  LCP ${row.lcpMs}ms (${rate('lcpMs', row.lcpMs)})  CLS ${row.cls} (${rate('cls', row.cls)})  TBT ${row.tbtMs}ms (${rate('tbtMs', row.tbtMs)})${row.failures.length ? '  <- ' + row.failures.join('; ') : ''}`);
    }
  }
} finally {
  try { await chrome.kill(); } catch { /* Windows can refuse to delete the temp profile */ }
  server.stop();
}

const table = [
  '| Page | Form | Perf | A11y | BP | SEO | LCP | CLS | TBT | Budget |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map(r => `| ${r.page} | ${r.form} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.lcpMs} ms (${rate('lcpMs', r.lcpMs)}) | ${r.cls} (${rate('cls', r.cls)}) | ${r.tbtMs} ms (${rate('tbtMs', r.tbtMs)}) | ${r.failures.length ? r.failures.join('; ') : 'pass'} |`),
];
await fs.writeFile(path.join(outDir, 'summary.md'), `# Lighthouse audit ${stamp}\n\nServer: ${server.base} · runs per page: ${runs} (median reported)\n\n${table.join('\n')}\n`);
await fs.writeFile(path.join(outDir, 'summary.json'), JSON.stringify({ stamp, base: server.base, runs, budgets, rows }, null, 2));
const failed = rows.filter(r => r.failures.length).length;
console.log(`\n${rows.length - failed} of ${rows.length} audits within budget. Reports: ${outDir}`);
if (failed && args['no-fail'] !== 'true') process.exitCode = 1;
