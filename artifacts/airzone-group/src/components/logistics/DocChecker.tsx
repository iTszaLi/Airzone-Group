import { useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, ClipboardCheck, Info } from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { buildChecklist, categories, directions, modes, type Category, type CheckGroup, type CheckInput, type Direction, type Mode } from '@/config/pillars/doc-rules';

/**
 * "Find the documents required for your shipment": builds an indicative
 * checklist in the browser. Nothing is sent anywhere; results always carry a
 * disclaimer and a link to request a confirmed assessment.
 */
export function DocChecker() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const L = (en: string, a: string) => (ar ? a : en);
  const [result, setResult] = useState<{ groups: CheckGroup[]; input: CheckInput; cargo: string } | null>(null);
  const out = useRef<HTMLDivElement>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const input: CheckInput = {
      direction: (f.get('direction') as Direction) || 'import',
      mode: (f.get('mode') as Mode) || 'sea',
      categories: f.getAll('category') as Category[],
      hsKnown: String(f.get('hs') || '').trim().length >= 4,
      carnet: (f.get('carnet') as CheckInput['carnet']) || 'unsure',
    };
    setResult({ groups: buildChecklist(input), input, cargo: String(f.get('cargo') || '').trim() });
    requestAnimationFrame(() => { out.current?.focus(); out.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
  };

  const quoteHref = (() => {
    if (!result) return '/logistics/customs-clearance#customs-quote';
    const map: Partial<Record<Category, string>> = { food: 'food', medicines: 'pharma', devices: 'pharma', cosmetics: 'general', electrical: 'electrical', telecom: 'electrical', vehicles: 'automotive', machinery: 'machinery', chemicals: 'chemicals', exhibition: 'exhibition', aviation: 'general', agri: 'food', general: 'general' };
    const cargo = map[result.input.categories[0] ?? 'general'] ?? 'general';
    const direction = result.input.direction === 'reexport' ? 'reexport' : result.input.direction;
    return `/logistics/customs-clearance?cargo=${cargo}&direction=${direction}#customs-quote`;
  })();

  return <div className="pk-checker">
    <form className="pk-checker-form" onSubmit={submit} aria-label={L('Document checker', 'أداة التحقق من المستندات')}>
      <div className="pk-checker-grid">
        <label className="az-field"><span>{L('Shipment type', 'نوع الشحنة')}</span>
          <select name="direction" defaultValue="import">{directions.map(d => <option key={d.value} value={d.value}>{d.label[locale]}</option>)}</select></label>
        <label className="az-field"><span>{L('Transport mode', 'وسيلة النقل')}</span>
          <select name="mode" defaultValue="sea">{modes.map(m => <option key={m.value} value={m.value}>{m.label[locale]}</option>)}</select></label>
        <label className="az-field"><span>{L('Country of origin', 'بلد المنشأ')}</span><input name="origin" maxLength={80} autoComplete="off" /></label>
        <label className="az-field"><span>{L('Destination', 'الوجهة')}</span><input name="destination" maxLength={80} autoComplete="off" /></label>
        <label className="az-field"><span>{L('Cargo description', 'وصف البضاعة')}</span><input name="cargo" maxLength={120} autoComplete="off" /></label>
        <label className="az-field"><span>{L('HS code, if known', 'الرمز الجمركي إن وُجد')}</span><input name="hs" maxLength={20} dir="ltr" autoComplete="off" /></label>
        <label className="az-field"><span>{L('Is an ATA Carnet available?', 'هل يتوفر دفتر ATA Carnet؟')}</span>
          <select name="carnet" defaultValue="unsure"><option value="unsure">{L('Not applicable / not sure', 'لا ينطبق / غير متأكد')}</option><option value="yes">{L('Yes', 'نعم')}</option><option value="no">{L('No', 'لا')}</option></select></label>
      </div>
      <fieldset className="pk-checks">
        <legend>{L('What does the shipment include? Choose all that apply.', 'ماذا تتضمن الشحنة؟ اختر كل ما ينطبق.')}</legend>
        <div>{categories.map(c => <label key={c.value}><input type="checkbox" name="category" value={c.value} /><span>{c.label[locale]}</span></label>)}</div>
      </fieldset>
      <button type="submit" className="az-btn az-btn-primary"><ClipboardCheck size={17} aria-hidden="true" />{L('Show indicative checklist', 'اعرض القائمة الاسترشادية')}</button>
    </form>
    <div ref={out} className="pk-checker-out" tabIndex={-1} aria-live="polite">
      {result && <>
        <h3>{L('Indicative checklist', 'قائمة استرشادية')}{result.cargo && <span> — {result.cargo}</span>}</h3>
        <div className="pk-checker-groups">
          {result.groups.map(g => <section key={g.title.en}>
            <h4>{g.title[locale]}</h4>
            <ul>{g.items.map(i => <li key={i.text.en}>{i.text[locale]}{i.url && <> <a href={i.url} target="_blank" rel="noopener noreferrer" className="pk-src">{L('Official source', 'المصدر الرسمي')}<ArrowUpRight size={13} aria-hidden="true" className="az-flip" /><span className="sr-only"> ({L('opens in a new tab', 'يفتح في نافذة جديدة')})</span></a></>}</li>)}</ul>
          </section>)}
        </div>
        <p className="pk-checker-note"><Info size={17} aria-hidden="true" />{L('This list is indicative and is not an official determination. Final requirements depend on the exact goods, classification, origin and current regulations, and must be confirmed for your shipment.', 'هذه القائمة استرشادية وليست قراراً رسمياً، وتعتمد المتطلبات النهائية على البضائع وتصنيفها ومنشئها والأنظمة الحالية، ويجب تأكيدها لشحنتك.')}</p>
        <Link href={quoteHref} className="az-btn az-btn-navy">{L('Ask us to confirm the requirements', 'اطلب منا تأكيد المتطلبات')}<ArrowRight size={16} aria-hidden="true" className="az-flip" /></Link>
      </>}
    </div>
  </div>;
}
