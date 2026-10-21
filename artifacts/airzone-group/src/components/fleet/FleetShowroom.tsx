import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, m, useMotionValue, useReducedMotion, type MotionValue, type Variants } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { fleet, fleetImage, fleetLines, type FleetVehicle } from '@/config/fleet';
import { VehicleQuoteDialog } from './VehicleQuoteDialog';

const EASE = [0.22, 1, 0.36, 1] as const;          // --az-ease
const EXIT_EASE = [0.32, 0.72, 0, 1] as const;
const SIZES = '(min-width: 1100px) 820px, (min-width: 760px) 92vw, 100vw';
const srcSet = (image: string) => `${fleetImage(image, 640)} 640w, ${fleetImage(image, 1024)} 1024w`;
const pad = (n: number) => String(n).padStart(2, '0');

/** Ease a short swipe back to rest on the same motion value (a tiny frame loop, so the full animation engine stays out of this bundle). */
function settleBack(x: MotionValue<number>, duration = 380) {
  const from = x.get();
  const start = performance.now();
  const frame = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    x.set(from * Math.pow(1 - p, 3));
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

const T = {
  en: { label: 'Fleet showroom', picker: 'Choose a vehicle', prev: 'Previous vehicle', next: 'Next vehicle', body: 'Body', bestFor: 'Best for', service: 'Service',
    request: 'Request this vehicle', details: 'Explore service details', of: 'of' },
  ar: { label: 'معرض الأسطول', picker: 'اختر مركبة', prev: 'المركبة السابقة', next: 'المركبة التالية', body: 'الهيكل', bestFor: 'يناسب', service: 'الخدمة',
    request: 'اطلب هذه المركبة', details: 'تفاصيل الخدمة', of: 'من' },
};

type Move = { s: number; w: number; reduce: boolean };

/** Directional showroom move: the incoming vehicle glides in from the side it is coming from. */
const slideVariants: Variants = {
  enter: ({ s, w, reduce }: Move) => (reduce ? { opacity: 0 } : { opacity: 0, x: s * w * 0.14, filter: 'blur(6px)' }),
  center: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { x: { duration: 0.64, ease: EASE }, opacity: { duration: 0.42, ease: 'easeOut' as const }, filter: { duration: 0.42, ease: 'easeOut' as const } },
  },
  exit: ({ s, w, reduce }: Move) => (reduce
    ? { opacity: 0, transition: { duration: 0.2 } }
    : { opacity: 0, x: -s * w * 0.1, filter: 'blur(4px)', transition: { duration: 0.36, ease: EXIT_EASE } }),
};

function Slide({ v, locale, eager, move, onActive }: { v: FleetVehicle; locale: 'en' | 'ar'; eager: boolean; move: Move; onActive: (x: MotionValue<number>) => void }) {
  const x = useMotionValue(0);
  useEffect(() => { onActive(x); }, [onActive, x]);
  return <m.div className="az-sr-slide" style={{ x }} custom={move} variants={slideVariants} initial="enter" animate="center" exit="exit">
    <img src={fleetImage(v.image, 1024)} srcSet={srcSet(v.image)} sizes={SIZES} width={1024} height={572}
      alt={v[locale].alt} draggable={false} decoding="async" loading={eager ? 'eager' : 'lazy'} />
  </m.div>;
}

/**
 * Homepage fleet showroom: one vehicle on a studio stage, previous/next and swipe navigation
 * that loops, a vehicle picker, and a quote panel for the vehicle on show. The selected index
 * is the single source of truth, so the photo, text and picker always agree, even when the
 * visitor clicks quickly (in-flight transitions are simply replaced).
 */
