import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocale } from '@/site/locale';
import { loadGsap } from '@/motion/gsap';
import { usePrefersReducedMotion } from '@/motion/reduced-motion';
import { PhotoImg } from '@/components/ui-kit/Primitives';
import type { PhotoKey } from '@/config/photography';

export type SceneShot = { photo: PhotoKey; label: string; icon: ReactNode };

/**
 * Logistics hero: a shipment's journey in real photography: the container port (customs
 * clearance), the open road (transportation), the warehouse (warehousing).
 *
 * A short sticky stage holds the scene under the header while the camera slowly pushes into each
 * shot and the next one dissolves in; the step list underneath marks where the shipment is. The
 * headline and quote button stay readable and usable throughout, and the page then carries on
 * into the three service pillars (no scroll hijacking). Without scripts or under reduced motion,
 * the first photograph is the hero and the three steps are a static list (the other two
 * photographs are display: none there, so they are never downloaded).
 */
export function LogisticsScene({ children, shots, label, foot }: { children: ReactNode; shots: SceneShot[]; label: string; foot?: ReactNode }) {
  const { locale } = useLocale();
  const reduced = usePrefersReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const steps = useRef<HTMLOListElement>(null);
  // The later shots are only seen once the visitor scrolls: fetch them after the page has loaded, so they
  // do not compete with the first photograph and the text (LCP). Reduced motion never shows them.
  const [laterShots, setLaterShots] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const go = () => setLaterShots(true);
    if (document.readyState === 'complete') { const t = window.setTimeout(go, 300); return () => clearTimeout(t); }
    window.addEventListener('load', go, { once: true });
    return () => window.removeEventListener('load', go);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const w = wrap.current, st = stage.current, ol = steps.current;
    if (!w || !st || !ol) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add({ motion: '(prefers-reduced-motion: no-preference)' }, ctx => {
        if (!ctx.conditions?.motion) return;
        const layers = gsap.utils.toArray<HTMLElement>('.lg-scene-shot', st);
        const imgs = layers.map(l => l.querySelector('img'));
        const n = layers.length;
        let active = 0;
        ol.dataset.active = '0';
        // One scrubbed timeline over the hold (from the top of the page until the sticky stage is
        // released, 'bottom bottom'): each shot gets an equal share; the camera pushes in on it
        // while the next dissolves in, and the step list follows the dissolve midpoints.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: w, start: 0, end: 'bottom bottom', scrub: 0.4, invalidateOnRefresh: true },
          onUpdate: () => {
            const i = Math.min(n - 1, Math.floor(tl.progress() * n + 0.15));
            if (i !== active) { active = i; ol.dataset.active = String(i); }
          },
        });
        imgs.forEach((img, i) => {
          if (!img) return;
          const at = i / n;
          if (i > 0) tl.fromTo(layers[i], { opacity: 0 }, { opacity: 1, duration: 0.08 }, at - 0.06);
          tl.fromTo(img, { scale: i === 0 ? 1 : 1.1 }, { scale: i === 0 ? 1.14 : 1.03, duration: 1 / n + 0.06 }, Math.max(0, at - 0.06));
        });
        return () => { delete ol.dataset.active; };
      });
    }).catch(() => { /* the first photograph stays */ });
    return () => { cancelled = true; revert?.(); };
  }, [reduced, locale]);

  return <div className="lg-scene" ref={wrap}>
    <section className="lg-hero lg-scene-stage" ref={stage} aria-labelledby="lg-hero-title">
      <div className="lg-scene-shots" role="img" aria-label={label}>
        {shots.map((s, i) => <div key={s.photo} className="lg-scene-shot">
          {/* No heroBg: its scroll drift would fight the scene camera; the first shot loads eagerly (LCP). */}
          {i === 0 ? <PhotoImg photo={s.photo} sizes="100vw" eager /> : <PhotoImg photo={s.photo} sizes="100vw" deferred={!laterShots} />}
        </div>)}
      </div>
      <div className="lg-scene-copy">{children}</div>
      <div className="az-container lg-scene-foot">
        <ol className="lg-scene-steps" ref={steps}>
          {shots.map((s, i) => <li key={s.photo} className="lg-scene-step" data-i={i}><span className="lg-scene-step-icon">{s.icon}</span><span>{s.label}</span></li>)}
        </ol>
        {foot}
      </div>
    </section>
  </div>;
}
