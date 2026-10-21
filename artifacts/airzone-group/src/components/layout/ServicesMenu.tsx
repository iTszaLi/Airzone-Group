import { useEffect, useId, useRef, useState } from 'react';
import { m } from 'motion/react';
import { ArrowRight, BedDouble, BriefcaseBusiness, ChevronDown, Landmark, Palmtree, Plane, Stamp, Truck } from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { serviceCatalog, serviceGroups, type ServiceGroup } from '@/config/service-catalog';
import { BrandLogo } from '@/components/brand/BrandLogo';

/** Airzone Travel & Tourism services shown in the menu's travel zone (existing /travel/* pages). */
const travelServices: [string, typeof Plane, string, string][] = [
  ['/travel/flights', Plane, 'Flights', 'الطيران'],
  ['/travel/hotels', BedDouble, 'Hotels', 'الفنادق'],
  ['/travel/holiday-packages', Palmtree, 'Holiday packages', 'باقات العطلات'],
  ['/travel/visa-assistance', Stamp, 'Visa assistance', 'مساعدة التأشيرات'],
  ['/travel/umrah', Landmark, 'Umrah', 'العمرة'],
  ['/travel/corporate-travel', BriefcaseBusiness, 'Corporate travel', 'سفر الأعمال'],
];

/**
 * The group's services in two zones: Airzone Logistics (three columns and its key pages) and
 * Airzone Travel & Tourism (its own column), so one menu serves both businesses while keeping them distinct.
 *
 * Click-controlled disclosure (never hover-opened). It stays open while the
 * visitor moves into it and closes on trigger click, selection, outside click
 * or Escape. Escape closes only this disclosure and returns focus to its
 * trigger. Closed content is inert immediately, even while it fades out.
 */
export function ServicesMenu({ path, active, onNavigate, variant }: {
  path: string; active: boolean; onNavigate: () => void; variant: 'desktop' | 'mobile';
}) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const focusFirst = useRef(false);
  const panelId = useId();

  useEffect(() => { setOpen(false); }, [path, locale]);

  useEffect(() => {
    if (!open) return;
    let frame = 0;
    if (focusFirst.current) {
      frame = requestAnimationFrame(() => { focusFirst.current = false; root.current?.querySelector<HTMLElement>('.az-mm-link')?.focus(); });
    }
    const onDown = (e: Event) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault(); e.stopPropagation();
      setOpen(false); trigger.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const choose = () => { setOpen(false); onNavigate(); };
  const groups: ServiceGroup[] = ['trade', 'transport', 'storage'];

  return <div className={`az-mm az-mm-${variant} ${open ? 'is-open' : ''}`} ref={root} data-testid="businesses-menu">
    <button ref={trigger} id={`${panelId}-t`} type="button" className="az-nav-link az-mm-trigger" data-current={active ? 'true' : undefined}
      aria-expanded={open} aria-controls={panelId} data-testid="button-businesses"
      onClick={() => { focusFirst.current = false; setOpen(o => !o); }}
      onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); focusFirst.current = true; setOpen(true); if (open) root.current?.querySelector<HTMLElement>('.az-mm-link')?.focus(); } }}>
      {ar ? 'الخدمات' : 'Services'}<ChevronDown size={15} className="az-mm-chev" aria-hidden="true" />
    </button>
    <m.div id={panelId} className="az-mm-panel" role="region" aria-labelledby={`${panelId}-t`}
      aria-hidden={!open} inert={!open} data-testid="businesses-panel" data-lenis-prevent=""
      initial={false}
      animate={variant === 'mobile'
        ? (open ? { height: 'auto', opacity: 1, visibility: 'visible' } : { height: 0, opacity: 0, transitionEnd: { visibility: 'hidden' } })
        : (open ? { opacity: 1, y: 0, visibility: 'visible' } : { opacity: 0, y: -8, transitionEnd: { visibility: 'hidden' } })}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
      <div className="az-mm-zones">
      <div className="az-mm-zone is-logistics" role="group" aria-labelledby={`${panelId}-lg`}>
        <div className="az-mm-zone-head">
          <p className="az-mm-zone-title" id={`${panelId}-lg`}><Truck size={16} aria-hidden="true" />{ar ? 'إيرزون للخدمات اللوجستية' : 'Airzone Logistics'}</p>
          <Link href="/logistics" className="az-mm-zone-all" onClick={choose}>{ar ? 'جميع الخدمات اللوجستية' : 'All logistics services'}<ArrowRight size={15} aria-hidden="true" className="az-flip" /></Link>
        </div>
      <div className="az-mm-grid">
        {groups.map(g => <div key={g} className="az-mm-col">
          <p className="az-mm-heading">{serviceGroups[g][locale]}</p>
          <ul>
            {serviceCatalog.filter(s => s.group === g).map(s => {
              const Icon = s.icon;
              return <li key={s.path}><Link href={s.path} className="az-mm-link" onClick={choose} aria-current={path === s.path ? 'page' : undefined}>
                <span className="az-mm-icon"><Icon size={18} aria-hidden="true" /></span>
                <span><b>{s[locale].name}</b></span>
              </Link></li>;
            })}
          </ul>
        </div>)}
      </div>
        <div className="az-mm-foot">
          <Link href="/#vehicles" className="az-mm-all" onClick={choose}>{ar ? 'المركبات والمقطورات' : 'Vehicles & trailers'}<ArrowRight size={15} aria-hidden="true" className="az-flip" /></Link>
          <Link href="/logistics/industries" className="az-mm-all" onClick={choose}>{ar ? 'القطاعات التي نخدمها' : 'Industries we serve'}<ArrowRight size={15} aria-hidden="true" className="az-flip" /></Link>
          <Link href="/locations" className="az-mm-all" onClick={choose}>{ar ? 'مواقع الخدمة' : 'Service locations'}<ArrowRight size={15} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
      <div className="az-mm-zone is-travel" role="group" aria-labelledby={`${panelId}-tv`}>
        <Link href="/travel" className="az-mm-travel-head" onClick={choose} data-testid="link-business-travel">
          <span className="az-mm-business-logo"><BrandLogo division="travel" sizes="64px" decorative /></span>
          <span><b id={`${panelId}-tv`}>{ar ? 'إيرزون للسفر والسياحة' : 'Airzone Travel & Tourism'}</b><small>{ar ? 'الطيران والعطلات والفنادق وسفر الأعمال.' : 'Flights, holidays, hotels and corporate travel.'}</small></span>
        </Link>
        <ul>
          {travelServices.map(([href, Icon, en, a]) => <li key={href}><Link href={href} className="az-mm-link" onClick={choose} aria-current={path === href ? 'page' : undefined}>
            <span className="az-mm-icon"><Icon size={18} aria-hidden="true" /></span><span><b>{ar ? a : en}</b></span>
          </Link></li>)}
        </ul>
        <Link href="/travel" className="az-mm-all" onClick={choose}>{ar ? 'استكشف السفر والسياحة' : 'Explore travel & tourism'}<ArrowRight size={15} aria-hidden="true" className="az-flip" /></Link>
      </div>
      </div>
    </m.div>
  </div>;
}
