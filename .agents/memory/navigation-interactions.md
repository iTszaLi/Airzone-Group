---
name: Business menu interactions
description: Persistent click-only disclosure and nested Escape/focus expectations.
---

The Our Businesses navigation is click-controlled, not hover-controlled. It
must stay open while visitors move into its content and close only on another
trigger click, selecting a destination, clicking outside, or Escape.

**Why:** The user explicitly requested persistent opening. Combining hover
opening with click toggling can make the opening click close the menu instead.

**How to apply:** Keep hover styling separate from disclosure state. Escape
closes the innermost disclosure and returns focus to its trigger; it must not
also hide the surrounding mobile navigation and its focus target. Closed
content must immediately become inaccessible, even during a closing animation.

When moving keyboard focus into an animated disclosure, verify the target's
own visibility, not only its container's.

**Why:** Browser checks found that a visible parent could still have a
temporarily hidden inheriting anchor; even next-frame focus was rejected.

**How to apply:** Make open card visibility explicit and keep deferred focus
cancelable on close/unmount. Verify actual focus movement in the browser,
including a quick close-and-reopen sequence.
