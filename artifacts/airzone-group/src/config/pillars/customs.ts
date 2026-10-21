import { l, type Field, type Item, type Link, type PillarPage } from './types';

/**
 * Customs clearance pillar: flagship page, documentation & compliance
 * directory, and ATA Carnet / exhibition cargo.
 *
 * Accuracy: Airzone coordinates documentation and procedures. Declarations are
 * lodged on ZATCA's Fasah platform by the importer or a licensed customs broker;
 * where a licensed broker is required, Airzone works with one. Certificates,
 * registrations and permits are issued only by the competent authorities.
 * No licence, fixed timing, fee or guaranteed outcome is claimed. Official
 * facts below were checked against zatca.gov.sa, saber.sa and saso.gov.sa
 * (October 2026).
 */
export const UPDATED = '2026-10-12';

export const OFFICIAL = {
  zatcaImport: 'https://zatca.gov.sa/en/RulesRegulations/Taxes/Pages/customs-bussiness/import-pages/Import-Instructions.aspx',
  zatcaBroker: 'https://zatca.gov.sa/en/eServices/Pages/eServices-235.aspx',
  zatcaLicence: 'https://www.zatca.gov.sa/en/eservices/pages/eservices_264.aspx',
  zatcaAta: 'https://zatca.gov.sa/en/eServices/Pages/eservices-294.aspx',
  fasah: 'https://fasah.zatca.gov.sa/',
  saber: 'https://saber.sa/',
  saso: 'https://www.saso.gov.sa/en/',
  iecee: 'https://www.saso.gov.sa/en/sectors/certificates/iec/Pages/default.aspx',
  sfda: 'https://www.sfda.gov.sa/en/regulations',
  sfdaDevices: 'https://sfda.gov.sa/en/regulations/requirements-importation-and-shipments-clearance-medical-devices-mds-req5',
  gaca: 'https://gaca.gov.sa/',
  mewa: 'https://www.mewa.gov.sa/en/',
  mim: 'https://mim.gov.sa/en/',
  cst: 'https://www.cst.gov.sa/en/',
  mot: 'https://mot.gov.sa/',
  icc: 'https://iccwbo.org/business-solutions/ata-carnet/',
};

const QUOTE = '#customs-quote';
export const customsCtas = {
  quote: { href: QUOTE, label: l('Request customs clearance', 'اطلب خدمة التخليص الجمركي'), primary: true } as Link,
  docs: { href: '/logistics/customs-documentation#doc-checker', label: l('Check shipment documentation', 'تحقق من مستندات شحنتك') } as Link,
  ata: { href: '/logistics/ata-carnet', label: l('Request ATA Carnet assistance', 'اطلب المساعدة في دفتر ATA Carnet') } as Link,
  team: { href: '/contact', label: l('Speak to our customs team', 'تحدث إلى فريق الجمارك') } as Link,
};

const filingNotice = {
  title: l('How customs filings are made', 'كيف تُقدَّم البيانات الجمركية'),
  text: l(
    'Airzone Logistics prepares and coordinates the documentation and procedures for your shipment. Customs declarations are submitted on ZATCA’s Fasah platform by the importer or by a licensed customs broker; where a licensed broker is required, Airzone works with one for you. Product certificates, registrations and permits are issued only by the competent authorities, such as SABER/SASO, SFDA or GACA. Airzone does not issue government approvals and cannot guarantee clearance outcomes or timings.',
    'تتولى إيرزون للخدمات اللوجستية تجهيز المستندات وتنسيق الإجراءات الخاصة بشحنتك. تُقدَّم البيانات الجمركية عبر منصة فسح التابعة لهيئة الزكاة والضريبة والجمارك من قِبل المستورد أو مخلص جمركي مرخّص، وعندما يلزم مخلص مرخّص تتعاون إيرزون معه نيابة عنك. تصدر شهادات المنتجات وتسجيلاتها والتصاريح عن الجهات المختصة وحدها، مثل سابر/الهيئة السعودية للمواصفات والهيئة العامة للغذاء والدواء والهيئة العامة للطيران المدني. لا تصدر إيرزون موافقات حكومية ولا تضمن نتائج التخليص أو مدده.',
  ),
};

const f = (en: string, ar: string, ten: string, tar: string): Field => ({ label: l(en, ar), text: l(ten, tar) });
const LBL = {
  covers: ['What it covers', 'ما يشمله'],
  docs: ['Documents that may be required', 'المستندات التي قد تُطلب'],
  auth: ['Authorities that may be involved', 'الجهات التي قد تكون معنية'],
  proc: ['Customs procedure', 'الإجراء الجمركي'],
  move: ['Transport & handling', 'النقل والمناولة'],
  store: ['Warehousing', 'التخزين'],
} as const;
const card = (k: keyof typeof LBL, en: string, ar: string) => f(LBL[k][0], LBL[k][1], en, ar);

