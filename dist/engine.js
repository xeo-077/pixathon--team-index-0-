import { MAPS, WIDTH, HEIGHT, routes, cameras } from "./world.js";
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const score = (s) =>
  Math.max(
    0,
    5000 -
      s.stats.retries * 100 -
      s.stats.detections * 100 -
      s.stats.collisions * 25 -
      s.stats.hints * 50 +
      s.stats.nearMisses * 10,
  );
export const blocked = (map, x, y) =>
  x < 1 ||
  y < 1 ||
  x >= WIDTH - 1 ||
  y >= HEIGHT - 1 ||
  map.solid.has(`${Math.floor(x)},${Math.floor(y)}`);
export function clearLine(map, a, b, skipEnd = false) {
  const n = Math.ceil(distance(a, b) * 10);
  for (let i = 1; i <= n; i++) {
    const t = i / n,
      x = a.x + (b.x - a.x) * t,
      y = a.y + (b.y - a.y) * t;
    if (
      skipEnd &&
      Math.floor(x) === Math.floor(b.x) &&
      Math.floor(y) === Math.floor(b.y)
    )
      continue;
    if (blocked(map, x, y)) return false;
  }
  return true;
}
export function move(map, p, dx, dy, dt) {
  if (!Number.isFinite(dt) || dt <= 0 || Math.abs(dx) + Math.abs(dy) !== 1)
    return false;
  const amount = Math.min(dt, 0.05) * 3.6,
    r = 0.23,
    x = p.x + dx * amount,
    y = p.y + dy * amount;
  if (
    [
      [x - r, y - r],
      [x + r, y - r],
      [x - r, y + r],
      [x + r, y + r],
    ].some(([a, b]) => blocked(map, a, b))
  )
    return false;
  p.x = x;
  p.y = y;
  p.face = Math.atan2(dy, dx);
  return true;
}
export function nearby(s) {
  const map = MAPS[s.level];
  if (!map) return null;
  return (
    map.objects
      .map((o) => ({
        ...o,
        d: distance(s.player, { x: o.x + 0.5, y: o.y + 0.5 }),
      }))
      .filter(
        (o) =>
          o.d < 1.65 &&
          clearLine(map, s.player, { x: o.x + 0.5, y: o.y + 0.5 }, true),
      )
      .sort((a, b) => a.d - b.d)[0] || null
  );
}
export const defaults = () => ({
  music: 0.25,
  sound: 0.5,
  mute: false,
  reduced: false,
  large: false,
  pace: "standard",
});
export function fresh(settings = defaults()) {
  return {
    version: 2,
    level: 1,
    unlocked: 1,
    complete: false,
    flags: {},
    inventory: [],
    attention: 0,
    player: { x: 5.5, y: 9.5, face: Math.PI / 2 },
    checkpoint: "office",
    chaseCheckpoint: 0,
    stats: {
      seconds: [0, 0, 0],
      retries: 0,
      detections: 0,
      collisions: 0,
      hints: 0,
      nearMisses: 0,
    },
    settings: { ...defaults(), ...settings },
    achievements: [],
  };
}
export function grant(s, item) {
  if (!s.inventory.includes(item)) s.inventory.push(item);
}
export function take(s, item) {
  s.inventory = s.inventory.filter((v) => v !== item);
}
export function objective(s) {
  const f = s.flags;
  if (s.complete) return "You made room for everyone to leave.";
  if (s.level === 1) {
    if (!f.email || !f.board)
      return "Read your email archive and the central noticeboard.";
    if (!f.authorized)
      return "Find Maya in the supply room. Request a signed release.";
    if (!f.meeting)
      return "Deduce the meeting-room code. Collect the corrected report.";
    if (!f.printer)
      return "Repair and route the printer. Supplies are in the west room.";
    if (!f.report) return "Submit the correct revision at your computer.";
    if (!f.priya || !f.dev) return "Settle Priya’s meeting and Dev’s handoff.";
    return "Reach the east elevator. Keep your release receipt ready.";
  }
  if (s.level === 2) {
    if (!f.pass)
      return "Distract west HR with the printer; retrieve a visitor pass in Records.";
    if (!f.log) return "Read the facilities log in south Records.";
    if (!f.terminal) return "Use the pass and circuit clue at east Security.";
    if (!f.phone)
      return "Call reception to draw east HR away from the release.";
    if (!f.relay)
      return "Activate the north stairwell release; then head south.";
    return "Reach the fire stairs before the release timer expires.";
  }
  return "Dodge cabinets. Jump paper. Slide bars. Watch the gate switch.";
}
export function canExit(s) {
  const f = s.flags;
  return s.level === 1
    ? !!(
        f.email &&
        f.board &&
        f.authorized &&
        f.meeting &&
        f.printer &&
        f.report &&
        f.priya &&
        f.dev &&
        f.receipt
      )
    : s.level === 2
      ? !!(
          f.pass &&
          f.log &&
          f.terminal &&
          f.phone &&
          f.noisePrinter &&
          f.relay
        )
      : false;
}
export function advance(s) {
  if (!canExit(s)) return false;
  s.achievements.push(s.level === 1 ? "CLOCK-OUT ROOKIE" : "HR SURVIVOR");
  s.level++;
  s.unlocked = Math.max(s.unlocked, s.level);
  s.player = { x: 3.5, y: 24.5, face: -Math.PI / 2 };
  s.checkpoint = s.level === 2 ? "lobby" : "chase";
  return true;
}
export function retry(s) {
  s.stats.retries++;
  s.player =
    s.level === 1
      ? { x: 5.5, y: 9.5, face: 1.57 }
      : s.flags.pass
        ? { x: 17.5, y: 24.5, face: -1.57 }
        : { x: 3.5, y: 24.5, face: -1.57 };
  if (s.level === 2) s.flags.relay = false;
}
export function restart(s) {
  const keep =
    s.level === 1
      ? []
      : [
          "email",
          "board",
          "authorized",
          "meeting",
          "printer",
          "report",
          "priya",
          "dev",
          "receipt",
          "helpedPriya",
          "coffee",
          "hrTip",
        ];
  if (s.level < 3)
    s.flags = Object.fromEntries(
      Object.entries(s.flags).filter(([k]) => keep.includes(k)),
    );
  if (s.level === 1) {
    s.inventory = [];
    s.attention = 0;
  } else if (s.level === 2)
    s.inventory = s.inventory.filter(
      (i) => !["Visitor pass", "Circuit note"].includes(i),
    );
  s.chaseCheckpoint = 0;
  s.complete = false;
  retry(s);
}
const patterns = [
  ["paper", "cabinet", "none"],
  ["bar", "paper", "cabinet"],
  ["cabinet", "bar", "paper"],
  ["paper", "paper", "paper"],
  ["bar", "bar", "bar"],
  ["none", "cabinet", "bar"],
  ["cabinet", "paper", "bar"],
  ["bar", "cabinet", "paper"],
];
export function wave(i) {
  const phase = Math.floor(i / 20),
    base = patterns[(i * 5 + phase * 3) % patterns.length];
  let types = base.map((_, n) => base[(n + Math.floor(i / 8)) % 3]);
  if (i === 56) types = ["cabinet", "switch", "cabinet"];
  if (i === 59) types = ["paper", "paper", "paper"];
  const moving = phase > 0 && i % 5 === 2;
  return {
    types,
    moving,
    finalTypes: moving ? [types[2], types[0], types[1]] : types,
    duration: [2.05, 1.8, 1.55][Math.min(2, phase)],
    phase,
  };
}
export const newChase = (checkpoint = 0) => ({
  wave: checkpoint,
  lane: 1,
  time: 0,
  action: "run",
  actionLeft: 0,
  cooldown: 0,
  laneCooldown: 0,
  pressure: 26,
  hit: false,
  status: "playing",
  gate: false,
  flash: 0,
});
export function chaseAction(c, action) {
  if (c.status !== "playing") return false;
  if (action === "left" || action === "right") {
    if (c.laneCooldown > 0) return false;
    c.lane = clamp(c.lane + (action === "left" ? -1 : 1), 0, 2);
    c.laneCooldown = 0.15;
    return true;
  }
  if (!["jump", "slide"].includes(action) || c.cooldown > 0) return false;
  c.action = action;
  c.actionLeft = 0.68;
  c.cooldown = 0.9;
  return true;
}
export function hitObstacle(type, action) {
  return (
    type === "cabinet" ||
    (type === "paper" && action !== "jump") ||
    (type === "bar" && action !== "slide")
  );
}
export function tickChase(c, s, dt) {
  if (c.status !== "playing") return null;
  dt *= s.settings.pace === "assist" ? 0.72 : 1;
  c.actionLeft = Math.max(0, c.actionLeft - dt);
  c.cooldown = Math.max(0, c.cooldown - dt);
  c.laneCooldown = Math.max(0, c.laneCooldown - dt);
  if (c.actionLeft === 0) c.action = "run";
  c.time += dt;
  c.flash = Math.max(0, c.flash - dt);
  const w = wave(c.wave);
  if (c.time < w.duration) return null;
  const type = w.finalTypes[c.lane];
  c.hit = hitObstacle(type, c.action) || (c.wave === 56 && !c.gate);
  if (c.hit) {
    s.stats.collisions++;
    c.pressure += 24;
    c.flash = 0.4;
  } else {
    c.pressure = Math.max(12, c.pressure - 3);
    if (type !== "none") s.stats.nearMisses++;
  }
  if (c.pressure >= 100 && s.inventory.includes("Emergency coffee")) {
    take(s, "Emergency coffee");
    c.pressure = 60;
  }
  if (c.pressure >= 100) {
    c.status = "lost";
    return "lost";
  }
  c.wave++;
  c.time = 0;
  if (c.wave === 60) {
    if (!c.gate) {
      c.status = "lost";
      return "lost";
    }
    c.status = "won";
    s.complete = true;
    s.achievements.push("PROFESSIONAL ESCAPE ARTIST");
    if (s.stats.detections === 0) s.achievements.push("HR'S NIGHTMARE");
    if (s.stats.collisions === 0) s.achievements.push("NOT TODAY, BOSS");
    if (s.stats.hints === 0 && s.settings.pace === "standard")
      s.achievements.push("OFFICE LEGEND");
    return "won";
  }
  if ([20, 40, 56].includes(c.wave)) {
    s.chaseCheckpoint = c.wave;
    return "checkpoint";
  }
  return c.hit ? "hit" : "clean";
}
export function pressGate(c) {
  if (c.wave === 56 && c.lane === 1 && c.time > wave(56).duration * 0.45) {
    c.gate = true;
    return true;
  }
  return false;
}
export function pathTo(map, a, b) {
  const start = [Math.floor(a.x), Math.floor(a.y)],
    end = [Math.floor(b.x), Math.floor(b.y)],
    q = [start],
    parents = new Map([[start.join(","), null]]);
  for (let i = 0; i < q.length; i++) {
    const p = q[i];
    if (p[0] === end[0] && p[1] === end[1]) {
      const out = [];
      let k = p.join(",");
      while (parents.get(k) !== null) {
        out.unshift(k.split(",").map(Number));
        k = parents.get(k);
      }
      return out;
    }
    for (const [dx, dy] of [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ]) {
      const x = p[0] + dx,
        y = p[1] + dy,
        k = `${x},${y}`;
      if (!parents.has(k) && !blocked(map, x + 0.5, y + 0.5)) {
        parents.set(k, p.join(","));
        q.push([x, y]);
      }
    }
  }
  return [];
}
export function newStealth() {
  return {
    time: 0,
    suspicion: 0,
    hidden: 0,
    hideCooldown: 0,
    disable: 0,
    release: 0,
    noiseCooldown: {},
    source: "HR",
    guards: routes.map((r, i) => ({
      x: r[0][0] + 0.5,
      y: r[0][1] + 0.5,
      face: 0,
      index: 1,
      route: i,
      state: "patrolling",
      timer: 0,
      path: [],
      target: null,
    })),
  };
}
export function sees(map, g, p, range = 6, cone = 0.64) {
  if (distance(g, p) > range) return false;
  const angle = Math.atan2(p.y - g.y, p.x - g.x),
    delta = Math.atan2(Math.sin(angle - g.face), Math.cos(angle - g.face));
  return Math.abs(delta) < cone && clearLine(map, g, p);
}
export function distract(s, h, id) {
  if ((h.noiseCooldown[id] || 0) > 0) return false;
  const o = MAPS[2].objects.find((o) => o.id === id);
  if (!o || !["phone", "noisePrinter"].includes(id)) return false;
  const g = h.guards[id === "phone" ? 2 : 0];
  g.state = "investigating";
  g.timer = 13;
  g.target = { x: o.x + 0.5, y: o.y + 1.5 };
  g.path = pathTo(MAPS[2], g, g.target);
  h.noiseCooldown[id] = 22;
  s.flags[id] = true;
  return true;
}
export function hide(s, h) {
  if (h.hidden) {
    h.hidden = 0;
    return "You leave cover.";
  }
  if (h.hideCooldown > 0) return "Wait for the closet door to settle.";
  if (h.suspicion > 50) return "They saw you enter. Break line of sight first.";
  h.hidden = 5;
  h.hideCooldown = 9;
  return "Hidden for five seconds. The door will spring open.";
}
export function tickStealth(s, h, dt) {
  dt *= s.settings.pace === "assist" ? 0.72 : 1;
  h.time += dt;
  for (const key of ["hidden", "hideCooldown", "disable", "release"])
    h[key] = Math.max(0, h[key] - dt);
  for (const key in h.noiseCooldown)
    h.noiseCooldown[key] = Math.max(0, h.noiseCooldown[key] - dt);
  if (h.release === 0) s.flags.relay = false;
  const map = MAPS[2];
  let observed = false;
  for (const g of h.guards) {
    const visible = !h.hidden && sees(map, g, s.player, 7, 0.75);
    if (visible) {
      observed = true;
      h.source = "HR";
      if (g.state !== "investigating") {
        g.state = "suspicious";
        g.timer = 1.4;
        g.target = { ...s.player };
      }
    }
    if (g.state === "suspicious") {
      g.face = Math.atan2(s.player.y - g.y, s.player.x - g.x);
      g.timer -= dt;
      if (!visible && g.timer <= 0) {
        g.state = "investigating";
        g.timer = 4;
        g.path = pathTo(map, g, g.target);
      }
      continue;
    }
    if (g.state === "waiting") {
      g.timer -= dt;
      if (g.timer <= 0) g.state = "patrolling";
      continue;
    }
    if (g.state === "investigating") {
      g.timer -= dt;
      if (g.timer <= 0) {
        g.state = "returning";
        g.path = [];
      }
    }
    if (!g.path.length) {
      if (g.state === "investigating") continue;
      const r = routes[g.route][g.index];
      g.path = pathTo(map, g, { x: r[0] + 0.5, y: r[1] + 0.5 });
      if (!g.path.length) {
        g.index = (g.index + 1) % routes[g.route].length;
        g.state = "waiting";
        g.timer = 1.1;
        continue;
      }
    }
    const p = g.path[0],
      tx = p[0] + 0.5,
      ty = p[1] + 0.5,
      d = Math.hypot(tx - g.x, ty - g.y),
      speed = g.state === "investigating" ? 2.4 : 1.65;
    g.face = Math.atan2(ty - g.y, tx - g.x);
    if (d < speed * dt) {
      g.x = tx;
      g.y = ty;
      g.path.shift();
    } else {
      g.x += ((tx - g.x) / d) * speed * dt;
      g.y += ((ty - g.y) / d) * speed * dt;
    }
  }
  if (h.disable === 0 && !h.hidden)
    for (const cam of cameras) {
      const g = { ...cam, face: cam.angle + Math.sin(h.time * 0.65) * 0.65 };
      if (sees(map, g, s.player, 7.5, 0.48)) {
        observed = true;
        h.source = "CAMERA";
      }
    }
  h.suspicion = clamp(
    h.suspicion + (observed ? 58 + s.attention * 3 : -25) * dt,
    0,
    100,
  );
  if (h.suspicion >= 100) {
    s.stats.detections++;
    h.guards.forEach((g) => (g.state = "alerted"));
    return "caught";
  }
  return observed ? "observed" : "clear";
}
