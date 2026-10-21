import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Compass, ListChecks, Mail, MapPin, MessageCircle, Phone, Plus, Scale,
} from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { Layout } from '@/components/layout/Layout';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Breadcrumbs, PageHero, PhotoImg, SectionHead, SplitWords } from '@/components/ui-kit/Primitives';
import { TravelForm, presetTravelForm } from '@/components/forms/TravelForm';
import { goToTravelForm } from '@/components/layout/QuoteCta';
import { TravelCta, useTravelWhatsApp } from '@/components/travel/TravelCta';
import { TravelScene } from '@/components/travel/TravelScene';
import { TripPlanner } from '@/components/travel/TripPlanner';
import { TravelSubnav } from '@/components/travel/TravelSubnav';
import { analyticsEvent } from '@/analytics/runtime';
import { businessContacts } from '@/config/business-contacts';
import { destinationToEnquiry, styleToPurpose, travelDestinations, travelFaqs, travelOffers, travelStyles } from '@/config/travel-content';
import type { PhotoKey } from '@/config/photography';

const offerDestination: Record<string, string> = { maldives: 'Maldives', turkiye: 'Türkiye', bali: 'Bali', 'abu-dhabi': 'United Arab Emirates' };

const C = {
  en: {
    crumbs: ['Home', 'Travel & Tourism'],
    eyebrow: 'Airzone Travel & Tourism',
    h1: 'Travel, thoughtfully brought together.',
    lead: 'Thoughtfully planned holidays and business travel, from the first idea to your return.',
    sub: 'We coordinate flights, stays, transfers and experiences with clear options, so you can travel with confidence.',
    wa: 'Plan your trip on WhatsApp', plan: 'Plan your trip', offersCta: 'Explore our offers',
    scroll: 'Ready for takeoff? Scroll down to begin your journey.',
    scene: 'A commercial airliner flies over a tropical island and turquoise lagoon through scattered clouds.',
    facts: [
      ['Riyadh', 'Travel office in Al Malaz'],
      ['Holidays & business', 'Leisure and corporate travel planning'],
      ['Flights · stays · transfers', 'Coordinated in one plan'],
      ['Written proposals', 'Prices and terms confirmed before you book'],
    ],
    offersEyebrow: 'Exclusive offers', offersTitle: 'Exclusive travel offers', offersText: 'Discover handpicked destinations for unforgettable experiences.',
    allOffers: 'View all offers', requestOffer: 'Request this offer',
    offersNote: 'Suggested itineraries. Prices are provided in SAR once availability and itinerary details are confirmed.',
    servicesEyebrow: 'Complete services, shaped around your trip', servicesTitle: 'Travel and tourism services in Saudi Arabia',
    servicesText: 'We bring every part of your trip into one clear track, so you always know what is confirmed and what still needs a choice or approval. Final services vary by destination, availability and supplier terms.',
    services: [
      ['Custom trip design', 'We start with the purpose of your trip, then shape the days, activities and rest stops around the travellers, the season, flight times and your budget.', 'Request a tailored itinerary', '#travel-plan', 'matterhorn'],
      ['Flights & accommodation', 'We compare flight schedules, hotel locations, room and cancellation policies, and confirm up-to-date prices and availability before you book.', 'Explore offers & packages', '/travel/holiday-packages', 'airlinerWing'],
      ['Visa assistance & travel insurance', 'We explain the requirements, organise the application steps and arrange suitable cover on request. Visa decisions always rest with the issuing authority.', 'Ask about your destination', '/travel/visa-assistance', 'airportHall'],
      ['Corporate travel management', 'We coordinate business trips, meetings, transfers and stays, keeping every detail and change in one clear track under each booking’s terms.', 'Discover corporate travel', '/travel/corporate-travel', 'riyadh'],
    ] as [string, string, string, string, PhotoKey][],
    stylesEyebrow: 'Travel styles', stylesTitle: 'Trips that match your travel style',
    stylesText: 'Every trip has its own priorities. Choose the style closest to yours and tell us what matters, and we will shape the options around it.',
    styleCta: 'Plan this trip',
    processEyebrow: 'How we work', processTitle: 'How we plan your trip',
    processText: 'Four simple steps that cut out the guesswork and lead to an itinerary that can actually be delivered.',
    steps: [
      ['Send the essentials', 'Share your dates, number of travellers, budget and what you want from the trip.'],
      ['We review the options', 'We compare destinations, flights, stays and activities by season and availability.'],
      ['You receive a clear proposal', 'We show what the price includes, along with the applicable change and cancellation terms, before you approve.'],
      ['Confirmation and follow-up', 'Once availability is confirmed, we gather your bookings and trip details in one clear file.'],
    ],
    processWa: 'Take the first step on WhatsApp', processPlan: 'Take the first step',
    aboutEyebrow: 'About Airzone Travel & Tourism', aboutTitle: 'Your trusted travel partner',
    about: [
      'Airzone Travel & Tourism is the travel business of Airzone Group, with an office in Al Malaz, Riyadh. We plan holidays, family trips and business travel for people travelling from Saudi Arabia.',
      'Every plan starts with a conversation about the travellers and the purpose of the trip. We research the destination and the season, compare flights and stays, and put the options in a clear written proposal, so you can see what is included before anything is booked.',
    ],
    principles: [
      ['Expert travel guidance', 'Practical recommendations tailored to each journey.'],
      ['Thoughtful value', 'Options that balance experience, quality and budget.'],
      ['Attention to detail', 'Personal follow-up from the initial enquiry through confirmation.'],
    ],
    aboutLink: 'About Airzone Group',
    destEyebrow: 'From Saudi Arabia to the world', destTitle: 'Explore beautiful places',
    destText: 'Discover extraordinary destinations around the world with travel packages designed around your preferences.',
    allDest: 'View all destinations', prev: 'Previous destinations', next: 'Next destinations', enquire: 'Enquire',
    faqEyebrow: 'Questions', faqTitle: 'Frequently asked questions', faqText: 'Find answers to common questions about our services.',
    faqMore: 'Still have a question? Send it with your enquiry and the travel team will reply.',
    contactEyebrow: 'Travel enquiry', contactTitle: 'We are here to help',
    contactText: 'Tell us a little about your travel plans, and our team will help you understand the next steps.',
    ticket: ['Boarding pass', 'From', 'Saudi Arabia', 'To', 'Your next destination'],
    contactHead: 'Airzone Travel & Tourism', call: 'Call the travel team', email: 'Email', office: 'Office', directions: 'Get directions', waChat: 'Chat on WhatsApp',
    finalEyebrow: 'Travel, considered', finalTitle: 'Good planning leaves room for the moments that matter.',
    finalText: 'Start with an idea. We will help you explore the options and shape a journey around what matters to you.',
    browse: 'Browse destinations',
    waHello: 'Hello Airzone Travel & Tourism, I would like help planning a trip.',
    waOffer: (name: string, nights: string) => `Hello Airzone Travel & Tourism, I would like details of the ${name} offer (${nights}).`,
  },
  ar: {
    crumbs: ['الرئيسية', 'السفر والسياحة'],
    eyebrow: 'إيرزون للسفر والسياحة',
    h1: 'سفر يجتمع بعناية.',
    lead: 'عطلات وسفر أعمال مخطط بعناية، من الفكرة الأولى حتى عودتك.',
    sub: 'ننسّق الرحلات الجوية والإقامة والتنقلات والتجارب بخيارات واضحة، لتسافر بثقة.',
    wa: 'خطط لرحلتك عبر واتساب', plan: 'خطط لرحلتك', offersCta: 'استكشف عروضنا',
    scroll: 'مستعد للإقلاع؟ مرّر لأسفل لتبدأ رحلتك.',
    scene: 'طائرة ركاب تحلق فوق جزيرة استوائية وبحيرة فيروزية بين سحب متفرقة.',
    facts: [
      ['الرياض', 'مكتب السفر في حي الملز'],
      ['العطلات والأعمال', 'تخطيط السفر الترفيهي وسفر الشركات'],
      ['طيران · إقامة · تنقلات', 'منسقة في خطة واحدة'],
      ['عروض مكتوبة', 'تأكيد الأسعار والشروط قبل الحجز'],
    ],
    offersEyebrow: 'عروض مختارة', offersTitle: 'عروض سفر مختارة', offersText: 'اكتشف وجهات منتقاة لتجارب لا تُنسى.',
    allOffers: 'عرض جميع العروض', requestOffer: 'اطلب هذا العرض',
    offersNote: 'برامج مقترحة. تُقدَّم الأسعار بالريال السعودي بعد تأكيد التوفر وتفاصيل البرنامج.',
    servicesEyebrow: 'خدمات متكاملة حول رحلتك', servicesTitle: 'خدمات السفر والسياحة في المملكة',
    servicesText: 'نجمع كل أجزاء رحلتك في مسار واحد واضح، لتعرف دائماً ما تم تأكيده وما يحتاج إلى اختيار أو موافقة. تختلف الخدمات النهائية حسب الوجهة والتوفر وشروط المزودين.',
    services: [
      ['تصميم رحلة مخصصة', 'نبدأ بالغرض من رحلتك، ثم نصمم الأيام والأنشطة وأوقات الراحة حول المسافرين والموسم ومواعيد الرحلات وميزانيتك.', 'اطلب برنامجاً مخصصاً', '#travel-plan', 'matterhorn'],
      ['الطيران والإقامة', 'نقارن جداول الرحلات ومواقع الفنادق وسياسات الغرف والإلغاء، ونؤكد الأسعار والتوفر المحدّثة قبل الحجز.', 'استكشف العروض والباقات', '/travel/holiday-packages', 'airlinerWing'],
      ['مساعدة التأشيرات وتأمين السفر', 'نوضح المتطلبات وننظم خطوات التقديم ونرتب التغطية المناسبة عند الطلب. يبقى قرار التأشيرة دائماً للجهة المصدرة.', 'اسأل عن وجهتك', '/travel/visa-assistance', 'airportHall'],
      ['إدارة سفر الشركات', 'ننسّق رحلات العمل والاجتماعات والتنقلات والإقامة، مع جمع كل التفاصيل والتعديلات في مسار واحد وفق شروط كل حجز.', 'اكتشف سفر الشركات', '/travel/corporate-travel', 'riyadh'],
    ] as [string, string, string, string, PhotoKey][],
    stylesEyebrow: 'أنماط السفر', stylesTitle: 'رحلات تناسب أسلوبك في السفر',
    stylesText: 'لكل رحلة أولوياتها. اختر النمط الأقرب إليك وأخبرنا بما يهمك، وسنصمم الخيارات حوله.',
    styleCta: 'خطط لهذه الرحلة',
    processEyebrow: 'كيف نعمل', processTitle: 'كيف نخطط لرحلتك',
    processText: 'أربع خطوات بسيطة تزيل التخمين وتقود إلى برنامج يمكن تنفيذه فعلاً.',
    steps: [
      ['أرسل الأساسيات', 'شاركنا تواريخك وعدد المسافرين وميزانيتك وما تريده من الرحلة.'],
      ['نراجع الخيارات', 'نقارن الوجهات والرحلات والإقامة والأنشطة حسب الموسم والتوفر.'],
      ['تتسلم عرضاً واضحاً', 'نوضح ما يشمله السعر مع شروط التعديل والإلغاء المطبقة قبل موافقتك.'],
      ['التأكيد والمتابعة', 'بعد تأكيد التوفر، نجمع حجوزاتك وتفاصيل رحلتك في ملف واحد واضح.'],
    ],
    processWa: 'ابدأ الخطوة الأولى عبر واتساب', processPlan: 'ابدأ الخطوة الأولى',
    aboutEyebrow: 'عن إيرزون للسفر والسياحة', aboutTitle: 'شريكك الموثوق في السفر',
    about: [
      'إيرزون للسفر والسياحة هي نشاط السفر في مجموعة إيرزون، ولها مكتب في حي الملز بالرياض. نخطط للعطلات والرحلات العائلية وسفر الأعمال للمسافرين من المملكة العربية السعودية.',
      'تبدأ كل خطة بحوار حول المسافرين والغرض من الرحلة. ندرس الوجهة والموسم، ونقارن الرحلات والإقامة، ونضع الخيارات في عرض مكتوب واضح، لترى ما يشمله قبل أي حجز.',
    ],
    principles: [
      ['إرشاد سفر متخصص', 'توصيات عملية مصممة لكل رحلة.'],
      ['قيمة مدروسة', 'خيارات توازن بين التجربة والجودة والميزانية.'],
      ['اهتمام بالتفاصيل', 'متابعة شخصية من الاستفسار الأول حتى التأكيد.'],
    ],
    aboutLink: 'عن مجموعة إيرزون',
    destEyebrow: 'من المملكة إلى العالم', destTitle: 'اكتشف أماكن جميلة',
    destText: 'اكتشف وجهات استثنائية حول العالم مع باقات سفر مصممة وفق تفضيلاتك.',
    allDest: 'عرض جميع الوجهات', prev: 'الوجهات السابقة', next: 'الوجهات التالية', enquire: 'استفسر',
    faqEyebrow: 'أسئلة', faqTitle: 'الأسئلة الشائعة', faqText: 'إجابات عن الأسئلة الشائعة حول خدماتنا.',
    faqMore: 'لديك سؤال آخر؟ أرسله مع استفسارك وسيرد فريق السفر.',
    contactEyebrow: 'استفسار سفر', contactTitle: 'نحن هنا للمساعدة',
    contactText: 'أخبرنا قليلاً عن خطط سفرك، وسيساعدك فريقنا على فهم الخطوات التالية.',
    ticket: ['بطاقة صعود', 'من', 'المملكة العربية السعودية', 'إلى', 'وجهتك التالية'],
    contactHead: 'إيرزون للسفر والسياحة', call: 'اتصل بفريق السفر', email: 'البريد الإلكتروني', office: 'المكتب', directions: 'احصل على الاتجاهات', waChat: 'تحدث عبر واتساب',
    finalEyebrow: 'سفر مدروس', finalTitle: 'التخطيط الجيد يترك مساحة للحظات التي تهمك.',
    finalText: 'ابدأ بفكرة، وسنساعدك على استكشاف الخيارات وتصميم رحلة حول ما يهمك.',
    browse: 'تصفح الوجهات',
    waHello: 'مرحباً إيرزون للسفر والسياحة، أرغب في المساعدة في التخطيط لرحلة.',
    waOffer: (name: string, nights: string) => `مرحباً إيرزون للسفر والسياحة، أرغب في تفاصيل عرض ${name} (${nights}).`,
  },
};

