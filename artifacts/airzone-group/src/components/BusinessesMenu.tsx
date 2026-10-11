import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

type LinkLike = (props: { href: string; className?: string; children?: ReactNode; onClick?: () => void; 'data-testid'?: string }) => ReactNode;
type LogoLike = (props: { division?: 'group' | 'logistics' | 'travel'; className?: string }) => ReactNode;

const COPY = {
  en: {
    label: 'Our Businesses',
    items: [
      { href: '/logistics', division: 'logistics' as const, n: '01', eyebrow: 'AIRZONE LOGISTICS', name: 'Airzone Logistics',
        text: 'Customs clearance, ATA Carnet assistance, exhibition and event logistics, freight forwarding, import/export support and cargo coordination.', cta: 'Explore Logistics' },
      { href: '/travel', division: 'travel' as const, n: '02', eyebrow: 'AIRZONE TRAVEL & TOURISM', name: 'Airzone Travel & Tourism',
        text: 'Flight assistance, holiday planning, hotel arrangements, destination experiences, group travel and corporate travel.', cta: 'Explore Travel & Tourism' },
    ],
  },
  ar: {
    label: 'أعمالنا',
    items: [
      { href: '/logistics', division: 'logistics' as const, n: '01', eyebrow: 'إيرزون للخدمات اللوجستية', name: 'إيرزون للخدمات اللوجستية',
        text: 'التخليص الجمركي، والمساعدة في دفاتر ATA Carnet، وخدمات لوجستيات المعارض والفعاليات، وخدمات الشحن، ودعم الاستيراد والتصدير، وتنسيق الشحنات.', cta: 'استكشف الخدمات اللوجستية' },
      { href: '/travel', division: 'travel' as const, n: '02', eyebrow: 'إيرزون للسفر والسياحة', name: 'إيرزون للسفر والسياحة',
        text: 'المساعدة في الطيران، وتخطيط العطلات، وترتيبات الفنادق، وتجارب الوجهات، والسفر الجماعي، وسفر الأعمال.', cta: 'استكشف السفر والسياحة' },
    ],
  },
};

export function BusinessesMenu({ locale, path, Link, BrandLogo, active, onNavigate }: {
  locale: 'en' | 'ar'; path: string; Link: LinkLike; BrandLogo: LogoLike; active: boolean; onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const focusFirstOnOpen = useRef(false);
  const previousRoute = useRef({ path, locale });
  const panelId = useId();
  const c = COPY[locale];

  useEffect(() => {
    if (previousRoute.current.path === path && previousRoute.current.locale === locale) return;
    previousRoute.current = { path, locale };
    focusFirstOnOpen.current = false;
    setOpen(false);
  }, [path, locale]);

  useEffect(() => {
    if (!open) return;
    let focusFrame = 0;
    if (focusFirstOnOpen.current) {
      // Allow visibility and inert updates to take effect before moving focus.
      focusFrame = window.requestAnimationFrame(() => {
        focusFirstOnOpen.current = false;
        root.current?.querySelector<HTMLElement>('.bm-card')?.focus();
      });
    }
    const onDown = (e: Event) => {
      if (root.current && !root.current.contains(e.target as Node)) {
        focusFirstOnOpen.current = false;
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        focusFirstOnOpen.current = false;
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('click', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('click', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = () => { focusFirstOnOpen.current = false; setOpen(false); onNavigate(); };

  return <div className={`bm ${open ? 'bm-open' : ''}`} ref={root} data-testid="businesses-menu">
    <button ref={trigger} id={`${panelId}-trigger`} type="button" className="nav-link nav-trigger bm-trigger" data-current={active ? 'true' : undefined}
      aria-expanded={open} aria-controls={panelId} data-testid="button-businesses"
      onClick={() => { focusFirstOnOpen.current = false; setOpen(o => !o); }}
      onKeyDown={e => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (open) root.current?.querySelector<HTMLElement>('.bm-card')?.focus();
          else { focusFirstOnOpen.current = true; setOpen(true); }
        }
      }}>
      {c.label}<ChevronDown size={14} className="bm-chev" aria-hidden="true" />
    </button>
    <div id={panelId} className="bm-panel" role="region" aria-labelledby={`${panelId}-trigger`} aria-hidden={!open} inert={!open} data-testid="businesses-panel">
      <div className="bm-grid">
        {c.items.map(it => <Link key={it.href} href={it.href} className="bm-card" onClick={choose} data-testid={`link-business-${it.division}`}>
          <span className="bm-n">{it.n} <i aria-hidden="true" />{it.eyebrow}</span>
          <span className="bm-logo"><BrandLogo division={it.division} /></span>
          <span className="bm-name">{it.name}</span>
          <span className="bm-text">{it.text}</span>
          <span className="bm-cta">{it.cta}<ArrowRight size={15} aria-hidden="true" /></span>
        </Link>)}
      </div>
    </div>
  </div>;
}
