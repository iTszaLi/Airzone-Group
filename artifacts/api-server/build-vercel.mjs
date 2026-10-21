// Bundles the Express app as a Vercel Node.js 24 function at `.vercel/output/functions/api.func`
// (Build Output API v3). Vercel calls the default export, the Express app, for every /api request;
// the long-running server (src/index.ts) is not used there.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { banner, external } from "./build-options.mjs";

// Plugins (e.g. 'esbuild-plugin-pino') may use `require` to resolve dependencies
globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const funcDir = path.resolve(artifactDir, "../../.vercel/output/functions/api.func");

async function buildFunction() {
  await rm(funcDir, { recursive: true, force: true });
  await mkdir(funcDir, { recursive: true });

  await esbuild({
    entryPoints: { index: path.resolve(artifactDir, "src/app.ts") },
    platform: "node",
    target: "node24",
    bundle: true,
    format: "esm",
    outdir: funcDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    external,
    sourcemap: "linked",
    // Deployed functions always run in production mode: JSON logs (no pino-pretty worker) and the
    // Clerk proxy switched on, whatever NODE_ENV the platform provides.
    define: { "process.env.NODE_ENV": '"production"' },
    plugins: [esbuildPluginPino({ transports: [] })],
    banner,
  });

  const config = {
    runtime: "nodejs24.x",
    handler: "index.mjs",
    launcherType: "Nodejs",
    // Express parses bodies itself; Vercel's request helpers stay off.
    shouldAddHelpers: false,
    shouldAddSourcemapSupport: true,
  };
  // Optional: run the API next to the database, e.g. VERCEL_API_REGIONS=fra1 (comma-separated).
  const regions = (process.env.VERCEL_API_REGIONS ?? "").split(",").map((r) => r.trim()).filter(Boolean);
  if (regions.length) config.regions = regions;
  await writeFile(path.join(funcDir, ".vc-config.json"), JSON.stringify(config, null, 2) + "\n");
  console.log(`Vercel function: ${path.relative(process.cwd(), funcDir)}${regions.length ? ` (regions ${regions.join(", ")})` : ""}`);
}

buildFunction().catch((err) => {
  console.error(err);
  process.exit(1);
});
