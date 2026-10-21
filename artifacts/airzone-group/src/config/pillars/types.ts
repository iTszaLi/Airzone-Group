import type { PhotoKey } from '../photography';

/** Bilingual string. */
export type L = { en: string; ar: string };
export const l = (en: string, ar: string): L => ({ en, ar });

export type Field = { label: L; text: L };
/** `preset` pre-fills the on-page quote form (e.g. { cargo: 'food' }). */
export type Link = { href: string; label: L; primary?: boolean; preset?: Record<string, string> };

/** A directory entry: card, row, step, accordion item or grouped list. */
export type Item = {
  id: string;
  title: L;
  text?: L;
  points?: L[];
  fields?: Field[];
  links?: Link[];
  photo?: PhotoKey;
  tag?: L;
  source?: { url: string; label: L };
  /** Who performs a journey step (flow blocks): Airzone, a carrier/partner, an authority, or the customer. */
  role?: 'airzone' | 'partner' | 'authority' | 'customer';
};

export type Block =
  | { kind: 'cards'; items: Item[]; columns?: 2 | 3 | 4 }
  | { kind: 'rows'; items: Item[] }
  | { kind: 'steps'; items: Item[] }
  | { kind: 'accordion'; items: Item[] }
  | { kind: 'groups'; items: Item[] }
  | { kind: 'chips'; items: Link[] }
  /** A connected journey (arrows between steps), each step labelled with who performs it. */
  | { kind: 'flow'; items: Item[] }
  | { kind: 'widget'; widget: 'docChecker' | 'customsForm' | 'ataForm' | 'airForm' | 'seaForm' | 'destuffingForm' | 'exhibitionForm' };

export type Section = {
  id: string;
  eyebrow: L;
  title: L;
  text?: L;
  note?: L;
  tone?: 'light' | 'surface' | 'dark';
  blocks: Block[];
  ctas?: Link[];
};

/**
 * A data-driven Airzone Logistics page (pillar, sub-service, location or
 * industry directory). Rendered server-side by PillarPageView, so all content
 * is in the prerendered HTML.
 */
export type PillarPage = {
  path: string;
  photo: PhotoKey;
  /** Service cover layout: photo panel beside the text on desktop, a full-width banner above it on smaller screens. */
  heroSplit?: boolean;
  /** Breadcrumb trail between Home and this page. */
  parents: { href: string; label: L }[];
  crumb: L;
  eyebrow: L;
  h1: L;
  lead: L;
  ctas: Link[];
  /** Prominent disclosure (e.g. how customs filings are made). */
  notice?: { title: L; text: L };
  sections: Section[];
  faqs: { q: L; a: L }[];
  related: Link[];
  sources?: { url: string; label: L }[];
  seo: { title: L; description: L };
  /** Name used for the Service schema; omitted for directories. */
  service?: L;
  area?: { type: 'Country' | 'City'; names: string[] };
  updated: string;
};
