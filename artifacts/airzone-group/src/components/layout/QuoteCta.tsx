import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { ArrowRight, ChevronDown, Plane, Truck } from 'lucide-react';
import { Link, useBarePath, useLocale } from '@/site/locale';
import { getLenis } from '@/motion/SmoothScroll';
import { travelDivisionPath } from './WhatsAppButton';

/**
 * Business-specific "Request a quote" routing.
 *  - Group homepage: the visitor chooses Travel & Tourism or Logistics.
 *  - Travel pages (/travel, /travel/*, /destinations): the travel enquiry form
 *    (on /travel the form is on the page, so the button scrolls to it).
 *  - Every other page: the logistics quotation page.
 */
export type QuoteKind = 'chooser' | 'travel' | 'logistics';

export const TRAVEL_QUOTE = '/travel/enquiry';
export const LOGISTICS_QUOTE = '/logistics/request-quote';

export function useQuoteKind(): QuoteKind {
  const path = useBarePath();
  if (path === '/') return 'chooser';
  return travelDivisionPath(path) ? 'travel' : 'logistics';
}

/** Scroll to the travel form on this page and put the cursor in its first field. */
export function goToTravelForm(e?: MouseEvent) {
  const section = document.getElementById('travel-plan');
  if (!section) return false;
  e?.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const focusFirst = () => section.querySelector<HTMLElement>('input[name="fullName"], input, select, textarea')?.focus({ preventScroll: true });
  const go = () => {
    const offset = -((document.querySelector<HTMLElement>('.az-navbar')?.offsetHeight ?? document.querySelector<HTMLElement>('.az-header')?.offsetHeight ?? 90) + (document.querySelector<HTMLElement>('.tv-subnav')?.offsetHeight ?? 0) + 12);
    const lenis = getLenis();
    // An explicit position: given an element, Lenis would add the page's CSS scroll-padding on
    // top of the offset (see goToTarget in SmoothScroll.tsx) and stop short of the form.
    const to = () => Math.round(section.getBoundingClientRect().top + window.scrollY + offset);
    // Images above may finish loading during a long scroll and move the form: re-measure on
    // arrival and settle on its real position before moving focus.
    const settle = () => {
      const miss = section.getBoundingClientRect().top + offset;
      if (lenis && Math.abs(miss) > 8) { lenis.resize(); lenis.scrollTo(to(), { duration: 0.45, onComplete: focusFirst }); }
      else focusFirst();
    };
    // Lenis clamps to its cached page height, which goes stale as images load: re-measure first.
    if (lenis && !reduce) { lenis.resize(); lenis.scrollTo(to(), { duration: 1.1, onComplete: settle }); }
    else {
      window.scrollTo({ top: to(), behavior: reduce ? 'auto' : 'smooth' });
      window.setTimeout(() => { if (Math.abs(section.getBoundingClientRect().top + offset) > 8) window.scrollTo({ top: to() }); focusFirst(); }, reduce ? 0 : 700);
    }
  };
  // Wait for an open overlay (mobile menu) to release the page scroll first.
  const start = performance.now();
  const wait = () => (document.documentElement.classList.contains('scroll-locked') && performance.now() - start < 800 ? requestAnimationFrame(wait) : go());
  wait();
  return true;
}

/** A quote link for one business: travel (scrolls to the on-page form when there is one) or logistics. */
export function QuoteLink({ kind, className, children, onNavigate }: { kind: 'travel' | 'logistics'; className?: string; children: ReactNode; onNavigate?: () => void }) {
  const path = useBarePath();
  if (kind === 'travel' && path === '/travel') {
    return <a href="#travel-plan" className={className} onClick={e => { onNavigate?.(); goToTravelForm(e); }}>{children}</a>;
  }
  return <Link href={kind === 'travel' ? TRAVEL_QUOTE : LOGISTICS_QUOTE} className={className} onClick={onNavigate}>{children}</Link>;
}

/** The two business options (Travel & Tourism first), used inside the chooser and the mobile menu. */
export function QuoteOptions({ onNavigate }: { onNavigate?: () => void }) {
  const { locale } = useLocale();
  const T = (en: string, ar: string) => (locale === 'ar' ? ar : en);
  return <ul className="az-qc-options">
    <li><Link href={TRAVEL_QUOTE} className="az-qc-option" onClick={onNavigate}>
      <span className="az-qc-icon is-travel"><Plane size={18} aria-hidden="true" /></span>
      <span className="az-qc-text"><b>{T('Travel & Tourism quote', 'طلب عرض سعر للسفر')}</b><small>{T('Flights, holidays, visas and hotels · Airzone Travel & Tourism', 'الطيران والعطلات والتأشيرات والفنادق · إيرزون للسفر والسياحة')}</small></span>
      <ArrowRight size={16} aria-hidden="true" className="az-flip az-qc-go" />
    </Link></li>
    <li><Link href={LOGISTICS_QUOTE} className="az-qc-option" onClick={onNavigate}>
      <span className="az-qc-icon is-logistics"><Truck size={18} aria-hidden="true" /></span>
      <span className="az-qc-text"><b>{T('Logistics quote', 'طلب عرض سعر للخدمات اللوجستية')}</b><small>{T('Customs clearance, transport and warehousing · Airzone Logistics', 'التخليص الجمركي والنقل والتخزين · إيرزون للخدمات اللوجستية')}</small></span>
      <ArrowRight size={16} aria-hidden="true" className="az-flip az-qc-go" />
    </Link></li>
  </ul>;
}

/**
 * Homepage "Request a quote": a disclosure button that reveals the two business options.
 * Escape, a click outside or moving focus away closes it; keyboard opening focuses the first option.
 */
export function QuoteChooser({ className, label, placement = 'below-start', wrapperProps }: {
  className?: string; label: ReactNode; placement?: 'below-start' | 'below-end' | 'above-start'; wrapperProps?: Record<string, string>;
}) {
  const { locale } = useLocale();
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const viaKeyboard = useRef(false);

  useEffect(() => {
    if (!open) return;
    if (viaKeyboard.current) wrap.current?.querySelector<HTMLAnchorElement>('.az-qc-option')?.focus();
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return <div ref={wrap} className={`az-qc is-${placement}`} {...wrapperProps}
    onBlur={e => { if (open && !wrap.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
    <button ref={button} type="button" className={className} aria-expanded={open} aria-controls={id}
      onClick={e => { viaKeyboard.current = e.detail === 0; setOpen(o => !o); }}>
      {label}<ChevronDown size={16} aria-hidden="true" className="az-qc-caret" />
    </button>
    <div id={id} className="az-qc-panel" role="group" aria-label={locale === 'ar' ? 'اختر النشاط' : 'Choose a business'} hidden={!open}>
      <p className="az-qc-title">{locale === 'ar' ? 'لأي نشاط تطلب عرض السعر؟' : 'Which business is your quote for?'}</p>
      <QuoteOptions onNavigate={() => setOpen(false)} />
    </div>
  </div>;
}