/** Specialised cargo directory (ids match the customs form's cargo options). */
export const cargoCategories: Item[] = [
  {
    id: 'general', title: l('General commercial shipments', 'الشحنات التجارية العامة'),
    fields: [
      card('covers', 'Commercial goods, wholesale and retail inventory, palletised cargo and industrial supplies imported or exported by businesses.', 'البضائع التجارية ومخزون الجملة والتجزئة والبضائع على منصات والمستلزمات الصناعية التي تستوردها الشركات أو تصدّرها.'),
      card('docs', 'Commercial invoice, packing list, bill of lading, air waybill or road consignment note, certificate of origin where required, and SABER certificates if the product falls under a technical regulation.', 'الفاتورة التجارية وقائمة التعبئة وبوليصة الشحن البحري أو الجوي أو مستند الشحن البري، وشهادة المنشأ عند الحاجة، وشهادات سابر إذا كان المنتج خاضعاً للائحة فنية.'),
      card('auth', 'ZATCA; SASO through SABER for regulated products.', 'هيئة الزكاة والضريبة والجمارك؛ والهيئة السعودية للمواصفات عبر سابر للمنتجات الخاضعة للوائح.'),
      card('proc', 'Standard import or export declaration on Fasah, assessment of duties and VAT, and release.', 'بيان استيراد أو تصدير اعتيادي عبر فسح، وتقدير الرسوم وضريبة القيمة المضافة، ثم الفسح.'),
      card('move', 'Curtain-side, box and flatbed trailers for full loads; Dayana trucks and vans for onward city delivery.', 'مقطورات جانبية الستائر وصندوقية ومسطحة للشحنات الكاملة، وشاحنات Dayana وعربات الفان للتوزيع داخل المدن.'),
      card('store', 'Ambient and palletised storage, with dispatch on request.', 'تخزين عادي وعلى منصات مع تنسيق الإرسال عند الطلب.'),
    ],
  },
  {
    id: 'food', title: l('Food & beverage shipments', 'شحنات الأغذية والمشروبات'),
    fields: [
      card('covers', 'Packaged, dry, chilled and frozen foods, beverages and food ingredients.', 'الأغذية المعبأة والجافة والمبردة والمجمدة والمشروبات ومكونات الأغذية.'),
      card('docs', 'SFDA importer and product registration where required, health certificate from the country of origin, halal and slaughter certificates for meat and poultry, certificate of origin, compliant Arabic labelling, invoice and packing list.', 'تسجيل المستورد والمنتج لدى الهيئة العامة للغذاء والدواء عند الحاجة، والشهادة الصحية من بلد المنشأ، وشهادات الحلال والذبح للحوم والدواجن، وشهادة المنشأ، وبطاقة بيانات عربية مطابقة، والفاتورة وقائمة التعبئة.'),
      card('auth', 'SFDA (inspection, sampling and release); MEWA for some agricultural products; ZATCA.', 'الهيئة العامة للغذاء والدواء (الفحص وسحب العينات والفسح)، ووزارة البيئة والمياه والزراعة لبعض المنتجات الزراعية، وهيئة الزكاة والضريبة والجمارك.'),
      card('proc', 'Customs declaration plus SFDA clearance; shipments may be held for inspection or laboratory testing before release.', 'بيان جمركي إضافة إلى فسح الهيئة العامة للغذاء والدواء، وقد تُحتجز الشحنات للفحص أو التحليل المخبري قبل الفسح.'),
      card('move', 'Temperature-controlled transport is arranged on request and confirmed per shipment.', 'يُرتَّب النقل المتحكم بحرارته عند الطلب ويُؤكَّد لكل شحنة.'),
      card('store', 'Temperature-controlled warehousing in Riyadh, Dammam, Jeddah and Jubail; conditions confirmed per product.', 'تخزين متحكم بحرارته في الرياض والدمام وجدة والجبيل، مع تأكيد الظروف لكل منتج.'),
    ],
  },
  {
    id: 'pharma', title: l('Pharmaceutical & healthcare shipments', 'شحنات الأدوية والرعاية الصحية'),
    fields: [
      card('covers', 'Medicines, medical devices, medical equipment and supplies, and temperature-sensitive healthcare products.', 'الأدوية والأجهزة والمعدات والمستلزمات الطبية ومنتجات الرعاية الصحية الحساسة للحرارة.'),
      card('docs', 'An SFDA-licensed importer, product registration or marketing authorisation, import permits where required, invoice, packing list and storage-condition documentation.', 'مستورد مرخّص من الهيئة العامة للغذاء والدواء، وتسجيل المنتج أو إذن تسويقه، وتصاريح الاستيراد عند الحاجة، والفاتورة وقائمة التعبئة ومستندات ظروف التخزين.'),
      card('auth', 'SFDA; ZATCA.', 'الهيئة العامة للغذاء والدواء؛ وهيئة الزكاة والضريبة والجمارك.'),
      card('proc', 'Imports are made by eligible, licensed importers; Airzone coordinates documentation and logistics with them.', 'يتم الاستيراد عبر مستوردين مؤهلين ومرخّصين، وتنسّق إيرزون المستندات والخدمات اللوجستية معهم.'),
      card('move', 'Only where suitable equipment and handling can be confirmed for the product.', 'فقط عند إمكانية تأكيد المعدات والمناولة المناسبة للمنتج.'),
      card('store', 'Subject to the product’s requirements and the facility’s suitability; confirmed before acceptance.', 'وفق متطلبات المنتج وملاءمة المرفق، ويُؤكَّد ذلك قبل القبول.'),
    ],
  },
  {
    id: 'exhibition', title: l('Exhibition, event & temporary-import cargo', 'شحنات المعارض والفعاليات والإدخال المؤقت'),
    fields: [
      card('covers', 'ATA Carnet shipments, trade-show stands, display products, demonstration units, samples and professional equipment.', 'شحنات دفاتر ATA Carnet وأجنحة المعارض ومنتجات العرض ووحدات التجربة والعينات والمعدات المهنية.'),
      card('docs', 'ATA Carnet from the issuing body in the exporting country, or a temporary-admission declaration; goods list with serial numbers, quantities and values; event details.', 'دفتر ATA Carnet من الجهة المصدرة في بلد التصدير أو بيان إدخال مؤقت، وقائمة البضائع بالأرقام التسلسلية والكميات والقيم، وتفاصيل الفعالية.'),
      card('auth', 'ZATCA (ATA Carnet pre-approval service); other authorities if the goods are regulated.', 'هيئة الزكاة والضريبة والجمارك (خدمة الموافقة المسبقة لدفاتر ATA Carnet)، وجهات أخرى إذا كانت البضائع خاضعة للتنظيم.'),
      card('proc', 'Temporary admission and re-export within the permitted period; goods must match the carnet.', 'إدخال مؤقت ثم إعادة تصدير خلال المدة المسموح بها، مع مطابقة البضائع للدفتر.'),
      card('move', 'Delivery to the venue, collection after the event and return transport.', 'التوصيل إلى موقع الفعالية والاستلام بعدها والنقل للعودة.'),
      card('store', 'Short-term storage between arrival, the event and re-export where available.', 'تخزين قصير المدة بين الوصول والفعالية وإعادة التصدير عند التوفر.'),
    ],
  },
  {
    id: 'electrical', title: l('Electrical & electronic shipments', 'الشحنات الكهربائية والإلكترونية'),
    fields: [
      card('covers', 'Electrical equipment, consumer electronics, components, control and power equipment, and telecommunications devices.', 'المعدات الكهربائية والإلكترونيات الاستهلاكية والمكونات ومعدات التحكم والطاقة وأجهزة الاتصالات.'),
      card('docs', 'SABER product certificate of conformity and shipment certificate under the applicable technical regulation; for listed products, a Saudi IECEE national recognition certificate based on a CB test report and certificate; equipment approval for radio and telecom devices.', 'شهادة مطابقة المنتج وشهادة الإرسالية عبر سابر وفق اللائحة الفنية المطبقة، وللمنتجات المدرجة شهادة الاعتراف الوطني IECEE المبنية على تقرير وشهادة اختبار CB، واعتماد الأجهزة اللاسلكية والاتصالات.'),
      card('auth', 'SASO/SABER; Saudi national certification bodies; the Communications, Space and Technology Commission for telecom equipment.', 'الهيئة السعودية للمواصفات/سابر، وجهات التصديق الوطنية، وهيئة الاتصالات والفضاء والتقنية لأجهزة الاتصالات.'),
      card('proc', 'Conformity certificates are arranged before dispatch so the declaration can reference them.', 'تُرتَّب شهادات المطابقة قبل الشحن ليُشار إليها في البيان الجمركي.'),
      card('move', 'Enclosed box or curtain-side trailers to protect packaged goods.', 'مقطورات صندوقية أو جانبية الستائر لحماية البضائع المعبأة.'),
      card('store', 'Ambient, secure palletised storage.', 'تخزين عادي وآمن على منصات.'),
    ],
  },
  {
    id: 'machinery', title: l('Industrial machinery & project cargo', 'المعدات الصناعية وشحنات المشاريع'),
    fields: [
      card('covers', 'Heavy machinery, production-line components, construction equipment and oversized project shipments.', 'المعدات الثقيلة ومكونات خطوط الإنتاج ومعدات البناء وشحنات المشاريع كبيرة الحجم.'),
      card('docs', 'Invoice and packing list with technical descriptions, conformity documents under the applicable regulation, dimensions and weights, and lifting or permit information for oversized loads.', 'الفاتورة وقائمة التعبئة مع الأوصاف الفنية، ومستندات المطابقة وفق اللائحة المطبقة، والأبعاد والأوزان، ومعلومات الرفع أو التصاريح للحمولات كبيرة الحجم.'),
      card('auth', 'ZATCA; SASO/SABER where applicable; road authorities for abnormal-load permits.', 'هيئة الزكاة والضريبة والجمارك، والهيئة السعودية للمواصفات/سابر عند الانطباق، وجهات الطرق لتصاريح الحمولات الاستثنائية.'),
      card('proc', 'Import declaration with classification of complex equipment; staged shipments planned together.', 'بيان استيراد مع تصنيف المعدات المعقدة، وتخطيط الشحنات المجزأة معاً.'),
      card('move', 'Flatbed, low-loader and specialised transport where equipment and permits are available.', 'مقطورات مسطحة ومنخفضة ونقل متخصص عند توفر المعدات والتصاريح.'),
      card('store', 'Yard or warehouse storage where the facility can accommodate the cargo.', 'تخزين في الساحات أو المستودعات عندما يستوعب المرفق الشحنة.'),
    ],
  },
  {
    id: 'automotive', title: l('Automotive & vehicle-related shipments', 'شحنات السيارات وقطع الغيار'),
    fields: [
      card('covers', 'Spare parts, commercial and industrial vehicle components, vehicle-related equipment and eligible vehicles.', 'قطع الغيار ومكونات المركبات التجارية والصناعية والمعدات المرتبطة بالمركبات والمركبات المؤهلة.'),
      card('docs', 'Invoice, packing list and SABER conformity for parts under applicable technical regulations; vehicles have their own conformity and inspection requirements.', 'الفاتورة وقائمة التعبئة ومطابقة سابر للقطع الخاضعة للوائح الفنية، وللمركبات متطلبات مطابقة وفحص خاصة.'),
      card('auth', 'ZATCA; SASO/SABER and approved inspection bodies.', 'هيئة الزكاة والضريبة والجمارك؛ والهيئة السعودية للمواصفات/سابر وجهات الفحص المعتمدة.'),
      card('proc', 'Import declaration referencing the applicable conformity certificates.', 'بيان استيراد يُشار فيه إلى شهادات المطابقة المطبقة.'),
      card('move', 'Box, curtain-side or flatbed transport depending on the parts.', 'نقل صندوقي أو جانبي الستائر أو مسطح بحسب القطع.'),
      card('store', 'Palletised and racked storage for parts inventory.', 'تخزين على منصات ورفوف لمخزون القطع.'),
    ],
  },
  {
    id: 'chemicals', title: l('Chemicals & potentially hazardous cargo', 'الكيماويات والبضائع التي قد تكون خطرة'),
    fields: [
      card('covers', 'Eligible chemicals and goods classed as dangerous, assessed shipment by shipment.', 'الكيماويات المؤهلة والبضائع المصنفة خطرة، وتُقيَّم كل شحنة على حدة.'),
      card('docs', 'Safety data sheet, dangerous-goods classification and UN number, compliant packaging and labels, and permits from the competent authority where required.', 'صحيفة بيانات السلامة وتصنيف البضائع الخطرة ورقم الأمم المتحدة، والتعبئة والملصقات المطابقة، وتصاريح الجهة المختصة عند الحاجة.'),
      card('auth', 'ZATCA and the competent authority for the substance.', 'هيئة الزكاة والضريبة والجمارك والجهة المختصة بالمادة.'),
      card('proc', 'Assessed before acceptance; restricted or prohibited goods cannot be cleared through this service.', 'تُقيَّم قبل القبول، ولا يمكن تخليص البضائع المقيدة أو المحظورة من خلال هذه الخدمة.'),
      card('move', 'Only with carriers and equipment that accept the classification.', 'فقط مع ناقلين ومعدات تقبل التصنيف.'),
      card('store', 'Only where a suitable, permitted facility is confirmed.', 'فقط عند تأكيد مرفق مناسب ومصرّح.'),
    ],
  },
  {
    id: 'personal', title: l('Personal effects & special consignments', 'المتعلقات الشخصية والإرساليات الخاصة'),
    fields: [
      card('covers', 'Eligible personal effects, professional equipment, returned goods and warranty replacements.', 'المتعلقات الشخصية المؤهلة والمعدات المهنية والبضائع المرتجعة والبدائل بموجب الضمان.'),
      card('docs', 'Identity and residency documents for personal effects, original export or repair records for returns, invoices and packing lists.', 'مستندات الهوية والإقامة للمتعلقات الشخصية، وسجلات التصدير أو الإصلاح الأصلية للمرتجعات، والفواتير وقوائم التعبئة.'),
      card('auth', 'ZATCA.', 'هيئة الزكاة والضريبة والجمارك.'),
      card('proc', 'These follow different procedures from standard commercial imports; eligibility is confirmed first.', 'تخضع لإجراءات تختلف عن الاستيراد التجاري الاعتيادي، ويُؤكَّد التأهل أولاً.'),
      card('move', 'Delivery by van or truck to the final address.', 'التوصيل بعربة فان أو شاحنة إلى العنوان النهائي.'),
      card('store', 'Short-term storage on request.', 'تخزين قصير المدة عند الطلب.'),
    ],
  },
].map(i => ({ ...i, links: [{ href: QUOTE, label: l('Request a quote for this cargo', 'اطلب عرض سعر لهذه الشحنة'), preset: { cargo: i.id } }] }));

