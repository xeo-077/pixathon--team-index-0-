# Architecture

The application is a static browser client. HTML provides navigation and controls, Canvas draws the scenes, and JavaScript modules coordinate the three acts. Gameplay does not require a server-side application or model API.

## Rule engine

`dist/engine.js` contains challenge data and deterministic state transitions:

- Report actions advance only in the specified order.
- Conversation answers are checked against explicit level data.
- Patrol state includes player position, patrol phase, move count and terminal status.
- Chase state includes lane, wave, jump state, strikes and terminal status.

The engine has no DOM dependency, allowing its rules to be exercised by Node’s test runner. Transitions preserve terminal states and create fresh state for retries.

## Browser controller

`dist/app.js` owns active-act state, UI updates, input routing, rendering and the animation loop. HR advances once per valid player action; the runner advances on timed obstacle waves. Chase timing pauses when requested, when help opens or when the document becomes hidden.

Canvas art is drawn in code. Web Audio tones are opt-in. Text and on-screen controls explain actions alongside the canvas; the stealth grid remains a visual interaction.

## Delivery

`dist/` is the application source and static document root. There is no bundler or generated asset pipeline. `package.json` provides the test command and version metadata. Private hosting configuration and tool-specific handoff packages are maintained outside this GitHub source tree.

## Constraints

Progress lasts for the current browser session and resets on reload. Desktop interactions have browser-test evidence; physical-phone playtesting and a full winning browser chase remain pending. See [validation.md](validation.md).
