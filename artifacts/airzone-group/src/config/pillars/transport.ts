import { l, type Field, type Item, type PillarPage } from './types';
import { UPDATED } from './customs';

/**
 * Transportation pillar. Vehicle categories marked "confirmed" are those the
 * business has stated; "arranged on request" items (refrigerated equipment,
 * part loads, dedicated fleets) depend on availability and partners and are
 * listed in the verification checklist. No fleet sizes, payloads or
 * dimensions are given.
 */
const CONFIRMED = l('Confirmed category · availability per booking', 'فئة مؤكدة · يُؤكَّد التوفر لكل حجز');
const ON_REQUEST = l('Arranged on request · subject to availability', 'تُرتَّب عند الطلب · وفق التوفر');
const DAYANA = l('Dayana local delivery', 'Dayana للتوصيل المحلي');

const F = {
  designed: ['Designed for', 'مصممة لـ'],
  cargo: ['Suitable cargo', 'البضائع المناسبة'],
  uses: ['Typical uses', 'الاستخدامات المعتادة'],
  loading: ['Loading & unloading', 'التحميل والتفريغ'],
  care: ['Securing & conditions', 'التثبيت والظروف'],
} as const;
const fl = (k: keyof typeof F, en: string, ar: string): Field => ({ label: l(F[k][0], F[k][1]), text: l(en, ar) });
const quote = (service: string) => [{ href: `/logistics/request-quote?service=${service}`, label: l('Request this vehicle', 'اطلب هذه المركبة') }];

