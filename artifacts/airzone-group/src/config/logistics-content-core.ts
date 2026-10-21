/**
 * Bilingual copy for Airzone Group's core logistics services: GCC road
 * transportation, heavy transport & trailers, Dayana local delivery and
 * temperature-controlled warehousing.
 *
 * Accuracy rules: no fleet sizes, payloads, temperatures, capacities,
 * certifications, addresses, prices or guaranteed timings. Vehicles are
 * described as available solutions, not as owned assets. Warehouse cities and
 * 24/7 operations are as stated by the business.
 */
import type { ServiceContent } from './logistics-content';

const u = '2026-10-11';

export const coreLogisticsContent: Record<string, ServiceContent> = {
  '/logistics/gcc-transportation': {
    updatedAt: u,
    en: {
      title: 'GCC road transportation and cross-border freight',
      intro: 'Airzone Group arranges road transportation within Saudi Arabia and across the GCC: full truckloads, commercial cargo and regular distribution runs. Share your route and cargo, and the vehicle, schedule and border requirements are confirmed in your quotation.',
      includes: [
        'Full truckload (FTL) transportation between cities in Saudi Arabia',
        'Cross-border road freight between Saudi Arabia and other GCC states, subject to route confirmation',
        'Commercial cargo movement and regional distribution runs',
        'Dedicated transportation arrangements for recurring business volumes',
        'Coordination of border documentation with the relevant parties',
        'Status communication at agreed milestones',
      ],
      customers: [
        'Manufacturers and distributors moving goods between cities',
        'Importers and exporters needing onward road transport',
        'Retail and FMCG supply chains with recurring routes',
        'Businesses moving cargo between Saudi Arabia and neighbouring GCC states',
      ],
      process: [
        { title: 'Share the route', text: 'Pickup and delivery points, cargo description, weight, dimensions and dates.' },
        { title: 'Vehicle and route plan', text: 'A suitable truck and trailer type is matched to the load and the route is reviewed, including any border steps.' },
        { title: 'Quotation', text: 'Scope, vehicle, charges and responsibilities are confirmed in writing before dispatch.' },
        { title: 'Dispatch and updates', text: 'The movement is coordinated and you receive updates at agreed milestones.' },
      ],
      prepareTitle: 'Information to prepare',
      prepareNote: 'Cross-border moves need commercial and customs documents that depend on the goods and the countries involved. The team confirms what applies.',
      documents: [
        'Pickup and delivery locations',
        'Cargo description, gross weight and dimensions',
        'Number of pallets or packages',
        'Preferred loading date and delivery window',
        'Commercial invoice and packing list for cross-border moves',
        'Any special handling or permit requirements',
      ],
      coverage: 'Domestic road transportation is available between cities in Saudi Arabia. GCC cross-border transportation (United Arab Emirates, Kuwait, Qatar, Bahrain and Oman) is arranged route by route and is subject to vehicle availability, border procedures and applicable regulations. Coverage for your specific route is confirmed in the quotation.',
      faqs: [
        { question: 'Do you transport cargo across GCC borders?', answer: 'Yes, cross-border road freight between Saudi Arabia and other GCC states can be arranged. Each route is confirmed individually, subject to vehicle availability, border procedures and the documents required for the goods.' },
        { question: 'Which vehicles are available?', answer: 'Heavy-duty trucks with box, flatbed, curtain-side and other commercial trailers, matched to the cargo. For smaller local loads, Dayana provides 5-metre and 7-metre trucks and vans.' },
        { question: 'Are all vehicles owned by Airzone Group?', answer: 'Vehicles are allocated according to the shipment and may include partner-operated equipment. The vehicle type and arrangement for your movement are confirmed in the quotation.' },
        { question: 'Can you guarantee a transit time?', answer: 'No. Transit times depend on the route, loading, border procedures and road conditions. A planned schedule is agreed with you and updates are shared if anything changes.' },
      ],
      related: ['/logistics/heavy-transport', '/logistics/warehousing', '/logistics/customs-clearance'],
      sources: [],
    },
    ar: {
      title: 'النقل البري الخليجي والشحن عبر الحدود',
      intro: 'ترتّب مجموعة إيرزون النقل البري داخل المملكة العربية السعودية وفي دول مجلس التعاون الخليجي: شحنات الشاحنات الكاملة والبضائع التجارية ورحلات التوزيع المنتظمة. شاركنا المسار والبضاعة، وتُؤكَّد المركبة والجدول ومتطلبات الحدود ضمن عرض السعر.',
      includes: [
        'نقل الشاحنات الكاملة بين مدن المملكة العربية السعودية',
        'شحن بري عابر للحدود بين المملكة ودول الخليج الأخرى بعد تأكيد المسار',
        'نقل البضائع التجارية ورحلات التوزيع الإقليمي',
        'ترتيبات نقل مخصصة للأحجام التجارية المتكررة',
        'تنسيق مستندات العبور الحدودي مع الأطراف المعنية',
        'إفادات بالحالة عند المراحل المتفق عليها',
      ],
      customers: [
        'المصنّعون والموزعون الذين ينقلون البضائع بين المدن',
        'المستوردون والمصدّرون الذين يحتاجون إلى نقل بري لاحق',
        'سلاسل إمداد التجزئة والسلع الاستهلاكية ذات المسارات المتكررة',
        'الشركات التي تنقل البضائع بين المملكة ودول الخليج المجاورة',
      ],
      process: [
        { title: 'شاركنا المسار', text: 'نقاط التحميل والتسليم ووصف البضاعة والوزن والأبعاد والمواعيد.' },
        { title: 'خطة المركبة والمسار', text: 'نختار نوع الشاحنة والمقطورة المناسب للحمولة ونراجع المسار بما في ذلك خطوات العبور الحدودي.' },
        { title: 'عرض السعر', text: 'يُؤكَّد النطاق والمركبة والرسوم والمسؤوليات كتابياً قبل الانطلاق.' },
        { title: 'الانطلاق والمتابعة', text: 'تُنسَّق الرحلة وتصلك الإفادات عند المراحل المتفق عليها.' },
      ],
      prepareTitle: 'المعلومات التي ينبغي تجهيزها',
      prepareNote: 'تتطلب الرحلات العابرة للحدود مستندات تجارية وجمركية تختلف بحسب البضاعة والدول المعنية، ويؤكد الفريق ما ينطبق.',
      documents: [
        'مواقع التحميل والتسليم',
        'وصف البضاعة والوزن الإجمالي والأبعاد',
        'عدد المنصات أو الطرود',
        'تاريخ التحميل المفضل ونافذة التسليم',
        'الفاتورة التجارية وقائمة التعبئة للرحلات العابرة للحدود',
        'أي متطلبات خاصة للمناولة أو التصاريح',
      ],
      coverage: 'يتوفر النقل البري المحلي بين مدن المملكة العربية السعودية. أما النقل العابر للحدود إلى دول الخليج (الإمارات والكويت وقطر والبحرين وعُمان) فيُرتَّب لكل مسار على حدة، ويخضع لتوفر المركبات وإجراءات الحدود والأنظمة المعمول بها. تُؤكَّد التغطية لمسارك ضمن عرض السعر.',
      faqs: [
        { question: 'هل تنقلون البضائع عبر حدود دول الخليج؟', answer: 'نعم، يمكن ترتيب الشحن البري بين المملكة ودول الخليج الأخرى. يُؤكَّد كل مسار على حدة وفق توفر المركبات وإجراءات الحدود والمستندات المطلوبة للبضاعة.' },
        { question: 'ما المركبات المتاحة؟', answer: 'شاحنات ثقيلة مع مقطورات مغلقة ومسطحة وجانبية الستائر ومقطورات تجارية أخرى بحسب البضاعة. وللحمولات المحلية الأصغر توفر Dayana شاحنات بطول 5 و7 أمتار وعربات فان.' },
        { question: 'هل جميع المركبات مملوكة لمجموعة إيرزون؟', answer: 'تُخصَّص المركبات وفق الشحنة، وقد تشمل معدات يشغّلها شركاء. يُؤكَّد نوع المركبة وترتيب النقل لرحلتك ضمن عرض السعر.' },
        { question: 'هل تضمنون مدة العبور؟', answer: 'لا. تعتمد مدة العبور على المسار والتحميل وإجراءات الحدود وظروف الطريق. نتفق معك على جدول مخطط ونبلغك بأي تغيير.' },
      ],
      related: ['/logistics/heavy-transport', '/logistics/warehousing', '/logistics/customs-clearance'],
      sources: [],
    },
  },

  '/logistics/heavy-transport': {
    updatedAt: u,
    en: {
      title: 'Heavy transport and trailer solutions',
      intro: 'For cargo that needs more than a standard box trailer, Airzone Group arranges heavy-duty trucks with flatbed, curtain-side and other commercial trailers, including heavy and oversized loads where the route, permits and equipment allow.',
      includes: [
        'Heavy-duty trucks for full and heavy loads',
        'Flatbed trailers for machinery, steel, construction materials and palletised goods',
        'Curtain-side trailers for side-loaded, palletised and weather-protected cargo',
        'Other commercial trailer types on request',
        'Heavy and oversized cargo transportation, where available and permitted',
        'Route and loading planning for out-of-gauge cargo',
      ],
      customers: [
        'Construction and infrastructure projects',
        'Industrial and manufacturing companies',
        'Equipment suppliers and rental companies',
        'Energy, utilities and project cargo teams',
      ],
      process: [
        { title: 'Cargo specification', text: 'Dimensions, weight per piece, packaging and how the cargo is lifted or loaded.' },
        { title: 'Equipment match', text: 'The truck and trailer type is selected for the load: flatbed, curtain-side or another suitable trailer.' },
        { title: 'Route and permits', text: 'The route is reviewed and any permit, escort or timing requirements are identified for confirmation.' },
        { title: 'Loading and movement', text: 'Loading is coordinated with the site and the movement is followed through to delivery.' },
      ],
      prepareTitle: 'Information to prepare',
      prepareNote: 'Oversized and heavy movements can require permits, escorts or specific routing. Requirements are confirmed for each movement.',
      documents: [
        'Length, width and height of each piece',
        'Weight per piece and total weight',
        'Lifting points or loading method',
        'Access conditions at the pickup site',
        'Access and unloading equipment at the delivery site',
        'Required loading and delivery dates',
      ],
      coverage: 'Available within Saudi Arabia and, subject to route confirmation and applicable regulations, across the GCC. Heavy and oversized transportation depends on equipment availability and the permits required for the route, and is confirmed for each movement.',
      faqs: [
        { question: 'What is the difference between flatbed and curtain-side trailers?', answer: 'A flatbed trailer has an open deck, suited to machinery, steel and cargo loaded by crane or from the side. A curtain-side trailer has a covered body with sliding side curtains, suited to palletised goods that need weather protection and side loading.' },
        { question: 'Can you move oversized cargo?', answer: 'Heavy and oversized loads can be arranged where suitable equipment is available and the route can be permitted. Share the dimensions and weight so the team can confirm what is possible.' },
        { question: 'Who arranges permits and escorts?', answer: 'The requirements for the route are identified and coordinated with the relevant parties. Responsibilities and any related charges are set out in the quotation.' },
        { question: 'Is loading equipment included?', answer: 'Loading and unloading equipment, such as cranes or forklifts, is confirmed job by job. Tell us what is available at each site.' },
      ],
      related: ['/logistics/gcc-transportation', '/logistics/customs-clearance', '/logistics/exhibition-event-logistics'],
      sources: [],
    },
    ar: {
      title: 'حلول النقل الثقيل والمقطورات',
      intro: 'للبضائع التي تتطلب أكثر من مقطورة مغلقة عادية، ترتّب مجموعة إيرزون شاحنات ثقيلة مع مقطورات مسطحة وجانبية الستائر ومقطورات تجارية أخرى، بما في ذلك الحمولات الثقيلة وكبيرة الحجم متى سمح المسار والتصاريح والمعدات بذلك.',
      includes: [
        'شاحنات ثقيلة للحمولات الكاملة والثقيلة',
        'مقطورات مسطحة للآلات والحديد ومواد البناء والبضائع على منصات',
        'مقطورات جانبية الستائر للبضائع المحمّلة من الجانب والمحمية من الأحوال الجوية',
        'أنواع أخرى من المقطورات التجارية عند الطلب',
        'نقل الحمولات الثقيلة وكبيرة الحجم عند توفرها والسماح بها',
        'تخطيط المسار والتحميل للبضائع خارج المقاسات المعتادة',
      ],
      customers: [
        'مشاريع البناء والبنية التحتية',
        'الشركات الصناعية والتصنيعية',
        'موردو المعدات وشركات التأجير',
        'فرق الطاقة والمرافق وشحنات المشاريع',
      ],
      process: [
        { title: 'مواصفات البضاعة', text: 'الأبعاد ووزن كل قطعة والتغليف وطريقة الرفع أو التحميل.' },
        { title: 'اختيار المعدات', text: 'يُحدَّد نوع الشاحنة والمقطورة المناسب للحمولة: مسطحة أو جانبية الستائر أو مقطورة أخرى مناسبة.' },
        { title: 'المسار والتصاريح', text: 'يُراجَع المسار وتُحدَّد متطلبات التصاريح أو المرافقة أو التوقيت لتأكيدها.' },
        { title: 'التحميل والنقل', text: 'يُنسَّق التحميل مع الموقع وتُتابَع الرحلة حتى التسليم.' },
      ],
      prepareTitle: 'المعلومات التي ينبغي تجهيزها',
      prepareNote: 'قد تتطلب الحمولات الثقيلة وكبيرة الحجم تصاريح أو مرافقة أو مسارات محددة، وتُؤكَّد المتطلبات لكل رحلة.',
      documents: [
        'طول كل قطعة وعرضها وارتفاعها',
        'وزن كل قطعة والوزن الإجمالي',
        'نقاط الرفع أو طريقة التحميل',
        'ظروف الوصول إلى موقع التحميل',
        'ظروف الوصول ومعدات التفريغ في موقع التسليم',
        'مواعيد التحميل والتسليم المطلوبة',
      ],
      coverage: 'متاح داخل المملكة العربية السعودية، وفي دول الخليج بعد تأكيد المسار ووفق الأنظمة المعمول بها. يعتمد النقل الثقيل وكبير الحجم على توفر المعدات والتصاريح المطلوبة للمسار، ويُؤكَّد لكل رحلة.',
      faqs: [
        { question: 'ما الفرق بين المقطورة المسطحة والمقطورة جانبية الستائر؟', answer: 'المقطورة المسطحة ذات سطح مكشوف يناسب الآلات والحديد والبضائع المحمّلة بالرافعة أو من الجانب. أما المقطورة جانبية الستائر فهي مغطاة بستائر جانبية منزلقة وتناسب البضائع على المنصات التي تحتاج إلى حماية من الأحوال الجوية وتحميل جانبي.' },
        { question: 'هل يمكنكم نقل البضائع كبيرة الحجم؟', answer: 'يمكن ترتيب الحمولات الثقيلة وكبيرة الحجم عند توفر المعدات المناسبة وإمكانية الحصول على تصاريح المسار. شاركنا الأبعاد والوزن ليؤكد الفريق ما هو ممكن.' },
        { question: 'من يرتّب التصاريح والمرافقة؟', answer: 'تُحدَّد متطلبات المسار وتُنسَّق مع الأطراف المعنية، وتُوضَّح المسؤوليات وأي رسوم مرتبطة ضمن عرض السعر.' },
        { question: 'هل تشمل الخدمة معدات التحميل؟', answer: 'تُؤكَّد معدات التحميل والتفريغ مثل الرافعات والرافعات الشوكية لكل مهمة. أخبرنا بما يتوفر في كل موقع.' },
      ],
      related: ['/logistics/gcc-transportation', '/logistics/customs-clearance', '/logistics/exhibition-event-logistics'],
      sources: [],
    },
  },

  '/logistics/dayana-local-delivery': {
    updatedAt: u,
    en: {
      title: 'Dayana local delivery services',
      intro: 'Dayana is the local delivery service of Airzone Group. It provides 5-metre and 7-metre delivery trucks and vans for city distribution, commercial deliveries and last-mile logistics, connected to Airzone warehousing and transportation.',
      includes: [
        '5-metre delivery trucks for medium commercial loads',
        '7-metre delivery trucks for larger local consignments',
        'Vans for smaller and more frequent drops',
        'Scheduled and on-request local delivery runs',
        'Multi-drop distribution routes',
        'Coordination with Airzone warehousing for stock-to-door delivery',
      ],
      customers: [
        'Retailers and e-commerce businesses',
        'Distributors and wholesalers serving local customers',
        'Businesses replenishing stores, branches or sites',
        'Companies moving goods between warehouses and customers',
      ],
      process: [
        { title: 'Describe the deliveries', text: 'Loading point, delivery areas, number of drops, cargo volume and delivery windows.' },
        { title: 'Vehicle selection', text: 'A van, 5-metre or 7-metre truck is recommended for the load and the drop pattern.' },
        { title: 'Schedule', text: 'Delivery runs are scheduled once or on a recurring basis, as agreed.' },
        { title: 'Delivery', text: 'Deliveries are completed and confirmed according to the agreed arrangement.' },
      ],
      prepareTitle: 'Information to prepare',
      prepareNote: 'Service areas, schedules and capacity are confirmed when you request a booking or quotation.',
      documents: [
        'Loading point and delivery areas or addresses',
        'Number of drops per run',
        'Cargo volume, number of pallets or cartons',
        'Delivery windows and frequency',
        'Whether unloading assistance is needed',
      ],
      coverage: 'Dayana focuses on local delivery and last-mile distribution. Service areas, schedules and vehicle availability are confirmed when you request a booking or quotation.',
      faqs: [
        { question: 'Which vehicle do I need?', answer: 'Vans suit smaller, frequent drops; 5-metre trucks suit medium commercial loads; 7-metre trucks suit larger local consignments. The team recommends a vehicle after reviewing your load and drops.' },
        { question: 'Do you offer same-day delivery?', answer: 'Timing depends on vehicle availability, the delivery area and when the goods are ready. A delivery window is agreed with you rather than promised in advance.' },
        { question: 'Can Dayana deliver stock held in an Airzone warehouse?', answer: 'Yes. Local delivery can be coordinated with Airzone warehousing so that stock moves from storage to your customers in one arrangement.' },
      ],
      related: ['/logistics/warehousing', '/logistics/gcc-transportation', '/logistics/heavy-transport'],
      sources: [],
    },
    ar: {
      title: 'خدمات Dayana للتوصيل المحلي',
      intro: 'Dayana هي خدمة التوصيل المحلي التابعة لمجموعة إيرزون، وتوفر شاحنات توصيل بطول 5 أمتار و7 أمتار وعربات فان للتوزيع داخل المدن والتوصيل التجاري والتوصيل للميل الأخير، مع ربطها بخدمات التخزين والنقل لدى إيرزون.',
      includes: [
        'شاحنات توصيل بطول 5 أمتار للحمولات التجارية المتوسطة',
        'شاحنات توصيل بطول 7 أمتار للشحنات المحلية الأكبر',
        'عربات فان للتوصيلات الأصغر والأكثر تكراراً',
        'رحلات توصيل محلية مجدولة أو عند الطلب',
        'مسارات توزيع متعددة نقاط التسليم',
        'التنسيق مع مستودعات إيرزون للتوصيل من المخزون إلى الباب',
      ],
      customers: [
        'متاجر التجزئة والتجارة الإلكترونية',
        'الموزعون وتجار الجملة الذين يخدمون عملاء محليين',
        'الشركات التي تزوّد متاجرها أو فروعها أو مواقعها',
        'الشركات التي تنقل البضائع بين المستودعات والعملاء',
      ],
      process: [
        { title: 'صف التوصيلات', text: 'نقطة التحميل ومناطق التسليم وعدد نقاط التوصيل وحجم البضاعة ونوافذ التسليم.' },
        { title: 'اختيار المركبة', text: 'نوصي بعربة فان أو شاحنة 5 أمتار أو 7 أمتار وفق الحمولة ونمط التوصيل.' },
        { title: 'الجدولة', text: 'تُجدوَل رحلات التوصيل لمرة واحدة أو بشكل متكرر حسب الاتفاق.' },
        { title: 'التوصيل', text: 'تُنفَّذ التوصيلات وتُؤكَّد وفق الترتيب المتفق عليه.' },
      ],
      prepareTitle: 'المعلومات التي ينبغي تجهيزها',
      prepareNote: 'تُؤكَّد مناطق الخدمة والجداول والسعة عند طلب الحجز أو عرض السعر.',
      documents: [
        'نقطة التحميل ومناطق أو عناوين التسليم',
        'عدد نقاط التوصيل في كل رحلة',
        'حجم البضاعة أو عدد المنصات أو الكراتين',
        'نوافذ التسليم وتكرار الرحلات',
        'هل تحتاج إلى مساعدة في التفريغ',
      ],
      coverage: 'تركّز Dayana على التوصيل المحلي والتوزيع للميل الأخير. تُؤكَّد مناطق الخدمة والجداول وتوفر المركبات عند طلب الحجز أو عرض السعر.',
      faqs: [
        { question: 'ما المركبة التي أحتاجها؟', answer: 'تناسب عربات الفان التوصيلات الصغيرة المتكررة، وشاحنات 5 أمتار الحمولات التجارية المتوسطة، وشاحنات 7 أمتار الشحنات المحلية الأكبر. يوصي الفريق بالمركبة بعد مراجعة حمولتك ونقاط التوصيل.' },
        { question: 'هل تقدمون التوصيل في اليوم نفسه؟', answer: 'يعتمد التوقيت على توفر المركبات ومنطقة التسليم وجاهزية البضاعة. نتفق معك على نافذة تسليم بدلاً من الوعد بها مسبقاً.' },
        { question: 'هل يمكن لـ Dayana توصيل المخزون المحفوظ في مستودعات إيرزون؟', answer: 'نعم. يمكن تنسيق التوصيل المحلي مع خدمات التخزين لدى إيرزون لتنتقل البضائع من المستودع إلى عملائك ضمن ترتيب واحد.' },
      ],
      related: ['/logistics/warehousing', '/logistics/gcc-transportation', '/logistics/heavy-transport'],
      sources: [],
    },
  },
};
