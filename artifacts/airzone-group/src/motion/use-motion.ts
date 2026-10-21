import { useEffect, type RefObject } from 'react';
import { loadGsap } from './gsap';
import { usePrefersReducedMotion } from './reduced-motion';

/**
 * Scoped GSAP + ScrollTrigger system. Content is fully visible by default and
 * stays visible if scripts fail, time out or the visitor prefers reduced motion.
 * Elements opt in with data attributes inside the referenced root:
 *  data-hero-bg               hero photograph drifts on scroll (desktop; entrance is CSS)
 *  data-reveal [data-delay]   fade + rise when scrolled into view
 *  data-stagger               reveal direct children one after another
 *  data-img-reveal            clip reveal of a media frame (inner img settles)
 *  data-parallax              subtle scrubbed drift (desktop only)
 *  data-pin                   pin the element while its parent scrolls (desktop only)
 *  data-curtain               section opens from a rounded inset to full bleed (desktop, scrubbed)
 *  data-scrub-line            scaleY/scaleX fill linked to the parent's scroll progress
 *  data-line                  horizontal rule draws in
 *  data-count="24"            number counts up once (text content is the final value)
 *  data-progress              page reading-progress bar
 * Everything is created inside gsap.matchMedia() and reverted on unmount or
 * when the reduced-motion preference changes, so no triggers leak.
 */
