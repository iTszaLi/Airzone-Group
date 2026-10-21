/**
 * Paths of the data-driven logistics pages, kept separate from their (large) page data so
 * the router can match them without loading every page's copy. config/pillars/index.ts and
 * config/logistics-content.ts verify these lists at build time, so they cannot drift.
 */
export const pillarPaths = [
  '/logistics/customs-clearance', '/logistics/customs-documentation', '/logistics/ata-carnet',
  '/logistics/transportation', '/logistics/warehousing',
  '/logistics/warehousing-riyadh', '/logistics/warehousing-dammam', '/logistics/warehousing-jeddah', '/logistics/warehousing-jubail',
  '/logistics/air-freight', '/logistics/sea-freight', '/logistics/container-destuffing',
  '/logistics/exhibition-event-logistics', '/logistics/industries',
] as const;

export const logisticsContentPaths = [
  '/logistics/freight-forwarding', '/logistics/import-export',
  '/logistics/gcc-transportation', '/logistics/heavy-transport', '/logistics/dayana-local-delivery',
] as const;

/** Throws when a route list and its page data disagree (caught by the build and prerender). */
export function assertSamePaths(name: string, list: readonly string[], actual: string[]) {
  const a = [...list].sort().join('|'), b = [...actual].sort().join('|');
  if (a !== b) throw new Error(`${name} is out of date with its page data. Expected: ${[...actual].sort().join(', ')}`);
}
