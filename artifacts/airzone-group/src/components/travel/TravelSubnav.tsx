import { useEffect, useState, type MouseEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/site/locale';
import { goToTravelForm } from '@/components/layout/QuoteCta';

const ITEMS: [id: string, en: string, ar: string][] = [
  ['offers', 'Offers', 'العروض'],
  ['tv-services', 'Services', 'الخدمات'],
  ['tv-styles', 'Travel styles', 'أنماط السفر'],
  ['tv-destinations', 'Destinations', 'الوجهات'],
  ['tv-faq', 'FAQ', 'الأسئلة الشائعة'],
];

/**
 * On-page navigation for the travel page: sticks under the site header and marks the section
 * being read. Plain anchors (the scroll manager offsets them for the header and this bar), so it
 * works without scripts too; on phones it scrolls sideways inside itself, never the page.
 */
export function TravelSubnav() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = ITEMS.map(([id]) => document.getElementById(id)).filter((s): s is HTMLElement => !!s);
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;
    const visible = new Map<string, number>();
    // A section counts as "being read" while it crosses the band just below the sticky bars.
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => (e.isIntersecting ? visible.set(e.target.id, e.boundingClientRect.top) : visible.delete(e.target.id)));
      const first = ITEMS.map(([id]) => id).find(id => visible.has(id)) ?? null;
      setActive(first);
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);
  return <nav className="tv-subnav" aria-label={ar ? 'في هذه الصفحة' : 'On this page'}>
    <div className="az-container tv-subnav-inner">
      <ul className="tv-subnav-list">
        {ITEMS.map(([id, en, a]) => <li key={id}><a href={`#${id}`} className="tv-subnav-link" aria-current={active === id ? 'true' : undefined}>{ar ? a : en}</a></li>)}
      </ul>
      <a href="#travel-plan" className="az-btn az-btn-primary az-btn-sm tv-subnav-cta" onClick={(e: MouseEvent) => goToTravelForm(e)}>
        {ar ? 'خطط لرحلتك' : 'Plan your trip'}<ArrowRight size={15} aria-hidden="true" className="az-flip" />
      </a>
    </div>
  </nav>;
}
