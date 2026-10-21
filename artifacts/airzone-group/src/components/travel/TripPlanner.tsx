import { type FormEvent } from 'react';
import { ArrowRight, CalendarDays, MapPin, PlaneTakeoff, Users } from 'lucide-react';
import { useLocale } from '@/site/locale';
import { presetTravelForm } from '@/components/forms/TravelForm';
import { goToTravelForm } from '@/components/layout/QuoteCta';
import { analyticsEvent } from '@/analytics/runtime';
import { enquiryDestinations } from '@/config/travel-content';

const C = {
  en: {
    title: 'Start planning your trip',
    note: 'This fills in the travel request below for you. It is not a live booking search: our team confirms options and prices in a written proposal.',
    destination: 'Destination', choose: 'Choose a destination', from: 'From', fromPlaceholder: 'e.g. Riyadh',
    depart: 'Departure', return: 'Return', travellers: 'Travellers', cta: 'Plan my trip',
  },
  ar: {
    title: 'ابدأ التخطيط لرحلتك',
    note: 'يملأ هذا طلب السفر أدناه نيابةً عنك. ليس بحث حجز مباشر: يؤكد فريقنا الخيارات والأسعار في عرض مكتوب.',
    destination: 'الوجهة', choose: 'اختر وجهة', from: 'من', fromPlaceholder: 'مثال: الرياض',
    depart: 'المغادرة', return: 'العودة', travellers: 'المسافرون', cta: 'خطط لرحلتي',
  },
};

/**
 * Trip-planning bar under the travel hero. It does not search or book anything: it hands
 * what the visitor typed to the page's travel enquiry form (the one form that submits) and
 * takes them there, so nothing has to be typed twice.
 */
export function TripPlanner() {
  const { locale } = useLocale();
  const c = C[locale];
  const ar = locale === 'ar';
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) || '').trim() || undefined;
    const travellers = Number(f.get('travellers'));
    presetTravelForm({
      destination: text('destination'), departureCity: text('departureCity'),
      departureDate: text('departureDate'), returnDate: text('returnDate'),
      travellers: Number.isFinite(travellers) && travellers >= 1 ? Math.min(500, Math.round(travellers)) : undefined,
    });
    analyticsEvent('travel_planner_submit', { business_division: 'travel' });
    goToTravelForm();
  };
  return <section id="tv-planner" className="tv-planner" aria-labelledby="tv-planner-title">
    <div className="az-container">
      <form className="tv-planner-card" onSubmit={submit} aria-describedby="tv-planner-note">
        <h2 id="tv-planner-title" className="tv-planner-title">{c.title}</h2>
        <div className="tv-planner-fields">
          <label className="tv-planner-field is-wide">
            <span><MapPin size={15} aria-hidden="true" />{c.destination}</span>
            <select name="destination" defaultValue="">
              <option value="">{c.choose}</option>
              {enquiryDestinations.map(([en, a]) => <option key={en} value={en}>{ar ? a : en}</option>)}
            </select>
          </label>
          <label className="tv-planner-field">
            <span><PlaneTakeoff size={15} aria-hidden="true" />{c.from}</span>
            <input name="departureCity" maxLength={120} autoComplete="address-level2" placeholder={c.fromPlaceholder} />
          </label>
          <label className="tv-planner-field">
            <span><CalendarDays size={15} aria-hidden="true" />{c.depart}</span>
            <input name="departureDate" type="date" />
          </label>
          <label className="tv-planner-field">
            <span><CalendarDays size={15} aria-hidden="true" />{c.return}</span>
            <input name="returnDate" type="date" />
          </label>
          <label className="tv-planner-field is-narrow">
            <span><Users size={15} aria-hidden="true" />{c.travellers}</span>
            <input name="travellers" type="number" min={1} max={500} inputMode="numeric" defaultValue={2} />
          </label>
          <button type="submit" className="az-btn az-btn-primary tv-planner-cta">{c.cta}<ArrowRight size={17} aria-hidden="true" className="az-flip" /></button>
        </div>
        <p id="tv-planner-note" className="tv-planner-note">{c.note}</p>
      </form>
    </div>
  </section>;
}
