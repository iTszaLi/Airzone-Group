/**
 * Editorial photography. Credits are also listed in docs/photo-credits.md.
 * Most entries are illustrative, third-party images that do not depict Airzone
 * vehicles, warehouses, staff, offices, clients or shipments. Entries credited to
 * Airzone Logistics Services Est were supplied by the company (service covers).
 */
export type Photo = {
  base: string;
  width: number;
  height: number;
  alt: string;
  /** Arabic alternative text (falls back to `alt`). */
  altAr?: string;
  credit: string;
  license: string;
  licenseUrl?: string;
  /** Where the photo comes from; omitted for photos supplied by the company. */
  source?: string;
  /** Files available for this photo (default 800/1400/1920). */
  widths?: readonly number[];
  /** object-position for this photo's subject, everywhere it is shown; `focusMobile` overrides it up to 640px. */
  focus?: string;
  focusMobile?: string;
};

const widths = [800, 1400, 1920] as const;
const OWNER = { credit: 'Airzone Logistics Services Est', license: 'Supplied by Airzone Logistics' };
const UNSPLASH = { license: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' };

export const photos = {
  // Service cover photos supplied by the company (originals in attached_assets/service-covers).
  customsCover: {
    base: 'customs-clearance-cover', width: 1024, height: 572, widths: [640, 800, 1024], focus: '70% 30%', focusMobile: '68% 40%',
    alt: 'Airzone Logistics customs-clearance inspection at a shipping container terminal',
    altAr: 'معاينة تخليص جمركي من إيرزون للخدمات اللوجستية في محطة حاويات',
    ...OWNER,
  },
  warehousingCover: {
    base: 'warehousing-cover', width: 1024, height: 572, widths: [640, 800, 1024], focus: '50% 55%', focusMobile: '50% 50%',
    alt: 'Modern logistics warehouse with pallet racks, stored cargo and forklifts',
    altAr: 'مستودع لوجستي حديث برفوف منصات وبضائع مخزنة ورافعات شوكية',
    ...OWNER,
  },
  transportCover: {
    base: 'transportation-cover', width: 1024, height: 572, widths: [640, 800, 1024], focus: '80% 60%', focusMobile: '80% 55%',
    alt: 'Airzone Logistics freight transportation truck travelling on a highway',
    altAr: 'شاحنة نقل بضائع من إيرزون للخدمات اللوجستية تسير على طريق سريع',
    ...OWNER,
  },
  truckDesert: {
    base: 'truck-desert-highway', width: 1920, height: 997,
    alt: 'Heavy-duty truck with a box trailer on a highway through arid hills',
    altAr: 'شاحنة ثقيلة بمقطورة صندوقية على طريق سريع بين تلال قاحلة',
    credit: 'Sander Yigin', ...UNSPLASH, source: 'https://unsplash.com/photos/ki19VJAGh6w',
  },
  semiOpenRoad: {
    base: 'semi-truck-open-road', width: 1920, height: 1280,
    alt: 'Semi-trailer truck travelling on a highway through dry scrubland',
    altAr: 'شاحنة بمقطورة نصفية تسير على طريق سريع وسط أرض جافة',
    credit: 'Tom Jackson', ...UNSPLASH, source: 'https://unsplash.com/photos/Rhwj3cPwc6o',
  },
  flatbedTrailer: {
    base: 'multi-axle-flatbed-trailer', width: 1920, height: 1280,
    alt: 'Multi-axle flatbed semi-trailer inside an industrial hall',
    altAr: 'مقطورة نصفية مسطحة متعددة المحاور داخل صالة صناعية',
    credit: 'Forest Plum', ...UNSPLASH, source: 'https://unsplash.com/photos/mFgpVNt62Kg',
  },
  oversizeLoad: {
    base: 'oversize-load-transport', width: 1920, height: 1280,
    alt: 'Prime mover hauling an oversized mining vehicle on a low-loader trailer',
    altAr: 'رأس قاطرة يجرّ مركبة تعدين ضخمة على مقطورة منخفضة',
    credit: 'snap wander', ...UNSPLASH, source: 'https://unsplash.com/photos/h1Z7JnbvEWg',
  },
  warehouseAisle: {
    base: 'warehouse-racking-aisle', width: 1920, height: 1280,
    alt: 'Long warehouse aisle lined with high pallet racking',
    altAr: 'ممر طويل في مستودع تصطف على جانبيه رفوف منصات عالية',
    credit: 'Lance Chang', ...UNSPLASH, source: 'https://unsplash.com/photos/h3pVxOIpnzk',
  },
  warehouseFloor: {
    base: 'warehouse-operations', width: 1920, height: 1281,
    alt: 'Warehouse floor with storage racking, bins and staged goods',
    altAr: 'أرضية مستودع برفوف تخزين وصناديق وبضائع جاهزة للإرسال',
    credit: 'Alberto Rodríguez', ...UNSPLASH, source: 'https://unsplash.com/photos/-aCrA9FmT8Y',
  },
  boxVan: {
    base: 'box-van-local-delivery', width: 1920, height: 1280,
    alt: 'White box van driving on a city road',
    altAr: 'عربة توصيل بيضاء مغلقة تسير على طريق داخل المدينة',
    credit: 'JavyGo', ...UNSPLASH, source: 'https://unsplash.com/photos/ZdySMOIicMo',
  },
  boxTruck: {
    base: 'box-truck-loading', width: 1920, height: 1280,
    alt: 'White light-duty box truck parked beside a building',
    altAr: 'شاحنة خفيفة بيضاء بصندوق مغلق متوقفة بجانب مبنى',
    credit: 'Maxim Tolchinskiy', ...UNSPLASH, source: 'https://unsplash.com/photos/crHhZlES310',
  },
  portCranes: {
    base: 'port-cranes', width: 2048, height: 1365,
    alt: 'Ship-to-shore cranes standing over a container terminal',
    altAr: 'رافعات رصيف ضخمة فوق محطة حاويات',
    credit: 'Robinson Niñal / Presidential Photojournalists Division (PPD)', license: 'Public domain',
    source: 'https://commons.wikimedia.org/wiki/File:Ship-to-shore_cranes_at_the_Davao_International_Container_Terminal.jpg',
  },
  containerShip: {
    base: 'container-ship', width: 1920, height: 1280,
    alt: 'A loaded container ship moored at a port quay',
    altAr: 'سفينة حاويات محمّلة راسية عند رصيف ميناء',
    credit: 'Martin Dörsch', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Container_ship_in_Koper_2013.jpg',
  },
  maldives: {
    base: 'maldives-resort', width: 1920, height: 1010,
    alt: 'Overwater villas on a turquoise lagoon in the Maldives',
    altAr: 'فلل فوق الماء على بحيرة فيروزية في جزر المالديف',
    credit: 'Dr. Ondřej Havelka', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Maldives_Resort,_Indian_Ocean.jpg',
  },
  riyadh: {
    base: 'riyadh-skyline', width: 1920, height: 1080,
    alt: 'The Riyadh skyline at dusk',
    altAr: 'أفق مدينة الرياض عند الغسق',
    credit: 'B.alotaby', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Riyadh_Skyline.jpg',
  },
  // Travel and logistics redesign (Wikimedia Commons; scripts/prepare-photos-commons.py)
  maldivesAtolls: {
    base: 'maldives-atolls', width: 1920, height: 1440,
    alt: 'Aerial view of coral atolls and turquoise lagoons in the Maldives', altAr: 'منظر جوي لجزر مرجانية وبحيرات فيروزية في جزر المالديف',
    credit: 'Frédéric Ducarme', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Baa_atoll_islands.JPG',
  },
  maldivesVillas: {
    base: 'maldives-island-villas', width: 1920, height: 1078,
    alt: 'Aerial view of a Maldives island with overwater villas', altAr: 'منظر جوي لجزيرة في المالديف مع فلل فوق الماء',
    credit: 'dronepicr', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Malediven_Atoll_Luftbild_(28800485916).jpg',
  },
  santorini: {
    base: 'santorini-oia', width: 1920, height: 1275,
    alt: 'Whitewashed houses and windmills of Oia, Santorini, at sunset', altAr: 'منازل أويا البيضاء وطواحينها في سانتوريني عند الغروب',
    credit: 'LBM1948', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Santorini,_Oia_29.jpg',
  },
  dubai: {
    base: 'dubai-skyline', width: 1920, height: 1440,
    alt: 'The Dubai skyline and Burj Khalifa at dusk across the water', altAr: 'أفق دبي وبرج خليفة عند الغسق',
    credit: 'Sergei Gussev', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Burj_Khalifa_Night_View_01.jpg',
  },
  paris: {
    base: 'paris-seine', width: 1920, height: 1230,
    alt: 'The Eiffel Tower and Pont Alexandre III over the Seine at night', altAr: 'برج إيفل وجسر ألكسندر الثالث فوق نهر السين ليلاً',
    credit: 'Getfunky Paris', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Eiffel_Tower_and_Pont_Alexandre_III_at_night.jpg',
  },
  bali: {
    base: 'bali-terraces', width: 1920, height: 1280,
    alt: 'Rice terraces and palm trees in Bali', altAr: 'مدرجات الأرز وأشجار النخيل في بالي',
    credit: 'Vyacheslav Argenberg', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Rice_terraces,_Bali.jpg',
  },
  tokyo: {
    base: 'tokyo-night', width: 1920, height: 1080,
    alt: 'Tokyo skyline at night with Tokyo Tower', altAr: 'أفق طوكيو ليلاً مع برج طوكيو',
    credit: 'David Kernan', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Tokyo_Tower,_Minato_City.jpg',
  },
  cappadocia: {
    base: 'cappadocia', width: 1920, height: 1440,
    alt: 'Hot-air balloons over the rock formations of Cappadocia, Türkiye', altAr: 'مناطيد الهواء الساخن فوق التكوينات الصخرية في كابادوكيا بتركيا',
    credit: 'Netha Hussain', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_Cappadocia_from_hot_air_balloon_64.jpg',
  },
  abuDhabi: {
    base: 'abu-dhabi-mosque', width: 1920, height: 1080,
    alt: 'Sheikh Zayed Grand Mosque in Abu Dhabi silhouetted at sunset', altAr: 'جامع الشيخ زايد الكبير في أبوظبي عند الغروب',
    credit: 'PotatoWitch', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Sheikh_Zayed_Mosque_Silhouette.jpg',
  },
  matterhorn: {
    base: 'matterhorn', width: 1920, height: 1080,
    alt: 'The Matterhorn reflected in an alpine lake in Switzerland at twilight', altAr: 'جبل ماترهورن منعكساً في بحيرة جبلية في سويسرا عند الشفق',
    credit: 'Michael Kuhn', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Matterhorn_and_Stellisee_in_Twilight.jpg',
  },
  positano: {
    base: 'positano', width: 1920, height: 1178,
    alt: 'The cliffside village of Positano on the Amalfi Coast, Italy', altAr: 'قرية بوزيتانو على ساحل أمالفي في إيطاليا',
    credit: 'Bernard Gagnon', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Positano_(Italy)_03.jpg',
  },
  familyBeach: {
    base: 'family-beach', width: 1920, height: 1280,
    alt: 'A calm tropical beach framed by palm trees', altAr: 'شاطئ استوائي هادئ تحيط به أشجار النخيل',
    credit: 'U.S. Government (public domain)', license: 'Public domain',
    source: 'https://commons.wikimedia.org/wiki/File:USVI_IMG_5166_-_Tropical_foliage_frames_a_serene_beach_and_turquoise_water_with_palm_trees_swaying_gently_in_the_breeze.jpg',
  },
  luxuryPool: {
    base: 'luxury-pool', width: 1920, height: 1280,
    alt: 'A resort infinity pool and palm trees at sunset', altAr: 'مسبح منتجع وأشجار نخيل عند الغروب',
    credit: 'Recal Media recalmedia', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Negombo_Beach_resort_pool_(Unsplash).jpg',
  },
  stadium: {
    base: 'sports-stadium', width: 1920, height: 782,
    alt: 'A floodlit football stadium during an evening match', altAr: 'ملعب كرة قدم مضاء خلال مباراة مسائية',
    credit: 'Krzysztof Popławski', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Mecz_pi%C5%82karski_Wis%C5%82a_Krak%C3%B3w_-_Zag%C5%82%C4%99bie_Sosnwoiec,_28_pa%C5%BAdziernika_2022,_Po%C5%BCegnanie_Stadionu_Ludowego,_KP.jpg',
  },
  medicalPlanning: {
    base: 'medical-planning', width: 1920, height: 1280,
    alt: 'A stethoscope beside a laptop computer', altAr: 'سماعة طبية بجانب حاسوب محمول',
    credit: 'Daniel Sone (photographer)', license: 'Public domain',
    source: 'https://commons.wikimedia.org/wiki/File:Stethoscope_and_Laptop_Computer_-_Nci-vol-9713-300.jpg',
  },
  adventureRidge: {
    base: 'adventure-ridge', width: 1920, height: 1282,
    alt: 'Hikers on a mountain ridge at sunrise', altAr: 'متنزهون على قمة جبلية عند شروق الشمس',
    credit: 'Jakub Hałun', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Babia_G%C3%B3ra_po_wschodzie_s%C5%82o%C5%84ca,_20210620_0451_7539.jpg',
  },
  airlinerWing: {
    base: 'airliner-wing', width: 1920, height: 1275,
    alt: 'An airliner wing above sunlit clouds', altAr: 'جناح طائرة ركاب فوق سحب مضيئة',
    credit: 'U.S. Department of Agriculture', license: 'Public domain',
    source: 'https://commons.wikimedia.org/wiki/File:A_wing_tip_of_an_airplane_(40118125441).jpg',
  },
  airportHall: {
    base: 'airport-hall', width: 1920, height: 1282,
    alt: 'A bright, quiet airport departure hall', altAr: 'صالة مغادرة هادئة ومضيئة في مطار',
    credit: 'kallerna', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Helsinki_airport_departure_hall_2.jpg',
  },
  airportTerminal: {
    base: 'airport-terminal', width: 1920, height: 1266,
    alt: 'An airport terminal hall with a planted atrium', altAr: 'صالة مطار مع فناء مزروع',
    credit: 'kallerna', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Helsinki_airport_departure_hall_1.jpg',
  },
  curtainTrailer: {
    base: 'curtainside-trailer', width: 1920, height: 1440,
    alt: 'A tractor unit with a curtain-side semi-trailer', altAr: 'قاطرة مع مقطورة جانبية الستائر',
    credit: 'Llann Wé²', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:W2425-Semi_Tautliner_3750N8.jpg',
  },
  boxTrailer: {
    base: 'box-trailer-highway', width: 1920, height: 1308,
    alt: 'A truck with a closed box trailer on a highway', altAr: 'شاحنة بمقطورة صندوقية مغلقة على طريق سريع',
    credit: 'Thomas Schilling', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Truck_Florida.jpg',
  },
  panelVan: {
    base: 'panel-van', width: 1920, height: 1278,
    alt: 'A white panel van', altAr: 'عربة فان بيضاء مغلقة',
    credit: 'Alexander Migl', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Ford_Transit_(2019)_Rutesheimer_Autoschau_2026_IMG_6783.jpg',
  },
  cargoFreighter: {
    base: 'cargo-freighter', width: 1920, height: 1440,
    alt: 'A cargo aircraft with its nose cargo door open', altAr: 'طائرة شحن بباب الشحن الأمامي مفتوحاً',
    credit: 'Olivier Cleynen', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Nose_cargo_door_of_Boeing_747-8F.jpg',
  },
  containerYard: {
    base: 'container-yard', width: 1920, height: 1440,
    alt: 'Stacked shipping containers at a port container terminal', altAr: 'حاويات شحن مكدسة في محطة حاويات بميناء',
    credit: 'Pierre Marshall', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Zhangjiagang_win_hanverky_container_terminal_port_2024-04.jpg',
  },
  reeferTrailer: {
    base: 'reefer-trailer', width: 1920, height: 1440,
    alt: 'A refrigerated semi-trailer', altAr: 'مقطورة مبردة',
    credit: 'Rundvald', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Chereau-semiremorque-byRundvald.jpg',
  },
  lowbedTrailer: {
    base: 'lowbed-trailer', width: 1920, height: 934,
    alt: 'A low-loader trailer carrying a wheel loader', altAr: 'مقطورة منخفضة تحمل جرافة',
    credit: 'Georg Pik', license: 'CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Flatbed_low_loader_with_tractor_(Russia).jpg',
  },
  jeddahPort: {
    base: 'jeddah-port', width: 1920, height: 1442,
    alt: 'Container cranes at Jeddah Islamic Port across the Red Sea', altAr: 'رافعات الحاويات في ميناء جدة الإسلامي عبر البحر الأحمر',
    credit: 'Meshari Alawfi', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Jeddah_Islamic_Port.jpg',
  },
  dammam: {
    base: 'dammam-corniche', width: 1920, height: 1277,
    alt: 'The Dammam corniche at night', altAr: 'كورنيش الدمام ليلاً',
    credit: 'Ayman Y. Dasa', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Dammam_Almurjan_01_-_panoramio.jpg',
  },
  jubail: {
    base: 'jubail-corniche', width: 1920, height: 1440,
    alt: 'Palm-lined waterfront in Jubail', altAr: 'واجهة بحرية تحفها أشجار النخيل في الجبيل',
    credit: 'Ahmed', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Jubail_180349.jpg',
  },
  exhibitionStand: {
    base: 'exhibition-stand', width: 1920, height: 1081,
    alt: 'An exhibition stand with display counters and seating in a trade-show hall', altAr: 'جناح عرض بطاولات عرض ومقاعد في قاعة معرض تجاري',
    credit: 'Matti Blume', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:EBACE_2019,_Le_Grand-Saconnex_(EB190646).jpg',
  },
  customStand: {
    base: 'custom-exhibition-stand', width: 1920, height: 1280,
    alt: 'A custom-built exhibition stand with an arched header and furniture', altAr: 'جناح معرض مصمم خصيصاً بواجهة مقوسة وأثاث',
    credit: 'Matti Blume', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Linstol,_WTCE_2023,_Hamburg_(PEW37853).jpg',
  },
  productDemoStand: {
    base: 'product-demo-stand', width: 1920, height: 1080,
    alt: 'Products set out for demonstration on a trade-show stand', altAr: 'منتجات معروضة للتجربة على جناح في معرض تجاري',
    credit: 'Matti Blume', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Bosch_eBike,_IAA_2021,_Munich_(IAA10303).jpg',
  },
  ledPixels: {
    base: 'led-wall-pixels', width: 1920, height: 1280,
    alt: 'Close-up of the pixels on an LED video wall', altAr: 'لقطة مقرّبة لبكسلات شاشة LED',
    credit: 'Junyu-K', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:202506_LED%E9%9B%BB%E8%A6%96%E7%89%86%E7%9A%84%E8%9E%A2%E5%B9%95%E5%A3%9E%E9%BB%9E_02.jpg',
  },
  mixingConsole: {
    base: 'mixing-console-case', width: 1920, height: 1284,
    alt: 'A digital sound mixing console mounted on its transport case', altAr: 'طاولة مزج صوت رقمية مثبتة على صندوق نقلها',
    credit: 'Niranjan Arminius', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:DiGiCo_S21_Mixing_Console_2017.jpg',
  },
  movingHeads: {
    base: 'moving-head-lights', width: 1920, height: 1275,
    alt: 'Two moving-head stage lights standing on a flight case', altAr: 'جهازا إضاءة مسرحية متحركان على صندوق نقل',
    credit: 'Andreas Praefcke', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Ravensburg_Konzerthaus_Scheinwerfer_Moving_head.jpg',
  },
  trussTower: {
    base: 'aluminium-truss-tower', width: 1920, height: 1280,
    alt: 'Looking up through an aluminium event truss tower', altAr: 'منظر من الأسفل لبرج جمالون ألمنيوم للفعاليات',
    credit: 'Deckenpappe2023', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Alu-Tower_mit_Wagen_f%C3%BCr_eine_Open-AIr-Veranstaltung.jpg',
  },
  interactiveWall: {
    base: 'interactive-display-wall', width: 1920, height: 1440,
    alt: 'A person using gestures on a large interactive display wall', altAr: 'شخص يتفاعل بالإيماءات مع جدار عرض تفاعلي كبير',
    credit: 'Rooch84', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:A_user_performing_gesture_interactions_with_a_Powerwall_display_at_the_University_of_Leeds.jpg',
  },
  flightCases: {
    base: 'flight-cases-truck', width: 1920, height: 1280,
    alt: 'Wheeled flight cases for event equipment beside a truck', altAr: 'صناديق نقل بعجلات لمعدات الفعاليات بجانب شاحنة',
    credit: 'Lionel Allorge', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Nuit_Bor%C3%A9ale_2013_011.jpg',
  },
  airCargoLoader: {
    base: 'air-cargo-loader', width: 1920, height: 1440,
    alt: 'An air cargo container being loaded into an aircraft hold', altAr: 'حاوية شحن جوي تُحمَّل في عنبر طائرة',
    credit: 'Jamesshliu', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Aircraft_cargo_(ULD)_loader_in_operaton.jpg',
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

const photoWidths = (photo: Photo) => photo.widths ?? widths;

/** URL of the stored size closest to `w` without going over (or the smallest one). */
export function photoUrl(photo: Photo, w: number) {
  const list = photoWidths(photo);
  const pick = [...list].reverse().find(x => x <= w) ?? list[0];
  return `${import.meta.env.BASE_URL}assets/photo/${photo.base}-${pick}.webp`;
}
export function photoSrcSet(photo: Photo) {
  return photoWidths(photo).map(w => `${photoUrl(photo, w)} ${w}w`).join(', ');
}
