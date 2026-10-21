import { useEffect, useRef, useState, type ReactNode } from 'react';
import { m } from 'motion/react';
import { FileText, PhoneCall, Plane } from 'lucide-react';
import { Link, useLocale } from '@/site/locale';
import { useMotion } from '@/motion/use-motion';
import { ConsentUi } from '@/analytics/ConsentUi';
import { Header } from './Header';
import { ClosingCta, Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { QuoteChooser, QuoteLink, useQuoteKind } from './QuoteCta';
import { QuickCallButton } from './QuickCallButton';

function MobileConversionBar() {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  // Business-specific: the homepage lets the visitor choose; travel pages lead to the travel form,
  // every other page to the logistics quote.
  const kind = useQuoteKind();
  return <div className="az-mobile-bar" role="navigation" aria-label={ar ? 'إجراءات سريعة' : 'Quick actions'}>
    {kind === 'chooser'
      ? <QuoteChooser className="az-mobile-bar-quote" placement="above-start" label={<><FileText size={16} aria-hidden="true" />{ar ? 'عرض سعر' : 'Get a quote'}</>} />
      : kind === 'travel'
        ? <QuoteLink kind="travel"><Plane size={16} aria-hidden="true" />{ar ? 'خطط لرحلة' : 'Plan a trip'}</QuoteLink>
        : <QuoteLink kind="logistics"><FileText size={16} aria-hidden="true" />{ar ? 'عرض سعر' : 'Get a quote'}</QuoteLink>}
    <Link href="/callback"><PhoneCall size={16} aria-hidden="true" />{ar ? 'معاودة الاتصال' : 'Callback'}</Link>
  </div>;
}

// False until the first client-side navigation: the initial (prerendered,
// hydrated) page is never faded, so first paint and LCP are unaffected.
let hasNavigated = false;

/** Public page shell. Each page mounts its own Layout, so scroll animations re-initialise per route. */
export function Layout({ children, closingCta = true }: { children: ReactNode; closingCta?: boolean }) {
  const { locale } = useLocale();
  const main = useRef<HTMLElement>(null);
  useMotion(main, locale === 'ar' ? 'rtl' : 'ltr');
  // Route transition (Motion): a short opacity cross-fade on client navigation.
  // Opacity only, so the fixed progress bar inside <main> keeps its positioning.
  const [initial] = useState(() => (hasNavigated ? { opacity: 0 } : false as const));
  useEffect(() => { hasNavigated = true; }, []);
  return <>
    <Header />
    <m.main id="main" tabIndex={-1} ref={main} initial={initial} animate={{ opacity: 1 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
      <div className="az-progress" data-progress aria-hidden="true" />
      {children}
      {closingCta && <ClosingCta />}
    </m.main>
    <Footer />
    <MobileConversionBar />
    <WhatsAppButton />
    <QuickCallButton />
    <ConsentUi locale={locale} />
  </>;
}
