import type { ReactNode } from 'react';
import { businessContacts } from '@/config/business-contacts';
import { useSiteSettings } from '@/components/ReviewInvitation';
import { Link } from '@/site/locale';
import { presetTravelForm, type TravelPreset } from '@/components/forms/TravelForm';

/**
 * The travel WhatsApp number comes from configuration only: the code value in
 * business-contacts.ts, or the "Travel WhatsApp" site setting an administrator
 * saves in the admin workspace. A phone number is never assumed to be on
 * WhatsApp, so until one is configured these CTAs fall back to the enquiry form.
 */
export function useTravelWhatsApp() {
  const fromSettings = useSiteSettings().data?.travelWhatsapp;
  const raw = businessContacts.travel.whatsappNumber ?? fromSettings ?? null;
  const digits = raw ? raw.replace(/\D/g, '') : '';
  return digits.length >= 8 ? (message: string) => `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}

/** WhatsApp conversation when configured; otherwise a working link to the enquiry form with the same intent. */
export function TravelCta({ message, waLabel, fallbackLabel, fallbackHref, className, icon, preset }: {
  message: string; waLabel: ReactNode; fallbackLabel: ReactNode; fallbackHref: string; className?: string; icon?: ReactNode; preset?: TravelPreset;
}) {
  const wa = useTravelWhatsApp();
  if (wa) return <a className={className} href={wa(message)} target="_blank" rel="noopener noreferrer" data-cta="whatsapp">{waLabel}{icon}</a>;
  if (fallbackHref.startsWith('#')) return <a className={className} href={fallbackHref} onClick={() => { if (preset) presetTravelForm(preset); }}>{fallbackLabel}{icon}</a>;
  return <Link className={className} href={fallbackHref}>{fallbackLabel}{icon}</Link>;
}
