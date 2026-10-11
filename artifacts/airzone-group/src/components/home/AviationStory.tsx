import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import type { PlaneState } from './aviation-scene';
import './aviation.css';

type LinkLike = (props: { href: string; className?: string; children?: ReactNode }) => ReactNode;
type LogoLike = (props: { division?: 'group' | 'logistics' | 'travel'; className?: string }) => ReactNode;

const COPY = {
  en: {
    brand: 'AIRZONE GROUP', tagline: 'Beyond Every Destination.', lines: 'Aviation. Travel. Logistics.', scroll: 'Scroll to Explore',
    heroNote: 'A Saudi group bringing logistics support and travel planning together under one standard of service.',
    avKicker: '01 / Travel', avTitle: 'Connecting the World, One Journey at a Time.',
    av: [
      ['Commercial Aviation', 'Flight bookings arranged on scheduled commercial airlines for leisure and business travellers.', '/travel/flights'],
      ['Global Destinations', 'Holidays and hotels planned around the places you choose.', '/travel/holiday-packages'],
      ['Seamless Travel Experiences', 'Airport transfers and corporate travel coordinated by one team.', '/travel/airport-transfers'],
    ],
    logKicker: '02 / Airzone Logistics', logTitle: 'Moving Business Beyond Borders.',
    log: [
      ['Air Freight & Cargo', 'Time-sensitive consignments booked and coordinated with air carriers.', '/logistics/air-freight'],
      ['Customs Clearance', 'Documentation prepared and checked for smoother clearance.', '/logistics/customs-clearance'],
      ['Exhibition & Event Logistics', 'Movement of exhibition material and event equipment, planned to your dates.', '/logistics/exhibition-event-logistics'],
      ['Project Cargo & Freight Forwarding', 'Forwarding arrangements scoped case by case to each shipment and its requirements.', '/logistics/freight-forwarding'],
    ],
    engKicker: '03 / Standards', engTitle: 'Precision in Every Detail.',
    eng: [
      ['Aircraft Design & Engineering', 'The aircraft on this page is an illustrative study, a reminder of the precision the industry runs on.'],
      ['Flight Performance', 'We plan around airline schedules, routings and connections so journeys and consignments keep moving.'],
      ['Global Cargo Connectivity', 'Transport options discussed with carriers and partners according to each shipment.'],
      ['Operational Excellence', 'Documents, dates and requirements checked before they become problems.'],
    ],
    engNote: 'Illustrative aircraft study; not a representation of an Airzone-owned fleet or an aircraft manufacturing service.',
    bp: ['REF. LENGTH', 'REF. SPAN', 'PLAN VIEW', 'ILLUSTRATIVE STUDY'],
    finTag: 'One Group. Multiple Possibilities. Global Reach.', finExplore: 'Explore Our Businesses',
    finLog: 'Airzone Logistics', finLogSub: 'Customs, freight and cargo coordination',
    finTrv: 'Airzone Travels', finTrvSub: 'Flights, holidays and corporate travel',
    loading: 'Preparing flight view',
  },
  ar: {
    brand: 'مجموعة إيرزون', tagline: 'ما وراء كل وجهة.', lines: 'الطيران. السفر. الخدمات اللوجستية.', scroll: 'مرّر للاستكشاف',
    heroNote: 'مجموعة سعودية تجمع الدعم اللوجستي وتخطيط السفر بمعيار خدمة واحد.',
    avKicker: '01 / السفر', avTitle: 'نربط العالم، رحلة تلو الأخرى.',
    av: [
      ['الطيران التجاري', 'حجوزات طيران على الرحلات التجارية المنتظمة لمسافري الترفيه والأعمال.', '/travel/flights'],
      ['وجهات عالمية', 'عطلات وفنادق حول الوجهات التي تختارها.', '/travel/holiday-packages'],
      ['تجارب سفر سلسة', 'خدمات المطار وسفر الأعمال بتنسيق فريق واحد.', '/travel/airport-transfers'],
    ],
    logKicker: '02 / إيرزون للخدمات اللوجستية', logTitle: 'ننقل الأعمال عبر الحدود.',
    log: [
      ['الشحن الجوي والبضائع', 'شحنات عاجلة تُحجز وتُنسق مع شركات النقل الجوي.', '/logistics/air-freight'],
      ['التخليص الجمركي', 'إعداد المستندات ومراجعتها لتخليص أكثر سلاسة.', '/logistics/customs-clearance'],
      ['لوجستيات المعارض والفعاليات', 'نقل مواد المعارض ومعدات الفعاليات وفق مواعيدك.', '/logistics/exhibition-event-logistics'],
      ['شحنات المشاريع والشحن والتوريد', 'ترتيبات شحن تُحدد لكل حالة وفق الشحنة ومتطلباتها.', '/logistics/freight-forwarding'],
    ],
    engKicker: '03 / المعايير', engTitle: 'الدقة في كل تفصيل.',
    eng: [
      ['تصميم الطائرات وهندستها', 'الطائرة في هذه الصفحة دراسة توضيحية، تذكير بالدقة التي تقوم عليها الصناعة.'],
      ['أداء الطيران', 'نخطط وفق جداول الرحلات والمسارات والربط لتستمر الرحلات والشحنات في الحركة.'],
      ['ربط الشحن العالمي', 'خيارات نقل تُناقش مع الناقلين والشركاء بحسب كل شحنة.'],
      ['التميز التشغيلي', 'نراجع المستندات والمواعيد والمتطلبات قبل أن تتحول إلى مشكلات.'],
    ],
    engNote: 'دراسة توضيحية لطائرة؛ لا تمثل أسطولاً مملوكاً لإيرزون ولا خدمة لتصنيع الطائرات.',
    bp: ['الطول المرجعي', 'الامتداد المرجعي', 'منظر علوي', 'دراسة توضيحية'],
    finTag: 'مجموعة واحدة. إمكانات متعددة. حضور عالمي.', finExplore: 'استكشف أعمالنا',
    finLog: 'إيرزون للخدمات اللوجستية', finLogSub: 'تنسيق الجمارك والشحن والبضائع',
    finTrv: 'إيرزون للسفر والسياحة', finTrvSub: 'الطيران والعطلات وسفر الأعمال',
    loading: 'جارٍ تجهيز مشهد الطيران',
  },
};

