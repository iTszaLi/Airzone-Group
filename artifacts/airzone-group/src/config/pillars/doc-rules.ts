import { l, type L } from './types';
import { OFFICIAL } from './customs';

/**
 * Indicative document rules for the "Find the documents required for your
 * shipment" checker. General guidance assembled from official sources
 * (ZATCA import instructions, SABER, SASO IEC/IECEE, SFDA, GACA); it is not an
 * official determination and always ends with a confirmation disclaimer.
 */
export type Direction = 'import' | 'export' | 'reexport' | 'temporary';
export type Mode = 'road' | 'sea' | 'air';
export type Category = 'general' | 'food' | 'medicines' | 'devices' | 'cosmetics' | 'electrical' | 'telecom' | 'vehicles' | 'machinery' | 'chemicals' | 'aviation' | 'exhibition' | 'agri';

export const directions: { value: Direction; label: L }[] = [
  { value: 'import', label: l('Import into Saudi Arabia', 'استيراد إلى المملكة') },
  { value: 'export', label: l('Export from Saudi Arabia', 'تصدير من المملكة') },
  { value: 'reexport', label: l('Re-export', 'إعادة تصدير') },
  { value: 'temporary', label: l('Temporary admission (e.g. ATA Carnet)', 'إدخال مؤقت (مثل دفتر ATA Carnet)') },
];
export const modes: { value: Mode; label: L }[] = [
  { value: 'road', label: l('Road', 'بري') }, { value: 'sea', label: l('Sea', 'بحري') }, { value: 'air', label: l('Air', 'جوي') },
];
export const categories: { value: Category; label: L }[] = [
  { value: 'general', label: l('General commercial goods', 'بضائع تجارية عامة') },
  { value: 'food', label: l('Food & beverages', 'أغذية ومشروبات') },
  { value: 'medicines', label: l('Medicines', 'أدوية') },
  { value: 'devices', label: l('Medical devices & supplies', 'أجهزة ومستلزمات طبية') },
  { value: 'cosmetics', label: l('Cosmetics & personal care', 'مستحضرات تجميل وعناية شخصية') },
  { value: 'electrical', label: l('Electrical & electronic products', 'منتجات كهربائية وإلكترونية') },
  { value: 'telecom', label: l('Radio & telecom equipment', 'أجهزة لاسلكية واتصالات') },
  { value: 'vehicles', label: l('Vehicles & spare parts', 'مركبات وقطع غيار') },
  { value: 'machinery', label: l('Machinery & project cargo', 'معدات وشحنات مشاريع') },
  { value: 'chemicals', label: l('Chemicals & dangerous goods', 'كيماويات وبضائع خطرة') },
  { value: 'aviation', label: l('Aircraft parts & aviation equipment', 'قطع طائرات ومعدات طيران') },
  { value: 'exhibition', label: l('Exhibition materials & samples', 'مواد معارض وعينات') },
  { value: 'agri', label: l('Plants, animals & agricultural products', 'نباتات وحيوانات ومنتجات زراعية') },
];

export type CheckItem = { text: L; url?: string };
export type CheckGroup = { title: L; items: CheckItem[] };
export type CheckInput = { direction: Direction; mode: Mode; categories: Category[]; hsKnown: boolean; carnet: 'yes' | 'no' | 'unsure' };

const transportDoc: Record<Mode, L> = {
  road: l('Road consignment note / truck manifest', 'مستند الشحن البري / بيان الشاحنة'),
  sea: l('Bill of lading', 'بوليصة الشحن البحري'),
  air: l('Air waybill', 'بوليصة الشحن الجوي'),
};

