import type { PillarPage } from './types';
import { assertSamePaths, pillarPaths } from '../route-paths';
import { ataCarnet, customsClearance, customsDocumentation } from './customs';
import { transportation } from './transport';
import { warehousing, warehouseCityPages } from './warehousing';
import { industries } from './industries';
import { airFreight, containerDestuffing, seaFreight } from './freight';
import { exhibitionLogistics } from './exhibition';

export type { PillarPage } from './types';

/** All data-driven Airzone Logistics pages, keyed by path. */
export const pillarPages: Record<string, PillarPage> = Object.fromEntries(
  [customsClearance, customsDocumentation, ataCarnet, transportation, warehousing, ...warehouseCityPages,
    airFreight, seaFreight, containerDestuffing, exhibitionLogistics, industries].map(p => [p.path, p]),
);

assertSamePaths('pillarPaths (config/route-paths.ts)', pillarPaths, Object.keys(pillarPages));
