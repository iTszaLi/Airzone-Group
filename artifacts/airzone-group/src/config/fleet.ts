/**
 * Homepage fleet showroom: one entry per vehicle photo supplied by the company.
 * Photos: public/assets/fleet/<image>-{240,640,1024}.webp, prepared from attached_assets/fleet
 * by scripts/prepare-fleet-images.py (studio background normalised; vehicles unedited).
 *
 * Only what the photo shows or the business has stated is described here: body type and
 * typical use. No capacities, dimensions, temperature ranges or ownership claims; availability
 * is confirmed for each booking.
 */
export type FleetLine = 'heavy' | 'dayana';

type Copy = { name: string; short: string; text: string; body: string; bestFor: string; alt: string };

export type FleetVehicle = {
  id: string;
  image: string;
  line: FleetLine;
  href: string;
  en: Copy;
  ar: Copy;
};

export const fleetLines: Record<FleetLine, { en: string; ar: string; href: string }> = {
  heavy: { en: 'Heavy transport · Saudi Arabia & GCC', ar: 'النقل الثقيل · المملكة والخليج', href: '/logistics/heavy-transport' },
  dayana: { en: 'Dayana local delivery', ar: 'Dayana للتوصيل المحلي', href: '/logistics/dayana-local-delivery' },
};

