import { useEffect, useId, useRef, useState, type FocusEvent, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, LoaderCircle, Mail, Send } from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { businessContacts } from '@/config/business-contacts';

/**
 * Phone pattern for <input pattern>. Browsers compile pattern attributes with
 * the `v` regex flag, where (, ), - and + must be escaped inside a class;
 * the unescaped form is rejected and the field would go unvalidated.
 */
export const PHONE_PATTERN = String.raw`[\+0-9\(\)\-\s]{7,25}`;

type Option = { value: string; label: string };
type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const MSG = {
  en: {
    missing: (l: string) => `Please enter ${l.toLowerCase()}.`, choose: (l: string) => `Please choose ${l.toLowerCase()}.`,
    email: 'Enter a valid email address, for example name@company.com.', phone: 'Enter a valid phone number, including the country code if outside Saudi Arabia.',
    short: (n: number) => `Please enter at least ${n} characters.`, long: (n: number) => `Please keep this under ${n} characters.`,
    range: 'Please enter a value in the allowed range.', invalid: 'Please check this field.',
    summary: (n: number) => (n === 1 ? 'Please correct 1 field before sending.' : `Please correct ${n} fields before sending.`),
    optional: 'optional', required: 'required', select: 'Select an option',
  },
  ar: {
    missing: (l: string) => `يرجى إدخال ${l}.`, choose: (l: string) => `يرجى اختيار ${l}.`,
    email: 'أدخل بريداً إلكترونياً صحيحاً، مثل name@company.com.', phone: 'أدخل رقم هاتف صحيحاً مع رمز الدولة إذا كان خارج المملكة.',
    short: (n: number) => `يرجى إدخال ${n} أحرف على الأقل.`, long: (n: number) => `يرجى ألا يتجاوز النص ${n} حرفاً.`,
    range: 'يرجى إدخال قيمة ضمن النطاق المسموح.', invalid: 'يرجى مراجعة هذا الحقل.',
    summary: (n: number) => (n === 1 ? 'يرجى تصحيح حقل واحد قبل الإرسال.' : `يرجى تصحيح ${n} حقول قبل الإرسال.`),
    optional: 'اختياري', required: 'مطلوب', select: 'اختر خياراً',
  },
};

function messageFor(el: Control, label: string, locale: 'en' | 'ar') {
  const t = MSG[locale];
  const v = el.validity;
  if (v.customError) return el.validationMessage;
  if (v.valueMissing) return el.tagName === 'SELECT' ? t.choose(label) : t.missing(label);
  if (v.typeMismatch && (el as HTMLInputElement).type === 'email') return t.email;
  if (v.patternMismatch && (el as HTMLInputElement).type === 'tel') return t.phone;
  if (v.tooShort) return t.short((el as HTMLInputElement).minLength);
  if (v.tooLong) return t.long((el as HTMLInputElement).maxLength);
  if (v.rangeUnderflow || v.rangeOverflow || v.stepMismatch || v.badInput) return t.range;
  return t.invalid;
}

export type FieldProps = {
  label: string; name: string; type?: string; required?: boolean; hint?: string; placeholder?: string;
  options?: Option[]; rows?: number; autoComplete?: string; inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal';
  minLength?: number; maxLength?: number; min?: number | string; max?: number | string; pattern?: string;
  defaultValue?: string; wide?: boolean; dir?: 'ltr' | 'rtl' | 'auto';
};