const n2 = (i: number) => String(i + 1).padStart(2, '0');

/** Horizontal destination track: native scroll-snap (swipe, wheel, keyboard) with prev/next controls. */
function DestinationTrack() {
  const { locale } = useLocale();
  const c = C[locale];
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const items = Array.from(el.children) as HTMLElement[];
        const start = el.getBoundingClientRect()[locale === 'ar' ? 'right' : 'left'];
        let best = 0, dist = Infinity;
        items.forEach((it, i) => { const d = Math.abs(it.getBoundingClientRect()[locale === 'ar' ? 'right' : 'left'] - start); if (d < dist) { dist = d; best = i; } });
        setActive(a => (a === best ? a : best));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [locale]);
  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const item = el.children[Math.max(0, Math.min(travelDestinations.length - 1, active + dir))] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
  };
  return <div className="tv-dest">
    <ul className="tv-dest-track" ref={track} tabIndex={0} aria-label={c.destTitle}>
      {travelDestinations.map(d => { const [name, text, best] = d[locale]; return <li key={d.id} className="tv-dest-card">
        <PhotoImg photo={d.photo} sizes="(min-width: 1000px) 34vw, 82vw" className="tv-dest-img" />
        <div className="tv-dest-body">
          <span className="tv-dest-region">{d.region[locale]}</span>
          <h3>{name}</h3>
          <p>{text}</p>
          <span className="tv-dest-best">{best}</span>
          <Link href={`/travel/enquiry?destination=${encodeURIComponent(destinationToEnquiry[d.id])}`} className="tv-dest-link"
            onClick={e => { analyticsEvent('travel_destination_click', { business_division: 'travel', travel_item: d.id }); presetTravelForm({ destination: destinationToEnquiry[d.id] }); goToTravelForm(e); }}>{c.enquire}<span className="sr-only"> — {name}</span><ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </li>; })}
    </ul>
    <div className="tv-dest-controls">
      <span className="tv-dest-count" aria-live="polite"><b>{n2(active)}</b> / {n2(travelDestinations.length - 1)}</span>
      <span className="tv-dest-bar" aria-hidden="true"><i style={{ width: `${((active + 1) / travelDestinations.length) * 100}%` }} /></span>
      <button type="button" className="az-icon-btn" onClick={() => go(-1)} disabled={active === 0} aria-label={c.prev}>{locale === 'ar' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}</button>
      <button type="button" className="az-icon-btn" onClick={() => go(1)} disabled={active === travelDestinations.length - 1} aria-label={c.next}>{locale === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}</button>
      <Link href="/destinations" className="az-text-link">{c.allDest}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
    </div>
  </div>;
}

