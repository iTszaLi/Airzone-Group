import { FaWhatsapp } from 'react-icons/fa';
import { useBarePath, useLocale } from '@/site/locale';
import { businessContacts, whatsappLink } from '@/config/business-contacts';

/** Travel & Tourism pages; every other public page belongs to Airzone Logistics. */
export const travelDivisionPath = (path: string) => path === '/travel' || path.startsWith('/travel/') || path === '/destinations';

/** The division the current page belongs to, for division-specific contacts and actions. */
export function useDivision(): 'travel' | 'logistics' {
  return travelDivisionPath(useBarePath()) ? 'travel' : 'logistics';
}

const copy = {
  travel: {
    label: { en: 'Chat with Airzone Travel on WhatsApp', ar: 'تحدث مع إيرزون للسفر عبر واتساب' },
    tip: { en: 'Chat with us on WhatsApp', ar: 'تحدث معنا عبر واتساب' },
  },
  logistics: {
    label: { en: 'Chat with Airzone Logistics on WhatsApp', ar: 'تحدث مع إيرزون للخدمات اللوجستية عبر واتساب' },
    tip: { en: 'Chat with Airzone Logistics', ar: 'تحدث مع إيرزون للخدمات اللوجستية' },
  },
} as const;

/**
 * Floating WhatsApp button. The division comes from the route, so each page
 * opens its own team's chat: Travel on /travel and /destinations, Logistics
 * elsewhere. Numbers and messages live in config/business-contacts.ts.
 */
export function WhatsAppButton() {
  const { locale } = useLocale();
  const division = useDivision();
  const href = whatsappLink(businessContacts[division], locale);
  if (!href) return null;
  const t = copy[division];
  // A labelled landmark, so the button is not left outside the page regions for screen-reader users.
  return <aside className="az-wa-dock" aria-label={locale === 'ar' ? 'محادثة واتساب' : 'WhatsApp chat'}>
    <a className="az-wa" href={href} target="_blank" rel="noopener noreferrer" data-division={division}
      aria-label={t.label[locale]}>
      <FaWhatsapp aria-hidden="true" focusable="false" />
      <span className="az-wa-tip" aria-hidden="true">{t.tip[locale]}</span>
    </a>
  </aside>;
}
