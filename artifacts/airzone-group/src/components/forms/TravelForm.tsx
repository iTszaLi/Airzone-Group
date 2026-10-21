import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Plane } from 'lucide-react';
import { useCreateTravelEnquiry, type TravelEnquiryInput } from '@workspace/api-client-react';
import { useLocale } from '@/site/locale';
import { analyticsEvent, recordLead } from '@/analytics/runtime';
import { enquiryDestinations, travelPurposes } from '@/config/travel-content';
import { Field, FailedNotice, PHONE_PATTERN, Honeypot, PrivacyNote, SentPanel, SubmitButton, attribution, useValidatedForm } from './FormKit';

export type TravelPreset = { destination?: string; purpose?: string; offer?: string; departureCity?: string; departureDate?: string; returnDate?: string; travellers?: number };
export const TRAVEL_PRESET_EVENT = 'az:travel-preset';

/** Ask the travel form on this page to preselect a destination, purpose or offer. */
export function presetTravelForm(preset: TravelPreset) {
  window.dispatchEvent(new CustomEvent<TravelPreset>(TRAVEL_PRESET_EVENT, { detail: preset }));
}

/**
 * Travel enquiry (English / Arabic). Submits to the existing /api/enquiries/travel
 * endpoint; success is shown only after the API confirms the enquiry was stored.
 */