/** Single-open accordion with proper button/region semantics. */
function Faq() {
  const { locale } = useLocale();
  const [open, setOpen] = useState<number | null>(0);
  return <div className="tv-faq-list">
    {travelFaqs[locale].map(([q, a], i) => {
      const isOpen = open === i;
      return <div key={q} className={`tv-faq-item ${isOpen ? 'is-open' : ''}`}>
        <h3><button type="button" id={`tv-faq-q${i}`} aria-expanded={isOpen} aria-controls={`tv-faq-a${i}`} onClick={() => setOpen(isOpen ? null : i)}>
          <span>{q}</span><Plus size={18} aria-hidden="true" className="tv-faq-icon" />
        </button></h3>
        <div id={`tv-faq-a${i}`} role="region" aria-labelledby={`tv-faq-q${i}`} className="tv-faq-a" hidden={!isOpen}><p>{a}</p></div>
      </div>;
    })}
  </div>;
}

export function TravelLanding() {
  const { locale } = useLocale();
  const c = C[locale];
  const tc = businessContacts.travel;
  const wa = useTravelWhatsApp();
  return <Layout closingCta={false}>
    {/* Hero: the cinematic flight (TravelScene) behind the travel copy */}
    <TravelScene label={c.scene} cue={<a href="#tv-planner" className="tv-scroll"><span>{c.scroll}</span><ArrowDown size={16} aria-hidden="true" /></a>}>
      <div className="az-container tv-hero-inner">
        <Breadcrumbs light items={[{ href: '/', label: c.crumbs[0] }, { label: c.crumbs[1] }]} />
        <span className="tv-hero-logo" data-hero-item="eyebrow"><BrandLogo division="travel" sizes="84px" /></span>
        <p className="az-eyebrow az-eyebrow-light" data-hero-item="eyebrow">{c.eyebrow}</p>
        <h1 id="tv-hero-title"><SplitWords text={c.h1} start={1} /></h1>
        <p className="tv-hero-lead" data-hero-item="text">{c.lead}</p>
        <p className="tv-hero-sub" data-hero-item="text">{c.sub}</p>
        <div className="az-hero-actions">
          <TravelCta className="az-btn az-btn-primary az-btn-lg" message={c.waHello} waLabel={<><MessageCircle size={18} aria-hidden="true" />{c.wa}</>} fallbackLabel={c.plan} fallbackHref="#travel-plan" icon={<ArrowRight size={17} aria-hidden="true" className="az-flip" />} />
          <a href="#offers" className="az-btn az-btn-outline-light az-btn-lg" data-hero-item="cta">{c.offersCta}</a>
        </div>
      </div>
    </TravelScene>

    <TripPlanner />

    {/* Credibility (verified facts only) */}
    <section id="tv-facts" className="tv-facts" aria-label={c.eyebrow}>
      <dl className="az-container tv-facts-grid" data-stagger>
        {c.facts.map(([t, s]) => <div key={t}><dt>{t}</dt><dd>{s}</dd></div>)}
      </dl>
    </section>

    <TravelSubnav />

    {/* Offers */}
    <section id="offers" className="az-section tv-offers" aria-labelledby="tv-offers-title">
      <div className="az-container">
        <SectionHead eyebrow={c.offersEyebrow} title={c.offersTitle} text={c.offersText} id="tv-offers-title">
          <Link href="/travel/holiday-packages" className="az-text-link">{c.allOffers}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </SectionHead>
        <ul className="tv-offer-grid" data-stagger>
          {travelOffers.map((o, i) => { const [name, text] = o[locale]; return <li key={o.id} className="tv-offer">
            <div className="tv-offer-media"><PhotoImg photo={o.photo} sizes="(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 82vw" /><span className="tv-offer-length">{o.nights[locale]}</span></div>
            <div className="tv-offer-body">
              <h3>{name}</h3>
              <p className="tv-offer-meta"><span>{o.region[locale]}</span></p>
              <p>{text}</p>
              <a className="tv-offer-cta" href="#travel-plan" data-cta="offer-form"
                onClick={e => { analyticsEvent('travel_offer_click', { business_division: 'travel', travel_item: o.id }); presetTravelForm({ destination: offerDestination[o.id], offer: `${o.en[0]} (${o.nights.en})` }); goToTravelForm(e); }}>
                {c.requestOffer}<span className="sr-only"> — {name}</span><ArrowUpRight size={16} aria-hidden="true" className="az-flip" />
              </a>
            </div>
          </li>; })}
        </ul>
        <p className="tv-note">{c.offersNote}</p>
      </div>
    </section>

    {/* Services */}
    <section id="tv-services" className="az-section tv-services" aria-labelledby="tv-services-title">
      <div className="az-container">
        <SectionHead eyebrow={c.servicesEyebrow} title={c.servicesTitle} text={c.servicesText} id="tv-services-title" />
        <ol className="tv-service-list">
          {c.services.map(([title, text, cta, href, photo], i) => <li key={title} className="tv-service">
            <div className="tv-service-media" data-img-reveal><PhotoImg photo={photo} sizes="(min-width: 1000px) 46vw, 100vw" /></div>
            <div className="tv-service-body" data-reveal>
              <h3>{title}</h3>
              <p>{text}</p>
              {href.startsWith('#') ? <a href={href} className="az-text-link">{cta}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></a>
                : <Link href={href} className="az-text-link">{cta}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>}
            </div>
          </li>)}
        </ol>
      </div>
    </section>

    {/* Travel styles */}
    <section id="tv-styles" className="az-section tv-styles" aria-labelledby="tv-styles-title">
      <div className="az-container">
        <SectionHead eyebrow={c.stylesEyebrow} title={c.stylesTitle} text={c.stylesText} id="tv-styles-title" />
        <ul className="tv-style-grid" data-stagger>
          {travelStyles.map(s => { const [name, text] = s[locale]; return <li key={s.id} className="tv-style">
            <PhotoImg photo={s.photo} sizes="(min-width: 1000px) 33vw, (min-width: 640px) 50vw, 100vw" />
            <div className="tv-style-body">
              <h3>{name}</h3>
              <p>{text}</p>
              <Link href={`/travel/enquiry?purpose=${encodeURIComponent(styleToPurpose[s.id])}`} className="tv-style-link"
                onClick={e => { analyticsEvent('travel_style_click', { business_division: 'travel', travel_item: s.id }); presetTravelForm({ purpose: styleToPurpose[s.id] }); goToTravelForm(e); }}>{c.styleCta}<span className="sr-only"> — {name}</span><ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link>
            </div>
          </li>; })}
        </ul>
      </div>
    </section>

    {/* Process */}
    <section className="az-section az-dark tv-process" aria-labelledby="tv-process-title">
      <div className="az-container">
        <SectionHead light eyebrow={c.processEyebrow} title={c.processTitle} text={c.processText} id="tv-process-title" />
        <ol className="tv-steps">
          <span className="tv-steps-line" data-scrub-line="x" aria-hidden="true" />
          {c.steps.map(([t, s], i) => <li key={t} data-reveal><span className="tv-step-n">{n2(i)}</span><h3>{t}</h3><p>{s}</p></li>)}
        </ol>
        <div className="tv-process-cta">
          <TravelCta className="az-btn az-btn-primary az-btn-lg" message={c.waHello} waLabel={<><MessageCircle size={18} aria-hidden="true" />{c.processWa}</>} fallbackLabel={c.processPlan} fallbackHref="#travel-plan" icon={<ArrowRight size={17} aria-hidden="true" className="az-flip" />} />
        </div>
      </div>
    </section>

    {/* About */}
    <section className="az-section tv-about" aria-labelledby="tv-about-title">
      <div className="az-container tv-about-grid">
        <div className="tv-about-media" data-img-reveal><PhotoImg photo="airportTerminal" sizes="(min-width: 1000px) 50vw, 100vw" /></div>
        <div className="tv-about-body">
          <SectionHead eyebrow={c.aboutEyebrow} title={c.aboutTitle} id="tv-about-title" />
          {c.about.map(p => <p key={p.slice(0, 20)} className="az-lead" data-reveal>{p}</p>)}
          <ul className="tv-principles" data-stagger>
            {c.principles.map(([t, s], i) => { const Icon = [Compass, Scale, ListChecks][i]; return <li key={t}><span className="tv-principle-icon"><Icon size={20} aria-hidden="true" /></span><div><h3>{t}</h3><p>{s}</p></div></li>; })}
          </ul>
          <Link href="/about" className="az-text-link">{c.aboutLink}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
        </div>
      </div>
    </section>

    {/* Destinations */}
    <section id="tv-destinations" className="az-section tv-destinations" aria-labelledby="tv-dest-title">
      <div className="az-container">
        <SectionHead eyebrow={c.destEyebrow} title={c.destTitle} text={c.destText} id="tv-dest-title" />
        <DestinationTrack />
      </div>
    </section>

    {/* FAQ */}
    <section id="tv-faq" className="az-section tv-faq" aria-labelledby="tv-faq-title">
      <div className="az-container tv-faq-grid">
        <div className="tv-faq-head">
          <SectionHead eyebrow={c.faqEyebrow} title={c.faqTitle} text={c.faqText} id="tv-faq-title" />
          <p className="tv-faq-more"><BadgeCheck size={18} aria-hidden="true" />{c.faqMore}</p>
        </div>
        <Faq />
      </div>
    </section>

    {/* Enquiry + contact */}
    <section id="travel-plan" className="az-section tv-contact" aria-labelledby="tv-contact-title">
      <div className="az-container">
        <SectionHead eyebrow={c.contactEyebrow} title={c.contactTitle} text={c.contactText} id="tv-contact-title" />
        <div className="tv-contact-grid">
          <div className="tv-ticket">
            <div className="tv-ticket-stub" aria-hidden="true">
              <span>{c.ticket[0]}</span>
              <div><small>{c.ticket[1]}</small><b>{c.ticket[2]}</b></div>
              <div><small>{c.ticket[3]}</small><b>{c.ticket[4]}</b></div>
              <span className="tv-ticket-code" dir="ltr">AZT</span>
            </div>
            <div className="tv-ticket-form"><TravelForm /></div>
          </div>
          <div className="tv-contact-card" data-division="travel">
            <span className="tv-contact-logo"><BrandLogo division="travel" sizes="72px" /></span>
            <h3>{c.contactHead}</h3>
            <ul>
              {tc.phone && <li><Phone size={17} aria-hidden="true" /><div><small>{c.call}</small><a href={tc.phone.href} dir="ltr">{tc.phone.label}</a></div></li>}
              <li><Mail size={17} aria-hidden="true" /><div><small>{c.email}</small>{tc.emails.map(e => <a key={e} href={`mailto:${e}`} dir="ltr">{e}</a>)}</div></li>
              {tc.officeAddress && <li><MapPin size={17} aria-hidden="true" /><div><small>{c.office}</small><address dir="ltr">{tc.officeAddress}</address>{tc.mapsUrl && <a href={tc.mapsUrl} target="_blank" rel="noopener noreferrer">{c.directions}<ArrowUpRight size={14} aria-hidden="true" className="az-flip" /></a>}</div></li>}
            </ul>
            {wa && <a className="az-btn az-btn-primary" href={wa(c.waHello)} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" />{c.waChat}</a>}
          </div>
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="tv-final" aria-labelledby="tv-final-title">
      <div className="tv-final-media" aria-hidden="true"><PhotoImg photo="positano" sizes="100vw" parallax /></div>
      <div className="az-container tv-final-inner" data-reveal>
        <p className="az-eyebrow az-eyebrow-light">{c.finalEyebrow}</p>
        <h2 id="tv-final-title">{c.finalTitle}</h2>
        <p>{c.finalText}</p>
        <div className="az-hero-actions">
          <a href="#travel-plan" className="az-btn az-btn-primary az-btn-lg">{c.plan}<ArrowRight size={17} aria-hidden="true" className="az-flip" /></a>
          <Link href="/destinations" className="az-btn az-btn-outline-light az-btn-lg">{c.browse}</Link>
        </div>
      </div>
    </section>
  </Layout>;
}

/** /travel/enquiry: the same bilingual travel form as a standalone page (accepts ?destination=, ?purpose=, ?offer=). */
export function TravelEnquiryPage() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const T = (en: string, a: string) => (ar ? a : en);
  const tc = businessContacts.travel;
  return <Layout closingCta={false}>
    <PageHero photo="airlinerWing" eyebrow={T('Airzone Travel & Tourism', 'إيرزون للسفر والسياحة')}
      title={T('Plan your trip with our travel team', 'خطط لرحلتك مع فريق السفر')}
      intro={T('Tell us a little about your travel plans, and our team will help you understand the options and next steps. Nothing is booked until you approve a written proposal.', 'أخبرنا قليلاً عن خطط سفرك، وسيساعدك فريقنا على فهم الخيارات والخطوات التالية. لا يتم أي حجز قبل موافقتك على عرض مكتوب.')}
      crumbs={[{ href: '/', label: T('Home', 'الرئيسية') }, { href: '/travel', label: T('Travel & Tourism', 'السفر والسياحة') }, { label: T('Travel enquiry', 'استفسار سفر') }]} />
    <section className="az-section tv-contact" aria-label={T('Travel enquiry form', 'نموذج استفسار السفر')}>
      <div className="az-container tv-contact-grid">
        <div className="tv-ticket"><div className="tv-ticket-form"><TravelForm source="Website travel enquiry page" /></div></div>
        <div className="tv-contact-card" data-division="travel">
          <span className="tv-contact-logo"><BrandLogo division="travel" sizes="72px" /></span>
          <h2>{T('Airzone Travel & Tourism', 'إيرزون للسفر والسياحة')}</h2>
          <ul>
            {tc.phone && <li><Phone size={17} aria-hidden="true" /><div><small>{T('Call the travel team', 'اتصل بفريق السفر')}</small><a href={tc.phone.href} dir="ltr">{tc.phone.label}</a></div></li>}
            <li><Mail size={17} aria-hidden="true" /><div><small>{T('Email', 'البريد الإلكتروني')}</small>{tc.emails.map(e => <a key={e} href={`mailto:${e}`} dir="ltr">{e}</a>)}</div></li>
            {tc.officeAddress && <li><MapPin size={17} aria-hidden="true" /><div><small>{T('Office', 'المكتب')}</small><address dir="ltr">{tc.officeAddress}</address></div></li>}
          </ul>
        </div>
      </div>
    </section>
  </Layout>;
}
