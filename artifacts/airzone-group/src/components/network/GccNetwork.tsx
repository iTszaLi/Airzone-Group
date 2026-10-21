import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/site/locale';
import { usePrefersReducedMotion } from '@/motion/reduced-motion';
import { bahrain, coastline, nodes, project, routes } from './gcc-geo';

const toPath = (pts: [number, number][]) => pts.map(([lon, lat], i) => { const p = project(lat, lon); return `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; }).join(' ');
const COAST = toPath(coastline);
const BAHRAIN = toPath(bahrain);

/**
 * Illustrative GCC network: Saudi warehouse cities (green) and GCC road
 * destinations (blue). The SVG version is server-rendered and always
 * available; a lightweight Three.js scene progressively replaces it on
 * capable devices once the section is near the viewport.
 */
export function GccNetwork() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const reduced = usePrefersReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const labelRefs = useRef(new Map<string, HTMLElement>());
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || reduced) return;
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return;
    (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();

    let scene: { setVisible: (v: boolean) => void; dispose: () => void } | null = null;
    let cancelled = false;
    let inView = false;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !scene && !cancelled) {
        import('./gcc-network-scene').then(({ createNetworkScene }) => {
          if (cancelled) return;
          scene = createNetworkScene(el, labelRefs.current, () => {
            // WebGL context lost: release the scene and fall back to the static map.
            scene?.dispose(); scene = null; setLive(false);
          });
          setLive(true);
          scene.setVisible(inView);
        }).catch(() => setLive(false));
      }
      scene?.setVisible(inView);
    }, { rootMargin: '200px 0px' });
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); scene?.dispose(); setLive(false); };
  }, [reduced]);

  const pos = Object.fromEntries(nodes.map(n => [n.id, project(n.lat, n.lon)]));
  const label = ar
    ? 'رسم توضيحي لمدن المستودعات في المملكة ووجهات النقل البري في دول الخليج'
    : 'Illustrative map of Saudi warehouse cities and GCC road transportation destinations';

  return <figure className={`az-net ${live ? 'az-net-live' : ''}`}>
    <div className="az-net-stage" ref={host} role="img" aria-label={label}>
      <svg className="az-net-svg" viewBox="0 0 600 300" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="az-net-dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" /></pattern>
        </defs>
        <rect className="az-net-grid" width="600" height="300" fill="url(#az-net-dots)" />
        <path className="az-net-coast" d={COAST} />
        <path className="az-net-coast" d={BAHRAIN} />
        {routes.map(([a, b]) => {
          const p = pos[a], q = pos[b];
          const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2 - Math.hypot(q.x - p.x, q.y - p.y) * 0.22;
          return <path key={`${a}-${b}`} className="az-net-route" d={`M${p.x} ${p.y} Q${mx} ${my} ${q.x} ${q.y}`} />;
        })}
        {nodes.map(n => <g key={n.id} className={`az-net-node az-net-${n.kind}`}>
          <circle cx={pos[n.id].x} cy={pos[n.id].y} r="9" className="az-net-halo" />
          <circle cx={pos[n.id].x} cy={pos[n.id].y} r="4.5" />
        </g>)}
      </svg>
      <div className="az-net-labels" aria-hidden="true">
        {nodes.map(n => <span key={n.id}
          ref={el => { if (el) labelRefs.current.set(n.id, el); else labelRefs.current.delete(n.id); }}
          className={`az-net-label az-net-label-${n.kind} az-net-at-${n.label}`}
          style={live ? undefined : { left: `${(pos[n.id].x / 600) * 100}%`, top: `${(pos[n.id].y / 300) * 100}%` }}>
          {ar ? n.ar : n.en}
        </span>)}
      </div>
    </div>
    <figcaption className="az-net-legend">
      <span><i className="az-dot az-dot-green" />{ar ? 'مدن المستودعات المتحكم بحرارتها' : 'Temperature-controlled warehouse cities'}</span>
      <span><i className="az-dot az-dot-blue" />{ar ? 'وجهات خليجية، تُؤكَّد لكل مسار' : 'GCC destinations, confirmed route by route'}</span>
      <small>{ar ? 'رسم توضيحي؛ المسارات لا تمثل جداول ثابتة.' : 'Illustrative only; routes are not fixed schedules.'}</small>
    </figcaption>
  </figure>;
}
