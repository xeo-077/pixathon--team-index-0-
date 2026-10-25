# Validation — 26 October 2026

## Current evidence

| Check | Result |
| --- | --- |
| Node rule tests | 18 passing, 0 failing |
| Production build | All application module syntax checks pass; deployable static copy generated |
| Browser suite | 3 passing using installed Microsoft Edge through Playwright |
| Normal end-to-end route | Title → all mandatory office puzzles → HR → falling file → chase failure/retry → all chase phases → victory |
| Persistence | Refresh and Continue preserve completed report; restoration uses stable checkpoint |
| HR failure | Sustained exposure causes a labelled failure; retry clears suspicion and restores controls |
| Touch/responsive | 390 × 844 emulation; movement, pause, settings, larger text, assist pacing and reset |
| Screenshots | Title, office, dialogue, HR, chase, victory, mobile settings and mobile world captured and visually inspected |
| Runtime errors | None recorded in the full winning browser run |

Run commands and environment options are in the README. Playwright writes screenshots to `test-results/`. The default downloaded Chromium failed first with a crashed target and then a Windows spawn error. The suite was run successfully with `PLAYWRIGHT_CHANNEL=msedge`; that workaround is explicit rather than a hidden dependency on a personal executable path.

## What the tests prove

The 18 engine tests cover cardinal movement, collision rejection, distant/occluded interactions, static reachability of every interactable, prerequisite enforcement, wrong-answer recovery, branching costs/rewards, idempotent inventory, sequential unlocks, wall-blocked sight, investigation/cooldowns, suspicion/recovery/detection, hiding expiry, retry preservation, jump/slide expiration, legal 60-row reachability, pursuit failure/coffee, corrupt saves and restart/new-game state.

The normal browser route does not alter game state or teleport. It sends movement and action inputs and advances a localhost-only test clock. The successful run recorded approximately **72 seconds office / 41 seconds stealth / 121 seconds chase**, with **one deliberate chase retry, six collisions and zero HR detections**. These are simulation times for an informed script; they exclude reading/thinking time and are not human playtest durations. The separate HR failure test confirms detection and retry.

## Observed defects and corrections

- The first keyboard/browser selectors included decorative menu arrows in accessible names. Buttons now have explicit accessible labels.
- A level-3 restart initially cleared earlier HR prerequisite flags, which would invalidate its refreshed save. Restart now preserves earlier acts.
- The first stealth balance allowed the shortest route to pass too easily. Standard detection was increased and the credential drawer now requires an active printer investigation. The previous direct route was caught; a route that approaches east HR from outside its cone was then verified.
- The second tile of a two-tile desk could be painted as a wall. Rendering now excludes the complete furniture footprint from wall drawing.
- Chase notifications covered early hazard telegraphs. They now occupy the side margin; the boss and speech are above the bottom control strip.
- Failure menus now resist Escape, and Settings returns to the failure state rather than resuming a terminal chase.

## Remaining verification limits

No unfamiliar human playtest, physical phone, Firefox/Safari run, sound-quality listening session or performance benchmark was available. The requested 6–10 / 8–12 / 7–12 minute first-play targets are **not verified**. The chase itself is around 108 simulation seconds before retries. Difficulty and clarity need human balance feedback before claiming those targets. Spatial stealth/chase gameplay is not fully screen-reader accessible. Larger mobile menus scroll inside the game frame.

The previous version's six-test report and limited browser coverage remain in Git history; they are not used as evidence for this rebuild.
