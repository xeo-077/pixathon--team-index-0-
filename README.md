# You're the Distraction

**Your shift is over. Your office disagrees.**

A three-act browser escape game built for Pixathon’s Open Innovation Puzzles track. Finish a report, negotiate your way out of unwanted conversations, read HR’s patrol, and outrun one final follow-up.

## Gameplay

| Act | Challenge | Core interaction |
| --- | --- | --- |
| The Cubicle | Complete your work and escape two conversations | Sequence tasks and choose contextual replies |
| HR Has Eyes | Reach the exit without being spotted | Plan moves against a fixed patrol and visible sight area |
| The Final Follow-up | A falling file alerts the boss | Switch lanes, jump papers and dodge cabinets across 15 waves |

Short retries, contextual feedback, level replay and a slower chase mode keep the game approachable. Artwork is rendered in Canvas; optional sound uses Web Audio.

## Run locally

From the repository root:

```sh
python -m http.server 8000 --directory dist
```

Open **http://localhost:8000**. On Windows, `scripts/start-windows.bat` starts the same server when Python is installed. Serve the files over HTTP so JavaScript module imports work.

## Controls

| Context | Controls |
| --- | --- |
| Cubicle and conversations | Click or tap the available actions |
| HR patrol | Arrow keys / WASD to move; Space to wait |
| Boss chase | Left / Right or A / D to switch lanes; Space / Up / W to jump |
| Chase settings | P or Pause to pause; Calm mode for a slower pace |
| Replay | Restart the current act or select an act from the navigation |

## Architecture

Plain HTML, CSS and JavaScript modules, with no application build step or runtime API dependency.

- `dist/engine.js` — deterministic rules, challenge data and state transitions.
- `dist/app.js` — input handling, scene rendering, animation and audio.
- `dist/index.html`, `dist/style.css` — document structure and responsive interface.
- `tests/engine.test.js` — transition tests and HR route search.

See the [architecture notes](docs/architecture.md) and [gameplay specification](docs/gameplay.md) for implementation details. Despite its name, `dist/` is tracked application source in this buildless project.

## Verification

Requires Node.js 18 or later. No dependency installation is needed.

```sh
npm test
node --check dist/app.js
```

Six engine tests cover task ordering, dialogue choices, patrol solvability, collision rules, deterministic replay, chase victory, jump behaviour, defeat and resets. Desktop browser checks completed the first two acts and exercised chase controls, pause and retry. Remaining verification is listed in the [validation report](docs/validation.md).

## Project documentation

- [AI development log](AI_LOG.md) — prompt briefs, tool usage, decisions and corrections.
- [Release history](CHANGELOG.md) — implementation milestones.
- [Pitch](docs/pitch.md) — a 60-second presentation and demo sequence.
- [Development record](docs/development-record.md) — original requests and implementation outcomes.

## Deployment

Deploy the contents of `dist/` to any static host. All application assets use relative paths. The existing [hosted preview](https://distraction-office-escape-xeo.xeo-077.chatgpt.site) requires the owner’s account; use the local server for a jury demo. Google Fonts is optional and falls back to system fonts.
