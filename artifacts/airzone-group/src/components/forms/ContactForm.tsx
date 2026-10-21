import { useState } from 'react';
import { useCreateContactEnquiry, type ContactEnquiryInput } from '@workspace/api-client-react';
import { useLocale } from '@/site/locale';
import { recordLead } from '@/analytics/runtime';
import { departmentDivision } from '@/analytics/events';
import { Field, FailedNotice, PHONE_PATTERN, Honeypot, PrivacyNote, SentPanel, SubmitButton, attribution, useValidatedForm } from './FormKit';

const departments: { value: ContactEnquiryInput['department']; en: string; ar: string }[] = [
  { value: 'Logistics', en: 'Transportation, warehousing or delivery', ar: 'النقل أو التخزين أو التوصيل' },
  { value: 'Customs Clearance', en: 'Customs support', ar: 'دعم الجمارك' },
  { value: 'Travel & Tourism', en: 'Travel & Tourism', ar: 'السفر والسياحة' },
  { value: 'Corporate Travel', en: 'Corporate travel', ar: 'سفر الأعمال' },
  { value: 'General Enquiry', en: 'General enquiry', ar: 'استفسار عام' },
];

/** General enquiry. Submits to the existing /api/enquiries/contact endpoint. */
export function ContactForm({ compact = false }: { compact?: boolean }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const L = (en: string, a: string) => (ar ? a : en);
  const mutation = useCreateContactEnquiry();
  const [sent, setSent] = useState<{ reference: string; emailed: boolean } | null>(null);
  // Division whose email is offered if sending fails; follows the chosen topic.
  const [failed, setFailed] = useState<'logistics' | 'travel' | null>(null);

  const { errors, onSubmit, onInput, onBlur, Summary } = useValidatedForm((f, form) => {
    const data: ContactEnquiryInput = {
      name: String(f.get('name')).trim(),
      company: String(f.get('company') || '').trim() || undefined,
      email: String(f.get('email')).trim(),
      phone: String(f.get('phone') || '').trim() || undefined,
      department: String(f.get('department')) as ContactEnquiryInput['department'],
      message: String(f.get('message')).trim(),
      source: compact ? 'Website home contact' : 'Website contact page',
      ...attribution(),
    };
    setFailed(null);
    mutation.mutate({ data }, {
      onSuccess: r => { recordLead('contact', r.reference, departmentDivision(data.department)); setSent({ reference: r.reference, emailed: r.emailed === true }); form.reset(); },
      onError: () => setFailed(departmentDivision(data.department) === 'travel' ? 'travel' : 'logistics'),
    });
  });

  if (sent) return <SentPanel reference={sent.reference} title={L('Thank you — your message has been received.', 'شكراً لك، استلمنا رسالتك.')}>
    <p>{sent.emailed
      ? L('It has been sent to the relevant Airzone team, who will reply using the contact details you provided.', 'أُرسلت رسالتك إلى فريق إيرزون المعني، وسيرد باستخدام بيانات التواصل التي قدمتها.')
      : L('The relevant Airzone team will reply using the contact details you provided.', 'سيرد فريق إيرزون المعني باستخدام بيانات التواصل التي قدمتها.')}</p>
  </SentPanel>;

  return <form className={`az-form ${compact ? 'az-form-compact' : ''}`} noValidate onSubmit={onSubmit} onInput={onInput} onBlur={onBlur}>
    <p className="az-form-req">{L('Fields marked * are required.', 'الحقول المعلّمة بـ * مطلوبة.')}</p>
    <Summary />
    <div className="az-form-grid">
      <Field label={L('Full name', 'الاسم الكامل')} name="name" required minLength={2} maxLength={120} autoComplete="name" error={errors.name} />
      <Field label={L('Company', 'الشركة')} name="company" maxLength={160} autoComplete="organization" error={errors.company} />
      <Field label={L('Email', 'البريد الإلكتروني')} name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" dir="ltr" error={errors.email} />
      <Field label={L('Phone number', 'رقم الهاتف')} name="phone" type="tel" pattern={PHONE_PATTERN} maxLength={40} autoComplete="tel" inputMode="tel" dir="ltr" error={errors.phone} />
      <Field label={L('Topic', 'الموضوع')} name="department" required wide error={errors.department}
        options={departments.map(d => ({ value: d.value, label: ar ? d.ar : d.en }))} />
    </div>
    <Field label={L('How can we help?', 'كيف يمكننا مساعدتك؟')} name="message" rows={compact ? 4 : 6} required minLength={2} maxLength={4000} wide error={errors.message} />
    <Honeypot />
    <FailedNotice show={failed !== null} division={failed ?? 'logistics'} />
    <div className="az-form-footer">
      <PrivacyNote />
      <SubmitButton sending={mutation.isPending} label={L('Send message', 'أرسل الرسالة')} />
    </div>
  </form>;
}
