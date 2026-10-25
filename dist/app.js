import {
  fresh,
  move,
  nearby,
  objective,
  advance,
  canExit,
  retry,
  restart,
  newStealth,
  tickStealth,
  distract,
  hide,
  newChase,
  chaseAction,
  tickChase,
  pressGate,
  wave,
} from "./engine.js";
import { MAPS, names } from "./world.js";
import { interact, clues } from "./story.js";
import { readSave, writeSave, SAVE_KEY } from "./save.js";
import { render, person } from "./render.js";
import { Sound } from "./audio.js";
const $ = (s) => document.querySelector(s),
  canvas = $("#game"),
  ctx = canvas.getContext("2d"),
  overlay = $("#overlay"),
  sound = new Sound();
let storage;
try {
  storage = localStorage;
} catch {
  storage = {
    getItem: () => null,
    setItem: () => {
      throw Error("Storage unavailable");
    },
  };
}
let saved = readSave(storage),
  state = saved || fresh(),
  mode = "title",
  panel = null,
  time = 0,
  walking = false,
  toastTime = 0,
  last = 0,
  lastHud = "",
  activeObject = null;
let stealth = newStealth(),
  chase = newChase(),
  keys = new Set(),
  selected = 0;
const local = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname),
  params = new URLSearchParams(location.search),
  testing = local && params.get("test") === "1",
  demo = local && params.get("demo") === "1";
if (!saved)
  state.settings.reduced = matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
