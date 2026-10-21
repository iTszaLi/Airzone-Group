import { Truck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCreateLogisticsEnquiry, type LogisticsEnquiryInput } from '@workspace/api-client-react';
import { useLocale } from '@/site/locale';
import { serviceCatalog } from '@/config/service-catalog';
import { recordLead } from '@/analytics/runtime';
import { Field, FailedNotice, PHONE_PATTERN, Honeypot, PrivacyNote, SentPanel, SubmitButton, attribution, useValidatedForm } from './FormKit';


const shipmentTypes: { value: LogisticsEnquiryInput['shipmentType']; en: string; ar: string }[] = [
  { value: 'Domestic', en: 'Within Saudi Arabia', ar: 'داخل المملكة العربية السعودية' },
  { value: 'GCC', en: 'Cross-border within the GCC', ar: 'عبر الحدود داخل دول الخليج' },
  { value: 'Import', en: 'Import into Saudi Arabia', ar: 'استيراد إلى المملكة' },
  { value: 'Export', en: 'Export from Saudi Arabia', ar: 'تصدير من المملكة' },
  { value: 'International', en: 'Other international', ar: 'شحن دولي آخر' },
];
const equipment: [string, string][] = [
  ['Heavy-duty truck', 'شاحنة ثقيلة'], ['Flatbed trailer', 'مقطورة مسطحة'], ['Curtain-side trailer', 'مقطورة جانبية الستائر'],
  ['Other commercial trailer', 'مقطورة تجارية أخرى'], ['Specialised / oversized transport', 'نقل متخصص أو كبير الحجم'],
  ['Dayana 7-metre truck', 'شاحنة Dayana بطول 7 أمتار'], ['Dayana 5-metre truck', 'شاحنة Dayana بطول 5 أمتار'], ['Dayana van', 'عربة فان من Dayana'],
  ['Not sure, please advise', 'غير متأكد، أرجو الإرشاد'],
];
const temperatures: [string, string][] = [
  ['No temperature control needed', 'لا يلزم التحكم بالحرارة'], ['Temperature-controlled', 'متحكم بدرجة الحرارة'], ['Not sure yet', 'لم أحدد بعد'],
];