export function TravelForm({ source = 'Website travel page' }: { source?: string }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const L = (en: string, a: string) => (ar ? a : en);
  const mutation = useCreateTravelEnquiry();
  const [sent, setSent] = useState<{ reference: string; emailed: boolean } | null>(null);
  const [failed, setFailed] = useState(false);
  const [offer, setOffer] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Presets from the URL (?destination=&purpose=&offer=) and from CTAs on the page.
  useEffect(() => {
    const apply = (p: TravelPreset) => {
      const form = formRef.current;
      if (!form) return;
      const set = (name: string, value?: string) => {
        const el = form.elements.namedItem(name) as HTMLSelectElement | null;
        if (el && value && Array.from(el.options).some(o => o.value === value)) el.value = value;
      };
      const fill = (name: string, value?: string | number) => {
        const el = form.elements.namedItem(name) as HTMLInputElement | null;
        if (el && value !== undefined && value !== '') el.value = String(value);
      };
      set('destination', p.destination);
      set('purpose', p.purpose);
      fill('departureCity', p.departureCity);
      fill('departureDate', p.departureDate);
      fill('returnDate', p.returnDate);
      fill('travellers', p.travellers);
      if (p.offer) setOffer(p.offer);
    };
    const q = new URLSearchParams(window.location.search);
    apply({ destination: q.get('destination') ?? undefined, purpose: q.get('purpose') ?? undefined, offer: q.get('offer') ?? undefined });
    const onPreset = (e: Event) => apply((e as CustomEvent<TravelPreset>).detail);
    window.addEventListener(TRAVEL_PRESET_EVENT, onPreset);
    return () => window.removeEventListener(TRAVEL_PRESET_EVENT, onPreset);
  }, []);

  // Count one view when the form first comes into sight (no field values are sent).
  useEffect(() => {
    const form = formRef.current;
    if (!form || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { analyticsEvent('travel_form_view', { business_division: 'travel' }); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(form);
    return () => io.disconnect();
  }, []);

  // The return date cannot precede the departure date.
  const checkDates = (form: HTMLFormElement) => {
    const dep = form.elements.namedItem('departureDate') as HTMLInputElement | null;
    const ret = form.elements.namedItem('returnDate') as HTMLInputElement | null;
    if (!dep || !ret) return;
    ret.min = dep.value || '';
    ret.setCustomValidity(dep.value && ret.value && ret.value < dep.value ? L('The return date cannot be before the departure date.', 'لا يمكن أن يكون تاريخ العودة قبل تاريخ المغادرة.') : '');
  };

  const { errors, onSubmit, onInput, onBlur, Summary } = useValidatedForm(f => {
    if (mutation.isPending) return;
    const travellers = Math.max(1, Math.min(500, Number(f.get('travellers') || 1)));
    const purpose = String(f.get('purpose'));
    const data: TravelEnquiryInput = {
      name: String(f.get('fullName')).trim(),
      mobile: String(f.get('mobile')).trim(),
      ...(String(f.get('email') || '').trim() ? { email: String(f.get('email')).trim() } : {}),
      destination: String(f.get('destination')),
      departureCity: String(f.get('departureCity')).trim(),
      departureDate: String(f.get('departureDate') || '') || null,
      returnDate: String(f.get('returnDate') || '') || null,
      adults: Math.min(travellers, 50),
      travellers,
      travelType: purpose,
      tripType: purpose === 'Business travel' ? 'Corporate Travel' : purpose,
      budget: String(f.get('budget') || '').trim() || undefined,
      preferredPackage: offer || undefined,
      message: String(f.get('message') || '').trim().slice(0, 4000) || undefined,
      source,
      ...attribution(),
    };
    setFailed(false);
    mutation.mutate({ data }, {
      onSuccess: r => { recordLead('travel', r.reference, 'travel'); setSent({ reference: r.reference, emailed: r.emailed === true }); },
      onError: () => setFailed(true),
    });
  });

  const handleInput = (e: FormEvent<HTMLFormElement>) => { checkDates(e.currentTarget); onInput(e); };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { checkDates(e.currentTarget); onSubmit(e); };

  if (sent) return <SentPanel reference={sent.reference} title={L('Your enquiry has been submitted successfully.', 'تم إرسال طلبك بنجاح.')}>
    <p>{sent.emailed
      ? L('It has been sent to the Airzone Travel & Tourism team, who will contact you about the options and next steps. Nothing is booked until you approve a written proposal.', 'أُرسل طلبك إلى فريق إيرزون للسفر والسياحة، وسيتواصل معك بشأن الخيارات والخطوات التالية. لا يتم أي حجز قبل موافقتك على عرض مكتوب.')
      : L('It has been recorded for the Airzone Travel & Tourism team, who will review your plans and contact you about the options and next steps. Nothing is booked until you approve a written proposal.', 'سُجّل طلبك لدى فريق إيرزون للسفر والسياحة، وسيراجع خطتك ويتواصل معك بشأن الخيارات والخطوات التالية. لا يتم أي حجز قبل موافقتك على عرض مكتوب.')}</p>
  </SentPanel>;

  return <form ref={formRef} className="az-form tv-form" noValidate onSubmit={handleSubmit} onInput={handleInput} onBlur={onBlur} aria-describedby="tv-form-req">
    <p className="az-form-for" data-division="travel"><Plane size={16} aria-hidden="true" />{L('Travel quotation request · Airzone Travel & Tourism', 'طلب عرض سعر للسفر · إيرزون للسفر والسياحة')}</p>
    <p id="tv-form-req" className="az-form-req">{L('Fields marked * are required.', 'الحقول المعلّمة بـ * مطلوبة.')}</p>
    <Summary />
    {offer && <p className="tv-form-offer">{L('Offer', 'العرض')}: <b>{offer}</b> <button type="button" className="az-text-link" onClick={() => setOffer('')}>{L('Remove', 'إزالة')}</button></p>}
    <fieldset>
      <legend>{L('Your details', 'بياناتك')}</legend>
      <div className="az-form-grid">
        <Field label={L('Full name', 'الاسم الكامل')} name="fullName" required minLength={2} maxLength={120} autoComplete="name" error={errors.fullName} />
        <Field label={L('Phone or WhatsApp number', 'رقم الهاتف أو واتساب')} name="mobile" type="tel" required pattern={PHONE_PATTERN} maxLength={40} autoComplete="tel" inputMode="tel" dir="ltr" placeholder="+966" error={errors.mobile} />
        <Field label={L('Email address', 'البريد الإلكتروني')} name="email" type="email" maxLength={254} autoComplete="email" inputMode="email" dir="ltr" error={errors.email} wide />
      </div>
    </fieldset>
    <fieldset>
      <legend>{L('Your trip', 'رحلتك')}</legend>
      <div className="az-form-grid">
        <Field label={L('Preferred destination', 'الوجهة المفضلة')} name="destination" required error={errors.destination}
          options={enquiryDestinations.map(([en, a]) => ({ value: en, label: ar ? a : en }))} />
        <Field label={L('Departure city', 'مدينة المغادرة')} name="departureCity" required minLength={2} maxLength={120} placeholder={L('e.g. Riyadh', 'مثال: الرياض')} error={errors.departureCity} />
        <Field label={L('Preferred departure date', 'تاريخ المغادرة المفضل')} name="departureDate" type="date" error={errors.departureDate} />
        <Field label={L('Return date, if applicable', 'تاريخ العودة إن وجد')} name="returnDate" type="date" error={errors.returnDate} />
        <Field label={L('Number of travellers', 'عدد المسافرين')} name="travellers" type="number" required min={1} max={500} inputMode="numeric" defaultValue="2" error={errors.travellers} />
        <Field label={L('Travel purpose', 'الغرض من السفر')} name="purpose" required error={errors.purpose}
          options={travelPurposes.map(p => ({ value: p.value, label: ar ? p.ar : p.en }))} />
        <Field label={L('Budget range', 'نطاق الميزانية')} name="budget" maxLength={80} placeholder={L('e.g. SAR 15,000–20,000', 'مثال: 15,000–20,000 ريال')} error={errors.budget} wide />
      </div>
      <Field label={L('Additional travel requirements', 'متطلبات سفر إضافية')} name="message" rows={4} maxLength={3500} wide
        hint={L('Ages of children, hotel preferences, flight times, visas or anything else we should know.', 'أعمار الأطفال، تفضيلات الفنادق، أوقات الرحلات، التأشيرات أو أي معلومات أخرى.')} error={errors.message} />
    </fieldset>
    <Honeypot />
    <FailedNotice show={failed} division="travel" />
    <div className="az-form-footer">
      <PrivacyNote />
      <SubmitButton sending={mutation.isPending} label={L('Send travel request', 'أرسل طلب السفر')} />
    </div>
  </form>;
}
