import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link, useLocale } from '@/site/locale';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { photoSrcSet, photoUrl, photos } from '@/config/photography';
import { businessContacts, logisticsQuickCall, whatsappLink } from '@/config/business-contacts';
import { loadGsap } from '@/motion/gsap';
import { usePrefersReducedMotion } from '@/motion/reduced-motion';
import { createFrameSequence } from './frame-sequence';
import { CINEMATIC_SETS, PORTRAIT_QUERY, cine } from './cinematic-assets';

const SETS = CINEMATIC_SETS;

// The two businesses use the names in the site's structured data (seo/site.ts), so people,
// search engines and AI assistants see one consistent set of entities: Airzone Group is the
// parent of Airzone Travel & Tourism and Airzone Logistics. Contacts and destinations come
// from config (business-contacts.ts) and existing routes; nothing here is a new claim.
const C = {
  en: {
    scene: 'A commercial airliner flies over a tropical island through dense clouds.',
    title: 'Travel and logistics, under one group.',
    lead: 'Airzone Group is the parent company of two businesses in Saudi Arabia: Airzone Travel & Tourism, for holidays and business travel from Riyadh, and Airzone Logistics, for customs clearance support, road transportation and warehousing across Saudi Arabia and the GCC.',
    services: 'services',
    whatsapp: 'WhatsApp', call: 'Call',
    newTab: '(opens in a new tab)',
    travel: {
      name: 'Airzone Travel & Tourism', href: '/travel',
      meta: 'Holidays and business travel · Riyadh office',
      text: 'Flights, hotels, holiday packages and visa assistance, planned around your dates and budget, with options and prices confirmed before you book.',
      alt: 'Commercial airliner flying over a tropical island and turquoise water',
      links: [['Flights', '/travel/flights'], ['Hotels', '/travel/hotels'], ['Holiday packages', '/travel/holiday-packages'], ['Corporate travel', '/travel/corporate-travel']],
      primary: ['Plan your trip', '/travel/enquiry'],
    },
    logistics: {
      name: 'Airzone Logistics', href: '/logistics',
      meta: 'Saudi Arabia and the GCC',
      text: 'Customs clearance support, GCC road freight, heavy trailers, temperature-controlled warehousing in four Saudi cities and Dayana local delivery, with every quotation confirmed in writing.',
      links: [['Customs clearance', '/logistics/customs-clearance'], ['Transportation', '/logistics/transportation'], ['Warehousing', '/logistics/warehousing'], ['Dayana local delivery', '/logistics/dayana-local-delivery']],
      primary: ['Request a logistics quote', '/logistics/request-quote'],
    },
  },
  ar: {
    scene: 'طائرة ركاب تحلق فوق جزيرة استوائية بين سحب كثيفة.',
    title: 'السفر والخدمات اللوجستية ضمن مجموعة واحدة.',
    lead: 'مجموعة إيرزون هي الشركة الأم لنشاطين في المملكة العربية السعودية: إيرزون للسفر والسياحة لسفر العطلات والأعمال من الرياض، وإيرزون للخدمات اللوجستية لدعم التخليص الجمركي والنقل البري والتخزين في المملكة ودول الخليج.',
    services: 'الخدمات',
    whatsapp: 'واتساب', call: 'اتصال',
    newTab: '(يفتح في نافذة جديدة)',
    travel: {
      name: 'إيرزون للسفر والسياحة', href: '/travel',
      meta: 'سفر العطلات والأعمال · مكتب الرياض',
      text: 'رحلات طيران وفنادق وباقات عطلات ومساعدة في التأشيرات، وفق مواعيدك وميزانيتك، مع تأكيد الخيارات والأسعار قبل الحجز.',
      alt: 'طائرة ركاب تحلق فوق جزيرة استوائية ومياه فيروزية',
      links: [['الطيران', '/travel/flights'], ['الفنادق', '/travel/hotels'], ['باقات العطلات', '/travel/holiday-packages'], ['سفر الشركات', '/travel/corporate-travel']],
      primary: ['خطط لرحلتك', '/travel/enquiry'],
    },
    logistics: {
      name: 'إيرزون للخدمات اللوجستية', href: '/logistics',
      meta: 'المملكة العربية السعودية ودول الخليج',
      text: 'دعم التخليص الجمركي والشحن البري الخليجي والمقطورات الثقيلة والتخزين المتحكم بحرارته في أربع مدن سعودية وخدمة Dayana للتوصيل المحلي، مع تأكيد كل عرض سعر كتابياً.',
      links: [['التخليص الجمركي', '/logistics/customs-clearance'], ['النقل', '/logistics/transportation'], ['التخزين', '/logistics/warehousing'], ['Dayana للتوصيل المحلي', '/logistics/dayana-local-delivery']],
      primary: ['اطلب عرض سعر لوجستي', '/logistics/request-quote'],
    },
  },
};

