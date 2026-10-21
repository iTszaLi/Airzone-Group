// Visual regression: full-page screenshots of the key pages in English and
// Arabic, on desktop and mobile, compared with the committed baselines in
// qa/__screenshots__. Photos and video are masked (they are static assets and
// would bloat the baselines), so the comparison covers layout, type and colour.
// Refresh baselines after an intended design change: pnpm run qa:visual:update
import { test, expect } from '@playwright/test';
import { LOCALIZED } from './pages.mjs';
import { prepare, settle } from './helpers.mjs';

const MASK = '#c9ced6';

for (const pg of LOCALIZED) {
  test(`${pg.name} (${pg.locale}) matches its baseline`, async ({ page }) => {
    await prepare(page);
    await page.goto(pg.url);
    await settle(page);
    // Photos set as CSS backgrounds become flat mask colour too; gradients and text stay.
    await page.evaluate(color => {
      const layers = value => {
        const out = []; let depth = 0; let cur = '';
        for (const ch of value) {
          if (ch === '(') depth++;
          if (ch === ')') depth--;
          if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
        }
        return cur.trim() ? [...out, cur.trim()] : out;
      };
      for (const el of document.querySelectorAll('body *')) {
        const bg = getComputedStyle(el).backgroundImage;
        if (!bg.includes('url(')) continue;
        const kept = layers(bg).filter(layer => !layer.startsWith('url('));
        el.style.backgroundImage = kept.length ? kept.join(', ') : 'none';
        el.style.backgroundColor = color;
      }
    }, MASK);
    await expect(page).toHaveScreenshot(`${pg.name}-${pg.locale}.png`, {
      fullPage: true,
      mask: [page.locator('img, picture, video, canvas, iframe')],
      maskColor: MASK,
    });
  });
}