function toast(text) {
  $("#toast").textContent = text;
  toastTime = 4;
}
function save() {
  if (demo) return true;
  const ok = writeSave(storage, state);
  saved = ok ? structuredClone(state) : saved;
  if (!ok) toast("Save unavailable. Keep this tab open to retain progress.");
  return ok;
}
function close() {
  overlay.replaceChildren();
  panel = null;
  keys.clear();
  activeObject = null;
  canvas.focus();
}
function show(title, text, choices, kind = "menu", speaker = "YOU") {
  keys.clear();
  panel = kind;
  overlay.replaceChildren();
  const box = document.createElement("section");
  box.className =
    "box " +
    (kind === "dialogue" ? "dialogue" : kind === "title" ? "title-menu" : "");
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", title);
  box.setAttribute("aria-modal", "true");
  const head = document.createElement("div");
  head.className = "speaker";
  if (kind === "dialogue") {
    const portrait = document.createElement("canvas");
    portrait.width = 48;
    portrait.height = 48;
    portrait.className = "portrait";
    portrait.setAttribute("aria-hidden", "true");
    const who = speaker.toLowerCase().split(" ")[0];
    person(
      portrait.getContext("2d"),
      24,
      44,
      who === "priya" ? "#cc789e" : who === "maya" ? "#d5a454" : "#65cbb7",
      0,
      false,
      1.57,
      who,
      1.6,
    );
    head.append(portrait);
  }
  const h = document.createElement("h2");
  h.textContent = title;
  head.append(h);
  box.append(head);
  if (text) {
    const p = document.createElement("p");
    p.textContent = text;
    box.append(p);
  }
  const list = document.createElement("div");
  list.className = "choices";
  for (const item of choices) {
    const b = document.createElement("button");
    b.textContent = item.label;
    b.onclick = () => {
      sound.unlock();
      sound.effect("click", state.settings);
      item.run();
    };
    list.append(b);
  }
  box.append(list);
  overlay.append(box);
  selected = 0;
  list.querySelector("button")?.focus();
  return box;
}
const back = (label = "Back") => ({ label, run: () => close() });
function title() {
  mode = "title";
  $("#hud").hidden = true;
  $("#prompt").textContent = "";
  $("#toast").textContent = "";
  const choices = [];
  if (saved)
    choices.push({
      label: "Continue",
      run: () => {
        state = readSave(storage) || state;
        start(false);
      },
    });
  choices.push({
    label: "New Game",
    run: () => {
      if (saved)
        show(
          "REPLACE SAVED GAME?",
          "This starts a new evening and replaces your checkpoint.",
          [
            { label: "Keep my save", run: title },
            { label: "Start a new game", run: newGame },
          ],
        );
      else newGame();
    },
  });
  choices.push(
    { label: "Settings", run: () => settings(title) },
    { label: "Credits", run: () => credits(title) },
  );
  if (demo) choices.push({ label: "Developer demo", run: demoMenu });
  show("YOU’RE THE DISTRACTION", "", choices, "title");
}
function newGame() {
  state = fresh(state.settings);
  save();
  mode = "play";
  stealth = newStealth();
  chase = newChase();
  show(
    "17:01 / THE CUBICLE",
    "Your shift ended one minute ago. Your report did not.\n\nPriya needs a handoff. Dev needs reassurance. Maya needs a number. You need your evening.\n\nMove with WASD or arrows. Stand near a gold-marked object and press E. Your email archive is the desk just east of you.",
    [
      {
        label: "Clock out. Somehow.",
        run: () => {
          close();
          toast(
            "J opens your journal. E interacts. Progress saves after discoveries.",
          );
        },
      },
    ],
    "dialogue",
  );
}
function start(intro = true) {
  mode = "play";
  close();
  stealth = newStealth();
  chase = newChase(state.chaseCheckpoint);
  if (state.complete) {
    ending();
    return;
  }
  if (intro && state.level === 3) chaseIntro();
  else toast("Checkpoint restored. " + objective(state));
}
function actSummary(n) {
  const seconds = Math.round(state.stats.seconds[n - 1]);
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s active play · ${state.stats.retries} total retries · ${state.stats.hints} hints`;
}
function doInteract(answer) {
  if (state.level === 3) {
    if (pressGate(chase)) {
      toast("GATE RELEASED. Keep moving!");
      sound.effect("win", state.settings);
    }
    return;
  }
  const o = activeObject || nearby(state);
  if (!o) return;
  if (!activeObject || activeObject.id !== o.id) {
    const current = nearby(state);
    if (!current || current.id !== o.id) return;
  }
  if (state.level === 2 && ["phone", "noisePrinter"].includes(o.id)) {
    toast(
      distract(state, stealth, o.id)
        ? "Noise triggered. HR is investigating for 13 seconds."
        : "Device cooling down. Try again in a moment.",
    );
    save();
    return;
  }
  if (o.type === "hide") {
    toast(hide(state, stealth));
    return;
  }
  const response = interact(state, o.id, answer);
  activeObject = o;
  if (response.disable) stealth.disable = 45;
  if (response.release) stealth.release = 60;
  if (response.alarm) stealth.suspicion = Math.min(95, stealth.suspicion + 40);
  save();
  sound.effect(response.exit ? "win" : "click", state.settings);
  if (response.exit) {
    if (!canExit(state)) return;
    const completed = state.level;
    if (!advance(state)) return;
    save();
    stealth = newStealth();
    chase = newChase();
    show(
      completed === 1 ? "YOU HAVE ESCAPED YOUR TEAM" : "HR HAS LOST YOUR FILE",
      response.text + "\n\n" + actSummary(completed),
      [
        {
          label: completed === 1 ? "HR would like a word." : "Take the stairs.",
          run: () => {
            close();
            if (state.level === 3) chaseIntro();
            else toast("Watch cones. Hiding is temporary. J has the plan.");
          },
        },
      ],
    );
    return;
  }
  const actions = response.choices.map((a) => ({
    label: a.label,
    run: () => doInteract(a.id),
  }));
  actions.push({
    label: response.choices.length ? "Leave conversation" : "Continue",
    run: () => close(),
  });
  show(response.speaker, response.text, actions, "dialogue", response.speaker);
  activeObject = o;
}
function chaseIntro() {
  show(
    "THE FINAL FOLLOW-UP",
    "A file slips. Paper scatters across the stairwell.\n\nTHUD.\n\nThe office goes quiet. A silhouette turns.\nBOSS: “Leaving already?”\nBOSS: “I’ve got one last thing for you.”",
    [
      {
        label: "Run! (Skip / continue)",
        run: () => {
          close();
          show(
            "RUN. THE BOSS IS COMING.",
            "← → / A D: change lanes. Space / ↑: jump PAPER. ↓ / S: slide BARS. Dodge CABINETS.\n\nTime actions as obstacles reach the gold contact line. Each lasts 0.68 seconds. Carts shift in phases 2–3. The last gate needs E in the center lane.\n\nCheckpoints after waves 20, 40 and 56.",
            [
              {
                label: "I’m not available.",
                run: () => {
                  close();
                  toast("Phase 1 / Office panic");
                },
              },
            ],
          );
        },
      },
    ],
    "dialogue",
    "BOSS",
  );
}
function failure(reason) {
  save();
  show(
    state.level === 2 ? "HR WOULD LIKE A WORD" : "MEETING ACCEPTED",
    reason +
      "\n\n" +
      (state.level === 2
        ? "Discoveries are safe. Break sight before the meter fills."
        : "Time jump / slide at the gold line. Pressure falls after clean waves."),
    [
      {
        label: "Retry checkpoint",
        run: () => {
          retry(state);
          stealth = newStealth();
          chase = newChase(state.chaseCheckpoint);
          save();
          close();
        },
      },
      { label: "Adjust pacing", run: () => settings(() => failure(reason)) },
    ],
    "failure",
  );
  sound.effect("error", state.settings);
}
function ending() {
  mode = "ending";
  save();
  show(
    "YOU’RE THE DISTRACTION",
    "Outside, Priya, Dev and Maya are waiting.\n\nPRIYA: “While he chased you, we all left.”\nDEV: “For once, that meeting helped the whole team.”\nMAYA: “Tomorrow, we leave together.”\n\nYou weren’t avoiding the work. You were the distraction that let everyone go home.\n\n" +
      state.stats.seconds
        .map((_, i) => `Act ${i + 1}: ${Math.round(state.stats.seconds[i])}s`)
        .join(" · ") +
      `\n${state.stats.retries} retries · ${state.stats.detections} detections · ${state.stats.collisions} collisions`,
    [
      { label: "The evening is ours. / Credits", run: () => credits(title) },
      { label: "Return to title", run: title },
    ],
  );
  sound.effect("win", state.settings);
}
function credits(next) {
  show(
    "CLOCKED OUT",
    "YOU’RE THE DISTRACTION\nTeam Index 0 · Pixathon\n\nCorporate Sapphire edition\nOriginal procedural pixel artwork and synthesized audio.\nBuilt with Canvas, JavaScript and Web Audio.\nAI-assisted engineering; actual process recorded in AI_LOG.md.\n\nNo office emails were answered after hours in the making of this escape.",
    [{ label: "Return", run: next }],
  );
}
function pause() {
  if (mode === "title") {
    title();
    return;
  }
  show("PAUSED / THE BOSS CAN WAIT", objective(state), [
    { label: "Resume", run: () => close() },
    { label: "Inventory & clues [I]", run: inventory },
    { label: "Journal & hints [J]", run: journal },
    { label: "Settings & controls", run: () => settings(pause) },
    {
      label: "Restart current level",
      run: () =>
        show(
          "RESTART THIS ACT?",
          "Clears this act’s objectives and returns to its beginning. Earlier acts remain complete.",
          [
            { label: "Cancel", run: pause },
            {
              label: "Restart act",
              run: () => {
                restart(state);
                save();
                start();
              },
            },
          ],
        ),
    },
    {
      label: "Save & return to title",
      run: () => {
        save();
        title();
      },
    },
  ]);
}
function inventory() {
  show(
    "BAG / EVIDENCE",
    state.inventory.length
      ? state.inventory.map((i) => "• " + i).join("\n") +
          "\n\n" +
          clues(state).join("\n")
      : "No items yet. Explore the office; look for gold marks.",
    [back("Back to game")],
  );
}
function journal() {
  show(
    "JOURNAL / " + names[state.level - 1],
    objective(state) +
      "\n\n" +
      clues(state).join("\n") +
      "\n\n" +
      (state.level === 1
        ? "Email: northwest desks. Board: north center. Maya: southwest. Meeting: southeast. Elevator: northeast."
        : state.level === 2
          ? "West → Records → Security. North and south passages cross each partition. The mini-map marks walls and your position."
          : "Paper: jump. Bars: slide. Cabinets: dodge. Moving rows rotate right before contact. The final switch needs E."),
    [
      {
        label: "Request a hint (+1 recorded)",
        run: () => {
          state.stats.hints++;
          save();
          show("A SMALL NUDGE", hint(), [back("Back to game")]);
        },
      },
      back("Back to game"),
    ],
  );
}
function hint() {
  const f = state.flags;
  if (state.level === 1) {
    if (!f.meeting)
      return "Email says closing hour 17. Board says audit day 24. Join them: 2417. Maya signs the total 184.";
    if (!f.printer)
      return "Collect the fuse west. Get Maya’s signature. Route Triangle → Circle → Square.";
    if (!f.report)
      return "Revision 6 has the signed total 184. Submit it after printing.";
    return "Share the submitted report with Priya and give Dev the written summary. Show the elevator your receipt.";
  }
  if (state.level === 2)
    return "Use the west printer, then cross into Records at row 8 or 19. Visitor pass is north; circuit note is south. Security in the east uses circuit B. Phone in the southeast diverts HR. North release starts a 60-second window to the south fire stairs.";
  return "Act when the obstacle is about one character-height above the gold line. Jump and slide expire; holding a key does not retrigger them. At wave 57 take center and press E once the switch crosses halfway.";
}
function settings(next = () => close()) {
  const box = show(
    "SETTINGS & CONTROLS",
    "WASD / arrows: move. E / Enter: interact. Space: interact or jump. S / ↓: slide in chase. I: bag. J: journal. Esc: pause.\nMenus: arrows, Enter, Tab or touch.",
    [],
    "settings",
  );
  box.classList.add("settings");
  for (const [key, label] of [
    ["music", "Music volume"],
    ["sound", "Sound volume"],
  ]) {
    const row = document.createElement("label");
    row.textContent = label;
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "1";
    input.step = ".05";
    input.value = state.settings[key];
    input.setAttribute("aria-label", label);
    input.oninput = () => {
      state.settings[key] = +input.value;
      save();
    };
    row.append(input);
    box.append(row);
  }
  for (const [key, label] of [
    ["mute", "Mute all audio"],
    ["reduced", "Reduce motion"],
    ["large", "Larger dialogue"],
    ["pace", "Assist pacing (slower hazards)"],
  ]) {
    const row = document.createElement("label");
    row.textContent = label;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked =
      key === "pace" ? state.settings.pace === "assist" : state.settings[key];
    input.onchange = () => {
      state.settings[key] =
        key === "pace"
          ? input.checked
            ? "assist"
            : "standard"
          : input.checked;
      save();
      applySettings();
    };
    row.append(input);
    box.append(row);
  }
  const actions = document.createElement("div");
  actions.className = "choices";
  for (const a of [
    {
      label: "Fullscreen",
      run: () => {
        if (document.fullscreenElement) document.exitFullscreen?.();
        else
          $("#screen")
            .requestFullscreen?.()
            .catch(() => toast("Fullscreen is unavailable in this browser."));
      },
    },
    {
      label: "Reset all progress",
      run: () =>
        show(
          "RESET PROGRESS?",
          "This removes the saved game from this browser.",
          [
            { label: "Cancel", run: () => settings(next) },
            {
              label: "Reset permanently",
              run: () => {
                try {
                  storage.removeItem(SAVE_KEY);
                } catch {}
                saved = null;
                state = fresh(state.settings);
                title();
              },
            },
          ],
        ),
    },
    { label: "Back", run: next },
  ]) {
    const b = document.createElement("button");
    b.textContent = a.label;
    b.onclick = a.run;
    actions.append(b);
  }
  box.append(actions);
  box.querySelector("input")?.focus();
}
function applySettings() {
  $("#screen").classList.toggle("large", state.settings.large);
}
function demoMenu() {
  show(
    "LOCAL DEVELOPER DEMO",
    "Only enabled on localhost with ?demo=1. Demo progress is temporary. Normal saved progress is never replaced.",
    [1, 2, 3]
      .map((n) => ({
        label: "Demo act " + n,
        run: () => {
          state = fresh();
          if (n > 1)
            for (const k of [
              "email",
              "board",
              "authorized",
              "meeting",
              "printer",
              "report",
              "priya",
              "dev",
              "receipt",
            ])
              state.flags[k] = true;
          if (n === 3)
            for (const k of [
              "pass",
              "log",
              "terminal",
              "phone",
              "noisePrinter",
            ])
              state.flags[k] = true;
          state.level = n;
          state.unlocked = n;
          state.player = { x: 3.5, y: 24.5, face: 0 };
          start();
        },
      }))
      .concat([{ label: "Back", run: title }]),
  );
}
const directions = {
  w: [0, -1],
  arrowup: [0, -1],
  s: [0, 1],
  arrowdown: [0, 1],
  a: [-1, 0],
  arrowleft: [-1, 0],
  d: [1, 0],
  arrowright: [1, 0],
};
function press(k) {
  sound.unlock();
  if (panel) {
    if (k === "escape") {
      if (panel === "title" || panel === "failure") return;
      if (mode === "play") close();
      else title();
      return;
    }
    if (
      ["arrowup", "arrowdown", "w", "s"].includes(k) &&
      document.activeElement?.tagName !== "INPUT"
    ) {
      const buttons = [...overlay.querySelectorAll("button")];
      if (!buttons.length) return;
      selected =
        (buttons.indexOf(document.activeElement) +
          (k === "arrowup" || k === "w" ? -1 : 1) +
          buttons.length) %
        buttons.length;
      buttons[selected].focus();
      return;
    }
    if (
      ["e", " ", "enter"].includes(k) &&
      document.activeElement?.tagName === "BUTTON"
    )
      document.activeElement.click();
    return;
  }
  if (k === "escape") {
    pause();
    return;
  }
  if (k === "i") {
    inventory();
    return;
  }
  if (k === "j") {
    journal();
    return;
  }
  if (mode !== "play") return;
  if (state.level === 3) {
    if (["a", "arrowleft"].includes(k)) chaseAction(chase, "left");
    if (["d", "arrowright"].includes(k)) chaseAction(chase, "right");
    if ([" ", "w", "arrowup"].includes(k)) chaseAction(chase, "jump");
    if (["s", "arrowdown"].includes(k)) chaseAction(chase, "slide");
    if (["e", "enter"].includes(k)) doInteract();
  } else if (["e", "enter", " "].includes(k)) doInteract();
}
document.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (e.target.tagName === "INPUT") return;
  if (
    [
      " ",
      "enter",
      "arrowup",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "escape",
    ].includes(k)
  )
    e.preventDefault();
  if (e.repeat) return;
  keys.add(k);
  press(k);
});
document.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));
window.addEventListener("blur", () => {
  keys.clear();
  if (mode === "play" && !panel) pause();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    keys.clear();
    if (mode === "play" && !panel) pause();
  }
});
$("#pause").onclick = pause;
for (const b of document.querySelectorAll("[data-hold]")) {
  b.onpointerdown = (e) => {
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    keys.add(b.dataset.hold);
    press(b.dataset.hold);
  };
  b.onpointerup = b.onpointercancel = () => keys.delete(b.dataset.hold);
}
for (const b of document.querySelectorAll("[data-press]"))
  b.onclick = () => press(b.dataset.press);
function tick(dt) {
  time += state.settings.reduced ? 0 : dt;
  walking = false;
  if (toastTime > 0) {
    toastTime -= dt;
    if (toastTime <= 0) $("#toast").textContent = "";
  }
  if (mode === "play" && !panel && !state.complete) {
    state.stats.seconds[state.level - 1] += dt;
    if (state.level < 3) {
      if (!stealth.hidden || state.level === 1) {
        const k = [...keys].reverse().find((k) => directions[k]);
        if (k) {
          const d = directions[k];
          walking = move(MAPS[state.level], state.player, ...d, dt);
        }
      }
      if (state.level === 2 && tickStealth(state, stealth, dt) === "caught")
        failure(
          `${stealth.source} filled the detection meter. “Your calendar says you’re available.”`,
        );
    } else {
      const event = tickChase(chase, state, dt);
      if (event === "lost")
        failure(
          chase.wave >= 56 && !chase.gate
            ? "The final release was missed. At wave 57, press E in the center lane after the switch crosses halfway."
            : "The boss caught up. “Let’s put some time in.”",
        );
      if (event === "won") ending();
      if (event === "checkpoint") {
        save();
        toast(
          "CHECKPOINT · " +
            (chase.wave === 20
              ? "Corridor gauntlet"
              : chase.wave === 40
                ? "The final exit"
                : "Release ahead"),
        );
        sound.effect("win", state.settings);
      }
      if (event === "hit") {
        toast("Collision! Pursuit +24");
        sound.effect("error", state.settings);
      }
      if (event === "clean" && chase.wave % 5 === 0)
        toast("Clean sequence. Pursuit falling.");
    }
  }
  sound.update(dt, state.level, state.settings, mode === "play" && !panel);
  draw();
}
function draw() {
  const near = state.level < 3 ? nearby(state) : null;
  render(ctx, state, {
    mode,
    time,
    walking,
    near: panel ? null : near,
    stealth,
    chase,
  });
  $("#hud").hidden = mode !== "play";
  const hud =
    state.level === 1
      ? `ATTENTION ${state.attention}/5`
      : state.level === 2
        ? `${stealth.hidden ? "HIDDEN " + Math.ceil(stealth.hidden) + "s" : "DETECTION " + Math.round(stealth.suspicion) + "%"}${stealth.release ? " · EXIT " + Math.ceil(stealth.release) + "s" : ""}`
        : `PURSUIT ${Math.round(chase.pressure)}% · ${Math.min(60, chase.wave + 1)}/60`;
  if (lastHud !== hud) {
    $("#danger").textContent = hud;
    lastHud = hud;
  }
  $("#act").textContent = `0${state.level} / ${names[state.level - 1]}`;
  const prompt =
    mode === "play" && !panel
      ? state.level === 3
        ? "← → lanes · ↑ / Space jump · ↓ slide · E switch"
        : near
          ? "E / " + near.name
          : state.level === 2
            ? "Stay out of striped sight areas · J journal"
            : "Explore · Gold marks = interact · J journal"
      : "";
  if ($("#prompt").textContent !== prompt) $("#prompt").textContent = prompt;
}
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0);
  last = now;
  if (!testing) tick(dt);
  else draw();
  requestAnimationFrame(frame);
}
// Read-only snapshots plus deterministic clock for browser tests. No progression mutation API.
if (testing)
  window.gameTest = {
    snapshot: () => structuredClone({ state, stealth, chase, mode, panel }),
    step: (seconds) => {
      for (let t = 0; t < seconds; t += 0.025)
        tick(Math.min(0.025, seconds - t));
    },
  };
applySettings();
title();
requestAnimationFrame(frame);
