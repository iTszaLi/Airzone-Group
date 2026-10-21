import { use, type ComponentType } from 'react';

/**
 * A page whose code loads on demand but renders synchronously once loaded.
 * Prerendering calls preloadAll() before rendering, and the browser preloads the current
 * route before hydrating, so neither ever suspends and the server HTML is reused as is.
 * Later navigations to a page that has not loaded yet suspend briefly (see App's Suspense).
 */
export type LazyPage<P extends object> = ComponentType<P> & { preload: () => Promise<unknown> };

export function lazyPage<P extends object>(load: () => Promise<ComponentType<P>>): LazyPage<P> {
  let Comp: ComponentType<P> | null = null;
  let pending: Promise<ComponentType<P>> | null = null;
  const preload = () => (pending ??= load().then(c => (Comp = c)));
  function Page(props: P) {
    const Loaded = Comp ?? use(preload());
    return <Loaded {...props} />;
  }
  return Object.assign(Page, { preload });
}
