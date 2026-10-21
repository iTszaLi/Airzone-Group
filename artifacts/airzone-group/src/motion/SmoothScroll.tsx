import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import type Lenis from 'lenis';
import { loadGsap } from './gsap';
import { usePrefersReducedMotion } from './reduced-motion';

let instance: Lenis | null = null;

/** Current Lenis instance, or null when native scrolling is in use. */
export function getLenis() {
  return instance;
}

/** Pause smooth scrolling (and page scroll) while an overlay is open. */
/** Return to the very top of the page: smooth (Lenis when active), instant under reduced motion. */
export function scrollToTop() {
  pending = null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (instance) instance.resize();
  if (instance) instance.scrollTo(0, reduce ? { immediate: true, force: true } : { duration: 1.2, force: true });
  else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}

export function setScrollLocked(locked: boolean) {
  if (instance) {
    if (locked) instance.stop(); else instance.start();
  }
  document.documentElement.classList.toggle('scroll-locked', locked);
}

/** Space taken by the sticky header (measured; falls back to its usual height). */
// Plus the travel page's sticky section bar, when present.
// Targets sit below the fold, where the header's strip has slid away: only the bar covers them.
const headerOffset = () => (document.querySelector<HTMLElement>('.az-navbar')?.offsetHeight || document.querySelector<HTMLElement>('.az-header')?.offsetHeight || 96) + (document.querySelector<HTMLElement>('.tv-subnav')?.offsetHeight ?? 0);
const urlKey = () => window.location.pathname + window.location.search;

function scrollToY(y: number) {
  if (instance) { instance.resize(); instance.scrollTo(y, { immediate: true, force: true }); }
  else window.scrollTo(0, y);
}

// Back/forward detection must run before the router's own popstate listener
// re-renders the page, so it is registered when this module loads.
let popPending = false;
let suppressSave = false;
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => { popPending = true; suppressSave = true; });
}

// Language switch: the twin page opens at the section the visitor was reading.
// Both languages render the same sections in the same order; the position inside
// the section is kept as a fraction because Arabic and English heights differ.
type SectionAnchor = { index: number; ratio: number };
let localeSwitch: { anchor: SectionAnchor | null } | null = null;
const readingLine = () => headerOffset() + 1;
const pageSections = () => Array.from(document.querySelectorAll<HTMLElement>('main section'));

/** Call just before switching language, so the twin page keeps the reading position. */
export function keepReadingPosition() {
  localeSwitch = { anchor: null };
  if (window.scrollY < 8) return; // at the top: the twin page starts at the top too
  const line = readingLine();
  const sections = pageSections();
  // The last section in document order that spans the reading line is the innermost one.
  for (let i = sections.length - 1; i >= 0; i--) {
    const r = sections[i].getBoundingClientRect();
    if (r.top <= line && r.bottom > line) {
      localeSwitch.anchor = { index: i, ratio: Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height))) };
      return;
    }
  }
}

// A programmatic position (restore, #hash or language switch) is re-applied after
// ScrollTrigger refreshes for a short window, because a refresh restores its own
// cached scroll value. Any user scroll input cancels it immediately.
let pending: { y?: number; id?: string; anchor?: SectionAnchor; until: number } | null = null;
let isRefreshing: () => boolean = () => false;
function pendingY() {
  if (!pending) return null;
  if (pending.y !== undefined) return pending.y;
  if (pending.anchor) {
    const s = pageSections()[pending.anchor.index];
    if (!s) return null;
    const r = s.getBoundingClientRect();
    return Math.max(0, Math.round(r.top + window.scrollY + pending.anchor.ratio * r.height - readingLine()));
  }
  const t = pending.id ? document.getElementById(pending.id) : null;
  return t ? Math.max(0, Math.round(t.getBoundingClientRect().top + window.scrollY - headerOffset())) : null;
}
function applyPending() {
  if (!pending) return;
  if (performance.now() > pending.until) { pending = null; return; }
  const y = pendingY();
  if (y !== null) scrollToY(y);
}
// Late layout changes (web fonts, images) move the target after the jump; while a
// position is pending, re-apply it whenever the page content changes size.
let layoutObserver: ResizeObserver | null = null;
function watchLayout() {
  if (layoutObserver || typeof ResizeObserver === 'undefined') return;
  const main = document.getElementById('main') ?? document.body;
  layoutObserver = new ResizeObserver(() => {
    if (pending) applyPending();
    if (!pending) { layoutObserver?.disconnect(); layoutObserver = null; }
  });
  layoutObserver.observe(main);
}
function setPending(p: { y?: number; id?: string; anchor?: SectionAnchor }) {
  pending = { ...p, until: performance.now() + 2500 };
  applyPending();
  watchLayout();
}
if (typeof window !== 'undefined') {
  const cancel = () => { pending = null; };
  for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) window.addEventListener(type, cancel, { passive: true, capture: true });
  // Any other scroll away from the target (e.g. dragging the scrollbar), outside a
  // ScrollTrigger refresh, also means the visitor has taken over.
  window.addEventListener('scroll', () => {
    if (!pending || isRefreshing()) return;
    const y = pendingY();
    if (y === null || Math.abs(window.scrollY - y) > 4) pending = null;
  }, { passive: true });
}

