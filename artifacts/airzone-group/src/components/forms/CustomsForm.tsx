import { useRef, useState, type FormEvent } from 'react';
import { useCreateLogisticsEnquiry, type LogisticsEnquiryInput } from '@workspace/api-client-react';
import { useLocale } from '@/site/locale';
import { recordLead } from '@/analytics/runtime';
import { cargoCategories } from '@/config/pillars/customs';
import { Field, FailedNotice, Honeypot, PHONE_PATTERN, PrivacyNote, SentPanel, SubmitButton, attribution, usePagePreset, useValidatedForm } from './FormKit';

const PRESET_KEYS = ['cargo', 'direction'] as const;

const DIRECTIONS = [
  { value: 'import', en: 'Import into Saudi Arabia', ar: 'استيراد إلى المملكة', type: 'Import' },
  { value: 'export', en: 'Export from Saudi Arabia', ar: 'تصدير من المملكة', type: 'Export' },
  { value: 'temporary', en: 'Temporary admission (ATA Carnet)', ar: 'إدخال مؤقت (دفتر ATA Carnet)', type: 'Import' },
  { value: 'reexport', en: 'Re-export', ar: 'إعادة تصدير', type: 'Export' },
] as const;
const MODES = [
  { value: 'Road', en: 'Road', ar: 'بري' }, { value: 'Sea', en: 'Sea', ar: 'بحري' }, { value: 'Air', en: 'Air', ar: 'جوي' },
  { value: 'Multimodal', en: 'More than one mode', ar: 'أكثر من وسيلة' }, { value: 'unsure', en: 'Not sure yet', ar: 'لم أحدد بعد' },
] as const;
const DOCS: [string, string, string][] = [
  ['invoice', 'Commercial invoice', 'الفاتورة التجارية'], ['packing', 'Packing list', 'قائمة التعبئة'],
  ['transport', 'Bill of lading / air waybill / road document', 'بوليصة الشحن / المستند البري'], ['origin', 'Certificate of origin', 'شهادة المنشأ'],
  ['saber', 'SABER certificates', 'شهادات سابر'], ['sfda', 'SFDA registration or permits', 'تسجيل أو تصاريح الهيئة العامة للغذاء والدواء'],
  ['carnet', 'ATA Carnet', 'دفتر ATA Carnet'], ['none', 'None yet', 'لا شيء بعد'],
];

/**
 * Customs clearance and ATA Carnet enquiry. Submits to the existing
 * /api/enquiries/logistics endpoint; success only after the API stores it.
 * Document upload is not offered (no secure upload service): customers send
 * documents after receiving a reference.
 */