const customsFaqs = [
  { q: l('What documents are required for customs clearance in Saudi Arabia?', 'ما المستندات المطلوبة للتخليص الجمركي في السعودية؟'),
    a: l('ZATCA lists a commercial invoice, a bill of lading (or air waybill or road document) and a certificate of origin as core import documents, the certificate of origin being unnecessary where the origin is clearly established. Many products also need conformity certificates through SABER, SFDA registrations or other approvals. Our documentation directory and checker show what may apply to your goods.', 'تذكر هيئة الزكاة والضريبة والجمارك الفاتورة التجارية وبوليصة الشحن (أو بوليصة الشحن الجوي أو المستند البري) وشهادة المنشأ مستنداتٍ أساسية للاستيراد، ولا تلزم شهادة المنشأ إذا كان المنشأ واضحاً. وتحتاج منتجات كثيرة أيضاً إلى شهادات مطابقة عبر سابر أو تسجيل لدى الهيئة العامة للغذاء والدواء أو موافقات أخرى، ويوضح دليل المستندات وأداة التحقق ما قد ينطبق على بضائعك.') },
  { q: l('How does import customs clearance work?', 'كيف يتم التخليص الجمركي للواردات؟'),
    a: l('The shipment is assessed, documents are collected and checked, the goods are classified, and any product approvals are arranged. The declaration is then lodged on Fasah, ZATCA advises submitting it at least 48 hours before arrival, after which inspections, duties and taxes are handled and the goods are released.', 'تُقيَّم الشحنة وتُجمع المستندات وتُراجع، وتُصنَّف البضائع وتُرتَّب موافقات المنتج اللازمة، ثم يُقدَّم البيان عبر فسح، وتوصي الهيئة بتقديمه قبل وصول الشحنة بـ48 ساعة على الأقل، ثم تُستكمل الفحوصات والرسوم والضرائب وتُفسح البضائع.') },
  { q: l('What affects customs clearance time?', 'ما الذي يؤثر على مدة التخليص الجمركي؟'),
    a: l('Complete and consistent documents, correct classification, product certificates being ready before arrival, inspections or laboratory tests, payment of duties and the entry point’s workload. Timings are not guaranteed; preparing documents before dispatch is the most effective way to avoid delays.', 'اكتمال المستندات وتطابقها، وصحة التصنيف، وجاهزية شهادات المنتج قبل الوصول، والفحوصات أو التحاليل المخبرية، وسداد الرسوم، وضغط العمل في المنفذ. لا تُضمن المدد، ويُعد تجهيز المستندات قبل الشحن أنجع وسيلة لتفادي التأخير.') },
  { q: l('Can customs clearance be coordinated with road transportation and storage?', 'هل يمكن تنسيق التخليص الجمركي مع النقل البري والتخزين؟'),
    a: l('Yes. Airzone can plan clearance together with collection, road transportation within Saudi Arabia and across the GCC, temperature-controlled warehousing and onward delivery, so the shipment moves under one plan.', 'نعم. يمكن لإيرزون تخطيط التخليص مع الاستلام والنقل البري داخل المملكة وعبر دول الخليج والتخزين المتحكم بحرارته والتوصيل النهائي، لتسير الشحنة ضمن خطة واحدة.') },
  { q: l('Is Airzone a licensed customs broker?', 'هل إيرزون مخلص جمركي مرخّص؟'),
    a: l('Airzone coordinates documentation and procedures. Declarations are lodged by the importer or by a licensed customs broker, and Airzone works with licensed brokers where one is required. Ask the team which arrangement applies to your shipment.', 'تنسّق إيرزون المستندات والإجراءات، وتُقدَّم البيانات من قِبل المستورد أو مخلص جمركي مرخّص، وتتعاون إيرزون مع مخلصين مرخّصين عند الحاجة. اسأل الفريق عن الترتيب المطبق على شحنتك.') },
  { q: l('Does every product need a SABER certificate?', 'هل يحتاج كل منتج إلى شهادة سابر؟'),
    a: l('No. SABER certificates apply to products covered by Saudi technical regulations. Other goods may need different approvals, such as SFDA registration, or none beyond standard customs documents. Classification determines what applies.', 'لا. تنطبق شهادات سابر على المنتجات المشمولة باللوائح الفنية السعودية، وقد تحتاج بضائع أخرى إلى موافقات مختلفة مثل تسجيل الهيئة العامة للغذاء والدواء، أو لا تحتاج إلى أكثر من المستندات الجمركية المعتادة. والتصنيف هو ما يحدد ذلك.') },
  { q: l('Can you help with exports and re-exports?', 'هل تساعدون في التصدير وإعادة التصدير؟'),
    a: l('Yes. Export documentation, export declarations and certificate-of-origin coordination are part of the service, as are re-exports of temporarily admitted goods such as ATA Carnet exhibition cargo.', 'نعم. يشمل ذلك مستندات التصدير وبيانات التصدير وتنسيق شهادة المنشأ، وكذلك إعادة تصدير البضائع المدخلة مؤقتاً مثل شحنات المعارض بدفاتر ATA Carnet.') },
  { q: l('Which entry points can you cover?', 'ما المنافذ التي يمكنكم تغطيتها؟'),
    a: l('Enquiries are welcome for shipments through Saudi seaports, airports, Riyadh Dry Port and land borders with GCC states. Coverage, partners and arrangements for each entry point are confirmed in the quotation.', 'نرحب بالاستفسارات للشحنات عبر الموانئ البحرية والمطارات السعودية وميناء الرياض الجاف والمنافذ البرية مع دول الخليج، وتُؤكَّد التغطية والشركاء والترتيبات لكل منفذ في عرض السعر.') },
  { q: l('How do I request a customs clearance quotation?', 'كيف أطلب عرض سعر للتخليص الجمركي؟'),
    a: l('Use the customs form on this page with the goods, origin, destination, transport mode and documents you have. The team reviews it and replies with the requirements and a written quotation.', 'استخدم نموذج الجمارك في هذه الصفحة مع وصف البضائع والمنشأ والوجهة ووسيلة النقل والمستندات المتوفرة لديك، وسيراجعها الفريق ويرد بالمتطلبات وعرض سعر مكتوب.') },
];

