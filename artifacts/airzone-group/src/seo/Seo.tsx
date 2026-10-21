import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { routeInfo } from './route-info';

/**
 * Reuses the exact server metadata; replaces managed tags, never the favicon.
 * Prerendered pages already carry the right head, so the (large) metadata module is
 * loaded only when the visitor navigates client-side (or always in development).
 */
export function Seo() {
  const [path] = useLocation();
  const first = useRef(true);
  useEffect(() => {
    const locale = routeInfo(path).locale;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    if (first.current && !import.meta.env.DEV) { first.current = false; return; }
    first.current = false;
    let stale = false;
    void import('./html').then(({ seoHead }) => {
      if (stale) return;
      const fragment = document.createElement('template');
      fragment.innerHTML = seoHead(path, import.meta.env.DEV);
      document.head.querySelectorAll('[data-airzone-seo]').forEach(n => n.remove());
      document.head.append(fragment.content);
    });
    return () => { stale = true; };
  }, [path]);
  return null;
}
