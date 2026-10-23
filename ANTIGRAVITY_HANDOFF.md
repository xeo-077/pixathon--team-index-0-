# Continue this game in Antigravity

## For the team
Open the repository folder in Antigravity. Paste:

```text
Continue this existing Pixathon game. Read AGENTS.md, ANTIGRAVITY_HANDOFF.md,
README.md, RULES.md, AI_LOG.md, TEST_REPORT.md and PROMPT_LOG.md first.
Do not restart from scratch or return only a plan. Run the current game,
inspect what actually works, and finish any outstanding items listed below.
Keep the exact three-act structure: cubicle office-task and conversations,
HR moving on a fixed patrol, then a falling file alerting the boss and a
three-lane chase. Keep it a browser game. Preserve all existing Git history,
log my exact new prompts, and commit tested milestones. Push to
https://github.com/xeo-077/pixathon--team-index-0- only with available
GitHub authorization. Never force-push or expose tokens. Report checks
honestly. Preserve the office humour and green/cream visual style.
```

## Source and local run
Repository: https://github.com/xeo-077/pixathon--team-index-0-

Clone it with Git, or use the source ZIP. If the ZIP includes repository.bundle, restore its exact history with `git clone repository.bundle distraction-restored`. Open the restored folder rather than initializing a new repository.

Windows shortcut: double-click START_GAME.bat if Python is installed. Or run:

```sh
python -m http.server 8000 --directory dist
```

Open http://localhost:8000. Tests: `npm test` (Node 18+; no install required).

## Architecture
- dist/index.html: semantic UI, game canvas, level navigation and help.
- dist/style.css: responsive green/cream office design, with optional Google Fonts.
- dist/engine.js: deterministic logic, fixed patrol, conversation data and chase waves.
- dist/app.js: canvas art, interaction, game state, animation, audio and controls.
- tests/engine.test.js: six tests, including breadth-first HR solution discovery.
- RULES.md: exact rules and a known 14-turn HR escape.
- .openai/hosting.json: private Sites identity. Do not create a duplicate Site or publish private credentials. Antigravity may lack Sites tools; use ordinary static hosting if requested.

## Agreed scope
The first proposed ghost-and-distraction-chain concept was superseded by the user. Do not bring it back. Exactly three acts. Level one is report sequencing then two conversations; level two is turn-based deterministic HR movement; level three is a 15-wave three-lane runner with paper jumps and cabinet dodges. No backend or paid API. UI exposes calm pace, restart, pause, help, level replay and optional sound.

## Orientation evidence
22-page orientation deck reviewed. Rubric: smart AI use 40, creativity 20, usability 15, feel/design 10, pitch 10, fun 5. Need a public GitHub repo, AI_LOG.md with 5–10 real key prompts, tools actually used, one genuine AI mistake/correction, and visible commit history. Pitch is 60 seconds, about 30 on AI use. Live link is optional. User specified three levels, matching the selected brief's minimum; slide 18's 5+ levels is suggested planning guidance.

## Checkpoint and remaining work
Consult TEST_REPORT.md and DEPLOYMENT.md for final status, because these may be updated after this handoff is created. Do not assume links are deployed solely because a manifest exists.
- v0.0.1: original design handoff.
- v0.2.0: playable three-act engine and tests; browser completed acts 1 and 2.
- v1.0.0: final packaging checkpoint, only if the tag exists.
- Browser tests of real-time chase and small screens must be recorded honestly, including limits.
- Public GitHub visibility is confirmed. Check latest remote main before any changes to preserve teammate edits.
- Judge-facing hosting should be public. A private Sites deployment is for owner testing, not a public jury link.
- Team member names and official submission-form completion are not supplied; do not invent or submit them.

## Known actual AI corrections
The initial handoff's .gitignore ignored dist/ even after dist became source; removed before source commit. HR grid shifted up 12 pixels because the bottom row touched the canvas edge. No fictitious AI tools, timestamps, prompts or playtests should be added for judging.