const S: PlaneState[] = [
  { x: 2.5, y: -0.25, z: 0, rx: 0.2, ry: -0.55, rz: 0.06, s: 1, edge: 0 },
  { x: -2.7, y: 0.55, z: -1, rx: -0.55, ry: 0.5, rz: 0.1, s: 1, edge: 0 },
  { x: 2.4, y: -1.0, z: 1, rx: 0.42, ry: -1.05, rz: -0.04, s: 0.95, edge: 0 },
  { x: 2.3, y: 0, z: 0, rx: -1.5708, ry: 0, rz: 0, s: 1.05, edge: 1 },
  { x: -0.6, y: 1.9, z: -30, rx: -0.3, ry: 1.35, rz: 0.12, s: 1, edge: 0 },
];

function StaticPlane() {
  return <svg className="av-static-plane" viewBox="0 0 400 120" aria-hidden="true" focusable="false">
    <path className="av-sp-fin" d="M40 58 L18 12 L40 12 L92 56 Z" />
    <path className="av-sp-body" d="M22 62 C44 55 74 53 112 53 L300 52 C342 52 372 56 390 64 C372 71 342 73 300 73 L112 73 C82 73 52 71 30 68 Z" />
    <path className="av-sp-wing" d="M172 67 L232 67 L152 106 L136 106 Z" />
    <ellipse className="av-sp-eng" cx="196" cy="84" rx="22" ry="8" />
    <path className="av-sp-line" d="M120 60 L330 60" />
  </svg>;
}

