# Project instructions

- Read README.md, RULES.md, AI_LOG.md and PROMPT_LOG.md before implementation. The user revised the original ghost concept to three office escape acts.
- Preserve this as a browser puzzle with a one-sentence goal, at least three solvable levels, win state, and restart.
- At each user request, append the exact task prompt to PROMPT_LOG.md before changing code. Preserve multiline prompts. Log tool/model only when known; never fabricate timestamps or conversations. Do not log secrets or hidden reasoning. Record redactions explicitly.
- After work, append a concise result, changed files, validation actually performed, and unresolved limitations. Log substantive follow-up prompts submitted to other AI tools if actually used. Summaries must be labeled summaries.
- Keep CHANGELOG.md and VERSION current at release checkpoints. Planned versions are not completed releases.
- Commit coherent milestones including the corresponding prompt log and changelog. Never rewrite existing history or force-push. Do not manufacture user attribution. If a commit cannot be made, report why.
- Tag validated milestones: v0.1.0 engine + one level; v0.2.0 three levels; v1.0.0 tested submission. Do not tag milestones before they work.
- Work on main initially; use feature branches for parallel human contributions. Never discard another contributor's changes.
- Before pushing, inspect staged files for secrets and unrelated assets. GitHub destination: https://github.com/xeo-077/pixathon--team-index-0-.git. Sites source hosting is also authorized for a playable link. Preserve both histories.
- Keep simulation deterministic and separate from rendering. Test successful solutions and failure/restart cases, not just individual functions.
