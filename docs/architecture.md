# Architecture — Corporate Sapphire

`dist/` is tracked source, not generated output. `build/` is the deployable copy. Keeping Canvas and ES modules preserved the static-hosting model and avoided an unnecessary framework migration.

| Module | Responsibility |
| --- | --- |
| `world.js` | Tile coordinates, collision geometry, interactables, patrol routes and cameras |
| `engine.js` | Movement, distance/occlusion, progression, inventory, guard state machine, chase and performance rules |
| `story.js` | Dialogue choices, prerequisites, puzzle feedback and narrative outcomes |
| `render.js` | Original pixel primitives, animated characters, layered world, occluded cones, chase, title and incident scene |
| `save.js` | Versioned schema validation, settings bounds, stable checkpoint restoration, storage failure handling |
| `audio.js` | Original oscillator effects and short pentatonic motifs; unlocked by user gesture |
| `app.js` | Scene/UI orchestration, input routing, fixed bounded updates, focus handling and save calls |
| `style.css` | Responsive game frame, accessible DOM overlays and external touch controls |

The world is 40 × 28 tiles at 16 pixels per tile. Feet positions drive collision; the camera follows within map bounds. Art is nearest-neighbour scaled. Objects require proximity and an unobstructed ray to interact. Choice menus freeze movement, so a valid interaction cannot drift away between opening and committing a choice.

Patrol navigation uses grid BFS; sight uses a directional angle test and sampled rays through the same collision map. Investigation routes to a device's reachable neighbour. Sight produces a recoverable meter before failure. Hiding expires after five seconds and has a nine-second reuse cooldown; entry is refused above 50% suspicion. Cameras sweep independently and can be disabled for 45 seconds. A release timer expires after 60 seconds and must be renewed.

Chase rows are authored and transformed deterministically. A moving row rotates right at 45% progress and communicates that change. Lane changes have a 150 ms cooldown. Jump and slide last 680 ms, with a 900 ms action cooldown. A test drives a legal zero-collision response to all 60 rows, including the gate. Pressure rises by 24 after a collision and falls by 3 after a clean row. Coffee can rescue once at 100 pressure. Checkpoints are waves 20, 40 and 56 (zero-based).

Saves hold puzzle flags, inventory, attention, unlocked/active act, checkpoint, statistics, achievements and settings. Restore discards transient positions/timers and reconstitutes a stable scene. Incompatible/corrupt saves cannot unlock later acts. A level-3 restart preserves the completed earlier acts. Storage exceptions show a warning instead of crashing.

Browser tests use an explicit localhost-only deterministic clock. They never assign player coordinates, inventory or completion flags during the normal end-to-end run. Navigation follows the collision map using keyboard events; chase actions use actual key handlers. A separate failure test uses the documented local demo scene to isolate HR recovery.
