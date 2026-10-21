/**
 * Approximate city coordinates for the illustrative GCC network graphic.
 * Warehouse cities are those stated by the business; GCC capitals mark
 * cross-border road destinations that are arranged route by route.
 */
export type NetworkNode = { id: string; lat: number; lon: number; kind: 'warehouse' | 'gcc'; en: string; ar: string; label: 'top' | 'bottom' | 'left' | 'right' };

export const nodes: NetworkNode[] = [
  { id: 'riyadh', lat: 24.71, lon: 46.68, kind: 'warehouse', en: 'Riyadh', ar: 'الرياض', label: 'bottom' },
  { id: 'dammam', lat: 26.42, lon: 50.09, kind: 'warehouse', en: 'Dammam', ar: 'الدمام', label: 'left' },
  { id: 'jeddah', lat: 21.49, lon: 39.19, kind: 'warehouse', en: 'Jeddah', ar: 'جدة', label: 'bottom' },
  { id: 'jubail', lat: 27.0, lon: 49.66, kind: 'warehouse', en: 'Jubail', ar: 'الجبيل', label: 'top' },
  { id: 'kuwait', lat: 29.38, lon: 47.99, kind: 'gcc', en: 'Kuwait', ar: 'الكويت', label: 'top' },
  { id: 'manama', lat: 26.23, lon: 50.59, kind: 'gcc', en: 'Bahrain', ar: 'البحرين', label: 'right' },
  { id: 'doha', lat: 25.29, lon: 51.53, kind: 'gcc', en: 'Qatar', ar: 'قطر', label: 'bottom' },
  { id: 'dubai', lat: 25.2, lon: 55.27, kind: 'gcc', en: 'UAE', ar: 'الإمارات', label: 'top' },
  { id: 'muscat', lat: 23.59, lon: 58.41, kind: 'gcc', en: 'Oman', ar: 'عُمان', label: 'bottom' },
];

export const routes: [string, string][] = [
  ['riyadh', 'dammam'], ['riyadh', 'jeddah'], ['dammam', 'jubail'],
  ['dammam', 'kuwait'], ['dammam', 'manama'], ['dammam', 'doha'], ['riyadh', 'dubai'], ['dubai', 'muscat'],
];

/** Equirectangular projection into a 600 x 300 design space. */
export function project(lat: number, lon: number) {
  return { x: (lon - 37) * 26, y: (31 - lat) * 26 };
}

/**
 * Simplified Arabian Peninsula coastline as [lon, lat] points, from the Gulf of
 * Aqaba around the Red Sea, Arabian Sea and Gulf coasts to the head of the
 * Gulf. Coastlines only (no political borders); approximate, for context.
 */
export const coastline: [number, number][] = [
  [34.95, 29.55], [35.3, 28.0], [35.7, 27.3], [36.45, 26.2], [37.27, 25.05], [38.06, 24.09], [39.03, 22.8], [39.17, 21.5],
  [40.0, 20.4], [40.9, 19.1], [41.6, 18.0], [42.55, 16.9], [42.8, 15.5], [43.25, 13.3], [43.5, 12.65], [45.0, 12.8],
  [47.0, 13.6], [49.13, 14.54], [52.2, 15.6], [54.1, 17.0], [55.6, 17.9], [56.8, 18.7], [57.8, 19.0], [58.8, 20.6],
  [59.8, 22.5], [58.6, 23.6], [57.6, 23.9], [56.75, 24.35], [56.35, 25.1], [56.35, 26.0], [56.4, 26.4], [55.95, 25.8],
  [55.3, 25.25], [54.35, 24.45], [53.6, 24.1], [52.7, 24.15], [51.6, 24.3], [51.6, 24.6], [51.55, 25.3], [51.35, 26.1],
  [51.05, 26.0], [50.8, 25.5], [50.85, 24.75], [50.2, 25.6], [50.2, 26.2], [50.1, 26.45], [49.65, 27.0], [49.3, 27.4],
  [48.85, 27.7], [48.5, 28.4], [48.2, 29.1], [48.0, 29.35], [47.9, 29.6], [48.0, 29.95],
];
export const bahrain: [number, number][] = [[50.45, 26.25], [50.62, 26.25], [50.65, 25.95], [50.55, 25.8], [50.45, 26.0], [50.45, 26.25]];
