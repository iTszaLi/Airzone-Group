import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import 'swiper/css';
import { Link, useLocale } from '@/site/locale';
import { VehicleIllustration, type VehicleKind } from './VehicleIllustration';
import { SpotCard } from '@/components/ui-kit/Primitives';

type Vehicle = { kind: VehicleKind; line: 'gcc' | 'dayana'; href: string; en: [string, string]; ar: [string, string] };

/** Vehicle and trailer categories stated by the business. No specifications are implied. */
export const vehicles: Vehicle[] = [
  { kind: 'tractor', line: 'gcc', href: '/logistics/heavy-transport', en: ['Heavy-duty trucks', 'Prime movers for full and heavy loads on domestic and GCC routes.'], ar: ['شاحنات ثقيلة', 'رؤوس قاطرة للحمولات الكاملة والثقيلة على المسارات المحلية والخليجية.'] },
  { kind: 'flatbed', line: 'gcc', href: '/logistics/heavy-transport', en: ['Flatbed trailers', 'Open decks for machinery, steel, construction materials and crane-loaded cargo.'], ar: ['مقطورات مسطحة', 'أسطح مكشوفة للآلات والحديد ومواد البناء والبضائع المحمّلة بالرافعة.'] },
  { kind: 'curtain', line: 'gcc', href: '/logistics/heavy-transport', en: ['Curtain-side trailers', 'Covered bodies with sliding curtains for palletised, side-loaded goods.'], ar: ['مقطورات جانبية الستائر', 'هياكل مغطاة بستائر منزلقة للبضائع على المنصات والتحميل الجانبي.'] },
  { kind: 'box', line: 'gcc', href: '/logistics/gcc-transportation', en: ['Other commercial trailers', 'Closed box and other trailer types, matched to the cargo on request.'], ar: ['مقطورات تجارية أخرى', 'مقطورات مغلقة وأنواع أخرى تُختار وفق البضاعة عند الطلب.'] },
  { kind: 'lowbed', line: 'gcc', href: '/logistics/heavy-transport', en: ['Specialised transport', 'Heavy and oversized cargo where suitable equipment and permits are available.'], ar: ['نقل متخصص', 'للحمولات الثقيلة وكبيرة الحجم عند توفر المعدات والتصاريح المناسبة.'] },
  { kind: 'rigid7', line: 'dayana', href: '/logistics/dayana-local-delivery', en: ['7-metre delivery trucks', 'Larger local consignments and multi-drop distribution with Dayana.'], ar: ['شاحنات توصيل 7 أمتار', 'للشحنات المحلية الأكبر والتوزيع متعدد النقاط مع Dayana.'] },
  { kind: 'rigid5', line: 'dayana', href: '/logistics/dayana-local-delivery', en: ['5-metre delivery trucks', 'Medium commercial loads for city and regional deliveries with Dayana.'], ar: ['شاحنات توصيل 5 أمتار', 'للحمولات التجارية المتوسطة داخل المدن مع Dayana.'] },
  { kind: 'van', line: 'dayana', href: '/logistics/dayana-local-delivery', en: ['Vans', 'Smaller, frequent drops and last-mile deliveries with Dayana.'], ar: ['عربات فان', 'للتوصيلات الصغيرة المتكررة والتوصيل للميل الأخير مع Dayana.'] },
];

function VehicleCard({ v }: { v: Vehicle }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const [name, text] = ar ? v.ar : v.en;
  return <SpotCard className="az-vehicle">
    <span className={`az-vehicle-tag az-tag-${v.line}`}>{v.line === 'dayana' ? (ar ? 'Dayana · محلي' : 'Dayana · Local') : (ar ? 'المملكة والخليج' : 'Saudi Arabia & GCC')}</span>
    <VehicleIllustration kind={v.kind} />
    <h3>{name}</h3>
    <p>{text}</p>
    <Link href={v.href} className="az-vehicle-link">{ar ? 'تفاصيل الخدمة' : 'Service details'}<ArrowUpRight size={15} aria-hidden="true" className="az-flip" /><span className="sr-only"> — {name}</span></Link>
  </SpotCard>;
}

/**
 * Vehicle categories. The server renders Swiper's DOM structure, which works
 * as a native scroll-snap row without JavaScript; Swiper itself is imported
 * only when the carousel approaches the viewport (progressive enhancement).
 */
export function VehicleCarousel({ only, layout = 'carousel' }: { only?: 'gcc' | 'dayana'; layout?: 'carousel' | 'grid' }) {
  const { locale } = useLocale();
  const ar = locale === 'ar';
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const list = only ? vehicles.filter(v => v.line === only) : vehicles;
  const label = ar ? 'فئات المركبات والمقطورات' : 'Vehicle and trailer categories';

  useEffect(() => {
    const el = root.current;
    if (!el || layout === 'grid') return;
    let swiper: { destroy: (a?: boolean, b?: boolean) => void } | null = null;
    let cancelled = false;
    const init = () => Promise.all([import('swiper'), import('swiper/modules')]).then(([{ default: Swiper }, { A11y, Keyboard, Navigation }]) => {
      if (cancelled) return;
      swiper = new Swiper(el, {
        modules: [A11y, Keyboard, Navigation],
        wrapperClass: 'swiper-wrapper',
        navigation: { prevEl: prev.current, nextEl: next.current },
        // Arrow keys only: PageUp/PageDown must keep scrolling the page.
        keyboard: { enabled: true, onlyInViewport: true, pageUpDown: false },
        a11y: { containerMessage: label, prevSlideMessage: ar ? 'الشريحة السابقة' : 'Previous slide', nextSlideMessage: ar ? 'الشريحة التالية' : 'Next slide', slideRole: 'group' },
        spaceBetween: 16,
        slidesPerView: 1.15,
        breakpoints: { 560: { slidesPerView: 2.1 }, 900: { slidesPerView: 3.1, spaceBetween: 20 }, 1280: { slidesPerView: 4, spaceBetween: 24 } },
        watchSlidesProgress: true,
      });
      setReady(true);
    }).catch(() => { /* The scroll-snap fallback remains usable. */ });
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      void init();
    }, { rootMargin: '300px 0px' });
    io.observe(el);
    return () => { cancelled = true; io.disconnect(); swiper?.destroy(true, true); setReady(false); };
  }, [layout, locale, ar, label]);

  const note = <p className="az-fleet-note">{ar ? 'الرسوم توضيحية لفئات المركبات وليست صوراً لمركبات بعينها تابعة لإيرزون. يُؤكَّد التوفر لكل حجز.' : 'Illustrations show vehicle categories, not specific Airzone vehicles. Availability is confirmed for each booking.'}</p>;
  if (layout === 'grid') return <><ul className="az-vehicle-grid" data-stagger>{list.map(v => <li key={v.kind}><VehicleCard v={v} /></li>)}</ul>{note}</>;

  return <div className="az-fleet" dir={ar ? 'rtl' : 'ltr'}>
    <div className="az-fleet-controls" hidden={!ready}>
      <button ref={prev} type="button" className="az-icon-btn" aria-label={ar ? 'السابق' : 'Previous vehicles'}>{ar ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}</button>
      <button ref={next} type="button" className="az-icon-btn" aria-label={ar ? 'التالي' : 'Next vehicles'}>{ar ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}</button>
    </div>
    <div ref={root} key={locale} className="swiper az-fleet-swiper" role="region" aria-label={label}>
      <div className="swiper-wrapper">
        {list.map(v => <div key={v.kind} className="swiper-slide az-fleet-slide"><VehicleCard v={v} /></div>)}
      </div>
    </div>
    {note}
  </div>;
}
