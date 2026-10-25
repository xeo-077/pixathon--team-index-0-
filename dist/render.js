import { MAPS, TILE, WIDTH, HEIGHT, cameras } from "./world.js";
import { clamp, blocked, wave } from "./engine.js";
export const palette = {
  navy: "#172b49",
  blue: "#365991",
  mint: "#a0d4c3",
  cream: "#fff1cb",
  gold: "#ffd16d",
  coral: "#ef826f",
  violet: "#8d80b8",
};
let c;
const rect = (x, y, w, h, color) => {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), w, h);
};
const text = (str, x, y, size = 8, color = palette.cream, align = "left") => {
  c.fillStyle = color;
  c.font = `bold ${size}px monospace`;
  c.textAlign = align;
  c.fillText(str, Math.round(x), Math.round(y));
};
export function person(
  ctx,
  x,
  y,
  color = "#65cbbc",
  time = 0,
  moving = false,
  face = 1.57,
  kind = "you",
  scale = 1,
) {
  c = ctx;
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(scale, scale);
  const step = moving ? Math.sin(time * 14) * 2 : 0,
    bob = moving ? Math.abs(step) * 0.5 : Math.sin(time * 2) * 0.35;
  rect(-6, 1, 13, 3, "#152e4d55");
  rect(-4, -4, 3, 6 + step, "#243956");
  rect(2, -4, 3, 6 - step, "#243956");
  rect(-5, 1 + step, 4, 2, "#172a44");
  rect(2, 1 - step, 4, 2, "#172a44");
  rect(-6, -13 + bob, 12, 11, palette.navy);
  rect(-5, -12 + bob, 10, 8, color);
  rect(-7, -10 + bob, 2, 7, "#d4a07e");
  rect(5, -10 + bob, 2, 7, "#d4a07e");
  rect(-1, -12 + bob, 2, 6, "#fff0cd");
  rect(1, -10 + bob, 2, 3, "#f0bd58");
  rect(-5, -21 + bob, 10, 10, palette.navy);
  rect(-4, -19 + bob, 8, 7, "#e8b88d");
  const hair =
    kind === "maya"
      ? "#554052"
      : kind === "priya"
        ? "#54384b"
        : kind === "hr"
          ? "#c7c6bc"
          : "#303a55";
  rect(-5, -22 + bob, 10, 5, hair);
  rect(-5, -18 + bob, 2, 5, hair);
  rect(3, -19 + bob, 2, 3, hair);
  if (Math.abs(face + 1.57) > 0.8) {
    const look = face === 0 ? 2 : face > 2 ? -2 : 0;
    rect(-2 + look, -16 + bob, 1, 2, palette.navy);
    rect(2 + look, -16 + bob, 1, 2, palette.navy);
    rect(0, -13 + bob, 2, 1, "#b8796a");
  }
  if (kind === "dev" || kind === "hr") {
    rect(-3, -17 + bob, 3, 3, palette.navy);
    rect(1, -17 + bob, 3, 3, palette.navy);
    rect(0, -16 + bob, 1, 1, palette.navy);
  }
  if (kind === "priya") {
    rect(-7, -19 + bob, 3, 9, hair);
    rect(5, -19 + bob, 3, 9, hair);
  }
  c.restore();
}
function plant(x, y) {
  rect(x + 3, y + 8, 10, 8, "#365580");
  rect(x + 4, y + 9, 8, 2, "#7399bc");
  rect(x + 6, y - 1, 4, 11, "#3b786d");
  rect(x, y + 1, 7, 5, "#68ac8e");
  rect(x + 8, y - 3, 7, 6, "#8ad0a1");
  rect(x + 3, y - 5, 7, 6, "#4d997e");
  rect(x + 3, y - 4, 3, 2, "#bbdf9c");
}
function object(o, time) {
  const x = o.x * TILE,
    y = o.y * TILE;
  if (o.type === "npc") {
    person(c, x + 8, y + 12, o.color, time, false, 1.57, o.id);
    return;
  }
  rect(x + 2, y + 11, 17, 7, "#172b4930");
  switch (o.type) {
    case "desk":
    case "table":
      rect(x - 1, y, 31, 16, palette.navy);
      rect(x, y, 29, 12, "#aa8e7c");
      rect(x + 1, y + 1, 27, 2, "#f0d5ac");
      rect(x + 2, y + 12, 3, 5, "#695971");
      rect(x + 24, y + 12, 3, 5, "#695971");
      if (o.type === "table") {
        rect(x + 7, y + 4, 10, 5, palette.cream);
        break;
      }
      rect(x + 7, y - 8, 15, 12, palette.navy);
      rect(x + 9, y - 6, 11, 7, "#4069a5");
      rect(x + 10, y - 5, 7, 1, "#8ed9cb");
      rect(x + 10, y - 2, (Math.floor(time * 2) % 3) + 4, 1, "#f5d475");
      rect(x + 13, y + 4, 4, 2, palette.navy);
      rect(x + 7, y + 7, 15, 3, "#d9ddd5");
      for (let i = 0; i < 6; i++) rect(x + 8 + i * 2, y + 8, 1, 1, "#729193");
      rect(x + 2, y + 4, 3, 5, palette.cream);
      rect(x + 11, y + 19, 10, 3, "#31456b");
      rect(x + 10, y + 16, 12, 5, "#7185b3");
      break;
    case "plant":
      plant(x, y);
      break;
    case "cabinet":
      rect(x, y - 9, 17, 25, palette.navy);
      rect(x + 1, y - 8, 15, 23, "#7796b4");
      for (let j = 0; j < 3; j++) {
        rect(x + 2, y - 7 + j * 7, 13, 6, "#a9bbc6");
        rect(x + 6, y - 5 + j * 7, 5, 2, "#3d5d80");
      }
      break;
    case "printer":
      rect(x, y - 5, 19, 21, palette.navy);
      rect(x + 1, y - 4, 17, 15, "#8aa4ad");
      rect(x + 3, y - 3, 13, 5, palette.navy);
      rect(x + 5, y - 7, 9, 7, palette.cream);
      rect(x + 3, y + 7, 12, 3, palette.navy);
      rect(x + 5, y + 9, 10, 5, "#e5e7d1");
      rect(
        x + 15,
        y + 3,
        2,
        2,
        Math.floor(time * 3) % 2 ? palette.gold : "#72d8b4",
      );
      break;
    case "board":
      rect(x - 9, y - 12, 34, 24, palette.navy);
      rect(x - 7, y - 10, 30, 20, "#ad897b");
      for (let j = 0; j < 4; j++) {
        rect(
          x - 5 + (j % 2) * 14,
          y - 8 + Math.floor(j / 2) * 9,
          11,
          7,
          j === 1 ? palette.gold : palette.cream,
        );
        rect(
          x - 3 + (j % 2) * 14,
          y - 6 + Math.floor(j / 2) * 9,
          6,
          1,
          "#7e7b83",
        );
      }
      break;
    case "door":
    case "elevator":
      rect(x - 3, y - 18, 24, 35, palette.navy);
      rect(x - 1, y - 16, 20, 31, "#7d96b8");
      rect(x, y - 15, 8, 28, "#a4bfd0");
      rect(x + 10, y - 15, 8, 28, "#8ca8c1");
      rect(x - 2, y - 20, 22, 4, "#71c9ac");
      rect(x + 22, y - 2, 3, 6, palette.gold);
      if (o.type === "door") rect(x + 12, y, 2, 2, palette.gold);
      break;
    case "water":
      rect(x + 3, y - 14, 10, 10, "#80b9d9");
      rect(x + 5, y - 13, 3, 7, "#c2eff0");
      rect(x + 1, y - 4, 14, 20, "#d7d9d1");
      rect(x + 3, y + 3, 10, 8, palette.navy);
      rect(x + 5, y + 4, 2, 2, palette.coral);
      break;
    case "coffee":
      rect(x, y, 20, 15, "#ae8d7a");
      rect(x + 3, y - 9, 12, 13, palette.navy);
      rect(x + 5, y - 7, 8, 6, "#747f93");
      rect(x + 7, y - 1, 5, 5, palette.cream);
      break;
    case "phone":
      rect(x, y + 2, 16, 12, "#8094ab");
      rect(x + 3, y, 12, 4, palette.navy);
      rect(x + 3, y, 3, 7, palette.navy);
      rect(x + 12, y, 3, 7, palette.navy);
      rect(x + 6, y + 6, 4, 4, palette.cream);
      break;
    case "switch":
      rect(x, y - 7, 16, 22, palette.navy);
      rect(x + 2, y - 5, 12, 18, "#9eafbf");
      rect(x + 5, y - 1, 6, 10, palette.gold);
      break;
    case "hide":
      rect(x - 2, y - 10, 21, 26, palette.navy);
      rect(x, y - 8, 17, 24, "#534d75");
      rect(x + 1, y - 7, 7, 22, "#81799f");
      rect(x + 10, y - 7, 6, 22, "#6d658d");
      rect(x + 9, y + 2, 1, 5, palette.gold);
      break;
  }
  if (o.id && o.type !== "npc") {
    rect(x + 6, y + 18, 5, 2, palette.gold);
  }
}
function cone(map, g, range, angle, color) {
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(g.x * 16, g.y * 16);
  for (let i = -12; i <= 12; i++) {
    const a = g.face + (i / 12) * angle;
    let d = 0;
    for (; d < range; d += 0.12)
      if (blocked(map, g.x + Math.cos(a) * d, g.y + Math.sin(a) * d)) break;
    c.lineTo((g.x + Math.cos(a) * d) * 16, (g.y + Math.sin(a) * d) * 16);
  }
  c.closePath();
  c.fill();
}
function world(s, v) {
  const map = MAPS[s.level] || MAPS[1],
    p = s.player;
  const camx = Math.round(clamp(p.x * 16 - 240, 0, WIDTH * 16 - 480)),
    camy = Math.round(clamp(p.y * 16 - 160, 0, HEIGHT * 16 - 320));
  c.save();
  c.translate(-camx, -camy);
  rect(0, 0, 640, 448, palette.navy);
  for (let y = 1; y < HEIGHT - 1; y++)
    for (let x = 1; x < WIDTH - 1; x++) {
      const cold = s.level === 2;
      rect(
        x * 16,
        y * 16,
        16,
        16,
        (x + y) % 2
          ? cold
            ? "#687f9b"
            : "#9cb7b4"
          : cold
            ? "#7086a0"
            : "#a8bfba",
      );
      rect(x * 16, y * 16 + 15, 16, 1, cold ? "#5e7491" : "#8ca9a7");
      if ((x * 7 + y * 11) % 17 === 0)
        rect(x * 16 + 4, y * 16 + 5, 2, 1, "#c3d3c533");
    }
  if (s.level === 1) {
    rect(32, 224, 160, 192, "#8b8eab");
    rect(416, 240, 192, 160, "#b3a695");
    rect(208, 32, 112, 32, "#78969c");
    text("OPERATIONS", 218, 52, 9);
    text("SUPPLY / MAYA", 37, 247, 8);
    text("MEETING 04", 435, 251, 8);
    text("17:01", 559, 42, 9, palette.navy);
  } else {
    text("ARRIVALS", 29, 397, 8);
    text("RECORDS", 242, 397, 8);
    text("PEOPLE & CULTURE", 438, 38, 9);
    for (const g of v.stealth.guards) cone(map, g, 6.2, 0.67, "#ffca6040");
    if (!v.stealth.disable)
      for (const cam of cameras)
        cone(
          map,
          { ...cam, face: cam.angle + Math.sin(v.stealth.time * 0.65) * 0.65 },
          7.5,
          0.48,
          "#f58c8645",
        );
  }
  const occupied = new Set(
    [...map.objects, ...map.decor].map((o) => `${o.x},${o.y}`),
  );
  for (const key of map.solid) {
    if (occupied.has(key)) continue;
    const [x, y] = key.split(",").map(Number);
    rect(x * 16, y * 16 - 9, 16, 24, "#37547b");
    rect(x * 16, y * 16 - 9, 16, 5, "#c4d5d3");
    rect(x * 16, y * 16 - 3, 16, 11, "#94b1bd");
    rect(x * 16, y * 16 + 8, 16, 3, "#5c7e9e");
  }
  for (let x = 3; x < 37; x += 9) {
    rect(x * 16, 7, 62, 13, "#29496f");
    rect(x * 16 + 2, 8, 58, 9, "#9fd2dd");
    rect(x * 16 + 29, 8, 2, 9, "#486e98");
  }
  const drawables = [...map.decor, ...map.objects].map((o) => ({
    y: o.y + 0.7,
    draw: () => object(o, v.time),
  }));
  drawables.push({
    y: p.y,
    draw: () => {
      if (!v.stealth?.hidden || s.level !== 2)
        person(c, p.x * 16, p.y * 16, "#61cbb7", v.time, v.walking, p.face);
    },
  });
  if (s.level === 2)
    for (const g of v.stealth.guards)
      drawables.push({
        y: g.y,
        draw: () => {
          person(
            c,
            g.x * 16,
            g.y * 16,
            "#c28b9f",
            v.time,
            !["waiting", "suspicious"].includes(g.state),
            g.face,
            "hr",
          );
          text(
            g.state === "suspicious"
              ? "!"
              : g.state === "investigating"
                ? "?"
                : "HR",
            g.x * 16,
            g.y * 16 - 27,
            8,
            palette.cream,
            "center",
          );
        },
      });
  drawables.sort((a, b) => a.y - b.y).forEach((o) => o.draw());
  if (s.level === 2)
    for (const cam of cameras) {
      rect(cam.x * 16 - 4, cam.y * 16 - 6, 12, 7, palette.navy);
      rect(cam.x * 16 - 2, cam.y * 16 - 5, 7, 4, "#c8d4d4");
      rect(
        cam.x * 16 - 4,
        cam.y * 16,
        2,
        2,
        v.stealth.disable ? "#79d3b0" : palette.coral,
      );
    }
  if (v.near) {
    const o = v.near;
    const y =
      o.y * 16 - 30 + (s.settings.reduced ? 0 : Math.sin(v.time * 4) * 2);
    rect(o.x * 16 + 3, y, 11, 11, palette.navy);
    text("E", o.x * 16 + 8, y + 9, 9, palette.gold, "center");
  }
  c.restore();
  // Tiny navigational map, with room landmarks, never enemy locations.
  rect(414, 31, 60, 44, "#172b49dd");
  for (const key of map.solid) {
    const [x, y] = key.split(",").map(Number);
    rect(416 + x * 1.4, 33 + y * 1.4, 1, 1, "#7185a0");
  }
  rect(416 + p.x * 1.4, 33 + p.y * 1.4, 2, 2, palette.gold);
}
function obstacle(type, x, y, scale, time) {
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(scale, scale);
  if (type === "cabinet") {
    rect(-13, -29, 26, 32, palette.navy);
    rect(-11, -27, 22, 28, "#889eb9");
    for (let i = 0; i < 3; i++) {
      rect(-9, -25 + i * 9, 18, 7, "#bdcad2");
      rect(-3, -23 + i * 9, 6, 2, palette.navy);
    }
    text("X", 0, -33, 9, palette.cream, "center");
  }
  if (type === "paper") {
    for (let i = 0; i < 4; i++) {
      rect(-14 + (i % 2), -i * 3, 28, 4, palette.navy);
      rect(-13 + (i % 2), -i * 3, 26, 2, palette.cream);
    }
    text("JUMP", 0, -17, 8, palette.gold, "center");
  }
  if (type === "bar") {
    rect(-18, -28, 4, 32, palette.navy);
    rect(14, -28, 4, 32, palette.navy);
    rect(-18, -27, 36, 7, "#db8774");
    for (let i = 0; i < 6; i++) rect(-17 + i * 6, -27, 3, 7, palette.cream);
    text("SLIDE", 0, -33, 8, palette.gold, "center");
  }
  if (type === "switch") {
    rect(-12, -26, 24, 30, palette.navy);
    rect(-9, -23, 18, 24, "#83c3a9");
    rect(-5, -19, 10, 12, palette.gold);
    text("E", 0, -9, 10, palette.navy, "center");
  }
  c.restore();
}
function runner(s, v) {
  const r = v.chase,
    w = wave(Math.min(59, r.wave)),
    progress = r.time / w.duration,
    phase = w.phase;
  rect(0, 0, 480, 320, ["#354b76", "#3b426a", "#365575"][phase]);
  rect(90, 28, 300, 292, ["#90aab2", "#8c91aa", "#a8bcb1"][phase]);
  for (let i = 0; i < 13; i++) {
    let y = (i * 26 + (s.settings.reduced ? 0 : v.time * 90)) % 330;
    rect(91, y, 298, 1, "#677f98");
  }
  rect(92, 28, 3, 292, "#c6d6d1");
  rect(385, 28, 3, 292, "#c6d6d1");
  for (const x of [190, 290])
    for (let i = 0; i < 9; i++)
      rect(
        x,
        36 + i * 36 + (s.settings.reduced ? 0 : (v.time * 70) % 36),
        2,
        16,
        "#d4dac5",
      );
  for (let i = 0; i < 4; i++) {
    const y = 55 + i * 76 + (s.settings.reduced ? 0 : (v.time * 50) % 76);
    rect(10, y, 61, 36, "#6d84a9");
    rect(15, y + 3, 51, 26, "#243e67");
    rect(18, y + 5, 20, 22, "#93b9cc");
    rect(400, y, 65, 36, "#6d84a9");
    rect(405, y + 3, 55, 25, "#263e67");
  }
  rect(190, 30, 100, 19, palette.navy);
  text(
    phase === 2 ? "FIRE EXIT" : "STAIRS  ↓",
    240,
    43,
    11,
    palette.mint,
    "center",
  );
  const types = progress > 0.45 ? w.finalTypes : w.types;
  for (let lane = 0; lane < 3; lane++) {
    const x = 140 + lane * 100;
    obstacle(types[lane], x, 62 + progress * 190, 1.25, v.time);
  }
  if (w.moving && progress < 0.5)
    text("CARTS SHIFT RIGHT  →", 240, 77, 9, palette.navy, "center");
  rect(95, 254, 291, 2, palette.gold);
  text("CONTACT", 86, 258, 7, palette.gold, "right");
  const py =
    252 -
    (r.action === "jump" ? Math.sin((r.actionLeft / 0.68) * Math.PI) * 26 : 0);
  if (r.action === "slide") {
    c.save();
    c.translate(140 + r.lane * 100, py);
    c.scale(1, 0.55);
    person(c, 0, 0, "#61cbb7", v.time, true, 1.57, "you", 1.7);
    c.restore();
  } else
    person(
      c,
      140 + r.lane * 100,
      py,
      "#61cbb7",
      v.time,
      true,
      1.57,
      "you",
      1.7,
    );
  person(
    c,
    240,
    321 - r.pressure * 0.28,
    "#b9778f",
    v.time,
    true,
    1.57,
    "boss",
    1.8,
  );
  if (r.flash && !s.settings.reduced) {
    rect(0, 0, 480, 3, palette.coral);
    rect(0, 317, 480, 3, palette.coral);
  }
  if (r.wave >= 54)
    text(
      r.wave === 56
        ? "CENTER LANE · PRESS E AT THE SWITCH"
        : r.wave === 59
          ? "JUMP THROUGH THE EXIT!"
          : "EXIT RELEASE AHEAD",
      240,
      95,
      10,
      palette.navy,
      "center",
    );
  const quote =
    r.pressure > 65
      ? "“JUST FIVE MORE MINUTES!”"
      : phase === 1
        ? "“WE NEED TO CIRCLE BACK!”"
        : "“THIS IS A QUICK MEETING!”";
  text(quote, 240, 307, 8, palette.cream, "center");
}
function skyline(time, ending = false) {
  rect(0, 0, 480, 320, ending ? "#9380ad" : "#243653");
  for (let i = 0; i < 7; i++)
    rect(
      0,
      i * 22,
      480,
      22,
      [
        "#243653",
        "#354867",
        "#4c6180",
        "#6c8297",
        "#95a9ad",
        "#bec4ad",
        "#dfceab",
      ][i],
    );
  rect(363, 28, 29, 29, "#ffe6a5");
  for (let i = 0; i < 12; i++) {
    const x = i * 43,
      h = 40 + ((i * 37) % 95);
    rect(x, 192 - h, 38, h, "#314566");
    for (let y = 198 - h; y < 185; y += 10)
      for (let a = 0; a < 3; a++)
        rect(x + 6 + a * 10, y, 4, 5, (i + y) % 3 ? "#7797ae" : "#e6cb8a");
  }
  rect(0, 195, 480, 125, "#465978");
  rect(0, 196, 480, 4, "#c8d4cd");
  for (let x = 0; x < 480; x += 24) rect(x, 278, 14, 3, "#b9bdaf");
  if (ending) {
    for (let i = 0; i < 4; i++)
      person(
        c,
        185 + i * 30,
        242,
        ["#61cbb7", "#cc789e", "#83a6db", "#d5a454"][i],
        time,
        true,
        0,
        ["you", "priya", "dev", "maya"][i],
        1.5,
      );
    text(
      "17:09  ·  THE EVENING IS YOURS",
      240,
      38,
      10,
      palette.cream,
      "center",
    );
  } else {
    rect(30, 170, 420, 100, palette.navy);
    rect(35, 174, 410, 91, "#8ea6b1");
    for (let i = 0; i < 9; i++) {
      rect(45 + i * 44, 183, 34, 44, "#33547c");
      rect(47 + i * 44, 185, 30, 37, "#8dc3cf");
      rect(61 + i * 44, 185, 2, 37, "#456b8c");
    }
    person(
      c,
      240 + Math.sin(time * 0.7) * 15,
      258,
      "#61cbb7",
      time,
      true,
      0,
      "you",
      2,
    );
  }
}
export function render(ctx, s, v) {
  c = ctx;
  c.imageSmoothingEnabled = false;
  c.clearRect(0, 0, 480, 320);
  if (v.mode === "title") {
    skyline(v.time);
    rect(32, 31, 416, 109, "#172b49ed");
    rect(36, 35, 408, 101, "#365991");
    text("A CORPORATE SAPPHIRE ADVENTURE", 240, 53, 8, palette.mint, "center");
    text("YOU’RE THE", 240, 81, 23, palette.cream, "center");
    text("DISTRACTION", 240, 112, 32, palette.gold, "center");
    text(
      "YOUR SHIFT IS OVER. YOUR OFFICE DISAGREES.",
      240,
      129,
      8,
      palette.cream,
      "center",
    );
    return;
  }
  if (s.complete || v.mode === "ending") {
    skyline(v.time, true);
    return;
  }
  if (s.level === 3) runner(s, v);
  else world(s, v);
}
