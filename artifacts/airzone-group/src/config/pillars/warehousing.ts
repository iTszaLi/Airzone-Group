import type { PhotoKey } from '../photography';
import { l, type Item, type L, type PillarPage } from './types';
import { UPDATED } from './customs';

/**
 * Warehousing pillar and the four warehouse-city pages. Verified: temperature-
 * controlled warehousing in Riyadh, Dammam, Jeddah and Jubail with
 * 24/7 operations. Not verified (never stated): addresses, areas, pallet
 * capacities, exact temperature ranges, certifications, WMS or customer
 * portals. Value-added services are offered "where available" and confirmed
 * per facility. City context (ports, industry, markets) is general public
 * information about each city, not a claim about an Airzone facility.
 */
const WHERE = l('Where available · confirmed per facility', 'عند التوفر · يُؤكَّد لكل مرفق');
const quote = (city?: string) => `/logistics/request-quote?service=warehousing${city ? `&city=${city}` : ''}`;

export const warehouseCategories: Item[] = [
  { id: 'general', photo: 'warehouseAisle', title: l('General cargo & ambient storage', 'تخزين البضائع العامة في درجة الحرارة العادية'), text: l('Packaged goods that do not need temperature control, stored on racking or floor positions.', 'البضائع المعبأة التي لا تحتاج إلى تحكم بالحرارة، تُخزَّن على رفوف أو على الأرضية.'), points: [l('Commercial and industrial goods', 'البضائع التجارية والصناعية'), l('Cartons and palletised stock', 'الكراتين والمخزون على منصات')] },
  { id: 'temperature', photo: 'warehouseFloor', title: l('Temperature-controlled warehousing', 'التخزين المتحكم بحرارته'), text: l('Storage for goods that must stay within a set range, in all four cities. Chilled and frozen requirements are matched to a suitable facility.', 'تخزين للبضائع التي يجب أن تبقى ضمن نطاق محدد في المدن الأربع، وتُطابَق متطلبات التبريد والتجميد مع مرفق مناسب.'), points: [l('Chilled storage', 'التخزين المبرد'), l('Frozen storage', 'التخزين المجمد'), l('Range confirmed per product', 'يُؤكَّد النطاق لكل منتج')] },
  { id: 'pallet', photo: 'boxTruck', title: l('Palletised cargo storage', 'تخزين البضائع على منصات'), text: l('Pallet positions for regular inbound and outbound flows, with receiving and dispatch.', 'مواقع للمنصات للتدفقات المنتظمة الواردة والصادرة مع الاستلام والإرسال.'), points: [l('Standard and mixed pallets', 'المنصات القياسية والمختلطة'), l('Inbound from ports and suppliers', 'الوارد من الموانئ والموردين')] },
  { id: 'retail', photo: 'boxVan', title: l('Retail, wholesale & FMCG inventory', 'مخزون التجزئة والجملة والسلع الاستهلاكية'), text: l('Stock held close to market, ready for store replenishment through Dayana.', 'مخزون قريب من السوق وجاهز لإعادة تزويد المتاجر عبر Dayana.'), points: [l('Store and branch replenishment', 'إعادة تزويد المتاجر والفروع'), l('Promotional and seasonal stock', 'المخزون الترويجي والموسمي')] },
  { id: 'food', photo: 'reeferTrailer', title: l('Food & beverage storage', 'تخزين الأغذية والمشروبات'), text: l('Dry, chilled and frozen food stored in line with the product’s requirements and applicable rules.', 'تخزين الأغذية الجافة والمبردة والمجمدة وفق متطلبات المنتج والأنظمة المطبقة.'), points: [l('Imported and local products', 'المنتجات المستوردة والمحلية'), l('Linked to SFDA clearance', 'مرتبط بفسح الهيئة العامة للغذاء والدواء')] },
  { id: 'industrial', photo: 'flatbedTrailer', title: l('Industrial materials & spare parts', 'المواد الصناعية وقطع الغيار'), text: l('Raw materials, components and spare parts for factories, plants and projects.', 'المواد الخام والمكونات وقطع الغيار للمصانع والمنشآت والمشاريع.'), points: [l('Maintenance and project stock', 'مخزون الصيانة والمشاريع'), l('Bulk commercial inventory where suitable', 'المخزون التجاري بالجملة عند الملاءمة')] },
  { id: 'healthcare', photo: 'medicalPlanning', tag: WHERE, title: l('Pharmaceutical & healthcare storage', 'تخزين الأدوية ومنتجات الرعاية الصحية'), text: l('Considered only where suitable approvals, infrastructure and procedures exist for the product.', 'يُنظر فيه فقط عند توفر الموافقات والبنية التحتية والإجراءات المناسبة للمنتج.') },
  { id: 'ecommerce', photo: 'panelVan', tag: WHERE, title: l('E-commerce & packaging inventory', 'مخزون التجارة الإلكترونية ومواد التغليف'), text: l('Stock and packaging materials for online orders and distribution programmes.', 'المخزون ومواد التغليف للطلبات الإلكترونية وبرامج التوزيع.') },
  { id: 'project', photo: 'oversizeLoad', tag: WHERE, title: l('Project cargo & oversized goods', 'شحنات المشاريع والبضائع كبيرة الحجم'), text: l('Yard or warehouse space where the facility can accommodate the dimensions.', 'مساحة في الساحة أو المستودع عندما يستوعب المرفق الأبعاد.') },
  { id: 'duration', photo: 'containerYard', title: l('Short-term, long-term & overflow storage', 'التخزين قصير وطويل المدة والتخزين الإضافي'), text: l('From a few days after customs release to long-term contracts, plus overflow capacity for seasonal peaks.', 'من أيام قليلة بعد الفسح الجمركي إلى عقود طويلة المدة، إضافة إلى سعة إضافية لمواسم الذروة.') },
];

