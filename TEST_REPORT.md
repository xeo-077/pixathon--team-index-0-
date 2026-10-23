# Validation report — 2026-10-23

## Automated checks actually run
`npm test`: six tests passed, zero failed. No third-party test dependencies.
`node --check dist/app.js`: passed.

Coverage: report order; both correct/incorrect dialogue answers; breadth-first HR route discovery; replay determinism; wall rejection; HR detection; complete 15-wave no-hit chase solution; paper jump versus cabinet collision; three-hit loss; reset state; terminal-state immutability.

## Browser checks actually performed
In the Chrome cloud browser against local preview:
- Initial screen and original office artwork render.
- Sending before renaming shows an error and preserves the task.
- Rename, attach, send progresses to Priya.
- Incorrect reply gives feedback; correct Priya and Dev replies complete Act 1.
- Act 2's 14-turn known route reaches the exit and shows victory.
- Act tabs switch scenes; chase intro and file incident text display.
- Chase left movement and jump state update; pause shows overlay and Resume.
- Calm mode toggles and chase resumes.
- Leaving the runner unsteered reaches the three-hit defeat screen; Retry returns to its intro.

## Limits
The full 15-wave winning chase is verified in the engine tests, not an end-to-end browser victory run. A browser wait call timed out despite diagnostics reporting the requested progress text visible; do not count that attempt as a passed full-run test. Responsive CSS and tap controls are implemented, but a physical-phone/viewport playtest was not completed. No real stranger playtest or user satisfaction claim is made. Optional sound has code coverage by inspection, not audio-quality testing. The most recent file-fall CSS animation has syntax/source validation; its full animation was not timed in browser QA.

## Team smoke test before pitching
Open each tab, complete the first act, use the HR route in RULES.md, finish a chase in Calm mode, then retry after losing. Check on the actual laptop/browser used for judging. Verify the public repository and selected live/local delivery method. This checklist does not imply those team tests have already happened.