const byCategory: Record<Category, CheckGroup> = {
  general: { title: l('General goods', 'البضائع العامة'), items: [
    { text: l('Check the customs tariff for import conditions on the HS code', 'مراجعة التعرفة الجمركية لشروط الاستيراد على الرمز الجمركي'), url: OFFICIAL.zatcaImport },
    { text: l('SABER product and shipment certificates if the product is under a technical regulation', 'شهادات المنتج والإرسالية عبر سابر إذا كان المنتج خاضعاً للائحة فنية'), url: OFFICIAL.saber },
  ] },
  food: { title: l('Food & beverages (SFDA)', 'الأغذية والمشروبات (الهيئة العامة للغذاء والدواء)'), items: [
    { text: l('SFDA importer/establishment registration and product registration where required', 'تسجيل المستورد أو المنشأة والمنتج لدى الهيئة عند الحاجة'), url: OFFICIAL.sfda },
    { text: l('Health certificate from the country of origin', 'الشهادة الصحية من بلد المنشأ') },
    { text: l('Halal and slaughter certificates for meat and poultry', 'شهادات الحلال والذبح للحوم والدواجن') },
    { text: l('Arabic labelling meeting Saudi requirements', 'بطاقة بيانات عربية مطابقة للمتطلبات السعودية') },
    { text: l('Allow for SFDA inspection and sampling before release', 'احتساب فحص الهيئة وسحب العينات قبل الفسح') },
  ] },
  medicines: { title: l('Medicines (SFDA)', 'الأدوية (الهيئة العامة للغذاء والدواء)'), items: [
    { text: l('Import through an SFDA-licensed importer', 'الاستيراد عبر مستورد مرخّص من الهيئة'), url: OFFICIAL.sfda },
    { text: l('Product registration or marketing authorisation', 'تسجيل المنتج أو إذن تسويقه') },
    { text: l('Product-specific import permit where required', 'تصريح استيراد خاص بالمنتج عند الحاجة') },
    { text: l('Storage and transport temperature records', 'سجلات حرارة التخزين والنقل') },
  ] },
  devices: { title: l('Medical devices (SFDA)', 'الأجهزة الطبية (الهيئة العامة للغذاء والدواء)'), items: [
    { text: l('Medical device marketing authorisation and establishment requirements', 'إذن تسويق الجهاز الطبي ومتطلبات المنشأة'), url: OFFICIAL.sfdaDevices },
    { text: l('SFDA shipment clearance requirements (MDS-REQ5)', 'متطلبات فسح الشحنات لدى الهيئة (MDS-REQ5)'), url: OFFICIAL.sfdaDevices },
  ] },
  cosmetics: { title: l('Cosmetics (SFDA)', 'مستحضرات التجميل (الهيئة العامة للغذاء والدواء)'), items: [
    { text: l('Product notification/listing with SFDA', 'إشعار المنتج أو إدراجه لدى الهيئة'), url: OFFICIAL.sfda },
    { text: l('Labelling and ingredient information', 'بطاقة البيانات ومعلومات المكونات') },
  ] },
  electrical: { title: l('Electrical & electronics (SASO / SABER / IECEE)', 'الكهربائيات والإلكترونيات (الهيئة السعودية للمواصفات / سابر / IECEE)'), items: [
    { text: l('Identify the applicable SASO technical regulation', 'تحديد اللائحة الفنية المطبقة لدى الهيئة السعودية للمواصفات'), url: OFFICIAL.saso },
    { text: l('SABER product certificate of conformity and shipment certificate', 'شهادة مطابقة المنتج وشهادة الإرسالية عبر سابر'), url: OFFICIAL.saber },
    { text: l('Saudi IECEE national recognition certificate for listed products (needs a CB test report and certificate)', 'شهادة الاعتراف الوطني IECEE للمنتجات المدرجة (تتطلب تقرير وشهادة اختبار CB)'), url: OFFICIAL.iecee },
    { text: l('Energy-efficiency certification where applicable', 'شهادة كفاءة الطاقة عند الانطباق') },
  ] },
  telecom: { title: l('Radio & telecom (CST)', 'الاتصالات واللاسلكي (هيئة الاتصالات والفضاء والتقنية)'), items: [
    { text: l('Equipment approval from the Communications, Space and Technology Commission', 'اعتماد الأجهزة من هيئة الاتصالات والفضاء والتقنية'), url: OFFICIAL.cst },
  ] },
  vehicles: { title: l('Vehicles & spare parts', 'المركبات وقطع الغيار'), items: [
    { text: l('SABER conformity for parts under applicable technical regulations', 'مطابقة سابر للقطع الخاضعة للوائح الفنية'), url: OFFICIAL.saber },
    { text: l('Vehicle conformity and inspection requirements for vehicle imports', 'متطلبات مطابقة المركبات وفحصها عند استيرادها'), url: OFFICIAL.saso },
  ] },
  machinery: { title: l('Machinery & project cargo', 'المعدات وشحنات المشاريع'), items: [
    { text: l('Conformity documents under the applicable technical regulation', 'مستندات المطابقة وفق اللائحة الفنية المطبقة'), url: OFFICIAL.saber },
    { text: l('Technical descriptions to support classification', 'أوصاف فنية تدعم التصنيف') },
    { text: l('Dimensions, weights and lifting points; road permits for oversized loads', 'الأبعاد والأوزان ونقاط الرفع، وتصاريح الطرق للحمولات الاستثنائية') },
  ] },
  chemicals: { title: l('Chemicals & dangerous goods', 'الكيماويات والبضائع الخطرة'), items: [
    { text: l('Safety data sheet (SDS)', 'صحيفة بيانات السلامة') },
    { text: l('Dangerous-goods classification and UN number; compliant packaging and labels', 'تصنيف البضائع الخطرة ورقم الأمم المتحدة، وتعبئة وملصقات مطابقة') },
    { text: l('Import permit from the competent authority where the substance is controlled', 'تصريح استيراد من الجهة المختصة إذا كانت المادة خاضعة للرقابة') },
    { text: l('Carrier acceptance for the classification', 'قبول الناقل للتصنيف') },
  ] },
  aviation: { title: l('Aviation cargo (GACA)', 'شحنات الطيران (الهيئة العامة للطيران المدني)'), items: [
    { text: l('Technical records such as airworthiness release certificates, where applicable', 'السجلات الفنية مثل شهادات صلاحية الإطلاق عند الانطباق'), url: OFFICIAL.gaca },
    { text: l('Any aviation-sector approval required for the goods and end use', 'أي موافقة لقطاع الطيران تتطلبها البضائع واستخدامها النهائي') },
    { text: l('Dangerous-goods checks for batteries, fluids or pressurised items', 'فحص البضائع الخطرة للبطاريات والسوائل والمواد المضغوطة') },
  ] },
  exhibition: { title: l('Exhibition materials & samples', 'مواد المعارض والعينات'), items: [
    { text: l('Event details: name, venue and dates', 'تفاصيل الفعالية: الاسم والموقع والمواعيد') },
    { text: l('Itemised list with serial numbers, quantities and values', 'قائمة مفصلة بالأرقام التسلسلية والكميات والقيم') },
    { text: l('Plan for items sold or given away (permanent import)', 'خطة للمواد المبيعة أو الموزعة (استيراد نهائي)') },
  ] },
  agri: { title: l('Plants, animals & agriculture (MEWA)', 'النباتات والحيوانات والزراعة (وزارة البيئة والمياه والزراعة)'), items: [
    { text: l('Phytosanitary or veterinary health certificate from the origin country', 'شهادة صحة نباتية أو بيطرية من بلد المنشأ'), url: OFFICIAL.mewa },
    { text: l('Import permit where required for the product', 'تصريح استيراد عند الحاجة للمنتج') },
  ] },
};