export const fleet: FleetVehicle[] = [
  {
    id: 'curtainside', image: 'curtainside', line: 'heavy', href: '/logistics/gcc-transportation',
    en: { name: 'Curtain-Side Trailer', short: 'Curtain-side trailer',
      text: 'A covered semi-trailer with sliding side curtains, so palletised goods can be loaded from the side and travel under cover on domestic and GCC routes.',
      body: 'Covered body, sliding curtain sides', bestFor: 'Palletised and boxed general cargo',
      alt: 'White tractor unit with a grey curtain-side semi-trailer' },
    ar: { name: 'مقطورة جانبية الستائر', short: 'مقطورة جانبية الستائر',
      text: 'مقطورة مغطاة بستائر جانبية منزلقة، تُحمَّل البضائع على المنصات من الجانب وتنتقل مغطاة على المسارات المحلية والخليجية.',
      body: 'هيكل مغطى بستائر جانبية منزلقة', bestFor: 'البضائع العامة على المنصات وفي الصناديق',
      alt: 'رأس قاطرة أبيض مع مقطورة رمادية جانبية الستائر' },
  },
  {
    id: 'flatbed', image: 'flatbed', line: 'heavy', href: '/logistics/heavy-transport',
    en: { name: 'Flatbed Semi-Trailer', short: 'Flatbed trailer',
      text: 'An open flat deck for cargo loaded by crane or forklift from the sides or above, such as steel, machinery and construction materials.',
      body: 'Open flat deck', bestFor: 'Steel, machinery and building materials',
      alt: 'White tractor unit with an empty flatbed semi-trailer' },
    ar: { name: 'مقطورة مسطحة', short: 'مقطورة مسطحة',
      text: 'سطح مكشوف للبضائع التي تُحمَّل بالرافعة أو الرافعة الشوكية من الجوانب أو من الأعلى، مثل الحديد والآلات ومواد البناء.',
      body: 'سطح مسطح مكشوف', bestFor: 'الحديد والآلات ومواد البناء',
      alt: 'رأس قاطرة أبيض مع مقطورة مسطحة فارغة' },
  },
  {
    id: 'lowbed', image: 'lowbed', line: 'heavy', href: '/logistics/heavy-transport',
    en: { name: 'Low-Bed Heavy-Haul Trailer', short: 'Low-bed trailer',
      text: 'A low deck with rear loading ramps for heavy and tall equipment. Heavy and oversized moves depend on suitable equipment and permits.',
      body: 'Low deck with rear ramps', bestFor: 'Heavy equipment and machinery',
      alt: 'White tractor unit with an empty low-bed trailer and raised loading ramps' },
    ar: { name: 'مقطورة منخفضة للحمولات الثقيلة', short: 'مقطورة منخفضة',
      text: 'سطح منخفض بمنحدرات تحميل خلفية للمعدات الثقيلة والمرتفعة. يعتمد نقل الحمولات الثقيلة وكبيرة الحجم على توفر المعدات والتصاريح المناسبة.',
      body: 'سطح منخفض بمنحدرات خلفية', bestFor: 'المعدات والآلات الثقيلة',
      alt: 'رأس قاطرة أبيض مع مقطورة منخفضة فارغة ومنحدرات تحميل مرفوعة' },
  },
  {
    id: 'car-carrier', image: 'car-carrier', line: 'heavy', href: '/logistics/gcc-transportation',
    en: { name: 'Car Carrier Trailer', short: 'Car carrier',
      text: 'A two-deck transporter with adjustable decks for moving cars and light vehicles by road between cities.',
      body: 'Two-deck vehicle transporter', bestFor: 'Cars and light vehicles',
      alt: 'White tractor unit with an empty two-deck car carrier trailer' },
    ar: { name: 'مقطورة نقل السيارات', short: 'ناقلة سيارات',
      text: 'ناقلة بطابقين قابلين للضبط لنقل السيارات والمركبات الخفيفة براً بين المدن.',
      body: 'ناقلة مركبات بطابقين', bestFor: 'السيارات والمركبات الخفيفة',
      alt: 'رأس قاطرة أبيض مع مقطورة فارغة لنقل السيارات بطابقين' },
  },
  {
    id: 'dayana-reefer', image: 'dayana-reefer', line: 'dayana', href: '/logistics/dayana-local-delivery',
    en: { name: 'Isuzu Dayana Refrigerated Truck', short: 'Refrigerated truck',
      text: 'An insulated box body with a refrigeration unit for chilled and temperature-sensitive deliveries. The required temperature is confirmed for each booking.',
      body: 'Insulated box with refrigeration unit', bestFor: 'Chilled and temperature-sensitive goods',
      alt: 'White Isuzu light truck with an insulated box and a refrigeration unit' },
    ar: { name: 'شاحنة Dayana مبردة من إيسوزو', short: 'شاحنة مبردة',
      text: 'صندوق معزول بوحدة تبريد للتوصيلات المبردة والحساسة للحرارة. تُؤكَّد درجة الحرارة المطلوبة لكل حجز.',
      body: 'صندوق معزول بوحدة تبريد', bestFor: 'البضائع المبردة والحساسة للحرارة',
      alt: 'شاحنة إيسوزو خفيفة بيضاء بصندوق معزول ووحدة تبريد' },
  },
  {
    id: 'dayana-box', image: 'dayana-box', line: 'dayana', href: '/logistics/dayana-local-delivery',
    en: { name: 'Isuzu Dayana Closed-Box Truck', short: 'Closed-box truck',
      text: 'An enclosed box body that keeps consignments covered for city and regional deliveries, store replenishment and warehouse-to-customer runs.',
      body: 'Enclosed box body', bestFor: 'Cartons, palletised goods and store deliveries',
      alt: 'White Isuzu light truck with a closed box body' },
    ar: { name: 'شاحنة Dayana بصندوق مغلق من إيسوزو', short: 'شاحنة بصندوق مغلق',
      text: 'صندوق مغلق يُبقي الشحنات مغطاة للتوصيل داخل المدن وما حولها وإعادة تزويد المتاجر والنقل من المستودع إلى العميل.',
      body: 'صندوق مغلق', bestFor: 'الكراتين والبضائع على المنصات والتوصيل للمتاجر',
      alt: 'شاحنة إيسوزو خفيفة بيضاء بصندوق مغلق' },
  },
  {
    id: 'dayana-open', image: 'dayana-open', line: 'dayana', href: '/logistics/dayana-local-delivery',
    en: { name: 'Isuzu Dayana Open-Box Truck', short: 'Open-box truck',
      text: 'An open cargo body with a high frame for bulky or awkward loads, building materials and site deliveries.',
      body: 'Open cargo body with a high frame', bestFor: 'Bulky goods, materials and site deliveries',
      alt: 'White Isuzu light truck with an open cargo body and a high steel frame' },
    ar: { name: 'شاحنة Dayana بصندوق مفتوح من إيسوزو', short: 'شاحنة بصندوق مفتوح',
      text: 'صندوق شحن مفتوح بإطار مرتفع للحمولات الكبيرة أو غير المنتظمة ومواد البناء والتوصيل إلى المواقع.',
      body: 'صندوق مفتوح بإطار مرتفع', bestFor: 'البضائع الكبيرة والمواد والتوصيل إلى المواقع',
      alt: 'شاحنة إيسوزو خفيفة بيضاء بصندوق مفتوح وإطار حديدي مرتفع' },
  },
  {
    id: 'cargo-van', image: 'cargo-van', line: 'dayana', href: '/logistics/dayana-local-delivery',
    en: { name: 'Enclosed Cargo Van', short: 'Cargo van',
      text: 'A high-roof panel van for frequent smaller drops: parcels, cartons and last-mile deliveries to customers, stores and sites.',
      body: 'High-roof panel van', bestFor: 'Parcels, cartons and multi-drop routes',
      alt: 'White high-roof panel van' },
    ar: { name: 'فان شحن مغلق', short: 'فان شحن',
      text: 'فان بسقف مرتفع للتوصيلات الصغيرة المتكررة: الطرود والكراتين والتوصيل للميل الأخير إلى العملاء والمتاجر والمواقع.',
      body: 'فان مغلق بسقف مرتفع', bestFor: 'الطرود والكراتين والمسارات متعددة النقاط',
      alt: 'فان شحن أبيض بسقف مرتفع' },
  },
  {
    id: 'suzuki-carry', image: 'suzuki-carry', line: 'dayana', href: '/logistics/dayana-local-delivery',
    en: { name: 'Suzuki Carry Cargo Pickup', short: 'Suzuki Carry pickup',
      text: 'A compact pickup with a canopy-covered cargo bed for small loads, narrow city streets and quick local runs.',
      body: 'Compact pickup, covered cargo bed', bestFor: 'Small consignments and quick city runs',
      alt: 'White Suzuki Carry pickup with a grey canopy over the cargo bed' },
    ar: { name: 'بيك أب سوزوكي كاري للشحن', short: 'سوزوكي كاري',
      text: 'بيك أب صغير بصندوق شحن مغطى للحمولات الصغيرة وشوارع المدن الضيقة والمشاوير المحلية السريعة.',
      body: 'بيك أب صغير بصندوق مغطى', bestFor: 'الشحنات الصغيرة والمشاوير السريعة داخل المدينة',
      alt: 'بيك أب سوزوكي كاري أبيض بغطاء رمادي فوق صندوق الشحن' },
  },
];

export const fleetImage = (image: string, w: 240 | 640 | 1024) => `${import.meta.env.BASE_URL}assets/fleet/${image}-${w}.webp`;