export const customsClearance: PillarPage = {
  path: '/logistics/customs-clearance',
  photo: 'customsCover',
  heroSplit: true,
  parents: [{ href: '/logistics', label: l('Logistics', 'الخدمات اللوجستية') }],
  crumb: l('Customs clearance', 'التخليص الجمركي'),
  eyebrow: l('Airzone Logistics · Customs clearance', 'إيرزون للخدمات اللوجستية · التخليص الجمركي'),
  h1: l('Customs clearance services in Saudi Arabia', 'خدمات التخليص الجمركي في المملكة العربية السعودية'),
  lead: l(
    'From commercial imports and exports to regulated products, food and pharmaceutical shipments, exhibition cargo and temporary imports under ATA Carnet, Airzone Logistics coordinates the documentation and customs procedures your shipment needs, and connects clearance with transportation and warehousing across Saudi Arabia and the GCC.',
    'من الواردات والصادرات التجارية إلى المنتجات الخاضعة للتنظيم وشحنات الأغذية والأدوية وشحنات المعارض والإدخال المؤقت بدفاتر ATA Carnet، تنسّق إيرزون للخدمات اللوجستية المستندات والإجراءات الجمركية التي تحتاجها شحنتك، وتربط التخليص بالنقل والتخزين في المملكة ودول الخليج.',
  ),
  ctas: [customsCtas.quote, customsCtas.docs],
  notice: filingNotice,
  sections: [
    {
      id: 'clearance-services', eyebrow: l('Clearance services', 'خدمات التخليص'),
      title: l('Import, export and temporary admission', 'الاستيراد والتصدير والإدخال المؤقت'),
      text: l('The three customs routes most businesses need, coordinated from document checks to release.', 'المسارات الجمركية الثلاثة التي تحتاجها معظم الشركات، منسقة من مراجعة المستندات حتى الفسح.'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        { id: 'import', title: l('Import customs clearance', 'التخليص الجمركي للواردات'), photo: 'containerYard',
          points: [l('Commercial invoice and packing-list checks', 'مراجعة الفاتورة التجارية وقائمة التعبئة'), l('Certificate of origin coordination where required', 'تنسيق شهادة المنشأ عند الحاجة'), l('Declaration preparation for lodging on Fasah', 'تجهيز البيان لتقديمه عبر فسح'), l('Product approvals and conformity documents', 'موافقات المنتج ومستندات المطابقة'), l('Duty, VAT and fee coordination', 'تنسيق الرسوم وضريبة القيمة المضافة'), l('Release and onward delivery coordination', 'تنسيق الفسح والتوصيل')] },
        { id: 'export', title: l('Export customs clearance', 'التخليص الجمركي للصادرات'), photo: 'cargoFreighter',
          points: [l('Export documentation and declarations', 'مستندات وبيانات التصدير'), l('Invoice and packing documentation', 'الفاتورة ومستندات التعبئة'), l('Certificate of origin coordination', 'تنسيق شهادة المنشأ'), l('Export permits and approvals where required', 'تصاريح وموافقات التصدير عند الحاجة'), l('Handover and dispatch coordination', 'تنسيق التسليم والإرسال'), l('Compliance checks for the destination', 'مراجعة متطلبات بلد الوجهة')] },
        { id: 'temporary', title: l('Temporary admission & re-export', 'الإدخال المؤقت وإعادة التصدير'), photo: 'warehouseFloor',
          points: [l('ATA Carnet and exhibition cargo', 'دفاتر ATA Carnet وشحنات المعارض'), l('Samples and professional equipment', 'العينات والمعدات المهنية'), l('Re-export planning within the permitted period', 'تخطيط إعادة التصدير خلال المدة المسموح بها'), l('Returned goods and warranty replacements', 'البضائع المرتجعة وبدائل الضمان')],
          links: [{ href: '/logistics/ata-carnet', label: l('ATA Carnet & exhibition cargo', 'دفاتر ATA Carnet وشحنات المعارض') }] },
      ] }],
    },
    {
      id: 'process', eyebrow: l('How it works', 'كيف نعمل'), tone: 'dark',
      title: l('The customs clearance process, step by step', 'خطوات التخليص الجمركي'),
      text: l('The exact steps and documents depend on the cargo and current Saudi regulations; this is the typical sequence.', 'تعتمد الخطوات والمستندات الدقيقة على البضاعة والأنظمة السعودية الحالية، وهذا هو التسلسل المعتاد.'),
      blocks: [{ kind: 'steps', items: [
        { id: 's1', title: l('Shipment assessment', 'تقييم الشحنة'), text: l('Goods, origin, destination, mode and timing are reviewed to identify the procedure.', 'تُراجع البضائع والمنشأ والوجهة ووسيلة النقل والتوقيت لتحديد الإجراء.') },
        { id: 's2', title: l('Document collection and review', 'جمع المستندات ومراجعتها'), text: l('Invoices, packing lists and transport documents are checked for consistency.', 'تُراجع الفواتير وقوائم التعبئة ومستندات النقل للتأكد من تطابقها.') },
        { id: 's3', title: l('Classification and requirements', 'التصنيف والمتطلبات'), text: l('The HS classification and any product-specific requirements are identified.', 'يُحدَّد التصنيف الجمركي وأي متطلبات خاصة بالمنتج.') },
        { id: 's4', title: l('Declaration on Fasah', 'البيان عبر فسح'), text: l('The declaration is prepared and lodged through the authorised channel, ideally before arrival.', 'يُجهَّز البيان ويُقدَّم عبر القناة المعتمدة، ويُفضَّل قبل الوصول.') },
        { id: 's5', title: l('Inspections, duties and approvals', 'الفحوصات والرسوم والموافقات'), text: l('Inspections, product approvals, duties and taxes are coordinated as required.', 'تُنسَّق الفحوصات وموافقات المنتج والرسوم والضرائب حسب الحاجة.') },
        { id: 's6', title: l('Release', 'الفسح'), text: l('Release is followed up with the relevant parties once requirements are met.', 'يُتابَع الفسح مع الجهات المعنية بعد استيفاء المتطلبات.') },
        { id: 's7', title: l('Transport and delivery', 'النقل والتوصيل'), text: l('Where contracted, the cargo moves straight to storage or delivery.', 'عند التعاقد، تنتقل البضاعة مباشرة إلى التخزين أو التوصيل.') },
      ] }],
    },
    {
      id: 'documentation', eyebrow: l('Documentation & compliance', 'المستندات والامتثال'),
      title: l('Certificates and regulatory requirements, in one place', 'الشهادات والمتطلبات التنظيمية في مكان واحد'),
      text: l('Many shipments need more than customs documents. We help you understand and coordinate what the competent authorities require.', 'تحتاج شحنات كثيرة إلى أكثر من المستندات الجمركية، ونساعدك على فهم ما تطلبه الجهات المختصة وتنسيقه.'),
      blocks: [{ kind: 'chips', items: [
        { href: '/logistics/customs-documentation#saber', label: l('SABER & product conformity', 'سابر ومطابقة المنتجات') },
        { href: '/logistics/customs-documentation#saso', label: l('SASO & IEC/IECEE documentation', 'مستندات الهيئة السعودية للمواصفات وIEC/IECEE') },
        { href: '/logistics/customs-documentation#sfda', label: l('SFDA-regulated shipments', 'الشحنات الخاضعة للهيئة العامة للغذاء والدواء') },
        { href: '/logistics/customs-documentation#gaca', label: l('GACA & aviation-related cargo', 'الطيران المدني والشحنات المرتبطة بالطيران') },
        { href: '/logistics/customs-documentation#other', label: l('Other competent authorities', 'جهات مختصة أخرى') },
        { href: '/logistics/customs-documentation#documents', label: l('Customs documentation assistance', 'المساعدة في المستندات الجمركية') },
      ] }],
      ctas: [customsCtas.docs],
    },
    {
      id: 'specialised', eyebrow: l('Specialised cargo', 'الشحنات المتخصصة'), tone: 'surface',
      title: l('Specialised cargo & shipment clearance', 'تخليص الشحنات والبضائع المتخصصة'),
      text: l('Requirements change with the product. Open a category to see what usually applies, then request a quote for it.', 'تتغير المتطلبات بحسب المنتج. افتح الفئة لترى ما ينطبق عادةً ثم اطلب عرض سعر لها.'),
      note: l('Categories are listed for guidance. Acceptance of regulated or specialised goods is confirmed after assessment.', 'الفئات مدرجة للإرشاد، ويُؤكَّد قبول البضائع الخاضعة للتنظيم أو المتخصصة بعد التقييم.'),
      blocks: [{ kind: 'accordion', items: cargoCategories }],
    },
    {
      id: 'modes', eyebrow: l('By transport mode', 'حسب وسيلة النقل'),
      title: l('Road, sea and air shipment coordination', 'تنسيق الشحن البري والبحري والجوي'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        { id: 'road', title: l('Road freight & GCC cross-border', 'الشحن البري والعبور الخليجي'), photo: 'boxTrailer',
          text: l('Road consignment documents, cross-border coordination at land borders and alignment of clearance with truck schedules, for flatbed, curtain-side and box trailers.', 'مستندات الشحن البري والتنسيق عند المنافذ البرية ومواءمة التخليص مع جداول الشاحنات، للمقطورات المسطحة وجانبية الستائر والصندوقية.'),
          links: [{ href: '/logistics/gcc-transportation', label: l('GCC transportation', 'النقل البري الخليجي') }] },
        { id: 'sea', title: l('Sea freight', 'الشحن البحري'), photo: 'containerShip',
          text: l('Bills of lading, container and breakbulk documentation, and coordination at Saudi seaports with carriers, terminals and brokers.', 'بوالص الشحن ومستندات الحاويات والبضائع العامة، والتنسيق في الموانئ السعودية مع الناقلين والمحطات والمخلصين.'),
          links: [{ href: '/logistics/sea-freight', label: l('Sea freight coordination', 'تنسيق الشحن البحري') }] },
        { id: 'air', title: l('Air freight', 'الشحن الجوي'), photo: 'cargoFreighter',
          text: l('Air waybills, time-sensitive cargo and coordination with airlines, handlers and brokers at Saudi airports.', 'بوالص الشحن الجوي والشحنات العاجلة والتنسيق مع شركات الطيران ووكلاء المناولة والمخلصين في المطارات السعودية.'),
          links: [{ href: '/logistics/air-freight', label: l('Air freight coordination', 'تنسيق الشحن الجوي') }] },
      ] }],
      note: l('Sea and air clearance are coordinated through Airzone’s partners and licensed brokers; arrangements are confirmed per shipment.', 'يُنسَّق التخليص البحري والجوي عبر شركاء إيرزون ومخلصين مرخّصين، وتُؤكَّد الترتيبات لكل شحنة.'),
    },
    {
      id: 'coverage', eyebrow: l('Coverage', 'التغطية'), tone: 'surface',
      title: l('Customs clearance in Riyadh and across Saudi Arabia', 'التخليص الجمركي في الرياض وجميع أنحاء المملكة'),
      text: l('Riyadh businesses often clear goods through Riyadh Dry Port and King Khalid International Airport, or receive cargo cleared at the coast or a land border and trucked inland. We plan clearance around where your cargo enters and where it needs to go.', 'تستلم شركات الرياض بضائعها غالباً عبر ميناء الرياض الجاف ومطار الملك خالد الدولي، أو تُخلَّص الشحنة في الموانئ الساحلية أو المنافذ البرية ثم تُنقل براً إلى الداخل. نخطط التخليص وفق منفذ دخول الشحنة ووجهتها النهائية.'),
      blocks: [{ kind: 'groups', items: [
        { id: 'sea-air', title: l('Ports, airports and dry port', 'الموانئ والمطارات والميناء الجاف'), points: [l('Riyadh Dry Port and King Khalid International Airport', 'ميناء الرياض الجاف ومطار الملك خالد الدولي'), l('Jeddah Islamic Port and King Abdulaziz International Airport', 'ميناء جدة الإسلامي ومطار الملك عبدالعزيز الدولي'), l('King Abdulaziz Port, Dammam, and King Fahd International Airport', 'ميناء الملك عبدالعزيز بالدمام ومطار الملك فهد الدولي'), l('Jubail Commercial Port for Eastern Province industry', 'ميناء الجبيل التجاري لصناعات المنطقة الشرقية')] },
        { id: 'land', title: l('GCC land borders', 'المنافذ البرية مع دول الخليج'), points: [l('United Arab Emirates — Al Batha', 'الإمارات — منفذ البطحاء'), l('Bahrain — King Fahd Causeway', 'البحرين — جسر الملك فهد'), l('Qatar — Salwa', 'قطر — منفذ سلوى'), l('Kuwait — Al Khafji and Al Raqi', 'الكويت — منفذا الخفجي والرقعي'), l('Oman — Empty Quarter crossing', 'عُمان — منفذ الربع الخالي')] },
      ] }],
      note: l('Entry points are listed to help planning. Service at each point is confirmed in the quotation; Airzone does not claim an office at these locations.', 'المنافذ مدرجة للمساعدة في التخطيط، وتُؤكَّد الخدمة في كل منفذ في عرض السعر، ولا تدّعي إيرزون وجود مكتب في هذه المواقع.'),
    },
    {
      id: 'customs-quote', eyebrow: l('Request customs clearance', 'اطلب خدمة التخليص الجمركي'),
      title: l('Tell us about your shipment', 'أخبرنا عن شحنتك'),
      text: l('Share what you know; the team will confirm the requirements and send a written quotation. Documents can be sent after you receive a reference number.', 'شاركنا ما تعرفه، وسيؤكد الفريق المتطلبات ويرسل عرض سعر مكتوباً. يمكن إرسال المستندات بعد استلام رقم المرجع.'),
      blocks: [{ kind: 'widget', widget: 'customsForm' }],
    },
  ],
  faqs: customsFaqs,
  related: [
    { href: '/logistics/customs-documentation', label: l('Customs documentation & compliance', 'المستندات الجمركية والامتثال') },
    { href: '/logistics/ata-carnet', label: l('ATA Carnet & exhibition cargo', 'دفاتر ATA Carnet وشحنات المعارض') },
    { href: '/logistics/import-export', label: l('Import & export support', 'دعم الاستيراد والتصدير') },
    { href: '/logistics/transportation', label: l('Transportation & fleet', 'النقل والأسطول') },
    { href: '/logistics/warehousing', label: l('Warehousing', 'التخزين') },
    { href: '/logistics/industries', label: l('Industries we serve', 'القطاعات التي نخدمها') },
  ],
  sources: [
    { url: OFFICIAL.zatcaImport, label: l('ZATCA: import instructions', 'هيئة الزكاة والضريبة والجمارك: تعليمات الاستيراد') },
    { url: OFFICIAL.fasah, label: l('Fasah platform', 'منصة فسح') },
    { url: OFFICIAL.zatcaBroker, label: l('ZATCA: customs broker authorisation', 'هيئة الزكاة والضريبة والجمارك: تفويض المخلص الجمركي') },
    { url: OFFICIAL.zatcaLicence, label: l('ZATCA: customs clearance licensing', 'هيئة الزكاة والضريبة والجمارك: ترخيص التخليص الجمركي') },
  ],
  seo: {
    title: l('Customs Clearance Services in Saudi Arabia | Airzone', 'خدمات التخليص الجمركي في السعودية | إيرزون'),
    description: l('Import and export customs clearance coordination in Saudi Arabia: shipment documents, SABER and SFDA compliance support and ZATCA procedures. Request a quote.', 'تنسيق التخليص الجمركي للاستيراد والتصدير في المملكة: مستندات الشحنة، ودعم الامتثال لسابر والغذاء والدواء، وإجراءات هيئة الزكاة والضريبة والجمارك.'),
  },
  service: l('Customs clearance support', 'دعم التخليص الجمركي'),
  area: { type: 'Country', names: ['Saudi Arabia'] },
  updated: UPDATED,
};