export const fleetDirectory: Item[] = [
  { id: 'heavy-duty', photo: 'semiOpenRoad', tag: CONFIRMED, title: l('Heavy-duty trucks & standard semi-trailers', 'الشاحنات الثقيلة والمقطورات القياسية'),
    fields: [fl('designed', 'Full truckloads over long distances within Saudi Arabia and across GCC routes.', 'الشحنات الكاملة لمسافات طويلة داخل المملكة وعلى المسارات الخليجية.'), fl('cargo', 'Palletised and packaged goods, general commercial cargo.', 'البضائع على منصات والمعبأة والبضائع التجارية العامة.'), fl('uses', 'Supplier-to-warehouse transfers, inter-city replenishment, import cargo from ports.', 'النقل من المورد إلى المستودع، وإعادة التزويد بين المدن، ونقل الواردات من الموانئ.'), fl('loading', 'Dock or forklift loading at the rear or side, depending on the trailer.', 'التحميل من الرصيف أو بالرافعة الشوكية من الخلف أو الجانب بحسب المقطورة.'), fl('care', 'Load restraint and weight distribution planned for the route.', 'تخطيط تثبيت الحمولة وتوزيع الوزن وفق المسار.')], links: quote('gcc-transportation') },
  { id: 'flatbed', photo: 'flatbedTrailer', tag: CONFIRMED, title: l('Flatbed trailers', 'المقطورات المسطحة'),
    fields: [fl('designed', 'Open decks for cargo loaded from the side or from above.', 'أسطح مكشوفة للبضائع المحملة من الجانب أو من الأعلى.'), fl('cargo', 'Steel, pipes, construction materials, machinery and crated equipment.', 'الحديد والأنابيب ومواد البناء والمعدات والآلات المغلفة.'), fl('uses', 'Construction sites, industrial projects, equipment deliveries.', 'مواقع البناء والمشاريع الصناعية وتوصيل المعدات.'), fl('loading', 'Crane, forklift or side loading; site access confirmed in advance.', 'التحميل بالرافعة أو الرافعة الشوكية أو من الجانب، مع تأكيد إمكانية الوصول للموقع مسبقاً.'), fl('care', 'Straps, chains and covers chosen for the cargo; weather protection where needed.', 'أحزمة وسلاسل وأغطية تناسب الحمولة، مع الحماية من الطقس عند الحاجة.')], links: quote('heavy-transport') },
  { id: 'lowbed', photo: 'lowbedTrailer', tag: CONFIRMED, title: l('Low-bed & low-loader trailers', 'المقطورات المنخفضة'),
    fields: [fl('designed', 'Tall or heavy items that need a low deck height.', 'البضائع الطويلة أو الثقيلة التي تحتاج إلى سطح منخفض.'), fl('cargo', 'Construction and earth-moving equipment, industrial machinery, transformers.', 'معدات البناء والحفر والآلات الصناعية والمحولات.'), fl('uses', 'Moving plant between sites, project cargo from ports to site.', 'نقل المعدات بين المواقع وشحنات المشاريع من الموانئ إلى المواقع.'), fl('loading', 'Drive-on ramps or crane lifts; route surveys for large items.', 'التحميل عبر المنحدرات أو بالرافعات، مع مسح المسار للقطع الكبيرة.'), fl('care', 'Permits, escorts and travel windows where the dimensions require them.', 'التصاريح والمرافقة وأوقات السير عندما تتطلب الأبعاد ذلك.')], links: quote('heavy-transport') },
  { id: 'curtain', photo: 'curtainTrailer', tag: CONFIRMED, title: l('Curtain-side trailers', 'المقطورات جانبية الستائر'),
    fields: [fl('designed', 'Covered cargo that is easiest to load from the side.', 'البضائع المغطاة التي يسهل تحميلها من الجانب.'), fl('cargo', 'Palletised goods, FMCG, building products, packaged industrial supplies.', 'البضائع على منصات والسلع الاستهلاكية ومنتجات البناء والمستلزمات الصناعية المعبأة.'), fl('uses', 'Distribution centres, retail replenishment, multi-drop full loads.', 'مراكز التوزيع وإعادة تزويد متاجر التجزئة والشحنات الكاملة متعددة النقاط.'), fl('loading', 'Side or rear loading with a forklift.', 'التحميل الجانبي أو الخلفي بالرافعة الشوكية.'), fl('care', 'Curtains protect against dust and sun; loads are strapped inside.', 'تحمي الستائر من الغبار والشمس، وتُثبَّت الحمولة من الداخل.')], links: quote('heavy-transport') },
  { id: 'box', photo: 'boxTrailer', tag: CONFIRMED, title: l('Box & enclosed trailers', 'المقطورات الصندوقية والمغلقة'),
    fields: [fl('designed', 'Fully enclosed, secure transport.', 'نقل مغلق بالكامل وآمن.'), fl('cargo', 'Electronics, retail stock, high-value packaged goods, imported cartons.', 'الإلكترونيات ومخزون التجزئة والبضائع المعبأة عالية القيمة والكراتين المستوردة.'), fl('uses', 'Port-to-warehouse moves, store deliveries, e-commerce stock transfers.', 'النقل من الميناء إلى المستودع وتوصيل المتاجر ونقل مخزون التجارة الإلكترونية.'), fl('loading', 'Rear loading at a dock or with a tail lift where fitted.', 'التحميل الخلفي من الرصيف أو بالرافعة الخلفية عند توفرها.'), fl('care', 'Sealed doors and internal restraints.', 'أبواب مختومة وتثبيت داخلي.')], links: quote('gcc-transportation') },
  { id: 'reefer', photo: 'reeferTrailer', tag: ON_REQUEST, title: l('Refrigerated trailers & temperature-controlled trucks', 'المقطورات المبردة والشاحنات المتحكم بحرارتها'),
    fields: [fl('designed', 'Cargo that must stay chilled, frozen or within a set range.', 'البضائع التي يجب أن تبقى مبردة أو مجمدة أو ضمن نطاق محدد.'), fl('cargo', 'Chilled and frozen food, beverages and other temperature-sensitive goods.', 'الأغذية المبردة والمجمدة والمشروبات وغيرها من البضائع الحساسة للحرارة.'), fl('uses', 'Port or warehouse to distributor, cold-chain replenishment.', 'من الميناء أو المستودع إلى الموزع، وإعادة التزويد ضمن سلسلة التبريد.'), fl('loading', 'Pre-cooled equipment and quick dock transfers.', 'معدات مبردة مسبقاً ونقل سريع عبر الرصيف.'), fl('care', 'Temperature range, monitoring and handling confirmed for each shipment.', 'يُؤكَّد نطاق الحرارة والمراقبة والمناولة لكل شحنة.')], links: [{ href: '#temperature', label: l('Temperature-controlled transport', 'النقل المتحكم بحرارته') }] },
  { id: 'oversized', photo: 'oversizeLoad', tag: CONFIRMED, title: l('Oversized, abnormal & project cargo', 'الحمولات الاستثنائية وشحنات المشاريع'),
    fields: [fl('designed', 'Loads beyond standard dimensions or weights.', 'الحمولات التي تتجاوز الأبعاد أو الأوزان المعتادة.'), fl('cargo', 'Industrial machinery, plant, structures and project components.', 'الآلات الصناعية والمعدات والهياكل ومكونات المشاريع.'), fl('uses', 'Industrial projects, plant relocation, port-to-site moves.', 'المشاريع الصناعية ونقل المصانع والنقل من الميناء إلى الموقع.'), fl('loading', 'Lifting plans and specialised equipment agreed in advance.', 'خطط الرفع والمعدات المتخصصة يُتفق عليها مسبقاً.'), fl('care', 'Permits, escorts and route planning where suitable equipment is available.', 'التصاريح والمرافقة وتخطيط المسار عند توفر المعدات المناسبة.')], links: quote('heavy-transport') },
  { id: 'rigid7', photo: 'boxTruck', tag: DAYANA, title: l('7-metre delivery trucks', 'شاحنات التوصيل 7 أمتار'),
    fields: [fl('designed', 'Larger local consignments and multi-drop routes.', 'الشحنات المحلية الأكبر والمسارات متعددة النقاط.'), fl('cargo', 'Pallets and cartons for stores, branches and sites.', 'المنصات والكراتين للمتاجر والفروع والمواقع.'), fl('uses', 'Warehouse-to-store deliveries and scheduled distribution.', 'التوصيل من المستودع إلى المتاجر والتوزيع المجدول.'), fl('loading', 'Dock or tail-lift loading where fitted.', 'التحميل من الرصيف أو بالرافعة الخلفية عند توفرها.'), fl('care', 'Service areas confirmed at booking.', 'تُؤكَّد مناطق الخدمة عند الحجز.')], links: [{ href: '/logistics/dayana-local-delivery', label: l('Dayana local delivery', 'Dayana للتوصيل المحلي') }] },
  { id: 'rigid5', photo: 'boxVan', tag: DAYANA, title: l('5-metre delivery trucks', 'شاحنات التوصيل 5 أمتار'),
    fields: [fl('designed', 'Medium commercial loads in cities and regions.', 'الحمولات التجارية المتوسطة داخل المدن والمناطق.'), fl('cargo', 'Cartons, small pallets and retail stock.', 'الكراتين والمنصات الصغيرة ومخزون التجزئة.'), fl('uses', 'Branch replenishment and B2B deliveries.', 'إعادة تزويد الفروع والتوصيل بين الشركات.'), fl('loading', 'Manual, pallet-jack or tail-lift loading.', 'التحميل اليدوي أو برافعة المنصات أو الرافعة الخلفية.'), fl('care', 'Service areas confirmed at booking.', 'تُؤكَّد مناطق الخدمة عند الحجز.')], links: [{ href: '/logistics/dayana-local-delivery', label: l('Dayana local delivery', 'Dayana للتوصيل المحلي') }] },
  { id: 'van', photo: 'panelVan', tag: DAYANA, title: l('Delivery vans', 'عربات التوصيل'),
    fields: [fl('designed', 'Smaller, frequent drops and last-mile delivery.', 'التوصيلات الصغيرة والمتكررة والتوصيل للميل الأخير.'), fl('cargo', 'Parcels, cartons and small consignments.', 'الطرود والكراتين والشحنات الصغيرة.'), fl('uses', 'City routes, customer and store deliveries.', 'المسارات داخل المدن والتوصيل للعملاء والمتاجر.'), fl('loading', 'Hand loading at the rear or side door.', 'التحميل اليدوي من الباب الخلفي أو الجانبي.'), fl('care', 'Service areas confirmed at booking.', 'تُؤكَّد مناطق الخدمة عند الحجز.')], links: [{ href: '/logistics/dayana-local-delivery', label: l('Dayana local delivery', 'Dayana للتوصيل المحلي') }] },
];

