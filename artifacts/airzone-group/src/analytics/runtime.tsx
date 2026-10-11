import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { metadata, privateRoute, routeInfo } from '../seo/site';
import { leadEvents, type Division, type FormType } from './events';
import { serviceCategories } from './events';
import { businessContacts } from '../config/business-contacts';
export type Consent = 'granted' | 'denied' | 'unset';
const consentKey = 'airzone-analytics-consent';
const id = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';
export const analyticsConfigured = /^G-[A-Z0-9]+$/.test(id);
type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
let loaded = false;
let previousPage = '';
const receipts = new Set<string>();
export function consent(): Consent {
  try { const c = localStorage.getItem(consentKey); return c === 'granted' || c === 'denied' ? c : 'unset'; } catch { return 'unset'; }
}
export function setConsent(choice: Consent) {
  try { localStorage.setItem(consentKey, choice); } catch { /* Browser storage may be restricted; tracking remains opt-in. */ }
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = choice !== 'granted';
  if (choice === 'denied') {
    (window as GtagWindow).gtag?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    const domains = ['', location.hostname, ...(location.hostname.endsWith('airzonegroup.com') ? ['.airzonegroup.com'] : [])];
    for (const name of ['_ga', `_ga_${id.replace(/^G-/, '').replace(/-/g, '_')}`]) {
      for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''}`;
    }
  }
  window.dispatchEvent(new Event('airzone-consent-change'));
}
function safePath() { return metadata(location.pathname).known ? location.pathname : '/404'; }
function allowed() { return analyticsConfigured && consent() === 'granted' && !privateRoute(location.pathname) && metadata(location.pathname).known; }
export function analyticsEvent(name: string, parameters: Record<string, string> = {}) {
  if (!allowed() || !loaded) return;
  if (!['page_view', 'form_start', 'form_submit', 'generate_lead', 'click_to_call', 'email_click', 'whatsapp_click', 'request_quote_click', 'shipment_tracking_start', 'travel_enquiry_submit', 'callback_request_submit', 'google_maps_directions_click', 'google_review_click'].includes(name)) return;
  const path = safePath();
  const permitted: Record<string, string[]> = { business_division: ['logistics', 'travel', 'group'], form_type: ['logistics', 'travel', 'contact', 'callback', 'tracking'], cta_location: ['header', 'footer', 'page'], service_category: [...serviceCategories, 'general-logistics'] };
  const clean = Object.fromEntries(Object.entries(parameters).filter(([key, value]) => permitted[key]?.includes(value)));
  (window as GtagWindow).gtag?.('event', name, { ...clean, ...(name === 'page_view' ? { page_title: metadata(path).title } : {}), page_path: path, page_category: routeInfo(path).path.split('/')[1] || 'home', page_location: location.origin + path });
}
export function recordLead(type: Exclude<FormType, 'tracking'>, reference: string, division: Division, category?: string) {
  if (!reference || receipts.has(`${type}:${reference}`)) return;
  receipts.add(`${type}:${reference}`);
  if (receipts.size > 1000) receipts.delete(receipts.values().next().value!);
  // The reference is used only for local deduplication, NEVER sent to Google.
  for (const event of leadEvents(type, division, category)) analyticsEvent(event.name, event.parameters);
}
function pageView() {
  if (!allowed()) return;
  const win = window as GtagWindow;
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = false;
  if (!loaded) {
    win.dataLayer = win.dataLayer || [];
    win.gtag = function (..._args: unknown[]) { win.dataLayer!.push(arguments); };
    win.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    win.gtag('js', new Date());
    win.gtag('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + safePath(), page_referrer: document.referrer ? new URL(document.referrer).origin : '' });
    const script = document.createElement('script');
    script.async = true; script.id = 'airzone-ga4'; script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.append(script);
    loaded = true;
  }
  win.gtag?.('consent', 'update', { analytics_storage: 'granted' });
  const current = safePath();
  if (previousPage !== current) { previousPage = current; analyticsEvent('page_view', { page_title: metadata(current).title }); }
}
function currentForm(): FormType {
  const p = routeInfo(location.pathname).path;
  return p === '/logistics/request-quote' ? 'logistics' : p === '/travel/enquiry' ? 'travel' : p === '/callback' ? 'callback' : p === '/track' ? 'tracking' : 'contact';
}
export function AnalyticsRuntime() {
  const [path] = useLocation();
  useEffect(() => {
    if (privateRoute(path)) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
    else pageView();
  }, [path]);
  useEffect(() => {
    const starts = new WeakSet<HTMLFormElement>();
    const changed = () => { previousPage = ''; pageView(); };
    const focus = (e: FocusEvent) => {
      const form = (e.target as Element)?.closest('form');
      if (!form || starts.has(form) || privateRoute(location.pathname)) return;
      starts.add(form);
      const type = currentForm();
      analyticsEvent('form_start', { form_type: type, business_division: type === 'travel' ? 'travel' : type === 'logistics' || type === 'tracking' ? 'logistics' : 'group' });
      if (type === 'tracking') analyticsEvent('shipment_tracking_start', { business_division: 'logistics' });
    };
    const click = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest<HTMLAnchorElement>('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const dest = new URL(a.href, location.href);
      const p = routeInfo(dest.pathname).path;
      const officialWhatsApp = Object.values(businessContacts).some(c => c.whatsappNumber && c.whatsappNumber.replace(/\D/g, '') === dest.pathname.replace(/\D/g, ''));
      const event = href.startsWith('tel:') ? 'click_to_call' : href.startsWith('mailto:') ? 'email_click' : dest.hostname === 'wa.me' && officialWhatsApp ? 'whatsapp_click' : dest.hostname === 'www.google.com' && dest.pathname.startsWith('/maps') ? 'google_maps_directions_click' : p === '/logistics/request-quote' ? 'request_quote_click' : '';
      if (!event) return;
      const email = href.startsWith('mailto:') ? href.slice(7).split('?')[0] : '';
      const division: Division = event === 'request_quote_click' || businessContacts.logistics.emails.includes(email) ? 'logistics' : a.closest('[data-division="logistics"]') ? 'logistics' : a.closest('[data-division="travel"]') || businessContacts.travel.emails.includes(email) || href.startsWith('tel:') || event === 'google_maps_directions_click' ? 'travel' : routeInfo(location.pathname).path.startsWith('/travel') ? 'travel' : 'group';
      analyticsEvent(event, { business_division: division, cta_location: a.closest('header') ? 'header' : a.closest('footer') ? 'footer' : 'page', ...(serviceCategories.includes(routeInfo(location.pathname).path.split('/').at(-1) as typeof serviceCategories[number]) ? { service_category: routeInfo(location.pathname).path.split('/').at(-1)! } : {}) });
    };
    window.addEventListener('airzone-consent-change', changed);
    document.addEventListener('focusin', focus);
    document.addEventListener('click', click);
    return () => { window.removeEventListener('airzone-consent-change', changed); document.removeEventListener('focusin', focus); document.removeEventListener('click', click); };
  }, []);
  return null;
}
