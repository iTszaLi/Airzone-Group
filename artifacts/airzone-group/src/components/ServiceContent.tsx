import { ArrowUpRight, Check, ChevronDown, Info } from 'lucide-react';
import { Link } from '@/site/locale';
import { logisticsContent, type ServiceContent as Data } from '@/config/logistics-content';
import { catalogByPath } from '@/config/service-catalog';

const L = {
  en: { includes: 'What is included', customers: 'Who it is for', process: 'How it works', docs: 'Documents to prepare', docsNote: 'Requirements depend on the shipment and current regulations. The team confirms what applies.', coverage: 'Coverage', faq: 'Common questions', related: 'Related services', sources: 'Official sources', limits: 'Please note', limitsText: 'This page is general information, not legal or customs advice. Requirements, availability, charges and timings are assessed case by case and confirmed in your quotation. Delivery times and official approvals are not guaranteed.', updated: 'Content updated', locations: 'Service locations' },
  ar: { includes: 'ما تشمله الخدمة', customers: 'لمن هذه الخدمة', process: 'كيف تعمل', docs: 'المستندات التي ينبغي تجهيزها', docsNote: 'تعتمد المتطلبات على الشحنة والأنظمة الحالية، ويؤكد الفريق ما ينطبق.', coverage: 'التغطية', faq: 'أسئلة شائعة', related: 'خدمات ذات صلة', sources: 'مصادر رسمية', limits: 'يرجى الانتباه', limitsText: 'هذه الصفحة معلومات عامة وليست مشورة قانونية أو جمركية. تُقيَّم المتطلبات والتوفر والرسوم والمدد لكل حالة وتُؤكَّد في عرض السعر، ولا تُضمن مواعيد التسليم أو الموافقات الرسمية.', updated: 'آخر تحديث للمحتوى', locations: 'مواقع الخدمة' },
};

/** Structured service detail. FAQ text is visible on the page and mirrors the FAQPage schema. */
export function ServiceContent({ locale, data }: { locale: 'en' | 'ar'; data: Data }) {
  const c = data[locale];
  const t = L[locale];
  const relatedName = (r: string) => catalogByPath[r]?.[locale].name ?? logisticsContent[r]?.[locale].title ?? (r === '/locations' ? t.locations : r);
  return <div className="svc">
    <section className="az-section-tight svc-sec">
      <div className="az-container svc-two">
        <div className="az-card" data-reveal><h2>{t.includes}</h2><ul className="az-checks">{c.includes.map(x => <li key={x}><Check size={16} aria-hidden="true" />{x}</li>)}</ul></div>
        <div className="az-card" data-reveal data-delay="0.08"><h2>{t.customers}</h2><ul className="az-checks">{c.customers.map(x => <li key={x}><Check size={16} aria-hidden="true" />{x}</li>)}</ul></div>
      </div>
    </section>
    <section className="az-section-tight svc-sec svc-process">
      <div className="az-container">
        <h2 data-reveal>{t.process}</h2>
        <ol className="svc-steps" data-stagger>{c.process.map((s, i) => <li key={s.title}><span className="az-step-n">0{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></li>)}</ol>
      </div>
    </section>
    <section className="az-section-tight svc-sec">
      <div className="az-container svc-two">
        <div data-reveal>
          <h2>{c.prepareTitle ?? t.docs}</h2>
          <ul className="az-checks">{c.documents.map(x => <li key={x}><Check size={16} aria-hidden="true" />{x}</li>)}</ul>
          <p className="az-muted">{c.prepareNote ?? t.docsNote}</p>
        </div>
        <div data-reveal data-delay="0.08">
          <h2>{t.coverage}</h2>
          <p>{c.coverage}</p>
          <div className="az-note az-note-block"><Info size={17} aria-hidden="true" /><div><b>{t.limits}</b><p>{t.limitsText}</p></div></div>
        </div>
      </div>
    </section>
    <section className="az-section-tight svc-sec">
      <div className="az-container svc-faq-wrap">
        <h2 data-reveal>{t.faq}</h2>
        <div className="svc-faq">{c.faqs.map(f => <details key={f.question}>
          <summary><span>{f.question}</span><ChevronDown size={18} aria-hidden="true" /></summary>
          <p>{f.answer}</p>
        </details>)}</div>
      </div>
    </section>
    <section className="az-section-tight svc-sec">
      <div className="az-container svc-two">
        <div><h2>{t.related}</h2><ul className="svc-links">{c.related.map(r => <li key={r}><Link href={r}>{relatedName(r)}<ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link></li>)}</ul></div>
        {c.sources.length > 0 && <div><h2>{t.sources}</h2><ul className="svc-links">{c.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}<ArrowUpRight size={16} aria-hidden="true" className="az-flip" /><span className="sr-only">{locale === 'ar' ? ' (يفتح في نافذة جديدة)' : ' (opens in a new tab)'}</span></a></li>)}</ul></div>}
      </div>
    </section>
  </div>;
}
