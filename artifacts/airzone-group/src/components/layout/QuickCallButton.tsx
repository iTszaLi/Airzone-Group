import { Phone } from 'lucide-react';
import { useBarePath, useLocale } from '@/site/locale';
import { businessContacts, logisticsQuickCall } from '@/config/business-contacts';
import { travelDivisionPath } from './WhatsAppButton';

/**
 * Floating one-tap call buttons. They complement the WhatsApp button and never replace it.
 *  - Homepage and the logistics hub (/logistics): call Airzone Logistics, stacked directly above
 *    WhatsApp (right). On /logistics they sit with "Get a quote" in the phone action bar.
 *  - Travel pages (/travel, /travel/*, /destinations): call Airzone Travel, on the left edge,
 *    opposite WhatsApp.
 * Other pages show neither.
 */
export function QuickCallButton() {
  const { locale } = useLocale();
  const path = useBarePath();
  const ar = locale === 'ar';
  const travelPhone = businessContacts.travel.phone;
  if (path === '/' || path === '/logistics') {
    return <aside className="az-call-dock" aria-label={ar ? 'اتصال سريع' : 'Quick call'}>
      <a className="az-call" href={logisticsQuickCall.href}>
        <Phone size={20} aria-hidden="true" />
        <span className="az-call-label">{ar ? 'اتصال سريع' : 'Quick Call'}</span>
        <span className="sr-only">{ar ? ' – اتصل بإيرزون للخدمات اللوجستية' : ' – Call Airzone Logistics'} <bdi dir="ltr">{logisticsQuickCall.label}</bdi></span>
      </a>
    </aside>;
  }
  if (travelDivisionPath(path) && travelPhone) {
    return <aside className="az-call-dock" aria-label={ar ? 'اتصال سريع' : 'Quick call'}>
      <a className="az-call is-travel" href={travelPhone.href} data-division="travel">
        <Phone size={20} aria-hidden="true" />
        <span className="az-call-label">{ar ? 'اتصل بإيرزون للسفر والسياحة' : 'Call Airzone Travel'}</span>
        <span className="sr-only"> <bdi dir="ltr">{travelPhone.label}</bdi></span>
      </a>
    </aside>;
  }
  return null;
}
