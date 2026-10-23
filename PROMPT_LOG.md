# Prompt log

Date: 2026-10-23 (Asia/Kolkata). Exact times unavailable.
Source: visible ChatGPT conversation. Model identifier unavailable. This is not a complete account-wide transcript. Earlier project conversations have not been imported.

## P001 — Brief comparison

Exact user prompt:
> which one seems the most interesting and most scalable in terms ideations and creativity

Context: four uploaded Pixathon problem briefs (Reimagine CAPTCHA, Passwords, Puzzle with a Twist, Open Innovation Puzzles).
Assistant outcome (summary): compared briefs and recommended Puzzle with a Twist for manageable scope and expansion.

## P002 — Open innovation ideation

Exact user prompt:
> i want to go with open innovation puzzle , explore more on it , give me 3 best ideas which have unique innovative , creative , has humour

Assistant outcome (summary): proposed Terms & Conditions Apply, You're the Distraction, and Emotional Baggage. You're the Distraction uses predictable office characters and planned distraction chains to let an employee escape.

## P003 — Selection and development handoff

Exact user prompt:
> we like the second  one , shift this to codex , we need to upload this on github so maintain the versions , we need prompt log for this

Assistant outcome (summary): prepared CODEX_HANDOFF.md, AGENTS.md, README.md, PROMPT_LOG.md, CHANGELOG.md, VERSION and .gitignore. Initialized a local Git repository and design checkpoint v0.0.1, exported history as a Git bundle, and packaged the handoff. The package is a development brief, not a playable game. No GitHub remote was supplied and no push was performed. No transfer to a separate Codex session was performed.
Validation: documentation files and bundle checked during packaging; no gameplay tests apply yet.

## Future entry template

- Prompt ID and actual date/time if available:
- Tool/model if known:
- Exact user or submitted AI prompt (redact secrets explicitly):
- Result summary:
- Files changed:
- Validation actually run and results:
- Limitations:
- Related commit: record after creation in the next log update; never invent a hash.

## P004 — Build here; revised three-level design
Date: 2026-10-23 (Asia/Kolkata), exact time not recorded.
Exact user prompt (HTML space entity normalized to a space):
> leave codex do everything here cuz i dont understand shit , our There will be three levels: 
>
> 1. The first level will start at the cubicle, where the first obstacle will be on office skill, then some employees talking to him, and it will then be an interactive level where we give the conversation.
> 2. The second level will be a hr in the moving activity, moving in a fixed pattern.
> 3. the third and final level will be the boss , where a file falls alerting the boss , and a chase scene like temple run or subway surfers

Implementation interpretation: office skill becomes a report submission sequence; conversations are contextual multiple-choice puzzles; HR moves one deterministic step per player action; boss chase uses three lanes, dodge and jump. User's new design supersedes original ghost/three-distraction design. Private Sites hosting is used for a playable link; GitHub remote remains unspecified.

## P005 — GitHub destination
Exact user prompt:
> [https://github.com/xeo-077/pixathon--team-index-0-](https://github.com/xeo-077/pixathon--team-index-0-)
> this is the github repo
Result: retained user-selected repository; awaiting GitHub connection before inspecting/pushing. No remote write claimed.

## P006 — Orientation compliance
Exact user prompt:
> update everything needed as per the ppt , of 22 pages
Result in progress: read all 22 rendered pages of Pixathon Orientation + Build with AI_v1.pdf. Required evidence: AI_LOG.md, 5–10 key prompts, tools actually used, one real AI error/correction, commit history, public repository and 60-second pitch including AI workflow. Slide 18's 5+ levels is suggested schedule guidance; user explicitly wants three levels and chosen brief requires at least three.

## P007 — Connection confirmation
Exact user prompt:
> ive installed the plugin
Result: GitHub installed state confirmed; repository metadata confirms public visibility and push permission.

## P008 — Browser platform reminder
Exact user prompt:
> start working on the game , it should be a browser based game
Result: continued the in-progress HTML/CSS/JavaScript browser game; no separate Codex session or install needed for players.

## P009 — Preserve level structure
Exact user prompt:
> start working on the game , it should be a browser based game with the level structure as discussed
Result: retained cubicle task + two conversations; deterministic HR patrol; falling-file intro + three-lane boss chase. Browser testing confirmed first-act wrong-order and wrong-answer feedback, first-act completion, and 14-turn HR completion. Six engine tests pass, including chase win/loss and jump rules. Boss browser tests and final packaging continue.

### Actual correction during implementation
The AI-created initial .gitignore excluded dist/, which now contains the buildless game source. This would have omitted the playable game from a normal Git add. Removed that exclusion before committing, rather than claiming source was uploaded. Also moved the HR grid up 12 canvas pixels after noticing its last row touched the lower edge.

## P010 — Antigravity fallback
Exact user prompt:
> in case the limit exhausts create something to shift to antigravity
Result: prepare ANTIGRAVITY_HANDOFF.md with a copy-paste continuation prompt, actual current state, repository/run instructions and remaining verification. Include it in source and a downloadable source/history backup. This is a backup request; continue building here.

### P004–P010 completion evidence
All three acts implemented. Six engine tests pass. Browser completed acts 1 and 2 and tested runner controls, pause, calm mode, defeat and retry. Full chase victory is engine-tested, not browser-certified. Added final test report, animated file incident and Antigravity fallback. Direct GitHub CLI push lacked credentials; used the authorized GitHub connector to import actual local milestone snapshots as commits on top of the original main. Local full history remains preserved, including v0.0.1 and v0.2.0 tags; do not confuse connector import commit hashes with local source hashes.
