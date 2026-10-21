import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { photos, photoSrcSet, photoUrl, type Photo, type PhotoKey } from '@/config/photography';
import type { CatalogEntry } from '@/config/service-catalog';
import SpotlightCard from '@/components/SpotlightCard';

export function Eyebrow({ children, light = false, index }: { children: ReactNode; light?: boolean; index?: string }) {
  return <p className={`az-eyebrow ${light ? 'az-eyebrow-light' : ''} ${index ? 'has-index' : ''}`}>{index && <span className="az-eyebrow-n" aria-hidden="true">{index}</span>}{children}</p>;
}

/** Responsive editorial photograph with intrinsic dimensions (no layout shift). */
export function PhotoImg({ photo, sizes, eager = false, className = '', parallax = false, heroBg = false, deferred = false }: {
  photo: Photo | PhotoKey; sizes: string; eager?: boolean; className?: string; parallax?: boolean; heroBg?: boolean;
  /** Leave out the source until the caller is ready, so the download does not compete with the page's first paint. */
  deferred?: boolean;
}) {
  const { locale } = useLocale();
  const p: Photo = typeof photo === 'string' ? photos[photo] : photo;
  return <img className={className} src={deferred ? undefined : photoUrl(p, 1400)} srcSet={deferred ? undefined : photoSrcSet(p)} sizes={sizes}
    width={p.width} height={p.height} alt={locale === 'ar' ? p.altAr ?? p.alt : p.alt}
    loading={eager ? 'eager' : 'lazy'} decoding={eager ? 'sync' : 'async'} fetchPriority={eager ? 'high' : 'auto'}
    data-parallax={parallax ? '' : undefined} data-hero-bg={heroBg ? '' : undefined}
    data-focus={p.focus ? '' : undefined} data-focus-m={p.focusMobile ? '' : undefined}
    style={p.focus || p.focusMobile ? { '--focus': p.focus, '--focus-m': p.focusMobile ?? p.focus } as CSSProperties : undefined} />;
}

/**
 * Wraps each word in a clipping span so the hero headline can rise word by
 * word (pure CSS, see .az-w). Spaces stay as text so screen readers and search
 * engines read the heading normally.
 */
export function SplitWords({ text, start = 0 }: { text: string; start?: number }) {
  let i = start;
  return <>{text.split(/(\s+)/).map((w, k) => (/^\s*$/.test(w) ? w : <span className="az-w" key={k}><span style={{ '--i': i++ } as CSSProperties}>{w}</span></span>))}</>;
}
export const wordCount = (text: string) => text.trim().split(/\s+/).length;

export type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  const { locale } = useLocale();
  return <nav className={`az-crumbs ${light ? 'az-crumbs-light' : ''}`} aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
    <ol>{items.map((c, i) => <li key={`${c.label}-${i}`}>
      {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
      {i < items.length - 1 && <ChevronRight size={13} aria-hidden="true" className="az-flip" />}
    </li>)}</ol>
  </nav>;
}

/** Page header band. Without a photo it renders as a plain navy band (legal and utility pages). */
export function PageHero({ eyebrow, title, intro, photo, crumbs, children, aside, compact = false, split = false }: {
  eyebrow: string; title: ReactNode; intro: ReactNode; photo?: PhotoKey; crumbs: Crumb[];
  children?: ReactNode; aside?: ReactNode; compact?: boolean; split?: boolean;
}) {
  return <section className={`az-page-hero ${compact ? 'az-page-hero-compact' : ''} ${photo ? '' : 'az-page-hero-plain'} ${split && photo ? 'az-page-hero-split' : ''}`}>
    {photo && <div className="az-page-hero-media" aria-hidden="true"><PhotoImg photo={photo} sizes={split ? '(min-width: 1100px) 56vw, 100vw' : '100vw'} eager heroBg={!split} /></div>}
    <div className="az-container az-page-hero-inner">
      <Breadcrumbs items={crumbs} light />
      <p className="az-eyebrow az-eyebrow-light" data-hero-item="eyebrow">{eyebrow}</p>
      <h1>{typeof title === 'string' ? <SplitWords text={title} start={1} /> : title}</h1>
      <p className="az-page-hero-intro" data-hero-item="text">{intro}</p>
      {children && <div className="az-hero-actions">{children}</div>}
      {aside}
    </div>
  </section>;
}

export function SectionHead({ eyebrow, title, text, id, light = false, align = 'start', index, children }: {
  eyebrow: string; title: ReactNode; text?: ReactNode; id?: string; light?: boolean; align?: 'start' | 'center'; index?: string; children?: ReactNode;
}) {
  return <div className={`az-section-head az-align-${align} ${light ? 'is-light' : ''}`}>
    <div>
      <Eyebrow light={light} index={index}>{eyebrow}</Eyebrow>
      <h2 id={id} data-reveal>{title}</h2>
    </div>
    {(text || children) && <div className="az-section-head-aside" data-reveal data-delay="0.08">{text && <p>{text}</p>}{children}</div>}
  </div>;
}

export function ServiceCard({ entry, large = false }: { entry: CatalogEntry; large?: boolean }) {
  const { locale } = useLocale();
  const Icon = entry.icon;
  const copy = entry[locale];
  return <Link href={entry.path} className={`az-service-card az-group-${entry.group} ${large ? 'is-large' : ''}`}>
    <span className="az-service-media"><PhotoImg photo={entry.photo} sizes={large ? '(min-width: 1100px) 50vw, 100vw' : '(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 100vw'} /></span>
    <span className="az-service-body">
      <span className="az-service-icon"><Icon size={20} aria-hidden="true" /></span>
      <span className="az-service-title">{copy.name}</span>
      <span className="az-service-text">{copy.short}</span>
      <span className="az-service-more">{locale === 'ar' ? 'اعرف المزيد' : 'Learn more'}<ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></span>
    </span>
  </Link>;
}

/**
 * React Bits SpotlightCard with the Airzone preset: a soft brand-blue light that
 * follows the pointer (or keyboard focus) across content cards. Existing card
 * borders and shadows are kept; the component honours reduced motion.
 */
export function SpotCard({ className, children }: { className: string; children: ReactNode }) {
  return <SpotlightCard className={className} theme="light" spotlightColor="#0d5fc4" intensity={0.5} spotlightSize={260} borderGlow={0.9} proximity={0} smoothing={0.25}
    style={{ '--spotlight-card-border': 'transparent', '--spotlight-card-shadow': 'none' } as CSSProperties}>{children}</SpotlightCard>;
}
