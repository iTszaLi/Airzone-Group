import type { ReactNode } from 'react';
import { ArrowUpRight, Check, Mail, MapPin, Phone } from 'lucide-react';
import { businessContacts } from '@/config/business-contacts';

type LinkLike = (props: { href: string; className?: string; children?: ReactNode }) => ReactNode;

const G = {
  en: {
    corporate: { title: 'Planning business travel', intro: 'Corporate travel works best when the basics are agreed early. Send traveller names, dates, route and approval needs, and the travel team will confirm the arrangements.',
      list: ['Traveller names as they appear on passports', 'Dates, route and preferred flight times', 'Hotel location and nights required', 'Visa needs for each traveller', 'Approval or invoicing requirements', 'A single contact for changes'] },
    general: { title: 'Before you enquire', intro: 'A few details help the travel team respond usefully. Rules for visas and bookings vary by destination, so we confirm current requirements for your trip.',
      list: ['Destination and travel dates', 'Number and ages of travellers', 'Passport validity and nationality', 'Preferred flights, hotels or experiences', 'Budget range, if you have one'] },
    faqTitle: 'Common questions', checklist: 'Checklist', office: 'Travel team contact', directions: 'Get directions',
    faqs: [{ question: 'Can the team arrange visas?', answer: 'The team can guide you on requirements and help with the process where possible. Approval is decided by the relevant authority.' }, { question: 'Do you quote prices on this page?', answer: 'No. Fares and packages change, so prices are confirmed when you enquire.' }, { question: 'Can I book for a group?', answer: 'Yes. Share the group size and dates and the team will outline the options.' }],
    links: [['Plan a trip', '/travel/enquiry'], ['Corporate travel', '/travel/corporate-travel'], ['Visa assistance', '/travel/visa-assistance'], ['Flights', '/travel/flights']],
  },
  ar: {
    corporate: { title: 'التخطيط لسفر الأعمال', intro: 'يسير سفر الأعمال بسلاسة أكبر عند الاتفاق على الأساسيات مبكراً. أرسل أسماء المسافرين والتواريخ والمسار ومتطلبات الاعتماد، ويؤكد فريق السفر الترتيبات.',
      list: ['أسماء المسافرين كما في جوازات السفر', 'التواريخ والمسار وأوقات الرحلات المفضلة', 'موقع الفندق وعدد الليالي', 'احتياج كل مسافر إلى تأشيرة', 'متطلبات الاعتماد أو الفوترة', 'جهة اتصال واحدة للتعديلات'] },
    general: { title: 'قبل أن ترسل استفسارك', intro: 'تساعد بعض التفاصيل فريق السفر على الرد بصورة مفيدة. تختلف متطلبات التأشيرات والحجوزات حسب الوجهة، لذلك نؤكد المتطلبات الحالية لرحلتك.',
      list: ['الوجهة وتواريخ السفر', 'عدد المسافرين وأعمارهم', 'الجنسية وصلاحية جواز السفر', 'الرحلات أو الفنادق أو التجارب المفضلة', 'نطاق الميزانية إن وجد'] },
    faqTitle: 'أسئلة شائعة', checklist: 'قائمة التحقق', office: 'التواصل مع فريق السفر', directions: 'احصل على الاتجاهات',
    faqs: [{ question: 'هل يستطيع الفريق ترتيب التأشيرات؟', answer: 'يرشدك الفريق إلى المتطلبات ويساعد في الإجراءات متى أمكن. القرار النهائي للجهة المختصة.' }, { question: 'هل تذكرون الأسعار في هذه الصفحة؟', answer: 'لا. تتغير الأسعار والباقات، لذلك تُؤكَّد عند الاستفسار.' }, { question: 'هل يمكن الحجز لمجموعة؟', answer: 'نعم. شارك عدد المجموعة والتواريخ ويوضح الفريق الخيارات.' }],
    links: [['خطط لرحلة', '/travel/enquiry'], ['سفر الأعمال', '/travel/corporate-travel'], ['مساعدة التأشيرات', '/travel/visa-assistance'], ['الطيران', '/travel/flights']],
  },
};

export function TravelGuide({ locale, corporate, Link }: { locale: 'en' | 'ar'; corporate: boolean; Link: LinkLike }) {
  const g = G[locale];
  const tc = businessContacts.travel;
  const block = corporate ? g.corporate : g.general;
  return <section className="svc svc-travel" dir={locale === 'ar' ? 'rtl' : undefined}>
    <div className="svc-sec svc-two">
      <div><h2>{block.title}</h2><p>{block.intro}</p></div>
      <div><h3>{g.checklist}</h3><ul className="svc-list">{block.list.map(x => <li key={x}><Check size={15} aria-hidden="true" />{x}</li>)}</ul></div>
    </div>
    <div className="svc-sec svc-two">
      <div><h2>{g.faqTitle}</h2><div className="svc-faq">{g.faqs.map(f => <details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div></div>
      <div><ul className="svc-links">{g.links.map(([n, h]) => <li key={h}><Link href={h}>{n}<ArrowUpRight size={15} aria-hidden="true" /></Link></li>)}</ul></div>
    </div>
    <div className="svc-sec svc-office" data-testid="travel-office-contact">
      <h2>{g.office}</h2>
      <ul className="svc-list svc-contact">
        {tc.officeAddress && <li><MapPin size={15} aria-hidden="true" /><span dir="ltr">{tc.officeAddress}</span></li>}
        {tc.phone && <li><Phone size={15} aria-hidden="true" /><a href={tc.phone.href} dir="ltr">{tc.phone.label}</a></li>}
        {tc.emails.map(e => <li key={e}><Mail size={15} aria-hidden="true" /><a href={`mailto:${e}`} dir="ltr">{e}</a></li>)}
        {tc.mapsUrl && <li><ArrowUpRight size={15} aria-hidden="true" /><a href={tc.mapsUrl} target="_blank" rel="noopener noreferrer">{g.directions}</a></li>}
      </ul>
    </div>
  </section>;
}
