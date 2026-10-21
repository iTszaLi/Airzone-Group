import { ArrowUpRight, Check, ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { businessContacts } from '@/config/business-contacts';

const G = {
  en: {
    corporate: { title: 'Planning business travel', intro: 'Corporate travel works best when the basics are agreed early. Send traveller names, dates, route and approval needs, and the travel team will confirm the arrangements.',
      list: ['Traveller names as they appear on passports', 'Dates, route and preferred flight times', 'Hotel location and nights required', 'Visa needs for each traveller', 'Approval or invoicing requirements', 'A single contact for changes'] },
    general: { title: 'Before you enquire', intro: 'A few details help the travel team respond usefully. Rules for visas and bookings vary by destination, so we confirm current requirements for your trip.',
      list: ['Destination and travel dates', 'Number and ages of travellers', 'Passport validity and nationality', 'Preferred flights, hotels or experiences', 'Budget range, if you have one'] },
    faqTitle: 'Common questions', checklist: 'Checklist', office: 'Travel team contact', directions: 'Get directions', newTab: ' (opens in a new tab)',
    faqs: [{ question: 'Can the team arrange visas?', answer: 'The team can guide you on requirements and help with the process where possible. Approval is decided by the relevant authority.' }, { question: 'Do you quote prices on this page?', answer: 'No. Fares and packages change, so prices are confirmed when you enquire.' }, { question: 'Can I book for a group?', answer: 'Yes. Share the group size and dates and the team will outline the options.' }],
  },
  ar: {
    corporate: { title: 'التخطيط لسفر الأعمال', intro: 'يسير سفر الأعمال بسلاسة أكبر عند الاتفاق على الأساسيات مبكراً. أرسل أسماء المسافرين والتواريخ والمسار ومتطلبات الاعتماد، ويؤكد فريق السفر الترتيبات.',
      list: ['أسماء المسافرين كما في جوازات السفر', 'التواريخ والمسار وأوقات الرحلات المفضلة', 'موقع الفندق وعدد الليالي', 'احتياج كل مسافر إلى تأشيرة', 'متطلبات الاعتماد أو الفوترة', 'جهة اتصال واحدة للتعديلات'] },
    general: { title: 'قبل أن ترسل استفسارك', intro: 'تساعد بعض التفاصيل فريق السفر على الرد بصورة مفيدة. تختلف متطلبات التأشيرات والحجوزات حسب الوجهة، لذلك نؤكد المتطلبات الحالية لرحلتك.',
      list: ['الوجهة وتواريخ السفر', 'عدد المسافرين وأعمارهم', 'الجنسية وصلاحية جواز السفر', 'الرحلات أو الفنادق أو التجارب المفضلة', 'نطاق الميزانية إن وجد'] },
    faqTitle: 'أسئلة شائعة', checklist: 'قائمة التحقق', office: 'التواصل مع فريق السفر', directions: 'احصل على الاتجاهات', newTab: ' (يفتح في نافذة جديدة)',
    faqs: [{ question: 'هل يستطيع الفريق ترتيب التأشيرات؟', answer: 'يرشدك الفريق إلى المتطلبات ويساعد في الإجراءات متى أمكن. القرار النهائي للجهة المختصة.' }, { question: 'هل تذكرون الأسعار في هذه الصفحة؟', answer: 'لا. تتغير الأسعار والباقات، لذلك تُؤكَّد عند الاستفسار.' }, { question: 'هل يمكن الحجز لمجموعة؟', answer: 'نعم. شارك عدد المجموعة والتواريخ ويوضح الفريق الخيارات.' }],
  },
};

export function TravelGuide({ locale, corporate }: { locale: 'en' | 'ar'; corporate: boolean }) {
  const g = G[locale];
  const tc = businessContacts.travel;
  const block = corporate ? g.corporate : g.general;
  return <>
    <section className="az-section-tight svc-sec" aria-labelledby="tv-guide-title">
      <div className="az-container svc-two">
        <div data-reveal><h2 id="tv-guide-title">{block.title}</h2><p className="az-lead">{block.intro}</p></div>
        <div className="az-card" data-reveal data-delay="0.08"><h3>{g.checklist}</h3>
          <ul className="az-checks">{block.list.map(x => <li key={x}><Check size={16} aria-hidden="true" />{x}</li>)}</ul></div>
      </div>
    </section>
    <section className="az-section-tight svc-sec">
      <div className="az-container svc-two">
        <div data-reveal>
          <h2>{g.faqTitle}</h2>
          <div className="svc-faq">{g.faqs.map(f => <details key={f.question}>
            <summary><span>{f.question}</span><ChevronDown size={18} aria-hidden="true" /></summary>
            <p>{f.answer}</p>
          </details>)}</div>
        </div>
        <div data-reveal data-delay="0.08" data-testid="travel-office-contact">
          <h2>{g.office}</h2>
          <ul className="az-contact-list">
            {tc.officeAddress && <li><MapPin size={18} aria-hidden="true" /><span dir="ltr">{tc.officeAddress}</span></li>}
            {tc.phone && <li><Phone size={18} aria-hidden="true" /><a href={tc.phone.href} dir="ltr">{tc.phone.label}</a></li>}
            {tc.emails.map(e => <li key={e}><Mail size={18} aria-hidden="true" /><a href={`mailto:${e}`} dir="ltr" data-division="travel">{e}</a></li>)}
            {tc.mapsUrl && <li><ArrowUpRight size={18} aria-hidden="true" className="az-flip" /><a href={tc.mapsUrl} target="_blank" rel="noopener noreferrer">{g.directions}<span className="sr-only">{g.newTab}</span></a></li>}
          </ul>
        </div>
      </div>
    </section>
  </>;
}