/** Logistics quotation request. Submits to the existing /api/enquiries/logistics endpoint. */
export function QuoteForm({ presetService }: { presetService?: string }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const mutation = useCreateLogisticsEnquiry();
  const [sent, setSent] = useState<{ reference: string; emailed: boolean } | null>(null);
  const [failed, setFailed] = useState(false);
  const serviceSelect = useRef<HTMLDivElement>(null);

  // Preselect a service from ?service=<slug> without affecting server output.
  useEffect(() => {
    const slug = presetService ?? new URLSearchParams(window.location.search).get('service');
    const entry = slug && serviceCatalog.find(s => s.path.endsWith(`/${slug}`));
    const select = serviceSelect.current?.querySelector('select');
    if (entry && select) select.value = entry.en.name;
    const eq = new URLSearchParams(window.location.search).get('equipment');
    const eqSelect = select?.form?.elements.namedItem('equipment') as HTMLSelectElement | null;
    if (eq && eqSelect && Array.from(eqSelect.options).some(o => o.value === eq)) eqSelect.value = eq;
  }, [presetService]);

  const { errors, onSubmit, onInput, onBlur, Summary } = useValidatedForm((f, form) => {
    const service = String(f.get('service'));
    const entry = serviceCatalog.find(s => s.en.name === service);
    const extras = [
      f.get('equipment') && `Preferred vehicle/equipment: ${f.get('equipment')}`,
      f.get('temperature') && `Temperature requirement: ${f.get('temperature')}`,
    ].filter(Boolean).join('\n');
    const details = [extras, String(f.get('details') || '').trim()].filter(Boolean).join('\n\n').slice(0, 4000);
    const data: LogisticsEnquiryInput = {
      fullName: String(f.get('fullName')).trim(),
      company: String(f.get('company') || '').trim() || undefined,
      email: String(f.get('email')).trim(),
      mobile: String(f.get('mobile')).trim(),
      service,
      shipmentType: String(f.get('shipmentType')) as LogisticsEnquiryInput['shipmentType'],
      origin: String(f.get('origin')).trim(),
      destination: String(f.get('destination')).trim(),
      cargoType: String(f.get('cargoType') || '').trim() || undefined,
      packages: f.get('packages') ? Number(f.get('packages')) : undefined,
      weight: String(f.get('weight') || '').trim() || undefined,
      dimensions: String(f.get('dimensions') || '').trim() || undefined,
      mode: entry?.group === 'transport' ? 'Road' : entry?.path.endsWith('air-freight') ? 'Air' : entry?.path.endsWith('sea-freight') ? 'Sea' : undefined,
      expectedDate: String(f.get('expectedDate') || '') || null,
      details: details || undefined,
      source: 'Website quote form',
      ...attribution(),
    };
    setFailed(false);
    mutation.mutate({ data }, {
      onSuccess: r => { recordLead('logistics', r.reference, 'logistics', service); setSent({ reference: r.reference, emailed: r.emailed === true }); form.reset(); },
      onError: () => setFailed(true),
    });
  });

  if (sent) return <SentPanel reference={sent.reference} title={ar ? 'تم إرسال طلبك بنجاح.' : 'Your enquiry has been submitted successfully.'}>
    <p>{sent.emailed
      ? (ar ? 'أُرسل طلبك إلى فريق إيرزون للخدمات اللوجستية، وسيتواصل معك بشأن عرض السعر أو أي معلومات إضافية مطلوبة.' : 'It has been sent to the Airzone Logistics team, who will contact you about the quotation or any further information needed.')
      : (ar ? 'سُجّل طلبك لدى فريق إيرزون للخدمات اللوجستية، وسيراجع التفاصيل ويتواصل معك بشأن عرض السعر أو أي معلومات إضافية مطلوبة.' : 'It has been recorded for the Airzone Logistics team, who will review the details and contact you about the quotation or any further information needed.')}</p>
  </SentPanel>;

  const L = (en: string, a: string) => (ar ? a : en);
  return <form className="az-form" noValidate onSubmit={onSubmit} onInput={onInput} onBlur={onBlur} aria-describedby="az-quote-req">
    <p className="az-form-for" data-division="logistics"><Truck size={16} aria-hidden="true" />{L('Logistics quotation request · Airzone Logistics', 'طلب عرض سعر للخدمات اللوجستية · إيرزون للخدمات اللوجستية')}</p>
    <p id="az-quote-req" className="az-form-req">{L('Fields marked * are required.', 'الحقول المعلّمة بـ * مطلوبة.')}</p>
    <Summary />
    <fieldset>
      <legend>{L('Your details', 'بياناتك')}</legend>
      <div className="az-form-grid">
        <Field label={L('Full name', 'الاسم الكامل')} name="fullName" required minLength={2} maxLength={120} autoComplete="name" error={errors.fullName} />
        <Field label={L('Company', 'الشركة')} name="company" maxLength={160} autoComplete="organization" error={errors.company} />
        <Field label={L('Business email', 'البريد الإلكتروني للعمل')} name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" dir="ltr" error={errors.email} />
        <Field label={L('Phone number', 'رقم الهاتف')} name="mobile" type="tel" required pattern={PHONE_PATTERN} maxLength={40} autoComplete="tel" inputMode="tel" dir="ltr" placeholder="+966" error={errors.mobile} />
      </div>
    </fieldset>
    <fieldset>
      <legend>{L('Shipment or service', 'الشحنة أو الخدمة')}</legend>
      <div className="az-form-grid">
        <div ref={serviceSelect} className="az-field-wrap">
          <Field label={L('Requested service', 'الخدمة المطلوبة')} name="service" required error={errors.service}
            options={[...serviceCatalog.map(s => ({ value: s.en.name, label: s[locale].name })), { value: 'Not sure yet', label: L('Not sure yet', 'لم أحدد بعد') }]} />
        </div>
        <Field label={L('Shipment type', 'نوع الشحنة')} name="shipmentType" required error={errors.shipmentType}
          options={shipmentTypes.map(s => ({ value: s.value, label: ar ? s.ar : s.en }))} />
        <Field label={L('Origin', 'نقطة الانطلاق')} name="origin" required minLength={2} maxLength={180} placeholder={L('City, country', 'المدينة، الدولة')} error={errors.origin} />
        <Field label={L('Destination', 'الوجهة')} name="destination" required minLength={2} maxLength={180} placeholder={L('City, country', 'المدينة، الدولة')} error={errors.destination} />
        <Field label={L('Preferred vehicle or equipment', 'المركبة أو المعدات المفضلة')} name="equipment" error={errors.equipment}
          options={equipment.map(([en, a]) => ({ value: en, label: ar ? a : en }))} />
        <Field label={L('Temperature requirement', 'متطلبات الحرارة')} name="temperature" error={errors.temperature}
          options={temperatures.map(([en, a]) => ({ value: en, label: ar ? a : en }))} />
        <Field label={L('Cargo description', 'وصف البضاعة')} name="cargoType" maxLength={120} placeholder={L('e.g. palletised food products', 'مثال: مواد غذائية على منصات')} error={errors.cargoType} />
        <Field label={L('Pallets or packages', 'عدد المنصات أو الطرود')} name="packages" type="number" inputMode="numeric" min={1} max={100000} error={errors.packages} />
        <Field label={L('Total weight', 'الوزن الإجمالي')} name="weight" maxLength={80} placeholder={L('e.g. 12,000 kg', 'مثال: 12,000 كغ')} error={errors.weight} />
        <Field label={L('Dimensions', 'الأبعاد')} name="dimensions" maxLength={120} placeholder={L('L × W × H per piece', 'الطول × العرض × الارتفاع لكل قطعة')} error={errors.dimensions} />
        <Field label={L('Required date', 'التاريخ المطلوب')} name="expectedDate" type="date" error={errors.expectedDate} />
      </div>
      <Field label={L('Additional requirements', 'متطلبات إضافية')} name="details" rows={5} maxLength={3500} wide
        hint={L('Loading or unloading conditions, permits, storage period, delivery windows or anything else we should know.', 'ظروف التحميل أو التفريغ، التصاريح، مدة التخزين، نوافذ التسليم أو أي معلومات أخرى.')} error={errors.details} />
    </fieldset>
    <Honeypot />
    <FailedNotice show={failed} />
    <div className="az-form-footer">
      <PrivacyNote />
      <SubmitButton sending={mutation.isPending} label={L('Send quote request', 'أرسل طلب عرض السعر')} />
    </div>
  </form>;
}