/** Scroll to an in-page target below the sticky header and move focus to it. */
function goToTarget(target: HTMLElement) {
  // Re-measure first: Lenis clamps to its cached page height, which can be
  // stale after late images, fonts or reveals change the layout.
  // An explicit position: Lenis would otherwise add the CSS scroll-padding and
  // scroll-margin on top of the header offset.
  if (instance) {
    instance.resize();
    instance.scrollTo(Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - headerOffset())), { duration: 1 });
  } else target.scrollIntoView({ block: 'start' });
  if (!target.matches('a, button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis
 * share one animation frame. Disabled for reduced-motion users and on
 * touch-first devices (native momentum scrolling). Also owns scroll
 * restoration: new routes start at the top, back/forward restores the previous
 * position, a language switch keeps the section being read, and same-page
 * anchors (including the skip link) scroll below the sticky header and move
 * keyboard focus.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  const [location] = useLocation();
  const positions = useRef(new Map<string, number>());
  const firstRoute = useRef(true);

  // Lenis + ScrollTrigger synchronisation.
  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
    let cancelled = false;
    let detach: (() => void) | null = null;
    const start = () => Promise.all([import('lenis'), loadGsap()]).then(([{ default: LenisClass }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;
      const lenis = new LenisClass({ duration: 1.05, wheelMultiplier: 1, autoRaf: false });
      instance = lenis;
      const onScroll = () => ScrollTrigger.update();
      lenis.on('scroll', onScroll);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
      detach = () => { lenis.off('scroll', onScroll); gsap.ticker.remove(tick); };
    }).catch(() => { /* Native scrolling remains in place. */ });
    // Initialise after hydration, when the main thread is idle.
    const idle = (cb: () => void) => {
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(cb, { timeout: 2500 });
      else setTimeout(cb, 1200);
    };
    idle(() => { if (!cancelled) void start(); });
    return () => {
      cancelled = true;
      detach?.();
      instance?.destroy();
      instance = null;
    };
  }, [reduced]);

  // Remember positions per URL (manual restoration); re-apply after ScrollTrigger refreshes.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    let frame = 0;
    const save = () => { if (suppressSave) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(() => positions.current.set(urlKey(), window.scrollY)); };
    window.addEventListener('scroll', save, { passive: true });
    let detachRefresh: (() => void) | null = null;
    loadGsap().then(({ ScrollTrigger }) => {
      isRefreshing = () => Boolean((ScrollTrigger as unknown as { isRefreshing?: boolean }).isRefreshing);
      ScrollTrigger.addEventListener('refresh', applyPending);
      detachRefresh = () => ScrollTrigger.removeEventListener('refresh', applyPending);
    }).catch(() => undefined);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', save); detachRefresh?.(); };
  }, []);

  // Same-page hash links (e.g. the skip link): offset for the header and move focus.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      history.pushState(history.state, '', url.hash);
      goToTarget(target);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Route changes: restore on back/forward, honour a #hash, keep the reading
  // position on a language switch, otherwise start at the top.
  useEffect(() => {
    const wasPop = popPending;
    popPending = false;
    const switched = localeSwitch;
    localeSwitch = null;
    let raf = 0;
    let observer: MutationObserver | null = null;
    let timeout = 0;
    const settle = () => { raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      const id = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '';
      const hashTarget = id ? document.getElementById(id) : null;
      if (wasPop) setPending({ y: positions.current.get(urlKey()) ?? 0 });
      else if (switched?.anchor) setPending({ anchor: switched.anchor });
      else if (hashTarget) {
        setPending({ id });
        if (!hashTarget.matches('a, button, input, select, textarea, [tabindex]')) hashTarget.setAttribute('tabindex', '-1');
        hashTarget.focus({ preventScroll: true });
      } else setPending({ y: 0 });
      // After client-side navigation, move focus to the new page's main region
      // so keyboard and screen-reader users start at the new content. A language
      // switch is the same page: focus stays on the language control.
      if (!firstRoute.current && !hashTarget && !switched) document.getElementById('main')?.focus({ preventScroll: true });
      firstRoute.current = false;
      requestAnimationFrame(() => { suppressSave = false; });
      // Layout changed with the new page: let ScrollTrigger re-measure.
      loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh()).catch(() => undefined);
    })); };
    // A page that is still downloading shows a placeholder (App.tsx RouteFallback). Wait
    // for its content, so a #hash target and the real main region exist.
    const loading = () => document.querySelector('.az-route-wait') !== null;
    if (!loading()) settle();
    else {
      const done = () => { observer?.disconnect(); observer = null; clearTimeout(timeout); settle(); };
      observer = new MutationObserver(() => { if (!loading()) done(); });
      observer.observe(document.body, { childList: true, subtree: true });
      timeout = window.setTimeout(done, 10000);
    }
    return () => { cancelAnimationFrame(raf); observer?.disconnect(); clearTimeout(timeout); };
  }, [location]);

  return null;
}
