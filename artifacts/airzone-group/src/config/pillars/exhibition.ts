import { l, type Field, type Item, type Link, type PillarPage } from './types';
import { OFFICIAL, UPDATED } from './customs';

/**
 * Exhibition, trade show & event logistics (flagship specialist page),
 * connected to customs clearance and ATA Carnet.
 *
 * Official facts checked October 2026: ZATCA began accepting ATA Carnets at
 * land, sea and air customs ports on 2 June 2024 (Istanbul Convention; Council
 * of Saudi Chambers as guarantor); ZATCA's Event Disclosure e-service lets
 * importers notify an event or exhibition in advance. No venue access,
 * organiser approval, release date or delivery window is guaranteed, and no
 * goods are assumed to qualify for temporary admission.
 */
export const EVENT_SOURCES = {
  eventDisclosure: 'https://zatca.gov.sa/en/eServices/Pages/eServices-273.aspx',
  ataNews: 'https://zatca.gov.sa/en/MediaCenter/News/Pages/news-1245.aspx',
  cst: 'https://www.cst.gov.sa/en/',
};

const QUOTE = '#exhibition-quote';
const CUSTOMS: Link = { href: '/logistics/customs-clearance', label: l('Customs clearance', 'التخليص الجمركي') };
const ATA: Link = { href: '/logistics/ata-carnet', label: l('ATA Carnet assistance', 'المساعدة في دفاتر ATA Carnet') };
const AIR: Link = { href: '/logistics/air-freight', label: l('Air freight', 'الشحن الجوي') };
const SEA: Link = { href: '/logistics/sea-freight', label: l('Sea freight', 'الشحن البحري') };
const TRANSPORT: Link = { href: '/logistics/transportation', label: l('Transportation', 'النقل') };
const HEAVY: Link = { href: '/logistics/heavy-transport', label: l('Heavy transport', 'النقل الثقيل') };
const STORE: Link = { href: '/logistics/warehousing', label: l('Warehousing', 'التخزين') };
const DESTUFF: Link = { href: '/logistics/container-destuffing', label: l('Container destuffing', 'تفريغ الحاويات') };
const DAYANA: Link = { href: '/logistics/dayana-local-delivery', label: l('Dayana local delivery', 'Dayana للتوصيل المحلي') };
const COLD: Link = { href: '/logistics/transportation#temperature', label: l('Temperature-controlled transport', 'النقل المتحكم بحرارته') };

const LBL = {
  modes: l('Transport modes', 'وسائل النقل'),
  packing: l('Protective packing', 'التغليف الواقي'),
  ident: l('Cargo identification', 'تعريف البضائع'),
  temp: l('Temporary admission', 'الإدخال المؤقت'),
  store: l('Storage and onward delivery', 'التخزين والتوصيل'),
};
const fields = (m: [string, string], p: [string, string], i: [string, string], t: [string, string], s: [string, string]): Field[] => [
  { label: LBL.modes, text: l(...m) }, { label: LBL.packing, text: l(...p) }, { label: LBL.ident, text: l(...i) },
  { label: LBL.temp, text: l(...t) }, { label: LBL.store, text: l(...s) },
];
const quoteFor = (equipment: string): Link => ({ href: QUOTE, label: l('Request a quote for this equipment', 'اطلب عرض سعر لهذه المعدات'), preset: { equipment } });
const pts = (list: [string, string][]) => list.map(([en, ar]) => l(en, ar));
const card = (id: string, en: string, ar: string, ten: string, tar: string, links?: Link[]): Item => ({ id, title: l(en, ar), text: l(ten, tar), links });

