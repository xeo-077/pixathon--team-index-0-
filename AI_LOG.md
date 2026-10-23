# AI Development Log
## You're the Distraction · Pixathon · Team Index 0

**Project:** a three-act browser game about escaping the office after working hours.  
**Workflow:** human-directed product decisions, AI-assisted implementation, deterministic testing, browser validation and versioned delivery.  
**Source of truth:** [PROMPT_LOG.md](PROMPT_LOG.md) preserves the original user requests. The seven briefs below are **retrospective reconstructions** that express those requests and their implementation constraints in a reusable engineering format; they are not verbatim historical prompts.

## 1. Decision ownership and toolchain

The team selected the office-escape concept and defined the final level progression. The assistant translated that direction into mechanics, dialogue, code, visual assets and verification. “Office skill” was interpreted as a report-submission sequence.

| Tool | Actual responsibility |
|---|---|
| ChatGPT / Codex assistant | Concept exploration, specification, HTML/CSS/JavaScript, Canvas artwork, documentation and debugging |
| Node.js built-in test runner | Engine assertions and breadth-first search for an HR escape route |
| Browser automation | Desktop interaction checks and visual inspection |
| Git and GitHub connector | Source checkpoints, repository publication and history preservation |
| Sites | Private browser-game deployment |

No external image or music generation service was used. Antigravity was prepared as a continuation option, not used to produce this build. Exact original model identifiers and prompt timestamps were not recorded.

## 2. Structured prompt briefs

### 01 — Evaluate the design space
**Original intent:** PROMPT_LOG P001–P002.

> Act as a game-design lead evaluating the four supplied Pixathon briefs. Compare creative latitude, first-30-second comprehension, mechanical depth, implementation risk and expansion potential. For Open Innovation, propose three mechanically distinct concepts with humour arising from player decisions rather than decorative dialogue.
>
> For each concept, specify the one-sentence rule, core interaction, example level, failure feedback and a bounded three-level prototype. Identify the main execution risk. Separate design hypotheses from verified findings; do not claim exhaustive originality research.

**Recorded outcome:** three concepts were proposed; the team selected the office escape. The assistant’s preferred alternative did not override that selection.

### 02 — Freeze the revised product scope
**Original intent:** P004 and P009.

> Convert the team’s selected concept into a buildable three-act specification:
> 1. A cubicle-based office task followed by interactive colleague conversations.
> 2. An HR encounter using a fixed, observable movement pattern.
> 3. A falling file that alerts the boss and initiates a three-lane chase.
>
> Preserve this sequence. Define the player objective, available actions, feedback, completion condition and retry behaviour for each act. Resolve underspecified mechanics with the smallest coherent implementation and document the interpretation. Maintain office humour throughout. Deliver a browser game, not a plan or a requirement to use another coding environment.

**Recorded outcome:** report sequencing and two dialogue puzzles; turn-based HR stealth; a file-fall incident and 15-wave runner.

### 03 — Implement a portable browser architecture
**Original intent:** P003–P004 and P008–P009.

> Implement the agreed game using HTML, CSS, JavaScript modules and Canvas. Separate deterministic game rules from DOM rendering and animation. Keep gameplay independent of a backend, paid APIs and runtime model calls.
>
> Expose named state transitions for task progression, patrol movement, detection and chase resolution. Support keyboard and on-screen controls. Provide visible objectives, level replay, restart, pause and a slower chase mode. Use relative asset paths and document how to serve the project locally.
>
> Acceptance: the source is sufficient to run the game on a static server; terminal states cannot advance accidentally; retries recreate the starting state; no secrets are committed.

**Recorded outcome:** static assets in dist/, pure rule functions in engine.js, UI/rendering in app.js, plus local launch instructions.

### 04 — Make each challenge readable and fair
**Original intent:** P004 and P009; implementation interpretation.

