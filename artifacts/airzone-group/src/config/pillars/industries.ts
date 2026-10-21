import { l, type Item, type Link, type PillarPage } from './types';
import { UPDATED } from './customs';

const CUSTOMS: Link = { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') };
const DOCS: Link = { href: '/logistics/customs-documentation', label: l('Documentation & compliance', 'المستندات والامتثال') };
const TRANSPORT: Link = { href: '/logistics/transportation', label: l('Transportation', 'النقل') };
const HEAVY: Link = { href: '/logistics/heavy-transport', label: l('Heavy transport', 'النقل الثقيل') };
const COLD: Link = { href: '/logistics/transportation#temperature', label: l('Temperature-controlled transport', 'النقل المتحكم بحرارته') };
const STORE: Link = { href: '/logistics/warehousing', label: l('Warehousing', 'التخزين') };
const DAYANA: Link = { href: '/logistics/dayana-local-delivery', label: l('Dayana local delivery', 'Dayana للتوصيل المحلي') };
const ATA: Link = { href: '/logistics/ata-carnet', label: l('ATA Carnet & exhibitions', 'دفاتر ATA Carnet والمعارض') };
const GCC: Link = { href: '/logistics/gcc-transportation', label: l('GCC transportation', 'النقل البري الخليجي') };
const EXHIBITION: Link = { href: '/logistics/exhibition-event-logistics', label: l('Exhibition logistics', 'لوجستيات المعارض') };
const AIR: Link = { href: '/logistics/air-freight', label: l('Air freight', 'الشحن الجوي') };
const SEA: Link = { href: '/logistics/sea-freight', label: l('Sea freight', 'الشحن البحري') };
const DESTUFF: Link = { href: '/logistics/container-destuffing', label: l('Container destuffing', 'تفريغ الحاويات') };

const ind = (id: string, en: string, ar: string, needEn: string, needAr: string, helpEn: string, helpAr: string, links: Link[]): Item => ({
  id, title: l(en, ar),
  fields: [{ label: l('The challenge', 'التحدي'), text: l(needEn, needAr) }, { label: l('How we help', 'كيف نساعد'), text: l(helpEn, helpAr) }],
  links,
});

export const industries: PillarPage = {
  path: '/logistics/industries',
  photo: 'containerYard',
  parents: [{ href: '/logistics', label: l('Logistics', 'الخدمات اللوجستية') }],
  crumb: l('Industries', 'القطاعات'),
  eyebrow: l('Airzone Logistics · Industries', 'إيرزون للخدمات اللوجستية · القطاعات'),
  h1: l('Industries we serve across Saudi Arabia and the GCC', 'القطاعات التي نخدمها في المملكة ودول الخليج'),
  lead: l('Each industry moves different cargo under different rules. Find yours to see the customs, transport and storage services that usually fit.', 'لكل قطاع بضائعه وأنظمته. ابحث عن قطاعك لترى خدمات الجمارك والنقل والتخزين التي تناسبه عادةً.'),
  ctas: [{ href: '/logistics/request-quote', label: l('Request a logistics quote', 'اطلب عرض سعر لوجستي'), primary: true }, { href: '/contact', label: l('Speak to our logistics team', 'تحدث إلى فريق الخدمات اللوجستية') }],
  notice: {
    title: l('Specialised goods are assessed first', 'تُقيَّم البضائع المتخصصة أولاً'),
    text: l('Regulated or specialised goods, such as medicines, chemicals or aviation parts, are accepted only after the operational and regulatory requirements are confirmed.', 'لا تُقبل البضائع الخاضعة للتنظيم أو المتخصصة، مثل الأدوية والكيماويات وقطع الطيران، إلا بعد تأكيد المتطلبات التشغيلية والتنظيمية.'),
  },
  sections: [{
    id: 'directory', eyebrow: l('Industry directory', 'دليل القطاعات'),
    title: l('Logistics by industry', 'الخدمات اللوجستية حسب القطاع'),
    blocks: [{ kind: 'cards', columns: 2, items: [
      ind('manufacturing', 'Manufacturing & industrial supply chains', 'التصنيع وسلاسل الإمداد الصناعية', 'Raw materials and components must arrive on time to keep production running, often from overseas suppliers.', 'يجب أن تصل المواد الخام والمكونات في موعدها لاستمرار الإنتاج، وغالباً من موردين في الخارج.', 'Import clearance for inputs and machinery, full truckloads between port, warehouse and plant, and storage for buffer stock.', 'تخليص الواردات من المدخلات والآلات، وشحنات كاملة بين الميناء والمستودع والمصنع، وتخزين المخزون الاحتياطي.', [CUSTOMS, TRANSPORT, STORE]),
      ind('construction', 'Construction & infrastructure', 'البناء والبنية التحتية', 'Heavy, bulky materials and equipment must reach sites with limited access, in the right sequence.', 'يجب أن تصل المواد والمعدات الثقيلة والضخمة إلى مواقع محدودة الوصول وبالتسلسل الصحيح.', 'Flatbed and low-bed transport, oversized-load planning, and customs for imported equipment.', 'النقل بالمقطورات المسطحة والمنخفضة، وتخطيط الحمولات الاستثنائية، والتخليص للمعدات المستوردة.', [HEAVY, TRANSPORT, CUSTOMS]),
      ind('retail', 'Retail & wholesale', 'التجزئة والجملة', 'Stores need frequent, reliable replenishment and space for seasonal peaks.', 'تحتاج المتاجر إلى إعادة تزويد متكررة وموثوقة ومساحات لمواسم الذروة.', 'Warehousing close to market, inter-city truckloads and Dayana store deliveries.', 'تخزين قريب من السوق وشحنات بين المدن وتوصيل المتاجر عبر Dayana.', [STORE, DAYANA, TRANSPORT]),
      ind('fmcg', 'Fast-moving consumer goods', 'السلع الاستهلاكية سريعة الدوران', 'High volumes and short shelf cycles leave little room for delay.', 'الأحجام الكبيرة ودورات البيع القصيرة لا تترك مجالاً للتأخير.', 'Palletised storage, curtain-side full loads and scheduled distribution.', 'تخزين على منصات وشحنات كاملة بمقطورات جانبية الستائر وتوزيع مجدول.', [STORE, TRANSPORT, DAYANA]),
      ind('food', 'Food & beverage', 'الأغذية والمشروبات', 'Imports need SFDA clearance, and many products must stay chilled or frozen throughout.', 'تحتاج الواردات إلى فسح الهيئة العامة للغذاء والدواء، ويجب أن تبقى منتجات كثيرة مبردة أو مجمدة طوال الوقت.', 'SFDA documentation coordination, temperature-controlled storage in four cities and refrigerated transport on request.', 'تنسيق مستندات الهيئة العامة للغذاء والدواء، وتخزين متحكم بحرارته في أربع مدن، ونقل مبرد عند الطلب.', [DOCS, STORE, COLD]),
      ind('automotive', 'Automotive & spare parts', 'السيارات وقطع الغيار', 'Wide parts ranges, conformity requirements and urgent orders for workshops.', 'تنوع كبير في القطع ومتطلبات مطابقة وطلبات عاجلة للورش.', 'SABER conformity coordination, parts storage and fast local delivery.', 'تنسيق مطابقة سابر وتخزين القطع والتوصيل المحلي السريع.', [DOCS, STORE, DAYANA]),
      ind('healthcare', 'Healthcare & pharmaceutical logistics', 'الخدمات اللوجستية للرعاية الصحية والأدوية', 'Products often need licensed importers, SFDA approvals and controlled conditions.', 'تحتاج المنتجات غالباً إلى مستوردين مرخّصين وموافقات الهيئة العامة للغذاء والدواء وظروف متحكم بها.', 'Documentation coordination with eligible importers; transport and storage only where suitable capabilities are confirmed.', 'تنسيق المستندات مع المستوردين المؤهلين، والنقل والتخزين فقط عند تأكيد القدرات المناسبة.', [DOCS, COLD, STORE]),
      ind('electronics', 'Electronics & electrical equipment', 'الإلكترونيات والمعدات الكهربائية', 'SASO, SABER and IECEE requirements apply to many products and must be ready before shipping.', 'تنطبق متطلبات الهيئة السعودية للمواصفات وسابر وIECEE على منتجات كثيرة ويجب تجهيزها قبل الشحن.', 'Conformity documentation coordination, enclosed transport and secure storage.', 'تنسيق مستندات المطابقة والنقل المغلق والتخزين الآمن.', [DOCS, CUSTOMS, STORE]),
      ind('consumer', 'Consumer products', 'المنتجات الاستهلاكية', 'Many consumer goods fall under technical regulations and need labelling checks.', 'تخضع منتجات استهلاكية كثيرة للوائح فنية وتحتاج إلى مراجعة بطاقات البيانات.', 'Compliance checks, import clearance and distribution to retailers.', 'مراجعة الامتثال وتخليص الواردات والتوزيع على متاجر التجزئة.', [DOCS, CUSTOMS, DAYANA]),
      ind('ecommerce', 'E-commerce & distribution', 'التجارة الإلكترونية والتوزيع', 'Orders need fast fulfilment and reliable last-mile delivery.', 'تحتاج الطلبات إلى تنفيذ سريع وتوصيل موثوق للميل الأخير.', 'Storage with picking and packing where available, and Dayana van deliveries.', 'تخزين مع الانتقاء والتعبئة عند التوفر، والتوصيل بعربات Dayana.', [STORE, DAYANA]),
      ind('trade', 'Importers & exporters', 'المستوردون والمصدّرون', 'Documents, classification, approvals and transport have to come together for every shipment.', 'يجب أن تجتمع المستندات والتصنيف والموافقات والنقل لكل شحنة.', 'Import and export clearance, documentation support and connected transport.', 'تخليص الواردات والصادرات ودعم المستندات والنقل المرتبط.', [CUSTOMS, DOCS, AIR, SEA]),
      ind('machinery', 'Heavy machinery & project cargo', 'المعدات الثقيلة وشحنات المشاريع', 'Oversized items need specialised equipment, permits and careful classification.', 'تحتاج القطع الكبيرة إلى معدات متخصصة وتصاريح وتصنيف دقيق.', 'Low-bed and specialised transport, project customs coordination and staging storage.', 'نقل بالمقطورات المنخفضة والمتخصصة، وتنسيق جمارك المشاريع، وتخزين التجهيز.', [HEAVY, SEA, DESTUFF, CUSTOMS]),
      ind('temperature', 'Temperature-sensitive cargo', 'البضائع الحساسة للحرارة', 'A break in temperature control can make goods unsaleable.', 'قد يجعل أي انقطاع في التحكم بالحرارة البضائع غير صالحة للبيع.', 'Temperature-controlled storage and refrigerated transport arranged as one plan.', 'تخزين متحكم بحرارته ونقل مبرد ضمن خطة واحدة.', [COLD, STORE]),
      ind('events', 'Exhibition organisers & trade-show contractors', 'منظمو المعارض ومقاولو المعارض التجارية', 'Many exhibitors’ freight has to reach one venue within fixed delivery slots, then leave again after dismantling.', 'يجب أن تصل شحنات عارضين كثيرين إلى موقع واحد ضمن مواعيد تسليم ثابتة ثم تغادر بعد التفكيك.', 'Venue delivery scheduling, temporary-admission coordination, storage between build-up and dismantling, and return shipments.', 'جدولة التسليم في الموقع وتنسيق الإدخال المؤقت والتخزين بين التجهيز والتفكيك وشحنات العودة.', [EXHIBITION, ATA, STORE]),
      ind('event-production', 'Event production & AV rental companies', 'شركات إنتاج الفعاليات وتأجير معدات الصوت والمرئيات', 'High-value kits move in and out of the Kingdom on short turnarounds, and every case must come back.', 'تتنقل معدات عالية القيمة من المملكة وإليها في مهل قصيرة، ويجب أن يعود كل صندوق.', 'Air freight for tight schedules, serial-numbered goods lists, ATA Carnet coordination and road delivery to venues.', 'شحن جوي للجداول الضيقة وقوائم بضائع بالأرقام التسلسلية وتنسيق دفاتر ATA Carnet والتوصيل البري إلى المواقع.', [EXHIBITION, AIR, ATA]),
      ind('stage-led', 'Stage, lighting & LED screen suppliers', 'موردو المسارح والإضاءة وشاشات LED', 'Fragile, heavy-for-size equipment such as LED panels, moving heads and truss needs careful packing and complete inventories.', 'تحتاج المعدات القابلة للكسر والثقيلة قياساً بحجمها، مثل ألواح LED والأضواء المتحركة والجمالونات، إلى تغليف دقيق وجرد كامل.', 'Flight-cased air or sea freight, flatbed and curtain-side transport for structures, and storage between events where available.', 'شحن جوي أو بحري في صناديق النقل، ونقل الهياكل بمقطورات مسطحة أو ستائرية، وتخزين بين الفعاليات حيث يتوفر.', [EXHIBITION, SEA, HEAVY]),
      ind('exhibitors', 'International exhibitors & manufacturers', 'العارضون الدوليون والمصنّعون', 'Showing products in Saudi Arabia means some goods return, while samples and sold items stay and need permanent import.', 'عرض المنتجات في المملكة يعني أن بعض البضائع تعود، بينما تبقى العينات والبضائع المبيعة وتحتاج إلى استيراد نهائي.', 'Goods split by customs procedure, conformity checks for items that stay, and freight timed to the build-up date.', 'فصل البضائع حسب الإجراء الجمركي ومراجعة المطابقة لما يبقى منها وتوقيت الشحن وفق موعد التجهيز.', [EXHIBITION, CUSTOMS, AIR]),
      ind('conferences', 'Conference & corporate-event organisers', 'منظمو المؤتمرات وفعاليات الشركات', 'Equipment, printed materials and furniture must arrive together, on time, often at hotels or venues with limited access.', 'يجب أن تصل المعدات والمطبوعات والأثاث معاً وفي موعدها، وغالباً إلى فنادق أو مواقع محدودة الوصول.', 'Consolidated delivery planning, short-term storage and Dayana van deliveries within cities.', 'تخطيط تسليم مجمّع وتخزين قصير المدى وتوصيل بالشاحنات الصغيرة عبر Dayana داخل المدن.', [EXHIBITION, STORE, DAYANA]),
      ind('industrial-suppliers', 'Industrial equipment suppliers', 'موردو المعدات الصناعية', 'Machinery for demonstrations, trials or customer sites may be sold, returned or installed, each with a different procedure.', 'قد تُباع الآلات المستخدمة في العروض أو التجارب أو مواقع العملاء أو تُعاد أو تُركَّب، ولكل حالة إجراء مختلف.', 'Sea freight and container destuffing, heavy transport to site and customs coordination for each outcome.', 'شحن بحري وتفريغ للحاويات ونقل ثقيل إلى الموقع وتنسيق جمركي لكل حالة.', [SEA, DESTUFF, HEAVY]),
    ] }],
  }],
  faqs: [
    { q: l('My industry is not listed. Can you still help?', 'قطاعي غير مدرج، فهل يمكنكم المساعدة؟'), a: l('Very likely. Send a description of the goods and the movement you need, and the team will confirm what can be arranged.', 'على الأرجح نعم. أرسل وصف البضائع والحركة التي تحتاجها، وسيؤكد الفريق ما يمكن ترتيبه.') },
    { q: l('Can one quote cover customs, transport and storage?', 'هل يمكن أن يغطي عرض سعر واحد الجمارك والنقل والتخزين؟'), a: l('Yes. Describe the full movement and the quotation can bring the services together under one plan.', 'نعم. صف الحركة كاملة ويمكن أن يجمع عرض السعر الخدمات ضمن خطة واحدة.') },
  ],
  related: [
    { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') },
    { href: '/logistics/transportation', label: l('Transportation', 'النقل') },
    { href: '/logistics/warehousing', label: l('Warehousing', 'التخزين') },
  ],
  seo: {
    title: l('Logistics by Industry in Saudi Arabia | Airzone Logistics', 'الخدمات اللوجستية حسب القطاع في السعودية | إيرزون'),
    description: l('Customs clearance, transport and warehousing for manufacturing, construction, retail, food, automotive, healthcare, electronics, events and project cargo.', 'التخليص الجمركي والنقل والتخزين لقطاعات التصنيع والبناء والتجزئة والأغذية والسيارات والرعاية الصحية والإلكترونيات والمعارض وشحنات المشاريع.'),
  },
  updated: UPDATED,
};
