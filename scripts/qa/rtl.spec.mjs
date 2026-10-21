// English/Arabic checks for the key pages: language and direction, hreflang
// twins, overflow, mirrored icons, left-to-right phone numbers and emails,
// links that stay in Arabic, untranslated text and the language switcher.
// Run with: pnpm run qa:rtl   (see .claude/skills/airzone-rtl-check)
import { test, expect } from '@playwright/test';
import { PAGES, arPath } from './pages.mjs';
import { prepare, settle } from './helpers.mjs';

const ORIGIN = 'https://airzonegroup.com';

// Latin-script words that are correct on Arabic pages. All-caps acronyms
// (SABER, SFDA, GCC, LED, RUH...) are always accepted; keep this list to proper
// nouns. Anything else Latin on an Arabic page is reported.
const LATIN_ALLOWED = new Set(['Dayana', 'Carnet', 'Google', 'WhatsApp', 'Unsplash', 'WebP']);

const pathnameOf = href => new URL(href, ORIGIN).pathname.replace(/(.)\/$/, '$1');

for (const p of PAGES) {
  const en = p.path;
  const ar = arPath(p.path);

  test.describe(p.name, () => {
    test('server HTML declares language, direction and hreflang twins', async ({ request }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'server HTML does not depend on the viewport');
      for (const [url, lang, dir] of [[en, 'en', 'ltr'], [ar, 'ar', 'rtl']]) {
        const html = await (await request.get(url)).text();
        const tag = html.match(/<html[^>]*>/)?.[0] ?? '';
        expect(tag, `${url} <html> tag`).toContain(`lang="${lang}"`);
        expect(tag, `${url} <html> tag`).toContain(`dir="${dir}"`);
        const alternates = Object.fromEntries([...html.matchAll(/<link[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g)].map(m => [m[1], pathnameOf(m[2])]));
        expect(alternates, `${url} hreflang links`).toEqual({ en: pathnameOf(en), ar: pathnameOf(ar) });
      }
    });

    test('pages render in the right direction without horizontal overflow', async ({ page }) => {
      await prepare(page);
      for (const [url, lang, dir] of [[en, 'en', 'ltr'], [ar, 'ar', 'rtl']]) {
        await page.goto(url);
        await settle(page);
        await expect(page.locator('html'), url).toHaveAttribute('lang', lang);
        await expect(page.locator('html'), url).toHaveAttribute('dir', dir);
        const overflow = await page.evaluate(() => {
          const width = document.documentElement.clientWidth;
          // Content inside a scrolling or clipping box (e.g. a swipeable row) cannot widen the page.
          const clipped = el => {
            for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
              if (getComputedStyle(n).overflowX !== 'visible') return true;
            }
            return false;
          };
          const wide = [...document.querySelectorAll('body *')].filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.right > width + 1 || r.left < -1) && getComputedStyle(el).position !== 'fixed' && !clipped(el);
          }).slice(0, 5).map(el => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`);
          return { scroll: document.documentElement.scrollWidth - width, wide };
        });
        expect(overflow.scroll, `${url} scrolls sideways; widest offenders: ${overflow.wide.join(', ')}`).toBeLessThanOrEqual(1);
      }
    });

    test('directional icons point the right way in Arabic', async ({ page }) => {
      await prepare(page);
      await page.goto(ar);
      await settle(page);
      const icons = await page.evaluate(() => {
        // Mirrored when the product of every ancestor's horizontal scale is negative.
        const mirrored = el => {
          let sign = 1;
          for (let n = el; n && n !== document.body; n = n.parentElement) {
            const t = getComputedStyle(n).transform;
            if (t && t !== 'none' && new DOMMatrix(t).a < 0) sign = -sign;
          }
          return sign < 0;
        };
        const visible = el => el.getClientRects().length > 0;
        const flip = [...document.querySelectorAll('.az-flip')].filter(visible);
        const arrows = [...document.querySelectorAll('svg[class*="lucide-arrow-right"], svg[class*="lucide-chevron-right"], svg[class*="lucide-arrow-up-right"], svg[class*="lucide-move-right"]')]
          .filter(visible).filter(el => !el.classList.contains('az-flip'));
        return {
          flipCount: flip.length,
          notMirrored: flip.filter(el => !mirrored(el)).map(el => el.outerHTML.slice(0, 90)),
          unflippedArrows: arrows.filter(el => !mirrored(el)).map(el => `${el.getAttribute('class')} in ${el.parentElement?.className || el.parentElement?.tagName}`),
        };
      });
      expect(icons.notMirrored, '.az-flip icons that are not mirrored in RTL').toEqual([]);
      // Right-pointing arrows without .az-flip may be deliberate; list them for review.
      if (icons.unflippedArrows.length) {
        test.info().annotations.push({ type: 'review', description: `Right-pointing icons not mirrored in Arabic: ${[...new Set(icons.unflippedArrows)].join(' | ')}` });
      }
    });

    test('phone numbers, emails and their inputs stay left-to-right in Arabic', async ({ page }) => {
      await prepare(page);
      await page.goto(ar);
      await settle(page);
      const wrong = await page.evaluate(() => {
        const isolated = ['isolate', 'plaintext', 'isolate-override', 'bidi-override'];
        return [...document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"], input[type="tel"], input[type="email"]')]
          .filter(el => el.getClientRects().length > 0)
          .filter(el => el.tagName === 'INPUT' || /\d{3}|@/.test(el.textContent || ''))
          .filter(el => { const s = getComputedStyle(el); return s.direction !== 'ltr' && !isolated.includes(s.unicodeBidi); })
          .map(el => el.outerHTML.slice(0, 120));
      });
      expect(wrong, 'phone/email content rendered right-to-left (digit groups would reorder)').toEqual([]);
    });

    test('internal links keep the visitor in Arabic', async ({ page }) => {
      await prepare(page);
      await page.goto(ar);
      await settle(page);
      const leaks = await page.evaluate(() => [...document.querySelectorAll('header a[href], main a[href], footer a[href]')]
        .filter(a => !a.closest('[lang="en"]') && a.getAttribute('hreflang') !== 'en')
        .map(a => a.getAttribute('href'))
        .filter(h => h.startsWith('/') && !h.startsWith('//'))
        .filter(h => !/^\/ar(\/|$|\?|#)/.test(h))
        .filter(h => !/^\/(api|assets|cinematic|fonts|photos)\//.test(h) && !/\.(pdf|xml|txt|png|jpe?g|webp|svg|ico)$/i.test(h)));
      expect([...new Set(leaks)], 'links on the Arabic page that drop the /ar prefix').toEqual([]);
    });

    test('Arabic page has no untranslated English text', async ({ page }) => {
      await prepare(page);
      await page.goto(ar);
      await settle(page);
      const english = await page.evaluate(allowed => {
        const allow = new Set(allowed);
        const out = [];
        // Hidden from everyone: aria-hidden and visually collapsed (e.g. the forms' spam honeypot).
        const hiddenFromAll = el => {
          const hidden = el.closest('[aria-hidden="true"]');
          if (!hidden) return false;
          const r = hidden.getBoundingClientRect();
          return r.width <= 1 && r.height <= 1;
        };
        const skip = el => {
          const langEl = el.closest('[lang]');
          return (langEl && !langEl.getAttribute('lang').startsWith('ar')) || el.closest('script, style, noscript, code, [dir="ltr"]') || hiddenFromAll(el);
        };
        const latinWords = text => (text.replace(/\S+@\S+|https?:\/\/\S+|www\.\S+/g, '').match(/[A-Za-z][A-Za-z'’-]{2,}/g) || [])
          .filter(w => !allow.has(w) && !/^[A-Z]{2,6}$/.test(w));
        const where = el => el.closest('footer') ? 'footer' : el.closest('header') ? 'header' : 'main';
        for (const root of document.querySelectorAll('header, main, footer')) {
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const el = node.parentElement;
            if (!el || skip(el) || !el.getClientRects().length || getComputedStyle(el).visibility === 'hidden') continue;
            const words = latinWords(node.textContent || '');
            if (words.length) out.push(`${where(el)} text [${words.join(' ')}] in "${node.textContent.trim().slice(0, 60)}"`);
          }
          for (const el of root.querySelectorAll('[aria-label], [placeholder], [alt], [title]')) {
            if (skip(el)) continue;
            for (const attr of ['aria-label', 'placeholder', 'alt', 'title']) {
              const v = el.getAttribute(attr);
              if (v && latinWords(v).length) out.push(`${where(el)} ${attr} "${v.slice(0, 60)}" on <${el.tagName.toLowerCase()}>`);
            }
          }
        }
        return [...new Set(out)];
      }, [...LATIN_ALLOWED]);
      expect(english, 'English left on the Arabic page (translate it, mark it lang="en", or allow-list a proper noun)').toEqual([]);
    });

    test('language switch keeps the section being read', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop' || !['home', 'about', 'customs-clearance'].includes(p.name), 'checked on three long pages');
      await prepare(page);
      await page.goto(en);
      await settle(page);
      await page.evaluate(() => window.scrollTo(0, Math.round(document.documentElement.scrollHeight * 0.45)));
      await page.waitForTimeout(300);
      // Index of the innermost section under the sticky header (the "reading line").
      const sectionAt = () => page.evaluate(() => {
        const line = (document.querySelector('.az-header')?.offsetHeight || 96) + 1;
        const secs = [...document.querySelectorAll('main section')];
        for (let i = secs.length - 1; i >= 0; i--) { const r = secs[i].getBoundingClientRect(); if (r.top <= line && r.bottom > line) return i; }
        return -1;
      });
      const before = await sectionAt();
      // Click where the button is, as a person would (no scroll-into-view first).
      // The language toggle sits in the header bar, which stays on screen while scrolling (19 Oct 2026).
      const box = await page.locator('header .az-lang-toggle button[lang="ar"]').boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForURL(u => pathnameOf(u.href) === pathnameOf(ar));
      await page.waitForTimeout(800);
      expect(before, 'a section should be under the header before switching').toBeGreaterThan(0);
      expect(await sectionAt(), 'section under the header after switching to Arabic').toBe(before);
    });

    test('language switcher swaps to the twin page and back', async ({ page, isMobile }) => {
      await prepare(page);
      await page.goto(en);
      await settle(page);
      const switchTo = async lang => {
        if (isMobile) {
          await page.getByTestId('button-menu').click();
          await page.locator(`.az-mobile-lang button[lang="${lang}"]`).click();
        } else {
          await page.locator(`header .language-switch button[lang="${lang}"]`).first().click();
        }
      };
      await switchTo('ar');
      await page.waitForURL(u => pathnameOf(u.href) === pathnameOf(ar));
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await switchTo('en');
      await page.waitForURL(u => pathnameOf(u.href) === pathnameOf(en));
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    });
  });
}
