import { createContext, useContext, useEffect, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link as WouterLink, useLocation } from 'wouter';
import { pageDirection, type Locale } from '@/lib/i18n';
import { keepReadingPosition } from '@/motion/SmoothScroll';

type LocaleContextValue = { locale: Locale; changeLocale: (locale: Locale) => void };
const LocaleContext = createContext<LocaleContextValue>({ locale: 'en', changeLocale: () => undefined });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const locale: Locale = location === '/ar' || location.startsWith('/ar/') ? 'ar' : 'en';
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = pageDirection(locale);
  }, [locale]);
  const changeLocale = (next: Locale) => {
    if (next === locale) return;
    keepReadingPosition();
    const cleanPath = location.replace(/^\/(ar|en)(?=\/|$)/, '') || '/';
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    setLocation(next === 'ar' ? (normalizedPath === '/' ? '/ar/' : `/ar${normalizedPath}`) : normalizedPath);
    try { window.localStorage.setItem('airzone-locale', next); } catch { /* storage may be unavailable */ }
  };
  return <LocaleContext.Provider value={{ locale, changeLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

/** Bilingual helper: `T('English', 'عربي')`. */
export function useT() {
  const { locale } = useLocale();
  return <V,>(en: V, ar: V): V => (locale === 'ar' ? ar : en);
}

/** Path without the /ar prefix or trailing slash, e.g. "/logistics/warehousing". */
export function useBarePath() {
  const [raw] = useLocation();
  return raw.replace(/^\/ar(?=\/|$)/, '').replace(/\/+$/, '') || '/';
}

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string; 'data-testid'?: string };

/** Internal link that keeps the visitor in their current language. */
export function Link(props: LinkProps) {
  const { locale } = useLocale();
  const [current] = useLocation();
  const { href } = props;
  const localizedHref = href.startsWith('/')
    ? (locale === 'ar' ? (href === '/' ? '/ar/' : `/ar${href}`) : href.replace(/^\/(ar|en)(?=\/|$)/, '') || '/')
    : href;
  // A link to a section of the page already open (e.g. "/#vehicles" on the homepage) is a plain
  // anchor: the router would swallow the click without scrolling, while SmoothScroll's same-page
  // hash handler scrolls below the header and moves focus.
  const hashAt = localizedHref.indexOf('#');
  const trim = (p: string) => p.replace(/\/+$/, '') || '/';
  if (hashAt > 0 && trim(localizedHref.slice(0, hashAt)) === trim(current)) return <a {...props} href={localizedHref} />;
  return <WouterLink {...props} href={localizedHref} />;
}

/**
 * Compact switch for the header bar: one button naming the other language, in that language.
 * It lives in the bar (not the announcement strip, which slides away on scroll) so the language
 * can be changed from anywhere on the page.
 */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, changeLocale } = useLocale();
  const to = locale === 'ar' ? 'en' : 'ar';
  return <div className={`language-switch az-lang-toggle ${className}`} role="group" aria-label={locale === 'ar' ? 'اللغة' : 'Language'}>
    <button type="button" lang={to} onClick={() => changeLocale(to)}>{to === 'ar' ? 'العربية' : 'English'}</button>
  </div>;
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, changeLocale } = useLocale();
  return <div className={`language-switch ${className}`} role="group" aria-label={locale === 'ar' ? 'اللغة' : 'Language'}>
    <button type="button" onClick={() => changeLocale('en')} aria-pressed={locale === 'en'} lang="en">EN</button>
    <span aria-hidden="true">|</span>
    <button type="button" onClick={() => changeLocale('ar')} aria-pressed={locale === 'ar'} lang="ar">العربية</button>
  </div>;
}
