# Game rules — You're the Distraction

One-line goal: Finish your work, outsmart the office and reach the exit without overtime.

## Act 1: The cubicle
Click Rename, Attach, Send in that order. Wrong-order actions give feedback and preserve progress. Priya's correct answer is B: redirect the sales meeting to Dev, who has the dashboard. Dev's correct answer is C: point him to the report summary. Wrong replies provide humorous feedback and allow retry. Both conversations must complete.

## Act 2: HR has eyes
12 columns by 8 rows, zero-based coordinates in engine.js. Player starts (1,6); exit (10,1). Every legal arrow/WASD movement or Wait/Space advances one turn; walls and boundaries reject movement without consuming a turn. HR follows a 12-step horizontal cycle on row 3. The orange region contains HR's occupied cell and the next two cells in its facing direction, ending at walls/bounds. A move loses if its destination is visible either before or after HR advances. Reaching the exit after surviving wins. The patrol is turn-based, not a real-time random guard.

Validated route from start: Up, Up, Right x7, Up x3, Right x2 (14 turns). The test suite independently discovers it with breadth-first search. A route outside the middle of HR's patrol is intentional in this beginner level.

## Act 3: The final follow-up
A file-fall incident alerts the boss. Press Run to start 15 deterministic obstacle waves. Each wave has one clear lane, a low paper stack and a tall cabinet. Left/right switches lanes. Space/Jump arms a jump until the end of that wave. A jump clears papers but not cabinets. Contact with an obstacle adds a strike; three strikes lose. Finish wave 15 with fewer than three strikes to win. Clear-lane clues are visible; this final act is an arcade payoff with readable decisions, not a claim of a wholly novel runner mechanic.

Wave duration: 2.1 seconds, or 3.2 seconds in Calm mode. Calm mode resets the current wave timer when changed. Pause, help and tab visibility loss stop the chase. Resume continues the same wave. No network, account, runtime AI, or randomness is required for gameplay.

## Controls and scope
All acts are selectable for jury demos; completed tabs show checkmarks. Restart resets only the current act. Replay after final victory clears the completion set. Progress is session-only and resets on reload. Sound is opt-in; reduced-motion preference enables Calm mode initially. Canvas scenes have text instructions and button controls, but the visual stealth board is not a fully screen-reader-playable grid.
