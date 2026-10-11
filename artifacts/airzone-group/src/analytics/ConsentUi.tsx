import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { analyticsConfigured, consent, setConsent, type Consent } from './runtime';

type Locale = 'en' | 'ar';
export const OPEN_CONSENT_EVENT = 'airzone-open-consent';

const T = {
  en: {
    bannerTitle: 'Analytics, with your permission',
    body: 'We would like to use Google Analytics 4 to measure which pages are visited and which enquiry actions are completed, so we can improve the site. No form details are sent.',
    accept: 'Accept analytics', reject: 'Reject analytics', policy: 'Privacy policy', choices: 'Privacy choices',
    prefsTitle: 'Privacy choices', current: 'Current choice', granted: 'Analytics accepted', denied: 'Analytics rejected', unset: 'No choice made yet',
    notConfigured: 'Analytics is not configured on this site, so nothing is collected and there is nothing to change.',
    close: 'Close', save: 'Save choice',
  },
  ar: {
    bannerTitle: 'التحليلات بموافقتك',
    body: 'نود استخدام Google Analytics 4 لقياس الصفحات التي تُزار وإجراءات الاستفسار المكتملة، لنحسّن الموقع. لا تُرسل أي بيانات من النماذج.',
    accept: 'قبول التحليلات', reject: 'رفض التحليلات', policy: 'سياسة الخصوصية', choices: 'خيارات الخصوصية',
    prefsTitle: 'خيارات الخصوصية', current: 'الاختيار الحالي', granted: 'تم قبول التحليلات', denied: 'تم رفض التحليلات', unset: 'لم يتم الاختيار بعد',
    notConfigured: 'خدمة التحليلات غير مفعّلة في هذا الموقع، لذلك لا تُجمع أي بيانات ولا يوجد ما يمكن تغييره.',
    close: 'إغلاق', save: 'حفظ الاختيار',
  },
};

export function PrivacyChoicesButton({ locale }: { locale: Locale }) {
  return <button type="button" className="azConsent-link" data-testid="button-privacy-choices"
    onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>{T[locale].choices}</button>;
}

export function ConsentUi({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [status, setStatus] = useState<Consent>('unset');
  const [ready, setReady] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLElement>(null);
  const privacyHref = locale === 'ar' ? '/ar/privacy' : '/privacy';

  useEffect(() => {
    setStatus(consent());
    setReady(true);
    const sync = () => setStatus(consent());
    const open = () => { lastFocus.current = document.activeElement as HTMLElement | null; setStatus(consent()); setPrefs(true); };
    window.addEventListener('airzone-consent-change', sync);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => { window.removeEventListener('airzone-consent-change', sync); window.removeEventListener(OPEN_CONSENT_EVENT, open); };
  }, []);

  const closePrefs = useCallback(() => { setPrefs(false); lastFocus.current?.focus(); }, []);

  useEffect(() => {
    if (!prefs) return;
    panel.current?.querySelector<HTMLElement>('button, a')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePrefs(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [prefs, closePrefs]);

  const choose = (c: 'granted' | 'denied') => { if (!analyticsConfigured) return; setConsent(c); setStatus(c); };
  const showBanner = ready && analyticsConfigured && status === 'unset' && !prefs;
  const label = status === 'granted' ? t.granted : status === 'denied' ? t.denied : t.unset;

  return <div dir={locale === 'ar' ? 'rtl' : 'ltr'} className="azConsent">
    {showBanner && <section className="azConsent-banner" role="region" aria-labelledby="azConsent-title" data-testid="consent-banner">
      <div><h2 id="azConsent-title">{t.bannerTitle}</h2><p>{t.body} <Link href={privacyHref}>{t.policy}</Link></p></div>
      <div className="azConsent-actions">
        <button type="button" className="azConsent-btn" onClick={() => choose('granted')} data-testid="button-consent-accept">{t.accept}</button>
        <button type="button" className="azConsent-btn" onClick={() => choose('denied')} data-testid="button-consent-reject">{t.reject}</button>
      </div>
    </section>}
    {prefs && <aside ref={panel} className="azConsent-prefs" role="dialog" aria-modal="false" aria-labelledby="azConsent-prefs-title" data-testid="consent-preferences">
      <h2 id="azConsent-prefs-title">{t.prefsTitle}</h2>
      {analyticsConfigured ? <>
        <p>{t.body} <Link href={privacyHref}>{t.policy}</Link></p>
        <p className="azConsent-status"><b>{t.current}:</b> {label}</p>
        <div className="azConsent-actions">
          <button type="button" className="azConsent-btn" aria-pressed={status === 'granted'} onClick={() => choose('granted')}>{t.accept}</button>
          <button type="button" className="azConsent-btn" aria-pressed={status === 'denied'} onClick={() => choose('denied')}>{t.reject}</button>
        </div>
      </> : <p>{t.notConfigured} <Link href={privacyHref}>{t.policy}</Link></p>}
      <button type="button" className="azConsent-close" onClick={closePrefs}>{t.close}</button>
    </aside>}
  </div>;
}
