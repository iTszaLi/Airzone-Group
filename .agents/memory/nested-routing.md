---
name: Nested route coverage
description: Wouter catch-all pattern pitfall and why nested and Arabic URLs need direct verification.
---

Do not use `/:rest*` as a multi-segment Wouter catch-all. It can match top-level
pages while excluding nested service, enquiry and Arabic URLs. Use a genuine
wildcard or let the existing route dispatcher handle the full pathname directly.

**Why:** Type checks and top-level screenshots passed while implemented
multi-segment URLs still fell through to the 404 page.

**How to apply:** Whenever changing routing, verify a nested enquiry URL and an
Arabic-prefixed URL, not only `/` and a top-level division page. Static checks
that a route exists in a dispatcher cannot prove an outer matcher admits it.
