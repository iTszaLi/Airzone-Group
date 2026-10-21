import { useRef, useState, type FormEvent } from 'react';
import { useCreateLogisticsEnquiry, type LogisticsEnquiryInput } from '@workspace/api-client-react';
import { useLocale } from '@/site/locale';
import { recordLead } from '@/analytics/runtime';
import { Field, FailedNotice, Honeypot, PHONE_PATTERN, PrivacyNote, SentPanel, SubmitButton, attribution, usePagePreset, useValidatedForm } from './FormKit';

export type FreightVariant = 'air' | 'sea' | 'destuffing' | 'exhibition';

type Opt = readonly [value: string, en: string, ar: string];
const DIRECTION: Opt[] = [['Import', 'Import into Saudi Arabia', 'استيراد إلى المملكة'], ['Export', 'Export from Saudi Arabia', 'تصدير من المملكة']];
const EX_DIRECTION: Opt[] = [['Import', 'Inbound: an event in Saudi Arabia', 'واردة: فعالية داخل المملكة'], ['Export', 'Outbound: an event outside Saudi Arabia', 'صادرة: فعالية خارج المملكة']];
const CUSTOMS: Opt[] = [
  ['import', 'Import clearance needed', 'أحتاج إلى تخليص الاستيراد'], ['export', 'Export clearance needed', 'أحتاج إلى تخليص التصدير'],
  ['both', 'Import and export clearance', 'تخليص الاستيراد والتصدير'], ['own', 'Handled by our own broker', 'يتولاه مخلّصنا الجمركي'],
  ['unsure', 'Not sure yet', 'لم أحدد بعد'],
];
const TEMPERATURE: Opt[] = [
  ['none', 'No temperature control', 'لا يحتاج إلى تحكم بالحرارة'], ['ambient', 'Controlled ambient', 'حرارة محيطة متحكم بها'],
  ['chilled', 'Chilled', 'مبرّد'], ['frozen', 'Frozen', 'مجمّد'], ['unsure', 'Not sure', 'غير متأكد'],
];
const AIR_SERVICE: Opt[] = [
  ['a2a', 'Airport to airport', 'من مطار إلى مطار'], ['pickup', 'Include collection at origin', 'يشمل الاستلام من المنشأ'],
  ['delivery', 'Include delivery at destination', 'يشمل التوصيل في الوجهة'], ['d2d', 'Door to door', 'من الباب إلى الباب'],
];
const AIR_SPECIAL: Opt[] = [
  ['urgent', 'Urgent shipment', 'شحنة عاجلة'], ['dg', 'Dangerous goods or batteries', 'بضائع خطرة أو بطاريات'],
  ['oversized', 'Oversized or heavy pieces', 'قطع كبيرة أو ثقيلة'], ['value', 'High-value goods', 'بضائع عالية القيمة'],
  ['parts', 'Spare parts or industrial equipment', 'قطع غيار أو معدات صناعية'], ['exhibition', 'Exhibition or event cargo', 'شحنة معرض أو فعالية'],
];
const LOAD: Opt[] = [
  ['FCL', 'Full container load (FCL)', 'حاوية كاملة (FCL)'], ['LCL', 'Less than container load (LCL)', 'شحنة جزئية (LCL)'],
  ['breakbulk', 'Breakbulk or project cargo', 'بضائع سائبة أو شحنات مشاريع'], ['unsure', 'Not sure — please advise', 'غير متأكد، أرجو النصح'],
];
const CONTAINER: Opt[] = [
  ['20ft', '20ft standard', 'حاوية 20 قدماً قياسية'], ['40ft', '40ft standard', 'حاوية 40 قدماً قياسية'], ['40hc', '40ft high cube', 'حاوية 40 قدماً مرتفعة'],
  ['reefer', 'Refrigerated (reefer)', 'حاوية مبرّدة'], ['opentop', 'Open top', 'حاوية مفتوحة السقف'], ['flatrack', 'Flat rack', 'حاوية مسطحة (Flat rack)'],
  ['other', 'Other / not sure', 'أخرى / غير متأكد'],
];
const INCOTERMS = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];
const SEA_EXTRAS: Opt[] = [
  ['port', 'Port collection and delivery', 'الاستلام من الميناء والتوصيل'], ['destuffing', 'Container destuffing', 'تفريغ الحاوية'],
  ['storage', 'Warehousing after release', 'التخزين بعد الفسح'], ['empty', 'Empty-container return', 'إعادة الحاوية الفارغة'],
];
const DESTUFF_SERVICE: Opt[] = [
  ['destuff', 'Import container destuffing (unloading)', 'تفريغ حاويات الاستيراد'], ['stuff', 'Export container stuffing (loading)', 'تحميل حاويات التصدير'],
  ['both', 'Both unloading and loading', 'التفريغ والتحميل معاً'],
];
const PALLET: Opt[] = [
  ['palletised', 'Palletised', 'على منصات (طبليات)'], ['loose', 'Loose cartons, floor-loaded', 'كراتين سائبة محمّلة على الأرضية'],
  ['crated', 'Machinery or crated items', 'معدات أو صناديق خشبية'], ['mixed', 'Mixed', 'مختلط'], ['unsure', 'Not sure', 'غير متأكد'],
];
const HANDLING: Opt[] = [
  ['fragile', 'Fragile goods', 'بضائع قابلة للكسر'], ['heavy', 'Heavy or oversized pieces', 'قطع ثقيلة أو كبيرة'],
  ['temperature', 'Temperature-sensitive goods', 'بضائع حساسة للحرارة'], ['dg', 'Dangerous goods', 'بضائع خطرة'],
  ['count', 'Piece count and photo record', 'عدّ القطع وتوثيقها بالصور'], ['repallet', 'Palletising or repalletising', 'التحميل على منصات أو إعادة التحميل'],
];
const LOCATION: Opt[] = [
  ['warehouse', 'At a warehouse arranged by Airzone', 'في مستودع ترتّبه إيرزون'], ['customer', 'At our own premises', 'في مقرنا'],
  ['unsure', 'Not sure — please advise', 'غير متأكد، أرجو النصح'],
];
const STORAGE: Opt[] = [
  ['none', 'No storage needed', 'لا حاجة إلى تخزين'], ['short', 'Short-term storage', 'تخزين قصير المدى'],
  ['long', 'Longer-term storage', 'تخزين طويل المدى'], ['unsure', 'Not sure', 'غير متأكد'],
];
const MODE: Opt[] = [
  ['Air', 'Air freight', 'شحن جوي'], ['Sea', 'Sea freight', 'شحن بحري'], ['Road', 'Road', 'نقل بري'],
  ['Multimodal', 'More than one mode', 'أكثر من وسيلة'], ['unsure', 'Not sure — please advise', 'غير متأكد، أرجو النصح'],
];
export const EQUIPMENT: Opt[] = [
  ['displays', 'Displays & booth materials', 'أجنحة العرض ومواد البوث'], ['led', 'LED screens & display technology', 'شاشات LED وتقنيات العرض'],
  ['av', 'Sound & audiovisual equipment', 'معدات الصوت والمرئيات'], ['lighting', 'Lighting', 'معدات الإضاءة'],
  ['staging', 'Stage, truss & structures', 'المسارح والجمالونات والهياكل'], ['it', 'Computers, networking & interactive tech', 'الحواسيب والشبكات والتقنيات التفاعلية'],
  ['samples', 'Samples & demonstration units', 'العينات ووحدات العرض التجريبي'], ['furniture', 'Furniture & accessories', 'الأثاث والملحقات'],
];
const SERIAL: Opt[] = [
  ['ready', 'Yes, a serial-numbered list is ready', 'نعم، القائمة بالأرقام التسلسلية جاهزة'], ['progress', 'Being prepared', 'قيد الإعداد'],
  ['no', 'No', 'لا'], ['na', 'Not applicable', 'لا ينطبق'],
];
const CARNET: Opt[] = [
  ['have', 'We have an ATA Carnet', 'لدينا دفتر ATA Carnet'], ['applying', 'Applying for one', 'قيد الإصدار'],
  ['no', 'No carnet', 'لا يوجد دفتر'], ['unsure', 'Not sure whether one is needed', 'غير متأكد من الحاجة إليه'],
];
const EX_CUSTOMS: Opt[] = [
  ['temporary', 'Temporary admission (goods return after the event)', 'إدخال مؤقت (تعود البضائع بعد الفعالية)'],
  ['permanent', 'Permanent import (goods stay, are sold or given away)', 'استيراد نهائي (تبقى البضائع أو تُباع أو تُوزَّع)'],
  ['mixed', 'Both', 'كلاهما'], ['unsure', 'Not sure — please advise', 'غير متأكد، أرجو النصح'],
];
const EX_STORAGE: Opt[] = [
  ['none', 'No storage needed', 'لا حاجة إلى تخزين'], ['before', 'Before the event', 'قبل الفعالية'],
  ['after', 'After the event', 'بعد الفعالية'], ['both', 'Before and after the event', 'قبل الفعالية وبعدها'],
];

