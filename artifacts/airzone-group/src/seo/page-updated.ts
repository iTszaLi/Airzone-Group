import { useEffect, useRef, useState } from 'react';

/**
 * The current page's last content update, for the footer, without putting the (large) page
 * metadata module in the main bundle:
 *  - server render: entry-server sets the value for the page being rendered;
 *  - hydration of a prerendered page: read back from the server-rendered footer, so every render
 *    attempt (React may retry a lazily loaded page) matches the server HTML;
 *  - after hydration, client navigations load the metadata chunk on demand (as Seo.tsx does).
 */
let serverValue: string | undefined;
export function setServerPageUpdated(value: string | undefined) { serverValue = value; }

/** True from page load until the prerendered page has hydrated (cleared by the first committed footer). */
let hydrating = typeof document !== 'undefined' && !import.meta.env.DEV && !!document.getElementById('root')?.hasChildNodes();

export function usePageUpdated(barePath: string) {
  const fromPrerender = useRef(false);
  const [value, setValue] = useState<string | undefined>(() => {
    if (typeof document === 'undefined') return serverValue;
    if (hydrating) {
      fromPrerender.current = true;
      return document.querySelector('.az-footer-updated time')?.getAttribute('datetime') ?? undefined;
    }
    return undefined;
  });
  useEffect(() => {
    hydrating = false;
    if (fromPrerender.current) { fromPrerender.current = false; return; }
    let stale = false;
    void import('./site').then(({ pages }) => { if (!stale) setValue(pages[barePath]?.updated); });
    return () => { stale = true; };
  }, [barePath]);
  return value;
}