const auth = (id: string, en: string, ar: string, textEn: string, textAr: string, points: [string, string][], url: string, srcEn: string, srcAr: string): Item => ({
  id, title: l(en, ar), text: l(textEn, textAr), points: points.map(([a, b]) => l(a, b)), source: { url, label: l(srcEn, srcAr) },
});

export const customsDocumentation: PillarPage = {
  path: '/logistics/customs-documentation',
  photo: 'containerYard',
  parents: [{ href: '/logistics', label: l('Logistics', 'الخدمات اللوجستية') }, { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') }],
  crumb: l('Documentation & compliance', 'المستندات والامتثال'),
  eyebrow: l('Customs documentation', 'المستندات الجمركية'),
  h1: l('Customs documentation, certificates & regulatory compliance', 'المستندات الجمركية والشهادات والامتثال التنظيمي'),
  lead: l(
    'Which documents does your shipment need, and which authority issues them? This guide explains the main Saudi platforms and regulators, what we can coordinate, and offers a checker that builds an indicative list for your goods.',
    'ما المستندات التي تحتاجها شحنتك، وما الجهة التي تصدرها؟ يشرح هذا الدليل أبرز المنصات والجهات التنظيمية في المملكة وما يمكننا تنسيقه، ويقدم أداة تُعد قائمة استرشادية لبضائعك.',
  ),
  ctas: [{ href: '#doc-checker', label: l('Find the documents for your shipment', 'اعرف مستندات شحنتك'), primary: true }, { href: '/logistics/customs-clearance#customs-quote', label: customsCtas.quote.label }],
  notice: {
    title: l('Guidance, not an official determination', 'إرشاد وليس قراراً رسمياً'),
    text: l('Requirements depend on the product, its classification, origin, destination and current regulations. This page is general information. Final requirements are confirmed against official sources for each shipment, and certificates are issued only by the competent authorities.', 'تعتمد المتطلبات على المنتج وتصنيفه ومنشئه ووجهته والأنظمة الحالية. هذه الصفحة معلومات عامة، وتُؤكَّد المتطلبات النهائية من المصادر الرسمية لكل شحنة، ولا تصدر الشهادات إلا عن الجهات المختصة.'),
  },
  sections: [
    {
      id: 'authorities', eyebrow: l('Regulators & platforms', 'الجهات التنظيمية والمنصات'),
      title: l('Who regulates what', 'من ينظم ماذا'),
      text: l('Open each authority to see what it covers and how Airzone can help prepare and coordinate the paperwork.', 'افتح كل جهة لترى ما تشمله وكيف تساعد إيرزون في تجهيز المستندات وتنسيقها.'),
      blocks: [{ kind: 'accordion', items: [
        auth('saber', 'SABER — product registration and conformity', 'سابر — تسجيل المنتجات ومطابقتها',
          'SABER is the electronic platform, supervised by SASO, where product conformity certificates are registered and shipment certificates are issued for products covered by Saudi technical regulations.',
          'سابر منصة إلكترونية تشرف عليها الهيئة السعودية للمواصفات والمقاييس والجودة، تُسجَّل فيها شهادات مطابقة المنتجات وتُصدر شهادات الإرساليات للمنتجات المشمولة باللوائح الفنية السعودية.',
          [['Checking whether a product falls under a technical regulation', 'التحقق من خضوع المنتج للائحة فنية'], ['Product registration and product certificate of conformity', 'تسجيل المنتج وشهادة مطابقة المنتج'], ['Shipment certificate for each consignment', 'شهادة الإرسالية لكل شحنة'], ['Importer self-declaration where the regulation allows', 'إقرار المستورد الذاتي عندما تسمح اللائحة'], ['Technical files, models, HS codes and labels reviewed with conformity bodies', 'مراجعة الملفات الفنية والطرازات والرموز الجمركية والملصقات مع جهات تقويم المطابقة'], ['Arranged before dispatch so customs can reference them', 'تُرتَّب قبل الشحن ليُشار إليها في البيان الجمركي']],
          OFFICIAL.saber, 'saber.sa', 'منصة سابر'),
        auth('saso', 'SASO — Saudi standards and technical regulations', 'الهيئة السعودية للمواصفات والمقاييس والجودة',
          'SASO sets the technical regulations and standards that many imported products must meet. Requirements differ by product: electrical, mechanical, building and consumer products each follow their own regulations.',
          'تضع الهيئة السعودية للمواصفات اللوائح الفنية والمواصفات التي يجب أن تستوفيها منتجات مستوردة كثيرة، وتختلف المتطلبات بحسب المنتج؛ فلكل من المنتجات الكهربائية والميكانيكية ومواد البناء والمنتجات الاستهلاكية لوائحها.',
          [['Identifying the applicable technical regulation and standards', 'تحديد اللائحة الفنية والمواصفات المطبقة'], ['Coordinating testing or conformity assessment', 'تنسيق الاختبار أو تقويم المطابقة'], ['Supporting documents for regulated goods', 'المستندات الداعمة للبضائع الخاضعة للتنظيم'], ['Linking conformity documents with the customs file', 'ربط مستندات المطابقة بالملف الجمركي']],
          OFFICIAL.saso, 'saso.gov.sa', 'موقع الهيئة السعودية للمواصفات'),
        auth('iecee', 'IEC / IECEE — electrical product certificates', 'IEC / IECEE — شهادات المنتجات الكهربائية',
          'For listed electrical and electronic products, such as mobile phones, power banks, televisions, lighting and household appliances, SASO requires an IECEE national recognition certificate, issued by a Saudi national certification body on the basis of a CB test report and CB test certificate. An IEC standard, a CB certificate and the Saudi recognition certificate are different things.',
          'تتطلب الهيئة السعودية للمواصفات لمنتجات كهربائية وإلكترونية مدرجة، مثل الهواتف المحمولة وبنوك الطاقة والتلفزيونات والإنارة والأجهزة المنزلية، شهادة الاعتراف الوطني IECEE التي تصدرها جهة تصديق وطنية بناءً على تقرير اختبار CB وشهادة CB. والمواصفة IEC وشهادة CB وشهادة الاعتراف السعودية أمور مختلفة.',
          [['CB test report and certificate from approved laboratories and bodies', 'تقرير وشهادة اختبار CB من مختبرات وجهات معتمدة'], ['Saudi national recognition certificate for listed products', 'شهادة الاعتراف الوطني للمنتجات المدرجة'], ['Arabic and English manuals, labels and product photos', 'أدلة استخدام عربية وإنجليزية وملصقات وصور المنتج'], ['Plug compliance and energy-efficiency certification where applicable', 'مطابقة القابس وشهادة كفاءة الطاقة عند الانطباق']],
          OFFICIAL.iecee, 'SASO: IEC certificates', 'الهيئة السعودية للمواصفات: شهادات IEC'),
        auth('sfda', 'SFDA — food, medicines, medical devices and cosmetics', 'الهيئة العامة للغذاء والدواء',
          'SFDA regulates food, medicines, medical devices, cosmetics, feed and veterinary products. Importer eligibility, product registration and shipment clearance rules depend on the product type and its classification.',
          'تنظم الهيئة العامة للغذاء والدواء الأغذية والأدوية والأجهزة الطبية ومستحضرات التجميل والأعلاف والمنتجات البيطرية، وتعتمد أهلية المستورد وتسجيل المنتج وقواعد فسح الشحنات على نوع المنتج وتصنيفه.',
          [['Food: importer and product registration, health and halal certificates, labelling, inspection and sampling', 'الأغذية: تسجيل المستورد والمنتج والشهادات الصحية وشهادات الحلال وبطاقات البيانات والفحص وسحب العينات'], ['Medicines: licensed importers, product registration and import permits where required', 'الأدوية: مستوردون مرخّصون وتسجيل المنتج وتصاريح الاستيراد عند الحاجة'], ['Medical devices: marketing authorisation, establishment requirements and shipment clearance rules', 'الأجهزة الطبية: إذن التسويق ومتطلبات المنشأة وقواعد فسح الشحنات'], ['Cosmetics: product notification and labelling requirements', 'مستحضرات التجميل: إشعار المنتج ومتطلبات بطاقة البيانات'], ['Veterinary products and feed, depending on classification', 'المنتجات البيطرية والأعلاف بحسب التصنيف'], ['Storage and transport conditions documented for the shipment', 'توثيق ظروف التخزين والنقل للشحنة']],
          OFFICIAL.sfda, 'SFDA regulations', 'أنظمة الهيئة العامة للغذاء والدواء'),
        auth('gaca', 'GACA — aviation-related cargo', 'الهيئة العامة للطيران المدني',
          'Aircraft parts, maintenance and ground-support equipment and other aviation-sector cargo can involve aviation approvals and technical records, such as airworthiness release certificates, as well as dangerous-goods rules. GACA approval is not a general import certificate, and requirements depend on the goods and their end use.',
          'قد تتطلب قطع الطائرات ومعدات الصيانة والدعم الأرضي وغيرها من شحنات قطاع الطيران موافقات وسجلات فنية للطيران، مثل شهادات صلاحية الإطلاق، إضافة إلى قواعد البضائع الخطرة. وموافقة الهيئة ليست شهادة استيراد عامة، وتعتمد المتطلبات على البضائع واستخدامها النهائي.',
          [['Aircraft parts and components with technical records', 'قطع ومكونات الطائرات مع سجلاتها الفنية'], ['Maintenance tools and ground-support equipment', 'أدوات الصيانة ومعدات الدعم الأرضي'], ['Dangerous-goods restrictions for aviation items', 'قيود البضائع الخطرة على مواد الطيران'], ['Coordination with the operator or maintenance organisation', 'التنسيق مع المشغل أو منظمة الصيانة']],
          OFFICIAL.gaca, 'gaca.gov.sa', 'موقع الهيئة العامة للطيران المدني'),
        auth('zatca', 'ZATCA & FASAH — customs procedures and declarations', 'هيئة الزكاة والضريبة والجمارك ومنصة فسح',
          'ZATCA (Zakat, Tax and Customs Authority) administers Saudi customs procedures, duties and the release of goods. Import and export declarations are submitted electronically on its FASAH platform by the importer or a licensed customs broker. Airzone prepares and checks the shipment documents and coordinates with the importer or broker; inspection and release decisions are made by ZATCA.',
          'تتولى هيئة الزكاة والضريبة والجمارك الإجراءات الجمركية والرسوم وفسح البضائع في المملكة، وتُقدَّم بيانات الاستيراد والتصدير إلكترونياً عبر منصة فسح من المستورد أو مخلّص جمركي مرخّص. تجهز إيرزون مستندات الشحنة وتراجعها وتنسق مع المستورد أو المخلّص، بينما تعود قرارات المعاينة والفسح إلى الهيئة.',
          [['Import and export declarations on FASAH', 'بيانات الاستيراد والتصدير عبر منصة فسح'], ['HS classification, duties and VAT', 'التصنيف الجمركي والرسوم وضريبة القيمة المضافة'], ['Inspection and release decisions', 'قرارات المعاينة والفسح'], ['Advance cargo information for sea imports', 'البيانات المسبقة للشحنات البحرية الواردة']],
          OFFICIAL.zatcaImport, 'zatca.gov.sa', 'موقع هيئة الزكاة والضريبة والجمارك'),
        { id: 'other', title: l('Other competent authorities', 'جهات مختصة أخرى'),
          text: l('Depending on the goods, other authorities may be involved. They are listed so you know who may set requirements, not because every shipment needs them.', 'قد تكون جهات أخرى معنية بحسب البضائع، وهي مدرجة لتعرف من قد يضع المتطلبات، وليس لأن كل شحنة تحتاجها.'),
          points: [l('Ministry of Environment, Water and Agriculture — plants, animals and agricultural products', 'وزارة البيئة والمياه والزراعة — النباتات والحيوانات والمنتجات الزراعية'), l('Ministry of Industry and Mineral Resources — certain industrial goods and inputs', 'وزارة الصناعة والثروة المعدنية — بعض السلع والمدخلات الصناعية'), l('Communications, Space and Technology Commission — radio and telecom equipment', 'هيئة الاتصالات والفضاء والتقنية — أجهزة الاتصالات واللاسلكي'), l('Ministry of Transport and Logistic Services — road transport rules and permits', 'وزارة النقل والخدمات اللوجستية — أنظمة النقل البري وتصاريحه')],
          source: { url: OFFICIAL.mewa, label: l('MEWA', 'وزارة البيئة والمياه والزراعة') } },
      ] }],
    },
    {
      id: 'documents', eyebrow: l('Document directory', 'دليل المستندات'), tone: 'surface',
      title: l('Customs documentation assistance', 'المساعدة في المستندات الجمركية'),
      text: l('An indicative directory: no shipment needs every document listed. We help you work out which apply and coordinate them with the relevant parties.', 'دليل استرشادي، فلا تحتاج أي شحنة إلى كل المستندات المدرجة. نساعدك على تحديد ما ينطبق وتنسيقه مع الجهات المعنية.'),
      blocks: [{ kind: 'groups', items: [
        { id: 'core', title: l('Core shipping documents', 'مستندات الشحن الأساسية'), points: [l('Commercial invoice', 'الفاتورة التجارية'), l('Packing list', 'قائمة التعبئة'), l('Bill of lading, air waybill or road consignment note', 'بوليصة الشحن البحري أو الجوي أو مستند الشحن البري'), l('Certificate of origin, where required', 'شهادة المنشأ عند الحاجة'), l('Importer and exporter details', 'بيانات المستورد والمصدّر'), l('Product descriptions and HS classification', 'أوصاف المنتجات والتصنيف الجمركي'), l('Insurance documents, where applicable', 'مستندات التأمين عند الانطباق')] },
        { id: 'compliance', title: l('Product compliance documents', 'مستندات امتثال المنتج'), points: [l('SABER product and shipment certificates', 'شهادات المنتج والإرسالية عبر سابر'), l('SASO conformity documents', 'مستندات المطابقة لدى الهيئة السعودية للمواصفات'), l('IECEE recognition and CB documents', 'مستندات الاعتراف IECEE وشهادات CB'), l('SFDA registrations and shipment documents', 'تسجيلات ومستندات الشحنات لدى الهيئة العامة للغذاء والدواء'), l('Aviation records for GACA-related cargo', 'السجلات الفنية لشحنات الطيران'), l('Other approvals depending on the product', 'موافقات أخرى بحسب المنتج')] },
        { id: 'special', title: l('Special shipment documents', 'مستندات الشحنات الخاصة'), points: [l('ATA Carnet and temporary-admission documents', 'دفتر ATA Carnet ومستندات الإدخال المؤقت'), l('Exhibition and event documentation', 'مستندات المعارض والفعاليات'), l('Sample and demonstration-equipment records', 'سجلات العينات ومعدات العرض'), l('Health, halal and other food certificates', 'الشهادات الصحية وشهادات الحلال وغيرها للأغذية'), l('Dangerous-goods declarations', 'إقرارات البضائع الخطرة'), l('Re-export supporting documents', 'المستندات الداعمة لإعادة التصدير')] },
        { id: 'business', title: l('Business and authorisation documents', 'مستندات المنشأة والتفويض'), points: [l('Importer commercial registration and importer number', 'السجل التجاري للمستورد ورقم المستورد'), l('Importer or exporter authorisations', 'تفويضات المستورد أو المصدّر'), l('Customs broker authorisation where applicable', 'تفويض المخلص الجمركي عند الانطباق'), l('Regulatory registrations and permits for the goods', 'التسجيلات والتصاريح التنظيمية للبضائع'), l('Anything else the competent authority requests', 'أي مستندات أخرى تطلبها الجهة المختصة')] },
      ] }],
    },
    {
      id: 'doc-checker', eyebrow: l('Document checker', 'أداة التحقق من المستندات'),
      title: l('Find the documents required for your shipment', 'اعرف المستندات المطلوبة لشحنتك'),
      text: l('Answer a few questions to get an indicative checklist. It runs in your browser, sends nothing, and is not an official government service.', 'أجب عن بعض الأسئلة لتحصل على قائمة استرشادية. تعمل الأداة في متصفحك ولا ترسل أي بيانات، وليست خدمة حكومية رسمية.'),
      blocks: [{ kind: 'widget', widget: 'docChecker' }],
    },
  ],
  faqs: [
    { q: l('Can Airzone issue a SABER, SASO or SFDA certificate?', 'هل تستطيع إيرزون إصدار شهادة سابر أو من الهيئة السعودية للمواصفات أو الهيئة العامة للغذاء والدواء؟'), a: l('No. Certificates, registrations and permits are issued by the competent authorities or by bodies they approve. Airzone helps you understand the requirements, prepare the files and coordinate the applications and the customs steps around them.', 'لا. تصدر الشهادات والتسجيلات والتصاريح عن الجهات المختصة أو عن جهات معتمدة لديها، وتساعدك إيرزون على فهم المتطلبات وتجهيز الملفات وتنسيق الطلبات والخطوات الجمركية المرتبطة بها.') },
    { q: l('When should conformity certificates be arranged?', 'متى ينبغي ترتيب شهادات المطابقة؟'), a: l('Before the goods are shipped. SABER shipment certificates and similar approvals should be ready so the customs declaration can reference them; arranging them after arrival risks delays and storage charges.', 'قبل شحن البضائع. ينبغي أن تكون شهادات الإرساليات عبر سابر والموافقات المماثلة جاهزة ليُشار إليها في البيان الجمركي، فترتيبها بعد الوصول قد يسبب تأخيراً ورسوم تخزين.') },
    { q: l('What if I do not know the HS code?', 'ماذا لو لم أكن أعرف الرمز الجمركي؟'), a: l('Send a clear description, photos and technical specifications. Classification is reviewed as part of the assessment, because it determines duties and which product requirements apply.', 'أرسل وصفاً واضحاً وصوراً ومواصفات فنية، ويُراجع التصنيف ضمن التقييم لأنه يحدد الرسوم ومتطلبات المنتج المطبقة.') },
  ],
  related: [
    { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') },
    { href: '/logistics/ata-carnet', label: l('ATA Carnet & exhibition cargo', 'دفاتر ATA Carnet وشحنات المعارض') },
    { href: '/logistics/import-export', label: l('Import & export support', 'دعم الاستيراد والتصدير') },
    { href: '/logistics/industries', label: l('Industries we serve', 'القطاعات التي نخدمها') },
  ],
  sources: [
    { url: OFFICIAL.zatcaImport, label: l('ZATCA: import instructions', 'هيئة الزكاة والضريبة والجمارك: تعليمات الاستيراد') },
    { url: OFFICIAL.saber, label: l('SABER', 'سابر') },
    { url: OFFICIAL.iecee, label: l('SASO: IEC certificates', 'الهيئة السعودية للمواصفات: شهادات IEC') },
    { url: OFFICIAL.sfda, label: l('SFDA regulations', 'أنظمة الهيئة العامة للغذاء والدواء') },
    { url: OFFICIAL.sfdaDevices, label: l('SFDA: medical device shipment clearance (MDS-REQ5)', 'الهيئة العامة للغذاء والدواء: فسح شحنات الأجهزة الطبية') },
    { url: OFFICIAL.gaca, label: l('GACA', 'الهيئة العامة للطيران المدني') },
  ],
  seo: {
    title: l('Customs Documentation, SABER & SFDA Compliance | Airzone', 'المستندات الجمركية والامتثال لسابر والغذاء والدواء | إيرزون'),
    description: l('Guide to Saudi customs documents and product compliance: SABER, SASO and IECEE, SFDA, GACA and other authorities, with an indicative document checker.', 'دليل المستندات الجمركية وامتثال المنتجات في المملكة: سابر والمواصفات السعودية وIECEE والغذاء والدواء والطيران المدني، مع أداة استرشادية للمستندات.'),
  },
  service: l('Customs documentation assistance', 'المساعدة في المستندات الجمركية'),
  area: { type: 'Country', names: ['Saudi Arabia'] },
  updated: UPDATED,
};

export const ataCarnet: PillarPage = {
  path: '/logistics/ata-carnet',
  photo: 'warehouseFloor',
  parents: [{ href: '/logistics', label: l('Logistics', 'الخدمات اللوجستية') }, { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') }],
  crumb: l('ATA Carnet & exhibition cargo', 'دفاتر ATA Carnet وشحنات المعارض'),
  eyebrow: l('Temporary admission', 'الإدخال المؤقت'),
  h1: l('Exhibition cargo & ATA Carnet customs clearance in Saudi Arabia', 'التخليص الجمركي لشحنات المعارض ودفاتر ATA Carnet في السعودية'),
  lead: l(
    'Bringing stands, display products, samples or professional equipment into Saudi Arabia for an event and taking them home afterwards? Airzone helps plan the temporary admission, the documents and the transport, from arrival to re-export.',
    'هل تُدخل أجنحة عرض أو منتجات أو عينات أو معدات مهنية إلى المملكة لفعالية ثم تعيدها بعدها؟ تساعدك إيرزون في تخطيط الإدخال المؤقت والمستندات والنقل، من الوصول حتى إعادة التصدير.',
  ),
  ctas: [{ href: '#customs-quote', label: l('Request exhibition & ATA Carnet assistance', 'اطلب المساعدة في شحنات المعارض ودفاتر ATA Carnet'), primary: true }, customsCtas.team],
  notice: {
    title: l('Eligibility is confirmed first', 'يُؤكَّد التأهل أولاً'),
    text: l('An ATA Carnet is not a permanent-import declaration and does not guarantee admission or duty relief. Eligibility depends on the goods, their intended use and current Saudi procedures; some goods or uses are excluded or need a different procedure.', 'دفتر ATA Carnet ليس بيان استيراد نهائياً ولا يضمن الإدخال أو الإعفاء من الرسوم، ويعتمد التأهل على البضائع والغرض من استخدامها والإجراءات السعودية الحالية، وقد تُستثنى بعض البضائع أو الاستخدامات أو تحتاج إلى إجراء مختلف.'),
  },
  sections: [
    {
      id: 'what', eyebrow: l('Temporary vs permanent', 'المؤقت مقابل النهائي'),
      title: l('What temporary admission means', 'ماذا يعني الإدخال المؤقت'),
      blocks: [{ kind: 'cards', columns: 2, items: [
        { id: 'temp', title: l('Temporary admission', 'الإدخال المؤقت'), text: l('Goods enter for a specific purpose, such as an exhibition, and must leave again within the permitted period in the same condition. An ATA Carnet, issued by the chamber in the exporting country, is an international document that can cover this.', 'تدخل البضائع لغرض محدد مثل معرض، ويجب أن تغادر خلال المدة المسموح بها وبحالتها نفسها. ودفتر ATA Carnet مستند دولي تصدره الغرفة في بلد التصدير ويمكن أن يغطي ذلك.') },
        { id: 'perm', title: l('Permanent importation', 'الاستيراد النهائي'), text: l('Goods that stay in Saudi Arabia, including products sold or given away at an event, are imported permanently through a standard customs declaration, with duties, taxes and product requirements applying.', 'البضائع التي تبقى في المملكة، بما فيها المنتجات المبيعة أو الموزعة في الفعالية، تُستورد نهائياً ببيان جمركي اعتيادي وتنطبق عليها الرسوم والضرائب ومتطلبات المنتج.') },
      ] }],
    },
    {
      id: 'goods', eyebrow: l('Eligible cargo', 'البضائع المؤهلة'), tone: 'surface',
      title: l('Cargo we can help bring in temporarily', 'البضائع التي نساعد في إدخالها مؤقتاً'),
      blocks: [{ kind: 'groups', items: [
        { id: 'event', title: l('Exhibitions and events', 'المعارض والفعاليات'), points: [l('Trade-show equipment', 'معدات المعارض التجارية'), l('Display stands and structures', 'أجنحة وهياكل العرض'), l('Display products', 'منتجات العرض'), l('Event and conference materials', 'مواد الفعاليات والمؤتمرات')] },
        { id: 'pro', title: l('Professional use', 'الاستخدام المهني'), points: [l('Demonstration equipment', 'معدات العرض والتجربة'), l('Professional equipment and tools', 'المعدات والأدوات المهنية'), l('Temporary-use machinery', 'المعدات للاستخدام المؤقت'), l('Eligible commercial samples', 'العينات التجارية المؤهلة')] },
      ] }],
    },
    {
      id: 'steps', eyebrow: l('How we help', 'كيف نساعد'), tone: 'dark',
      title: l('ATA Carnet assistance, from review to re-export', 'المساعدة في دفاتر ATA Carnet من المراجعة حتى إعادة التصدير'),
      text: l('ZATCA has accepted ATA Carnets at land, sea and air customs ports since 2 June 2024. Through its ATA Carnet temporary-admission service, the importer submits a pre-approval request with the carnet, the goods information and the arrival details. Importers organising an event can also notify ZATCA in advance through its event disclosure service.', 'تقبل هيئة الزكاة والضريبة والجمارك دفاتر ATA Carnet في المنافذ البرية والبحرية والجوية منذ 2 يونيو 2024. ومن خلال خدمة الإدخال المؤقت بدفاتر ATA Carnet يقدم المستورد طلب موافقة مسبقة مع الدفتر وبيانات البضائع وتفاصيل الوصول. ويمكن للمستوردين المنظمين لفعالية إشعار الهيئة مسبقاً عبر خدمة الإفصاح عن الفعاليات.'),
      blocks: [{ kind: 'steps', items: [
        { id: 'a1', title: l('Eligibility review', 'مراجعة التأهل'), text: l('We review the goods and their intended use against the temporary-admission route.', 'نراجع البضائع والغرض من استخدامها وفق مسار الإدخال المؤقت.') },
        { id: 'a2', title: l('Carnet review', 'مراجعة الدفتر'), text: l('Descriptions, serial numbers, quantities and values are checked against the goods.', 'تُطابَق الأوصاف والأرقام التسلسلية والكميات والقيم مع البضائع.') },
        { id: 'a3', title: l('Pre-arrival procedures', 'إجراءات ما قبل الوصول'), text: l('The pre-approval request and arrival information are coordinated with the importer.', 'يُنسَّق طلب الموافقة المسبقة وبيانات الوصول مع المستورد.') },
        { id: 'a4', title: l('Entry and delivery', 'الدخول والتوصيل'), text: l('Customs entry is coordinated and the cargo is delivered to the venue.', 'يُنسَّق الدخول الجمركي وتُسلَّم البضائع إلى موقع الفعالية.') },
        { id: 'a5', title: l('Collection and storage', 'الاستلام والتخزين'), text: l('After the event, goods are collected and stored short-term where available.', 'بعد الفعالية تُستلم البضائع وتُخزَّن لمدة قصيرة عند التوفر.') },
        { id: 'a6', title: l('Exit and re-export', 'الخروج وإعادة التصدير'), text: l('Exit procedures and return transport are planned within the permitted period.', 'تُخطَّط إجراءات الخروج والنقل للعودة خلال المدة المسموح بها.') },
      ] }],
    },
    {
      id: 'customs-quote', eyebrow: l('Exhibition & ATA Carnet request', 'طلب شحنات المعارض ودفاتر ATA Carnet'),
      title: l('Tell us about your event shipment', 'أخبرنا عن شحنة فعاليتك'),
      text: l('Include the event, venue and dates, and whether an ATA Carnet is available. The team will confirm the route and send a written quotation.', 'اذكر الفعالية وموقعها ومواعيدها وهل يتوفر دفتر ATA Carnet، وسيؤكد الفريق المسار ويرسل عرض سعر مكتوباً.'),
      blocks: [{ kind: 'widget', widget: 'ataForm' }],
    },
  ],
  faqs: [
    { q: l('Does Saudi Arabia accept ATA Carnets?', 'هل تقبل المملكة دفاتر ATA Carnet؟'), a: l('Yes. ZATCA announced on 2 June 2024 that it had begun accepting ATA Carnets at its land, sea and air customs ports, with the Council of Saudi Chambers as guarantor. Which goods and uses qualify is confirmed for each shipment.', 'نعم. أعلنت هيئة الزكاة والضريبة والجمارك في 2 يونيو 2024 بدء قبول دفاتر ATA Carnet في منافذها البرية والبحرية والجوية، مع مجلس الغرف السعودية ضامناً. ويُؤكَّد تأهل البضائع والاستخدامات لكل شحنة.') },
    { q: l('What information is needed for the pre-approval request?', 'ما البيانات المطلوبة لطلب الموافقة المسبقة؟'), a: l('ZATCA’s service asks for the importer’s details and passport copy, a copy of the carnet, the goods information in the carnet and the consignment’s arrival information.', 'تطلب خدمة الهيئة بيانات المستورد وصورة جوازه وصورة الدفتر وبيانات البضائع الواردة فيه ومعلومات وصول الإرسالية.') },
    { q: l('Can goods sold at the exhibition stay in Saudi Arabia?', 'هل يمكن أن تبقى البضائع المبيعة في المعرض داخل المملكة؟'), a: l('Goods that will not be re-exported must be imported permanently, with duties, taxes and product requirements applying. Plan this before the event.', 'البضائع التي لن يُعاد تصديرها يجب استيرادها نهائياً مع تطبيق الرسوم والضرائب ومتطلبات المنتج، لذا خطط لذلك قبل الفعالية.') },
    { q: l('Do I still need product approvals?', 'هل ما زلت أحتاج إلى موافقات المنتج؟'), a: l('Possibly. Regulated goods such as food, medicines or certain electrical products can have their own requirements even when admitted temporarily. These are checked in the eligibility review.', 'ربما. قد تكون للبضائع الخاضعة للتنظيم مثل الأغذية والأدوية وبعض المنتجات الكهربائية متطلبات خاصة حتى عند إدخالها مؤقتاً، وتُراجع ضمن تقييم التأهل.') },
  ],
  related: [
    { href: '/logistics/exhibition-event-logistics', label: l('Exhibition, trade show & event logistics', 'لوجستيات المعارض والمعارض التجارية والفعاليات') },
    { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') },
    { href: '/logistics/customs-documentation', label: l('Customs documentation & compliance', 'المستندات الجمركية والامتثال') },
    { href: '/logistics/warehousing', label: l('Warehousing', 'التخزين') },
  ],
  sources: [
    { url: OFFICIAL.zatcaAta, label: l('ZATCA: ATA Carnet temporary admission service', 'هيئة الزكاة والضريبة والجمارك: خدمة الإدخال المؤقت بدفاتر ATA Carnet') },
    { url: 'https://zatca.gov.sa/en/MediaCenter/News/Pages/news-1245.aspx', label: l('ZATCA: ATA Carnet acceptance announcement (2 June 2024)', 'هيئة الزكاة والضريبة والجمارك: إعلان قبول دفاتر ATA Carnet (2 يونيو 2024)') },
    { url: 'https://zatca.gov.sa/en/eServices/Pages/eServices-273.aspx', label: l('ZATCA: event disclosure service', 'هيئة الزكاة والضريبة والجمارك: خدمة الإفصاح عن الفعاليات') },
    { url: OFFICIAL.icc, label: l('ICC: ATA Carnet', 'غرفة التجارة الدولية: دفتر ATA Carnet') },
  ],
  seo: {
    title: l('ATA Carnet & Exhibition Cargo Clearance in KSA | Airzone', 'تخليص شحنات المعارض ودفاتر ATA Carnet في السعودية | إيرزون'),
    description: l('Temporary admission for exhibition stands, samples and equipment in Saudi Arabia: ATA Carnet review, ZATCA pre-approval, venue delivery and re-export.', 'الإدخال المؤقت لأجنحة المعارض والعينات والمعدات المهنية إلى المملكة: مراجعة دفتر ATA Carnet وتنسيق الموافقة المسبقة والتوصيل للموقع وإعادة التصدير.'),
  },
  service: l('ATA Carnet and exhibition cargo assistance', 'المساعدة في دفاتر ATA Carnet وشحنات المعارض'),
  area: { type: 'Country', names: ['Saudi Arabia'] },
  updated: UPDATED,
};
