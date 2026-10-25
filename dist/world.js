export const TILE = 16,
  WIDTH = 40,
  HEIGHT = 28;
const obj = (id, name, x, y, type, extra = {}) => ({
  id,
  name,
  x,
  y,
  type,
  ...extra,
});
export const office = [
  obj("computer", "Your computer", 5, 7, "desk"),
  obj("email", "Email archive", 8, 7, "desk"),
  obj("priya", "Priya", 16, 8, "npc", { color: "#cc789e" }),
  obj("dev", "Dev", 29, 8, "npc", { color: "#83a6db" }),
  obj("maya", "Maya", 7, 20, "npc", { color: "#d5a454" }),
  obj("board", "Noticeboard", 16, 3, "board"),
  obj("cabinet", "Records cabinet", 34, 4, "cabinet"),
  obj("supply", "Supply cupboard", 4, 15, "cabinet"),
  obj("printer", "Printer routing panel", 19, 18, "printer"),
  obj("meeting", "Meeting-room keypad", 30, 16, "door"),
  obj("water", "Water cooler", 12, 22, "water"),
  obj("coffee", "Break-room coffee", 34, 23, "coffee"),
  obj("elevator", "Elevator", 37, 5, "elevator"),
];
export const surveillance = [
  obj("rules", "Surveillance notice", 4, 23, "board"),
  obj("noisePrinter", "Audit printer", 8, 9, "printer"),
  obj("pass", "Visitor credentials", 17, 5, "cabinet"),
  obj("locker", "Facilities log", 19, 22, "cabinet"),
  obj("terminal", "Security terminal", 29, 7, "desk"),
  obj("phone", "Reception phone", 30, 21, "phone"),
  obj("relay", "Stairwell release", 35, 4, "switch"),
  obj("stairs", "Fire stairs", 37, 24, "door"),
  obj("hideA", "Supply alcove", 5, 16, "hide"),
  obj("hideB", "Records alcove", 21, 15, "hide"),
  obj("hideC", "Coat closet", 34, 16, "hide"),
];
export function makeMap(level) {
  const solid = new Set(),
    put = (x, y) => solid.add(`${x},${y}`),
    decor = [];
  for (let x = 0; x < WIDTH; x++) {
    put(x, 0);
    put(x, HEIGHT - 1);
  }
  for (let y = 0; y < HEIGHT; y++) {
    put(0, y);
    put(WIDTH - 1, y);
  }
  if (level === 1) {
    for (const [x, y] of [
      [4, 5],
      [8, 5],
      [23, 5],
      [27, 5],
      [4, 11],
      [8, 11],
      [23, 11],
      [27, 11],
    ]) {
      decor.push(obj("", "", x, y, "desk"));
      put(x, y);
      put(x + 1, y);
    }
    for (let x = 2; x < 12; x++) if (x !== 6 && x !== 7) put(x, 13);
    for (const x of [4, 5, 8, 9, 23, 24, 27, 28]) put(x, 4);
    for (const [x, y] of [
      [3, 18],
      [4, 18],
      [10, 24],
      [35, 25],
    ])
      decor.push(obj("", "", x, y, "cabinet"));
    for (let x = 25; x < 37; x++) if (x !== 30 && x !== 31) put(x, 14);
    for (let y = 15; y < 23; y++) put(25, y);
    for (const [x, y] of [
      [2, 3],
      [13, 3],
      [22, 3],
      [37, 12],
      [14, 18],
      [26, 24],
      [2, 24],
    ])
      decor.push(obj("", "", x, y, "plant"));
    decor.push(obj("", "", 30, 19, "table"), obj("", "", 34, 19, "table"));
  } else {
    for (let y = 1; y < 27; y++) {
      if (![8, 9, 19, 20].includes(y)) put(12, y);
      if (![11, 12, 22, 23].includes(y)) put(25, y);
    }
    for (const [x, y] of [
      [4, 5],
      [7, 5],
      [4, 12],
      [7, 12],
      [16, 10],
      [19, 10],
      [16, 17],
      [19, 17],
      [29, 12],
      [32, 12],
      [29, 18],
    ]) {
      decor.push(obj("", "", x, y, "desk"));
      put(x, y);
      put(x + 1, y);
    }
  }
  const objects = level === 1 ? office : surveillance;
  for (const o of [...objects, ...decor])
    if (o.type !== "npc" && o.type !== "hide") {
      put(o.x, o.y);
      if (["desk", "table"].includes(o.type)) put(o.x + 1, o.y);
    }
  return { solid, objects, decor, level };
}
export const MAPS = { 1: makeMap(1), 2: makeMap(2) };
export const routes = [
  [
    [3, 8],
    [10, 8],
    [10, 19],
    [3, 19],
  ],
  [
    [15, 8],
    [23, 8],
    [23, 23],
    [15, 23],
  ],
  [
    [28, 10],
    [37, 10],
    [37, 22],
    [28, 22],
  ],
];
export const cameras = [
  { x: 23, y: 3, angle: Math.PI / 2 },
  { x: 37, y: 14, angle: Math.PI },
];
export const names = [
  "JUST ONE LAST THING",
  "EMPLOYEE UNDER OBSERVATION",
  "RUN. THE BOSS IS COMING.",
];