> Build challenge data around information the player can inspect. For conversations, supply a contextual clue and a useful response. For HR, define the patrol cycle, sight range, collision order and invalid-move behaviour explicitly. For the chase, distinguish jumpable papers from cabinets that require a lane change.
>
> Every wrong action must produce useful feedback. Avoid hidden random outcomes. Preserve deliberate differences between acts: contextual reasoning, route planning and reaction under pressure. Treat the runner as an arcade payoff; do not overstate its novelty.

**Recorded outcome:** contextual reply feedback, visible patrol sight tiles, deterministic detection, clear-lane cues and distinct obstacle rules. Exact mechanics are documented in [RULES.md](RULES.md).

### 05 — Verify transitions and challenge solvability
**Original intent:** implementation verification supporting P004 and P009.

> Test failure paths as well as successful solutions. Verify report ordering and both dialogue outcomes. Search the HR state space using player position and patrol phase; produce a valid move sequence and replay it deterministically. Verify that jumps clear papers but not cabinets, three collisions cause defeat, and a valid 15-wave chase reaches victory.
>
> Inspect the browser separately for rendering, controls, transitions and restart behaviour. Classify evidence as automated logic checks, browser-observed checks or unverified behaviour. Do not promote a timed-out automation attempt to a passed test.

**Recorded outcome:** six engine tests passed; the HR solver found a 14-turn route. Browser checks completed acts 1 and 2 and exercised chase controls, pause, calm mode, defeat and retry. Full chase victory was verified in logic tests, not a completed browser run.

### 06 — Package the judging evidence and delivery
**Original intent:** P003, P005 and P006.

> Read the supplied 22-page orientation deck before finalizing submission materials. Map requirements to repository evidence: public source, real commit checkpoints, AI_LOG.md, five to ten key prompt records, actual tool usage, a genuine AI correction and a 60-second pitch.
>
> Keep the pitch approximately half game demonstration and half AI workflow. Preserve the team’s three-act scope. Distinguish the required public repository from optional live hosting, and identify the audience of any deployed link. Do not fabricate team names, human playtests or submission-form completion.

**Recorded outcome:** public GitHub source, a private playable Site, pitch, checklist, rules, test report and versioned documentation. The official submission form remains a team action.

### 07 — Preserve continuation without losing context
**Original intent:** P010.

> Prepare an Antigravity continuation package that another coding agent can use without this conversation. Include current source, Git history, architecture, agreed mechanics, run commands, verified results, known limitations and unresolved delivery tasks.
>
> Supply a copy-paste continuation instruction that starts by inspecting the existing project. Preserve history and append future prompts. Never replace the project with a fresh scaffold, force-push over teammate work or embed credentials.

**Recorded outcome:** [ANTIGRAVITY_HANDOFF.md](ANTIGRAVITY_HANDOFF.md), local launch shortcut and a downloadable source/history backup.

## 3. Observed errors and corrective action

| Observation | Diagnosis | Correction and evidence |
|---|---|---|
| The initial ignore rules excluded dist/ | A generated-build convention was inappropriate for this buildless project; it could omit the playable source | Removed the exclusion before the playable commit and inspected tracked files |
| HR’s final grid row reached the canvas edge | Board placement left insufficient visual margin | Moved the grid origin upward by 12 pixels after browser inspection |
| A browser progress wait timed out despite reporting visible matching text | The automation result was inconclusive | Kept full chase browser victory unverified; retained the independent engine result |

These are observed issues, not reconstructed failure anecdotes. The revised prompts above are documentation improvements made after the build.

## 4. Validation boundaries

- **Automated:** six passing engine tests covering ordering, dialogue, patrol solvability, replay, detection, chase victory, jumps, loss and resets.
- **Browser-observed:** first two acts completed; chase controls, pause, calm mode, defeat and retry exercised.
- **Unverified:** a complete winning browser chase, physical-phone playtesting, stranger playtesting and audio-quality review.
- **Delivery:** public repository and owner-private Site were published. The private Site is not a public jury link.

Detailed evidence and remaining checks: [TEST_REPORT.md](TEST_REPORT.md). Release checkpoints: [CHANGELOG.md](CHANGELOG.md). The chronological prompt record remains [PROMPT_LOG.md](PROMPT_LOG.md).