export const exhibitionLogistics: PillarPage = {
  path: '/logistics/exhibition-event-logistics',
  photo: 'exhibitionStand',
  parents: [{ href: '/logistics', label: l('Logistics', 'الخدمات اللوجستية') }],
  crumb: l('Exhibition & event logistics', 'لوجستيات المعارض والفعاليات'),
  eyebrow: l('Airzone Logistics · Exhibitions & events', 'إيرزون للخدمات اللوجستية · المعارض والفعاليات'),
  h1: l('Exhibition, trade show & event logistics in Saudi Arabia', 'الخدمات اللوجستية للمعارض والمعارض التجارية والفعاليات في المملكة العربية السعودية'),
  lead: l(
    'From your supplier’s door to the stand and back again: air and sea freight, customs and temporary admission, road delivery to the venue, storage and re-export for exhibitions, trade fairs, conferences, product launches and corporate events.',
    'من باب المورد إلى الجناح ثم العودة: شحن جوي وبحري، وتخليص جمركي وإدخال مؤقت، وتوصيل بري إلى موقع الفعالية، وتخزين وإعادة تصدير للمعارض والمعارض التجارية والمؤتمرات وإطلاق المنتجات وفعاليات الشركات.',
  ),
  ctas: [{ href: QUOTE, label: l('Request an exhibition logistics quote', 'اطلب عرض سعر للوجستيات المعرض'), primary: true }, ATA],
  notice: {
    title: l('Event dates are fixed. Approvals are not automatic.', 'مواعيد الفعاليات ثابتة، والموافقات ليست تلقائية'),
    text: l(
      'Venue access, organiser approvals, customs release and delivery windows depend on the venue, the organiser and the authorities. We plan around your build-up and dismantling dates and confirm each step rather than guarantee it. Temporary admission and ATA Carnet treatment depend on the goods and how they are used.',
      'يعتمد الدخول إلى موقع الفعالية وموافقات الجهة المنظمة والفسح الجمركي ومواعيد التسليم على الموقع والجهة المنظمة والجهات الحكومية. نخطط وفق مواعيد التجهيز والتفكيك لديك ونؤكد كل خطوة دون أن نضمنها. ويعتمد الإدخال المؤقت ومعاملة دفتر ATA Carnet على نوع البضائع وطريقة استخدامها.',
    ),
  },
  sections: [
    {
      id: 'services', eyebrow: l('Exhibition logistics services', 'خدمات لوجستيات المعارض'),
      title: l('The complete cargo journey for your event', 'رحلة الشحنة كاملة لفعاليتك'),
      text: l('Event schedules rarely move, so pre-arrival documents, venue coordination and the return shipment are planned before the cargo leaves its origin.', 'نادراً ما تتغير مواعيد الفعاليات، لذا نخطط للمستندات قبل الوصول والتنسيق مع الموقع وشحنة العودة قبل أن تغادر البضائع بلد المنشأ.'),
      blocks: [{ kind: 'groups', items: [
        { id: 'freight', title: l('Freight in and out', 'الشحن ذهاباً وإياباً'), points: pts([
          ['Inbound exhibition cargo', 'شحنات المعارض الواردة'], ['Outbound exhibition cargo', 'شحنات المعارض الصادرة'],
          ['Air freight for urgent event cargo', 'الشحن الجوي للشحنات العاجلة'], ['Sea freight for larger shipments', 'الشحن البحري للشحنات الكبيرة']]),
          links: [AIR, SEA] },
        { id: 'customs', title: l('Customs and temporary admission', 'الجمارك والإدخال المؤقت'), points: pts([
          ['Temporary import coordination', 'تنسيق الإدخال المؤقت'], ['ATA Carnet assistance for eligible shipments', 'المساعدة في دفاتر ATA Carnet للشحنات المؤهلة'],
          ['Exhibition customs clearance coordination', 'تنسيق التخليص الجمركي للمعارض'], ['Re-export documentation', 'مستندات إعادة التصدير']]),
          links: [ATA, CUSTOMS] },
        { id: 'venue', title: l('To and at the venue', 'إلى الموقع وفيه'), points: pts([
          ['Road transportation to exhibition venues', 'النقل البري إلى مواقع المعارض'], ['Collection and delivery scheduling', 'جدولة الاستلام والتوصيل'],
          ['Venue delivery coordination with organisers and contractors, where available', 'تنسيق التسليم مع المنظمين والمقاولين حيث يتوفر'], ['Booth and stand material transportation', 'نقل مواد الأجنحة والبوثات']]),
          links: [TRANSPORT] },
        { id: 'after', title: l('During and after the event', 'أثناء الفعالية وبعدها'), points: pts([
          ['Equipment handling and temporary storage, where available', 'مناولة المعدات والتخزين المؤقت حيث يتوفر'], ['Post-event dismantling logistics coordination', 'تنسيق لوجستيات ما بعد التفكيك'],
          ['Return shipments and re-export planning', 'شحنات العودة والتخطيط لإعادة التصدير'], ['Empty-case storage during the show', 'تخزين الصناديق الفارغة أثناء المعرض']]),
          links: [STORE] },
      ] }],
    },
    {
      id: 'planning', eyebrow: l('Why plan early', 'لماذا التخطيط المبكر'), tone: 'surface',
      title: l('Three things that decide whether cargo arrives in time', 'ثلاثة أمور تحدد وصول البضائع في موعدها'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        card('fixed-dates', 'Fixed build-up dates', 'مواعيد تجهيز ثابتة', 'Organisers set delivery slots and build-up days. Cargo that misses them may not be accepted at the venue until later, so freight is planned backwards from the slot.', 'تحدد الجهات المنظمة مواعيد التسليم وأيام التجهيز، وقد لا تُقبل البضائع التي تفوتها إلا لاحقاً، لذلك نخطط للشحن عكسياً بدءاً من موعد التسليم.'),
        card('pre-arrival', 'Pre-arrival documentation', 'مستندات ما قبل الوصول', 'A complete goods list with serial numbers, quantities and values, the carnet or declaration, and any event disclosure or approvals, ready before the goods arrive.', 'قائمة بضائع كاملة بالأرقام التسلسلية والكميات والقيم، والدفتر أو البيان الجمركي، وأي إفصاح عن الفعالية أو موافقات، جاهزة قبل وصول البضائع.'),
        card('return', 'Return planning', 'التخطيط للعودة', 'Goods admitted temporarily must leave within the permitted period. Items sold, given away or left behind are imported permanently, so they are identified before shipping.', 'يجب أن تغادر البضائع المُدخلة مؤقتاً خلال المدة المسموح بها. أما ما يُباع أو يُوزَّع أو يُترك فيُستورد استيراداً نهائياً، لذا يُحدَّد قبل الشحن.'),
      ] }],
    },
    {
      id: 'equipment', eyebrow: l('Exhibition equipment directory', 'دليل معدات المعارض'),
      title: l('How we handle each type of exhibition cargo', 'كيف نتعامل مع كل نوع من شحنات المعارض'),
      text: l('Each category travels differently. Use the directory to see the usual transport modes, packing, identification, temporary-admission points and storage for your equipment.', 'لكل فئة طريقة نقل مختلفة. استخدم الدليل لمعرفة وسائل النقل المعتادة والتغليف والتعريف ونقاط الإدخال المؤقت والتخزين لمعداتك.'),
      note: l('Not every item qualifies for ATA Carnet treatment or temporary admission. Batteries, wireless devices, controlled technology and other regulated goods may need additional documents or approvals, or may be restricted.', 'لا تتأهل كل القطع لمعاملة دفتر ATA Carnet أو الإدخال المؤقت. وقد تحتاج البطاريات والأجهزة اللاسلكية والتقنيات الخاضعة للرقابة وغيرها من البضائع المنظمة إلى مستندات أو موافقات إضافية، أو قد تكون مقيدة.'),
      blocks: [{ kind: 'rows', items: [
        { id: 'displays', photo: 'customStand', tag: l('Category A', 'الفئة A'), title: l('Custom exhibition displays and booth materials', 'أجنحة العرض المخصصة ومواد البوث'),
          text: l('Stand structures and graphics are bulky, finished to a design and needed on site at the very start of build-up.', 'هياكل الأجنحة والجرافيك ضخمة ومنفذة وفق تصميم محدد، وتُطلب في الموقع منذ بداية التجهيز.'),
          points: pts([['Custom display structures and booth components', 'هياكل العرض المخصصة ومكونات البوث'], ['Modular systems and portable stands', 'الأنظمة المعيارية والأجنحة المتنقلة'], ['Display panels, backdrops and graphics', 'ألواح العرض والخلفيات والجرافيك'], ['Counters, presentation units and demonstration stands', 'الطاولات ووحدات العرض ومنصات التجربة']]),
          fields: fields(
            ['Sea freight for large stand builds planned early; air for late graphics or replacements; road to the venue.', 'شحن بحري للأجنحة الكبيرة المخطط لها مبكراً، وجوي للجرافيك المتأخر أو البدائل، ثم نقل بري إلى الموقع.'],
            ['Crates or stillages for panels, edge protection for finished surfaces, graphics kept flat or rolled and dry.', 'صناديق أو حوامل للألواح، وحماية لحواف الأسطح النهائية، وجرافيك مسطح أو ملفوف وجاف.'],
            ['Every crate numbered and marked with stand number, hall and exhibitor name, matching the packing list.', 'ترقيم كل صندوق ووسمه برقم الجناح والقاعة واسم العارض بما يطابق قائمة التعبئة.'],
            ['Reusable stand materials that leave after the event may qualify; consumables and items left behind usually do not.', 'قد تتأهل مواد الأجنحة القابلة لإعادة الاستخدام التي تغادر بعد الفعالية، بينما لا تتأهل عادةً المواد المستهلكة وما يُترك.'],
            ['Short-term storage before build-up where available, then delivery in the organiser’s slot.', 'تخزين قصير قبل التجهيز حيث يتوفر، ثم التسليم في الموعد الذي تحدده الجهة المنظمة.']),
          links: [quoteFor('displays')] },
        { id: 'led-screens', photo: 'ledPixels', tag: l('Category B', 'الفئة B'), title: l('LED screens and display technology', 'شاشات LED وتقنيات العرض'),
          text: l('LED panels and screens are heavy for their size, fragile at the edges and high in value, so packing and paperwork both matter.', 'ألواح وشاشات LED ثقيلة قياساً بحجمها وحوافها قابلة للكسر وقيمتها عالية، لذا يهم التغليف والمستندات معاً.'),
          points: pts([['LED display panels and video walls', 'ألواح عرض LED والجدران المرئية'], ['Digital signage and large-format screens', 'اللافتات الرقمية والشاشات الكبيرة'], ['Monitors, presentation and interactive displays', 'الشاشات وشاشات العرض والشاشات التفاعلية'], ['Projectors, controllers and supporting electronics', 'أجهزة العرض والمتحكمات والإلكترونيات المساندة']]),
          fields: fields(
            ['Air for urgent or compact systems; sea for larger walls shipped early; carefully secured road transport to the venue.', 'جوي للأنظمة العاجلة أو الصغيرة، وبحري للجدران الكبيرة المشحونة مبكراً، ونقل بري مؤمَّن بعناية إلى الموقع.'],
            ['Manufacturer road cases or foam-lined flight cases, with panels and screens kept in their designed orientation.', 'صناديق المصنّع أو صناديق نقل مبطنة بالإسفنج، مع إبقاء الألواح والشاشات في الوضع المصمم لها.'],
            ['Serial numbers of panels, processors and screens listed individually, as carnet and customs lists require.', 'إدراج الأرقام التسلسلية للألواح والمعالجات والشاشات كلٌ على حدة كما تتطلب قوائم الدفتر والجمارك.'],
            ['Often moved as professional equipment for temporary use; displays and electronics may also face product-conformity requirements, which are checked first.', 'تُنقل غالباً كمعدات مهنية للاستخدام المؤقت، وقد تخضع الشاشات والإلكترونيات أيضاً لمتطلبات مطابقة المنتجات، وتُراجَع أولاً.'],
            ['Stored dry and away from heat; delivered close to installation time where the organiser allows.', 'تُخزَّن في مكان جاف بعيداً عن الحرارة، وتُسلَّم قرب موعد التركيب حيث تسمح الجهة المنظمة.']),
          links: [quoteFor('led'), AIR] },
        { id: 'audio-visual', photo: 'mixingConsole', tag: l('Category C', 'الفئة C'), title: l('Sound and audiovisual equipment', 'معدات الصوت والمرئيات'),
          text: l('AV kits arrive as many cased items that must all come back, often on tight turnarounds between events.', 'تصل معدات الصوت والمرئيات في صناديق كثيرة يجب أن تعود جميعها، وغالباً بين فعاليات متقاربة.'),
          points: pts([['Professional sound systems and loudspeakers', 'أنظمة الصوت الاحترافية ومكبرات الصوت'], ['Amplifiers, audio mixers and processors', 'المضخمات وطاولات المزج ومعالجات الصوت'], ['Microphones and wireless audio equipment', 'الميكروفونات ومعدات الصوت اللاسلكية'], ['Conference audio, video switching and AV control systems', 'صوتيات المؤتمرات وأنظمة تبديل الفيديو والتحكم']]),
          fields: fields(
            ['Usually flight-cased by air or road; large PA systems by sea when time allows.', 'غالباً في صناديق نقل جواً أو براً، وأنظمة الصوت الكبيرة بحراً إذا سمح الوقت.'],
            ['Flight cases with foam inserts; racks secured; cables and accessories packed and listed.', 'صناديق نقل بحشوات إسفنجية، وتثبيت الحوامل، وتعبئة الكابلات والملحقات وإدراجها.'],
            ['Case-by-case inventory with serial numbers; case labels match the list.', 'جرد لكل صندوق بالأرقام التسلسلية، مع ملصقات صناديق مطابقة للقائمة.'],
            ['Wireless microphones and other radio equipment may need approval or frequency authorisation from the Communications, Space & Technology Commission, separate from customs.', 'قد تحتاج الميكروفونات اللاسلكية وأجهزة الراديو الأخرى إلى موافقة أو ترخيص ترددات من هيئة الاتصالات والفضاء والتقنية، بشكل منفصل عن الجمارك.'],
            ['Electronics stored indoors; empty cases held during the event where available.', 'تخزين الإلكترونيات داخل مستودع مغلق، وحفظ الصناديق الفارغة أثناء الفعالية حيث يتوفر.']),
          links: [quoteFor('av')] },
        { id: 'lighting', photo: 'movingHeads', tag: l('Category D', 'الفئة D'), title: l('Exhibition lighting', 'إضاءة المعارض'),
          text: l('Lighting fixtures are precise, motorised and easily damaged if they travel unlocked or unprotected.', 'أجهزة الإضاءة دقيقة ومزودة بمحركات وتتضرر بسهولة إذا نُقلت دون تثبيت أو حماية.'),
          points: pts([['Stage lighting and LED fixtures', 'إضاءة المسارح ووحدات LED'], ['Spotlights, floodlights and moving heads', 'الكشافات والأضواء الغامرة والأضواء المتحركة'], ['Lighting controllers, consoles and DMX equipment', 'متحكمات الإضاءة وطاولاتها ومعدات DMX'], ['Truss-mounted lighting equipment', 'معدات الإضاءة المثبتة على الجمالونات']]),
          fields: fields(
            ['Road cases by air or sea depending on volume and lead time; road delivery to the venue.', 'صناديق نقل جواً أو بحراً بحسب الحجم والمهلة، ثم توصيل بري إلى الموقع.'],
            ['Moving heads locked and cased; lenses protected; consoles in dedicated cases.', 'تثبيت الأضواء المتحركة ووضعها في صناديق، وحماية العدسات، وطاولات التحكم في صناديق مخصصة.'],
            ['Fixture counts and serial numbers per case.', 'عدد الوحدات والأرقام التسلسلية لكل صندوق.'],
            ['Generally used as professional equipment that returns; electrical items that stay in the Kingdom face product requirements.', 'تُستخدم عادةً كمعدات مهنية تعود بعد الفعالية، أما الأجهزة الكهربائية التي تبقى في المملكة فتخضع لمتطلبات المنتجات.'],
            ['Indoor storage; delivered together with truss and rigging for build-up.', 'تخزين داخلي، والتسليم مع الجمالونات ومعدات التعليق للتجهيز.']),
          links: [quoteFor('lighting')] },
        { id: 'staging', photo: 'trussTower', tag: l('Category E', 'الفئة E'), title: l('Stage, truss and structural equipment', 'المسارح والجمالونات والمعدات الإنشائية'),
          text: l('Structures are long and bulky rather than heavy, and must arrive complete with every clamp and fixing.', 'الهياكل طويلة وضخمة أكثر من كونها ثقيلة، ويجب أن تصل كاملة بكل مشابكها وقطع تثبيتها.'),
          points: pts([['Exhibition trusses and display support structures', 'جمالونات المعارض وهياكل دعم العرض'], ['Stage components and modular staging', 'مكونات المسارح والمسارح المعيارية'], ['Rigging-related equipment, subject to handling requirements', 'معدات التعليق بحسب متطلبات المناولة'], ['Temporary event infrastructure, booth framework and assembly materials', 'البنية المؤقتة للفعاليات وهياكل البوث ومواد التركيب']]),
          fields: fields(
            ['Sea freight or road for volume; flatbed or curtain-side trailers to the venue.', 'شحن بحري أو بري للأحجام الكبيرة، ومقطورات مسطحة أو ستائرية إلى الموقع.'],
            ['Truss sections on dollies or in stillages; clamps and fixings boxed and counted.', 'أجزاء الجمالونات على عربات أو حوامل، والمشابك وقطع التثبيت في صناديق معدودة.'],
            ['Section counts and lengths on the packing list; load certificates kept with the shipment if the venue asks for them.', 'عدد الأجزاء وأطوالها في قائمة التعبئة، مع إرفاق شهادات التحميل بالشحنة إذا طلبها الموقع.'],
            ['Usually professional equipment that returns; consumable fixings left behind are imported permanently.', 'معدات مهنية تعود عادةً، أما قطع التثبيت المستهلكة التي تُترك فتُستورد استيراداً نهائياً.'],
            ['Indoor or yard storage depending on the material; delivery sequenced for build-up.', 'تخزين داخلي أو في ساحة بحسب المادة، مع ترتيب التسليم وفق تسلسل التجهيز.']),
          links: [quoteFor('staging'), HEAVY] },
        { id: 'it-equipment', photo: 'interactiveWall', tag: l('Category F', 'الفئة F'), title: l('Computers, networking and interactive technology', 'الحواسيب والشبكات والتقنيات التفاعلية'),
          text: l('Compact, high in value and often battery-powered, this equipment needs secure handling and careful documentation.', 'معدات صغيرة الحجم عالية القيمة وغالباً تعمل بالبطاريات، وتحتاج إلى مناولة آمنة وتوثيق دقيق.'),
          points: pts([['Computers, laptops and servers', 'الحواسيب والحواسيب المحمولة والخوادم'], ['Networking equipment and control systems', 'معدات الشبكات وأنظمة التحكم'], ['Interactive kiosks and touchscreens', 'الأكشاك التفاعلية والشاشات اللمسية'], ['Demonstration, VR and AR equipment', 'معدات العرض والواقع الافتراضي والمعزز']]),
          fields: fields(
            ['Air freight is common for compact, high-value equipment; secure road delivery to the venue.', 'الشحن الجوي شائع للمعدات الصغيرة عالية القيمة، مع توصيل بري آمن إلى الموقع.'],
            ['Original or padded cases; data backed up before shipping.', 'الصناديق الأصلية أو المبطنة، مع نسخ احتياطي للبيانات قبل الشحن.'],
            ['Model and serial numbers listed; batteries declared.', 'إدراج الطرازات والأرقام التسلسلية والإقرار بالبطاريات.'],
            ['Lithium batteries have transport rules, and equipment with encryption, wireless functions or other controlled technology may need further documents or approvals.', 'لبطاريات الليثيوم قواعد نقل خاصة، وقد تحتاج المعدات ذات التشفير أو الخصائص اللاسلكية أو التقنيات الخاضعة للرقابة إلى مستندات أو موافقات إضافية.'],
            ['Secure indoor storage; delivered close to the event.', 'تخزين داخلي آمن، والتسليم قرب موعد الفعالية.']),
          links: [quoteFor('it')] },
        { id: 'samples', photo: 'productDemoStand', tag: l('Category G', 'الفئة G'), title: l('Product samples and demonstration units', 'عينات المنتجات ووحدات العرض التجريبي'),
          text: l('The key question is what returns and what stays, because that decides the customs procedure for each item.', 'السؤال الأهم هو ما الذي سيعود وما الذي سيبقى، لأنه يحدد الإجراء الجمركي لكل قطعة.'),
          points: pts([['Commercial samples and product-launch displays', 'العينات التجارية ومعروضات إطلاق المنتجات'], ['Demonstration machinery and prototype equipment', 'الآلات التجريبية والنماذج الأولية'], ['Promotional materials, catalogues and presentation materials', 'المواد الترويجية والكتالوجات ومواد العرض'], ['Eligible professional equipment', 'المعدات المهنية المؤهلة']]),
          fields: fields(
            ['Air for samples and prototypes; sea or road for demonstration machinery.', 'جوي للعينات والنماذج، وبحري أو بري للآلات التجريبية.'],
            ['Machinery crated with lifting points marked; display stock protected in its retail packaging.', 'تعبئة الآلات في صناديق مع تحديد نقاط الرفع، وحماية بضائع العرض في عبواتها.'],
            ['Goods that will return listed separately from goods to be handed out, sold or consumed.', 'إدراج البضائع العائدة منفصلة عن البضائع التي ستُوزَّع أو تُباع أو تُستهلك.'],
            ['Samples and demonstration goods can qualify when they leave again; giveaways, consumed samples and sold items are imported permanently, with duties, taxes and product requirements applying.', 'قد تتأهل العينات وبضائع العرض إذا غادرت مجدداً، أما الهدايا والعينات المستهلكة والبضائع المبيعة فتُستورد استيراداً نهائياً وتنطبق عليها الرسوم والضرائب ومتطلبات المنتجات.'],
            ['Storage near the venue where available; handling for machinery confirmed in advance.', 'تخزين قرب الموقع حيث يتوفر، وتأكيد مناولة الآلات مسبقاً.']),
          links: [quoteFor('samples'), ATA] },
        { id: 'furniture', photo: 'flightCases', tag: l('Category H', 'الفئة H'), title: l('Event furniture and accessories', 'أثاث الفعاليات وملحقاتها'),
          text: l('Furniture and accessories add volume rather than weight, and their empty cases need somewhere to wait until the return.', 'يزيد الأثاث والملحقات الحجم أكثر من الوزن، وتحتاج صناديقها الفارغة إلى مكان تنتظر فيه حتى العودة.'),
          points: pts([['Display tables, exhibition counters, chairs and furniture', 'طاولات العرض وكاونترات المعارض والكراسي والأثاث'], ['Shelving, product stands and presentation furniture', 'الأرفف وحوامل المنتجات وأثاث العرض'], ['Carpeting and decorative materials', 'السجاد ومواد الديكور'], ['Packaging, cases, crates and protective transport materials', 'مواد التغليف والصناديق والحاويات الخشبية ومواد الحماية']]),
          fields: fields(
            ['Sea or road for volume, consolidated with the stand build where possible.', 'بحري أو بري للأحجام الكبيرة، مع تجميعها مع مواد الجناح حيث أمكن.'],
            ['Furniture blanket-wrapped or crated; carpets rolled and wrapped.', 'تغليف الأثاث بالبطانيات أو الصناديق، ولف السجاد وتغليفه.'],
            ['Pieces counted per crate; empty cases labelled by stand.', 'عدّ القطع في كل صندوق، ووسم الصناديق الفارغة باسم الجناح.'],
            ['Reusable furniture and cases that return can qualify; carpets and decorations left behind are permanent imports.', 'قد يتأهل الأثاث والصناديق القابلة لإعادة الاستخدام التي تعود، أما السجاد والديكورات المتروكة فتُعد استيراداً نهائياً.'],
            ['Empty cases stored during the event where available, then returned for repacking.', 'تخزين الصناديق الفارغة أثناء الفعالية حيث يتوفر، ثم إعادتها لإعادة التعبئة.']),
          links: [quoteFor('furniture')] },
      ] }],
    },
    {
      id: 'ata', eyebrow: l('ATA Carnet and temporary import', 'دفاتر ATA Carnet والإدخال المؤقت'), tone: 'surface',
      title: l('Temporary import coordination, connected to customs', 'تنسيق الإدخال المؤقت بالتكامل مع الجمارك'),
      text: l('ZATCA began accepting ATA Carnets at its land, sea and air customs ports on 2 June 2024, under the Istanbul Convention on Temporary Admission, with the Council of Saudi Chambers approved as guarantor. A carnet can make temporary admission of eligible goods simpler, but eligibility, pre-arrival procedures, guarantees and documents still depend on the goods and their use.', 'بدأت هيئة الزكاة والضريبة والجمارك قبول دفاتر الإدخال المؤقت ATA Carnet في منافذها البرية والبحرية والجوية في 2 يونيو 2024، ضمن اتفاقية إسطنبول للإدخال المؤقت، مع اعتماد مجلس الغرف السعودية ضامناً. ويمكن للدفتر تيسير الإدخال المؤقت للبضائع المؤهلة، لكن التأهل وإجراءات ما قبل الوصول والضمانات والمستندات تبقى مرتبطة بنوع البضائع واستخدامها.'),
      blocks: [
        { kind: 'cards', columns: 3, items: [
          card('carnet-review', 'ATA Carnet document review', 'مراجعة مستند دفتر ATA Carnet', 'The carnet’s general list is checked against the actual goods before they ship.', 'مطابقة القائمة العامة في الدفتر مع البضائع الفعلية قبل شحنها.'),
          card('eligibility', 'Preliminary eligibility assessment', 'تقييم أولي للتأهل', 'Goods and their intended use are reviewed against the temporary-admission route.', 'مراجعة البضائع والغرض من استخدامها وفق مسار الإدخال المؤقت.'),
          card('ta-planning', 'Temporary-admission planning', 'التخطيط للإدخال المؤقت', 'Arrival, use and exit dates mapped against the permitted period.', 'مواءمة مواعيد الوصول والاستخدام والخروج مع المدة المسموح بها.'),
          card('goods-list', 'Goods lists, serial numbers, quantities and values', 'قوائم البضائع والأرقام التسلسلية والكميات والقيم', 'Lists prepared so every item can be identified at entry and again at exit.', 'تجهيز القوائم ليمكن التعرف على كل قطعة عند الدخول ومرة أخرى عند الخروج.'),
          card('inbound', 'Inbound customs coordination', 'تنسيق الجمارك عند الدخول', 'The importer’s pre-approval request on ZATCA’s ATA Carnet service and the entry procedure are coordinated.', 'تنسيق طلب الموافقة المسبقة الذي يقدمه المستورد عبر خدمة دفاتر ATA Carnet لدى الهيئة وإجراءات الدخول.'),
          card('delivery', 'Exhibition delivery planning', 'التخطيط للتسليم في المعرض', 'Release, transport and the organiser’s delivery slot planned as one sequence.', 'التخطيط للفسح والنقل وموعد التسليم لدى المنظم كسلسلة واحدة.'),
          card('tracking', 'Cargo tracking and return planning', 'متابعة الشحنة والتخطيط للعودة', 'Shipment status shared at each stage where supported, with the return booked early.', 'مشاركة حالة الشحنة في كل مرحلة حيث يتاح ذلك، مع حجز العودة مبكراً.'),
          card('reexport', 'Re-export documentation', 'مستندات إعادة التصدير', 'Exit documents coordinated so the carnet can be discharged when the goods leave.', 'تنسيق مستندات الخروج ليُبرأ الدفتر عند مغادرة البضائع.'),
          card('entry-exit', 'Entry and exit procedures', 'إجراءات الدخول والخروج', 'The applicable customs procedures at entry and exit coordinated with the importer or a licensed broker.', 'تنسيق الإجراءات الجمركية المطبقة عند الدخول والخروج مع المستورد أو مخلّص مرخّص.'),
        ] },
        { kind: 'groups', items: [
          { id: 'src-ata', title: l('ATA Carnet temporary admission', 'الإدخال المؤقت بدفاتر ATA Carnet'), text: l('ZATCA e-service for importers holding a carnet to request pre-approval before arrival.', 'خدمة إلكترونية من الهيئة لحاملي الدفاتر لطلب الموافقة المسبقة قبل الوصول.'),
            source: { url: OFFICIAL.zatcaAta, label: l('ZATCA ATA Carnet service', 'خدمة دفاتر ATA Carnet') } },
          { id: 'src-disclosure', title: l('Event disclosure', 'الإفصاح عن الفعاليات'), text: l('Importers organising an event or exhibition in the Kingdom can notify ZATCA in advance through this e-service.', 'يمكن للمستوردين المنظمين لفعالية أو معرض داخل المملكة إشعار الهيئة مسبقاً عبر هذه الخدمة.'),
            source: { url: EVENT_SOURCES.eventDisclosure, label: l('ZATCA event disclosure service', 'خدمة الإفصاح عن الفعاليات') } },
          { id: 'src-news', title: l('Carnets accepted since 2 June 2024', 'قبول الدفاتر منذ 2 يونيو 2024'), text: l('Announcement covering exhibitions and fairs, professional equipment, commercial samples and educational, scientific or cultural goods.', 'إعلان يشمل المعارض والأسواق والمعدات المهنية والعينات التجارية والبضائع التعليمية والعلمية والثقافية.'),
            source: { url: EVENT_SOURCES.ataNews, label: l('ZATCA announcement', 'إعلان الهيئة') } },
        ] },
      ],
      ctas: [ATA, CUSTOMS],
    },
    {
      id: 'journey', eyebrow: l('The cargo journey', 'رحلة الشحنة'), tone: 'dark',
      title: l('From international supplier to re-export', 'من المورد الدولي حتى إعادة التصدير'),
      text: l('Each step is labelled with who performs it: Airzone, a carrier or partner, the authorities, or your supplier.', 'كل خطوة موسومة بالجهة التي تنفذها: إيرزون أو ناقل أو شريك أو الجهات الحكومية أو المورد.'),
      blocks: [
        { kind: 'flow', items: [
          { id: 'j1', role: 'customer', tag: l('Your supplier', 'المورد'), title: l('International supplier', 'المورد الدولي'), text: l('Goods packed, listed and ready.', 'تعبئة البضائع وإدراجها وتجهيزها.') },
          { id: 'j2', role: 'partner', tag: l('Through Airzone’s partners', 'عبر شركاء إيرزون'), title: l('Origin collection', 'الاستلام من المنشأ'), text: l('Collected from the supplier or exhibition warehouse.', 'الاستلام من المورد أو مستودع العارض.') },
          { id: 'j3', role: 'partner', tag: l('Airline or shipping line', 'شركة طيران أو خط ملاحي'), title: l('Air or sea freight', 'شحن جوي أو بحري'), text: l('Urgent items by air, larger builds by sea.', 'القطع العاجلة جواً والأجنحة الكبيرة بحراً.') },
          { id: 'j4', role: 'airzone', tag: l('Coordinated by Airzone', 'تنسقه إيرزون'), title: l('Documentation and customs coordination', 'تنسيق المستندات والجمارك'), text: l('Goods list, carnet or declaration, approvals.', 'قائمة البضائع والدفتر أو البيان والموافقات.') },
          { id: 'j5', role: 'authority', tag: l('Decided by ZATCA', 'تقرره الهيئة'), title: l('Customs release', 'الفسح الجمركي'), text: l('Inspection where selected, then release.', 'المعاينة عند الاختيار ثم الفسح.') },
          { id: 'j6', role: 'airzone', tag: l('Airzone road transportation', 'النقل البري لدى إيرزون'), title: l('Local transportation', 'النقل المحلي'), text: l('From port or airport to storage or venue.', 'من الميناء أو المطار إلى التخزين أو الموقع.') },
          { id: 'j7', role: 'airzone', tag: l('Airzone with the organiser', 'إيرزون بالتنسيق مع المنظم'), title: l('Exhibition venue delivery', 'التسليم في موقع المعرض'), text: l('Delivered in the organiser’s slot.', 'التسليم في الموعد الذي يحدده المنظم.') },
          { id: 'j8', role: 'airzone', tag: l('Where available', 'حيث يتوفر'), title: l('Temporary storage or event support', 'التخزين المؤقت أو دعم الفعالية'), text: l('Goods or empty cases held during the show.', 'حفظ البضائع أو الصناديق الفارغة أثناء المعرض.') },
          { id: 'j9', role: 'airzone', tag: l('Coordinated by Airzone', 'تنسقه إيرزون'), title: l('Post-event collection', 'الاستلام بعد الفعالية'), text: l('Collected after dismantling, repacked and checked.', 'الاستلام بعد التفكيك وإعادة التعبئة والمطابقة.') },
          { id: 'j10', role: 'authority', tag: l('Airzone coordinates · customs approves', 'تنسقه إيرزون · وتعتمده الجمارك'), title: l('Re-export or other approved procedure', 'إعادة التصدير أو إجراء معتمد آخر'), text: l('Goods leave within the permitted period.', 'تغادر البضائع خلال المدة المسموح بها.') },
        ] },
        { kind: 'chips', items: [DESTUFF, STORE, HEAVY, DAYANA, COLD] },
      ],
      note: l('Optional connections above can be added where the shipment needs them.', 'يمكن إضافة الخدمات الاختيارية أعلاه عندما تحتاجها الشحنة.'),
    },
    {
      id: 'customers', eyebrow: l('Who we work with', 'من نعمل معهم'),
      title: l('Exhibition and event customers', 'عملاء المعارض والفعاليات'),
      blocks: [{ kind: 'cards', columns: 3, items: [
        card('organisers', 'Exhibition organisers and trade-show contractors', 'منظمو المعارض ومقاولو المعارض التجارية', 'Bringing many exhibitors’ freight into one venue within tight delivery slots, with storage between build-up and dismantling.', 'إدخال شحنات عارضين كثيرين إلى موقع واحد ضمن مواعيد تسليم ضيقة، مع التخزين بين التجهيز والتفكيك.', [CUSTOMS, TRANSPORT, STORE]),
        card('production', 'Event production and AV rental companies', 'شركات إنتاج الفعاليات وتأجير معدات الصوت والمرئيات', 'Moving high-value AV, LED and staging kits in and out of the Kingdom on short turnarounds.', 'نقل معدات الصوت والمرئيات وشاشات LED والمسارح عالية القيمة من المملكة وإليها في مهل قصيرة.', [AIR, ATA, TRANSPORT]),
        card('suppliers', 'Stage, lighting and LED screen suppliers', 'موردو المسارح والإضاءة وشاشات LED', 'Fragile, serialised equipment that must return complete, with every case accounted for.', 'معدات قابلة للكسر ومرقمة تسلسلياً يجب أن تعود كاملة مع حصر كل صندوق.', [ATA, SEA, HEAVY]),
        card('exhibitors', 'International exhibitors and manufacturers', 'العارضون الدوليون والمصنّعون', 'Showing products in Saudi Arabia with samples, demonstration units and stand materials, some returning and some staying.', 'عرض المنتجات في المملكة بالعينات ووحدات التجربة ومواد الأجنحة، يعود بعضها ويبقى بعضها.', [CUSTOMS, SEA, AIR]),
        card('conferences', 'Conference and corporate-event organisers', 'منظمو المؤتمرات وفعاليات الشركات', 'Equipment, printed materials and furniture for conferences, launches and corporate events, delivered on schedule.', 'المعدات والمطبوعات والأثاث للمؤتمرات وإطلاق المنتجات وفعاليات الشركات، مع التسليم في الموعد.', [TRANSPORT, STORE, DAYANA]),
        card('industrial', 'Industrial equipment suppliers, importers and exporters', 'موردو المعدات الصناعية والمستوردون والمصدّرون', 'Demonstration machinery that may be sold at the show or return home, planned for either outcome.', 'آلات تجريبية قد تُباع في المعرض أو تعود إلى بلدها، مع التخطيط لكلا الاحتمالين.', [HEAVY, SEA, CUSTOMS]),
      ] }],
      ctas: [{ href: '/logistics/industries', label: l('Explore industries we serve', 'استكشف القطاعات التي نخدمها') }],
    },
    {
      id: 'exhibition-quote', eyebrow: l('Exhibition quotation', 'عرض سعر المعارض'),
      title: l('Tell us about your event shipment', 'أخبرنا عن شحنة فعاليتك'),
      text: l('Include the event, venue and dates, the cargo list and your ATA Carnet status. The team will confirm what can be arranged and reply with a written quotation.', 'اذكر الفعالية وموقعها ومواعيدها وقائمة البضائع وحالة دفتر ATA Carnet، وسيؤكد الفريق ما يمكن ترتيبه ويرد بعرض سعر مكتوب.'),
      blocks: [{ kind: 'widget', widget: 'exhibitionForm' }],
    },
  ],
  faqs: [
    { q: l('Do all exhibition goods qualify for temporary admission?', 'هل تتأهل كل بضائع المعارض للإدخال المؤقت؟'), a: l('No. Eligibility depends on the goods, their use and current Saudi procedures. Items sold, given away or consumed at the event are imported permanently, and some regulated goods need extra approvals or may be restricted.', 'لا. يعتمد التأهل على نوع البضائع واستخدامها والإجراءات السعودية المعمول بها. وتُستورد البضائع المبيعة أو الموزعة أو المستهلكة في الفعالية استيراداً نهائياً، وقد تحتاج بعض البضائع المنظمة إلى موافقات إضافية أو تكون مقيدة.') },
    { q: l('Does Saudi Arabia accept ATA Carnets?', 'هل تقبل المملكة دفاتر ATA Carnet؟'), a: l('Yes. ZATCA announced on 2 June 2024 that it had begun accepting ATA Carnets at land, sea and air customs ports. The importer requests pre-approval through ZATCA’s ATA Carnet service before the goods arrive.', 'نعم. أعلنت هيئة الزكاة والضريبة والجمارك في 2 يونيو 2024 بدء قبول دفاتر ATA Carnet في المنافذ البرية والبحرية والجوية. ويطلب المستورد الموافقة المسبقة عبر خدمة دفاتر ATA Carnet لدى الهيئة قبل وصول البضائع.') },
    { q: l('What is ZATCA’s event disclosure?', 'ما خدمة الإفصاح عن الفعاليات لدى الهيئة؟'), a: l('An e-service through which importers who organise an event or exhibition in the Kingdom notify ZATCA in advance, to help regulate and facilitate the customs procedures. It requires an active importer account.', 'خدمة إلكترونية يُشعر من خلالها المستوردون المنظمون لفعالية أو معرض داخل المملكة الهيئة مسبقاً، لتنظيم الإجراءات الجمركية وتيسيرها. وتتطلب حساب مستورد نشطاً.') },
    { q: l('Can you deliver during the venue’s build-up period?', 'هل يمكنكم التسليم خلال فترة التجهيز في الموقع؟'), a: l('We plan deliveries around the organiser’s schedule and delivery slots. Access is controlled by the venue and organiser, so each slot is confirmed for the event rather than guaranteed.', 'نخطط للتسليم وفق جدول المنظم ومواعيد التسليم لديه. ويتحكم الموقع والمنظم في الدخول، لذا يُؤكَّد كل موعد للفعالية دون ضمانه.') },
    { q: l('Do LED screens or wireless microphones need special approvals?', 'هل تحتاج شاشات LED أو الميكروفونات اللاسلكية إلى موافقات خاصة؟'), a: l('They can. Wireless audio and other radio equipment may need approval or frequency authorisation from the Communications, Space & Technology Commission, and products containing lithium batteries have transport rules. These points are checked when we assess the cargo list.', 'قد تحتاج. فقد تتطلب أجهزة الصوت اللاسلكية وأجهزة الراديو الأخرى موافقة أو ترخيص ترددات من هيئة الاتصالات والفضاء والتقنية، وللمنتجات المحتوية على بطاريات ليثيوم قواعد نقل خاصة. وتُراجَع هذه النقاط عند تقييم قائمة البضائع.') },
    { q: l('Can you store equipment between build-up and dismantling?', 'هل يمكنكم تخزين المعدات بين التجهيز والتفكيك؟'), a: l('Where available, goods and empty cases can be stored in Airzone’s warehouse network in Riyadh, Dammam, Jeddah or Jubail. Space and timing are confirmed for each event.', 'حيث يتوفر ذلك، يمكن تخزين البضائع والصناديق الفارغة في شبكة مستودعات إيرزون في الرياض أو الدمام أو جدة أو الجبيل، مع تأكيد المساحة والتوقيت لكل فعالية.') },
  ],
  related: [ATA, CUSTOMS, AIR, SEA, DESTUFF, STORE, HEAVY, { href: '/logistics/industries', label: l('Industries we serve', 'القطاعات التي نخدمها') }],
  sources: [
    { url: OFFICIAL.zatcaAta, label: l('ZATCA: ATA Carnet temporary admission service', 'هيئة الزكاة والضريبة والجمارك: خدمة الإدخال المؤقت بدفاتر ATA Carnet') },
    { url: EVENT_SOURCES.eventDisclosure, label: l('ZATCA: event disclosure service', 'هيئة الزكاة والضريبة والجمارك: خدمة الإفصاح عن الفعاليات') },
    { url: EVENT_SOURCES.ataNews, label: l('ZATCA: ATA Carnet acceptance announcement', 'هيئة الزكاة والضريبة والجمارك: إعلان قبول دفاتر ATA Carnet') },
    { url: OFFICIAL.icc, label: l('ICC: ATA Carnet', 'غرفة التجارة الدولية: دفتر ATA Carnet') },
    { url: EVENT_SOURCES.cst, label: l('Communications, Space & Technology Commission', 'هيئة الاتصالات والفضاء والتقنية') },
  ],
  seo: {
    title: l('Exhibition & Trade Show Logistics in Saudi Arabia | Airzone', 'لوجستيات المعارض والفعاليات في السعودية | إيرزون'),
    description: l('Exhibition logistics in Saudi Arabia: freight, ATA Carnet and temporary admission, venue delivery, storage and re-export for stands, LED, AV and lighting.', 'لوجستيات المعارض في المملكة: الشحن ودفاتر ATA Carnet والإدخال المؤقت والتسليم في الموقع والتخزين وإعادة التصدير للأجنحة وشاشات LED ومعدات الصوت والإضاءة.'),
  },
  service: l('Exhibition, trade show and event logistics', 'الخدمات اللوجستية للمعارض والفعاليات'),
  area: { type: 'Country', names: ['Saudi Arabia'] },
  updated: UPDATED,
};
