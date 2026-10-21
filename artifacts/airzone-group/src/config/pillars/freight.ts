import { l, type Item, type Link, type PillarPage } from './types';
import { OFFICIAL, UPDATED } from './customs';

/**
 * Specialist freight services connected to the three pillars: air freight,
 * sea freight and container destuffing / cargo handling.
 *
 * Accuracy: Airzone coordinates air and sea freight through airlines, shipping
 * lines and forwarding partners. It does not operate aircraft or vessels and no
 * carrier contract, port presence, transit time, handling equipment or capacity
 * is claimed. The sea-import advance cargo information requirement was checked
 * against ZATCA's announcement of 2 May 2025 (effective 29 October 2025).
 */
export const FREIGHT_SOURCES = {
  zatcaAci: 'https://www.zatca.gov.sa/en/MediaCenter/News/Pages/mandatory-customs-declaration-2025.aspx',
};

const LOGISTICS = { href: '/logistics', label: l('Logistics', 'الخدمات اللوجستية') };
const CUSTOMS: Link = { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') };
const DOCS: Link = { href: '/logistics/customs-documentation', label: l('Documentation & compliance', 'المستندات والامتثال') };
const STORE: Link = { href: '/logistics/warehousing', label: l('Warehousing', 'التخزين') };
const TRANSPORT: Link = { href: '/logistics/transportation', label: l('Transportation', 'النقل') };
const HEAVY: Link = { href: '/logistics/heavy-transport', label: l('Heavy transport', 'النقل الثقيل') };
const EXHIBITION: Link = { href: '/logistics/exhibition-event-logistics', label: l('Exhibition logistics', 'لوجستيات المعارض') };
const AIR: Link = { href: '/logistics/air-freight', label: l('Air freight', 'الشحن الجوي') };
const SEA: Link = { href: '/logistics/sea-freight', label: l('Sea freight', 'الشحن البحري') };
const DESTUFF: Link = { href: '/logistics/container-destuffing', label: l('Container destuffing', 'تفريغ الحاويات') };
const TEAM: Link = { href: '/contact', label: l('Speak to our logistics team', 'تحدث إلى فريق الخدمات اللوجستية') };

const card = (id: string, en: string, ar: string, ten: string, tar: string, links?: Link[]): Item => ({ id, title: l(en, ar), text: l(ten, tar), links });

/* ------------------------------------------------------------------ */
/* Air freight                                                         */
/* ------------------------------------------------------------------ */

export const airFreight: PillarPage = {
  path: '/logistics/air-freight',
  photo: 'cargoFreighter',
  parents: [LOGISTICS],
  crumb: l('Air freight', 'الشحن الجوي'),
  eyebrow: l('Airzone Logistics · Air freight', 'إيرزون للخدمات اللوجستية · الشحن الجوي'),
  h1: l('Air freight services in Saudi Arabia', 'خدمات الشحن الجوي في المملكة العربية السعودية'),
  lead: l(
    'Import and export air cargo coordinated from end to end: collection at origin, air waybill and shipping documents, customs clearance, collection from the airport and delivery to your warehouse, site or customer.',
    'شحن جوي للاستيراد والتصدير بتنسيق متكامل: الاستلام من المنشأ، وبوليصة الشحن الجوي ومستندات الشحن، والتخليص الجمركي، والاستلام من المطار، والتوصيل إلى مستودعك أو موقعك أو عميلك.',
  ),
  ctas: [{ href: '#air-quote', label: l('Request an air freight quote', 'اطلب عرض سعر للشحن الجوي'), primary: true }, TEAM],
  notice: {
    title: l('Who flies your cargo', 'من ينقل شحنتك جواً'),
    text: l(
      'Airzone coordinates air freight through airlines and forwarding partners; it does not operate aircraft. Flight space, routing and acceptance of special cargo are confirmed by the carrier for each booking. Customs declarations are lodged by the importer or a licensed customs broker, with Airzone preparing and coordinating the documents.',
      'تنسق إيرزون الشحن الجوي عبر شركات الطيران وشركاء الشحن، ولا تشغّل طائرات. تؤكد شركة الطيران المساحة المتاحة على الرحلة ومسارها وقبول الشحنات الخاصة لكل حجز. ويقدم المستورد أو مخلّص جمركي مرخّص البيانات الجمركية، بينما تجهز إيرزون المستندات وتنسقها.',
    ),
  },
  sections: [
    {
      id: 'directions', eyebrow: l('Inbound and outbound', 'الوارد والصادر'),
      title: l('Air cargo into and out of Saudi Arabia', 'الشحن الجوي من المملكة وإليها'),
      text: l('Most air shipments move in one of two directions, and each needs a different set of documents and checks.', 'تتحرك معظم الشحنات الجوية في أحد اتجاهين، ولكل منهما مستندات وإجراءات مختلفة.'),
      blocks: [{ kind: 'cards', columns: 2, items: [
        { id: 'inbound', photo: 'airCargoLoader', title: l('Inbound air freight to Saudi Arabia', 'الشحن الجوي الوارد إلى المملكة'),
          text: l('For goods bought from overseas suppliers and needed quickly in the Kingdom.', 'للبضائع المشتراة من موردين في الخارج والمطلوبة بسرعة داخل المملكة.'),
          points: [l('Collection from your supplier and booking with the airline', 'الاستلام من المورد والحجز لدى شركة الطيران'), l('Air waybill, invoice and packing list checked before departure', 'مراجعة بوليصة الشحن الجوي والفاتورة وقائمة التعبئة قبل المغادرة'), l('Conformity certificates or permits prepared for regulated goods', 'تجهيز شهادات المطابقة أو التصاريح للبضائع الخاضعة للتنظيم'), l('Import clearance, airport collection and delivery', 'تخليص الاستيراد والاستلام من المطار والتوصيل')] },
        { id: 'outbound', photo: 'cargoFreighter', title: l('Outbound air freight from Saudi Arabia', 'الشحن الجوي الصادر من المملكة'),
          text: l('For exports, returns, repairs and samples sent from the Kingdom to international destinations.', 'للصادرات والمرتجعات والقطع المرسلة للإصلاح والعينات المرسلة من المملكة إلى وجهات دولية.'),
          points: [l('Collection from your premises in Saudi Arabia', 'الاستلام من مقرك داخل المملكة'), l('Export documents and air waybill prepared', 'تجهيز مستندات التصدير وبوليصة الشحن الجوي'), l('Export clearance and handover to the airline', 'تخليص التصدير والتسليم لشركة الطيران'), l('Destination clearance and delivery arranged with partners where required', 'ترتيب التخليص والتوصيل في بلد الوجهة مع الشركاء عند الحاجة')] },
      ] }],
    },
    {
      id: 'services', eyebrow: l('Around the flight', 'ما يحيط بالرحلة'), tone: 'surface',
      title: l('Documents, clearance and delivery in one plan', 'المستندات والتخليص والتوصيل ضمن خطة واحدة'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        card('coordination', 'International air cargo coordination', 'تنسيق الشحن الجوي الدولي', 'Routing, direct or consolidated service and timings are planned together, with one point of contact from origin to delivery.', 'نخطط للمسار ونوع الخدمة، مباشرة أو مجمّعة، والمواعيد معاً، مع جهة تواصل واحدة من المنشأ حتى التسليم.'),
        card('import-clearance', 'Air freight import customs clearance', 'التخليص الجمركي لواردات الشحن الجوي', 'Documents are prepared before the flight lands so the declaration can be lodged promptly and release is not held up by missing paperwork.', 'تُجهَّز المستندات قبل هبوط الرحلة حتى يُقدَّم البيان الجمركي دون تأخير ولا يتعطل الفسح بسبب نقص الأوراق.', [CUSTOMS]),
        card('export-clearance', 'Air freight export customs clearance', 'التخليص الجمركي لصادرات الشحن الجوي', 'Export declarations and supporting documents are coordinated so the cargo can be handed to the airline on time.', 'ننسق بيانات التصدير والمستندات الداعمة حتى تُسلَّم الشحنة لشركة الطيران في موعدها.', [CUSTOMS]),
        card('documents', 'Air waybill and shipping documents', 'بوليصة الشحن الجوي ومستندات الشحن', 'Air waybill, commercial invoice, packing list and certificate of origin are checked against each other, because one mismatch can stop a shipment.', 'نطابق بوليصة الشحن الجوي والفاتورة التجارية وقائمة التعبئة وشهادة المنشأ، لأن اختلافاً واحداً قد يوقف الشحنة.'),
        card('conformity', 'Conformity and regulatory documents', 'مستندات المطابقة والمتطلبات التنظيمية', 'SABER certificates, SFDA approvals or other permits are identified early. They are issued by the authorities, not by Airzone.', 'نحدد مبكراً شهادات سابر أو موافقات الهيئة العامة للغذاء والدواء أو غيرها من التصاريح. وتصدرها الجهات المختصة لا إيرزون.', [DOCS]),
        card('airport-delivery', 'Airport collection and onward delivery', 'الاستلام من المطار والتوصيل', 'After release, cargo is collected from the airport cargo terminal and delivered by road to your warehouse, site or customer, or moved into storage.', 'بعد الفسح تُستلم الشحنة من مبنى الشحن في المطار وتُنقل براً إلى مستودعك أو موقعك أو عميلك، أو تُنقل إلى التخزين.', [TRANSPORT, STORE]),
      ] }],
    },
    {
      id: 'cargo', eyebrow: l('Cargo types', 'أنواع الشحنات'),
      title: l('Air cargo we can help you move', 'شحنات جوية نساعدك في نقلها'),
      text: l('Acceptance always rests with the airline. Tell us early about anything urgent, heavy, temperature-sensitive or hazardous.', 'يبقى قبول الشحنة قراراً لشركة الطيران. أخبرنا مبكراً عن أي شحنة عاجلة أو ثقيلة أو حساسة للحرارة أو خطرة.'),
      blocks: [{ kind: 'accordion', items: [
        { id: 'urgent', title: l('Urgent commercial shipments', 'الشحنات التجارية العاجلة'), fields: [
          { label: l('Typical cargo', 'شحنات نموذجية'), text: l('Replacement parts, launch stock, documents of value, items needed to restart work.', 'قطع بديلة، ومخزون إطلاق منتج، وقطع لازمة لاستئناف العمل.') },
          { label: l('Points to know', 'نقاط مهمة'), text: l('Speed depends on flight space, connections and how quickly documents are ready. Timings are estimated in the quotation, not guaranteed.', 'تعتمد السرعة على المساحة المتاحة والرحلات الموصلة وسرعة جاهزية المستندات. تُقدَّر المدد في عرض السعر ولا تُضمن.') }] },
        { id: 'parts', title: l('Spare parts and industrial equipment', 'قطع الغيار والمعدات الصناعية'), fields: [
          { label: l('Typical cargo', 'شحنات نموذجية'), text: l('Machine components, pumps, tools and electronic modules for factories, plants and workshops.', 'مكونات الآلات والمضخات والأدوات والوحدات الإلكترونية للمصانع والمنشآت والورش.') },
          { label: l('Points to know', 'نقاط مهمة'), text: l('Accurate HS classification and conformity documents matter as much as the flight. Heavy pieces are checked against aircraft limits before booking.', 'التصنيف الجمركي الدقيق ومستندات المطابقة لا تقل أهمية عن الرحلة. وتُراجَع القطع الثقيلة مقابل حدود الطائرة قبل الحجز.') }] },
        { id: 'exhibition', title: l('Exhibition equipment and event materials', 'معدات المعارض ومواد الفعاليات'), fields: [
          { label: l('Typical cargo', 'شحنات نموذجية'), text: l('Display products, LED and AV equipment, samples and stand materials with fixed build-up dates.', 'منتجات العرض ومعدات الشاشات والصوتيات والعينات ومواد الأجنحة المرتبطة بمواعيد تجهيز ثابتة.') },
          { label: l('Points to know', 'نقاط مهمة'), text: l('Temporary admission or an ATA Carnet may apply, and return flights should be planned before the event starts.', 'قد ينطبق الإدخال المؤقت أو دفتر ATA Carnet، ويُستحسن التخطيط لرحلة العودة قبل بدء الفعالية.') }],
          links: [EXHIBITION] },
        { id: 'temperature', title: l('Temperature-sensitive cargo', 'الشحنات الحساسة للحرارة'), fields: [
          { label: l('Typical cargo', 'شحنات نموذجية'), text: l('Perishable food, some healthcare products and other goods that must stay within a range.', 'الأغذية سريعة التلف وبعض منتجات الرعاية الصحية وغيرها من البضائع التي يجب أن تبقى ضمن نطاق حراري محدد.') },
          { label: l('Points to know', 'نقاط مهمة'), text: l('Arranged only where suitable airline, airport and onward handling arrangements are available for the required range. Regulated products also need their approvals.', 'تُرتَّب فقط حيث تتوفر ترتيبات مناسبة لدى شركة الطيران والمطار والنقل اللاحق للنطاق المطلوب. وتحتاج المنتجات الخاضعة للتنظيم إلى موافقاتها أيضاً.') }] },
        { id: 'oversized', title: l('Oversized or specialised air cargo', 'الشحنات الجوية كبيرة الحجم أو المتخصصة'), fields: [
          { label: l('Typical cargo', 'شحنات نموذجية'), text: l('Long, tall or heavy pieces such as machinery sections or crated equipment.', 'قطع طويلة أو مرتفعة أو ثقيلة مثل أجزاء الآلات أو المعدات المعبأة في صناديق.') },
          { label: l('Points to know', 'نقاط مهمة'), text: l('Possible only where the carrier accepts it: every piece must fit the aircraft door, floor loading and handling limits on the route.', 'ممكنة فقط حيث تقبلها شركة الطيران: يجب أن تتناسب كل قطعة مع باب الطائرة وحمولة الأرضية وحدود المناولة على المسار.') }] },
        { id: 'dangerous', title: l('Batteries and dangerous goods', 'البطاريات والبضائع الخطرة'), fields: [
          { label: l('Typical cargo', 'شحنات نموذجية'), text: l('Lithium batteries, equipment containing batteries, aerosols, paints, chemicals.', 'بطاريات الليثيوم والمعدات المزودة ببطاريات والبخاخات والدهانات والمواد الكيميائية.') },
          { label: l('Points to know', 'نقاط مهمة'), text: l('Must be declared, classified, packed and labelled under the airline’s dangerous-goods rules. Some items cannot fly at all and need sea or road transport instead.', 'يجب الإقرار بها وتصنيفها وتعبئتها ووضع ملصقاتها وفق قواعد البضائع الخطرة لدى شركة الطيران. وبعضها لا يُنقل جواً إطلاقاً ويحتاج إلى نقل بحري أو بري بدلاً من ذلك.') }] },
      ] }],
    },
    {
      id: 'roles', eyebrow: l('Who does what', 'من يتولى ماذا'), tone: 'surface',
      title: l('Forwarding, carriage, customs and local transport', 'تنسيق الشحن والنقل الجوي والجمارك والنقل المحلي'),
      text: l('An air shipment involves several parties. Knowing who is responsible for each part makes quotations and delays easier to understand.', 'تشارك في الشحنة الجوية عدة أطراف. ومعرفة المسؤول عن كل جزء تجعل عروض الأسعار وأسباب التأخير أوضح.'),
      blocks: [{ kind: 'groups', items: [
        { id: 'forwarding', tag: l('Coordinated by Airzone with partners', 'تنسقه إيرزون مع الشركاء'), title: l('Air freight forwarding', 'تنسيق الشحن الجوي'), points: [l('Booking and routing', 'الحجز واختيار المسار'), l('Consolidation where suitable', 'التجميع عند الملاءمة'), l('Air waybill and document preparation', 'تجهيز بوليصة الشحن والمستندات')] },
        { id: 'carrier', tag: l('Performed by the airline', 'تتولاه شركة الطيران'), title: l('Carrier services', 'خدمات الناقل الجوي'), points: [l('Flight space and schedules', 'المساحة على الرحلات والجداول'), l('Acceptance of special cargo', 'قبول الشحنات الخاصة'), l('Airport-to-airport carriage', 'النقل من مطار إلى مطار')] },
        { id: 'clearance', tag: l('Licensed broker files · ZATCA decides', 'يقدّمه مخلّص مرخّص · والقرار للهيئة'), title: l('Customs clearance', 'التخليص الجمركي'), points: [l('Declarations lodged on Fasah', 'تقديم البيانات عبر فسح'), l('Inspection where selected', 'المعاينة عند الاختيار'), l('Release by customs', 'الفسح من الجمارك')] },
        { id: 'local', tag: l('Airzone road transportation', 'النقل البري لدى إيرزون'), title: l('Local transport', 'النقل المحلي'), points: [l('Collection at origin in Saudi Arabia', 'الاستلام من المنشأ داخل المملكة'), l('Airport collection after release', 'الاستلام من المطار بعد الفسح'), l('Delivery or transfer to storage', 'التوصيل أو النقل إلى التخزين')] },
      ] }],
    },
    {
      id: 'process', eyebrow: l('Shipment process', 'مراحل الشحنة'), tone: 'dark',
      title: l('From origin collection to final delivery', 'من الاستلام في المنشأ حتى التسليم النهائي'),
      blocks: [{ kind: 'steps', items: [
        { id: 'p1', title: l('Cargo details', 'تفاصيل الشحنة'), text: l('Pieces, dimensions, gross weight, commodity and dates.', 'عدد القطع والأبعاد والوزن الإجمالي ونوع البضاعة والمواعيد.') },
        { id: 'p2', title: l('Quotation and booking', 'عرض السعر والحجز'), text: l('Routing, scope and charges confirmed in writing.', 'تأكيد المسار والنطاق والرسوم كتابياً.') },
        { id: 'p3', title: l('Collection and documents', 'الاستلام والمستندات'), text: l('Cargo collected; air waybill and documents prepared.', 'استلام الشحنة وتجهيز بوليصة الشحن والمستندات.') },
        { id: 'p4', title: l('Air transport', 'النقل الجوي'), text: l('Carried by the airline on the booked routing.', 'تنقلها شركة الطيران على المسار المحجوز.') },
        { id: 'p5', title: l('Customs procedures', 'الإجراءات الجمركية'), text: l('Declaration lodged; inspection if selected.', 'تقديم البيان والمعاينة عند الاختيار.') },
        { id: 'p6', title: l('Cargo release', 'فسح الشحنة'), text: l('Duties and charges settled; release issued.', 'سداد الرسوم وصدور الفسح.') },
        { id: 'p7', title: l('Final delivery', 'التسليم النهائي'), text: l('Delivered to your door or moved into storage.', 'التوصيل إلى بابك أو النقل إلى التخزين.') },
      ] }],
    },
    {
      id: 'airports', eyebrow: l('Saudi cargo gateways', 'منافذ الشحن الجوي في المملكة'),
      title: l('Main airports for air cargo in Saudi Arabia', 'أبرز المطارات للشحن الجوي في المملكة'),
      text: l('Listed to help with planning. The arrival airport depends on the airline’s routing and is confirmed for each booking.', 'مدرجة للمساعدة في التخطيط. ويعتمد مطار الوصول على مسار شركة الطيران ويُؤكَّد لكل حجز.'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        card('ruh', 'King Khalid International Airport, Riyadh', 'مطار الملك خالد الدولي، الرياض', 'Serves Riyadh and the central region, close to the capital’s distribution and warehousing hubs.', 'يخدم الرياض والمنطقة الوسطى، بالقرب من مراكز التوزيع والتخزين في العاصمة.', [{ href: '/logistics/warehousing-riyadh', label: l('Warehousing in Riyadh', 'التخزين في الرياض') }]),
        card('jed', 'King Abdulaziz International Airport, Jeddah', 'مطار الملك عبدالعزيز الدولي، جدة', 'Serves Jeddah, Makkah and the western region.', 'يخدم جدة ومكة المكرمة والمنطقة الغربية.', [{ href: '/logistics/warehousing-jeddah', label: l('Warehousing in Jeddah', 'التخزين في جدة') }]),
        card('dmm', 'King Fahd International Airport, Dammam', 'مطار الملك فهد الدولي، الدمام', 'Serves the Eastern Province, including Dammam, Al Khobar and Jubail.', 'يخدم المنطقة الشرقية، ومنها الدمام والخبر والجبيل.', [{ href: '/logistics/warehousing-dammam', label: l('Warehousing in Dammam', 'التخزين في الدمام') }]),
      ] }],
      note: l('Airzone does not claim an office or handling operation at these airports; service is confirmed in your quotation.', 'لا تدّعي إيرزون وجود مكتب أو عمليات مناولة في هذه المطارات، وتُؤكَّد الخدمة في عرض السعر.'),
    },
    {
      id: 'air-quote', eyebrow: l('Air freight quotation', 'عرض سعر الشحن الجوي'),
      title: l('Request an air freight quote', 'اطلب عرض سعر للشحن الجوي'),
      text: l('Share the airports, pieces, dimensions and gross weight. Optional details help the team quote faster.', 'شاركنا المطارات وعدد القطع والأبعاد والوزن الإجمالي. وتساعد التفاصيل الاختيارية الفريق على تقديم العرض أسرع.'),
      blocks: [{ kind: 'widget', widget: 'airForm' }],
    },
  ],
  faqs: [
    { q: l('Does Airzone operate its own aircraft?', 'هل تشغّل إيرزون طائراتها الخاصة؟'), a: l('No. Airzone coordinates air freight through airlines and forwarding partners and handles the documents, customs coordination and road delivery around the flight.', 'لا. تنسق إيرزون الشحن الجوي عبر شركات الطيران وشركاء الشحن، وتتولى المستندات وتنسيق الجمارك والتوصيل البري المرتبط بالرحلة.') },
    { q: l('How is the air freight charge calculated?', 'كيف تُحسب تكلفة الشحن الجوي؟'), a: l('Airlines charge on the greater of the actual gross weight and the volumetric weight worked out from the dimensions; a common conversion is 6,000 cubic centimetres per kilogram, but the carrier sets the factor. Exact dimensions give the most accurate quote.', 'تحتسب شركات الطيران التكلفة على الأكبر بين الوزن الإجمالي الفعلي والوزن الحجمي المحسوب من الأبعاد، والمعامل الشائع 6,000 سنتيمتر مكعب لكل كيلوغرام، لكن الناقل هو من يحدده. لذلك تمنحك الأبعاد الدقيقة أدق عرض سعر.') },
    { q: l('Can you clear air cargo arriving in Riyadh, Jeddah or Dammam?', 'هل يمكنكم تخليص الشحنات الجوية الواصلة إلى الرياض أو جدة أو الدمام؟'), a: l('Airzone coordinates import clearance for air cargo, including document preparation and delivery after release. The declaration is lodged by the importer or a licensed customs broker. The arrival airport depends on the airline’s routing.', 'تنسق إيرزون تخليص واردات الشحن الجوي، بما في ذلك تجهيز المستندات والتوصيل بعد الفسح. ويقدم المستورد أو مخلّص جمركي مرخّص البيان الجمركي. ويعتمد مطار الوصول على مسار شركة الطيران.') },
    { q: l('How long does air freight take?', 'كم يستغرق الشحن الجوي؟'), a: l('It depends on the route, flight space, connections, document readiness and customs procedures. We give an estimate in the quotation but do not promise fixed transit or clearance times.', 'يعتمد ذلك على المسار والمساحة المتاحة والرحلات الموصلة وجاهزية المستندات والإجراءات الجمركية. نقدم تقديراً في عرض السعر دون التزام بمدد نقل أو تخليص ثابتة.') },
    { q: l('Which documents do I need for an air import?', 'ما المستندات المطلوبة لاستيراد شحنة جوية؟'), a: l('Usually the air waybill, commercial invoice, packing list and, where required, a certificate of origin. Regulated goods may also need SABER certificates, SFDA approvals or other permits before release.', 'عادةً بوليصة الشحن الجوي والفاتورة التجارية وقائمة التعبئة، وشهادة المنشأ عند الحاجة. وقد تحتاج البضائع الخاضعة للتنظيم أيضاً إلى شهادات سابر أو موافقات الهيئة العامة للغذاء والدواء أو تصاريح أخرى قبل الفسح.') },
    { q: l('Can you send batteries or dangerous goods by air?', 'هل يمكن شحن البطاريات أو البضائع الخطرة جواً؟'), a: l('Only when the airline accepts them and they are declared, packed and labelled under its dangerous-goods rules. Some items are not permitted by air; we will suggest sea or road transport where that applies.', 'فقط إذا قبلتها شركة الطيران وتم الإقرار بها وتعبئتها ووضع ملصقاتها وفق قواعد البضائع الخطرة لديها. بعض المواد غير مسموح بنقلها جواً، وسنقترح النقل البحري أو البري عندئذٍ.') },
  ],
  related: [CUSTOMS, DOCS, SEA, EXHIBITION, STORE, TRANSPORT],
  sources: [
    { url: OFFICIAL.zatcaImport, label: l('ZATCA: import instructions', 'هيئة الزكاة والضريبة والجمارك: تعليمات الاستيراد') },
    { url: OFFICIAL.saber, label: l('SABER product conformity platform', 'منصة سابر لمطابقة المنتجات') },
    { url: OFFICIAL.sfda, label: l('SFDA regulations', 'أنظمة الهيئة العامة للغذاء والدواء') },
  ],
  seo: {
    title: l('Air Freight & Air Cargo in Saudi Arabia | Airzone', 'الشحن الجوي في السعودية | استيراد وتصدير | إيرزون'),
    description: l('Air freight to and from Saudi Arabia: air waybill and document coordination, import and export customs clearance, and airport collection and delivery.', 'شحن جوي من المملكة وإليها: تنسيق بوليصة الشحن الجوي والمستندات، والتخليص الجمركي للاستيراد والتصدير، والاستلام من المطار والتوصيل.'),
  },
  service: l('Air freight coordination', 'تنسيق الشحن الجوي'),
  area: { type: 'Country', names: ['Saudi Arabia'] },
  updated: UPDATED,
};

