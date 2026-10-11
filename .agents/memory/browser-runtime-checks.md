---
name: Browser runtime checks
description: A discoverable Chromium launcher did not establish usable local CDP access
---
Do not assume a usable local headless browser from `command -v chromium` alone.

**Why:** A local production-performance check found the supplied launcher but received neither a debugging endpoint nor useful launch diagnostics. Managed browser verification did work. Presence of a launcher and successful UI screenshots are not evidence of performance measurements.

**How to apply:** Establish browser availability before preparing a local measurement harness. When unavailable, label timing/Core Web Vitals unmeasured and arrange published mobile/desktop measurements; never substitute layout screenshots or payload sizes for measured timing.
