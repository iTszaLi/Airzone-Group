import type { PhotoKey } from './photography';

/**
 * Airzone Travel & Tourism landing page copy (English / Arabic).
 *
 * Accuracy rules: no prices, ratings, review counts, years of experience,
 * customer numbers, licence numbers or accreditations are stated, because none
 * have been verified for Airzone. Offer durations are suggested itineraries to
 * enquire about, not live inventory; prices are quoted in SAR after
 * availability and itinerary details are confirmed.
 */

export type TravelOffer = { id: string; photo: PhotoKey; nights: { en: string; ar: string }; region: { en: string; ar: string }; en: [string, string]; ar: [string, string] };
export type TravelStyle = { id: string; photo: PhotoKey; en: [string, string]; ar: [string, string] };
export type TravelDestination = { id: string; photo: PhotoKey; region: { en: string; ar: string }; en: [string, string, string]; ar: [string, string, string] };

/** Suggested itineraries (configurable; confirm with the travel team before treating as bookable products). */
export const travelOffers: TravelOffer[] = [
  { id: 'maldives', photo: 'maldives', nights: { en: '4–7 nights', ar: '4–7 ليالٍ' }, region: { en: 'Indian Ocean', ar: 'المحيط الهندي' },
    en: ['Maldives packages from Saudi Arabia', 'Island resorts, lagoon villas and slow days on the water, matched to the season and the occasion.'],
    ar: ['باقات المالديف من المملكة', 'منتجعات الجزر وفلل البحيرات وأيام هادئة على الماء، بما يناسب الموسم والمناسبة.'] },
  { id: 'turkiye', photo: 'cappadocia', nights: { en: '4–11 nights', ar: '4–11 ليلة' }, region: { en: 'Europe & Asia', ar: 'أوروبا وآسيا' },
    en: ['Türkiye packages from Saudi Arabia', 'Istanbul, Cappadocia and the coast, combined into one route that fits your days and pace.'],
    ar: ['باقات تركيا من المملكة', 'إسطنبول وكابادوكيا والساحل في مسار واحد يناسب أيامك وإيقاعك.'] },
  { id: 'bali', photo: 'bali', nights: { en: '8 or 10 days', ar: '8 أو 10 أيام' }, region: { en: 'Southeast Asia', ar: 'جنوب شرق آسيا' },
    en: ['Bali holiday packages', 'Rice terraces, beaches and villas, with transfers and stays arranged between each part of the island.'],
    ar: ['باقات عطلات بالي', 'مدرجات الأرز والشواطئ والفلل، مع ترتيب التنقلات والإقامة بين أنحاء الجزيرة.'] },
  { id: 'abu-dhabi', photo: 'abuDhabi', nights: { en: '3 or 5 days', ar: '3 أو 5 أيام' }, region: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
    en: ['Abu Dhabi holiday packages', 'Culture, family attractions and the waterfront, a short trip that is easy to plan from Saudi Arabia.'],
    ar: ['باقات عطلات أبوظبي', 'الثقافة ومعالم العائلة والواجهة البحرية، رحلة قصيرة يسهل التخطيط لها من المملكة.'] },
];

export const travelStyles: TravelStyle[] = [
  { id: 'family', photo: 'familyBeach', en: ['Family trips', 'Practical stays, a relaxed schedule and options suited to every child’s age.'], ar: ['رحلات العائلة', 'إقامة عملية وجدول مريح وخيارات تناسب أعمار الأطفال.'] },
  { id: 'honeymoon', photo: 'maldivesVillas', en: ['Honeymoon trips', 'Resorts, experiences and privacy, chosen for the season and your budget.'], ar: ['رحلات شهر العسل', 'منتجعات وتجارب وخصوصية، تُختار وفق الموسم وميزانيتك.'] },
  { id: 'sports', photo: 'stadium', en: ['Sports tourism', 'Travel, stays and transfers coordinated around the match or event date.'], ar: ['السياحة الرياضية', 'السفر والإقامة والتنقلات منسقة حول موعد المباراة أو الفعالية.'] },
  { id: 'medical', photo: 'medicalPlanning', en: ['Medical tourism', 'Travel and logistics coordinated, while medical decisions remain with qualified healthcare professionals.'], ar: ['السياحة العلاجية', 'تنسيق السفر والترتيبات، مع بقاء القرارات الطبية لدى المختصين المؤهلين.'] },
  { id: 'luxury', photo: 'luxuryPool', en: ['Luxury travel', 'Private stays and experiences with clear standards and verifiable options.'], ar: ['السفر الفاخر', 'إقامات وتجارب خاصة بمعايير واضحة وخيارات يمكن التحقق منها.'] },
  { id: 'adventure', photo: 'adventureRidge', en: ['Adventure travel', 'Outdoor activities and nature experiences, planned around the season and safety requirements.'], ar: ['سفر المغامرات', 'أنشطة خارجية وتجارب في الطبيعة، مخططة وفق الموسم ومتطلبات السلامة.'] },
];