export const transportation: PillarPage = {
  path: '/logistics/transportation',
  photo: 'transportCover',
  heroSplit: true,
  parents: [{ href: '/logistics', label: l('Logistics', 'الخدمات اللوجستية') }],
  crumb: l('Transportation', 'النقل'),
  eyebrow: l('Airzone Logistics · Transportation', 'إيرزون للخدمات اللوجستية · النقل'),
  h1: l('Road transportation across Saudi Arabia and the GCC', 'النقل البري في المملكة العربية السعودية ودول الخليج'),
  lead: l(
    'Commercial cargo transportation across Saudi Arabia and confirmed GCC routes: full truckloads, heavy and oversized cargo, temperature-sensitive goods on request and local distribution through Dayana. The directory below shows the vehicles we provide or arrange and how to request the right one.',
    'نقل البضائع التجارية داخل المملكة وعلى مسارات خليجية مؤكدة: شحنات كاملة، وحمولات ثقيلة واستثنائية، وبضائع حساسة للحرارة عند الطلب، وتوزيع محلي عبر Dayana. يعرض الدليل أدناه المركبات التي نوفرها أو نرتبها وكيف تطلب المناسبة لشحنتك.',
  ),
  ctas: [{ href: '/logistics/request-quote?service=gcc-transportation', label: l('Request a transport quote', 'اطلب عرض سعر للنقل'), primary: true }, { href: '#fleet', label: l('Browse the fleet directory', 'تصفح دليل الأسطول') }],
  notice: {
    title: l('Availability is confirmed per booking', 'يُؤكَّد التوفر لكل حجز'),
    text: l('Routes, equipment, permits and timings are confirmed in each quotation. Vehicles may include partner-operated equipment, and no fleet size, payload or delivery time is implied.', 'تُؤكَّد المسارات والمعدات والتصاريح والمدد في كل عرض سعر، وقد تشمل المركبات معدات يشغّلها شركاء، ولا يُقصد أي حجم للأسطول أو حمولة أو مدة توصيل.'),
  },
  sections: [
    {
      id: 'fleet', eyebrow: l('Fleet directory', 'دليل الأسطول'),
      title: l('The right vehicle for the load', 'المركبة المناسبة للحمولة'),
      text: l('Choose by cargo, route and loading conditions. Each entry explains what the vehicle carries and how it is loaded.', 'اختر بحسب البضاعة والمسار وظروف التحميل، ويوضح كل بند ما تحمله المركبة وكيف تُحمَّل.'),
      blocks: [{ kind: 'rows', items: fleetDirectory }],
    },
    {
      id: 'models', eyebrow: l('Service models', 'نماذج الخدمة'), tone: 'surface',
      title: l('How we move your cargo', 'كيف ننقل بضائعك'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        { id: 'ftl', tag: CONFIRMED, title: l('Full truckload (FTL)', 'الشحنة الكاملة'), text: l('A dedicated truck and trailer for your cargo, point to point within Saudi Arabia or across the GCC.', 'شاحنة ومقطورة مخصصتان لبضاعتك من نقطة إلى نقطة داخل المملكة أو عبر دول الخليج.') },
        { id: 'ltl', tag: ON_REQUEST, title: l('Part loads (LTL)', 'الشحنات الجزئية'), text: l('Smaller consignments that do not fill a truck, where a suitable shared movement is available.', 'الشحنات الصغيرة التي لا تملأ شاحنة، عند توفر رحلة مشتركة مناسبة.') },
        { id: 'dedicated', tag: ON_REQUEST, title: l('Dedicated & scheduled transport', 'النقل المخصص والمجدول'), text: l('Regular runs on agreed days and routes, planned around your replenishment cycle.', 'رحلات منتظمة في أيام ومسارات متفق عليها، مخططة وفق دورة إعادة التزويد لديك.') },
        { id: 'pallet', tag: CONFIRMED, title: l('Palletised distribution', 'توزيع البضائع على منصات'), text: l('Pallets moved between suppliers, warehouses and stores, with Dayana for the final city leg.', 'نقل المنصات بين الموردين والمستودعات والمتاجر، مع Dayana للمرحلة الأخيرة داخل المدينة.') },
        { id: 'construction', tag: CONFIRMED, title: l('Construction materials', 'مواد البناء'), text: l('Steel, blocks, pipes and building products on flatbed and curtain-side trailers.', 'الحديد والطوب والأنابيب ومنتجات البناء على مقطورات مسطحة وجانبية الستائر.') },
        { id: 'industrial', tag: CONFIRMED, title: l('Industrial & commercial distribution', 'التوزيع الصناعي والتجاري'), text: l('Supplies and spare parts for factories, sites and commercial customers.', 'المستلزمات وقطع الغيار للمصانع والمواقع والعملاء التجاريين.') },
      ] }],
    },
    {
      id: 'temperature', eyebrow: l('Temperature-controlled', 'متحكم بحرارته'), tone: 'dark',
      title: l('Temperature-controlled transportation', 'النقل المتحكم بحرارته'),
      text: l('For goods that must stay chilled, frozen or within a set range, refrigerated equipment is arranged on request and connected to temperature-controlled warehousing in four Saudi cities.', 'للبضائع التي يجب أن تبقى مبردة أو مجمدة أو ضمن نطاق محدد، تُرتَّب المعدات المبردة عند الطلب وتُربط بالتخزين المتحكم بحرارته في أربع مدن سعودية.'),
      note: l('Temperature ranges, monitoring, equipment and handling are confirmed for each shipment. Pharmaceutical shipments are accepted only where suitable equipment, procedures and approvals are in place.', 'يُؤكَّد نطاق الحرارة والمراقبة والمعدات والمناولة لكل شحنة، ولا تُقبل شحنات الأدوية إلا عند توفر المعدات والإجراءات والموافقات المناسبة.'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        { id: 'chilled', title: l('Chilled cargo', 'البضائع المبردة'), text: l('Fresh produce, dairy and chilled foods kept cool from collection to delivery.', 'المنتجات الطازجة والألبان والأغذية المبردة تبقى باردة من الاستلام حتى التسليم.') },
        { id: 'frozen', title: l('Frozen cargo', 'البضائع المجمدة'), text: l('Frozen foods moved in equipment set to the required temperature.', 'نقل الأغذية المجمدة بمعدات مضبوطة على الحرارة المطلوبة.') },
        { id: 'fnb', title: l('Food & beverage distribution', 'توزيع الأغذية والمشروبات'), text: l('Distributor and retail deliveries planned around receiving windows.', 'التوصيل للموزعين ومتاجر التجزئة وفق أوقات الاستلام.') },
        { id: 'sensitive', title: l('Temperature-sensitive goods', 'البضائع الحساسة للحرارة'), text: l('Chemicals, cosmetics and other products that must not overheat.', 'الكيماويات ومستحضرات التجميل وغيرها من المنتجات التي يجب ألا ترتفع حرارتها.') },
        { id: 'health', title: l('Healthcare shipments', 'شحنات الرعاية الصحية'), text: l('Only where suitable equipment and approvals can be confirmed for the product.', 'فقط عند إمكانية تأكيد المعدات والموافقات المناسبة للمنتج.') },
        { id: 'link', title: l('Linked to cold storage', 'مرتبط بالتخزين المبرد'), text: l('Move straight into temperature-controlled warehousing in Riyadh, Dammam, Jeddah or Jubail.', 'انتقال مباشر إلى التخزين المتحكم بحرارته في الرياض أو الدمام أو جدة أو الجبيل.'), links: [{ href: '/logistics/warehousing#categories', label: l('Warehouse categories', 'فئات التخزين') }] },
      ] }],
    },
    {
      id: 'dayana', eyebrow: l('Local distribution', 'التوزيع المحلي'),
      title: l('Dayana: Airzone’s local delivery fleet', 'Dayana: أسطول التوصيل المحلي من إيرزون'),
      text: l('Dayana is the local delivery service of Airzone Logistics, using 5-metre trucks, 7-metre trucks and vans for retail replenishment, business-to-business distribution, warehouse-to-store deliveries, scheduled programmes and last-mile delivery. Service areas and vehicle availability are confirmed when you book.', 'Dayana هي خدمة التوصيل المحلي لدى إيرزون للخدمات اللوجستية، وتستخدم شاحنات 5 و7 أمتار وعربات فان لإعادة تزويد متاجر التجزئة والتوزيع بين الشركات والتوصيل من المستودع إلى المتاجر والبرامج المجدولة والتوصيل للميل الأخير. وتُؤكَّد مناطق الخدمة وتوفر المركبات عند الحجز.'),
      blocks: [{ kind: 'chips', items: [
        { href: '/logistics/dayana-local-delivery', label: l('Explore Dayana local delivery', 'استكشف Dayana للتوصيل المحلي') },
        { href: '/logistics/request-quote?service=dayana-local-delivery', label: l('Request a Dayana quote', 'اطلب عرض سعر من Dayana') },
      ] }],
    },
    {
      id: 'coverage', eyebrow: l('Coverage', 'التغطية'), tone: 'surface',
      title: l('Across Saudi Arabia and the GCC', 'في جميع أنحاء المملكة ودول الخليج'),
      blocks: [{ kind: 'groups', items: [
        { id: 'ksa', title: l('Within Saudi Arabia', 'داخل المملكة'), points: [l('Riyadh and the Central Region', 'الرياض والمنطقة الوسطى'), l('Dammam, Jubail and the Eastern Province', 'الدمام والجبيل والمنطقة الشرقية'), l('Jeddah and the Western Region', 'جدة والمنطقة الغربية'), l('Other cities on request', 'مدن أخرى عند الطلب')] },
        { id: 'gcc', title: l('Across the GCC', 'عبر دول الخليج'), points: [l('United Arab Emirates', 'الإمارات العربية المتحدة'), l('Kuwait', 'الكويت'), l('Qatar', 'قطر'), l('Bahrain', 'البحرين'), l('Oman', 'عُمان')] },
      ] }],
      note: l('Each route is confirmed for equipment, permits and border procedures. Customs at land borders can be coordinated alongside the transport.', 'يُؤكَّد كل مسار من حيث المعدات والتصاريح وإجراءات الحدود، ويمكن تنسيق الجمارك في المنافذ البرية مع النقل.'),
      ctas: [{ href: '/logistics/customs-clearance', label: l('Customs clearance for road freight', 'التخليص الجمركي للشحن البري') }, { href: '/logistics/gcc-transportation', label: l('GCC transportation', 'النقل البري الخليجي') }],
    },
    {
      id: 'industries', eyebrow: l('Industries', 'القطاعات'),
      title: l('Transport solutions by industry', 'حلول النقل حسب القطاع'),
      blocks: [{ kind: 'chips', items: [
        { href: '/logistics/industries#retail', label: l('Retail & wholesale', 'التجزئة والجملة') },
        { href: '/logistics/industries#fmcg', label: l('FMCG & consumer goods', 'السلع الاستهلاكية سريعة الدوران') },
        { href: '/logistics/industries#manufacturing', label: l('Manufacturing', 'التصنيع') },
        { href: '/logistics/industries#construction', label: l('Construction', 'البناء') },
        { href: '/logistics/industries#automotive', label: l('Automotive & spare parts', 'السيارات وقطع الغيار') },
        { href: '/logistics/industries#food', label: l('Food & beverage', 'الأغذية والمشروبات') },
        { href: '/logistics/industries#healthcare', label: l('Healthcare', 'الرعاية الصحية') },
        { href: '/logistics/industries#ecommerce', label: l('E-commerce', 'التجارة الإلكترونية') },
        { href: '/logistics/industries#machinery', label: l('Machinery & project cargo', 'المعدات وشحنات المشاريع') },
      ] }],
    },
  ],
  faqs: [
    { q: l('What types of trailers are available?', 'ما أنواع المقطورات المتاحة؟'), a: l('Heavy-duty trucks with standard, flatbed, low-bed, curtain-side and box trailers, specialised transport for oversized cargo, and Dayana 5-metre trucks, 7-metre trucks and vans. Refrigerated equipment is arranged on request. Availability is confirmed for each booking.', 'شاحنات ثقيلة بمقطورات قياسية ومسطحة ومنخفضة وجانبية الستائر وصندوقية، ونقل متخصص للحمولات الاستثنائية، وشاحنات Dayana بطول 5 و7 أمتار وعربات فان، وتُرتَّب المعدات المبردة عند الطلب، ويُؤكَّد التوفر لكل حجز.') },
    { q: l('Can temperature-sensitive cargo be transported?', 'هل يمكن نقل البضائع الحساسة للحرارة؟'), a: l('Yes, with refrigerated or temperature-controlled equipment arranged for the shipment. The required range, monitoring and handling are agreed before collection.', 'نعم، بمعدات مبردة أو متحكم بحرارتها تُرتَّب للشحنة، ويُتفق على النطاق المطلوب والمراقبة والمناولة قبل الاستلام.') },
    { q: l('Which Saudi cities and GCC countries are covered?', 'ما المدن السعودية ودول الخليج المشمولة؟'), a: l('Road transport is arranged between Saudi cities, including Riyadh, Dammam, Jeddah and Jubail, and across the GCC to the UAE, Kuwait, Qatar, Bahrain and Oman. Each route is confirmed in the quotation.', 'يُرتَّب النقل البري بين المدن السعودية ومنها الرياض والدمام وجدة والجبيل، وعبر دول الخليج إلى الإمارات والكويت وقطر والبحرين وعُمان، ويُؤكَّد كل مسار في عرض السعر.') },
    { q: l('Do you handle oversized loads?', 'هل تتعاملون مع الحمولات الاستثنائية؟'), a: l('Yes, where suitable equipment, permits and escorts can be arranged for the dimensions and route. Send the dimensions, weight and lifting points with your enquiry.', 'نعم، عند إمكانية ترتيب المعدات والتصاريح والمرافقة المناسبة للأبعاد والمسار، فأرسل الأبعاد والوزن ونقاط الرفع مع استفسارك.') },
    { q: l('How do I request the right vehicle?', 'كيف أطلب المركبة المناسبة؟'), a: l('Send the cargo description, weight, dimensions, pallet count, origin, destination and dates. If you are unsure which vehicle you need, choose “Not sure” and the team will recommend one.', 'أرسل وصف البضاعة والوزن والأبعاد وعدد المنصات والمنشأ والوجهة والمواعيد، وإن لم تكن متأكداً من المركبة المناسبة فاختر "غير متأكد" وسيقترحها الفريق.') },
  ],
  related: [
    { href: '/logistics/gcc-transportation', label: l('GCC transportation', 'النقل البري الخليجي') },
    { href: '/logistics/heavy-transport', label: l('Heavy transport & trailers', 'النقل الثقيل والمقطورات') },
    { href: '/logistics/dayana-local-delivery', label: l('Dayana local delivery', 'Dayana للتوصيل المحلي') },
    { href: '/logistics/warehousing', label: l('Warehousing', 'التخزين') },
    { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') },
    { href: '/logistics/sea-freight', label: l('Sea freight', 'الشحن البحري') },
    { href: '/logistics/exhibition-event-logistics', label: l('Exhibition logistics', 'لوجستيات المعارض') },
  ],
  seo: {
    title: l('Road Transportation in Saudi Arabia & the GCC | Airzone', 'النقل البري في السعودية ودول الخليج | إيرزون'),
    description: l('Road transportation across Saudi Arabia and the GCC: flatbed, curtain-side and low-bed trailers, refrigerated transport on request and Dayana local delivery.', 'مقطورات مسطحة ومنخفضة وجانبية الستائر وصندوقية، ونقل مبرد عند الطلب، وحمولات استثنائية، وتوصيل محلي عبر Dayana في المملكة ودول الخليج.'),
  },
  service: l('Road transportation', 'النقل البري'),
  area: { type: 'Country', names: ['Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar', 'Bahrain', 'Oman'] },
  updated: UPDATED,
};
