import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { CheckCircle2, MoveRight, X } from 'lucide-react';
import { useCreateFleetQuote, type FleetQuoteInput } from '@workspace/api-client-react';
import { useLocale } from '@/site/locale';
import { recordLead } from '@/analytics/runtime';
import { setScrollLocked } from '@/motion/SmoothScroll';
import { fleetImage, fleetLines, type FleetVehicle } from '@/config/fleet';
import { FailedNotice, Field, Honeypot, PHONE_PATTERN, PrivacyNote, SubmitButton, attribution, useValidatedForm } from '@/components/forms/FormKit';

const L = {
  en: {
    title: 'Request this vehicle', intro: 'Tell us about your route and cargo. Our logistics team will reply about availability, pricing and your route.',
    selected: 'Selected vehicle', close: 'Close', route: 'Your route', from: 'Pickup location', to: 'Delivery destination', placeHint: 'City, district or full address',
    name: 'Full name', company: 'Company name', email: 'Business email', phone: 'Phone / WhatsApp number', date: 'Preferred pickup date',
    cargo: 'Cargo type or shipment description', cargoPh: 'For example: 18 pallets of packaged food', weight: 'Estimated weight or quantity', weightPh: 'e.g. 12 tonnes, 18 pallets',
    extra: 'Additional requirements', extraPh: 'Loading times, equipment, site access or handling notes', required: 'Fields marked * are required.', send: 'Send vehicle request',
    thanks: 'Thank you for your enquiry.',
    emailed: 'Our logistics team has received your vehicle request and will contact you regarding availability, pricing, and your requested route.',
    stored: 'Your vehicle request has been recorded. Our logistics team will review it and contact you regarding availability, pricing and your requested route.',
    reference: 'Reference', done: 'Close',
  },
  ar: {
    title: 'اطلب هذه المركبة', intro: 'أخبرنا عن المسار والبضاعة، وسيرد فريق الخدمات اللوجستية بشأن التوفر والسعر والمسار.',
    selected: 'المركبة المختارة', close: 'إغلاق', route: 'المسار', from: 'موقع الاستلام', to: 'وجهة التسليم', placeHint: 'المدينة أو الحي أو العنوان الكامل',
    name: 'الاسم الكامل', company: 'اسم الشركة', email: 'البريد الإلكتروني للعمل', phone: 'رقم الهاتف / واتساب', date: 'تاريخ الاستلام المفضل',
    cargo: 'نوع البضاعة أو وصف الشحنة', cargoPh: 'مثال: 18 منصة من المواد الغذائية المعبأة', weight: 'الوزن أو الكمية التقريبية', weightPh: 'مثلاً 12 طناً، 18 منصة',
    extra: 'متطلبات إضافية', extraPh: 'أوقات التحميل أو المعدات أو الوصول إلى الموقع أو ملاحظات المناولة', required: 'الحقول المعلّمة بـ * مطلوبة.', send: 'أرسل طلب المركبة',
    thanks: 'شكراً لاستفسارك.',
    emailed: 'استلم فريق الخدمات اللوجستية طلب المركبة، وسيتواصل معك بشأن التوفر والسعر والمسار المطلوب.',
    stored: 'تم تسجيل طلب المركبة. سيراجعه فريق الخدمات اللوجستية ويتواصل معك بشأن التوفر والسعر والمسار المطلوب.',
    reference: 'رقم المرجع', done: 'إغلاق',
  },
};

/** Today's date in the visitor's time zone, for the date field's minimum. */
const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

/**
 * Quote panel for the vehicle on show in the showroom. A native modal <dialog>: focus stays
 * inside, Escape closes it, the page behind is inert and does not scroll, and focus returns
 * to the button that opened it. The form mounts on first open and keeps what the visitor typed
 * if they close it or a request fails; after a successful request it starts fresh.
 */