const PRESET_KEYS = ['direction', 'load', 'containerType', 'special', 'extras', 'handling', 'equipment', 'mode', 'service'] as const;

const META: Record<FreightVariant, { service: string; source: string; submit: [string, string]; sent: [string, string] }> = {
  air: { service: 'Air freight', source: 'Website air freight form', submit: ['Request an air freight quote', 'اطلب عرض سعر للشحن الجوي'], sent: ['Thank you — your air freight request has been received.', 'شكراً لك، استلمنا طلب الشحن الجوي.'] },
  sea: { service: 'Sea freight', source: 'Website sea freight form', submit: ['Request a sea freight quote', 'اطلب عرض سعر للشحن البحري'], sent: ['Thank you — your sea freight request has been received.', 'شكراً لك، استلمنا طلب الشحن البحري.'] },
  destuffing: { service: 'Container destuffing & cargo handling', source: 'Website container destuffing form', submit: ['Request a handling quote', 'اطلب عرض سعر للمناولة'], sent: ['Thank you — your container handling request has been received.', 'شكراً لك، استلمنا طلب مناولة الحاويات.'] },
  exhibition: { service: 'Exhibition & event logistics', source: 'Website exhibition logistics form', submit: ['Request an exhibition logistics quote', 'اطلب عرض سعر للوجستيات المعرض'], sent: ['Thank you — your exhibition logistics request has been received.', 'شكراً لك، استلمنا طلب لوجستيات المعرض.'] },
};