export const travelDestinations: TravelDestination[] = [
  { id: 'maldives', photo: 'maldivesAtolls', region: { en: 'Indian Ocean', ar: 'المحيط الهندي' }, en: ['Maldives', 'Atolls, lagoons and island resorts.', 'Best for honeymoons and rest'], ar: ['المالديف', 'جزر مرجانية وبحيرات ومنتجعات.', 'مثالية لشهر العسل والاسترخاء'] },
  { id: 'santorini', photo: 'santorini', region: { en: 'Greece', ar: 'اليونان' }, en: ['Santorini', 'Cliffside villages above the Aegean.', 'Best for couples and photography'], ar: ['سانتوريني', 'قرى على المنحدرات فوق بحر إيجه.', 'مثالية للأزواج والتصوير'] },
  { id: 'dubai', photo: 'dubai', region: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' }, en: ['Dubai', 'Skyline, shopping and family attractions.', 'Best for short breaks'], ar: ['دبي', 'ناطحات سحاب وتسوق ومعالم للعائلة.', 'مثالية للعطلات القصيرة'] },
  { id: 'paris', photo: 'paris', region: { en: 'France', ar: 'فرنسا' }, en: ['Paris', 'Museums, boulevards and the Seine.', 'Best for culture and cuisine'], ar: ['باريس', 'متاحف وجادات ونهر السين.', 'مثالية للثقافة والمطبخ'] },
  { id: 'bali', photo: 'bali', region: { en: 'Indonesia', ar: 'إندونيسيا' }, en: ['Bali', 'Terraces, temples and tropical coast.', 'Best for nature and wellness'], ar: ['بالي', 'مدرجات ومعابد وساحل استوائي.', 'مثالية للطبيعة والاستجمام'] },
  { id: 'tokyo', photo: 'tokyo', region: { en: 'Japan', ar: 'اليابان' }, en: ['Tokyo', 'Neighbourhoods, food and city lights.', 'Best for first visits to Japan'], ar: ['طوكيو', 'أحياء ومأكولات وأضواء المدينة.', 'مثالية للزيارة الأولى لليابان'] },
];

/** Enquiry preferences only, not a promise of available packages. */
export const enquiryDestinations: [string, string][] = [
  ['Maldives', 'المالديف'], ['Türkiye', 'تركيا'], ['Georgia', 'جورجيا'], ['Bali', 'بالي'], ['Italy', 'إيطاليا'],
  ['Greece', 'اليونان'], ['France', 'فرنسا'], ['Japan', 'اليابان'], ['Switzerland', 'سويسرا'], ['United Arab Emirates', 'الإمارات العربية المتحدة'], ['Other', 'وجهة أخرى'],
];
/** Destination cards preselect the matching enquiry option (city → its country where the form lists countries). */
export const destinationToEnquiry: Record<string, string> = { maldives: 'Maldives', santorini: 'Greece', dubai: 'United Arab Emirates', paris: 'France', bali: 'Bali', tokyo: 'Japan' };
export const travelPurposes: { value: string; en: string; ar: string }[] = [
  { value: 'Holiday', en: 'Holiday', ar: 'عطلة' }, { value: 'Family trip', en: 'Family trip', ar: 'رحلة عائلية' },
  { value: 'Honeymoon', en: 'Honeymoon', ar: 'شهر عسل' }, { value: 'Business travel', en: 'Business travel', ar: 'سفر أعمال' },
  { value: 'Sports event', en: 'Sports event', ar: 'فعالية رياضية' }, { value: 'Medical travel', en: 'Medical travel', ar: 'سفر علاجي' },
  { value: 'Luxury travel', en: 'Luxury travel', ar: 'سفر فاخر' }, { value: 'Adventure', en: 'Adventure', ar: 'مغامرة' },
  { value: 'Umrah', en: 'Umrah', ar: 'عمرة' }, { value: 'Other', en: 'Other', ar: 'أخرى' },
];
/** Travel-style ids map to a preset purpose in the enquiry form (?purpose=). */
export const styleToPurpose: Record<string, string> = { family: 'Family trip', honeymoon: 'Honeymoon', sports: 'Sports event', medical: 'Medical travel', luxury: 'Luxury travel', adventure: 'Adventure' };

export const travelFaqs = {
  en: [
    ['What travel services does Airzone Travel & Tourism provide?', 'We help plan flights, hotels, holiday packages, international and domestic tours, Umrah travel arrangements, airport transfers and corporate travel. We can also guide you through visa requirements and arrange travel insurance on request. Final services depend on the destination, availability and supplier terms.'],
    ['How do I request a tailored travel plan?', 'Send the enquiry form on this page with your dates, number of travellers, budget and what you want from the trip, or call or email the travel team. We review the options and come back with a clear proposal.'],
    ['Do you provide corporate travel services?', 'Yes. We coordinate business trips, flights, hotels, transfers and meetings for companies, keeping traveller details, approvals and changes in one place under each booking’s terms.'],
    ['Can a travel package be tailored to my budget?', 'Yes. Share a budget range and your priorities, and we suggest options that balance the experience, quality and cost. The final price depends on dates, availability and the choices you approve.'],
    ['Do you help with visa applications?', 'We explain the requirements for your destination and help you organise the application steps. Visa decisions are made by the issuing authority, so approval and processing times cannot be guaranteed.'],
    ['Is a booking or price confirmed as soon as I send a request?', 'No. Sending a request does not create a booking. Prices and availability are confirmed in a written proposal, and bookings are made only after you approve it and the applicable change and cancellation terms.'],
    ['How can I contact the Airzone Travel team?', 'Call the travel team, email them, or visit the office in Al Malaz, Riyadh. The contact details are listed in the contact section of this page and in the footer.'],
    ['Which destinations can you arrange travel to?', 'We can look into most international destinations as well as trips within Saudi Arabia. Popular requests include the Maldives, Türkiye, Georgia, Bali, Italy, Japan, Switzerland and the UAE, subject to season and availability.'],
  ],
  ar: [
    ['ما خدمات السفر التي تقدمها إيرزون للسفر والسياحة؟', 'نساعد في التخطيط للرحلات الجوية والفنادق وباقات العطلات والجولات الدولية والداخلية وترتيبات سفر العمرة والتنقل من المطار وإليه وسفر الأعمال. ويمكننا أيضاً إرشادك إلى متطلبات التأشيرات وترتيب تأمين السفر عند الطلب. تعتمد الخدمات النهائية على الوجهة والتوفر وشروط المزودين.'],
    ['كيف أطلب خطة سفر مخصصة؟', 'أرسل نموذج الاستفسار في هذه الصفحة مع تواريخك وعدد المسافرين وميزانيتك وما تريده من الرحلة، أو اتصل بفريق السفر أو راسله. نراجع الخيارات ونعود إليك بعرض واضح.'],
    ['هل تقدمون خدمات سفر الشركات؟', 'نعم. ننسّق رحلات العمل والطيران والفنادق والتنقلات والاجتماعات للشركات، مع جمع بيانات المسافرين والموافقات والتعديلات في مكان واحد وفق شروط كل حجز.'],
    ['هل يمكن تخصيص الباقة وفق ميزانيتي؟', 'نعم. شاركنا نطاق ميزانيتك وأولوياتك، ونقترح خيارات توازن بين التجربة والجودة والتكلفة. يعتمد السعر النهائي على التواريخ والتوفر والخيارات التي توافق عليها.'],
    ['هل تساعدون في طلبات التأشيرة؟', 'نوضح متطلبات وجهتك ونساعدك على تنظيم خطوات التقديم. القرار في التأشيرة للجهة المصدرة، لذلك لا يمكن ضمان الموافقة أو مدة المعالجة.'],
    ['هل يُؤكَّد الحجز أو السعر فور إرسال الطلب؟', 'لا. إرسال الطلب لا يُنشئ حجزاً. يُؤكَّد السعر والتوفر في عرض مكتوب، ولا تتم الحجوزات إلا بعد موافقتك عليه وعلى شروط التعديل والإلغاء المطبقة.'],
    ['كيف أتواصل مع فريق إيرزون للسفر؟', 'اتصل بفريق السفر أو راسله بالبريد الإلكتروني أو زر المكتب في حي الملز بالرياض. بيانات التواصل موجودة في قسم التواصل بهذه الصفحة وفي تذييل الموقع.'],
    ['ما الوجهات التي يمكنكم ترتيب السفر إليها؟', 'يمكننا دراسة معظم الوجهات الدولية إضافة إلى الرحلات داخل المملكة. ومن الطلبات الشائعة المالديف وتركيا وجورجيا وبالي وإيطاليا واليابان وسويسرا والإمارات، وفق الموسم والتوفر.'],
  ],
} as const;
