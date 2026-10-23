# AI_LOG — You're the Distraction

Pixathon, 23 October 2026. Tool/model identities below describe actual use, not a desired tool list. Exact message times and underlying model identifier were not exposed and are not invented.

## Tools actually used
- ChatGPT/Codex assistant in this conversation: ideation, specification, HTML/CSS/JS implementation, original canvas art, documentation, debugging and tests.
- Node.js built-in test runner: automated engine tests and breadth-first search proving the HR map has a solution. This is a testing tool, not a second AI model.
- Browser automation: played report/conversation success and failure paths and HR completion; see TEST_REPORT.md for final coverage.
- Git: real source checkpoints. GitHub connector: inspect destination and publish source as authorized. Sites: prepare browser hosting.
- The reference PDF was rendered and visually read. No PixelLab, Suno, ElevenLabs, Stitch, Replit or Antigravity was used to create this version. Antigravity handoff is a contingency only.

## Key prompts — verbatim excerpts, with result summaries
1. **“which one seems the most interesting and most scalable in terms ideations and creativity”** — compared the four supplied briefs; user later chose open innovation instead of the initial recommendation.
2. **“i want to go with open innovation puzzle , explore more on it , give me 3 best ideas which have unique innovative , creative , has humour”** — generated three concepts, including an office escape.
3. **“we like the second  one , shift this to codex , we need to upload this on github so maintain the versions , we need prompt log for this”** — prepared a design checkpoint and logging rules.
4. **“leave codex do everything here cuz i dont understand shit , our There will be three levels:”** — excerpt of the user's full design revision; full prompt in PROMPT_LOG.md P004. The user specified cubicle conversations, HR patrol, and falling-file boss chase. That superseded the ghost concept.
5. **“update everything needed as per the ppt , of 22 pages”** — read the orientation deck; added this exact AI_LOG filename, pitch and rubric checklist.
6. **“start working on the game , it should be a browser based game with the level structure as discussed”** — retained browser-only implementation and the three specified acts.
7. **“in case the limit exhausts create something to shift to antigravity”** — added a portable continuation brief and source backup, while continuing this build.

## Human direction versus AI work
The team selected the theme and revised the three-level structure. The assistant translated ambiguous 'office skill' into report sequencing, wrote the dialogues and implementation, and tested deterministic mechanics. The team still needs to judge whether the experience is fun and supply member names/official submission. We do not claim those human playtests have occurred.

## When AI got it wrong
**Source packaging bug:** the initial AI-generated .gitignore excluded dist/. That is usual for generated builds, but this game is buildless and its actual source lives in dist/. A normal commit could have omitted the game. The exclusion was removed before committing the playable milestone, and Git's tracked-file listing was checked.

**Visual correction:** the HR grid extended to the lower canvas edge. Browser inspection led to moving its origin up 12 pixels. This was a small layout correction, not an invented unsolvable-level story.

**Design correction:** the assistant initially pushed a different brief and later recommended Emotional Baggage. The team chose the office escape and restructured it. The implemented game follows the team's decision.

## Evidence and limitations
PROMPT_LOG.md is the chronological record. tests/engine.test.js and TEST_REPORT.md distinguish engine verification from browser verification. CHANGELOG.md and actual Git commits record real checkpoints. No model-internal reasoning, private credentials or unrelated conversations are included.