/**
 * Homepage opening: a full-screen, scroll-driven airplane scene followed by the
 * two Airzone businesses.
 *
 * Structure: a tall wrapper holds a CSS `position: sticky` stage, so the scene
 * stays in place for the length of the wrapper without a pin spacer (no layout
 * shift, no extra reflow on mobile address-bar resizes, and it already works in
 * the server-rendered HTML before any script runs). GSAP ScrollTrigger scrubs one
 * timeline across the wrapper: frames of the animation drawn to a canvas, a slow
 * push-in, and a navy veil as the divisions section rises over the scene
 * (it overlaps the last viewport of the wrapper via a negative margin).
 *
 * Layers inside the stage, back to front: the scene (a sharp still of the
 * opening shot, then the canvas frames), a contrast shade, the homepage hero
 * copy passed in as `children` (headline, description, CTAs), and the veil.
 * The copy is fully visible at the top of the page and lifts away early in the
 * scroll so the rest of the flight plays unobstructed; scrolling back restores
 * it. The site header floats over the stage (transparent, then a navy glass,
 * then the standard solid header once the divisions arrive).
 *
 * Without scripts, under reduced motion, or if frames fail to load, the sharp
 * still and the hero copy are shown and the page scrolls normally.
 */
export function CinematicOpening({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const c = C[locale];
  const reduced = usePrefersReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const divisions = useRef<HTMLElement>(null);

  // The header's look over the scene (transparent, then glass that follows the section underneath)
  // is handled by the Header itself (data-tone / data-lift).

  useEffect(() => {
    if (reduced) return;
    const w = wrap.current, cv = canvas.current, v = veil.current, d = divisions.current;
    const po = poster.current, sh = shade.current, co = copy.current;
    if (!w || !cv || !v || !d || !po || !sh || !co) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const rtl = document.documentElement.dir === 'rtl';
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add({ motion: '(prefers-reduced-motion: no-preference)', portrait: PORTRAIT_QUERY, desktop: '(min-width: 901px)' }, ctx => {
        if (!ctx.conditions?.motion) return;
        const { portrait, desktop } = ctx.conditions;
        const set = SETS[portrait ? 'm' : 'd'];
        const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
        const seq = createFrameSequence(cv, set, { coarseOnly: saveData });
        // f: frame position (fractional; the renderer blends neighbouring frames).
        // z: slow camera push-in, applied by the renderer when it crops the source
        // frame, so the picture is resampled once instead of again by a CSS scale.
        const state = { f: 0, z: 1 };
        // Frames run through the first ~70% of the scroll; the rest belongs to the reveal.
        // The sharp opening still hands over to the frames in the first few percent
        // (the frame drawn there is the same picture), and the hero copy lifts away
        // by ~20% so the flight is unobstructed. autoAlpha also sets visibility, so
        // the faded-out links cannot receive focus.
        // Lenis already smooths wheel input, so the scrub only needs a short catch-up
        // (0.35 s): the scene follows the scroll closely without a sluggish lag.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: w, start: 'top top', end: 'bottom bottom', scrub: 0.35, invalidateOnRefresh: true },
          onUpdate: () => seq.render(state.f, state.z),
        });
        tl.to(state, { f: set.count - 1, duration: 0.7 }, 0)
          .to(state, { z: desktop ? 1.08 : 1.05, duration: 1 }, 0)
          .fromTo(po, { opacity: 1 }, { opacity: 0, duration: 0.03 }, 0.005)
          .fromTo(co, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -70, duration: 0.15 }, 0.04)
          .fromTo(sh, { opacity: 1 }, { opacity: 0, duration: 0.18 }, 0.04)
          .fromTo(v, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.62);

        // The section rises over the scene: the group lockup first, then it branches into its two
        // businesses (stem, bar, one drop per card); each photo opens downwards from the branch and
        // the details follow. Scrubbed like the scene, so scrolling back plays it in reverse.
        const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, d);
        const panels = q('.az-div-panel');
        const headItems = q('.az-div-head > *');
        if (desktop) {
          const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: d, start: 'top 92%', end: 'top 18%', scrub: 1 } });
          tl.fromTo(q('.az-div-glow'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
            .from(headItems, { y: 32, opacity: 0, duration: 0.3, stagger: 0.07 }, 0)
            .from(q('.az-div-stem'), { scaleY: 0, duration: 0.14 }, 0.36)
            .from(q('.az-div-branch'), { scaleX: 0, duration: 0.16 }, 0.48)
            .from(q('.az-div-branch > i'), { scaleY: 0, duration: 0.1 }, 0.62);
          panels.forEach((p, i) => {
            const at = 0.56 + i * 0.05;
            const side = (i === 0) !== rtl ? -1 : 1; // the first business enters from the reading start
            tl.from(p, { x: 28 * side, y: 56, opacity: 0, duration: 0.34 }, at)
              // A curtain slides down off the photo (a composited transform; animating clip-path would repaint the photo every frame).
              .fromTo(p.querySelector('.az-div-curtain'), { yPercent: 0 }, { yPercent: 101, duration: 0.34 }, at + 0.04)
              .from(p.querySelectorAll('.az-div-body > *'), { y: 16, opacity: 0, duration: 0.2, stagger: 0.035 }, at + 0.12);
          });
        } else {
          // Phones and tablets: a lighter rise, each card on its own as it scrolls in.
          gsap.from(headItems, { y: 28, opacity: 0, ease: 'none', stagger: 0.06, scrollTrigger: { trigger: d, start: 'top 92%', end: 'top 45%', scrub: 1 } });
          panels.forEach(p => gsap.from(p, { y: 60, opacity: 0, ease: 'none', scrollTrigger: { trigger: p, start: 'top 95%', end: 'top 55%', scrub: 1 } }));
        }
        seq.ready.then(() => { if (!cancelled) seq.render(state.f, state.z); });
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('load', refresh, { once: true });
        return () => {
          window.removeEventListener('load', refresh);
          seq.dispose();
        };
      });
    }).catch(() => { /* the poster frame stays visible */ });
    return () => { cancelled = true; revert?.(); };
    // Rebuilt on a language switch: the page stays mounted (client-side route
    // change), but text direction changes the panels' entry sides, so the old
    // context is reverted and a fresh one reads the new direction.
  }, [reduced, locale]);

  const logistics = photos.truckDesert;
  return <>
    <div className="az-cine" ref={wrap}>
      <div className="az-cine-stage">
        <div className="az-cine-zoom" role="img" aria-label={c.scene}>
          <canvas ref={canvas} className="az-cine-canvas" aria-hidden="true" />
          <picture>
            <source media="(max-aspect-ratio: 3/4)" srcSet={cine('poster-p.webp')} width={640} height={821} />
            <source media={PORTRAIT_QUERY} srcSet={cine('poster-m.webp')} width={1077} height={821} />
            <img ref={poster} className="az-cine-poster" src={cine('poster-d.webp')} width={1915} height={821} alt="" fetchPriority="high" decoding="async" />
          </picture>
        </div>
        <div className="az-cine-shade" ref={shade} aria-hidden="true" />
        <div className="az-cine-copy" ref={copy}>{children}</div>
        <div className="az-cine-veil" ref={veil} aria-hidden="true" />
      </div>
    </div>

    <section className="az-divisions" ref={divisions} aria-labelledby="az-div-title">
      <div className="az-div-glow" aria-hidden="true" />
      <div className="az-container az-div-inner">
        <div className="az-div-head">
          {/* Parent brand: the official Airzone Group logo on its white plate (its dark lettering needs a light ground). */}
          <span className="az-div-brand"><BrandLogo division="group" sizes="(max-width: 520px) 180px, 220px" /></span>
          <h2 id="az-div-title">{c.title}</h2>
          <p className="az-div-lead">{c.lead}</p>
        </div>
        {/* The group branches into its two businesses (desktop): stem, bar, one drop per card. */}
        <div className="az-div-tree" aria-hidden="true">
          <span className="az-div-stem" />
          <span className="az-div-branch is-travel"><i /></span>
          <span className="az-div-branch is-logistics"><i /></span>
        </div>
        <div className="az-div-grid">
          <DivisionCard id="travel" c={c} copy={c.travel}
            media={<img className="az-div-img" src={cine('travel.webp')} width={1672} height={941} alt={c.travel.alt} loading="lazy" decoding="async" />}
            whatsapp={whatsappLink(businessContacts.travel, locale)} phone={businessContacts.travel.phone} />
          <DivisionCard id="logistics" c={c} copy={c.logistics}
            media={<img className="az-div-img" src={photoUrl(logistics, 1400)} srcSet={photoSrcSet(logistics)} sizes="(min-width: 901px) 50vw, 100vw"
              width={logistics.width} height={logistics.height} alt={locale === 'ar' ? logistics.altAr ?? logistics.alt : logistics.alt} loading="lazy" decoding="async" />}
            whatsapp={whatsappLink(businessContacts.logistics, locale)} phone={logisticsQuickCall} />
        </div>
      </div>
    </section>
  </>;
}