/** Native control with a visible label, optional hint and a linked error message. */
export function Field(p: FieldProps & { error?: string }) {
  const { locale } = useLocale();
  const id = useId();
  const hintId = p.hint ? `${id}-hint` : undefined;
  const errId = `${id}-err`;
  const describedBy = [hintId, p.error ? errId : undefined].filter(Boolean).join(' ') || undefined;
  const common = {
    id, name: p.name, required: p.required, 'aria-invalid': p.error ? true : undefined, 'aria-describedby': describedBy,
    autoComplete: p.autoComplete, defaultValue: p.defaultValue, dir: p.dir,
  };
  return <div className={`az-field ${p.wide ? 'is-wide' : ''} ${p.error ? 'has-error' : ''}`}>
    <label htmlFor={id}>{p.label}{p.required ? <span className="az-req" aria-hidden="true"> *</span> : <span className="az-opt"> ({MSG[locale].optional})</span>}</label>
    {p.options
      ? <select {...common} defaultValue={p.defaultValue ?? ''}><option value="" disabled={p.required}>{MSG[locale].select}</option>{p.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      : p.rows
        ? <textarea {...common} rows={p.rows} placeholder={p.placeholder} minLength={p.minLength} maxLength={p.maxLength} />
        : <input {...common} type={p.type ?? 'text'} placeholder={p.placeholder} inputMode={p.inputMode} minLength={p.minLength} maxLength={p.maxLength} min={p.min} max={p.max} pattern={p.pattern} />}
    {p.hint && <small id={hintId} className="az-hint">{p.hint}</small>}
    {p.error && <small id={errId} className="az-error"><AlertCircle size={13} aria-hidden="true" />{p.error}</small>}
  </div>;
}

/** Hidden from people and assistive technology; bots that fill it are rejected. */
export function Honeypot() {
  return <div className="az-hp" aria-hidden="true"><label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>;
}

export type SubmitState = { status: 'idle' | 'sending' | 'sent' | 'failed'; reference?: string };

/**
 * Client-side validation with accessible messages (UI UX Pro Max form rules):
 * fields the visitor has typed in validate on blur; a failed submit focuses an
 * error summary whose links jump to each invalid field; inline errors remain.
 * `onValid` receives the form data only when every control passes.
 */
export function useValidatedForm(onValid: (data: FormData, form: HTMLFormElement) => void) {
  const { locale } = useLocale();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<{ title: string; items: { id: string; message: string }[] } | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const dirty = useRef(new Set<string>());

  const labelOf = (form: HTMLFormElement, el: Control) => form.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.childNodes[0]?.textContent?.trim() ?? el.name;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (String(data.get('website') || '')) { setSummary({ title: MSG[locale].invalid, items: [] }); return; }
    const next: Record<string, string> = {};
    const items: { id: string; message: string }[] = [];
    for (const el of Array.from(form.elements) as Control[]) {
      if (!el.name || !('validity' in el) || el.validity.valid) continue;
      const message = messageFor(el, labelOf(form, el), locale);
      next[el.name] = message;
      items.push({ id: el.id, message });
    }
    setErrors(next);
    if (items.length) {
      setSummary({ title: MSG[locale].summary(items.length), items });
      requestAnimationFrame(() => { summaryRef.current?.focus(); });
      return;
    }
    setSummary(null);
    onValid(data, form);
  };

  // Clear a field's error as soon as it becomes valid; remember typed-in fields.
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const el = e.target as unknown as Control;
    if (!el.name) return;
    dirty.current.add(el.name);
    if (errors[el.name] && el.validity.valid) setErrors(({ [el.name]: _, ...rest }) => rest);
  };

  // Validate on blur, but only fields the visitor has actually typed in.
  const onBlur = (e: FocusEvent<HTMLFormElement>) => {
    const el = e.target as unknown as Control;
    if (!el.name || !('validity' in el) || !dirty.current.has(el.name)) return;
    if (!el.validity.valid) {
      const message = messageFor(el, labelOf(e.currentTarget, el), locale);
      setErrors(prev => (prev[el.name] === message ? prev : { ...prev, [el.name]: message }));
    }
  };

  const jump = (id: string) => (ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    const field = document.getElementById(id);
    field?.scrollIntoView({ block: 'center' });
    field?.focus({ preventScroll: true });
  };

  const Summary = () => summary ? <div ref={summaryRef} tabIndex={-1} className="az-form-summary" role="alert" aria-labelledby="az-summary-title">
    <AlertCircle size={18} aria-hidden="true" />
    <div>
      <p id="az-summary-title" className="az-summary-title">{summary.title}</p>
      {summary.items.length > 0 && <ul>{summary.items.map(i => <li key={i.id}><a href={`#${i.id}`} onClick={jump(i.id)}>{i.message}</a></li>)}</ul>}
    </div>
  </div> : null;
  return { errors, onSubmit, onInput, onBlur, Summary };
}

export function SubmitButton({ sending, label }: { sending: boolean; label: string }) {
  const { locale } = useLocale();
  return <button type="submit" className="az-btn az-btn-primary az-btn-lg az-submit" disabled={sending} aria-disabled={sending}>
    {sending ? <><LoaderCircle size={17} className="az-spin" aria-hidden="true" />{locale === 'ar' ? 'جارٍ الإرسال…' : 'Sending…'}</> : <>{label}<Send size={16} aria-hidden="true" className="az-flip" /></>}
  </button>;
}