export function FleetShowroom() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const t = T[locale];
  const reduce = useReducedMotion() ?? false;
  const [{ index, step }, setView] = useState({ index: 0, step: 1 });
  const [interacted, setInteracted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [width, setWidth] = useState(820);
  const stage = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLDivElement>(null);
  const activeX = useRef<MotionValue<number> | null>(null);
  const drag = useRef<{ id: number; x0: number; y0: number; active: boolean; samples: { x: number; t: number }[] } | null>(null);
  const n = fleet.length;
  const v = fleet[index];
  const c = v[locale];
  // Visual direction: forward moves content toward the reading start (left in English, right in Arabic).
  const move: Move = { s: step * (ar ? -1 : 1), w: width, reduce };

  const show = useCallback((next: number, dir: number) => {
    setInteracted(true);
    setView({ index: ((next % n) + n) % n, step: dir });
  }, [n]);
  const go = useCallback((dir: number) => {
    setInteracted(true);
    setView(cur => ({ index: (cur.index + dir + n) % n, step: dir }));
  }, [n]);
  const onActive = useCallback((x: MotionValue<number>) => { activeX.current = x; }, []);

  // Stage width drives the travel distance of the move.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Warm the neighbouring photos once the showroom is close, so moves never wait on the network.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let near = false;
    const warm = () => {
      for (const k of [index - 1, index + 1]) {
        const img = new Image();
        img.sizes = SIZES;
        img.srcset = srcSet(fleet[(k + n) % n].image);
      }
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !near) { near = true; warm(); } }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [index, n]);

  // Keep the selected vehicle visible in the picker on narrow screens (no page scroll).
  useEffect(() => {
    if (!interacted) return;
    const row = picker.current;
    const tab = row?.querySelector<HTMLElement>(`[data-vehicle="${v.id}"]`);
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return;
    const rowBox = row.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    row.scrollBy({ left: tabBox.left + tabBox.width / 2 - (rowBox.left + rowBox.width / 2), behavior: reduce ? 'auto' : 'smooth' });
  }, [v.id, interacted, reduce]);

  // Swipe: the photo follows the finger 1:1 after a small threshold; a flick or a long enough
  // drag changes vehicle, otherwise it settles back. Vertical movement is left to the page.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || drag.current) return;
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, active: false, samples: [{ x: e.clientX, t: e.timeStamp }] };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.active) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        d.active = true;
        d.x0 = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
      } else if (Math.abs(dy) > 10) { drag.current = null; }
      return;
    }
    activeX.current?.set(dx);
    d.samples.push({ x: e.clientX, t: e.timeStamp });
    if (d.samples.length > 6) d.samples.shift();
  };
  const onPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    const x = activeX.current;
    if (!d.active || !x) return;
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const velocity = last.t > first.t ? ((last.x - first.x) / (last.t - first.t)) * 1000 : 0;
    const projected = x.get() + (velocity / 1000) * 0.998 / (1 - 0.998);
    const threshold = width * 0.22;
    if (Math.abs(projected) > threshold) go((projected < 0 ? 1 : -1) * (ar ? -1 : 1));
    else settleBack(x);
  };

  const onPickerKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const forward = ar ? 'ArrowLeft' : 'ArrowRight';
    const back = ar ? 'ArrowRight' : 'ArrowLeft';
    let next = -1;
    if (e.key === forward) next = (index + 1) % n;
    else if (e.key === back) next = (index - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    show(next, next > index ? 1 : -1);
    document.getElementById(`az-sr-tab-${fleet[next].id}`)?.focus();
  };

  return <div className="az-sr" role="region" aria-roledescription={ar ? 'عرض دوّار' : 'carousel'} aria-label={t.label}>
    <div id="az-sr-panel" className="az-sr-main" role="tabpanel" aria-labelledby={`az-sr-tab-${v.id}`}>
      <div className="az-sr-stage-wrap">
        <div ref={stage} className="az-sr-stage" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}>
          <AnimatePresence initial={false} custom={move}>
            <Slide key={v.id} v={v} locale={locale} eager={interacted} move={move} onActive={onActive} />
          </AnimatePresence>
        </div>
        <p className="az-sr-count" aria-hidden="true"><span dir="ltr"><b>{pad(index + 1)}</b> / {pad(n)}</span></p>
        <button type="button" className="az-sr-nav is-prev" aria-label={t.prev} aria-controls="az-sr-panel" onClick={() => go(-1)}><ArrowLeft size={20} aria-hidden="true" className="az-flip" /></button>
        <button type="button" className="az-sr-nav is-next" aria-label={t.next} aria-controls="az-sr-panel" onClick={() => go(1)}><ArrowRight size={20} aria-hidden="true" className="az-flip" /></button>
      </div>

      <div className="az-sr-info">
        <div className="az-sr-info-stack">
          <AnimatePresence initial={false}>
            <m.div key={v.id} className="az-sr-copy"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: reduce ? 0 : 0.12, duration: 0.45, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.16 } }}>
              <p className="az-sr-line">{fleetLines[v.line][locale]}</p>
              <h3 className="az-sr-name">{c.name}</h3>
              <p className="az-sr-text">{c.text}</p>
              <dl className="az-sr-facts">
                <div><dt>{t.body}</dt><dd>{c.body}</dd></div>
                <div><dt>{t.bestFor}</dt><dd>{c.bestFor}</dd></div>
              </dl>
            </m.div>
          </AnimatePresence>
        </div>
        <div className="az-sr-actions">
          <button type="button" className="az-btn az-btn-primary az-btn-lg az-sr-cta" onClick={() => setDialogOpen(true)} aria-haspopup="dialog">
            <span className="az-sr-cta-label">{t.request}</span><span className="sr-only">: {c.name}</span><ArrowRight size={17} aria-hidden="true" className="az-flip" />
          </button>
          <Link href={v.href} className="az-text-link">{t.details}<span className="sr-only"> — {c.name}</span><ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </div>

    <p className="sr-only" aria-live="polite">{interacted ? `${c.name}, ${index + 1} ${t.of} ${n}` : ''}</p>

    <div ref={picker} className="az-sr-picker" data-lenis-prevent-wheel>
      <div className="az-sr-groups" aria-hidden="true">
        {(['heavy', 'dayana'] as const).map(line => <span key={line} className={`az-sr-group is-${line}`}>{fleetLines[line][locale]}</span>)}
      </div>
      <div className="az-sr-tabs" role="tablist" aria-label={t.picker} onKeyDown={onPickerKey}>
        {fleet.map((f, i) => <button key={f.id} id={`az-sr-tab-${f.id}`} data-vehicle={f.id} type="button" role="tab"
          aria-selected={i === index} aria-controls="az-sr-panel" tabIndex={i === index ? 0 : -1}
          className={`az-sr-tab is-${f.line}`} onClick={() => show(i, i > index ? 1 : -1)}>
          <img src={fleetImage(f.image, 240)} width={240} height={134} alt="" loading="lazy" decoding="async" draggable={false} />
          <span>{f[locale].short}</span>
        </button>)}
      </div>
    </div>

    <VehicleQuoteDialog open={dialogOpen} vehicle={v} onClose={() => setDialogOpen(false)} />
  </div>;
}
