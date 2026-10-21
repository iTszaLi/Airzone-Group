// Security headers shared by the Node web server (scripts/serve.mjs) and the Vercel output
// (scripts/vercel-output.mjs), so both hosts send the same policy.

// Fonts are self-hosted; Google Tag Manager is only loaded after analytics consent.
const cspDirectives = "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'";

/** The page policy plus the hosts allowed to frame the site (the Replit preview needs its own domains). */
export const contentSecurityPolicy = frameAncestors => `${cspDirectives}; frame-ancestors ${frameAncestors}`;

/** Monitor first (report-only); CSP_ENFORCE=true switches to enforcement once the reports are clean. */
export const cspHeaderName = enforce => (enforce ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only');

export const baseSecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
