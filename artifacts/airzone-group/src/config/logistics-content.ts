/**
 * Bilingual service content for primary Airzone Logistics routes.
 * Cautious by design: no prices, timelines, guarantees, licences, fleet or office claims.
 * Requirements are assessed shipment by shipment.
 */
export const logisticsContentUpdatedAt = '2026-10-11';

export type ServiceLang = {
  title: string; intro: string; includes: string[]; customers: string[];
  process: { title: string; text: string }[]; documents: string[]; coverage: string;
  faqs: { question: string; answer: string }[]; related: string[];
  sources: { title: string; url: string }[];
};
export type ServiceContent = { updatedAt: string; en: ServiceLang; ar: ServiceLang };

const ZATCA = { title: 'ZATCA: ATA Carnet service', url: 'https://zatca.gov.sa/en/eServices/Pages/eServices-294.aspx' };
const ICC = { title: 'ICC: ATA Carnet', url: 'https://iccwbo.org/business-solutions/ata-carnet' };
const ZATCA_AR = { title: 'هيئة الزكاة والضريبة والجمارك: خدمة دفتر ATA Carnet', url: ZATCA.url };
const ICC_AR = { title: 'غرفة التجارة الدولية: دفتر ATA Carnet', url: ICC.url };
const u = logisticsContentUpdatedAt;

const coverEn = 'Enquiries are welcome for shipments connected with Saudi Arabia, including Riyadh as a delivery or coordination point. Routes, partners and modes are confirmed in the quotation. Airzone does not state coverage beyond what is confirmed for your shipment.';
const coverAr = 'نرحب باستفسارات الشحنات المرتبطة بالمملكة العربية السعودية، بما في ذلك الرياض كنقطة تسليم أو تنسيق. تُؤكَّد المسارات والشركاء ووسائل النقل ضمن عرض السعر، ولا نذكر تغطية تتجاوز ما يُؤكَّد لشحنتك.';