type Copy = (typeof C)['en'] | (typeof C)['ar'];

/**
 * One business of the group: photo and official logo, what it does, its main services
 * (crawlable links), one primary enquiry and direct WhatsApp / phone contacts for that
 * business only. data-division keeps the click analytics attributed to the right team.
 */
function DivisionCard({ id, c, copy, media, whatsapp, phone }: {
  id: 'travel' | 'logistics'; c: Copy;
  copy: { name: string; href: string; meta: string; text: string; links: readonly (readonly string[])[]; primary: readonly string[] };
  media: ReactNode; whatsapp: string | null; phone: { label: string; href: string } | null;
}) {
  const [primaryLabel, primaryHref] = copy.primary;
  // Scroll animation moves the article; the inner card carries the surface and the hover lift
  // (GSAP writes inline transforms on what it animates, which would cancel a CSS hover transform).
  return <article className={`az-div-panel az-div-${id}`} aria-labelledby={`az-div-${id}`} data-division={id}>
    <div className="az-div-card">
    <div className="az-div-media">
      {media}
      {/* Covers the photo only while the scroll reveal plays (moved out of view by default, so without scripts it never shows). */}
      <span className="az-div-curtain" aria-hidden="true" />
      <span className={`az-div-logo ${id === 'logistics' ? 'az-div-logo-wide' : ''}`}><BrandLogo division={id} sizes={id === 'logistics' ? '200px' : '64px'} /></span>
    </div>
    <div className="az-div-body">
      <h3 id={`az-div-${id}`}><Link href={copy.href} className="az-div-title">{copy.name}<ArrowUpRight size={22} aria-hidden="true" className="az-flip" /></Link></h3>
      <p className="az-div-meta">{copy.meta}</p>
      <p className="az-div-text">{copy.text}</p>
      <ul className="az-div-links" aria-label={`${copy.name}: ${c.services}`}>
        {copy.links.map(([label, href]) => <li key={href}><Link href={href}>{label}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link></li>)}
      </ul>
      <div className="az-div-actions">
        <Link href={primaryHref} className="az-btn az-div-primary">{primaryLabel}<ArrowRight size={18} aria-hidden="true" className="az-flip" /></Link>
        <div className="az-div-contact">
          {whatsapp && <a className="az-div-chip is-wa" href={whatsapp} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp aria-hidden="true" focusable="false" /><span>{c.whatsapp}</span><span className="sr-only">: {copy.name} {c.newTab}</span>
          </a>}
          {phone && <a className="az-div-chip" href={phone.href}>
            <Phone size={17} aria-hidden="true" /><span>{c.call}</span><span className="sr-only">: {copy.name},</span> <span className="az-div-num" dir="ltr">{phone.label}</span>
          </a>}
        </div>
      </div>
    </div>
    </div>
  </article>;
}
