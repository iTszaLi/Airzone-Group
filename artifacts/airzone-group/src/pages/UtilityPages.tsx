import { useEffect, useId, useState, type FormEvent } from 'react';
import { ArrowRight, CircleHelp, Clock, FileText, LoaderCircle, Mail, MoveRight, PackageCheck, PackageSearch, Phone, PhoneCall } from 'lucide-react';
import {
  getGetShipmentTrackingQueryKey, useCreateCallbackRequest, useGetShipmentTracking, type CallbackRequestInput,
} from '@workspace/api-client-react';
import { Link, useLocale } from '@/site/locale';
import { t } from '@/lib/i18n';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/ui-kit/Primitives';
import { Field, FailedNotice, Honeypot, PHONE_PATTERN, PrivacyNote, SentPanel, SubmitButton, attribution, useValidatedForm } from '@/components/forms/FormKit';
import { businessContacts } from '@/config/business-contacts';
import { recordLead } from '@/analytics/runtime';
import { departmentDivision } from '@/analytics/events';

const useT = () => {
  const { locale } = useLocale();
  return { locale, ar: locale === 'ar', T: (en: string, a: string) => (locale === 'ar' ? a : en) };
};

/** Shipment lookup against records entered by Airzone administrators (not live carrier data). */
export function TrackPage() {
  const { locale, T } = useT();
  const inputId = useId();
  const [number, setNumber] = useState('');
  const [submitted, setSubmitted] = useState('');
  // Deep link from the homepage tracking box: /track?n=<number> runs the lookup on arrival.
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get('n')?.trim().slice(0, 60);
    if (n) { setNumber(n); setSubmitted(n); }
  }, []);
  const query = useGetShipmentTracking(submitted, { query: { enabled: !!submitted, queryKey: getGetShipmentTrackingQueryKey(submitted), retry: false } });
  const shipment = query.data;
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSubmitted(number.trim()); };
  const logistics = businessContacts.logistics;

  return <Layout>
    <PageHero compact photo="curtainTrailer" eyebrow={T('Shipment tracking', 'تتبع الشحنات')}
      title={T('Track a shipment', 'تتبع شحنة')}
      intro={T('Enter the tracking number from your Airzone confirmation to see the latest status recorded for your shipment.', 'أدخل رقم التتبع الوارد في تأكيد إيرزون لعرض أحدث حالة مسجلة لشحنتك.')}
      crumbs={[{ href: '/', label: T('Home', 'الرئيسية') }, { label: T('Track a shipment', 'تتبع شحنة') }]} />
    <section className="az-section-tight">
      <div className="az-container az-track-grid">
        <div className="az-card az-form-card az-track-lookup">
          <h2>{T('Find your shipment', 'ابحث عن شحنتك')}</h2>
          <form className="az-track-form" onSubmit={onSubmit}>
            <div className="az-field">
              <label htmlFor={inputId}>{T('Tracking number', 'رقم التتبع')}</label>
              <div className="az-track-input">
                <PackageSearch size={18} aria-hidden="true" />
                <input id={inputId} data-testid="input-tracking-number" value={number} onChange={e => setNumber(e.target.value)}
                  required maxLength={60} autoComplete="off" spellCheck={false} dir="ltr" placeholder={T('Enter your tracking number', 'أدخل رقم التتبع')} />
              </div>
            </div>
            <button type="submit" className="az-btn az-btn-primary" disabled={query.isFetching} aria-disabled={query.isFetching}>
              {query.isFetching
                ? <><LoaderCircle size={17} className="az-spin" aria-hidden="true" />{T('Looking up…', 'جارٍ البحث…')}</>
                : <>{T('Track shipment', 'تتبع الشحنة')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></>}
            </button>
          </form>
          <p className="az-hint az-track-note">{t(locale, 'track.manual')}</p>
        </div>

        <div className="az-card az-track-result" aria-live="polite" aria-busy={query.isFetching}>
          {!submitted && <div className="az-track-state">
            <PackageCheck size={30} aria-hidden="true" />
            <h2>{T('Your shipment details will appear here', 'ستظهر تفاصيل شحنتك هنا')}</h2>
            <p className="az-muted">{T('Status, route, current location and the updates recorded by our team.', 'الحالة والمسار والموقع الحالي والمستجدات التي يسجلها فريقنا.')}</p>
          </div>}
          {query.isFetching && <div className="az-track-skeleton" aria-label={T('Loading', 'جارٍ التحميل')}><i /><i /><i /><i /></div>}
          {query.isError && !query.isFetching && <div className="az-track-state is-error" role="alert">
            <CircleHelp size={30} aria-hidden="true" />
            <h2>{T('We could not find that number', 'لم نعثر على هذا الرقم')}</h2>
            <p className="az-muted">{T('Check the number on your confirmation and try again. If it still does not appear, our logistics team can help.', 'تحقق من الرقم في التأكيد وحاول مرة أخرى. إذا لم يظهر، يمكن لفريق الخدمات اللوجستية مساعدتك.')}</p>
            <Link href="/contact" className="az-text-link">{T('Contact the logistics team', 'تواصل مع فريق الخدمات اللوجستية')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
          </div>}
          {shipment && !query.isFetching && <div className="az-shipment">
            <p className="az-shipment-number">{T('Tracking number', 'رقم التتبع')} <b data-testid="text-tracking-number" dir="ltr">{shipment.trackingNumber}</b></p>
            <div className="az-shipment-status"><span className="az-status-dot" aria-hidden="true" /><div><small>{T('Current status', 'الحالة الحالية')}</small><h2>{shipment.status}</h2></div></div>
            <div className="az-shipment-route">
              <span><small>{T('Origin', 'المنشأ')}</small><b>{shipment.origin}</b></span>
              <MoveRight size={20} aria-hidden="true" className="az-flip" />
              <span><small>{T('Destination', 'الوجهة')}</small><b>{shipment.destination}</b></span>
            </div>
            <dl className="az-shipment-meta">
              <div><dt>{T('Shipment type', 'نوع الشحنة')}</dt><dd>{shipment.shipmentType}</dd></div>
              {shipment.currentLocation && <div><dt>{T('Current location', 'الموقع الحالي')}</dt><dd>{shipment.currentLocation}</dd></div>}
              {shipment.estimatedDelivery && <div><dt>{T('Estimated delivery', 'موعد التسليم المتوقع')}</dt><dd>{shipment.estimatedDelivery}</dd></div>}
            </dl>
            {shipment.events.length > 0 && <>
              <h3>{T('Shipment updates', 'مستجدات الشحنة')}</h3>
              <ol className="az-shipment-events">{shipment.events.map((ev, i) => <li key={`${ev.occurredAt}-${i}`} className={i === 0 ? 'is-current' : undefined}>
                <b>{ev.status}</b>
                {ev.location && <span>{ev.location}</span>}
                {ev.note && <p>{ev.note}</p>}
                <time dateTime={ev.occurredAt}>{new Date(ev.occurredAt).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</time>
              </li>)}</ol>
            </>}
          </div>}
        </div>
      </div>
    </section>
    <section className="az-section-tight az-track-help">
      <div className="az-container az-track-help-inner">
        <div>
          <h2>{T('Need help with a shipment?', 'هل تحتاج إلى مساعدة بشأن شحنة؟')}</h2>
          <p className="az-muted">{T('Our logistics team can answer questions about a booking, documents or delivery.', 'يمكن لفريق الخدمات اللوجستية الإجابة عن أسئلتك حول الحجز أو المستندات أو التسليم.')}</p>
        </div>
        <ul className="az-contact-list">
          <li><Mail size={18} aria-hidden="true" /><span><b>{T('Email', 'البريد الإلكتروني')}</b>{logistics.emails.map(e => <a key={e} href={`mailto:${e}`} dir="ltr">{e}</a>)}</span></li>
          {logistics.phone && <li><Phone size={18} aria-hidden="true" /><span><b>{T('Phone', 'الهاتف')}</b><a href={logistics.phone.href} dir="ltr">{logistics.phone.label}</a></span></li>}
          <li><PhoneCall size={18} aria-hidden="true" /><span><b>{T('Callback', 'معاودة الاتصال')}</b><Link href="/callback">{T('Request a callback', 'اطلب معاودة الاتصال')}</Link></span></li>
        </ul>
      </div>
    </section>
  </Layout>;
}

const departments: { value: CallbackRequestInput['department']; en: string; ar: string }[] = [
  { value: 'Logistics', en: 'Transportation, warehousing or delivery', ar: 'النقل أو التخزين أو التوصيل' },
  { value: 'Customs Clearance', en: 'Customs support', ar: 'دعم الجمارك' },
  { value: 'Travel & Tourism', en: 'Travel & Tourism', ar: 'السفر والسياحة' },
  { value: 'Corporate Travel', en: 'Corporate travel', ar: 'سفر الأعمال' },
  { value: 'General Enquiry', en: 'General enquiry', ar: 'استفسار عام' },
];

/** Callback request. Submits to the existing /api/enquiries/callback endpoint. */
export function CallbackPage() {
  const { ar, T } = useT();
  const mutation = useCreateCallbackRequest();
  const [sent, setSent] = useState<{ reference: string; emailed: boolean } | null>(null);
  // Division whose email is offered if sending fails; follows the chosen team.
  const [failed, setFailed] = useState<'logistics' | 'travel' | null>(null);
  const { errors, onSubmit, onInput, onBlur, Summary } = useValidatedForm((f, form) => {
    const data: CallbackRequestInput = {
      name: String(f.get('name')).trim(),
      mobile: String(f.get('mobile')).trim(),
      department: String(f.get('department')) as CallbackRequestInput['department'],
      preferredTime: String(f.get('preferredTime')).trim(),
      message: String(f.get('message') || '').trim() || undefined,
      urgency: String(f.get('urgency')) as CallbackRequestInput['urgency'],
      source: 'Website callback',
      ...attribution(),
    };
    setFailed(null);
    mutation.mutate({ data }, {
      onSuccess: r => { recordLead('callback', r.reference, departmentDivision(data.department)); setSent({ reference: r.reference, emailed: r.emailed === true }); form.reset(); },
      onError: () => setFailed(departmentDivision(data.department) === 'travel' ? 'travel' : 'logistics'),
    });
  });

  return <Layout closingCta={false}>
    <PageHero compact photo="airportHall" eyebrow={T('Callback', 'معاودة الاتصال')}
      title={T('Request a callback', 'اطلب معاودة الاتصال')}
      intro={T('Share your number, the team you need and a time that suits you. The relevant team will call you back.', 'شارك رقمك والفريق الذي تحتاجه والوقت المناسب لك، وسيعاود الفريق المعني الاتصال بك.')}
      crumbs={[{ href: '/', label: T('Home', 'الرئيسية') }, { label: T('Request a callback', 'اطلب معاودة الاتصال') }]} />
    <section className="az-section-tight">
      <div className="az-container az-contact-grid">
        <div className="az-card az-card-muted az-callback-aside">
          <h2>{T('How callbacks work', 'كيف تتم معاودة الاتصال')}</h2>
          <ul className="az-contact-list">
            <li><PhoneCall size={18} aria-hidden="true" /><span><b>{T('Routed to the right team', 'يُوجَّه إلى الفريق المناسب')}</b>{T('Logistics, customs and travel requests each go to their own team.', 'يُحال كل طلب لوجستي أو جمركي أو سياحي إلى فريقه المختص.')}</span></li>
            <li><Clock size={18} aria-hidden="true" /><span><b>{T('Your preferred time', 'الوقت المناسب لك')}</b>{T('We aim to call at the time you choose; it is not a confirmed appointment.', 'نسعى للاتصال في الوقت الذي تختاره، ولا يُعد ذلك موعداً مؤكداً.')}</span></li>
            <li><FileText size={18} aria-hidden="true" /><span><b>{T('Have shipment details?', 'لديك تفاصيل الشحنة؟')}</b><Link href="/logistics/request-quote">{T('Use the detailed quote form', 'استخدم نموذج عرض السعر المفصّل')}</Link></span></li>
          </ul>
        </div>
        <div className="az-card az-form-card">
          {sent
            ? <SentPanel reference={sent.reference} title={T('Thank you — your callback request has been received.', 'شكراً لك، استلمنا طلب معاودة الاتصال.')}>
                <p>{sent.emailed
                  ? T('It has been sent to the relevant Airzone team, who will call the number you provided.', 'أُرسل طلبك إلى فريق إيرزون المعني، وسيتصل بك على الرقم الذي قدمته.')
                  : T('The relevant Airzone team will call the number you provided.', 'سيتصل بك فريق إيرزون المعني على الرقم الذي قدمته.')}</p>
              </SentPanel>
            : <form className="az-form" noValidate onSubmit={onSubmit} onInput={onInput} onBlur={onBlur}>
                <p className="az-form-req">{T('Fields marked * are required.', 'الحقول المعلّمة بـ * مطلوبة.')}</p>
                <Summary />
                <div className="az-form-grid">
                  <Field label={T('Full name', 'الاسم الكامل')} name="name" required minLength={2} maxLength={120} autoComplete="name" error={errors.name} />
                  <Field label={T('Mobile number', 'رقم الجوال')} name="mobile" type="tel" required pattern={PHONE_PATTERN} minLength={5} maxLength={40} autoComplete="tel" inputMode="tel" dir="ltr" error={errors.mobile} />
                  <Field label={T('Team', 'الفريق')} name="department" required error={errors.department}
                    options={departments.map(d => ({ value: d.value, label: ar ? d.ar : d.en }))} />
                  <Field label={T('Urgency', 'الأولوية')} name="urgency" required defaultValue="Normal" error={errors.urgency}
                    options={[{ value: 'Normal', label: T('Normal', 'عادية') }, { value: 'Urgent', label: T('Urgent', 'عاجلة') }]} />
                  <Field label={T('Preferred time', 'الوقت المناسب للاتصال')} name="preferredTime" required minLength={2} maxLength={120} wide
                    placeholder={T('e.g. Sunday morning, 9–11 am', 'مثال: صباح الأحد، 9–11 صباحاً')} error={errors.preferredTime} />
                </div>
                <Field label={T('Message', 'الرسالة')} name="message" rows={4} maxLength={2000} wide error={errors.message} />
                <Honeypot />
                <FailedNotice show={failed !== null} division={failed ?? 'logistics'} />
                <div className="az-form-footer">
                  <PrivacyNote />
                  <SubmitButton sending={mutation.isPending} label={T('Request callback', 'اطلب معاودة الاتصال')} />
                </div>
              </form>}
        </div>
      </div>
    </section>
  </Layout>;
}