export const logisticsContent: Record<string, ServiceContent> = {
  '/logistics/customs-clearance': {
    updatedAt: u,
    en: {
      title: 'Customs clearance support in Saudi Arabia',
      intro: 'Customs clearance support helps you present a shipment correctly to Saudi customs. Share the cargo, origin and documents and the team will tell you what needs confirming before arrival.',
      includes: ['Review of shipment details and documents', 'Guidance on commodity description and classification questions', 'Coordination of clearance steps with the relevant parties', 'Confirmation of duties, VAT and third-party charges in the quotation, where applicable'],
      customers: ['Importers and exporters', 'Companies receiving supplier shipments', 'Exhibitors and project teams with cargo entering Saudi Arabia'],
      process: [{ title: 'Share the shipment', text: 'Send the cargo description, origin, destination and available documents.' }, { title: 'Initial assessment', text: 'The team reviews what is known and lists what still needs to be confirmed.' }, { title: 'Quotation', text: 'Scope, charges and responsibilities are set out before work begins.' }, { title: 'Coordination', text: 'Clearance steps are coordinated and you are kept informed of next actions.' }],
      documents: ['Commercial invoice', 'Packing list', 'Bill of lading or air waybill', 'Certificate of origin, where relevant', 'Any permits or approvals the goods may require'],
      coverage: coverEn,
      faqs: [{ question: 'Which documents do I need?', answer: 'It depends on the goods, origin and applicable regulations. A commercial invoice and packing list are typical starting points; the team confirms the rest for your shipment.' }, { question: 'How are duties and VAT determined?', answer: 'They depend on classification, value, origin and current rules. We do not give a figure before reviewing the shipment.' }, { question: 'Can you promise a clearance time?', answer: 'No. Clearance is subject to customs procedures and the completeness of documents, so we do not promise timelines.' }],
      related: ['/logistics/import-export', '/logistics/freight-forwarding', '/logistics/ata-carnet'], sources: [],
    },
    ar: {
      title: 'دعم التخليص الجمركي في المملكة العربية السعودية',
      intro: 'يساعدك دعم التخليص الجمركي على تقديم شحنتك للجمارك السعودية بالشكل الصحيح. شاركنا بيانات البضاعة والمنشأ والمستندات، وسيحدد الفريق ما يلزم تأكيده قبل الوصول.',
      includes: ['مراجعة بيانات الشحنة ومستنداتها', 'إرشاد بشأن وصف البضاعة وأسئلة التصنيف', 'تنسيق خطوات التخليص مع الأطراف المعنية', 'توضيح الرسوم وضريبة القيمة المضافة ورسوم الأطراف الأخرى في عرض السعر عند انطباقها'],
      customers: ['المستوردون والمصدّرون', 'الشركات التي تستلم شحنات من الموردين', 'العارضون وفرق المشاريع ذات الشحنات الواردة إلى المملكة'],
      process: [{ title: 'شاركنا الشحنة', text: 'أرسل وصف البضاعة والمنشأ والوجهة والمستندات المتوفرة.' }, { title: 'تقييم أولي', text: 'يراجع الفريق المتاح ويحدد ما يلزم تأكيده.' }, { title: 'عرض السعر', text: 'يُوضَّح النطاق والرسوم والمسؤوليات قبل بدء العمل.' }, { title: 'التنسيق', text: 'تُنسَّق خطوات التخليص ويُطلعك الفريق على الخطوات التالية.' }],
      documents: ['الفاتورة التجارية', 'قائمة التعبئة', 'بوليصة الشحن أو بوليصة الشحن الجوي', 'شهادة المنشأ عند الحاجة', 'أي تصاريح أو موافقات قد تتطلبها البضاعة'],
      coverage: coverAr,
      faqs: [{ question: 'ما المستندات المطلوبة؟', answer: 'يعتمد ذلك على البضاعة والمنشأ والأنظمة المطبقة. الفاتورة التجارية وقائمة التعبئة نقطة بداية معتادة، ويؤكد الفريق الباقي لشحنتك.' }, { question: 'كيف تُحدَّد الرسوم وضريبة القيمة المضافة؟', answer: 'تعتمد على التصنيف والقيمة والمنشأ والأنظمة الحالية. لا نذكر رقماً قبل مراجعة الشحنة.' }, { question: 'هل تضمنون مدة للتخليص؟', answer: 'لا. يخضع التخليص للإجراءات الجمركية ولاكتمال المستندات، لذلك لا نَعِد بمدد زمنية.' }],
      related: ['/logistics/import-export', '/logistics/freight-forwarding', '/logistics/ata-carnet'], sources: [],
    },
  },
  '/logistics/freight-forwarding': {
    updatedAt: u,
    en: {
      title: 'Freight forwarding for cargo to and from Saudi Arabia',
      intro: 'Freight forwarding coordinates a shipment from origin to destination across one or more modes. Tell us what is moving, where and when, and we confirm the route and partners in the quotation.',
      includes: ['Routing options by air, sea or road, coordinated directly or with third-party carriers', 'Booking and shipment coordination', 'Documentation support alongside customs steps', 'Status updates at key points'],
      customers: ['Companies shipping regularly or one-off cargo', 'Buyers working with overseas suppliers', 'Teams needing one point of contact for a multi-leg move'],
      process: [{ title: 'Define the move', text: 'Cargo type, dimensions, weight, origin, destination and target dates.' }, { title: 'Confirm route and mode', text: 'Options are reviewed and the mode and carriers are confirmed in the quotation.' }, { title: 'Book and document', text: 'Booking and shipping documents are prepared with you.' }, { title: 'Follow through', text: 'The shipment is followed to hand-over and you receive updates.' }],
      documents: ['Commercial invoice and packing list', 'Cargo dimensions and gross weight', 'Pickup and delivery addresses', 'Incoterms agreed with the supplier', 'Special handling notes'],
      coverage: coverEn,
      faqs: [{ question: 'Do you own the vehicles or aircraft?', answer: 'No. Cargo is coordinated directly or through third-party carriers, confirmed in the quotation.' }, { question: 'Can I track my shipment?', answer: 'Use the tracking page with your reference number where tracking is available for your shipment.' }, { question: 'What helps me get an accurate quote?', answer: 'Dimensions, weight, origin, destination, cargo description and required dates.' }],
      related: ['/logistics/air-freight', '/logistics/sea-freight', '/logistics/customs-clearance'], sources: [],
    },
    ar: {
      title: 'الشحن والتوريد للبضائع من المملكة العربية السعودية وإليها',
      intro: 'ينسّق الشحن والتوريد حركة الشحنة من المنشأ إلى الوجهة عبر وسيلة نقل أو أكثر. أخبرنا بما تنقله ومن أين وإلى أين ومتى، ونؤكد المسار والشركاء في عرض السعر.',
      includes: ['خيارات المسار جواً أو بحراً أو براً، تُنسَّق مباشرة أو عبر ناقلين من الأطراف الأخرى', 'الحجز وتنسيق الشحنة', 'دعم المستندات بالتوازي مع الخطوات الجمركية', 'تحديثات عند المراحل الرئيسية'],
      customers: ['الشركات التي تشحن بانتظام أو لمرة واحدة', 'المشترون الذين يتعاملون مع موردين في الخارج', 'الفرق التي تحتاج جهة اتصال واحدة لرحلة متعددة المراحل'],
      process: [{ title: 'حدد الشحنة', text: 'نوع البضاعة وأبعادها ووزنها والمنشأ والوجهة والمواعيد المستهدفة.' }, { title: 'تأكيد المسار والوسيلة', text: 'تُراجَع الخيارات وتُؤكَّد الوسيلة والناقلون في عرض السعر.' }, { title: 'الحجز والمستندات', text: 'يجري إعداد الحجز ومستندات الشحن معك.' }, { title: 'المتابعة', text: 'تُتابَع الشحنة حتى التسليم وتصلك التحديثات.' }],
      documents: ['الفاتورة التجارية وقائمة التعبئة', 'أبعاد البضاعة والوزن الإجمالي', 'عناوين الاستلام والتسليم', 'شروط الإنكوترمز المتفق عليها مع المورد', 'ملاحظات المناولة الخاصة'],
      coverage: coverAr,
      faqs: [{ question: 'هل تملكون المركبات أو الطائرات؟', answer: 'لا. تُنسَّق الشحنات مباشرة أو عبر ناقلين من الأطراف الأخرى، ويُؤكَّد ذلك في عرض السعر.' }, { question: 'هل يمكنني تتبع شحنتي؟', answer: 'استخدم صفحة التتبع مع رقمك المرجعي حيثما كان التتبع متاحاً لشحنتك.' }, { question: 'ما الذي يساعد على عرض سعر دقيق؟', answer: 'الأبعاد والوزن والمنشأ والوجهة ووصف البضاعة والمواعيد المطلوبة.' }],
      related: ['/logistics/air-freight', '/logistics/sea-freight', '/logistics/customs-clearance'], sources: [],
    },
  },
  '/logistics/air-freight': {
    updatedAt: u,
    en: {
      title: 'Air freight coordination for time-sensitive cargo',
      intro: 'Air freight suits cargo where timing and handling matter. Share the weight, dimensions and deadline and we will confirm the routing and carrier options in the quotation.',
      includes: ['Air cargo booking coordination', 'Routing and handling guidance', 'Airport-side documentation support', 'Coordination with customs clearance and delivery'],
      customers: ['Companies with urgent or high-value shipments', 'Exhibitors with fixed event dates', 'Suppliers sending samples or spare parts'],
      process: [{ title: 'Share cargo details', text: 'Weight, dimensions, packaging and required dates.' }, { title: 'Review options', text: 'Routings and carriers are reviewed against your deadline.' }, { title: 'Confirm and book', text: 'Details are confirmed in the quotation, then booked.' }, { title: 'Clear and deliver', text: 'Customs and onward delivery are coordinated.' }],
      documents: ['Air waybill details', 'Commercial invoice and packing list', 'Dimensions and chargeable weight information', 'Declarations for restricted or dangerous goods, if applicable'],
      coverage: coverEn,
      faqs: [{ question: 'How fast is air freight?', answer: 'Transit depends on the routing, carrier and customs. We do not promise timings before confirming your shipment.' }, { question: 'Can all cargo travel by air?', answer: 'No. Some goods are restricted or need special declarations. Tell us the cargo type early.' }],
      related: ['/logistics/freight-forwarding', '/logistics/customs-clearance', '/logistics/exhibition-event-logistics'], sources: [],
    },
    ar: {
      title: 'تنسيق الشحن الجوي للبضائع الحساسة للوقت',
      intro: 'يناسب الشحن الجوي البضائع التي يهم فيها التوقيت والمناولة. شاركنا الوزن والأبعاد والموعد النهائي، ونؤكد خيارات المسار والناقل في عرض السعر.',
      includes: ['تنسيق حجز الشحن الجوي', 'إرشاد بشأن المسار والمناولة', 'دعم مستندات المطار', 'التنسيق مع التخليص الجمركي والتسليم'],
      customers: ['الشركات ذات الشحنات العاجلة أو عالية القيمة', 'العارضون ذوو مواعيد الفعاليات الثابتة', 'الموردون الذين يرسلون عينات أو قطع غيار'],
      process: [{ title: 'شارك بيانات البضاعة', text: 'الوزن والأبعاد والتغليف والمواعيد المطلوبة.' }, { title: 'مراجعة الخيارات', text: 'تُراجَع المسارات والناقلون وفق موعدك النهائي.' }, { title: 'التأكيد والحجز', text: 'تُؤكَّد التفاصيل في عرض السعر ثم يتم الحجز.' }, { title: 'التخليص والتسليم', text: 'يجري تنسيق الجمارك والتسليم اللاحق.' }],
      documents: ['بيانات بوليصة الشحن الجوي', 'الفاتورة التجارية وقائمة التعبئة', 'معلومات الأبعاد والوزن المحتسب', 'إقرارات البضائع المقيدة أو الخطرة عند انطباقها'],
      coverage: coverAr,
      faqs: [{ question: 'ما سرعة الشحن الجوي؟', answer: 'تعتمد مدة النقل على المسار والناقل والجمارك. لا نَعِد بمواعيد قبل تأكيد شحنتك.' }, { question: 'هل يمكن شحن كل البضائع جواً؟', answer: 'لا. بعض البضائع مقيدة أو تحتاج إقرارات خاصة. أخبرنا بنوع البضاعة مبكراً.' }],
      related: ['/logistics/freight-forwarding', '/logistics/customs-clearance', '/logistics/exhibition-event-logistics'], sources: [],
    },
  },
  '/logistics/sea-freight': {
    updatedAt: u,
    en: {
      title: 'Sea freight coordination for containerised and bulk cargo',
      intro: 'Sea freight suits larger or less urgent cargo. Tell us the volume, container needs and port pair, and the quotation will confirm the options and partners.',
      includes: ['Container and cargo booking coordination', 'Port-to-port and door-to-door planning, with partners confirmed in the quotation', 'Documentation support', 'Coordination with customs clearance and inland delivery'],
      customers: ['Importers with larger volumes', 'Project and equipment cargo', 'Companies planning scheduled shipments'],
      process: [{ title: 'Describe the cargo', text: 'Volume, weight, container needs and ports.' }, { title: 'Review options', text: 'Services and partners are reviewed against your schedule.' }, { title: 'Book and document', text: 'Booking and bill of lading details are prepared.' }, { title: 'Arrival and delivery', text: 'Port handling, clearance and onward delivery are coordinated.' }],
      documents: ['Commercial invoice and packing list', 'Bill of lading details', 'Container or cargo specifications', 'Any permits relevant to the goods'],
      coverage: coverEn,
      faqs: [{ question: 'Can you quote a transit time?', answer: 'Transit depends on the service and port conditions. We confirm what is known when quoting and do not guarantee arrival dates.' }, { question: 'Do you operate vessels?', answer: 'No. Sea cargo is coordinated through carriers and partners confirmed in the quotation.' }],
      related: ['/logistics/freight-forwarding', '/logistics/customs-clearance', '/logistics/import-export'], sources: [],
    },
    ar: {
      title: 'تنسيق الشحن البحري للبضائع في حاويات وللبضائع السائبة',
      intro: 'يناسب الشحن البحري الشحنات الكبيرة أو الأقل استعجالاً. أخبرنا بالحجم واحتياج الحاويات وزوج الموانئ، ويؤكد عرض السعر الخيارات والشركاء.',
      includes: ['تنسيق حجز الحاويات والبضائع', 'تخطيط من ميناء إلى ميناء أو من الباب إلى الباب، مع تأكيد الشركاء في عرض السعر', 'دعم المستندات', 'التنسيق مع التخليص الجمركي والتسليم الداخلي'],
      customers: ['المستوردون ذوو الأحجام الكبيرة', 'شحنات المشاريع والمعدات', 'الشركات التي تخطط لشحنات مجدولة'],
      process: [{ title: 'صف البضاعة', text: 'الحجم والوزن واحتياج الحاويات والموانئ.' }, { title: 'مراجعة الخيارات', text: 'تُراجَع الخدمات والشركاء وفق جدولك.' }, { title: 'الحجز والمستندات', text: 'تُجهَّز بيانات الحجز وبوليصة الشحن.' }, { title: 'الوصول والتسليم', text: 'يجري تنسيق مناولة الميناء والتخليص والتسليم اللاحق.' }],
      documents: ['الفاتورة التجارية وقائمة التعبئة', 'بيانات بوليصة الشحن', 'مواصفات الحاوية أو البضاعة', 'أي تصاريح متعلقة بالبضاعة'],
      coverage: coverAr,
      faqs: [{ question: 'هل يمكنكم تحديد مدة العبور؟', answer: 'تعتمد المدة على الخدمة وظروف الموانئ. نؤكد ما هو معروف عند التسعير ولا نضمن تواريخ الوصول.' }, { question: 'هل تشغّلون سفناً؟', answer: 'لا. تُنسَّق البضائع البحرية عبر ناقلين وشركاء يُؤكَّدون في عرض السعر.' }],
      related: ['/logistics/freight-forwarding', '/logistics/customs-clearance', '/logistics/import-export'], sources: [],
    },
  },
  '/logistics/ata-carnet': {
    updatedAt: u,
    en: {
      title: 'ATA Carnet assistance for temporary imports',
      intro: 'An ATA Carnet is an international customs document for temporarily importing eligible goods without paying duties and taxes, subject to participating territories and conditions. Airzone assists with the shipment side; it does not issue carnets.',
      includes: ['Discussion of whether your goods and destination may suit a carnet', 'Coordination of the shipment alongside carnet procedures', 'Customs-side coordination for arrival and re-export', 'Planning for the return of goods'],
      customers: ['Exhibitors and trade show participants', 'Companies bringing professional equipment or samples temporarily', 'Event and production teams'],
      process: [{ title: 'Check eligibility', text: 'Confirm goods, route and participating territories with the issuing association.' }, { title: 'Share shipment plan', text: 'Provide goods list, dates and arrival details.' }, { title: 'Coordinate arrival', text: 'Shipment and customs steps are coordinated according to current rules.' }, { title: 'Plan the return', text: 'Re-export or return is planned before the carnet conditions expire.' }],
      documents: ['ATA Carnet issued by the national guaranteeing association', 'Detailed goods list and values', 'Commercial invoice and packing list', 'Event dates and venue details', 'Arrival and shipment details'],
      coverage: coverEn,
      faqs: [{ question: 'Who issues an ATA Carnet?', answer: 'A national guaranteeing association in the country of origin issues it, not Airzone.' }, { question: 'Does all exhibition cargo qualify?', answer: 'No. Eligibility depends on the goods and the participating territories. Verify current requirements before shipping.' }, { question: 'Does Saudi Arabia require pre-approval?', answer: 'ZATCA describes a pre-approval for importers holding an ATA Carnet, based on goods, carnet and arrival details. Rules change, so confirm the current process for your shipment.' }, { question: 'How long does it take or what does it cost?', answer: 'We do not state timelines or fees without reviewing the shipment and the current rules.' }],
      related: ['/logistics/exhibition-event-logistics', '/logistics/customs-clearance', '/logistics/air-freight'], sources: [ZATCA, ICC],
    },
    ar: {
      title: 'المساعدة في دفتر ATA Carnet للاستيراد المؤقت',
      intro: 'دفتر ATA Carnet وثيقة جمركية دولية تتيح الاستيراد المؤقت للبضائع المؤهلة دون سداد الرسوم والضرائب، وفق الأقاليم المشاركة والشروط. تساعد إيرزون في جانب الشحنة ولا تصدر الدفاتر.',
      includes: ['مناقشة ما إذا كانت بضاعتك ووجهتك قد تناسب الدفتر', 'تنسيق الشحنة بالتوازي مع إجراءات الدفتر', 'تنسيق الجانب الجمركي عند الوصول وإعادة التصدير', 'التخطيط لإعادة البضائع'],
      customers: ['العارضون والمشاركون في المعارض التجارية', 'الشركات التي تجلب معدات مهنية أو عينات بصورة مؤقتة', 'فرق الفعاليات والإنتاج'],
      process: [{ title: 'التحقق من الأهلية', text: 'أكّد البضاعة والمسار والأقاليم المشاركة مع الجهة المصدِرة.' }, { title: 'شارك خطة الشحنة', text: 'قدّم قائمة البضائع والمواعيد وبيانات الوصول.' }, { title: 'تنسيق الوصول', text: 'تُنسَّق الشحنة والخطوات الجمركية وفق القواعد الحالية.' }, { title: 'التخطيط للإعادة', text: 'يُخطَّط لإعادة التصدير أو الإرجاع قبل انتهاء شروط الدفتر.' }],
      documents: ['دفتر ATA Carnet الصادر عن الجهة الوطنية الضامنة', 'قائمة تفصيلية بالبضائع وقيمها', 'الفاتورة التجارية وقائمة التعبئة', 'مواعيد الفعالية وبيانات الموقع', 'بيانات الوصول والشحنة'],
      coverage: coverAr,
      faqs: [{ question: 'من يصدر دفتر ATA Carnet؟', answer: 'تصدره جهة وطنية ضامنة في بلد المنشأ، وليست إيرزون.' }, { question: 'هل تتأهل كل بضائع المعارض؟', answer: 'لا. تعتمد الأهلية على البضاعة والأقاليم المشاركة. تحقق من المتطلبات الحالية قبل الشحن.' }, { question: 'هل تشترط السعودية موافقة مسبقة؟', answer: 'تصف هيئة الزكاة والضريبة والجمارك موافقة مسبقة للمستورد الحامل للدفتر بناءً على بيانات البضاعة والدفتر والوصول. القواعد تتغير، فأكّد الإجراء الحالي لشحنتك.' }, { question: 'كم تستغرق العملية وكم تكلف؟', answer: 'لا نذكر مدداً أو رسوماً دون مراجعة الشحنة والقواعد الحالية.' }],
      related: ['/logistics/exhibition-event-logistics', '/logistics/customs-clearance', '/logistics/air-freight'], sources: [ZATCA_AR, ICC_AR],
    },
  },
  '/logistics/exhibition-event-logistics': {
    updatedAt: u,
    en: {
      title: 'Exhibition and event logistics for Saudi Arabia',
      intro: 'Exhibition cargo has fixed dates. Tell us the event, venue and delivery deadline and we coordinate freight, customs and delivery around them, including the return.',
      includes: ['Advance shipment planning against venue deadlines', 'Freight coordination by air, sea or road', 'Temporary import documentation support', 'Delivery and collection scheduling', 'Return freight planning'],
      customers: ['Exhibitors and exhibition organisers', 'Overseas suppliers sending materials for events', 'Event and production companies'],
      process: [{ title: 'Share the event', text: 'Event dates, venue, delivery window and cargo list.' }, { title: 'Plan backwards', text: 'Ship and clearance dates are planned from the delivery deadline.' }, { title: 'Coordinate', text: 'Freight, customs and delivery are coordinated with you and the organiser.' }, { title: 'Return', text: 'Collection and return freight are scheduled after the event.' }],
      documents: ['Exhibitor manual and delivery deadlines', 'Cargo list with dimensions and weights', 'Commercial invoice and packing list', 'Temporary import paperwork or ATA Carnet, where applicable', 'Contacts for the organiser and venue'],
      coverage: coverEn,
      faqs: [{ question: 'How early should I ship?', answer: 'Allow time for freight, customs and venue deadlines. Share your dates and we will advise what to confirm.' }, { question: 'Do you handle on-site work?', answer: 'We coordinate delivery to the venue. Specific on-site services are confirmed in the quotation.' }],
      related: ['/logistics/ata-carnet', '/logistics/air-freight', '/logistics/customs-clearance'], sources: [],
    },
    ar: {
      title: 'لوجستيات المعارض والفعاليات في المملكة العربية السعودية',
      intro: 'لشحنات المعارض مواعيد ثابتة. أخبرنا بالفعالية والموقع وموعد التسليم، وننسق الشحن والجمارك والتسليم حولها، بما في ذلك الإعادة.',
      includes: ['تخطيط مسبق للشحنة وفق مواعيد الموقع', 'تنسيق الشحن جواً أو بحراً أو براً', 'دعم مستندات الاستيراد المؤقت', 'جدولة التسليم والاستلام', 'التخطيط لشحن الإعادة'],
      customers: ['العارضون ومنظمو المعارض', 'الموردون في الخارج الذين يرسلون مواد للفعاليات', 'شركات الفعاليات والإنتاج'],
      process: [{ title: 'شارك الفعالية', text: 'مواعيد الفعالية والموقع ونافذة التسليم وقائمة البضائع.' }, { title: 'خطط من النهاية', text: 'تُحدَّد مواعيد الشحن والتخليص انطلاقاً من موعد التسليم.' }, { title: 'التنسيق', text: 'يُنسَّق الشحن والجمارك والتسليم معك ومع المنظم.' }, { title: 'الإعادة', text: 'يُجدوَل الاستلام وشحن الإعادة بعد الفعالية.' }],
      documents: ['دليل العارض ومواعيد التسليم', 'قائمة البضائع بالأبعاد والأوزان', 'الفاتورة التجارية وقائمة التعبئة', 'مستندات الاستيراد المؤقت أو دفتر ATA Carnet عند انطباقه', 'بيانات التواصل مع المنظم والموقع'],
      coverage: coverAr,
      faqs: [{ question: 'متى يجب أن أشحن؟', answer: 'اترك وقتاً للشحن والجمارك ومواعيد الموقع. شاركنا مواعيدك ونبيّن ما يجب تأكيده.' }, { question: 'هل تتولون العمل في الموقع؟', answer: 'ننسق التسليم إلى الموقع. تُؤكَّد الخدمات المحددة في الموقع ضمن عرض السعر.' }],
      related: ['/logistics/ata-carnet', '/logistics/air-freight', '/logistics/customs-clearance'], sources: [],
    },
  },
  '/logistics/import-export': {
    updatedAt: u,
    en: {
      title: 'Import and export support for Saudi businesses',
      intro: 'Import and export support brings documents, customs and freight together for one shipment. Share what you are buying or selling and where it moves, and the team outlines what needs confirming.',
      includes: ['Documentation review for imports and exports', 'Customs coordination', 'Freight coordination by air, sea or road', 'Guidance on information suppliers and buyers should provide'],
      customers: ['Saudi importers and exporters', 'Businesses starting to trade internationally', 'Companies coordinating several suppliers'],
      process: [{ title: 'Describe the trade', text: 'Goods, parties, origin, destination and Incoterms.' }, { title: 'Assess requirements', text: 'Documents and approvals are reviewed for the shipment.' }, { title: 'Quote and plan', text: 'Scope, freight and clearance steps are set out.' }, { title: 'Move and update', text: 'The shipment is coordinated with updates at key stages.' }],
      documents: ['Commercial invoice and packing list', 'Transport document', 'Certificate of origin, where relevant', 'Licences or approvals required for the goods', 'Supplier and consignee details'],
      coverage: coverEn,
      faqs: [{ question: 'Can you tell me the duty before I order?', answer: 'Duty depends on classification, value and origin. Send the product details and we can discuss what to confirm, without quoting a figure in advance.' }, { question: 'Do you support both imports and exports?', answer: 'Yes, enquiries for both are welcome; scope is confirmed per shipment.' }],
      related: ['/logistics/customs-clearance', '/logistics/freight-forwarding', '/logistics/sea-freight'], sources: [],
    },
    ar: {
      title: 'دعم الاستيراد والتصدير للأعمال السعودية',
      intro: 'يجمع دعم الاستيراد والتصدير المستندات والجمارك والشحن في شحنة واحدة. شاركنا ما تشتريه أو تبيعه ووجهته، ويحدد الفريق ما يلزم تأكيده.',
      includes: ['مراجعة مستندات الاستيراد والتصدير', 'تنسيق الجمارك', 'تنسيق الشحن جواً أو بحراً أو براً', 'إرشاد بشأن المعلومات التي ينبغي أن يقدمها الموردون والمشترون'],
      customers: ['المستوردون والمصدّرون السعوديون', 'الأعمال التي تبدأ التجارة الدولية', 'الشركات التي تنسق بين عدة موردين'],
      process: [{ title: 'صف الصفقة', text: 'البضائع والأطراف والمنشأ والوجهة وشروط الإنكوترمز.' }, { title: 'تقييم المتطلبات', text: 'تُراجَع المستندات والموافقات للشحنة.' }, { title: 'التسعير والتخطيط', text: 'يُوضَّح النطاق وخطوات الشحن والتخليص.' }, { title: 'النقل والتحديث', text: 'تُنسَّق الشحنة مع تحديثات في المراحل الرئيسية.' }],
      documents: ['الفاتورة التجارية وقائمة التعبئة', 'مستند النقل', 'شهادة المنشأ عند الحاجة', 'التراخيص أو الموافقات التي تتطلبها البضاعة', 'بيانات المورد والمستلم'],
      coverage: coverAr,
      faqs: [{ question: 'هل تخبرونني بالرسوم قبل الطلب؟', answer: 'تعتمد الرسوم على التصنيف والقيمة والمنشأ. أرسل بيانات المنتج ونناقش ما يلزم تأكيده دون ذكر رقم مسبقاً.' }, { question: 'هل تدعمون الاستيراد والتصدير معاً؟', answer: 'نعم، نرحب باستفسارات الاثنين، ويُؤكَّد النطاق لكل شحنة.' }],
      related: ['/logistics/customs-clearance', '/logistics/freight-forwarding', '/logistics/sea-freight'], sources: [],
    },
  },
};

export const logisticsContentRoutes = Object.keys(logisticsContent);

// Primary government guidance; shipment-specific requirements still need confirmation.
for (const route of ['/logistics/customs-clearance', '/logistics/import-export'] as const) {
  logisticsContent[route].en.sources.push({ title: 'ZATCA — Import instructions', url: 'https://zatca.gov.sa/en/RulesRegulations/Taxes/Pages/customs-bussiness/import-pages/Import-Instructions.aspx' });
  logisticsContent[route].ar.sources.push({ title: 'هيئة الزكاة والضريبة والجمارك — تعليمات الاستيراد', url: 'https://zatca.gov.sa/en/RulesRegulations/Taxes/Pages/customs-bussiness/import-pages/Import-Instructions.aspx' });
}
