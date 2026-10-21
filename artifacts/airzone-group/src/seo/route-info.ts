/**
 * Lightweight route helpers shared by the browser runtime (no page data imported here,
 * so they stay out of the heavy metadata chunk). seo/site.ts re-exports them.
 */
export type Locale = 'en' | 'ar';

export function routeInfo(raw: string) {
  const pathname = raw.split(/[?#]/)[0] || '/';
  const locale: Locale = /^\/ar(?:\/|$)/.test(pathname) ? 'ar' : 'en';
  const path = pathname.replace(/^\/ar(?=\/|$)/, '').replace(/\/+$/, '') || '/';
  return { locale, path };
}

export const privateRoute = (raw: string) => /^\/(?:admin|portal|sign-in|sign-up)(?:\/|$)/.test(routeInfo(raw).path);
