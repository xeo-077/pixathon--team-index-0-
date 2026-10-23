# Validation

Recorded on 23 October 2026. Results distinguish rule-engine coverage from observed browser behaviour.

## Automated checks

| Check | Result |
| --- | --- |
| `npm test` | 6 passed, 0 failed |
| `node --check dist/app.js` | Passed |
| HR route search | Found and replayed a valid 14-turn solution |
| Full chase solution | All 15 waves completed without strikes in the engine |

The test suite covers report ordering, correct and incorrect dialogue answers, patrol replay, wall rejection, detection, paper jumps, cabinet collisions, three-strike defeat, reset state and terminal-state immutability.

## Browser checks

| Scenario | Observed result |
| --- | --- |
| Report submitted out of sequence | Feedback shown; progress preserved |
| Report completed in sequence | Conversation phase opened |
| Incorrect and correct dialogue choices | Feedback and progression behaved as specified |
| HR solution replay | Exit and act-completion screen reached |
| Act navigation and chase intro | Scenes and incident text displayed |
| Chase movement and jump | Lane and jump state updated |
| Pause, resume and Calm mode | Controls responded; chase resumed |
| Three-hit chase defeat and retry | Defeat screen shown; retry returned to intro |

## Remaining coverage

- Complete a winning chase in a browser; the full solution currently has engine-test coverage.
- Playtest on a physical phone and with an unfamiliar player.
- Review sound quality and the timing of the latest file-fall animation.

A browser progress wait timed out during the attempted full chase run; it is recorded as inconclusive. The visual patrol board is not fully screen-reader playable.