export function VehicleQuoteDialog({ open, vehicle, onClose }: { open: boolean; vehicle: FleetVehicle; onClose: () => void }) {
  const { locale } = useLocale();
  const l = L[locale];
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [result, setResult] = useState<{ reference: string; emailed: boolean } | null>(null);
  const [failed, setFailed] = useState(false);
  const mutation = useCreateFleetQuote();
  const c = vehicle[locale];

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      setMounted(true);
      if (result) { setResult(null); setFormKey(k => k + 1); }
      el.showModal();
      setScrollLocked(true);
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Native close (Escape, the close button, a backdrop click) always lands here.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onNativeClose = () => { setScrollLocked(false); setFailed(false); onClose(); };
    el.addEventListener('close', onNativeClose);
    return () => el.removeEventListener('close', onNativeClose);
  }, [onClose]);

  useEffect(() => () => setScrollLocked(false), []);

  // Start at the title each time the panel opens, and again when the request succeeds.
  useEffect(() => {
    if (open && mounted) document.getElementById('az-qd-title')?.focus({ preventScroll: true });
  }, [open, mounted, result]);

  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => { if (e.target === e.currentTarget) e.currentTarget.close(); };

  const { errors, onSubmit, onInput, onBlur, Summary } = useValidatedForm((data) => {
    const text = (k: string) => String(data.get(k) || '').trim();
    const payload: FleetQuoteInput = {
      vehicle: vehicle.en.name,
      fullName: text('fullName'),
      company: text('company') || undefined,
      email: text('email'),
      phone: text('phone'),
      pickup: text('pickup'),
      destination: text('destination'),
      pickupDate: text('pickupDate') || null,
      cargo: text('cargo'),
      weight: text('weight') || undefined,
      requirements: text('requirements') || undefined,
      locale,
      source: 'fleet-showroom',
      ...attribution(),
    };
    setFailed(false);
    mutation.mutate({ data: payload }, {
      onSuccess: r => { recordLead('logistics', r.reference, 'logistics'); setResult({ reference: r.reference, emailed: r.emailed }); },
      onError: () => setFailed(true),
    });
  });

  return <dialog ref={dialog} className="az-qd" aria-labelledby="az-qd-title" onClick={onBackdrop}>
    {mounted && <div className="az-qd-panel" data-lenis-prevent>
      <header className="az-qd-head">
        <h2 id="az-qd-title" tabIndex={-1}>{result ? l.thanks : l.title}</h2>
        <button type="button" className="az-qd-close" onClick={() => dialog.current?.close()} aria-label={l.close}><X size={20} aria-hidden="true" /></button>
      </header>

      <div className="az-qd-vehicle">
        <img src={fleetImage(vehicle.image, 240)} width={240} height={134} alt="" />
        <div>
          <span>{l.selected}</span>
          <b>{c.name}</b>
          <small>{fleetLines[vehicle.line][locale]}</small>
        </div>
      </div>

      {result
        ? <div className="az-qd-done" role="status">
          <CheckCircle2 size={34} aria-hidden="true" />
          <p>{result.emailed ? l.emailed : l.stored}</p>
          <p className="az-ref">{l.reference}: <b dir="ltr">{result.reference}</b></p>
          <button type="button" className="az-btn az-btn-navy" onClick={() => dialog.current?.close()}>{l.done}</button>
        </div>
        : <form key={formKey} className="az-form az-qd-form" noValidate onSubmit={onSubmit} onInput={onInput} onBlur={onBlur}>
          <p className="az-qd-intro">{l.intro}</p>
          <Summary />
          <input type="hidden" name="vehicle" value={vehicle.en.name} />
          <div className="az-form-grid">
            <Field label={l.name} name="fullName" required autoComplete="name" minLength={2} maxLength={120} error={errors.fullName} />
            <Field label={l.company} name="company" autoComplete="organization" maxLength={160} error={errors.company} />
            <Field label={l.email} name="email" type="email" required autoComplete="email" inputMode="email" maxLength={254} dir="ltr" error={errors.email} />
            <Field label={l.phone} name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern={PHONE_PATTERN} minLength={7} maxLength={40} dir="ltr" error={errors.phone} />
          </div>
          <fieldset className="az-qd-route">
            <legend>{l.route}</legend>
            <div className="az-qd-route-row">
              <Field label={l.from} name="pickup" required autoComplete="off" minLength={2} maxLength={180} hint={l.placeHint} error={errors.pickup} />
              <MoveRight size={20} aria-hidden="true" className="az-qd-route-arrow az-flip" />
              <Field label={l.to} name="destination" required autoComplete="off" minLength={2} maxLength={180} hint={l.placeHint} error={errors.destination} />
            </div>
          </fieldset>
          <div className="az-form-grid">
            <Field label={l.date} name="pickupDate" type="date" min={today()} error={errors.pickupDate} />
            <Field label={l.weight} name="weight" maxLength={120} placeholder={l.weightPh} error={errors.weight} />
            <Field label={l.cargo} name="cargo" required rows={3} minLength={3} maxLength={1000} placeholder={l.cargoPh} wide error={errors.cargo} />
            <Field label={l.extra} name="requirements" rows={2} maxLength={2000} placeholder={l.extraPh} wide error={errors.requirements} />
          </div>
          <Honeypot />
          <FailedNotice show={failed} />
          <div className="az-form-footer">
            <p className="az-form-req">{l.required}</p>
            <PrivacyNote />
            <SubmitButton sending={mutation.isPending} label={l.send} />
          </div>
        </form>}
    </div>}
  </dialog>;
}
