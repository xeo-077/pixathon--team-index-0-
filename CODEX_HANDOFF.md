# Codex implementation task

Build the playable browser game described below in this repository. Implement and validate it, rather than stopping at a plan. Follow AGENTS.md, preserve the existing Git history, and append this implementation request to the prompt log when executed. This document is a prepared prompt, not evidence that implementation has already been requested in another Codex session.

## Concept

Title: You're the Distraction.
One-line goal: Arrange three distractions so the employee reaches the exit unseen.
Player: a mischievous office ghost arranging objects before the office simulation runs.
Tone: affectionate office satire, expressive characters, funny deterministic failures.
Visual direction: colourful top-down miniature office, readable tiles, warm cream background with purple and orange accents. Original CSS/SVG shapes or simple emoji placeholders; no external paid assets.

## Scope and implementation

Use plain HTML, CSS and JavaScript modules, with a deterministic simulation module and data-driven level definitions. Avoid backend, authentication, runtime AI, paid APIs, and multiplayer. Keep the first version dependency-light. Support desktop and mobile via click/tap selection and destination, with keyboard controls and visible focus. Do not require dragging. Provide local run instructions and a static deployment path; for GitHub Pages use relative asset URLs. Add Node built-in tests for pure simulation logic if available.

Core loop: inspect character rules and paths; place up to three distractions in permitted slots; preview the plan; press Play; observe turn-by-turn reactions; win or retry instantly. Include undo during planning, restart without page reload, pause/step simulation, level selection, sound toggle if sound is implemented, and reduced-motion support. Show one-sentence goal persistently.

## Deterministic mechanics specification

Implement a small grid with walls, walkable cells, employee start, boss position, and exit. Choose a compact board size suitable for mobile.
Every character rule must be inspectable before Play. No hidden random reactions. Show boss field of view and distraction range.
An employee follows a fixed indicated route one tile per tick. A boss normally watches that route, but turns/moves toward a triggered distraction for a displayed number of ticks. Establish exact movement, line-of-sight, obstacle, conflict, trigger, and expiry rules in RULES.md before coding levels. Use a stable documented update order. Detection must happen at appropriate intermediate positions, not just after all movement, to prevent passing through watched tiles or guards.
Suggested update order: activate scheduled triggers; resolve NPC responses/movement; check current employee visibility; move employee if safe according to the chosen rules; check visibility again; evaluate exit/win; advance timers. Define initial visibility and tie-breaks explicitly.

Level 1: a single timed printer distraction draws the boss away from the exit route.
Level 2: place a ball so a cat steps on a printer switch, delaying the printer distraction until the employee needs it.
Level 3: combine food, intern, cat and printer to create a two-stage distraction. The intern seeks food and can activate a floor switch along its path. Keep actors and action types minimal; build this only after the first two work.
These are design intentions, not verified layouts. Design actual solvable maps and save a known winning plan for each. Prefer discrete triggers and scheduled turns over continuous physics/pathfinding complexity. Food and ball placement should use clearly marked legal cells. Limit the number of active combinations so brute-force solution checking is feasible.

## Humour

Examples: boss mug 'We're a family'; failed escape 'Quick meeting?'; printer 'Paper jam. Emotionally.'; victory 'Meeting declined successfully.'
Put jokes in reactions and outcome captions. Never obscure rules or delay retry with unskippable dialogue. Each failed attempt should explain why it failed.

## Build order

1. Implement engine, minimal UI, one tested solvable level. Commit/tag v0.1.0 after validation.
2. Add three distinct levels and their known solution tests. Commit/tag v0.2.0 after validation.
3. Polish visual feedback, responsive layout, accessible controls and tutorial. Test fresh load, all wins, loss, undo and restart, replay determinism, no console errors, and small screens. Add screenshots only if tooling actually captures them.
4. Prepare v1.0.0 with README setup/deployment, RULES.md, test results, credits, accurate prompt log, and changelog. Do not claim unrun tests pass.

Acceptance: browser playable; original combination of planning and distraction chains; fun understandable first level within about 30 seconds; three solvable levels; visible win/loss and instant restart; no required accounts or API keys. Originality is a design goal, not a claim of exhaustive prior-art research.

Keep scope focused. Do not add procedural levels, multiplayer, accounts, or additional settings until the submission works. Publish only to the repository the user supplies; if absent, finish locally and request the URL.