/** Build an indicative checklist. Always includes core documents and next steps. */
export function buildChecklist(input: CheckInput): CheckGroup[] {
  const groups: CheckGroup[] = [];
  const core: CheckItem[] = [
    { text: l('Commercial invoice', 'الفاتورة التجارية') },
    { text: l('Packing list', 'قائمة التعبئة') },
    { text: transportDoc[input.mode] },
  ];
  if (input.direction === 'import') {
    core.push(
      { text: l('Certificate of origin (not needed where the origin is clearly established)', 'شهادة المنشأ (لا تلزم إذا كان المنشأ واضحاً)'), url: OFFICIAL.zatcaImport },
      { text: l('Importer commercial registration and importer number', 'السجل التجاري للمستورد ورقم المستورد') },
      { text: l('Customs declaration on Fasah, ideally lodged at least 48 hours before arrival', 'البيان الجمركي عبر فسح، ويُفضَّل تقديمه قبل الوصول بـ48 ساعة على الأقل'), url: OFFICIAL.fasah },
    );
  }
  if (input.direction === 'export') {
    core.push(
      { text: l('Export declaration on Fasah', 'بيان التصدير عبر فسح'), url: OFFICIAL.fasah },
      { text: l('Certificate of origin if the destination requires it', 'شهادة المنشأ إذا طلبتها دولة الوجهة') },
      { text: l('Export permits for restricted goods', 'تصاريح التصدير للبضائع المقيدة') },
    );
  }
  if (input.direction === 'reexport') {
    core.push(
      { text: l('Reference to the original import declaration', 'مرجع بيان الاستيراد الأصلي') },
      { text: l('Re-export declaration on Fasah', 'بيان إعادة التصدير عبر فسح'), url: OFFICIAL.fasah },
    );
  }
  groups.push({ title: l('Core shipping documents', 'مستندات الشحن الأساسية'), items: core });

  if (input.direction === 'temporary') {
    groups.push({ title: l('Temporary admission', 'الإدخال المؤقت'), items: [
      input.carnet === 'yes'
        ? { text: l('ATA Carnet issued in the exporting country, checked against the goods', 'دفتر ATA Carnet صادر في بلد التصدير ومطابق للبضائع'), url: OFFICIAL.zatcaAta }
        : { text: l('Obtain an ATA Carnet from the issuing chamber in the exporting country, or plan an alternative temporary-admission procedure', 'استخراج دفتر ATA Carnet من الغرفة المصدرة في بلد التصدير، أو تخطيط إجراء إدخال مؤقت بديل'), url: OFFICIAL.icc },
      { text: l('ZATCA ATA Carnet pre-approval request: importer details, passport copy, carnet copy, goods and arrival information', 'طلب الموافقة المسبقة لدى الهيئة: بيانات المستورد وصورة الجواز وصورة الدفتر وبيانات البضائع والوصول'), url: OFFICIAL.zatcaAta },
      { text: l('Re-export plan within the permitted period', 'خطة إعادة التصدير خلال المدة المسموح بها') },
    ] });
  }

  const cats = input.categories.length ? input.categories : (['general'] as Category[]);
  for (const c of cats) groups.push(byCategory[c]);

  const next: CheckItem[] = [];
  if (!input.hsKnown) next.push({ text: l('Classification needed: send a description, photos and specifications so the HS code can be confirmed', 'يلزم التصنيف: أرسل وصفاً وصوراً ومواصفات لتأكيد الرمز الجمركي') });
  next.push({ text: l('Arrange product certificates before dispatch so the declaration can reference them', 'رتّب شهادات المنتج قبل الشحن ليُشار إليها في البيان') });
  next.push({ text: l('Confirm requirements against current official regulations for this shipment', 'أكّد المتطلبات من الأنظمة الرسمية الحالية لهذه الشحنة') });
  groups.push({ title: l('Next steps', 'الخطوات التالية'), items: next });
  return groups;
}
