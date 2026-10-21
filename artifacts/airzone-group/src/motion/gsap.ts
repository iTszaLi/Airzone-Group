import type { gsap as GsapInstance } from 'gsap';
import type { ScrollTrigger as ScrollTriggerClass } from 'gsap/ScrollTrigger';

export type GsapBundle = { gsap: typeof GsapInstance; ScrollTrigger: typeof ScrollTriggerClass };

let bundle: Promise<GsapBundle> | null = null;

/**
 * Loads GSAP + ScrollTrigger once, on demand, and registers the plugin.
 * Kept out of the initial bundle so first paint never waits for animation code.
 */
export function loadGsap(): Promise<GsapBundle> {
  bundle ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    // QA hook: `?qa` on page load exposes ScrollTrigger for automated checks.
    if (new URLSearchParams(window.location.search).has('qa')) (window as unknown as { __azScrollTrigger?: unknown }).__azScrollTrigger = st.ScrollTrigger;
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return bundle;
}
