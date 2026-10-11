import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { seoHead } from './html';
import { routeInfo } from './site';

/** Reuses the exact server metadata; replaces managed tags, never the favicon. */
export function Seo() {
  const [path] = useLocation();
  useEffect(() => {
    const locale = routeInfo(path).locale;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    const fragment = document.createElement('template');
    fragment.innerHTML = seoHead(path, import.meta.env.DEV);
    document.head.querySelectorAll('[data-airzone-seo]').forEach(n => n.remove());
    document.head.append(fragment.content);
  }, [path]);
  return null;
}
