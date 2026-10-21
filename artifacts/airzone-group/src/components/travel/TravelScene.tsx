import { useEffect, useRef, type ReactNode } from 'react';
import { useLocale } from '@/site/locale';
import { loadGsap } from '@/motion/gsap';
import { usePrefersReducedMotion } from '@/motion/reduced-motion';
import { createFrameSequence } from '@/components/home/frame-sequence';
import { CINEMATIC_SETS, PORTRAIT_QUERY, cine } from '@/components/home/cinematic-assets';

/**
 * Travel hero: the cinematic flight over the island (the homepage's frames, so a visitor
 * downloads them once) behind the travel copy.
 *
 * A short sticky stage holds the scene below the header while the flight plays and the
 * camera pushes in; then the page simply carries on (no scroll hijacking, no pin spacer).
 * The copy drifts more slowly than the scene for depth, and stays readable and usable the
 * whole time. The sharp poster (the first frame) is the LCP image and shows immediately;
 * without scripts, under reduced motion, without WebGL or if frames fail to load, the
 * poster and copy are the hero and the page scrolls normally.
 */
export function TravelScene({ children, label, cue }: { children: ReactNode; label: string; cue?: ReactNode }) {
  const { locale } = useLocale();
  const reduced = usePrefersReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const w = wrap.current, cv = canvas.current, po = poster.current, co = copy.current;
    if (!w || !cv || !po || !co) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add({ motion: '(prefers-reduced-motion: no-preference)', portrait: PORTRAIT_QUERY, desktop: '(min-width: 901px)' }, ctx => {
        if (!ctx.conditions?.motion) return;
        const { portrait, desktop } = ctx.conditions;
        const set = CINEMATIC_SETS[portrait ? 'm' : 'd'];
        const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
        const seq = createFrameSequence(cv, set, { coarseOnly: saveData });
        // f: frame position (the renderer blends neighbours); z: camera push-in, applied when the
        // renderer crops the frame (one resampling step, not a CSS scale on top).
        const state = { f: 0, z: 1 };
        // From the top of the page until the stage has scrolled away. The flight finishes while
        // the stage is still mostly in view; the copy drifts up a little slower than the scroll.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: w, start: 0, end: 'bottom top', scrub: 0.35, invalidateOnRefresh: true },
          onUpdate: () => seq.render(state.f, state.z),
        });
        tl.to(state, { f: set.count - 1, duration: 0.72 }, 0)
          .to(state, { z: desktop ? 1.14 : 1.08, duration: 1 }, 0)
          .fromTo(po, { opacity: 1 }, { opacity: 0, duration: 0.03 }, 0.005)
          .to(co, { y: desktop ? -64 : -36, duration: 1 }, 0);
        if (cueRef.current) tl.to(cueRef.current, { autoAlpha: 0, duration: 0.1 }, 0);
        seq.ready.then(() => { if (!cancelled) seq.render(state.f, state.z); });
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('load', refresh, { once: true });
        return () => { window.removeEventListener('load', refresh); seq.dispose(); };
      });
    }).catch(() => { /* the poster stays */ });
    return () => { cancelled = true; revert?.(); };
    // Rebuilt on a language switch (the page stays mounted; direction changes the layout).
  }, [reduced, locale]);

  return <div className="tv-scene" ref={wrap}>
    <section className="tv-hero tv-scene-stage" aria-labelledby="tv-hero-title">
      <div className="tv-scene-zoom" role="img" aria-label={label}>
        <canvas ref={canvas} className="az-cine-canvas" aria-hidden="true" />
        <picture>
          <source media="(max-aspect-ratio: 3/4)" srcSet={cine('poster-p.webp')} width={640} height={821} />
          <source media={PORTRAIT_QUERY} srcSet={cine('poster-m.webp')} width={1077} height={821} />
          <img ref={poster} className="az-cine-poster" src={cine('poster-d.webp')} width={1915} height={821} alt="" fetchPriority="high" decoding="async" />
        </picture>
      </div>
      <div className="tv-scene-copy" ref={copy}>{children}</div>
      {cue && <div className="tv-scene-cue" ref={cueRef}>{cue}</div>}
    </section>
  </div>;
}
