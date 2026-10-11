import { renderToString } from 'react-dom/server';
import App from './App';
export { allRoutes, indexableRoutes, metadata, pageHtml, robots, sitemap } from './seo/html';
export { leadEvents, serviceCategory, departmentDivision } from './analytics/events';
export function render(path: string) { return renderToString(<App ssrPath={path}/>); }