/** Shown only after the API confirms the enquiry was stored. */
export function SentPanel({ reference, title, children }: { reference?: string; title: string; children?: ReactNode }) {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return <m.div ref={ref} tabIndex={-1} className="az-sent" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
    <CheckCircle2 size={34} aria-hidden="true" />
    <h2>{title}</h2>
    {reference && <p className="az-ref">{locale === 'ar' ? 'رقم المرجع' : 'Reference'}: <b dir="ltr">{reference}</b></p>}
    {children}
    <Link href="/" className="az-text-link">{locale === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to the home page'}</Link>
  </m.div>;
}

/** Honest failure message with a verified fallback contact route. */
export function FailedNotice({ show, division = 'logistics' }: { show: boolean; division?: 'logistics' | 'travel' }) {
  const { locale } = useLocale();
  const email = businessContacts[division].emails[0];
  return <AnimatePresence>{show && <m.div className="az-form-failed" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
    <AlertCircle size={18} aria-hidden="true" />
    <div>
      <b>{locale === 'ar' ? 'لم يتم إرسال طلبك.' : 'Your enquiry was not sent.'}</b>
      <p>{locale === 'ar' ? 'تعذر الوصول إلى خدمة الاستفسارات. حاول مرة أخرى، أو راسل فريقنا مباشرة:' : 'We could not reach the enquiry service. Please try again, or email our team directly:'} <a href={`mailto:${email}?subject=${encodeURIComponent(division === 'travel' ? 'Travel enquiry' : 'Logistics enquiry')}`} dir="ltr"><Mail size={14} aria-hidden="true" />{email}</a></p>
    </div>
  </m.div>}</AnimatePresence>;
}

export function PrivacyNote() {
  const { locale } = useLocale();
  return <p className="az-privacy-note">{locale === 'ar'
    ? <>نستخدم بياناتك للرد على هذا الاستفسار فقط. اطّلع على <Link href="/privacy">إشعار الخصوصية</Link>.</>
    : <>We use your details only to respond to this enquiry. See our <Link href="/privacy">privacy notice</Link>.</>}</p>;
}

/** Pre-fills the quote form on the current page (pillar links with a `preset`). */
export const FORM_PRESET_EVENT = 'az:form-preset';
export function presetPageForm(preset: Record<string, string>) {
  window.dispatchEvent(new CustomEvent<Record<string, string>>(FORM_PRESET_EVENT, { detail: preset }));
}

/**
 * Applies presets to a form's selects (matching option) and checkbox groups
 * (matching value), from `?key=value` query parameters on load and from
 * presetPageForm() calls afterwards.
 */
export function usePagePreset(formRef: { current: HTMLFormElement | null }, queryKeys: readonly string[]) {
  useEffect(() => {
    const apply = (p: Record<string, string | null | undefined>) => {
      const form = formRef.current;
      if (!form) return;
      for (const [name, value] of Object.entries(p)) {
        if (!value) continue;
        const select = form.querySelector<HTMLSelectElement>(`select[name="${CSS.escape(name)}"]`);
        if (select && Array.from(select.options).some(o => o.value === value)) select.value = value;
        const box = form.querySelector<HTMLInputElement>(`input[type="checkbox"][name="${CSS.escape(name)}"][value="${CSS.escape(value)}"]`);
        if (box) box.checked = true;
      }
    };
    const q = new URLSearchParams(window.location.search);
    apply(Object.fromEntries(queryKeys.map(k => [k, q.get(k)])));
    const onPreset = (e: Event) => apply((e as CustomEvent<Record<string, string>>).detail);
    window.addEventListener(FORM_PRESET_EVENT, onPreset);
    return () => window.removeEventListener(FORM_PRESET_EVENT, onPreset);
  }, [formRef, queryKeys]);
}

/** Campaign context for the enquiry record (never sent to analytics). */
export function attribution() {
  const q = new URLSearchParams(window.location.search);
  return {
    landingPage: window.location.pathname.slice(0, 300),
    referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
    utmSource: q.get('utm_source')?.slice(0, 160) || undefined,
    utmMedium: q.get('utm_medium')?.slice(0, 160) || undefined,
    utmCampaign: q.get('utm_campaign')?.slice(0, 160) || undefined,
  };
}
