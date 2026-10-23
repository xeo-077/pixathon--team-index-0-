# You're the Distraction — Team Index 0

A browser-based office escape for **Pixathon: Open Innovation Puzzles**.

**It is 5:01. Finish your work, outsmart the office, and reclaim your evening.**

## Three levels
1. **The Cubicle:** complete a report sequence, then choose contextual replies to escape two colleagues' conversations.
2. **HR Has Eyes:** slip past an HR character moving along a fixed, visible patrol.
3. **The Final Follow-up:** a falling file alerts the boss; dodge cabinets and jump paper stacks in a three-lane chase.

HTML, CSS, JavaScript modules and Canvas. No build or paid API needed. Original code-drawn artwork; opt-in Web Audio sounds. Google Fonts is optional; fallback fonts keep gameplay usable if it is blocked.

## Play locally
With Python installed, run from this repository:

```sh
python -m http.server 8000 --directory dist
```
Then open http://localhost:8000 in a browser. Use a web server, not a file:// URL, because the game imports JavaScript modules.

## Controls
- Act 1: click/tap tasks and conversation replies.
- Act 2: arrows/WASD; Space or Wait advances a turn without moving.
- Act 3: left/right or A/D; Space/Up/W or Jump clears low papers.
- P or Pause freezes the chase; Calm mode slows it. Restart retries the current act. Tabs allow jury access to each act.

## Validate
```sh
npm test
```
Node 18+ is recommended. No npm install needed. Tests cover report ordering, dialogue choices, HR solution discovery, collision rules, deterministic replay, chase victory, jump restrictions, three-hit defeat and reset state.

## Submission evidence
- [AI_LOG.md](AI_LOG.md): selected real prompts, AI tools and actual corrections.
- [PROMPT_LOG.md](PROMPT_LOG.md): chronological prompt record and outcomes.
- [PITCH.md](PITCH.md): 60-second pitch including AI workflow.
- [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md): orientation rubric and readiness.
- [RULES.md](RULES.md): exact implemented rules and known HR solution.
- [CHANGELOG.md](CHANGELOG.md): genuine release checkpoints.
- [TEST_REPORT.md](TEST_REPORT.md): checks actually performed and limitations.

## Hosting
Serve dist/ on any static host. Sites deployment is private to the owner unless its access is changed. For a jury link, use public GitHub Pages or another public static deployment. A public source repository is required by the orientation; a live link is optional. See DEPLOYMENT.md for the actual deployment status.

## Versions
v0.0.1 is the original design-only handoff; v0.2.0 is the three-act implementation checkpoint; v1.0.0 is reserved for the tested submission. GitHub's initial README commit is preserved when integrating the build. The orientation PDF is reference material and is not redistributed in this repository.
