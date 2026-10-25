# You're the Distraction

**Your shift is over. Your office disagrees.**

Corporate Sapphire is an original pixel-art office escape for desktop browsers, with responsive touch controls. Three connected acts combine environmental deduction, branching workplace conversations, real-time stealth and a timed arcade chase. No backend, account, external artwork, fonts or audio downloads are required during play.

## Play locally

Requires Node.js 18+ (development validated with Node 24).

```sh
npm ci
npm start
```

Open [localhost:8000](http://127.0.0.1:8000). `npm start` serves the tracked `dist/` source. Alternatively, `python -m http.server 8000 --directory dist` works. Windows users can use `scripts/start-windows.bat` with Python installed.

```sh
npm test
npm run build
```

The production command syntax-checks all application modules and copies the static application into `build/`. Deploy the **contents** of `build/` to an ordinary static host. The older hosted preview is not automatically updated by this branch.

## The three acts

| Act | Required play |
| --- | --- |
| Just One Last Thing | Explore the office, cross-reference release evidence, obtain Maya's signature, decode the meeting room, repair and route the printer, submit the correct report and negotiate Priya/Dev's handoffs. |
| Employee Under Observation | Use a timed printer diversion to obtain a pass, recover the circuit note, isolate cameras, divert east HR with the phone and release the fire stairs. Three patrols have occluded vision, investigation, suspicion and return states. |
| Run. The Boss Is Coming. | Survive 60 authored waves across three phases. Dodge cabinets, time jumps over paper, slide under bars, read shifting rows and activate the final release. Pressure rises after mistakes; checkpoints allow quick retries. |

Earlier dialogue affects attention, information and an optional one-use coffee rescue. There is no normal act selector. Exit conditions and save restoration validate progression. Completed objectives survive HR detection; chase retries return to phase checkpoints.

## Controls

| Action | Keyboard |
| --- | --- |
| Move | WASD / arrows (four directions) |
| Interact / advance dialogue | E, Enter or Space |
| Chase lanes | A/D or Left/Right |
| Chase jump / slide | Space or Up / S or Down |
| Final gate | E in center lane when switch passes halfway |
| Pause / inventory / journal | Escape / I / J |
| Menus | Arrows, Enter, Tab, mouse or touch |

Jump/slide lasts 0.68 simulation seconds with a 0.9-second cooldown. Holding the key does not auto-repeat. Menus pause gameplay. Focus loss pauses active play. Touch controls sit below the world. Settings include music/SFX volume, mute, reduced motion, larger dialogue, assist pacing and fullscreen. Reset Progress and New Game require confirmation.

## Engineering and testing

Canvas 2D renders a 480 × 320 view of layered tilemaps. Plain ES modules keep runtime dependencies at zero. Node's test runner covers rules; Playwright covers actual browser input and screenshots.

```sh
npx playwright install chromium
npm run test:browser
```

On this Windows machine the downloaded Chromium binary failed to launch. Tests passed using installed Microsoft Edge instead:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:browser
```

See [validation](docs/validation.md), [architecture](docs/architecture.md), [intended solutions](docs/gameplay.md) and [demo pitch](docs/pitch.md). Historical AI records remain in [AI_LOG.md](AI_LOG.md) and [development record](docs/development-record.md).

## Local developer tooling

`http://127.0.0.1:8000/?demo=1` exposes a developer-only scene menu. It is restricted to localhost, is absent in normal play, and never writes normal saves. `?test=1` exposes read-only state snapshots and a deterministic simulation clock for automated tests; tests still send movement/action input through the real controller. Neither option is a security boundary against editing JavaScript.

## Limitations

- No unfamiliar human playtest or physical-phone test was available. The requested first-play duration/difficulty targets are not established by the scripted solution.
- The full winning browser run uses a deterministic clock and known solution; it validates integration, not human reaction time. Active simulated times are recorded in validation.
- Real-time spatial gameplay is not fully screen-reader playable. DOM dialogue and menus are labelled and keyboard accessible.
- Audio synthesis was exercised but not subjected to a listening-quality review. Firefox/Safari and 60 FPS hardware benchmarking remain unverified.
- Important NPCs have distinct portraits and idle animation; walking cycles are used for the player, background worker, HR and boss. NPC portraits do not have a full authored expression library.
- The current build has one ending, no gamepad support and no normal completed-act replay selector. Restart Current Level and New Game are available.
