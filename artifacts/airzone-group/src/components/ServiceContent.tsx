import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Check, Mail } from 'lucide-react';
import { logisticsContent, type ServiceContent as Data } from '@/config/logistics-content';
import { businessContacts } from '@/config/business-contacts';

type LinkLike = (props: { href: string; className?: string; children?: ReactNode }) => ReactNode;

const L = {
  en: { includes: 'What is included', customers: 'Who it is for', process: 'How it works', docs: 'Documents to prepare', docsNote: 'Requirements depend on the shipment and current regulations. The team confirms what applies.', coverage: 'Coverage', faq: 'Common questions', related: 'Related services', sources: 'Official sources', limits: 'Please note', limitsText: 'This page is general information, not legal or customs advice. Requirements, charges and timings are assessed shipment by shipment and confirmed in the quotation. Airzone does not promise clearance outcomes or delivery times.', updated: 'Content updated', ctaTitle: 'Tell us about your shipment', ctaText: 'Send the cargo, route and dates and the logistics team will respond with what they need to quote.', cta: 'Request a quote', email: 'Email the logistics team' },
  ar: { includes: 'ما تشمله الخدمة', customers: 'لمن هذه الخدمة', process: 'كيف تعمل', docs: 'المستندات التي ينبغي تجهيزها', docsNote: 'تعتمد المتطلبات على الشحنة والأنظمة الحالية، ويؤكد الفريق ما ينطبق.', coverage: 'التغطية', faq: 'أسئلة شائعة', related: 'خدمات ذات صلة', sources: 'مصادر رسمية', limits: 'يرجى الانتباه', limitsText: 'هذه الصفحة معلومات عامة وليست مشورة قانونية أو جمركية. تُقيَّم المتطلبات والرسوم والمدد لكل شحنة وتُؤكَّد في عرض السعر. لا تَعِد إيرزون بنتائج التخليص أو مواعيد التسليم.', updated: 'آخر تحديث للمحتوى', ctaTitle: 'أخبرنا عن شحنتك', ctaText: 'أرسل البضاعة والمسار والمواعيد، وسيرد فريق الخدمات اللوجستية بما يحتاجه لإعداد عرض السعر.', cta: 'اطلب عرض سعر', email: 'راسل فريق الخدمات اللوجستية' },
};

export function ServiceContent({ locale, data, Link }: { locale: 'en' | 'ar'; data: Data; Link: LinkLike }) {
  const c = data[locale];
  const t = L[locale];
  const email = businessContacts.logistics.emails[0];
  return <div className="svc" dir={locale === 'ar' ? 'rtl' : undefined}>
    <section className="svc-sec svc-two">
      <div><h2>{t.includes}</h2><ul className="svc-list">{c.includes.map(x => <li key={x}><Check size={15} aria-hidden="true" />{x}</li>)}</ul></div>
      <div><h2>{t.customers}</h2><ul className="svc-list">{c.customers.map(x => <li key={x}><Check size={15} aria-hidden="true" />{x}</li>)}</ul></div>
    </section>
    <section className="svc-sec">
      <h2>{t.process}</h2>
      <ol className="svc-steps">{c.process.map((s, i) => <li key={s.title}><i>0{i + 1}</i><h3>{s.title}</h3><p>{s.text}</p></li>)}</ol>
    </section>
    <section className="svc-sec svc-two">
      <div><h2>{t.docs}</h2><ul className="svc-list">{c.documents.map(x => <li key={x}><Check size={15} aria-hidden="true" />{x}</li>)}</ul><p className="svc-note">{t.docsNote}</p></div>
      <div><h2>{t.coverage}</h2><p>{c.coverage}</p>
        <div className="svc-limits"><b>{t.limits}</b><p>{t.limitsText}</p></div></div>
    </section>
    <section className="svc-sec">
      <h2>{t.faq}</h2>
      <div className="svc-faq">{c.faqs.map(f => <details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div>
    </section>
    <section className="svc-sec svc-two">
      <div><h2>{t.related}</h2><ul className="svc-links">{c.related.map(r => <li key={r}><Link href={r}>{logisticsContent[r]?.[locale].title ?? r}<ArrowUpRight size={15} aria-hidden="true" /></Link></li>)}</ul></div>
      {c.sources.length > 0 && <div><h2>{t.sources}</h2><ul className="svc-links">{c.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}<ArrowUpRight size={15} aria-hidden="true" /></a></li>)}</ul></div>}
    </section>
    <p className="svc-updated">{t.updated}: <time dateTime={data.updatedAt}>{data.updatedAt}</time></p>
    <section className="svc-cta">
      <div><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div>
      <div className="svc-cta-actions">
        <Link href="/logistics/request-quote" className="button button-gold">{t.cta} <ArrowRight size={16} aria-hidden="true" /></Link>
        <a href={`mailto:${email}`} className="svc-mail" dir="ltr"><Mail size={15} aria-hidden="true" />{t.email}</a>
      </div>
    </section>
  </div>;
}
