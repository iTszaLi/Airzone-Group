import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/manrope/wght.css';
import '@fontsource-variable/dm-sans/wght.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-400.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-500.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-600.css';
import '@fontsource/ibm-plex-sans-arabic/arabic-700.css';

import App, { preloadRoute } from './App';
import { ErrorBoundary } from '@/components/error-boundary';

const container = document.getElementById('root')!;
const app = <ErrorBoundary><App /></ErrorBoundary>;
const onCaughtError = (error: unknown, errorInfo: { componentStack?: string }) => {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  console.error(error, errorInfo.componentStack);
};

// Prerendered public pages are hydrated, keeping the server HTML (and the LCP
// image) in place. Private shells are rendered empty and mounted fresh.
// The current page's code (route-level splitting) loads first, so hydration never suspends.
// Hydration waits for the next paint, so the first paint (and the LCP image) never waits
// for React. A hidden tab has nothing to paint, and the timer covers a paused frame loop.
function afterNextPaint(run: () => void) {
  if (document.visibilityState === 'hidden') { run(); return; }
  let done = false;
  const once = () => { if (!done) { done = true; run(); } };
  requestAnimationFrame(() => setTimeout(once, 0));
  setTimeout(once, 500);
}
void preloadRoute(window.location.pathname).catch(() => undefined).finally(() => afterNextPaint(() => {
  if (container.hasChildNodes()) hydrateRoot(container, app, { onCaughtError });
  else createRoot(container, { onCaughtError }).render(app);
}));
