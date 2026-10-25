import { grant, take, clamp, canExit, objective } from "./engine.js";
const choice = (id, label) => ({ id, label });
const say = (speaker, text, choices = []) => ({ speaker, text, choices });
export function interact(s, id, answer, runtime) {
  const f = s.flags,
    done = (text) => say("YOU", text),
    wrong = (text) => {
      s.attention = clamp(s.attention + 1, 0, 5);
      return done(text + " Attention +1. Water and honest handoffs help.");
    };
  if (s.level === 1)
    switch (id) {
      case "email":
        f.email = true;
        return say(
          "EMAIL / 16:58",
          "Maya: “Send the SIGNED total, not the newest filename. Our release total is 184. Meeting access = audit day followed by closing hour (24-hour clock). We close at 17.”",
        );
      case "board":
        f.board = true;
        return say(
          "OPERATIONS NOTICE",
          "AUDIT DAY: 24. Printer routing: confidential TRIANGLE goes first; SQUARE is the archive and must go last. The remaining CIRCLE goes between. Nobody knows why the machine has opinions.",
        );
      case "cabinet":
        f.queue = true;
        return say(
          "RECORDS",
          "Revision 5: 176 / unsigned. Revision 6: 184 / corrected. Revision 7: 192 / includes duplicates. “FINAL” is a state of mind, not a version number.",
        );
      case "supply":
        if (f.fuse)
          return done(
            "The spare fuse is already yours. Please stop inventorying the same fuse.",
          );
        f.fuse = true;
        grant(s, "Fuse");
        return done(
          "One spare printer fuse. Label: “Insert before routing. Do not lick.”",
        );
      case "maya":
        if (f.authorized)
          return say(
            "MAYA",
            "The signature is yours. I sign totals, not vibes. Your archive email tells you which total.",
          );
        if (answer === "verify" && f.email) {
          f.authorized = true;
          grant(s, "Signed release");
          s.attention = Math.max(0, s.attention - 1);
          return say(
            "MAYA",
            "184. You actually read it. Here’s my signature. The corrected report is locked in the meeting room; the noticeboard and email explain the code.",
          );
        }
        if (answer === "rush")
          return wrong(
            "Maya: “Urgent is not a number. Read the archive before asking me to approve it.”",
          );
        if (answer === "audit")
          return say(
            "MAYA",
            "The latest file counts eight customers twice. Check Records near the east elevator. I’ll be here, retiring one staple at a time.",
          );
        return say(
          "MAYA",
          "“I can sign your release. Tell me what I’m signing, or help me audit the versions.”",
          [
            choice("verify", "Verify the 184 total from the archive"),
            choice("audit", "Ask what changed between versions"),
            choice("rush", "Ask for approval now; reconcile tomorrow"),
          ],
        );
      case "meeting":
        if (f.meeting)
          return done(
            "The meeting room is empty. The corrected report is already in your bag.",
          );
        if (answer) {
          if (answer === "2417" && f.email && f.board) {
            f.meeting = true;
            grant(s, "Corrected report");
            return done(
              "24 + 17. The lock opens. You retrieve revision 6, total 184. A note: “The report was ready at four. The meeting about it wasn’t.”",
            );
          }
          return wrong(
            "Keypad rejected. Use the AUDIT DAY, then the CLOSING HOUR. Check both sources.",
          );
        }
        return say(
          "MEETING ROOM",
          "Four digits. “Audit day, then closing hour.” The clue is split between the noticeboard and your email.",
          ["1724", "2417", "2405", "0517"].map((n) => choice(n, n)),
        );
      case "printer":
        if (f.printer)
          return done(
            "Your routed report is printed. The printer has resumed its main job: looking busy.",
          );
        if (!s.inventory.includes("Fuse"))
          return done(
            "No power. Find a spare fuse in the west supply cupboard.",
          );
        if (!f.meeting || !f.authorized)
          return done(
            "Power ready. The queue still needs the corrected report and Maya’s signed release.",
          );
        if (answer) {
          if (answer === "TCS" && f.board) {
            f.printer = true;
            take(s, "Fuse");
            grant(s, "Printed report");
            return done(
              "TRIANGLE → CIRCLE → SQUARE. Signed copy routed; archive copy retained. The printer makes a tiny, reluctant victory noise.",
            );
          }
          return wrong(
            "Wrong routing. The confidential copy goes first and the archive goes last. The noticeboard names their shapes.",
          );
        }
        return say(
          "PRINTER",
          "Choose the routing order. All three copies matter. Read the noticeboard before committing.",
          [
            choice("TSC", "Triangle → Square → Circle"),
            choice("CTS", "Circle → Triangle → Square"),
            choice("TCS", "Triangle → Circle → Square"),
            choice("SCT", "Square → Circle → Triangle"),
          ],
        );
      case "computer":
        if (f.report)
          return done(
            "DELIVERED: revision 6 / total 184. Receipt in bag. Now settle the two handoffs and leave.",
          );
        if (answer) {
          if (
            answer === "r6" &&
            f.printer &&
            f.authorized &&
            f.meeting &&
            f.email
          ) {
            f.report = true;
            f.receipt = true;
            take(s, "Printed report");
            grant(s, "Receipt");
            return done(
              "Report delivered. A reply arrives instantly: “Thanks, can we discuss tomorrow?” You have never loved an adverb more.",
            );
          }
          return wrong(
            "Submission held. Match the signed total to the revision and attach the PRINTED, routed report.",
          );
        }
        return say(
          "YOUR DESKTOP",
          "Three versions. One signed total. Attach the routed printout before sending.",
          [
            choice("r5", "Send revision 5 — total 176"),
            choice("r6", "Send revision 6 — total 184"),
            choice("r7", "Send revision 7 — total 192"),
          ],
        );
      case "priya":
        if (f.priya)
          return say(
            "PRIYA",
            f.helpedPriya
              ? "“Dev has the handoff. I owe you a coffee and possibly an evening.”"
              : "“Tomorrow works. I’m holding you to the boundary you just set.”",
          );
        if (answer === "share" && f.report) {
          f.priya = true;
          f.helpedPriya = true;
          s.attention = Math.max(0, s.attention - 1);
          return say(
            "PRIYA",
            "“A written handoff! Suspiciously useful. Coffee in the break room is yours. Also: HR investigates printer errors for thirteen seconds. They call it culture.”",
          );
        }
        if (answer === "tomorrow") {
          f.priya = true;
          s.attention = clamp(s.attention + 1, 0, 5);
          return say(
            "PRIYA",
            "“Fair. Tomorrow, then. I’ll tell Dev you’re leaving.” Boundary accepted; attention +1. No coffee, but no extra task either.",
          );
        }
        if (answer === "cover")
          return say(
            "PRIYA",
            "“You don’t need to cover it. I need the numbers, not your chair. Submit the report and we can share the handoff.”",
          );
        if (answer === "share")
          return done(
            "The report is not submitted yet. Priya needs a real link, not a promise.",
          );
        return say(
          "PRIYA",
          "“My 5:30 review needs your numbers. I could chase Dev, move it, or borrow your evening. Which cost can we afford?”",
          [
            choice("share", "Share the submitted report with Dev"),
            choice("tomorrow", "Move the review to tomorrow (+attention)"),
            choice("cover", "Offer to cover, but ask what is needed"),
          ],
        );
      case "dev":
        if (f.dev)
          return say(
            "DEV",
            "“I’ve read your summary. It’s three lines. I feel almost aggressively informed.”",
          );
        if (answer === "written" && f.report) {
          f.dev = true;
          f.hrTip = true;
          grant(s, "Patrol memo");
          s.attention = Math.max(0, s.attention - 1);
          return say(
            "DEV",
            "“Written is better. Here: facilities uses circuit B; A is alarms, C is lights. Don’t tell anyone I read the manual. It would ruin my brand.”",
          );
        }
        if (answer === "brief" && f.report) {
          f.dev = true;
          s.attention = clamp(s.attention + 1, 0, 5);
          return say(
            "DEV",
            "“Thirty seconds? Fine. Send me the receipt.” Handoff complete; attention +1. He keeps his facilities memo.",
          );
        }
        if (answer)
          return done(
            "Dev needs the completed report first. He can postpone a meeting, but not a missing attachment.",
          );
        return say(
          "DEV",
          "“Walk me through the report? Or give me something I can read without you standing next to it.”",
          [
            choice("written", "Send the written summary and receipt"),
            choice("brief", "Give a brief spoken handoff (+attention)"),
          ],
        );
      case "water":
        s.attention = Math.max(0, s.attention - 2);
        return done(
          "You drink water without networking. Attention −2. A surprisingly radical act.",
        );
      case "coffee":
        if (!f.helpedPriya)
          return done(
            "Priya’s coffee. Help her with the report handoff and she may share.",
          );
        if (f.coffee)
          return done("One emergency coffee per exhausted employee.");
        f.coffee = true;
        grant(s, "Emergency coffee");
        return done(
          "Emergency coffee acquired. Automatically pushes the boss back once if pursuit reaches 100.",
        );
      case "elevator":
        if (!canExit(s))
          return done(
            "The elevator requests a signed receipt and both colleague handoffs. " +
              objective(s),
          );
        if (answer === "receipt")
          return {
            ...say(
              "ELEVATOR",
              "“Receipt accepted. Surprise exit interview cancelled.” You have escaped your team. HR would like a word.",
            ),
            exit: true,
          };
        if (answer)
          return wrong(
            "The elevator: “Verbal assurance is not a receipt.” It’s a lift with a promotion complex.",
          );
        return say(
          "ELEVATOR / FINAL INTERRUPTION",
          "The doors open. A speaker crackles: “Before you leave: prove this is a handoff, not an escape.”",
          [
            choice("receipt", "Scan the delivery receipt and signed total"),
            choice("promise", "Promise the report is probably fine"),
          ],
        );
    }
  if (s.level === 2)
    switch (id) {
      case "rules":
        return say(
          "HR POLICY",
          "Cone stripes mean visible space. Walls block sight. Detection builds, then falls out of sight. Alcoves hide you for five seconds, unless HR already saw you. Printer and phone pull nearby patrols away. A pass checkpoints Records.",
        );
      case "pass":
        if (
          !f.pass &&
          (!f.noisePrinter || runtime?.guards[0].state !== "investigating")
        )
          return done(
            "Credentials are under audit. Trigger the west printer, then reach this drawer while HR investigates (13 seconds). The drawer relocks when the audit resumes.",
          );
        f.pass = true;
        grant(s, "Visitor pass");
        s.checkpoint = "records";
        return done(
          "Visitor pass acquired. CHECKPOINT: Records. If caught, keep your discoveries and return to south Records.",
        );
      case "locker":
        f.log = true;
        grant(s, "Circuit note");
        return say(
          "FACILITIES LOG",
          "A = alarms. B = surveillance. C = lights. A visitor pass can isolate B for 45 seconds. The north release holds the fire stairs for 60 seconds. The reception phone diverts the east officer.",
        );
      case "terminal":
        if (!f.pass || !f.log)
          return done(
            "Requires a visitor pass and facilities circuit note. Records has both.",
          );
        if (answer === "B") {
          f.terminal = true;
          return {
            ...done(
              "Circuit B isolated for 45 seconds. Reception is south; release is northeast. Return here to renew the camera outage.",
            ),
            disable: true,
          };
        }
        if (answer)
          return {
            ...done(
              "Wrong circuit. Power is restored automatically. Camera scrutiny increases; use the facilities note.",
            ),
            alarm: true,
          };
        return say(
          "SECURITY",
          "Isolate one circuit. The log describes what each one powers.",
          ["A", "B", "C"].map((n) => choice(n, "Circuit " + n)),
        );
      case "relay":
        if (!f.terminal || !f.phone)
          return done(
            "Release locked. Authorize at Security and call reception first.",
          );
        f.relay = true;
        return {
          ...done(
            "Fire stairs released for 60 seconds. Head south past the coat closet. The route is open; surveillance is still real.",
          ),
          release: true,
        };
      case "stairs":
        return canExit(s)
          ? {
              ...done(
                "The stairs. Quiet at last. A file slips from your hands…",
              ),
              exit: true,
            }
          : done("Stairs locked. " + objective(s));
    }
  return done("Nothing else here needs your evening.");
}
export const clues = (s) =>
  [
    s.flags.email && "Email: signed total 184; closing hour 17.",
    s.flags.board && "Board: audit day 24. Triangle first; square last.",
    s.flags.queue && "Records: v5 = 176; v6 = 184; v7 = 192.",
    s.flags.hrTip && "Dev: circuit B controls surveillance.",
    s.flags.log && "Facilities: B = cameras (45s); release holds stairs 60s.",
  ].filter(Boolean);
