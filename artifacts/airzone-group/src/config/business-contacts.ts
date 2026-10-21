/**
 * Public company contact configuration.
 * Keep division details separate. Null fields are deliberately unconfirmed.
 * Add only company-approved phone numbers, locations and social account URLs.
 */
export type SocialContact = {
  name: 'LinkedIn' | 'Instagram' | 'Facebook' | 'YouTube' | 'X';
  url: string;
};

export type BusinessContact = {
  name: string;
  country: string;
  emails: readonly string[];
  phone: { label: string; href: string } | null;
  officeAddress: string | null;
  mapsUrl: string | null;
  // A telephone number does not confirm WhatsApp availability.
  whatsappNumber: string | null;
  /** Pre-filled first message for this division's WhatsApp chats. */
  whatsappMessage: { en: string; ar: string };
  socialLinks: readonly SocialContact[];
};

/** Floating "Quick Call" button on the homepage: one-tap call to the logistics team (owner request, 13 Oct 2026). */
export const logisticsQuickCall = { label: '+966 50 226 0256', href: 'tel:+966502260256' } as const;

/** Logistics phone shown only in the footer's "Logistics enquiries" block (owner request, 13 Oct 2026). */
export const logisticsFooterPhone = { label: '058 367 1739', href: 'tel:0583671739' } as const;

export const businessContacts: {
  logistics: BusinessContact;
  travel: BusinessContact;
} = {
  logistics: {
    name: 'Airzone Logistics',
    country: 'Saudi Arabia',
    // Official logistics recipient for every logistics email link (owner-confirmed, 13 Oct 2026).
    emails: ['info@envodkingdom.net'],
    phone: null,
    officeAddress: null,
    mapsUrl: null,
    whatsappNumber: '+966 50 226 0256',
    whatsappMessage: {
      en: 'Hello Airzone Logistics, I would like to enquire about your logistics services.',
      ar: 'مرحباً إيرزون للخدمات اللوجستية، أود الاستفسار عن خدماتكم اللوجستية.',
    },
    socialLinks: [],
  },
  travel: {
    name: 'Airzone Travel & Tourism',
    country: 'Saudi Arabia',
    // Official travel recipient for every travel email link (owner-confirmed, 13 Oct 2026).
    emails: ['Ticketing@airzonetravel.net'],
    phone: { label: '+966 59 356 7526', href: 'tel:+966593567526' },
    officeAddress: 'Prince Fahad Bin Ibrahim Al Saud, Al Malaz, Riyadh 12642, Saudi Arabia.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=AirZone+Travel+%26+Tourism%2C+Al+Malaz%2C+Riyadh+12642%2C+Saudi+Arabia',
    whatsappNumber: '+966 54 345 7665',
    whatsappMessage: {
      en: 'Hello Airzone Travel, I would like to enquire about your travel services.',
      ar: 'مرحباً إيرزون للسفر، أود الاستفسار عن خدمات السفر لديكم.',
    },
    socialLinks: [],
  },
};

/** wa.me link for a division, with its pre-filled message in the visitor's language. */
export function whatsappLink(contact: BusinessContact, locale: 'en' | 'ar', message = contact.whatsappMessage[locale]) {
  const digits = contact.whatsappNumber?.replace(/\D/g, '') ?? '';
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}

export const corporateTagline = 'ONE GROUP. MANY POSSIBILITIES.';