export function AviationStory({ locale, Link, BrandLogo }: { locale: Locale; Link: LinkLike; BrandLogo: LogoLike }) {
  const ar = locale === 'ar';
  const c = ar ? COPY.ar : COPY.en;
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const base = import.meta.env.BASE_URL;

  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(q.matches);
    update();
    q.addEventListener('change', update);
    return () => q.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = root.current, stageHost = host.current;
    if (!el || !stageHost) return;
    let webgl = false;
    if (!reduced && !failed) {
      const probe = document.createElement('canvas');
      const gl = (probe.getContext('webgl2') || probe.getContext('webgl')) as WebGLRenderingContext | null;
      webgl = !!gl;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    }
    if (reduced || !webgl) { el.dataset.av = 'static'; return; }

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    el.dataset.av = 'loading';
    const timeout = window.setTimeout(() => { if (!cleanup) { cancelled = true; el.dataset.av = 'static'; } }, 9000);

    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('./aviation-scene')])
      .then(async ([g, st, mod]) => {
        if (cancelled) return;
        const scene = await mod.createAviationScene(stageHost, { rtl: ar, onContextLost: () => setFailed(true) });
        if (cancelled) { scene.dispose(); return; }
        window.clearTimeout(timeout);
        const gsap = g.gsap; const ScrollTrigger = st.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const state: PlaneState = { ...S[0] };
        const push = () => scene.setState(state);
        push();

        const io = new IntersectionObserver(([e]) => scene.setVisible(e.isIntersecting), { rootMargin: '100px' });
        io.observe(el);

        const ctx = gsap.context(() => {
          const secs = gsap.utils.toArray<HTMLElement>('[data-av-sec]', el);
          const seg = (i: number, layers: (tl: gsap.core.Timeline) => void) => {
            const tl = gsap.timeline({ defaults: { ease: 'sine.inOut', immediateRender: false },
              scrollTrigger: { trigger: secs[i], start: 'top bottom', end: 'top 15%', scrub: 0.9 } });
            tl.fromTo(state, { ...S[i - 1] }, { ...S[i], duration: 1, onUpdate: push }, 0);
            layers(tl);
          };
          seg(1, tl => tl.fromTo('.av-l-clouds', { yPercent: 0 }, { yPercent: -18, duration: 1 }, 0));
          seg(2, tl => tl.fromTo('.av-l-ground', { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1 }, 0)
            .fromTo('.av-l-clouds', { yPercent: -18 }, { yPercent: -45, duration: 1 }, 0));
          seg(3, tl => tl.fromTo('.av-l-bp', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.2)
            .fromTo('.av-l-ground', { yPercent: 0, opacity: 1 }, { yPercent: 40, opacity: 0, duration: 1 }, 0));
          seg(4, tl => tl.fromTo('.av-l-bp', { opacity: 1 }, { opacity: 0, duration: 0.6 }, 0)
            .fromTo('.av-l-dusk', { opacity: 0 }, { opacity: 1, duration: 1 }, 0)
            .fromTo('.av-l-clouds', { yPercent: -45, opacity: 1 }, { yPercent: -10, opacity: 0.55, duration: 1 }, 0));

          // Blueprint draw while reading the engineering section
          const draw = gsap.timeline({ defaults: { ease: 'none' },
            scrollTrigger: { trigger: secs[3], start: 'top 40%', end: 'bottom 70%', scrub: 0.6 } });
          gsap.utils.toArray<SVGElement>('.av-bp-draw', el).forEach((p, i) => {
            draw.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1 }, i * 0.45);
          });
          draw.fromTo('.av-bp-label', { opacity: 0 }, { opacity: 1, stagger: 0.4, duration: 0.4 }, 0.3);

          // Gentle continuous sky drift over the whole story
          gsap.fromTo('.av-l-sky', { yPercent: 0 }, { yPercent: -8, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true } });
        }, el);

        el.dataset.av = 'live';
        cleanup = () => { io.disconnect(); ctx.revert(); scene.dispose(); };
      })
      .catch(() => { window.clearTimeout(timeout); if (!cancelled) el.dataset.av = 'static'; });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      cleanup?.();
      cleanup = undefined;
      el.dataset.av = 'static';
    };
  }, [ar, reduced, failed]);

  return <section className="av" ref={root} data-av="static" aria-labelledby="av-title" data-testid="section-aviation-story">
    <div className="av-stage" aria-hidden="true">
      <div className="av-l av-l-sky" />
      <img className="av-l av-l-ground" src={`${base}assets/aviation/ground.webp`} alt="" loading="lazy" decoding="async" />
      <img className="av-l av-l-clouds" src={`${base}assets/aviation/clouds.webp`} alt="" decoding="async" />
      <div className="av-l av-l-dusk" />
      <div className="av-l av-l-bp">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="av-bp-svg">
          <line className="av-bp-draw" pathLength={1} x1="12" y1="50" x2="88" y2="50" />
          <line className="av-bp-draw" pathLength={1} x1="50" y1="8" x2="50" y2="92" />
          <path className="av-bp-draw" pathLength={1} d="M14 90 L86 90 M14 87 L14 93 M86 87 L86 93" />
          <path className="av-bp-draw" pathLength={1} d="M94 10 L94 90 M91 10 L97 10 M91 90 L97 90" />
          <circle className="av-bp-draw" pathLength={1} cx="50" cy="50" r="22" />
          <path className="av-bp-draw" pathLength={1} d="M30 28 L42 28 L42 40 M70 72 L58 72 L58 60" />
        </svg>
        <span className="av-bp-label av-bp-l1">{c.bp[0]}</span>
        <span className="av-bp-label av-bp-l2">{c.bp[1]}</span>
        <span className="av-bp-label av-bp-l3">{c.bp[2]}</span>
        <span className="av-bp-label av-bp-l4">{c.bp[3]}</span>
      </div>
      <div className="av-canvas-host" ref={host} />
      <div className="av-fallback"><StaticPlane /></div>
      <div className="av-loader"><span /><em>{c.loading}</em></div>
    </div>

    <div className="av-content">
      <div className="av-sec av-hero" data-av-sec>
        <div className="av-wrap">
          <h1 id="av-title" className="av-h1">
            <span className="av-brand" data-reveal>{c.brand}</span>
            <span className="av-tag" data-reveal data-delay="0.1">{c.tagline}</span>
          </h1>
          <p className="av-lines" data-reveal data-delay="0.2">{c.lines}</p>
          <p className="av-note" data-reveal data-delay="0.28">{c.heroNote}</p>
          <a href="#av-aviation" className="av-scroll" data-testid="link-scroll-explore">{c.scroll} <ArrowDown size={15} aria-hidden="true" /></a>
        </div>
      </div>

      <div className="av-sec av-aviation" id="av-aviation" data-av-sec>
        <div className="av-wrap av-side-start">
          <div className="av-kick" data-reveal><i />{c.avKicker}</div>
          <h2 className="av-h2" data-reveal>{c.avTitle}</h2>
          <ul className="av-list">{c.av.map(([t, d, h], i) => <li key={h} data-reveal data-delay={String(i * 0.08)}>
            <Link href={h} className="av-item"><b>{t}</b><span>{d}</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
          </li>)}</ul>
        </div>
      </div>

      <div className="av-sec av-logistics" data-av-sec>
        <div className="av-wrap av-side-end">
          <div className="av-kick" data-reveal><i />{c.logKicker}</div>
          <h2 className="av-h2" data-reveal>{c.logTitle}</h2>
          <ul className="av-list">{c.log.map(([t, d, h], i) => <li key={t} data-reveal data-delay={String(i * 0.06)}>
            <Link href={h} className="av-item"><b>{t}</b><span>{d}</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
          </li>)}</ul>
        </div>
      </div>

      <div className="av-sec av-eng" data-av-sec>
        <div className="av-wrap av-side-start">
          <div className="av-kick av-kick-light" data-reveal><i />{c.engKicker}</div>
          <h2 className="av-h2 av-light" data-reveal>{c.engTitle}</h2>
          <ol className="av-eng-list">{c.eng.map(([t, d], i) => <li key={t} data-reveal>
            <i>0{i + 1}</i><b>{t}</b><span>{d}</span>
          </li>)}</ol>
          <p className="av-disclaim">{c.engNote}</p>
        </div>
      </div>

      <div className="av-sec av-final" data-av-sec>
        <div className="av-wrap av-final-inner">
          <BrandLogo division="group" className="av-final-logo" />
          <h2 className="av-final-h" data-reveal>{c.brand}</h2>
          <p className="av-final-tag" data-reveal data-delay="0.1">{c.finTag}</p>
          <a href="#businesses" className="av-final-explore" data-testid="link-explore-businesses">{c.finExplore} <ArrowDown size={15} aria-hidden="true" /></a>
          <div className="av-final-links">
            <Link href="/logistics" className="av-biz"><BrandLogo division="logistics" className="av-biz-logo" /><span><b>{c.finLog}</b><em>{c.finLogSub}</em></span><ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link href="/travel" className="av-biz"><BrandLogo division="travel" className="av-biz-logo" /><span><b>{c.finTrv}</b><em>{c.finTrvSub}</em></span><ArrowUpRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
