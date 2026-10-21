import { useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, ShieldCheck } from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { Layout } from '@/components/layout/Layout';
import { PageHero, PhotoImg, SectionHead } from '@/components/ui-kit/Primitives';
import { CustomsForm } from '@/components/forms/CustomsForm';
import { FreightForm, type FreightVariant } from '@/components/forms/FreightForm';
import { presetPageForm } from '@/components/forms/FormKit';
import { DocChecker } from './DocChecker';
import type { Block, Item, Link as PLink, PillarPage, Section } from '@/config/pillars/types';

const n2 = (i: number) => String(i + 1).padStart(2, '0');
const FREIGHT_WIDGETS: Partial<Record<string, FreightVariant>> = { airForm: 'air', seaForm: 'sea', destuffingForm: 'destuffing', exhibitionForm: 'exhibition' };

function Cta({ link, className }: { link: PLink; className: string }) {
  const { locale } = useLocale();
  const label = <>{link.label[locale]}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></>;
  if (link.href.startsWith('#')) return <a href={link.href} className={className} onClick={() => { if (link.preset) presetPageForm(link.preset); }}>{label}</a>;
  return <Link href={link.href} className={className}>{label}</Link>;
}

function ItemBody({ item, heading = 'h3' }: { item: Item; heading?: 'h3' | 'none' }) {
  const { locale } = useLocale();
  return <>
    {item.tag && <span className="pk-tag">{item.tag[locale]}</span>}
    {heading === 'h3' && <h3>{item.title[locale]}</h3>}
    {item.text && <p>{item.text[locale]}</p>}
    {item.points && <ul className="pk-points">{item.points.map(p => <li key={p.en}><Check size={15} aria-hidden="true" />{p[locale]}</li>)}</ul>}
    {item.fields && <dl className="pk-fields">{item.fields.map(f => <div key={f.label.en}><dt>{f.label[locale]}</dt><dd>{f.text[locale]}</dd></div>)}</dl>}
    {item.source && <a className="pk-src" href={item.source.url} target="_blank" rel="noopener noreferrer">{locale === 'ar' ? 'المصدر الرسمي' : 'Official source'}: {item.source.label[locale]}<ArrowUpRight size={13} aria-hidden="true" className="az-flip" /><span className="sr-only"> ({locale === 'ar' ? 'يفتح في نافذة جديدة' : 'opens in a new tab'})</span></a>}
    {item.links && <div className="pk-links">{item.links.map(l => <Cta key={l.href + l.label.en} link={l} className="az-text-link" />)}</div>}
  </>;
}

function BlockView({ block }: { block: Block }) {
  const { locale } = useLocale();
  switch (block.kind) {
    case 'cards':
      return <ul className={`pk-cards cols-${block.columns ?? 3}`} data-stagger>
        {block.items.map(i => <li key={i.id} id={i.id} className={`pk-card ${i.photo ? 'has-photo' : ''}`}>
          {i.photo && <div className="pk-card-media"><PhotoImg photo={i.photo} sizes="(min-width: 1000px) 33vw, (min-width: 640px) 50vw, 100vw" /></div>}
          <div className="pk-card-body"><ItemBody item={i} /></div>
        </li>)}
      </ul>;
    case 'rows':
      return <ol className="pk-rows">
        {block.items.map(i => <li key={i.id} id={i.id} className="pk-row">
          {i.photo && <div className="pk-row-media" data-img-reveal><PhotoImg photo={i.photo} sizes="(min-width: 1000px) 40vw, 100vw" /></div>}
          <div className="pk-row-body" data-reveal><ItemBody item={i} /></div>
        </li>)}
      </ol>;
    case 'steps':
      return <ol className="pk-steps" data-count={block.items.length}>
        {block.items.map((i, k) => <li key={i.id} data-reveal><span className="pk-step-n">{n2(k)}</span><h3>{i.title[locale]}</h3>{i.text && <p>{i.text[locale]}</p>}</li>)}
      </ol>;
    case 'accordion':
      return <div className="pk-acc">
        {block.items.map(i => <details key={i.id} id={i.id} className="pk-acc-item">
          <summary><h3>{i.title[locale]}</h3><ChevronDown size={20} aria-hidden="true" className="pk-acc-icon" /></summary>
          <div className="pk-acc-body"><ItemBody item={i} heading="none" /></div>
        </details>)}
      </div>;
    case 'groups':
      return <div className={`pk-groups count-${Math.min(block.items.length, 4)}`} data-stagger>
        {block.items.map(i => <div key={i.id} id={i.id} className="pk-group"><ItemBody item={i} /></div>)}
      </div>;
    case 'flow':
      return <ol className="pk-flow">
        {block.items.map((i, k) => <li key={i.id} id={i.id} className={`pk-flow-step is-${i.role ?? 'airzone'}`} data-reveal>
          <span className="pk-step-n" aria-hidden="true">{n2(k)}</span>
          <h3>{i.title[locale]}</h3>
          {i.tag && <span className="pk-flow-role">{i.tag[locale]}</span>}
          {i.text && <p>{i.text[locale]}</p>}
        </li>)}
      </ol>;
    case 'chips':
      return <ul className="pk-chips">{block.items.map(c => <li key={c.href}><Cta link={c} className="pk-chip" /></li>)}</ul>;
    case 'widget': {
      if (block.widget === 'docChecker') return <DocChecker />;
      const freight = FREIGHT_WIDGETS[block.widget];
      return <div className="az-card az-form-card pk-form-card">
        {freight ? <FreightForm variant={freight} /> : <CustomsForm variant={block.widget === 'ataForm' ? 'ata' : 'customs'} />}
      </div>;
    }
  }
}

