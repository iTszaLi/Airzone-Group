import { Star } from 'lucide-react';
import { useGetPublicSiteSettings, getGetPublicSiteSettingsQueryKey } from '@workspace/api-client-react';
import { useLocale } from '@/site/locale';
import { t } from '@/lib/i18n';
import { analyticsEvent } from '@/analytics/runtime';

export function useSiteSettings() {
  return useGetPublicSiteSettings({ query: { queryKey: getGetPublicSiteSettingsQueryKey(), staleTime: 120_000, retry: false } });
}

/** Rendered only when an official Google review URL has been configured by an administrator. */
export function ReviewInvitation({ division }: { division: 'group' | 'logistics' | 'travel' }) {
  const { locale } = useLocale();
  const url = useSiteSettings().data?.googleReviewUrl;
  if (!url) return null;
  return <section className="az-section-tight az-review-band">
    <div className="az-container az-review-inner">
      <div><p className="az-eyebrow">{locale === 'ar' ? 'رأيك يهمنا' : 'Your feedback'}</p><h2>{t(locale, 'common.review')}</h2></div>
      <a className="az-btn az-btn-navy" href={url} target="_blank" rel="noopener noreferrer" onClick={() => analyticsEvent('google_review_click', { business_division: division })}>{t(locale, 'common.review')}<Star size={15} aria-hidden="true" /></a>
    </div>
  </section>;
}