/* ------------------------------------------------------------------ */
/* Sea freight                                                         */
/* ------------------------------------------------------------------ */

export const seaFreight: PillarPage = {
  path: '/logistics/sea-freight',
  photo: 'containerShip',
  parents: [LOGISTICS],
  crumb: l('Sea freight', 'الشحن البحري'),
  eyebrow: l('Airzone Logistics · Sea freight', 'إيرزون للخدمات اللوجستية · الشحن البحري'),
  h1: l('Sea freight services in Saudi Arabia: FCL, LCL and project cargo', 'خدمات الشحن البحري في المملكة: حاويات كاملة وشحنات جزئية وشحنات مشاريع'),
  lead: l(
    'Import and export ocean freight coordinated with customs clearance, port collection and road transport: full containers, shared container space, machinery and project cargo, moved between Saudi seaports and your warehouse or site.',
    'شحن بحري للاستيراد والتصدير بالتنسيق مع التخليص الجمركي والاستلام من الميناء والنقل البري: حاويات كاملة، ومساحات مشتركة في الحاويات، ومعدات وشحنات مشاريع، تُنقل بين موانئ المملكة ومستودعك أو موقعك.',
  ),
  ctas: [{ href: '#sea-quote', label: l('Request a sea freight quote', 'اطلب عرض سعر للشحن البحري'), primary: true }, TEAM],
  notice: {
    title: l('Advance cargo information for sea imports, from 29 October 2025', 'البيانات المسبقة للشحنات البحرية الواردة اعتباراً من 29 أكتوبر 2025'),
    text: l(
      'ZATCA made advance submission of the manifest and the customs declaration mandatory for goods arriving through Saudi seaports: both must be submitted before the goods reach the port. Importers and shipping agents are responsible, and any prior approvals the goods need must be completed before clearance. Early, accurate documents help avoid penalties for late submission.',
      'أصبح تقديم بيان الحمولة (المانيفست) والبيان الجمركي مسبقاً إلزامياً لدى هيئة الزكاة والضريبة والجمارك للبضائع الواردة عبر الموانئ البحرية، إذ يجب تقديمهما قبل وصول البضائع إلى الميناء. ويتحمل المستوردون والوكلاء الملاحيون هذه المسؤولية، ويجب استكمال أي موافقات مسبقة تحتاجها البضائع قبل الفسح. وتساعد المستندات الدقيقة والمبكرة على تجنب غرامات التأخر في التقديم.',
    ),
  },
  sections: [
    {
      id: 'directions', eyebrow: l('Inbound and outbound', 'الوارد والصادر'),
      title: l('Ocean freight into and out of the Kingdom', 'الشحن البحري من المملكة وإليها'),
      blocks: [{ kind: 'cards', columns: 2, items: [
        { id: 'inbound', photo: 'jeddahPort', title: l('Inbound sea freight to Saudi Arabia', 'الشحن البحري الوارد إلى المملكة'),
          text: l('Planned from the supplier’s door or port to your warehouse in the Kingdom.', 'نخطط له من باب المورد أو ميناء الشحن حتى مستودعك داخل المملكة.'),
          points: [l('Documentation: invoice, packing list and bill of lading checked before the vessel sails', 'المستندات: مراجعة الفاتورة وقائمة التعبئة وبوليصة الشحن قبل إبحار السفينة'), l('Shipment planning: FCL or LCL, container type, Incoterms and routing', 'تخطيط الشحنة: حاوية كاملة أو شحنة جزئية، ونوع الحاوية وشروط التسليم والمسار'), l('Customs: advance declaration, prior approvals and clearance coordinated', 'الجمارك: تنسيق البيان المسبق والموافقات المسبقة والتخليص'), l('Delivery: port collection, transport to your premises or warehouse, empty return', 'التوصيل: الاستلام من الميناء والنقل إلى مقرك أو المستودع وإعادة الحاوية الفارغة')] },
        { id: 'outbound', photo: 'containerShip', title: l('Outbound sea freight from Saudi Arabia', 'الشحن البحري الصادر من المملكة'),
          text: l('For exporters shipping containers or project cargo from Saudi ports.', 'للمصدرين الذين يشحنون حاويات أو شحنات مشاريع من الموانئ السعودية.'),
          points: [l('Documentation: export invoice, packing list, certificate of origin and bill of lading instructions', 'المستندات: فاتورة التصدير وقائمة التعبئة وشهادة المنشأ وتعليمات بوليصة الشحن'), l('Shipment planning: empty container release, loading date and port cut-offs', 'تخطيط الشحنة: الإفراج عن الحاوية الفارغة وموعد التحميل ومواعيد إغلاق الميناء'), l('Customs: export declaration coordinated', 'الجمارك: تنسيق بيان التصدير'), l('Delivery: container stuffing where available and transport to the port', 'التوصيل: تحميل الحاوية عند التوفر ونقلها إلى الميناء')] },
      ] }],
    },
    {
      id: 'fcl-lcl', eyebrow: l('Choosing a service', 'اختيار الخدمة'), tone: 'surface',
      title: l('FCL or LCL: which suits your shipment?', 'حاوية كاملة أم شحنة جزئية: أيهما يناسب شحنتك؟'),
      text: l('The point at which a full container becomes cheaper than shared space depends on rates at the time, so the team can compare both for your cargo.', 'تعتمد النقطة التي تصبح عندها الحاوية الكاملة أوفر من المساحة المشتركة على الأسعار وقت الشحن، لذلك يمكن للفريق مقارنة الخيارين لشحنتك.'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        { id: 'fcl', title: l('Full container load (FCL)', 'حاوية كاملة (FCL)'), text: l('A container used only for your goods, sealed at origin.', 'حاوية مخصصة لبضائعك وحدها، تُختم في المنشأ.'),
          points: [l('Suits larger volumes that fill much of a container', 'تناسب الكميات الكبيرة التي تملأ معظم الحاوية'), l('Less handling, as goods stay in one container', 'مناولة أقل لأن البضائع تبقى في حاوية واحدة'), l('Container must be returned within the shipping line’s free time', 'يجب إعادة الحاوية خلال المهلة المجانية لدى الخط الملاحي')] },
        { id: 'lcl', title: l('Less than container load (LCL)', 'شحنة أقل من حاوية (LCL)'), text: l('Your goods share a container with other shippers’ cargo; you pay for the space used. Available on selected routes.', 'تتشارك بضائعك الحاوية مع شحنات أخرى وتدفع مقابل المساحة المستخدمة. متاحة على مسارات مختارة.'),
          points: [l('Suits smaller volumes and trial orders', 'تناسب الكميات الصغيرة والطلبات التجريبية'), l('Consolidated at origin and separated at destination', 'تُجمَّع في المنشأ وتُفصل في الوجهة'), l('More handling and often a longer overall transit', 'مناولة أكثر ومدة إجمالية أطول غالباً')] },
        { id: 'project', title: l('Breakbulk and project cargo', 'البضائع السائبة وشحنات المشاريع'), text: l('Cargo too large or heavy for standard containers.', 'شحنات أكبر أو أثقل من أن تتسع لها الحاويات القياسية.'),
          points: [l('Flat-rack or open-top containers, or conventional vessels', 'حاويات مسطحة أو مفتوحة السقف أو سفن تقليدية'), l('Subject to vessel and port handling arrangements', 'تخضع لترتيبات السفينة والمناولة في الميناء'), l('Road permits and specialised trailers planned for the inland leg', 'التخطيط للتصاريح والمقطورات المتخصصة للنقل البري')],
          links: [HEAVY] },
      ] }],
    },
    {
      id: 'cargo', eyebrow: l('Cargo by vessel', 'الشحنات البحرية'),
      title: l('Cargo we coordinate by sea', 'شحنات ننسقها بحراً'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        card('containerised', 'Containerised commercial cargo', 'البضائع التجارية في حاويات', 'Retail stock, building materials, consumer goods and raw materials in standard or high-cube containers.', 'مخزون التجزئة ومواد البناء والسلع الاستهلاكية والمواد الخام في حاويات قياسية أو مرتفعة.'),
        card('general', 'General cargo', 'البضائع العامة', 'Palletised, crated or bagged goods, whether in containers or as non-containerised cargo where the service allows.', 'البضائع على منصات أو في صناديق أو أكياس، داخل حاويات أو خارجها حيث تسمح الخدمة.'),
        card('machinery', 'Industrial equipment and machinery', 'المعدات الصناعية والآلات', 'Production lines, generators and plant equipment, with lifting points and dimensions checked before booking.', 'خطوط الإنتاج والمولدات ومعدات المصانع، مع مراجعة نقاط الرفع والأبعاد قبل الحجز.', [HEAVY]),
        card('heavy', 'Heavy and project cargo', 'الشحنات الثقيلة وشحنات المشاريع', 'Oversized and heavy-lift items, subject to vessel, port and handling arrangements confirmed for the shipment.', 'القطع كبيرة الحجم والثقيلة، بحسب ترتيبات السفينة والميناء والمناولة المؤكدة للشحنة.'),
        card('exhibition', 'Exhibition and trade-show cargo', 'شحنات المعارض والمعارض التجارية', 'Larger stand builds, structures and equipment shipped in advance of the event, with return planning.', 'الأجنحة والهياكل والمعدات الكبيرة المشحونة قبل الفعالية، مع التخطيط لإعادتها.', [EXHIBITION]),
        card('reefer', 'Refrigerated containers', 'الحاويات المبردة', 'Chilled or frozen goods in reefer containers where available, with onward temperature-controlled transport and storage arranged on request.', 'البضائع المبردة أو المجمدة في حاويات مبردة عند التوفر، مع ترتيب النقل والتخزين المتحكم بحرارته عند الطلب.', [STORE]),
      ] }],
    },
    {
      id: 'advance-info', eyebrow: l('Saudi seaport requirement', 'متطلب الموانئ السعودية'), tone: 'surface',
      title: l('What advance cargo information means for your shipment', 'ماذا تعني البيانات المسبقة للشحنة بالنسبة لك'),
      text: l('Since 29 October 2025, the manifest and customs declaration for sea imports must be submitted before the goods arrive. In practice, documents need to be right before the vessel reaches Saudi Arabia, not after.', 'منذ 29 أكتوبر 2025 يجب تقديم بيان الحمولة والبيان الجمركي للواردات البحرية قبل وصول البضائع. وعملياً يعني ذلك أن تكون المستندات صحيحة قبل وصول السفينة إلى المملكة لا بعده.'),
      blocks: [{ kind: 'groups', items: [
        { id: 'aci-who', title: l('Who submits', 'من يقدّم البيانات'), points: [l('The shipping agent submits the manifest', 'يقدّم الوكيل الملاحي بيان الحمولة'), l('The importer, or a licensed broker for the importer, submits the declaration', 'يقدّم المستورد أو مخلّص مرخّص نيابة عنه البيان الجمركي')] },
        { id: 'aci-docs', title: l('What must be accurate', 'ما يجب أن يكون دقيقاً'), points: [l('Bill of lading details', 'بيانات بوليصة الشحن'), l('Commercial invoice values and descriptions', 'قيم الفاتورة التجارية وأوصاف البضائع'), l('Quantities and packing list', 'الكميات وقائمة التعبئة'), l('HS classification', 'التصنيف الجمركي')] },
        { id: 'aci-approvals', title: l('Prior approvals', 'الموافقات المسبقة'), points: [l('Approvals from the relevant authorities completed before clearance', 'استكمال موافقات الجهات المختصة قبل الفسح'), l('Conformity certificates ready for regulated products', 'جاهزية شهادات المطابقة للمنتجات الخاضعة للتنظيم')] },
        { id: 'aci-why', title: l('Why it matters', 'لماذا يهم ذلك'), points: [l('Late submission can lead to penalties', 'قد يؤدي التأخر في التقديم إلى غرامات'), l('Errors found on arrival can delay release and add port charges', 'الأخطاء المكتشفة عند الوصول قد تؤخر الفسح وتضيف رسوماً في الميناء')],
          source: { url: FREIGHT_SOURCES.zatcaAci, label: l('ZATCA announcement, 2 May 2025', 'إعلان هيئة الزكاة والضريبة والجمارك، 2 مايو 2025') } },
      ] }],
      note: l('ZATCA’s detailed rules for advance cargo information at seaports apply; Airzone helps you prepare the information but does not submit the manifest itself.', 'تنطبق القواعد التفصيلية للهيئة بشأن البيانات المسبقة للبضائع في الموانئ البحرية، وتساعدك إيرزون في تجهيز البيانات دون أن تقدّم بيان الحمولة بنفسها.'),
    },
    {
      id: 'after-arrival', eyebrow: l('Port to door', 'من الميناء إلى الباب'),
      title: l('After the vessel arrives', 'بعد وصول السفينة'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        card('port-collection', 'Port collection and delivery coordination', 'تنسيق الاستلام من الميناء والتوصيل', 'Delivery orders, terminal appointments and transport are lined up so the container leaves the port once released.', 'تُرتَّب أذونات التسليم ومواعيد المحطة والنقل حتى تغادر الحاوية الميناء فور فسحها.'),
        card('container-transport', 'Container transport to warehouses or premises', 'نقل الحاويات إلى المستودعات أو المقرات', 'Road transport from the port to your warehouse, factory or site, or to a warehouse arranged by Airzone.', 'نقل بري من الميناء إلى مستودعك أو مصنعك أو موقعك، أو إلى مستودع ترتبه إيرزون.', [TRANSPORT]),
        card('clearance', 'Sea freight customs clearance coordination', 'تنسيق التخليص الجمركي للشحن البحري', 'Import and export declarations, inspection and release coordinated with the importer or a licensed broker.', 'تنسيق بيانات الاستيراد والتصدير والمعاينة والفسح مع المستورد أو مخلّص مرخّص.', [CUSTOMS]),
        card('destuffing', 'Container destuffing', 'تفريغ الحاويات', 'Unloading, counting and palletising at a warehouse after release, then storage or onward delivery.', 'التفريغ والعدّ والتحميل على منصات في مستودع بعد الفسح، ثم التخزين أو التوصيل.', [DESTUFF]),
        card('storage', 'Transfer to warehousing after release', 'النقل إلى التخزين بعد الفسح', 'Goods moved into storage in Riyadh, Dammam, Jeddah or Jubail, subject to space and suitability.', 'نقل البضائع إلى التخزين في الرياض أو الدمام أو جدة أو الجبيل بحسب توفر المساحة وملاءمتها.', [STORE]),
        card('empty-return', 'Empty-container return', 'إعادة الحاويات الفارغة', 'Empty containers returned to the shipping line’s nominated depot where applicable, to help limit detention charges.', 'إعادة الحاويات الفارغة إلى الساحة التي يحددها الخط الملاحي عند الاقتضاء، للمساعدة في الحد من رسوم الاحتجاز.'),
      ] }],
    },
    {
      id: 'process', eyebrow: l('Shipment process', 'مراحل الشحنة'), tone: 'dark',
      title: l('How a sea shipment comes together', 'كيف تكتمل الشحنة البحرية'),
      blocks: [{ kind: 'steps', items: [
        { id: 's1', title: l('Plan', 'التخطيط'), text: l('Cargo, FCL or LCL, Incoterms and dates.', 'البضاعة ونوع الشحن وشروط التسليم والمواعيد.') },
        { id: 's2', title: l('Book', 'الحجز'), text: l('Space booked with a shipping line through partners.', 'حجز المساحة لدى خط ملاحي عبر الشركاء.') },
        { id: 's3', title: l('Prepare documents', 'تجهيز المستندات'), text: l('Invoice, packing list, bill of lading, approvals.', 'الفاتورة وقائمة التعبئة وبوليصة الشحن والموافقات.') },
        { id: 's4', title: l('Submit in advance', 'التقديم المسبق'), text: l('Manifest and declaration lodged before arrival.', 'تقديم بيان الحمولة والبيان الجمركي قبل الوصول.') },
        { id: 's5', title: l('Arrive and clear', 'الوصول والتخليص'), text: l('Inspection if selected; duties settled; release.', 'المعاينة عند الاختيار وسداد الرسوم والفسح.') },
        { id: 's6', title: l('Deliver', 'التوصيل'), text: l('Container delivered, unloaded or stored; empty returned.', 'توصيل الحاوية أو تفريغها أو تخزينها وإعادتها فارغة.') },
      ] }],
    },
    {
      id: 'ports', eyebrow: l('Saudi seaports', 'الموانئ السعودية'),
      title: l('Seaports to plan around', 'موانئ يُخطَّط حولها'),
      text: l('Port choice depends on the shipping line’s service and your final destination. Listed for planning; no office or terminal operation is claimed.', 'يعتمد اختيار الميناء على خدمة الخط الملاحي ووجهتك النهائية. مدرجة للتخطيط دون ادعاء مكتب أو عمليات في المحطات.'),
      blocks: [{ kind: 'cards', columns: 4, items: [
        card('jeddah-port', 'Jeddah Islamic Port', 'ميناء جدة الإسلامي', 'Red Sea gateway for Jeddah, Makkah and the western region.', 'بوابة البحر الأحمر لجدة ومكة المكرمة والمنطقة الغربية.', [{ href: '/logistics/warehousing-jeddah', label: l('Warehousing in Jeddah', 'التخزين في جدة') }]),
        card('dammam-port', 'King Abdulaziz Port, Dammam', 'ميناء الملك عبدالعزيز بالدمام', 'Arabian Gulf gateway for the Eastern Province, with rail links inland to Riyadh.', 'بوابة الخليج العربي للمنطقة الشرقية، مع ربط بالسكك الحديدية إلى الرياض.', [{ href: '/logistics/warehousing-dammam', label: l('Warehousing in Dammam', 'التخزين في الدمام') }]),
        card('jubail-port', 'Jubail ports', 'موانئ الجبيل', 'Serving the Jubail industrial area on the Gulf coast.', 'تخدم منطقة الجبيل الصناعية على ساحل الخليج.', [{ href: '/logistics/warehousing-jubail', label: l('Warehousing in Jubail', 'التخزين في الجبيل') }]),
        card('riyadh-dry-port', 'Riyadh Dry Port', 'ميناء الرياض الجاف', 'Inland port in the capital, connected by rail to Dammam.', 'ميناء بري في العاصمة مرتبط بالسكك الحديدية بالدمام.', [{ href: '/logistics/warehousing-riyadh', label: l('Warehousing in Riyadh', 'التخزين في الرياض') }]),
      ] }],
    },
    {
      id: 'sea-quote', eyebrow: l('Sea freight quotation', 'عرض سعر الشحن البحري'),
      title: l('Request a sea freight quote', 'اطلب عرض سعر للشحن البحري'),
      text: l('Tell us the ports, FCL or LCL, container type and commodity. Add Incoterms if you know them.', 'أخبرنا بالموانئ ونوع الشحن ونوع الحاوية والبضاعة، وأضف شروط التسليم إن كنت تعرفها.'),
      blocks: [{ kind: 'widget', widget: 'seaForm' }],
    },
  ],
  faqs: [
    { q: l('Does Airzone own vessels or have contracts with shipping lines?', 'هل تمتلك إيرزون سفناً أو لديها عقود مع خطوط ملاحية؟'), a: l('No vessels are owned and no direct shipping-line contracts are claimed. Airzone coordinates sea freight through shipping lines and forwarding partners; sailing schedules are set by the carriers and can change.', 'لا نمتلك سفناً ولا ندّعي عقوداً مباشرة مع خطوط ملاحية. تنسق إيرزون الشحن البحري عبر الخطوط الملاحية وشركاء الشحن، وتحدد الخطوط مواعيد الإبحار وقد تتغير.') },
    { q: l('What changed for sea imports on 29 October 2025?', 'ما الذي تغيّر في الواردات البحرية في 29 أكتوبر 2025؟'), a: l('ZATCA made it mandatory to submit the manifest and the customs declaration in advance, before goods arrive at the seaport. Importers and shipping agents are responsible, and prior approvals must be completed before clearance.', 'أصبح تقديم بيان الحمولة والبيان الجمركي مسبقاً، قبل وصول البضائع إلى الميناء، إلزامياً لدى هيئة الزكاة والضريبة والجمارك. ويتحمل المستوردون والوكلاء الملاحيون المسؤولية، ويجب استكمال الموافقات المسبقة قبل الفسح.') },
    { q: l('Should I ship FCL or LCL?', 'هل أشحن بحاوية كاملة أم بشحنة جزئية؟'), a: l('LCL usually suits smaller volumes; FCL suits larger volumes, fragile goods and shipments that should stay sealed. Because the break-even point depends on current rates, the team can price both.', 'تناسب الشحنة الجزئية عادةً الكميات الصغيرة، بينما تناسب الحاوية الكاملة الكميات الكبيرة والبضائع القابلة للكسر والشحنات التي يجب أن تبقى مختومة. ولأن نقطة التعادل تعتمد على الأسعار الحالية، يمكن للفريق تسعير الخيارين.') },
    { q: l('What are demurrage and detention?', 'ما رسوم التأخير في الميناء ورسوم احتجاز الحاوية؟'), a: l('Demurrage is charged when a container stays in the port beyond the free time; detention is charged when it is kept outside the port too long before the empty is returned. Free time is set by the shipping line, so early documents and planned delivery help limit both.', 'تُفرض رسوم التأخير عندما تبقى الحاوية في الميناء بعد انتهاء المهلة المجانية، وتُفرض رسوم الاحتجاز عندما تبقى خارج الميناء مدة طويلة قبل إعادتها فارغة. يحدد الخط الملاحي المهلة المجانية، لذا تساعد المستندات المبكرة والتوصيل المخطط على الحد منهما.') },
    { q: l('Can you deliver the container to our warehouse and return the empty?', 'هل يمكنكم توصيل الحاوية إلى مستودعنا وإعادتها فارغة؟'), a: l('Yes, this can be arranged: transport from the port to your premises or a warehouse arranged by Airzone, unloading if needed, and return of the empty container where applicable.', 'نعم، يمكن ترتيب ذلك: النقل من الميناء إلى مقرك أو إلى مستودع ترتبه إيرزون، والتفريغ عند الحاجة، وإعادة الحاوية الفارغة عند الاقتضاء.') },
    { q: l('Do I need to know the Incoterms?', 'هل أحتاج إلى معرفة شروط التسليم (Incoterms)؟'), a: l('It helps. Incoterms such as FOB, CIF or DAP decide who arranges and pays for each stage. If you are unsure, share your purchase terms and the team will explain what is included.', 'يفيد ذلك. فشروط التسليم مثل FOB أو CIF أو DAP تحدد من يرتب كل مرحلة ومن يدفع تكلفتها. وإن لم تكن متأكداً فشاركنا شروط الشراء وسيوضح الفريق ما تشمله.') },
  ],
  related: [CUSTOMS, DESTUFF, STORE, HEAVY, AIR, EXHIBITION],
  sources: [
    { url: FREIGHT_SOURCES.zatcaAci, label: l('ZATCA: mandatory advance submission of manifests and declarations (sea ports)', 'هيئة الزكاة والضريبة والجمارك: إلزامية التقديم المسبق للبيانات في الموانئ البحرية') },
    { url: OFFICIAL.zatcaImport, label: l('ZATCA: import instructions', 'هيئة الزكاة والضريبة والجمارك: تعليمات الاستيراد') },
    { url: OFFICIAL.fasah, label: l('Fasah customs platform', 'منصة فسح') },
  ],
  seo: {
    title: l('Sea Freight & Container Shipping in Saudi Arabia | Airzone', 'الشحن البحري في السعودية | حاويات كاملة وجزئية | إيرزون'),
    description: l('Sea freight to and from Saudi Arabia: FCL and LCL, machinery and project cargo, advance cargo information, customs coordination, port collection and delivery.', 'شحن بحري من المملكة وإليها: حاويات كاملة وشحنات جزئية، ومعدات وشحنات مشاريع، وبيانات مسبقة، وتنسيق جمركي، واستلام من الميناء وتوصيل.'),
  },
  service: l('Sea freight coordination', 'تنسيق الشحن البحري'),
  area: { type: 'Country', names: ['Saudi Arabia'] },
  updated: UPDATED,
};

