import { useEffect, useState, type RefObject } from 'react';

/**
 * Scoped GSAP + ScrollTrigger system. Content is visible by default.
 * Elements opt in with data attributes:
 *  data-hero-bg, data-hero-line, data-hero-item  - load timeline
 *  data-reveal                                    - fade/translate on enter
 *  data-img-reveal                                - clip reveal (inner img scales down)
 *  data-parallax                                  - subtle scrub movement (desktop only)
 *  data-line                                      - line draw
 *  data-progress                                  - page progress bar
 * Reduced motion: nothing is hidden or animated. Failure/timeout: content stays visible.
 */
export function useMotion(ref: RefObject<HTMLElement | null>, direction: 'ltr' | 'rtl' = 'ltr') {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

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

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
      if (cancelled || timedOut) return;
      const gsap = g.gsap;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia(root);
      revert = () => media.revert();
      media.add({
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 901px)',
      }, context => {
        if (!context.conditions?.motion) {
          root.setAttribute('data-motion', 'off');
          return;
        }
        const desktop = Boolean(context.conditions.desktop);
        const rtl = direction === 'rtl';
        const bg = root.querySelector('[data-hero-bg]');
        if (bg) {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          tl.from(bg, { scale: 1.12, opacity: 0.2, duration: 1.5 }, 0)
            .from('[data-hero-item="eyebrow"]', { y: 14, opacity: 0, duration: 0.55 }, 0.15)
            .from('[data-hero-line] > span', { yPercent: 110, duration: 0.8, stagger: 0.12 }, 0.3)
            .from('[data-hero-item="text"]', { y: 20, opacity: 0, duration: 0.65 }, 0.8)
            .from('[data-hero-item="cta"]', { y: 16, opacity: 0, duration: 0.55, stagger: 0.08 }, 1.0)
            .from('[data-hero-item="aside"]', { y: 24, opacity: 0, duration: 0.8 }, 1.0);
          if (desktop) {
            gsap.to(bg, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: bg.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
          }
        }
        root.setAttribute('data-motion', 'ready');

        root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
          gsap.from(el, { y: 24, opacity: 0, duration: 0.8, ease: 'power2.out', delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        });
        root.querySelectorAll<HTMLElement>('[data-img-reveal]').forEach(el => {
          const img = el.querySelector('img');
          const trigger = { trigger: el, start: 'top 88%', once: true };
          gsap.from(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.inOut', scrollTrigger: trigger });
          if (img) gsap.from(img, { scale: 1.14, duration: 1.4, ease: 'power3.out', scrollTrigger: trigger });
        });
        if (desktop) {
          root.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
            gsap.fromTo(el, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
          });
        }
        root.querySelectorAll<HTMLElement>('[data-line]').forEach(el => {
          gsap.from(el, { scaleX: 0, transformOrigin: rtl ? 'right center' : 'left center', duration: 1, ease: 'power2.inOut',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        });
        root.querySelectorAll<HTMLElement>('[data-progress]').forEach(el => {
          gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: 'none', transformOrigin: rtl ? 'right center' : 'left center',
            scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
        });
        return () => root.setAttribute('data-motion', 'off');
      });
      window.clearTimeout(fallback);
    }).catch(() => {
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
