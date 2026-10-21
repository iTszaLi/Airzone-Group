import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone, MessageCircle, Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';
import { Link, LanguageSwitcher, useBarePath, useLocale } from '@/site/locale';
import { usePageUpdated } from '@/seo/page-updated';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { businessContacts, whatsappLink, logisticsFooterPhone } from '@/config/business-contacts';
import { serviceCatalog } from '@/config/service-catalog';
import { PrivacyChoicesButton } from '@/analytics/ConsentUi';
import { photos, type Photo } from '@/config/photography';

// Licence names in Arabic; Creative Commons codes stay as written, isolated left-to-right.
const licenseAr: Record<string, string> = { 'Public domain': 'ملكية عامة', 'Unsplash License': 'رخصة Unsplash', 'Supplied by Airzone Logistics': 'مقدمة من إيرزون للخدمات اللوجستية' };
function License({ name, ar }: { name: string; ar: boolean }) {
  return ar && licenseAr[name] ? <>{licenseAr[name]}</> : <bdi dir="ltr">{name}</bdi>;
}

function Email({ address }: { address: string }) {
  const at = address.indexOf('@');
  return <a href={`mailto:${address}`} dir="ltr"><Mail size={14} aria-hidden="true" /><span>{address.slice(0, at + 1)}<wbr />{address.slice(at + 1)}</span></a>;
}

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
};
/** 19 October 2026 / 19 أكتوبر 2026: fixed month names, so the server and browser always agree. */
const longDate = (iso: string, ar: boolean) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[ar ? 'ar' : 'en'][m - 1]} ${y}`; };

export function ClosingCta() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  return <section className="az-closing" aria-labelledby="az-closing-title">
    <div className="az-container az-closing-inner">
      <div>
        <p className="az-eyebrow az-eyebrow-light">{ar ? 'ابدأ محادثة' : 'Start a conversation'}</p>
        <h2 id="az-closing-title">{ar ? 'لديك شحنة أو مخزون أو توصيل تخطط له؟' : 'Planning a shipment, storage or delivery?'}</h2>
        <p>{ar ? 'أرسل المسار والبضاعة والمواعيد، وسيرد فريقنا بما يلزم لإعداد عرض سعر مكتوب.' : 'Send the route, cargo and dates. Our team will come back with what it needs to prepare a written quotation.'}</p>
      </div>
      <div className="az-closing-actions">
        <Link href="/logistics/request-quote" className="az-btn az-btn-primary az-btn-lg">{ar ? 'اطلب عرض سعر' : 'Request a quote'}<ArrowRight size={17} aria-hidden="true" className="az-flip" /></Link>
        <Link href="/contact" className="az-btn az-btn-outline-light az-btn-lg">{ar ? 'تواصل معنا' : 'Contact us'}</Link>
      </div>
    </div>
  </section>;
}

export function Footer() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const T = (en: string, a: string) => (ar ? a : en);
  const updated = usePageUpdated(useBarePath());
  const logistics = businessContacts.logistics;
  const travel = businessContacts.travel;
  const social = { LinkedIn: Linkedin, Instagram, Facebook, YouTube: Youtube, X: null } as const;
  const transport = serviceCatalog.filter(s => s.group === 'transport');
  const storageTrade = serviceCatalog.filter(s => s.group !== 'transport' && s.featured);

  return <footer id="site-footer" className="az-footer">
    <div className="az-container az-footer-grid">
      <div className="az-footer-brand">
        <Link href="/" className="az-footer-logo" aria-label={T('Airzone Group home', 'مجموعة إيرزون — الصفحة الرئيسية')}><BrandLogo sizes="190px" decorative /></Link>
        <p>{T('Airzone Group arranges road transportation across Saudi Arabia and the GCC, heavy trailer solutions, Dayana local delivery, temperature-controlled warehousing and customs coordination.', 'ترتّب مجموعة إيرزون النقل البري في المملكة ودول الخليج وحلول المقطورات الثقيلة وخدمة Dayana للتوصيل المحلي والتخزين المتحكم بحرارته وتنسيق الجمارك.')}</p>
        <p className="az-footer-place"><MapPin size={15} aria-hidden="true" />{T('Saudi Arabia · Serving the GCC', 'المملكة العربية السعودية · نخدم دول الخليج')}</p>
      </div>
      <nav className="az-footer-col" aria-label={T('Transportation services', 'خدمات النقل')}>
        <h2>{T('Transportation', 'النقل')}</h2>
        <ul>{transport.map(s => <li key={s.path}><Link href={s.path}>{s[locale].name}</Link></li>)}
          <li><Link href="/track">{T('Track a shipment', 'تتبع شحنة')}</Link></li></ul>
      </nav>
      <nav className="az-footer-col" aria-label={T('Warehousing and customs', 'التخزين والجمارك')}>
        <h2>{T('Warehousing & customs', 'التخزين والجمارك')}</h2>
        <ul>{storageTrade.map(s => <li key={s.path}><Link href={s.path}>{s[locale].name}</Link></li>)}
          <li><Link href="/logistics">{T('All logistics services', 'جميع الخدمات اللوجستية')}</Link></li>
          <li><Link href="/locations">{T('Service locations', 'مواقع الخدمة')}</Link></li></ul>
      </nav>
      <nav className="az-footer-col" aria-label={T('Company', 'الشركة')}>
        <h2>{T('Company', 'الشركة')}</h2>
        <ul>
          <li><Link href="/about">{T('About Airzone Group', 'عن مجموعة إيرزون')}</Link></li>
          <li><Link href="/contact">{T('Contact us', 'اتصل بنا')}</Link></li>
          <li><Link href="/logistics/request-quote">{T('Request a logistics quote', 'اطلب عرض سعر لوجستي')}</Link></li>
          <li><Link href="/travel/enquiry">{T('Request a travel quote', 'اطلب عرض سعر للسفر')}</Link></li>
          <li><Link href="/callback">{T('Request a callback', 'اطلب معاودة الاتصال')}</Link></li>
          <li><Link href="/travel">{T('Airzone Travel & Tourism', 'إيرزون للسفر والسياحة')}</Link></li>
        </ul>
      </nav>
      <div className="az-footer-col az-footer-contacts" id="footer-business-contacts">
        <h2>{T('Contact our businesses', 'تواصل مع أعمالنا')}</h2>
        <div className="az-footer-contact" data-division="logistics">
          <h3>{T('Logistics enquiries', 'استفسارات الخدمات اللوجستية')}</h3>
          <ul>{logistics.emails.map(e => <li key={e}><Email address={e} /></li>)}
            <li><a href={logisticsFooterPhone.href} dir="ltr"><Phone size={14} aria-hidden="true" />{logisticsFooterPhone.label}</a></li>
            {logistics.phone && <li><a href={logistics.phone.href} dir="ltr"><Phone size={14} aria-hidden="true" />{logistics.phone.label}</a></li>}</ul>
          {logistics.whatsappNumber && <a className="az-footer-chip" href={whatsappLink(logistics, locale) ?? undefined} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} aria-hidden="true" />{T('WhatsApp', 'واتساب')}<span className="sr-only">{T(' (opens in a new tab)', ' (يفتح في نافذة جديدة)')}</span></a>}
        </div>
        <div className="az-footer-contact" data-division="travel">
          <h3>{T('Airzone Travel & Tourism', 'إيرزون للسفر والسياحة')}</h3>
          <ul>
            {travel.emails.map(e => <li key={e}><Email address={e} /></li>)}
            {travel.phone && <li><a href={travel.phone.href} dir="ltr"><Phone size={14} aria-hidden="true" />{travel.phone.label}</a></li>}
          </ul>
          {travel.whatsappNumber && <a className="az-footer-chip" href={whatsappLink(travel, locale) ?? undefined} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} aria-hidden="true" />{T('WhatsApp', 'واتساب')}<span className="sr-only">{T(' (opens in a new tab)', ' (يفتح في نافذة جديدة)')}</span></a>}
          {travel.officeAddress && <address dir="ltr">{travel.officeAddress}</address>}
          {travel.mapsUrl && <a className="az-footer-chip" href={travel.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={14} aria-hidden="true" />{T('Get directions', 'احصل على الاتجاهات')}<ArrowUpRight size={13} aria-hidden="true" className="az-flip" /><span className="sr-only">{T(' (opens in a new tab)', ' (يفتح في نافذة جديدة)')}</span></a>}
        </div>
        {[...logistics.socialLinks, ...travel.socialLinks].length > 0 && <div className="az-footer-social">
          {[...logistics.socialLinks, ...travel.socialLinks].map(l => { const Icon = social[l.name]; return <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={`${l.name} (${T('opens in a new tab', 'يفتح في نافذة جديدة')})`}>{Icon ? <Icon size={18} aria-hidden="true" /> : 'X'}</a>; })}
        </div>}
      </div>
    </div>
    <div className="az-credits">
      <details className="az-container">
        <summary>{T('Photography credits', 'حقوق الصور')}</summary>
        <p>{T('Illustrative third-party photography. Images do not show Airzone vehicles, warehouses, staff or customers. Resized and converted to WebP.', 'صور توضيحية من أطراف خارجية، ولا تُظهر مركبات إيرزون أو مستودعاتها أو موظفيها أو عملاءها. عُدّلت أحجامها وحُوّلت إلى WebP.')}</p>
        <ul>{(Object.values(photos) as Photo[]).map(ph => <li key={ph.base}>
          {ph.source ? <a href={ph.source} target="_blank" rel="noopener noreferrer">{ar ? ph.altAr ?? ph.alt : ph.alt}</a> : <span>{ar ? ph.altAr ?? ph.alt : ph.alt}</span>} — <bdi dir="ltr">{ph.credit}</bdi>, {ph.licenseUrl ? <a href={ph.licenseUrl} target="_blank" rel="noopener noreferrer"><License name={ph.license} ar={ar} /></a> : <License name={ph.license} ar={ar} />}
        </li>)}</ul>
      </details>
    </div>
    <div className="az-footer-bottom">
      <div className="az-container az-footer-bottom-inner">
        <span>© {new Date().getFullYear()} {T('Airzone Group.', 'مجموعة إيرزون.')} {T('All rights reserved.', 'جميع الحقوق محفوظة.')}</span>
        {updated && <span className="az-footer-updated">{T('Page updated', 'آخر تحديث للصفحة')} <time dateTime={updated}>{longDate(updated, ar)}</time></span>}
        <nav aria-label={T('Legal', 'روابط قانونية')}>
          <Link href="/privacy">{T('Privacy notice', 'إشعار الخصوصية')}</Link>
          <Link href="/terms">{T('Website terms', 'شروط الاستخدام')}</Link>
          <PrivacyChoicesButton locale={locale} />
          {/* Shown once the admin sign-in (Clerk) is connected: set VITE_SHOW_ADMIN_LINK=true at build time.
              Until then admins can still open /admin directly. */}
          {import.meta.env.VITE_SHOW_ADMIN_LINK === 'true' && <Link href="/admin">{T('Admin access', 'دخول الإدارة')}</Link>}
        </nav>
        <LanguageSwitcher />
      </div>
    </div>
  </footer>;
}
