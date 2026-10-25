# Intended solutions and balancing notes

These are spoilers. Coordinates below use tile centers, with the northwest tile at (0,0). The player journal gives contextual help without the complete route.

## Act 1

1. Read Email Archive near (8,7): signed total 184 and closing hour 17.
2. Read Noticeboard (16,3): audit day 24; triangle first, square last.
3. Inspect Records (34,4): revision 6 has total 184; revision 7 includes duplicates. The meeting room also identifies the correct revision, so this optional discovery cannot softlock the puzzle.
4. Ask Maya (7,20) to verify 184. Obtain Signed Release. An audit question gives context; asking for a rushed signature adds attention.
5. Enter 2417 at the Meeting Room (30,16). Both clues must actually have been read. Obtain Corrected Report.
6. Collect Fuse from Supply (4,15). At Printer (19,18), route Triangle → Circle → Square. This consumes the fuse and requires the report and signature.
7. At Your Computer (5,7), send revision 6 / 184. Receive a receipt.
8. Share the submitted report with Priya (16,8). Alternatively defer her meeting, completing the handoff but adding attention and forfeiting coffee.
9. Give Dev (29,8) the written summary. Alternatively use a spoken handoff at an attention cost. His written branch grants a facilities clue.
10. Optional: collect Priya's coffee (34,23). Water (12,22) reduces attention by two, without consuming puzzle progress.
11. At Elevator (37,5), answer the surprise verification with the receipt. All prerequisites are checked again before transition.

## Act 2

Learn the three officers' routes and sweeping cameras. Striped cones are visible areas, clipped by walls. Standard detection takes about 1.7 seconds of uninterrupted sight at zero attention; leaving sight drains it. Do not walk directly toward an inspecting officer.

1. From the southwest lobby, approach the west Audit Printer (8,9) and trigger it. The west officer investigates for 13 seconds, with a 22-second device cooldown.
2. Cross into Records through the north gap (rows 8–9) and reach Visitor Credentials (17,5) while that investigation is active. A stale distraction flag alone cannot open the drawer. This establishes the Records checkpoint.
3. Read Facilities Log (19,22). Its note identifies circuit B, the camera isolation and the release timer.
4. Cross the east partition and reach Security (29,7). Use circuit B; A/C instead raise suspicion and explain the error. Renew the outage when needed.
5. The direct walk south from Security runs into the east patrol. One verified route goes via (38.5,8.5), then (38.5,21.5), before approaching Reception Phone (30,21) from the east. This relies on the patrol phase reached by the documented sequence, not a universally safe corridor.
6. Trigger the phone. While HR investigates, activate Stairwell Release (35,4). Return south along the east edge, via (38.5,5.5) and (38.5,25.5), to Fire Stairs (37,24) within 60 seconds.

Alcoves offer five seconds of temporary safety. They cannot erase a witnessed entry. Failed attempts retain acquired credentials and circuit progress, reset timed releases and return to Records. Re-authorize cameras if needed. Longer exploration changes patrol timing; use line of sight rather than blindly replaying the route.

## Act 3

The falling file alerts the boss. The chase lasts 60 rows, approximately 108 simulation seconds without retries, plus the opening and ending. This is shorter than the brief's first-play target; retry duration and unfamiliar-player difficulty have not been measured.

- Phase 1 (rows 1–20): distinguish paper, cabinets and overhead bars. Some rows require every lane to jump or slide.
- Phase 2 (21–40): shorter intervals; marked moving rows rotate all hazards one lane right at 45% of their approach.
- Phase 3 (41–60): shorter intervals again, mixed evasions and the final release. On row 57, take center and press E after the switch crosses halfway. Row 60 requires a jump.
- Activate jump/slide around 0.3 seconds before contact. Early presses expire. Cabinets always require a lane change. No permanent safe lane is labelled.
- A clean row recovers pressure. Six or more poorly handled rows can still fail despite the optional coffee rescue. Phase checkpoints preserve meaningful progress.

The automated solver verifies a legal action sequence for every row, respecting action/lane cooldowns. A deliberate no-input browser run fails; retry then reaches the ending with normal controls.

## Design evidence

Art direction follows the broad top-down readability and compact character proportions of the [Nintendo Ruby/Sapphire reference](https://www.nintendo.co.jp/n08/axvp/), without importing its assets. Separating hazard pacing from reduced-motion settings follows the distinction between difficulty and accessibility discussed by [Xbox guideline 108](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/108). These references informed decisions, not claims of equivalent visual polish or accessibility certification.
