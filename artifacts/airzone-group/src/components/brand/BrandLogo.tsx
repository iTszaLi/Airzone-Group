/**
 * Official Airzone artwork (see docs/branding-assets.md). Rendered with its
 * natural aspect ratio and white canvas; never recoloured or cropped by CSS.
 */
import { useLocale } from '@/site/locale';

const base = import.meta.env.BASE_URL;
const asset = (name: string) => `${base}assets/brand/${name}`;

export const brandLogos = {
  group: { name: 'airzone-group-logo', alt: 'Airzone Group', altAr: 'مجموعة إيرزون', widths: [240, 480, 960], ratio: [1627, 803] },
  logistics: { name: 'airzone-logistics-logo', alt: 'Airzone Logistics Services Est', altAr: 'مؤسسة إيرزون للخدمات اللوجستية', widths: [320, 640, 1280], ratio: [1324, 339] },
  travel: { name: 'airzone-travel-logo', alt: 'Airzone Travel and Tourism', altAr: 'إيرزون للسفر والسياحة', widths: [160, 320, 640], ratio: [869, 727] },
} as const;

export type Division = keyof typeof brandLogos;

export function BrandLogo({ division = 'group', className = '', sizes = '200px', eager = false, decorative = false }: {
  division?: Division; className?: string; sizes?: string; eager?: boolean; decorative?: boolean;
}) {
  const { locale } = useLocale();
  const l = brandLogos[division];
  const [w, h] = l.ratio;
  // Eager logos are not marked high priority: the hero image is the LCP element and needs the bandwidth.
  return <img
    className={`brand-logo brand-logo-${division} ${className}`}
    src={asset(`${l.name}-${l.widths[1]}.webp`)}
    srcSet={l.widths.map(x => `${asset(`${l.name}-${x}.webp`)} ${x}w`).join(', ')}
    sizes={sizes} width={w} height={h}
    alt={decorative ? '' : locale === 'ar' ? l.altAr : l.alt}
    loading={eager ? 'eager' : 'lazy'} decoding="async"
  />;
}