export function useMotion(ref: RefObject<HTMLElement | null>, direction: 'ltr' | 'rtl' = 'ltr') {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (reduced) { root.setAttribute('data-motion', 'off'); return; }
    root.setAttribute('data-motion', 'pending');
    let cancelled = false;
    let timedOut = false;
    let revert: (() => void) | undefined;
    const fallback = window.setTimeout(() => {
      timedOut = true;
      revert?.();
      root.setAttribute('data-motion', 'off');
    }, 3000);

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || timedOut) return;
      const media = gsap.matchMedia(root);
      revert = () => media.revert();
      media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 901px)' }, context => {
        if (!context.conditions?.motion) { root.setAttribute('data-motion', 'off'); return; }
        const desktop = Boolean(context.conditions.desktop);
        const rtl = direction === 'rtl';
        const q = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T & Element>(sel)) as T[];

        // Content already on screen when motion initialises is left alone, so
        // server-rendered text is never hidden and re-shown (no flicker).
        const onScreen = (el: Element) => ScrollTrigger.isInViewport(el, 0.02);
        // Reveals play once and never reverse (GSAP's default toggleActions). They
        // deliberately do not use `once: true`: a once-trigger kills itself when it
        // is created already scrolled past (e.g. rebuilt at the bottom of the page
        // after a language switch), and several triggers removing themselves inside
        // ScrollTrigger's own refresh loop makes it throw and leaves every trigger
        // on the page rendering with events suppressed.
        const entering = (el: Element) => ({ trigger: el, start: 'top 88%' });

        // Hero: the entrance itself is CSS (runs at first paint, see airzone.css).
        // GSAP adds a scroll-linked drift through the separate `--py` translate,
        // so it never competes with the CSS entrance transform.
        const bg = root.querySelector<HTMLElement>('[data-hero-bg]');
        if (bg && desktop) {
          gsap.fromTo(bg, { '--py': '0%' }, { '--py': '9%', ease: 'none', scrollTrigger: { trigger: bg.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
        }
        root.setAttribute('data-motion', 'ready');

        // Section headings and copy rise as they enter.
        q('[data-reveal]').filter(el => !onScreen(el)).forEach(el => {
          gsap.from(el, { y: el.tagName === 'H2' ? 34 : 22, opacity: 0, duration: el.tagName === 'H2' ? 0.95 : 0.8, ease: 'power3.out', delay: Number(el.dataset.delay ?? 0), scrollTrigger: entering(el) });
        });
        // Card grids and lists: one coordinated, staggered timeline per group.
        q('[data-stagger]').filter(el => !onScreen(el)).forEach(el => {
          gsap.timeline({ scrollTrigger: entering(el) })
            .from(el.children, { y: 26, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: { each: 0.05, from: rtl ? 'end' : 'start' } });
        });
        // Images: masked reveal, then the photo settles inside the frame.
        q('[data-img-reveal]').filter(el => !onScreen(el)).forEach(el => {
          const img = el.querySelector('img');
          const tl = gsap.timeline({ scrollTrigger: entering(el) });
          tl.from(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.inOut' }, 0);
          if (img) tl.from(img, { scale: 1.14, duration: 1.5, ease: 'power3.out' }, 0);
        });
        q('[data-line]').filter(el => !onScreen(el)).forEach(el => {
          gsap.from(el, { scaleX: 0, transformOrigin: rtl ? 'right center' : 'left center', duration: 1, ease: 'power2.inOut', scrollTrigger: entering(el) });
        });
        // Process timeline fill follows scroll progress (scrub is appropriate here).
        q('[data-scrub-line]').forEach(el => {
          const vertical = el.dataset.scrubLine !== 'x';
          gsap.fromTo(el, vertical ? { scaleY: 0 } : { scaleX: 0 }, {
            ...(vertical ? { scaleY: 1 } : { scaleX: 1 }), ease: 'none',
            transformOrigin: vertical ? 'center top' : (rtl ? 'right center' : 'left center'),
            scrollTrigger: { trigger: el.parentElement, start: 'top 70%', end: 'bottom 60%', scrub: 0.4 },
          });
        });
        // Count-up for verified figures only (values are the server-rendered text).
        q('[data-count]').forEach(el => {
          const target = Number(el.dataset.count);
          if (!Number.isFinite(target)) return;
          const state = { v: 0 };
          gsap.to(state, { v: target, duration: 1.4, ease: 'power2.out', delay: onScreen(el) ? 0.6 : 0,
            onStart: () => { el.textContent = '0'; },
            onUpdate: () => { el.textContent = String(Math.round(state.v)); },
            onComplete: () => { el.textContent = String(target); },
            scrollTrigger: { trigger: el, start: 'top 95%' } });
        });
        if (desktop) {
          // Parallax and pinning are desktop-only; small screens get static layouts.
          q('[data-parallax]').forEach(el => {
            gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
          });
          // Cinematic section curtain: the dark panel opens from a rounded inset to full bleed.
          q('[data-curtain]').forEach(el => {
            gsap.fromTo(el, { clipPath: 'inset(0% 2.5% 0% 2.5% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 30%', scrub: 0.5 } });
          });
          q('[data-pin]').forEach(el => {
            ScrollTrigger.create({ trigger: el.parentElement, start: 'top top+=120', end: () => `bottom top+=${el.offsetHeight + 160}`, pin: el, pinSpacing: false, invalidateOnRefresh: true });
          });
        }
        q('[data-progress]').forEach(el => {
          gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: 'none', transformOrigin: rtl ? 'right center' : 'left center',
            scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
        });
        // Fonts and late images can change layout: re-measure trigger positions.
        // 'loadingdone' also covers fonts that start loading after a client-side
        // language switch (the Arabic face), when no new window 'load' event fires.
        const refresh = () => ScrollTrigger.refresh();
        void document.fonts?.ready.then(() => { if (!cancelled) refresh(); });
        document.fonts?.addEventListener('loadingdone', refresh);
        if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true });
        const cleanupLoad = () => { window.removeEventListener('load', refresh); document.fonts?.removeEventListener('loadingdone', refresh); };
        return () => { cleanupLoad(); root.setAttribute('data-motion', 'off'); };
      });
      window.clearTimeout(fallback);
    }).catch(err => {
      // Content stays visible; surface the cause instead of failing silently.
      console.error('Scroll animations could not start:', err);
      if (cancelled) return;
      window.clearTimeout(fallback);
      revert?.();
      root.setAttribute('data-motion', 'off');
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      revert?.();
      root.setAttribute('data-motion', 'off');
    };
  }, [ref, direction, reduced]);
}
