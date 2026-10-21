import { renderToString } from 'react-dom/server';
import App, { preloadAll } from './App';
export { preloadAll };
export { allRoutes, indexableRoutes, metadata, pageHtml, robots, sitemap, llmsTxt } from './seo/html';
import { metadata } from './seo/html';
import { setServerPageUpdated } from './seo/page-updated';
export { leadEvents, serviceCategory, departmentDivision } from './analytics/events';
export { legacyRedirects } from './config/service-catalog';
export function render(path: string) {
  setServerPageUpdated(metadata(path).updated);
  return renderToString(<App ssrPath={path}/>);
}