const valueAdded: Item[] = [
  { id: 'inbound', title: l('Receiving & inspection', 'الاستلام والفحص'), points: [l('Receiving and unloading', 'الاستلام والتفريغ'), l('Container unloading', 'تفريغ الحاويات'), l('Goods inspection and receiving records', 'فحص البضائع وسجلات الاستلام')], links: [{ href: '/logistics/container-destuffing', label: l('Container destuffing & handling', 'تفريغ الحاويات ومناولتها') }] },
  { id: 'inventory', title: l('Storage & inventory', 'التخزين والمخزون'), points: [l('Pallet storage', 'تخزين المنصات'), l('Inventory tracking', 'تتبع المخزون'), l('Stock reporting', 'تقارير المخزون')] },
  { id: 'orders', title: l('Order preparation', 'تجهيز الطلبات'), points: [l('Picking and packing', 'الانتقاء والتعبئة'), l('Repacking and labelling', 'إعادة التعبئة ووضع الملصقات'), l('Returns processing', 'معالجة المرتجعات')] },
  { id: 'outbound', title: l('Dispatch & distribution', 'الإرسال والتوزيع'), points: [l('Dispatch and loading coordination', 'تنسيق الإرسال والتحميل'), l('Cross-docking', 'المناولة المباشرة'), l('Warehouse-to-store distribution', 'التوزيع من المستودع إلى المتاجر')] },
  { id: 'conditions', title: l('Conditions & operations', 'الظروف والتشغيل'), points: [l('24/7 warehouse operations', 'عمليات المستودعات على مدار الساعة'), l('Temperature control for suitable goods', 'التحكم بالحرارة للبضائع المناسبة'), l('Temperature monitoring where equipped', 'مراقبة الحرارة عند توفر التجهيزات')] },
];

const cityLinks = [
  { href: '/logistics/warehousing-riyadh', label: l('Warehousing in Riyadh', 'التخزين في الرياض') },
  { href: '/logistics/warehousing-dammam', label: l('Warehousing in Dammam', 'التخزين في الدمام') },
  { href: '/logistics/warehousing-jeddah', label: l('Warehousing in Jeddah', 'التخزين في جدة') },
  { href: '/logistics/warehousing-jubail', label: l('Warehousing in Jubail', 'التخزين في الجبيل') },
];