const str = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const en = (list: readonly Opt[], v: string) => list.find(o => o[0] === v)?.[1] ?? '';
const many = (f: FormData, k: string, list: readonly Opt[]) => f.getAll(k).map(v => en(list, String(v))).filter(Boolean).join(', ');
const int = (f: FormData, k: string) => { const n = Number.parseInt(str(f, k), 10); return Number.isFinite(n) && n > 0 ? n : undefined; };

/**
 * Quotation request for air freight, sea freight, container destuffing and
 * exhibition logistics. Submits to the existing /api/enquiries/logistics
 * endpoint; the thank-you panel appears only after the API stores the enquiry.
 */
export function FreightForm({ variant }: { variant: FreightVariant }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const L = (e: string, a: string) => (ar ? a : e);
  const o = (list: readonly Opt[]) => list.map(([value, e, a]) => ({ value, label: ar ? a : e }));
  const meta = META[variant];
  const mutation = useCreateLogisticsEnquiry();
  const [sent, setSent] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  usePagePreset(formRef, PRESET_KEYS);

  /** Later dates may not precede earlier ones (event end, return / re-export). */
  const checkDates = (form: HTMLFormElement) => {
    const pairs: [string, string, string][] = [
      ['eventStart', 'eventEnd', L('The event end date cannot be before the start date.', 'لا يمكن أن يكون تاريخ انتهاء الفعالية قبل تاريخ بدئها.')],
      ['expectedDate', 'returnDate', L('The return date cannot be before the venue delivery date.', 'لا يمكن أن يكون تاريخ العودة قبل تاريخ التسليم إلى الموقع.')],
    ];
    for (const [a, b, msg] of pairs) {
      const first = form.elements.namedItem(a) as HTMLInputElement | null;
      const second = form.elements.namedItem(b) as HTMLInputElement | null;
      if (!first || !second || first.type !== 'date' || second.type !== 'date') continue;
      second.min = first.value || '';
      second.setCustomValidity(first.value && second.value && second.value < first.value ? msg : '');
    }
  };

  const { errors, onSubmit, onInput, onBlur, Summary } = useValidatedForm(f => {
    if (mutation.isPending) return;
    let shipmentType: LogisticsEnquiryInput['shipmentType'] = (str(f, 'direction') as 'Import' | 'Export') || 'Import';
    let mode: LogisticsEnquiryInput['mode'];
    let cargoType = str(f, 'commodity');
    let lines: (string | false | undefined)[] = [];
    if (variant === 'air') {
      mode = 'Air';
      lines = [
        `Airports: ${str(f, 'origin')} → ${str(f, 'destination')}`,
        `Service scope: ${en(AIR_SERVICE, str(f, 'scope'))}`,
        `Temperature: ${en(TEMPERATURE, str(f, 'temperature'))}`,
        `Customs: ${en(CUSTOMS, str(f, 'customs'))}`,
        many(f, 'special', AIR_SPECIAL) && `Special requirements: ${many(f, 'special', AIR_SPECIAL)}`,
      ];
    } else if (variant === 'sea') {
      mode = 'Sea';
      const load = str(f, 'load');
      lines = [
        `Ports: ${str(f, 'origin')} → ${str(f, 'destination')}`,
        `Load: ${en(LOAD, load)}`,
        str(f, 'containerType') && `Container type: ${en(CONTAINER, str(f, 'containerType'))}`,
        str(f, 'containers') && `Number of containers: ${str(f, 'containers')}`,
        str(f, 'incoterm') && `Incoterms: ${str(f, 'incoterm')}`,
        `Customs: ${en(CUSTOMS, str(f, 'customs'))}`,
        many(f, 'extras', SEA_EXTRAS) && `Also needed: ${many(f, 'extras', SEA_EXTRAS)}`,
      ];
    } else if (variant === 'destuffing') {
      const service = str(f, 'service');
      shipmentType = service === 'stuff' ? 'Export' : service === 'both' ? 'Domestic' : 'Import';
      lines = [
        `Service: ${en(DESTUFF_SERVICE, service)}`,
        `Containers: ${str(f, 'containers')} × ${en(CONTAINER, str(f, 'containerType'))}`,
        `Cargo presentation: ${en(PALLET, str(f, 'palletisation'))}`,
        many(f, 'handling', HANDLING) && `Handling requirements: ${many(f, 'handling', HANDLING)}`,
        `Unloading location: ${en(LOCATION, str(f, 'location'))}, ${str(f, 'origin')}`,
        `Storage: ${en(STORAGE, str(f, 'storage'))}`,
        `Onward destination: ${str(f, 'destination')}`,
      ];
    } else {
      const m = str(f, 'mode');
      mode = m === 'unsure' ? undefined : (m as LogisticsEnquiryInput['mode']);
      const equipment = many(f, 'equipment', EQUIPMENT);
      cargoType = (equipment || 'Exhibition cargo').slice(0, 120);
      lines = [
        `Event: ${str(f, 'eventName')}`,
        `Venue: ${str(f, 'destination')}`,
        `Event dates: ${str(f, 'eventStart')}${str(f, 'eventEnd') ? ` to ${str(f, 'eventEnd')}` : ''}`,
        `Venue delivery date: ${str(f, 'expectedDate')}`,
        str(f, 'returnDate') && `Return / re-export date: ${str(f, 'returnDate')}`,
        `Shipment mode: ${en(MODE, m)}`,
        equipment && `Equipment categories: ${equipment}`,
        `Serial-number inventory: ${en(SERIAL, str(f, 'serial'))}`,
        `ATA Carnet: ${en(CARNET, str(f, 'carnet'))}`,
        `Customs: ${en(EX_CUSTOMS, str(f, 'customs'))}`,
        `Storage: ${en(EX_STORAGE, str(f, 'storage'))}`,
        `Cargo list:\n${str(f, 'cargoList')}`,
      ];
    }
    const details = [lines.filter(Boolean).join('\n'), str(f, 'details')].filter(Boolean).join('\n\n').slice(0, 4000);
    const data: LogisticsEnquiryInput = {
      fullName: str(f, 'fullName'),
      company: str(f, 'company') || undefined,
      email: str(f, 'email'),
      mobile: str(f, 'mobile'),
      service: meta.service,
      shipmentType,
      origin: str(f, 'origin'),
      destination: str(f, 'destination'),
      cargoType: cargoType.slice(0, 120) || undefined,
      packages: int(f, 'packages'),
      weight: str(f, 'weight') || undefined,
      dimensions: str(f, 'dimensions') || undefined,
      incoterm: str(f, 'incoterm') || undefined,
      mode,
      expectedDate: str(f, 'expectedDate') || null,
      details,
      source: meta.source,
      ...attribution(),
    };
    setFailed(false);
    mutation.mutate({ data }, {
      onSuccess: r => { recordLead('logistics', r.reference, 'logistics', data.service); setSent(r.reference); },
      onError: () => setFailed(true),
    });
  });

  if (sent) return <SentPanel reference={sent} title={L(...meta.sent)}>
    <p>{L('The logistics team will review the details, confirm what can be arranged and reply with a written quotation. Please quote your reference in any follow-up email.', 'سيراجع فريق الخدمات اللوجستية التفاصيل ويؤكد ما يمكن ترتيبه ويرد بعرض سعر مكتوب. يُرجى ذكر رقم المرجع في أي مراسلة لاحقة.')}</p>
  </SentPanel>;

  const checks = (name: string, legend: string, list: readonly Opt[]) => <fieldset className="pk-checks">
    <legend>{legend}</legend>
    <div>{list.map(([v, e, a]) => <label key={v}><input type="checkbox" name={name} value={v} /><span>{ar ? a : e}</span></label>)}</div>
  </fieldset>;
  const weight = <Field label={variant === 'air' ? L('Gross weight', 'الوزن الإجمالي') : L('Cargo weight', 'وزن البضاعة')} name="weight" required={variant === 'air'} maxLength={80} placeholder={L('e.g. 420 kg', 'مثال: 420 كغ')} error={errors.weight} />;
  const packages = <Field label={L('Number of packages', 'عدد الطرود')} name="packages" type="number" inputMode="numeric" min={1} max={100000} error={errors.packages} />;
  const dimensions = <Field label={L('Dimensions', 'الأبعاد')} name="dimensions" maxLength={120} placeholder={L('e.g. 2 pallets, 120 × 100 × 150 cm each', 'مثال: منصتان، 120 × 100 × 150 سم لكل منها')} error={errors.dimensions} />;

  return <form ref={formRef} className="az-form pk-form" noValidate data-variant={variant} onSubmit={e => { checkDates(e.currentTarget); onSubmit(e); }}
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

    {variant === 'air' && <fieldset>
      <legend>{L('Air shipment', 'الشحنة الجوية')}</legend>
      <div className="az-form-grid">
        <Field label={L('Import or export', 'استيراد أو تصدير')} name="direction" required options={o(DIRECTION)} error={errors.direction} />
        <Field label={L('Service scope', 'نطاق الخدمة')} name="scope" required options={o(AIR_SERVICE)} error={errors.scope} />
        <Field label={L('Origin airport', 'مطار المنشأ')} name="origin" required minLength={2} maxLength={180} placeholder={L('City or airport, country', 'المدينة أو المطار، الدولة')} error={errors.origin} />
        <Field label={L('Destination airport', 'مطار الوجهة')} name="destination" required minLength={2} maxLength={180} placeholder={L('e.g. Riyadh (RUH)', 'مثال: الرياض (RUH)')} error={errors.destination} />
        <Field label={L('Cargo description', 'وصف البضاعة')} name="commodity" required minLength={3} maxLength={120} placeholder={L('e.g. pump spare parts', 'مثال: قطع غيار مضخات')} error={errors.commodity} />
        {packages}{weight}{dimensions}
        <Field label={L('Preferred departure date', 'تاريخ المغادرة المفضل')} name="expectedDate" type="date" error={errors.expectedDate} />
        <Field label={L('Temperature requirement', 'متطلبات الحرارة')} name="temperature" required options={o(TEMPERATURE)} error={errors.temperature} />
        <Field label={L('Customs clearance', 'التخليص الجمركي')} name="customs" required options={o(CUSTOMS)} error={errors.customs} />
      </div>
      {checks('special', L('Anything special about this cargo?', 'هل في الشحنة ما يستدعي عناية خاصة؟'), AIR_SPECIAL)}
    </fieldset>}

    {variant === 'sea' && <fieldset>
      <legend>{L('Sea shipment', 'الشحنة البحرية')}</legend>
      <div className="az-form-grid">
        <Field label={L('Import or export', 'استيراد أو تصدير')} name="direction" required options={o(DIRECTION)} error={errors.direction} />
        <Field label={L('FCL or LCL', 'حاوية كاملة أو شحنة جزئية')} name="load" required options={o(LOAD)} error={errors.load} />
        <Field label={L('Origin port', 'ميناء المنشأ')} name="origin" required minLength={2} maxLength={180} placeholder={L('Port, country', 'الميناء، الدولة')} error={errors.origin} />
        <Field label={L('Destination port', 'ميناء الوجهة')} name="destination" required minLength={2} maxLength={180} placeholder={L('e.g. Jeddah Islamic Port', 'مثال: ميناء جدة الإسلامي')} error={errors.destination} />
        <Field label={L('Container type', 'نوع الحاوية')} name="containerType" options={o(CONTAINER)} error={errors.containerType} />
        <Field label={L('Number of containers', 'عدد الحاويات')} name="containers" type="number" inputMode="numeric" min={1} max={500} error={errors.containers} />
        <Field label={L('Commodity', 'نوع البضاعة')} name="commodity" required minLength={3} maxLength={120} placeholder={L('e.g. ceramic tiles on pallets', 'مثال: بلاط سيراميك على منصات')} error={errors.commodity} />
        {packages}{weight}{dimensions}
        <Field label={L('Incoterms, if known', 'شروط التسليم (Incoterms) إن عُرفت')} name="incoterm" options={INCOTERMS.map(t => ({ value: t, label: t }))} error={errors.incoterm} />
        <Field label={L('Cargo ready date', 'تاريخ جاهزية الشحنة')} name="expectedDate" type="date" error={errors.expectedDate} />
        <Field label={L('Customs clearance', 'التخليص الجمركي')} name="customs" required options={o(CUSTOMS)} error={errors.customs} />
      </div>
      {checks('extras', L('Also needed after arrival', 'خدمات مطلوبة بعد الوصول'), SEA_EXTRAS)}
    </fieldset>}

    {variant === 'destuffing' && <fieldset>
      <legend>{L('Containers and cargo', 'الحاويات والبضاعة')}</legend>
      <div className="az-form-grid">
        <Field label={L('Service needed', 'الخدمة المطلوبة')} name="service" required options={o(DESTUFF_SERVICE)} error={errors.service} />
        <Field label={L('Container type', 'نوع الحاوية')} name="containerType" required options={o(CONTAINER)} error={errors.containerType} />
        <Field label={L('Number of containers', 'عدد الحاويات')} name="containers" type="number" inputMode="numeric" required min={1} max={500} error={errors.containers} />
        <Field label={L('Cargo description', 'وصف البضاعة')} name="commodity" required minLength={3} maxLength={120} placeholder={L('e.g. household appliances in cartons', 'مثال: أجهزة منزلية في كراتين')} error={errors.commodity} />
        {packages}{weight}
        <Field label={L('How is the cargo packed?', 'كيف عُبّئت البضاعة؟')} name="palletisation" required options={o(PALLET)} error={errors.palletisation} />
        <Field label={L('Unloading location', 'موقع التفريغ')} name="location" required options={o(LOCATION)} error={errors.location} />
        <Field label={L('City of unloading', 'مدينة التفريغ')} name="origin" required minLength={2} maxLength={180} placeholder={L('e.g. Dammam', 'مثال: الدمام')} error={errors.origin} />
        <Field label={L('Storage after unloading', 'التخزين بعد التفريغ')} name="storage" required options={o(STORAGE)} error={errors.storage} />
        <Field label={L('Onward destination', 'الوجهة التالية')} name="destination" required minLength={2} maxLength={180} hint={L('City or site. Write “storage” if the goods will stay in storage.', 'المدينة أو الموقع. اكتب “تخزين” إن كانت البضاعة ستبقى في المستودع.')} error={errors.destination} />
        <Field label={L('Expected container arrival', 'موعد وصول الحاوية المتوقع')} name="expectedDate" type="date" error={errors.expectedDate} />
      </div>
      {checks('handling', L('Handling requirements', 'متطلبات المناولة'), HANDLING)}
    </fieldset>}

    {variant === 'exhibition' && <>
      <fieldset>
        <legend>{L('Event', 'الفعالية')}</legend>
        <div className="az-form-grid">
          <Field label={L('Exhibition or event name', 'اسم المعرض أو الفعالية')} name="eventName" required minLength={2} maxLength={160} error={errors.eventName} />
          <Field label={L('Venue and city', 'الموقع والمدينة')} name="destination" required minLength={2} maxLength={180} placeholder={L('e.g. exhibition centre, Riyadh', 'مثال: مركز المعارض، الرياض')} error={errors.destination} />
          <Field label={L('Event start date', 'تاريخ بدء الفعالية')} name="eventStart" type="date" required error={errors.eventStart} />
          <Field label={L('Event end date', 'تاريخ انتهاء الفعالية')} name="eventEnd" type="date" error={errors.eventEnd} />
          <Field label={L('Required venue delivery date', 'تاريخ التسليم المطلوب إلى الموقع')} name="expectedDate" type="date" required error={errors.expectedDate} />
          <Field label={L('Return or re-export date', 'تاريخ العودة أو إعادة التصدير')} name="returnDate" type="date" error={errors.returnDate} />
        </div>
      </fieldset>
      <fieldset>
        <legend>{L('Cargo', 'البضاعة')}</legend>
        <div className="az-form-grid">
          <Field label={L('Inbound or outbound', 'واردة أو صادرة')} name="direction" required options={o(EX_DIRECTION)} error={errors.direction} />
          <Field label={L('Origin country and city', 'دولة ومدينة المنشأ')} name="origin" required minLength={2} maxLength={180} placeholder={L('e.g. Milan, Italy', 'مثال: ميلانو، إيطاليا')} error={errors.origin} />
          <Field label={L('Shipment mode', 'وسيلة الشحن')} name="mode" required options={o(MODE)} error={errors.mode} />
          {packages}{weight}{dimensions}
          <Field label={L('Serial-number inventory', 'قائمة الأرقام التسلسلية')} name="serial" required options={o(SERIAL)} error={errors.serial} />
          <Field label={L('ATA Carnet status', 'حالة دفتر ATA Carnet')} name="carnet" required options={o(CARNET)} error={errors.carnet} />
          <Field label={L('Customs requirement', 'المتطلب الجمركي')} name="customs" required options={o(EX_CUSTOMS)} error={errors.customs} />
          <Field label={L('Storage needs', 'احتياجات التخزين')} name="storage" required options={o(EX_STORAGE)} error={errors.storage} />
        </div>
        {checks('equipment', L('Equipment categories', 'فئات المعدات'), EQUIPMENT)}
        <Field label={L('Cargo list', 'قائمة البضائع')} name="cargoList" rows={4} required minLength={10} maxLength={2000} wide
          hint={L('Main items with quantities, for example “2 × LED wall cases, 6 × truss crates, 1 × demo machine”.', 'أهم القطع مع كمياتها، مثل “صندوقا شاشة LED، 6 صناديق جمالونات، آلة عرض واحدة”.')} error={errors.cargoList} />
      </fieldset>
    </>}

    <Field label={L('Anything else we should know', 'معلومات إضافية')} name="details" rows={3} maxLength={1800} wide
      hint={L('Documents are not uploaded here. After you receive a reference, send them to the logistics team by email.', 'لا تُرفع المستندات هنا. بعد استلام رقم المرجع، أرسلها إلى فريق الخدمات اللوجستية بالبريد الإلكتروني.')} error={errors.details} />
    <Honeypot />
    <FailedNotice show={failed} />
    <div className="az-form-footer">
      <PrivacyNote />
      <SubmitButton sending={mutation.isPending} label={L(...meta.submit)} />
    </div>
  </form>;
}
