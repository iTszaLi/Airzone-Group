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
  socialLinks: readonly SocialContact[];
};

export const businessContacts: {
  logistics: BusinessContact;
  travel: BusinessContact;
} = {
  logistics: {
    name: 'Airzone Logistics',
    country: 'Saudi Arabia',
    emails: ['fazlu@kingdomlogistics.net', 'airfreight@kingdomlogistics.net'],
    phone: null,
    officeAddress: null,
    mapsUrl: null,
    whatsappNumber: null,
    socialLinks: [],
  },
  travel: {
    name: 'Airzone Travel & Tourism',
    country: 'Saudi Arabia',
    emails: ['yahya.khan@airzonetravel.net'],
    phone: { label: '+966 59 356 7526', href: 'tel:+966593567526' },
    officeAddress: 'Prince Fahad Bin Ibrahim Al Saud, Al Malaz, Riyadh 12642, Saudi Arabia.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=AirZone+Travel+%26+Tourism%2C+Al+Malaz%2C+Riyadh+12642%2C+Saudi+Arabia',
    whatsappNumber: null,
    socialLinks: [],
  },
};

export const corporateTagline = 'ONE GROUP. MANY POSSIBILITIES.';