export const warehousing: PillarPage = {
  path: '/logistics/warehousing',
  photo: 'warehousingCover',
  heroSplit: true,
  parents: [{ href: '/logistics', label: l('Logistics', 'الخدمات اللوجستية') }],
  crumb: l('Warehousing', 'التخزين'),
  eyebrow: l('Airzone Logistics · Warehousing', 'إيرزون للخدمات اللوجستية · التخزين'),
  h1: l('Warehousing and storage in Saudi Arabia', 'التخزين والمستودعات في المملكة العربية السعودية'),
  lead: l(
    'Temperature-controlled warehousing in Riyadh, Dammam, Jeddah and Jubail with 24/7 operations, connected to customs clearance, road transportation and Dayana local delivery.',
    'تخزين متحكم بحرارته في الرياض والدمام وجدة والجبيل مع عمليات على مدار الساعة، مرتبط بالتخليص الجمركي والنقل البري والتوصيل المحلي عبر Dayana.',
  ),
  ctas: [{ href: quote(), label: l('Request a storage quote', 'اطلب عرض سعر للتخزين'), primary: true }, { href: '#locations', label: l('Warehouse locations', 'مواقع المستودعات') }],
  notice: {
    title: l('Matched to your requirements', 'وفق متطلباتك'),
    text: l('Not every facility offers every service. Space, temperature ranges, handling services and certifications are confirmed for your goods and location before storage begins.', 'لا يقدم كل مرفق جميع الخدمات، وتُؤكَّد المساحة ونطاقات الحرارة وخدمات المناولة والشهادات لبضائعك وموقعك قبل بدء التخزين.'),
  },
  sections: [
    {
      id: 'categories', eyebrow: l('Storage categories', 'فئات التخزين'),
      title: l('Storage for different types of cargo', 'تخزين لأنواع مختلفة من البضائع'),
      blocks: [{ kind: 'cards', columns: 3, items: warehouseCategories }],
    },
    {
      id: 'services', eyebrow: l('Operations', 'العمليات'), tone: 'surface',
      title: l('Warehouse operations & value-added services', 'عمليات المستودعات والخدمات المضافة'),
      text: l('Services available where the facility supports them, confirmed in your storage quotation.', 'خدمات متاحة حيث يدعمها المرفق، وتُؤكَّد في عرض سعر التخزين.'),
      note: l('Live stock visibility, system integrations or customer dashboards are not offered unless confirmed in writing.', 'لا تُقدَّم إتاحة المخزون الفورية أو تكامل الأنظمة أو لوحات العملاء ما لم يُؤكَّد ذلك كتابياً.'),
      blocks: [{ kind: 'groups', items: valueAdded }],
    },
    {
      id: 'locations', eyebrow: l('Locations', 'المواقع'), tone: 'dark',
      title: l('Four warehouse cities', 'أربع مدن للمستودعات'),
      text: l('Choose the city closest to your port of entry, production or customers.', 'اختر المدينة الأقرب إلى منفذ الدخول أو الإنتاج أو العملاء.'),
      blocks: [{ kind: 'chips', items: cityLinks }],
    },
    {
      id: 'connected', eyebrow: l('Connected services', 'خدمات مترابطة'),
      title: l('From customs release to the customer', 'من الفسح الجمركي إلى العميل'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        { id: 'in', photo: 'portCranes', title: l('Inbound from customs', 'الوارد من الجمارك'), text: l('Cleared imports move straight from the port, airport or border into storage.', 'تنتقل الواردات المفسوحة مباشرة من الميناء أو المطار أو المنفذ إلى التخزين.'), links: [{ href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') }] },
        { id: 'between', photo: 'semiOpenRoad', title: l('Between cities', 'بين المدن'), text: l('Full truckloads rebalance stock between Riyadh and the coasts.', 'تعيد الشحنات الكاملة توزيع المخزون بين الرياض والسواحل.'), links: [{ href: '/logistics/transportation', label: l('Transportation', 'النقل') }] },
        { id: 'out', photo: 'boxVan', title: l('Out to stores and customers', 'إلى المتاجر والعملاء'), text: l('Dayana trucks and vans deliver orders across the city.', 'توصل شاحنات Dayana وعرباتها الطلبات داخل المدينة.'), links: [{ href: '/logistics/dayana-local-delivery', label: l('Dayana local delivery', 'Dayana للتوصيل المحلي') }] },
      ] }],
    },
  ],
  faqs: [
    { q: l('What types of goods can be stored?', 'ما أنواع البضائع التي يمكن تخزينها؟'), a: l('General and ambient goods, palletised stock, retail and FMCG inventory, food and beverages, industrial materials and spare parts, and temperature-controlled goods. Regulated products such as medicines are considered only where suitable approvals and infrastructure exist.', 'البضائع العامة والعادية والمخزون على منصات ومخزون التجزئة والسلع الاستهلاكية والأغذية والمشروبات والمواد الصناعية وقطع الغيار والبضائع المتحكم بحرارتها، ولا يُنظر في المنتجات الخاضعة للتنظيم كالأدوية إلا عند توفر الموافقات والبنية المناسبة.') },
    { q: l('Which cities have warehousing?', 'ما المدن التي تتوفر فيها المستودعات؟'), a: l('Riyadh, Dammam, Jeddah and Jubail, with temperature-controlled storage and 24/7 operations.', 'الرياض والدمام وجدة والجبيل، مع تخزين متحكم بحرارته وعمليات على مدار الساعة.') },
    { q: l('What temperatures can you store at?', 'ما درجات الحرارة المتاحة للتخزين؟'), a: l('Temperature ranges vary by facility and are confirmed for your product before storage. Tell us the required range and any handling instructions.', 'تختلف نطاقات الحرارة حسب المرفق وتُؤكَّد لمنتجك قبل التخزين، فأخبرنا بالنطاق المطلوب وأي تعليمات للمناولة.') },
    { q: l('Is short-term storage possible?', 'هل يمكن التخزين لمدة قصيرة؟'), a: l('Yes: short-term storage after customs release or between deliveries, as well as long-term and seasonal overflow arrangements.', 'نعم، تخزين قصير المدة بعد الفسح الجمركي أو بين عمليات التوصيل، إضافة إلى ترتيبات طويلة المدة والتخزين الإضافي الموسمي.') },
  ],
  related: [
    ...cityLinks.slice(0, 2),
    { href: '/logistics/transportation', label: l('Transportation', 'النقل') },
    { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') },
    { href: '/logistics/container-destuffing', label: l('Container destuffing', 'تفريغ الحاويات') },
    { href: '/locations', label: l('Service locations', 'مواقع الخدمة') },
  ],
  seo: {
    title: l('Warehousing & Storage in Saudi Arabia | Airzone Logistics', 'التخزين والمستودعات في السعودية | إيرزون'),
    description: l('Warehousing in Riyadh, Dammam, Jeddah and Jubail: temperature-controlled storage with 24/7 operations, receiving, container destuffing and dispatch.', 'تخزين متحكم بحرارته وتخزين عام في الرياض والدمام وجدة والجبيل مع عمليات على مدار الساعة واستلام ومناولة للمخزون وإرسال.'),
  },
  service: l('Warehousing', 'التخزين'),
  area: { type: 'City', names: ['Riyadh', 'Dammam', 'Jeddah', 'Jubail'] },
  updated: UPDATED,
};

type City = {
  id: string; name: L; region: L; photo: PhotoKey; lead: L;
  why: L[]; customers: L[]; connections: L[]; faqs: { q: L; a: L }[]; seo: { title: L; description: L };
};

const cities: City[] = [
  {
    id: 'riyadh', name: l('Riyadh', 'الرياض'), region: l('Central Region', 'المنطقة الوسطى'), photo: 'riyadh',
    lead: l('Storage in the capital, close to the Kingdom’s largest consumer market and the head offices that buy for it, with temperature-controlled space and 24/7 operations.', 'تخزين في العاصمة قريباً من أكبر سوق استهلاكية في المملكة ومن المقار الرئيسية التي تشتري لها، مع مساحات متحكم بحرارتها وعمليات على مدار الساعة.'),
    why: [l('Riyadh is the largest single market for retail, FMCG and food distribution', 'الرياض أكبر سوق منفردة لتوزيع التجزئة والسلع الاستهلاكية والأغذية'), l('Riyadh Dry Port connects the city to the east coast by rail, so imports can clear inland', 'يربط ميناء الرياض الجاف المدينة بالساحل الشرقي بالقطار، فيمكن تخليص الواردات في الداخل'), l('Central position on the road corridors to Dammam and Jeddah', 'موقع مركزي على محاور الطرق إلى الدمام وجدة')],
    customers: [l('Retail chains and distributors serving the capital', 'سلاسل التجزئة والموزعون الذين يخدمون العاصمة'), l('Importers clearing goods through Riyadh Dry Port or King Khalid International Airport', 'المستوردون الذين يخلّصون بضائعهم عبر ميناء الرياض الجاف أو مطار الملك خالد الدولي'), l('Food and beverage companies needing temperature-controlled stock near customers', 'شركات الأغذية والمشروبات التي تحتاج إلى مخزون متحكم بحرارته قرب العملاء'), l('E-commerce sellers fulfilling orders within the city', 'بائعو التجارة الإلكترونية الذين ينفذون الطلبات داخل المدينة')],
    connections: [l('Dayana trucks and vans for deliveries across Riyadh', 'شاحنات Dayana وعرباتها للتوصيل في أنحاء الرياض'), l('Full truckloads to Dammam, Jeddah and GCC destinations', 'شحنات كاملة إلى الدمام وجدة ووجهات خليجية'), l('Customs clearance coordinated for inland and coastal entry points', 'تنسيق التخليص الجمركي لمنافذ الدخول الداخلية والساحلية')],
    faqs: [
      { q: l('Can imports be cleared in Riyadh and stored straight away?', 'هل يمكن تخليص الواردات في الرياض وتخزينها مباشرة؟'), a: l('Yes. Cargo cleared at Riyadh Dry Port, the airport or a coastal port can be moved directly into storage, with clearance and transport planned together.', 'نعم. يمكن نقل البضائع المفسوحة في ميناء الرياض الجاف أو المطار أو الموانئ الساحلية مباشرة إلى التخزين، مع تخطيط التخليص والنقل معاً.') },
      { q: l('Do you deliver from the Riyadh warehouse to stores?', 'هل توصلون من مستودع الرياض إلى المتاجر؟'), a: l('Dayana handles local deliveries with 5-metre and 7-metre trucks and vans; service areas are confirmed when you book.', 'تتولى Dayana التوصيل المحلي بشاحنات 5 و7 أمتار وعربات فان، وتُؤكَّد مناطق الخدمة عند الحجز.') },
    ],
    seo: { title: l('Warehousing in Riyadh | Temperature-Controlled | Airzone', 'التخزين في الرياض | تخزين متحكم بحرارته | إيرزون'), description: l('Temperature-controlled and general storage in Riyadh with 24/7 operations, linked to Riyadh Dry Port clearance, inter-city transport and Dayana local delivery.', 'تخزين متحكم بحرارته وتخزين عام في الرياض مع عمليات على مدار الساعة، مرتبط بالتخليص في ميناء الرياض الجاف والنقل بين المدن والتوصيل المحلي عبر Dayana.') },
  },
  {
    id: 'dammam', name: l('Dammam', 'الدمام'), region: l('Eastern Province', 'المنطقة الشرقية'), photo: 'dammam',
    lead: l('Storage in the Eastern Province, beside King Abdulaziz Port and the road links to Bahrain, Qatar, Kuwait and the UAE, with temperature-controlled space and 24/7 operations.', 'تخزين في المنطقة الشرقية بجوار ميناء الملك عبدالعزيز وطرق الربط مع البحرين وقطر والكويت والإمارات، مع مساحات متحكم بحرارتها وعمليات على مدار الساعة.'),
    why: [l('King Abdulaziz Port in Dammam is one of the Kingdom’s main container gateways', 'ميناء الملك عبدالعزيز بالدمام من أهم بوابات الحاويات في المملكة'), l('Closest Saudi city to the King Fahd Causeway and other GCC land borders', 'أقرب مدينة سعودية إلى جسر الملك فهد ومنافذ برية خليجية أخرى'), l('Serves the Dammam, Khobar and Dhahran metropolitan area and Eastern Province industry', 'يخدم حاضرة الدمام والخبر والظهران وصناعات المنطقة الشرقية')],
    customers: [l('Importers receiving containers through King Abdulaziz Port', 'المستوردون الذين يستلمون الحاويات عبر ميناء الملك عبدالعزيز'), l('Regional distributors supplying Bahrain, Qatar and Kuwait by road', 'الموزعون الإقليميون الذين يزودون البحرين وقطر والكويت براً'), l('Oil, gas and industrial service companies holding spare parts', 'شركات خدمات النفط والغاز والصناعة التي تحتفظ بقطع غيار'), l('Food importers needing chilled or frozen storage near the port', 'مستوردو الأغذية الذين يحتاجون إلى تخزين مبرد أو مجمد قرب الميناء')],
    connections: [l('Port-to-warehouse transfers after customs release', 'النقل من الميناء إلى المستودع بعد الفسح الجمركي'), l('Cross-border road freight to GCC states', 'شحن بري عابر للحدود إلى دول الخليج'), l('Full truckloads to Riyadh and Jubail', 'شحنات كاملة إلى الرياض والجبيل')],
    faqs: [
      { q: l('Can containers from Dammam port go straight into storage?', 'هل يمكن نقل حاويات ميناء الدمام مباشرة إلى التخزين؟'), a: l('Yes. Once released, cargo can be collected from the port, unloaded and stored, with clearance coordinated by Airzone and licensed brokers where required.', 'نعم. بعد الفسح يمكن استلام البضائع من الميناء وتفريغها وتخزينها، مع تنسيق التخليص عبر إيرزون ومخلصين مرخّصين عند الحاجة.') },
      { q: l('Is Dammam a good base for supplying other GCC countries?', 'هل الدمام قاعدة مناسبة لتزويد دول الخليج الأخرى؟'), a: l('Its position near the land borders makes it practical for road freight to Bahrain, Qatar, Kuwait and the UAE; each route is confirmed in the quotation.', 'موقعها قرب المنافذ البرية يجعلها عملية للشحن البري إلى البحرين وقطر والكويت والإمارات، ويُؤكَّد كل مسار في عرض السعر.') },
    ],
    seo: { title: l('Warehousing in Dammam near King Abdulaziz Port | Airzone', 'التخزين في الدمام قرب ميناء الملك عبدالعزيز | إيرزون'), description: l('Temperature-controlled storage in Dammam with 24/7 operations, port-to-warehouse transfers and road freight to Bahrain, Qatar, Kuwait and the UAE.', 'تخزين متحكم بحرارته في الدمام مع عمليات على مدار الساعة ونقل من الميناء إلى المستودع وشحن بري إلى البحرين وقطر والكويت والإمارات.') },
  },
  {
    id: 'jeddah', name: l('Jeddah', 'جدة'), region: l('Western Region', 'المنطقة الغربية'), photo: 'jeddahPort',
    lead: l('Storage on the Red Sea coast, close to Jeddah Islamic Port and the markets of Makkah and Madinah, with temperature-controlled space and 24/7 operations.', 'تخزين على ساحل البحر الأحمر قريباً من ميناء جدة الإسلامي وأسواق مكة المكرمة والمدينة المنورة، مع مساحات متحكم بحرارتها وعمليات على مدار الساعة.'),
    why: [l('Jeddah Islamic Port is one of the Kingdom’s busiest seaports for imported goods', 'ميناء جدة الإسلامي من أكثر الموانئ السعودية نشاطاً في استقبال الواردات'), l('Gateway to the Western Region, including Makkah and Madinah', 'بوابة المنطقة الغربية بما فيها مكة المكرمة والمدينة المنورة'), l('Demand peaks around the Umrah and Hajj seasons', 'ترتفع الطلبات في مواسم العمرة والحج')],
    customers: [l('Importers receiving goods through Jeddah Islamic Port', 'المستوردون الذين يستلمون البضائع عبر ميناء جدة الإسلامي'), l('Food and FMCG distributors serving the Western Region', 'موزعو الأغذية والسلع الاستهلاكية في المنطقة الغربية'), l('Businesses preparing seasonal stock for Makkah and Madinah', 'الشركات التي تجهز المخزون الموسمي لمكة المكرمة والمدينة المنورة'), l('Retailers needing overflow space at peak times', 'متاجر التجزئة التي تحتاج إلى مساحات إضافية في أوقات الذروة')],
    connections: [l('Port-to-warehouse transfers after release', 'النقل من الميناء إلى المستودع بعد الفسح'), l('Full truckloads to Riyadh and inland cities', 'شحنات كاملة إلى الرياض ومدن الداخل'), l('Local delivery across Jeddah', 'التوصيل المحلي في أنحاء جدة')],
    faqs: [
      { q: l('Can you handle seasonal peaks in Jeddah?', 'هل يمكنكم التعامل مع مواسم الذروة في جدة؟'), a: l('Overflow and short-term storage can be arranged around peak periods, subject to space being confirmed in advance.', 'يمكن ترتيب تخزين إضافي وقصير المدة حول فترات الذروة، شريطة تأكيد المساحة مسبقاً.') },
      { q: l('Do you store chilled food in Jeddah?', 'هل تخزنون الأغذية المبردة في جدة؟'), a: l('Temperature-controlled storage is available in Jeddah; the range and handling are confirmed for each product.', 'يتوفر تخزين متحكم بحرارته في جدة، ويُؤكَّد النطاق والمناولة لكل منتج.') },
    ],
    seo: { title: l('Warehousing in Jeddah near Jeddah Islamic Port | Airzone', 'التخزين في جدة قرب ميناء جدة الإسلامي | إيرزون'), description: l('Temperature-controlled storage in Jeddah with 24/7 operations, close to Jeddah Islamic Port and serving the Western Region, including seasonal overflow.', 'تخزين متحكم بحرارته في جدة مع عمليات على مدار الساعة قرب ميناء جدة الإسلامي لخدمة المنطقة الغربية، بما في ذلك التخزين الموسمي الإضافي.') },
  },
  {
    id: 'jubail', name: l('Jubail', 'الجبيل'), region: l('Eastern Province', 'المنطقة الشرقية'), photo: 'jubail',
    lead: l('Storage beside one of the region’s largest industrial cities, for materials, spare parts and project cargo, with temperature-controlled space and 24/7 operations.', 'تخزين بجوار إحدى أكبر المدن الصناعية في المنطقة، للمواد وقطع الغيار وشحنات المشاريع، مع مساحات متحكم بحرارتها وعمليات على مدار الساعة.'),
    why: [l('Jubail Industrial City hosts major petrochemical and manufacturing plants', 'تحتضن مدينة الجبيل الصناعية منشآت كبرى للبتروكيماويات والتصنيع'), l('Jubail Commercial Port and King Fahd Industrial Port handle industrial cargo', 'يستقبل ميناء الجبيل التجاري وميناء الملك فهد الصناعي الشحنات الصناعية'), l('Short road links to Dammam and the wider Eastern Province', 'روابط برية قصيرة مع الدمام وبقية المنطقة الشرقية')],
    customers: [l('Plants and contractors holding maintenance and shutdown spares', 'المصانع والمقاولون الذين يحتفظون بقطع غيار الصيانة والإيقاف المجدول'), l('Project teams staging equipment before installation', 'فرق المشاريع التي تجهز المعدات قبل تركيبها'), l('Suppliers of industrial materials and consumables', 'موردو المواد والمستهلكات الصناعية'), l('Importers using the Jubail ports', 'المستوردون الذين يستخدمون موانئ الجبيل')],
    connections: [l('Flatbed, low-bed and specialised transport for heavy items', 'نقل بمقطورات مسطحة ومنخفضة ومتخصصة للقطع الثقيلة'), l('Port-to-site and warehouse-to-site deliveries', 'التوصيل من الميناء أو المستودع إلى الموقع'), l('Full truckloads to Dammam, Riyadh and GCC destinations', 'شحنات كاملة إلى الدمام والرياض ووجهات خليجية')],
    faqs: [
      { q: l('Can you store project cargo in Jubail?', 'هل يمكنكم تخزين شحنات المشاريع في الجبيل؟'), a: l('Where the facility can accommodate the dimensions and weight, yes. Send the packing list and dimensions so space and handling can be confirmed.', 'نعم، عندما يستوعب المرفق الأبعاد والوزن، فأرسل قائمة التعبئة والأبعاد لتأكيد المساحة والمناولة.') },
      { q: l('Do you deliver to industrial sites?', 'هل توصلون إلى المواقع الصناعية؟'), a: l('Yes, subject to site access requirements, which should be shared in advance.', 'نعم، وفق متطلبات الدخول إلى الموقع التي ينبغي مشاركتها مسبقاً.') },
    ],
    seo: { title: l('Warehousing in Jubail | Industrial Cargo Storage | Airzone', 'التخزين في الجبيل للمواد الصناعية والمشاريع | إيرزون'), description: l('Storage in Jubail for industrial materials, spare parts and project cargo, with temperature-controlled space, 24/7 operations and heavy transport to site.', 'تخزين في الجبيل للمواد الصناعية وقطع الغيار وشحنات المشاريع، مع مساحات متحكم بحرارتها وعمليات على مدار الساعة ونقل ثقيل إلى المواقع.') },
  },
];

export const warehouseCityPages: PillarPage[] = cities.map(c => ({
  path: `/logistics/warehousing-${c.id}`,
  photo: c.photo,
  parents: [{ href: '/logistics', label: l('Logistics', 'الخدمات اللوجستية') }, { href: '/logistics/warehousing', label: l('Warehousing', 'التخزين') }],
  crumb: c.name,
  eyebrow: l(`Warehousing · ${c.region.en}`, `التخزين · ${c.region.ar}`),
  h1: l(`Warehousing in ${c.name.en}`, `التخزين في ${c.name.ar}`),
  lead: c.lead,
  ctas: [{ href: quote(c.id), label: l(`Request storage in ${c.name.en}`, `اطلب التخزين في ${c.name.ar}`), primary: true }, { href: '/logistics/warehousing', label: l('All warehousing services', 'جميع خدمات التخزين') }],
  notice: {
    title: l('About this location', 'عن هذا الموقع'),
    text: l(`Airzone provides temperature-controlled warehousing in ${c.name.en} with 24/7 operations. Facility details such as space, temperature ranges and handling services are confirmed for your requirement; the address is shared with customers once arrangements are confirmed.`, `توفر إيرزون تخزيناً متحكماً بحرارته في ${c.name.ar} مع عمليات على مدار الساعة. وتُؤكَّد تفاصيل المرفق مثل المساحة ونطاقات الحرارة وخدمات المناولة وفق متطلباتك، ويُشارك العنوان مع العملاء بعد تأكيد الترتيبات.`),
  },
  sections: [
    { id: 'why', eyebrow: l(`Why ${c.name.en}`, `لماذا ${c.name.ar}`), title: l(`Why store in ${c.name.en}`, `لماذا التخزين في ${c.name.ar}`), blocks: [{ kind: 'groups', items: [
      { id: 'context', title: l('Location', 'الموقع'), points: c.why },
      { id: 'customers', title: l('Typical customers', 'العملاء المعتادون'), points: c.customers },
    ] }] },
    { id: 'storage', eyebrow: l('Storage options', 'خيارات التخزين'), tone: 'surface', title: l(`Storage options in ${c.name.en}`, `خيارات التخزين في ${c.name.ar}`),
      blocks: [{ kind: 'cards', columns: 3, items: warehouseCategories.filter(w => ['temperature', 'general', 'pallet', 'food', 'industrial', 'duration'].includes(w.id)).map(w => ({ ...w, photo: undefined })) }] },
    { id: 'connections', eyebrow: l('Connected transport', 'النقل المرتبط'), tone: 'dark', title: l(`Moving goods in and out of ${c.name.en}`, `نقل البضائع من ${c.name.ar} وإليها`),
      blocks: [{ kind: 'groups', items: [{ id: 'links', title: l('Transport and customs', 'النقل والجمارك'), points: c.connections }] }],
      ctas: [{ href: '/logistics/transportation', label: l('Transportation', 'النقل') }, { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') }] },
  ],
  faqs: c.faqs,
  related: [
    { href: '/logistics/warehousing', label: l('Warehousing in Saudi Arabia', 'التخزين في السعودية') },
    ...cityLinks.filter(x => !x.href.endsWith(c.id)),
  ],
  seo: c.seo,
  service: l(`Warehousing in ${c.name.en}`, `التخزين في ${c.name.ar}`),
  area: { type: 'City', names: [c.name.en] },
  updated: UPDATED,
}));