export function CustomsForm({ variant = 'customs' }: { variant?: 'customs' | 'ata' }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const L = (en: string, a: string) => (ar ? a : en);
  const ata = variant === 'ata';
  const mutation = useCreateLogisticsEnquiry();
  const [sent, setSent] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  usePagePreset(formRef, PRESET_KEYS);

  const checkDates = (form: HTMLFormElement) => {
    const a = form.elements.namedItem('arrivalDate') as HTMLInputElement | null;
    const r = form.elements.namedItem('returnDate') as HTMLInputElement | null;
    if (!a || !r) return;
    r.min = a.value || '';
    r.setCustomValidity(a.value && r.value && r.value < a.value ? L('The re-export date cannot be before the arrival date.', 'لا يمكن أن يكون تاريخ إعادة التصدير قبل تاريخ الوصول.') : '');
  };

  const { errors, onSubmit, onInput, onBlur, Summary } = useValidatedForm(f => {
    if (mutation.isPending) return;
    const direction = DIRECTIONS.find(d => d.value === (ata ? 'temporary' : String(f.get('direction')))) ?? DIRECTIONS[0];
    const cargo = cargoCategories.find(c => c.id === String(f.get('cargo')));
    const mode = String(f.get('mode'));
    const docs = f.getAll('docs').map(v => DOCS.find(d => d[0] === v)?.[1]).filter(Boolean).join(', ');
    const lines = [
      `Customs route: ${direction.en}`,
      cargo && `Cargo category: ${cargo.title.en}`,
      f.get('hsCode') && `HS code: ${f.get('hsCode')}`,
      ata && `Event: ${f.get('eventName')} — ${f.get('venue')}`,
      ata && f.get('arrivalDate') && `Arrival: ${f.get('arrivalDate')}`,
      ata && f.get('returnDate') && `Re-export / return: ${f.get('returnDate')}`,
      ata && `ATA Carnet available: ${f.get('carnet')}`,
      docs && `Documents available: ${docs}`,
    ].filter(Boolean).join('\n');
    const details = [lines, String(f.get('details') || '').trim()].filter(Boolean).join('\n\n').slice(0, 4000);
    const data: LogisticsEnquiryInput = {
      fullName: String(f.get('fullName')).trim(),
      company: String(f.get('company') || '').trim() || undefined,
      email: String(f.get('email')).trim(),
      mobile: String(f.get('mobile')).trim(),
      service: ata ? 'ATA Carnet & exhibition cargo' : 'Customs clearance',
      shipmentType: direction.type,
      origin: String(f.get('origin')).trim(),
      destination: String(f.get('destination')).trim(),
      cargoType: String(f.get('commodity') || '').trim().slice(0, 120) || undefined,
      weight: String(f.get('weight') || '').trim() || undefined,
      mode: mode === 'unsure' ? undefined : (mode as LogisticsEnquiryInput['mode']),
      expectedDate: String(f.get(ata ? 'arrivalDate' : 'expectedDate') || '') || null,
      details,
      source: ata ? 'Website ATA Carnet form' : 'Website customs clearance form',
      ...attribution(),
    };
    setFailed(false);
    mutation.mutate({ data }, {
      onSuccess: r => { recordLead('logistics', r.reference, 'logistics', data.service); setSent(r.reference); },
      onError: () => setFailed(true),
    });
  });

  if (sent) return <SentPanel reference={sent} title={L('Thank you — your customs request has been received.', 'شكراً لك، استلمنا طلبك الجمركي.')}>
    <p>{L('The logistics team will review your shipment, confirm the requirements and reply with a written quotation. Please quote your reference when you send documents by email.', 'سيراجع فريق الخدمات اللوجستية شحنتك ويؤكد المتطلبات ويرد بعرض سعر مكتوب. يُرجى ذكر رقم المرجع عند إرسال المستندات بالبريد الإلكتروني.')}</p>
  </SentPanel>;

  return <form ref={formRef} className="az-form pk-form" noValidate onSubmit={e => { checkDates(e.currentTarget); onSubmit(e); }}
    onInput={(e: FormEvent<HTMLFormElement>) => { checkDates(e.currentTarget); onInput(e); }} onBlur={onBlur}>
    <p className="az-form-req">{L('Fields marked * are required.', 'الحقول المعلّمة بـ * مطلوبة.')}</p>
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
    {ata && <fieldset>
      <legend>{L('Event', 'الفعالية')}</legend>
      <div className="az-form-grid">
        <Field label={L('Exhibition or event name', 'اسم المعرض أو الفعالية')} name="eventName" required minLength={2} maxLength={160} error={errors.eventName} />
        <Field label={L('Venue and city', 'الموقع والمدينة')} name="venue" required minLength={2} maxLength={160} error={errors.venue} />
        <Field label={L('Arrival date in Saudi Arabia', 'تاريخ الوصول إلى المملكة')} name="arrivalDate" type="date" required error={errors.arrivalDate} />
        <Field label={L('Re-export / return date', 'تاريخ إعادة التصدير / العودة')} name="returnDate" type="date" error={errors.returnDate} />
        <Field label={L('Is an ATA Carnet available?', 'هل يتوفر دفتر ATA Carnet؟')} name="carnet" required error={errors.carnet}
          options={[{ value: 'Yes', label: L('Yes', 'نعم') }, { value: 'No', label: L('No', 'لا') }, { value: 'Not sure', label: L('Not sure', 'غير متأكد') }]} />
      </div>
    </fieldset>}
    <fieldset>
      <legend>{L('Shipment', 'الشحنة')}</legend>
      <div className="az-form-grid">
        {!ata && <Field label={L('Import or export', 'استيراد أو تصدير')} name="direction" required error={errors.direction}
          options={DIRECTIONS.map(d => ({ value: d.value, label: ar ? d.ar : d.en }))} />}
        <Field label={L('Cargo type', 'نوع البضاعة')} name="cargo" required error={errors.cargo} defaultValue={ata ? 'exhibition' : undefined}
          options={cargoCategories.map(c => ({ value: c.id, label: c.title[locale] }))} />
        <Field label={L('Origin', 'المنشأ')} name="origin" required minLength={2} maxLength={180} placeholder={L('City, country', 'المدينة، الدولة')} error={errors.origin} />
        <Field label={L('Destination', 'الوجهة')} name="destination" required minLength={2} maxLength={180} placeholder={L('City, country', 'المدينة، الدولة')} error={errors.destination} />
        <Field label={L('Mode of transport', 'وسيلة النقل')} name="mode" required error={errors.mode}
          options={MODES.map(m => ({ value: m.value, label: ar ? m.ar : m.en }))} />
        <Field label={L('Commodity description', 'وصف البضاعة')} name="commodity" required minLength={3} maxLength={120} placeholder={L('e.g. LED lighting fixtures', 'مثال: وحدات إنارة LED')} error={errors.commodity} />
        <Field label={L('HS code, if known', 'الرمز الجمركي إن وُجد')} name="hsCode" maxLength={20} dir="ltr" error={errors.hsCode} />
        <Field label={L('Weight or volume', 'الوزن أو الحجم')} name="weight" maxLength={80} placeholder={L('e.g. 8,000 kg / 2 × 40ft', 'مثال: 8,000 كغ / حاويتان 40 قدم')} error={errors.weight} />
        {!ata && <Field label={L('Expected shipment date', 'تاريخ الشحن المتوقع')} name="expectedDate" type="date" error={errors.expectedDate} />}
      </div>
      <fieldset className="pk-checks">
        <legend>{L('Documents you already have', 'المستندات المتوفرة لديك')}</legend>
        <div>{DOCS.map(([v, en, a]) => <label key={v}><input type="checkbox" name="docs" value={v} /><span>{ar ? a : en}</span></label>)}</div>
      </fieldset>
      <Field label={L('Anything else we should know', 'معلومات إضافية')} name="details" rows={4} maxLength={3000} wide
        hint={L('Documents are not uploaded here. After you receive a reference, send them to the logistics team by email.', 'لا تُرفع المستندات هنا. بعد استلام رقم المرجع، أرسلها إلى فريق الخدمات اللوجستية بالبريد الإلكتروني.')} error={errors.details} />
    </fieldset>
    <Honeypot />
    <FailedNotice show={failed} />
    <div className="az-form-footer">
      <PrivacyNote />
      <SubmitButton sending={mutation.isPending} label={ata ? L('Request ATA Carnet assistance', 'اطلب المساعدة في دفتر ATA Carnet') : L('Request customs clearance', 'اطلب خدمة التخليص الجمركي')} />
    </div>
  </form>;
}
