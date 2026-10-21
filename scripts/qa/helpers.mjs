import { CONSENT } from './pages.mjs';

/** Pre-answer the analytics consent prompt so its banner stays out of the way. */
export async function prepare(page) {
  await page.addInitScript(({ key, value }) => {
    try { window.localStorage.setItem(key, value); } catch { /* storage may be blocked */ }
  }, CONSENT);
}

/** Wait until fonts, lazy images and late sections have loaded, then return to the top. */
export async function settle(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Load lazy images now: an image Chrome has not started fetching never settles.
    for (const img of document.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager';
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
    window.scrollTo(0, 0);
    const loaded = Promise.all([...document.images].filter(img => !img.complete)
      .map(img => new Promise(resolve => { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }); })));
    await Promise.race([loaded, new Promise(resolve => setTimeout(resolve, 8000))]);
  });
  await page.waitForLoadState('networkidle');
}