function SectionView({ s }: { s: Section }) {
  const { locale } = useLocale();
  const dark = s.tone === 'dark';
  return <section id={s.id} className={`az-section pk-section ${dark ? 'az-dark' : ''} ${s.tone === 'surface' ? 'is-surface' : ''}`} aria-labelledby={`${s.id}-title`}>
    <div className="az-container">
      <SectionHead light={dark} eyebrow={s.eyebrow[locale]} title={s.title[locale]} text={s.text?.[locale]} id={`${s.id}-title`} />
      {s.blocks.map((b, k) => <BlockView key={k} block={b} />)}
      {s.note && <p className="pk-note">{s.note[locale]}</p>}
      {s.ctas && <div className="pk-ctas">{s.ctas.map((c, k) => <Cta key={c.href} link={c} className={`az-btn ${k === 0 ? (dark ? 'az-btn-primary' : 'az-btn-navy') : (dark ? 'az-btn-outline-light' : 'az-btn-outline')}`} />)}</div>}
    </div>
  </section>;
}

/** Opens a <details> element when a link targets it, here or from another page. */
function useOpenTargetedDetails() {
  useEffect(() => {
    const open = (hash: string) => {
      const el = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (el instanceof HTMLDetailsElement) el.open = true;
    };
    open(window.location.hash);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname === window.location.pathname) open(url.hash);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
}

export function PillarPageView({ page }: { page: PillarPage }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  useOpenTargetedDetails();
  const sections = page.sections;
  return <Layout>
    <PageHero photo={page.photo} split={page.heroSplit} eyebrow={page.eyebrow[locale]} title={page.h1[locale]} intro={page.lead[locale]}
      crumbs={[{ href: '/', label: ar ? 'الرئيسية' : 'Home' }, ...page.parents.map(p => ({ href: p.href, label: p.label[locale] })), { label: page.crumb[locale] }]}>
      {page.ctas.map((c, k) => <Cta key={c.href} link={c} className={`az-btn az-btn-lg ${k === 0 ? 'az-btn-primary' : 'az-btn-outline-light'}`} />)}
    </PageHero>

    {page.notice && <div className="pk-notice-wrap"><div className="az-container"><div className="pk-notice" role="note">
      <ShieldCheck size={22} aria-hidden="true" />
      <div><p className="pk-notice-title">{page.notice.title[locale]}</p><p>{page.notice.text[locale]}</p></div>
    </div></div></div>}

    {sections.map(s => <SectionView key={s.id} s={s} />)}

    {page.faqs.length > 0 && <section className="az-section pk-section pk-faq" aria-labelledby="pk-faq-title">
      <div className="az-container pk-faq-grid">
        <SectionHead eyebrow={ar ? 'أسئلة شائعة' : 'Questions'} title={ar ? 'الأسئلة الشائعة' : 'Frequently asked questions'} id="pk-faq-title" />
        <div className="pk-acc">
          {page.faqs.map((f, k) => <details key={f.q.en} className="pk-acc-item" open={k === 0}>
            <summary><h3>{f.q[locale]}</h3><ChevronDown size={20} aria-hidden="true" className="pk-acc-icon" /></summary>
            <div className="pk-acc-body"><p>{f.a[locale]}</p></div>
          </details>)}
        </div>
      </div>
    </section>}

    <section className="az-section-tight pk-meta" aria-label={ar ? 'روابط ذات صلة' : 'Related links'}>
      <div className="az-container pk-meta-grid">
        <div>
          <h2>{ar ? 'خدمات ذات صلة' : 'Related services'}</h2>
          <ul className="pk-related">{page.related.map(r => <li key={r.href}><Link href={r.href}>{r.label[locale]}<ArrowUpRight size={16} aria-hidden="true" className="az-flip" /></Link></li>)}</ul>
        </div>
        {page.sources && <div>
          <h2>{ar ? 'مصادر رسمية' : 'Official sources'}</h2>
          <ul className="pk-related">{page.sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label[locale]}<ArrowUpRight size={16} aria-hidden="true" className="az-flip" /><span className="sr-only"> ({ar ? 'يفتح في نافذة جديدة' : 'opens in a new tab'})</span></a></li>)}</ul>
        </div>}
      </div>
      <div className="az-container"><p className="pk-legal">{ar
        ? 'هذه الصفحة معلومات عامة وليست مشورة قانونية أو جمركية. تُقيَّم المتطلبات والتوفر والرسوم والمدد لكل حالة وتُؤكَّد في عرض السعر.'
        : 'This page is general information, not legal or customs advice. Requirements, availability, charges and timings are assessed case by case and confirmed in your quotation.'} {ar ? 'آخر تحديث' : 'Updated'}: <time dateTime={page.updated}>{page.updated}</time></p></div>
    </section>
  </Layout>;
}