/* ------------------------------------------------------------------ */
/* Container destuffing, unloading & cargo handling                    */
/* ------------------------------------------------------------------ */

export const containerDestuffing: PillarPage = {
  path: '/logistics/container-destuffing',
  photo: 'containerYard',
  parents: [LOGISTICS, { href: '/logistics/warehousing', label: l('Warehousing', 'التخزين') }],
  crumb: l('Container destuffing', 'تفريغ الحاويات'),
  eyebrow: l('Airzone Logistics · Cargo handling', 'إيرزون للخدمات اللوجستية · مناولة البضائع'),
  h1: l('Container destuffing, unloading and cargo handling in Saudi Arabia', 'تفريغ الحاويات ومناولة البضائع في المملكة العربية السعودية'),
  lead: l(
    'Destuffing means unloading cargo from a shipping container; stuffing means loading it. Airzone coordinates both, together with receiving, counting, palletising, storage and onward delivery, so imported goods move from the container to the shelf or site in one plan.',
    'تفريغ الحاوية يعني إخراج البضائع من حاوية الشحن، وتحميلها يعني تعبئتها فيها. تنسق إيرزون الخدمتين مع الاستلام والعدّ والتحميل على منصات والتخزين والتوصيل، لتنتقل البضائع المستوردة من الحاوية إلى الرف أو الموقع ضمن خطة واحدة.',
  ),
  ctas: [{ href: '#destuffing-quote', label: l('Request a handling quote', 'اطلب عرض سعر للمناولة'), primary: true }, TEAM],
  notice: {
    title: l('Equipment and labour are confirmed job by job', 'تُؤكَّد المعدات والعمالة لكل مهمة'),
    text: l(
      'Handling equipment, labour, location and timing are confirmed after the team reviews your container list, cargo and packing. Handling capacities are not published, and heavy or unusual items are assessed individually before they are accepted.',
      'تُؤكَّد معدات المناولة والعمالة والموقع والتوقيت بعد مراجعة الفريق لقائمة الحاويات والبضاعة وطريقة تعبئتها. لا ننشر طاقات مناولة، وتُقيَّم القطع الثقيلة أو غير المعتادة كلٌ على حدة قبل قبولها.',
    ),
  },
  sections: [
    {
      id: 'definitions', eyebrow: l('The terms', 'المصطلحات'),
      title: l('Destuffing and stuffing explained', 'شرح تفريغ الحاويات وتحميلها'),
      blocks: [{ kind: 'cards', columns: 2, items: [
        { id: 'destuffing', title: l('Destuffing (unloading)', 'التفريغ (Destuffing)'), text: l('Removing cargo from a shipping container after it arrives, also called unstuffing or devanning. Goods are identified against the shipping documents, then sorted, recorded and moved to storage or dispatch.', 'إخراج البضائع من حاوية الشحن بعد وصولها، ويُسمى أيضاً Unstuffing أو Devanning. تُطابَق البضائع مع مستندات الشحن ثم تُفرز وتُسجَّل وتُنقل إلى التخزين أو الإرسال.'),
          points: [l('Typical for imports after customs release', 'شائع للواردات بعد الفسح الجمركي'), l('Ends with goods received into storage or sent onward', 'ينتهي باستلام البضائع في المستودع أو إرسالها')] },
        { id: 'stuffing', title: l('Stuffing (loading)', 'التحميل (Stuffing)'), text: l('Loading cargo into a container for shipment, also called vanning. Weight is spread and goods are secured so they travel safely, and the container is sealed for the journey.', 'تعبئة البضائع في الحاوية للشحن، وتُسمى أيضاً Vanning. يُوزَّع الوزن وتُثبَّت البضائع لتنتقل بأمان، ثم تُختم الحاوية للرحلة.'),
          points: [l('Typical for exports and re-exports', 'شائع للصادرات وإعادة التصدير'), l('Offered where available, confirmed per job', 'متاح حيث يتوفر ويُؤكَّد لكل مهمة')] },
      ] }],
    },
    {
      id: 'services', eyebrow: l('Handling services', 'خدمات المناولة'), tone: 'surface',
      title: l('From container door to storage or dispatch', 'من باب الحاوية إلى التخزين أو الإرسال'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        card('import-destuffing', 'Import container destuffing', 'تفريغ حاويات الاستيراد', 'Unloading 20ft and 40ft containers after release, with cargo checked against the packing list.', 'تفريغ حاويات 20 و40 قدماً بعد الفسح مع مطابقة البضائع لقائمة التعبئة.'),
        card('general', 'General cargo unloading', 'تفريغ البضائع العامة', 'Mixed cargo, bags, drums and loose items unloaded and separated by type.', 'تفريغ البضائع المختلطة والأكياس والبراميل والقطع السائبة وفصلها حسب النوع.'),
        card('palletised', 'Palletised cargo unloading', 'تفريغ البضائع على منصات', 'Pallets unloaded and checked for visible damage, leaning or broken wrapping.', 'تفريغ المنصات وفحصها من أي ضرر ظاهر أو ميلان أو تمزق في التغليف.'),
        card('cartons', 'Carton and packaged-goods unloading', 'تفريغ الكراتين والبضائع المعبأة', 'Floor-loaded cartons unloaded by hand and stacked by product, batch or order.', 'تفريغ الكراتين المحمّلة على أرضية الحاوية يدوياً ورصّها حسب المنتج أو الدفعة أو الطلب.'),
        card('industrial', 'Industrial equipment unloading', 'تفريغ المعدات الصناعية', 'Machinery and crated equipment, assessed individually for weight, lifting points and access.', 'الآلات والمعدات في الصناديق، وتُقيَّم كل قطعة من حيث الوزن ونقاط الرفع وإمكانية الوصول.', [HEAVY]),
        card('receiving', 'Warehouse receiving after destuffing', 'الاستلام في المستودع بعد التفريغ', 'Goods received into the warehouse record so stock can be stored and released.', 'استلام البضائع وتسجيلها في المستودع ليتسنى تخزينها وصرفها.', [STORE]),
        card('sorting', 'Cargo sorting and segregation', 'فرز البضائع وفصلها', 'Separated by SKU, purchase order, batch, customer or destination.', 'الفصل حسب رمز المنتج أو أمر الشراء أو الدفعة أو العميل أو الوجهة.'),
        card('palletising', 'Palletising and repalletising', 'التحميل على منصات وإعادة التحميل', 'Loose goods built onto pallets and wrapped, or damaged pallets rebuilt, where offered.', 'تحميل البضائع السائبة على منصات وتغليفها، أو إعادة بناء المنصات التالفة، حيث تتوفر الخدمة.'),
        card('counting', 'Counting and receiving records', 'العدّ وسجلات الاستلام', 'Package counts recorded against the documents, with shortages or overages noted.', 'تسجيل عدد الطرود مقابل المستندات مع إثبات أي نقص أو زيادة.'),
        card('inspection', 'Inspection and visible-damage reporting', 'المعاينة والإبلاغ عن الأضرار الظاهرة', 'External condition noted and photographed where included. This is not a quality inspection or insurance survey.', 'إثبات الحالة الخارجية وتصويرها عند تضمينها في النطاق. ولا يُعد ذلك فحص جودة أو معاينة تأمينية.'),
        card('storage', 'Transfer into suitable storage', 'النقل إلى التخزين المناسب', 'Ambient or temperature-controlled storage in Riyadh, Dammam, Jeddah or Jubail, subject to suitability.', 'تخزين في حرارة الجو أو متحكم بحرارته في الرياض أو الدمام أو جدة أو الجبيل بحسب الملاءمة.', [STORE]),
        card('export-stuffing', 'Container loading for outbound cargo', 'تحميل الحاويات للشحنات الصادرة', 'Export and re-export containers loaded and secured, where available.', 'تحميل حاويات التصدير وإعادة التصدير وتثبيت البضائع فيها حيث تتوفر الخدمة.', [SEA]),
        card('dispatch', 'Dispatch and onward transport', 'الإرسال والنقل', 'Unloaded goods delivered to customers, stores or sites by road, including Dayana local delivery.', 'توصيل البضائع بعد تفريغها إلى العملاء أو المتاجر أو المواقع براً، بما في ذلك التوصيل المحلي عبر Dayana.', [TRANSPORT]),
      ] }],
    },
    {
      id: 'workflow', eyebrow: l('Typical workflow', 'سير العمل المعتاد'), tone: 'dark',
      title: l('How a destuffing job runs', 'كيف تسير مهمة التفريغ'),
      blocks: [{ kind: 'steps', items: [
        { id: 'w1', title: l('Confirm the details', 'تأكيد التفاصيل'), text: l('Container type, cargo, packing and unloading requirements.', 'نوع الحاوية والبضاعة وطريقة التعبئة ومتطلبات التفريغ.') },
        { id: 'w2', title: l('Coordinate arrival', 'تنسيق الوصول'), text: l('Container collection from the port and delivery slot.', 'استلام الحاوية من الميناء وموعد التسليم.') },
        { id: 'w3', title: l('Arrange equipment and labour', 'ترتيب المعدات والعمالة'), text: l('Matched to the cargo and confirmed for the job.', 'تُختار بما يناسب البضاعة وتُؤكَّد للمهمة.') },
        { id: 'w4', title: l('Unload and identify', 'التفريغ والتعرّف'), text: l('Cargo unloaded and identified against the documents.', 'تفريغ البضائع ومطابقتها مع المستندات.') },
        { id: 'w5', title: l('Record', 'التسجيل'), text: l('Quantities and visible discrepancies, where included.', 'الكميات وأي فروقات ظاهرة عند تضمينها.') },
        { id: 'w6', title: l('Move to storage or dispatch', 'النقل إلى التخزين أو الإرسال'), text: l('Goods taken to the designated area.', 'نقل البضائع إلى المنطقة المحددة.') },
        { id: 'w7', title: l('Deliver or store', 'التوصيل أو التخزين'), text: l('Onward delivery arranged or goods stored.', 'ترتيب التوصيل أو تخزين البضائع.') },
        { id: 'w8', title: l('Return the empty', 'إعادة الحاوية الفارغة'), text: l('Empty container returned where applicable.', 'إعادة الحاوية الفارغة عند الاقتضاء.') },
      ] }],
    },
    {
      id: 'prepare', eyebrow: l('Before the container arrives', 'قبل وصول الحاوية'),
      title: l('What helps a smooth unload', 'ما الذي يسهّل عملية التفريغ'),
      blocks: [{ kind: 'groups', items: [
        { id: 'send', title: l('Information to send', 'معلومات ترسلها'), points: [l('Container number and type', 'رقم الحاوية ونوعها'), l('Packing list and bill of lading', 'قائمة التعبئة وبوليصة الشحن'), l('Cargo description and weights', 'وصف البضاعة وأوزانها'), l('Expected arrival date', 'موعد الوصول المتوقع')] },
        { id: 'release', title: l('Release and timing', 'الفسح والتوقيت'), points: [l('Customs release and delivery order', 'الفسح الجمركي وإذن التسليم'), l('End of the shipping line’s free time', 'نهاية المهلة المجانية لدى الخط الملاحي'), l('Delivery slot at the unloading site', 'موعد التسليم في موقع التفريغ')] },
        { id: 'cargo', title: l('Cargo specifics', 'خصائص البضاعة'), points: [l('Palletised or floor-loaded', 'على منصات أو على أرضية الحاوية'), l('Heavy, fragile or temperature-sensitive items', 'قطع ثقيلة أو قابلة للكسر أو حساسة للحرارة'), l('Dangerous goods, if any', 'البضائع الخطرة إن وُجدت')] },
        { id: 'after', title: l('After unloading', 'بعد التفريغ'), points: [l('Receiving record and any discrepancies', 'سجل الاستلام وأي فروقات'), l('Storage or delivery instructions', 'تعليمات التخزين أو التوصيل'), l('Empty-container return', 'إعادة الحاوية الفارغة')] },
      ] }],
    },
    {
      id: 'connected', eyebrow: l('Connected services', 'خدمات مترابطة'), tone: 'surface',
      title: l('Part of a complete import plan', 'جزء من خطة استيراد متكاملة'),
      blocks: [{ kind: 'chips', items: [
        SEA, CUSTOMS, STORE, TRANSPORT, HEAVY,
        { href: '/logistics/dayana-local-delivery', label: l('Dayana local delivery', 'Dayana للتوصيل المحلي') },
        { href: '/logistics/warehousing-riyadh', label: l('Warehousing in Riyadh', 'التخزين في الرياض') },
        { href: '/logistics/warehousing-dammam', label: l('Warehousing in Dammam', 'التخزين في الدمام') },
        { href: '/logistics/warehousing-jeddah', label: l('Warehousing in Jeddah', 'التخزين في جدة') },
      ] }],
    },
    {
      id: 'destuffing-quote', eyebrow: l('Handling quotation', 'عرض سعر المناولة'),
      title: l('Request a destuffing or handling quote', 'اطلب عرض سعر للتفريغ أو المناولة'),
      text: l('Include the container type and quantity, how the cargo is packed and where it should go afterwards.', 'اذكر نوع الحاوية وعددها وطريقة تعبئة البضاعة ووجهتها بعد التفريغ.'),
      blocks: [{ kind: 'widget', widget: 'destuffingForm' }],
    },
  ],
  faqs: [
    { q: l('What is the difference between destuffing and stuffing?', 'ما الفرق بين تفريغ الحاوية وتحميلها؟'), a: l('Destuffing is unloading cargo from a container, usually after import. Stuffing is loading cargo into a container, usually for export.', 'التفريغ هو إخراج البضائع من الحاوية، وغالباً بعد الاستيراد. والتحميل هو تعبئة البضائع في الحاوية، وغالباً للتصدير.') },
    { q: l('Can you unload floor-loaded cartons?', 'هل يمكنكم تفريغ الكراتين المحمّلة على أرضية الحاوية؟'), a: l('Yes, this can be arranged. Floor-loaded cartons are unloaded by hand and take longer than palletised cargo, which is reflected in the quotation. Palletising can be added afterwards where offered.', 'نعم، يمكن ترتيب ذلك. تُفرَّغ الكراتين المحمّلة على الأرضية يدوياً وتستغرق وقتاً أطول من البضائع على منصات، وينعكس ذلك في عرض السعر. ويمكن إضافة التحميل على منصات بعدها حيث تتوفر الخدمة.') },
    { q: l('Do you report damaged or missing cargo?', 'هل تبلّغون عن البضائع التالفة أو الناقصة؟'), a: l('Where included in the scope, visible external damage and differences against the packing list are recorded, with photos. It is not a quality inspection; for insurance claims an independent surveyor may be needed.', 'عند تضمين ذلك في النطاق، تُسجَّل الأضرار الخارجية الظاهرة والفروقات مقارنة بقائمة التعبئة مع الصور. ولا يُعد ذلك فحص جودة، وقد تحتاج مطالبات التأمين إلى معاين مستقل.') },
    { q: l('Where does unloading take place?', 'أين يتم التفريغ؟'), a: l('At a warehouse arranged by Airzone in Riyadh, Dammam, Jeddah or Jubail, or at your own premises where suitable. The location is confirmed in the quotation.', 'في مستودع ترتبه إيرزون في الرياض أو الدمام أو جدة أو الجبيل، أو في مقرك إن كان مناسباً. ويُؤكَّد الموقع في عرض السعر.') },
    { q: l('Can you return the empty container?', 'هل يمكنكم إعادة الحاوية الفارغة؟'), a: l('Yes, where applicable the empty is returned to the depot nominated by the shipping line. Returning it within the free time helps avoid detention charges.', 'نعم، تُعاد الحاوية الفارغة عند الاقتضاء إلى الساحة التي يحددها الخط الملاحي. وتساعد إعادتها خلال المهلة المجانية على تجنب رسوم الاحتجاز.') },
  ],
  related: [SEA, STORE, CUSTOMS, TRANSPORT, HEAVY, EXHIBITION],
  seo: {
    title: l('Container Destuffing & Unloading in Saudi Arabia | Airzone', 'تفريغ الحاويات ومناولة البضائع في السعودية | إيرزون'),
    description: l('Container destuffing, unloading and cargo handling in Saudi Arabia: receiving, counting, palletising, damage reporting, storage, stuffing and onward delivery.', 'تفريغ الحاويات ومناولة البضائع في المملكة: الاستلام والعدّ والتحميل على منصات والإبلاغ عن الأضرار والتخزين وتحميل الحاويات والتوصيل.'),
  },
  service: l('Container destuffing and cargo handling', 'تفريغ الحاويات ومناولة البضائع'),
  area: { type: 'Country', names: ['Saudi Arabia'] },
  updated: UPDATED,
};

