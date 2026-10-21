import { pillarPages } from '@/config/pillars';
import { PillarPageView } from './PillarPageView';

/** Loads the pillar page data together with the page, outside the main bundle. */
export function PillarRoute({ path }: { path: string }) {
  return <PillarPageView page={pillarPages[path]} />;
}
