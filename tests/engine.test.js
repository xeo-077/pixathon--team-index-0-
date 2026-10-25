import test from "node:test";
import assert from "node:assert/strict";
import {
  fresh,
  move,
  blocked,
  nearby,
  clearLine,
  canExit,
  advance,
  retry,
  restart,
  newStealth,
  tickStealth,
  distract,
  hide,
  sees,
  pathTo,
  newChase,
  chaseAction,
  tickChase,
  wave,
  pressGate,
  hitObstacle,
} from "../dist/engine.js";
import { MAPS } from "../dist/world.js";
import { interact } from "../dist/story.js";
import { validate, readSave, writeSave } from "../dist/save.js";
function solveOffice() {
  const s = fresh();
  for (const [id, a] of [
    ["email"],
    ["board"],
    ["cabinet"],
    ["maya", "verify"],
    ["meeting", "2417"],
    ["supply"],
    ["printer", "TCS"],
    ["computer", "r6"],
    ["priya", "share"],
    ["dev", "written"],
  ])
    interact(s, id, a);
  return s;
}
test("movement is cardinal, bounded, rejects geometry and clamps long frames", () => {
  const p = { x: 1.25, y: 1.25 };
  assert.equal(move(MAPS[1], p, -1, 0, 0.05), false);
  assert.equal(move(MAPS[1], p, 1, 1, 0.05), false);
  assert.equal(move(MAPS[1], p, 1, 0, NaN), false);
  assert.equal(move(MAPS[1], p, 1, 0, 100), true);
  assert.ok(p.x < 1.44);
  assert.ok(blocked(MAPS[1], 5.5, 7.5));
});
test("interaction distance and wall occlusion", () => {
  const s = fresh();
  assert.equal(nearby(s), null);
  s.player = { x: 5.5, y: 8.5 };
  assert.equal(nearby(s).id, "computer");
  assert.equal(
    clearLine(MAPS[2], { x: 11.5, y: 5.5 }, { x: 13.5, y: 5.5 }),
    false,
  );
});
test("every object has a reachable interaction position", () => {
  for (const level of [1, 2])
    for (const o of MAPS[level].objects) {
      const ends = [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1],
      ].map(([dx, dy]) => ({ x: o.x + dx + 0.5, y: o.y + dy + 0.5 }));
      assert.ok(
        ends.some(
          (p) =>
            !blocked(MAPS[level], p.x, p.y) &&
            pathTo(MAPS[level], { x: 3.5, y: 24.5 }, p).length,
        ),
        o.id,
      );
    }
});
test("puzzle prerequisites prevent early submission or unlock", () => {
  const s = fresh();
  interact(s, "printer", "TCS");
  interact(s, "computer", "r6");
  interact(s, "meeting", "2417");
  assert.ok(!s.flags.report && !s.flags.printer && !s.flags.meeting);
  assert.ok(s.attention > 0);
  assert.equal(canExit(s), false);
  assert.equal(advance(s), false);
});
test("wrong answers preserve clues and allow recovery", () => {
  const s = fresh();
  interact(s, "email");
  interact(s, "board");
  interact(s, "meeting", "1724");
  assert.ok(!s.flags.meeting);
  interact(s, "meeting", "2417");
  assert.ok(s.flags.meeting);
  interact(s, "water");
  assert.equal(s.attention, 0);
});
test("dialogue alternatives trade attention for help", () => {
  const a = solveOffice(),
    b = solveOffice();
  delete b.flags.priya;
  delete b.flags.helpedPriya;
  interact(b, "priya", "tomorrow");
  assert.ok(b.flags.priya && !b.flags.helpedPriya);
  assert.ok(b.attention > a.attention);
  interact(a, "coffee");
  assert.ok(a.inventory.includes("Emergency coffee"));
  interact(b, "coffee");
  assert.ok(!b.inventory.includes("Emergency coffee"));
});
test("inventory rewards are idempotent and fuse is consumed", () => {
  const s = solveOffice();
  interact(s, "supply");
  interact(s, "maya", "verify");
  interact(s, "printer", "TCS");
  assert.equal(s.inventory.filter((i) => i === "Signed release").length, 1);
  assert.ok(!s.inventory.includes("Fuse"));
});
test("all levels unlock sequentially with actual requirements", () => {
  const s = solveOffice();
  assert.ok(canExit(s));
  delete s.flags.dev;
  assert.equal(advance(s), false);
  interact(s, "dev", "written");
  assert.ok(advance(s));
  assert.equal(s.level, 2);
  assert.equal(advance(s), false);
  const h = newStealth();
  distract(s, h, "noisePrinter");
  interact(s, "pass");
  interact(s, "locker");
  interact(s, "terminal", "B");
  distract(s, h, "phone");
  interact(s, "relay");
  assert.ok(advance(s));
  assert.equal(s.level, 3);
  assert.equal(s.unlocked, 3);
  assert.ok(!advance(s));
});
test("HR sight respects walls and facing", () => {
  assert.equal(
    sees(MAPS[2], { x: 11.5, y: 5.5, face: 0 }, { x: 13.5, y: 5.5 }),
    false,
  );
  assert.equal(
    sees(MAPS[2], { x: 3.5, y: 8.5, face: 0 }, { x: 5.5, y: 8.5 }),
    true,
  );
  assert.equal(
    sees(MAPS[2], { x: 3.5, y: 8.5, face: 0 }, { x: 2.5, y: 8.5 }),
    false,
  );
});
test("distraction investigation obeys cooldown and returns to patrol", () => {
  const s = fresh();
  s.level = 2;
  const h = newStealth();
  assert.ok(distract(s, h, "noisePrinter"));
  assert.equal(h.guards[0].state, "investigating");
  assert.ok(h.guards[0].path.length);
  assert.equal(distract(s, h, "noisePrinter"), false);
  for (let i = 0; i < 600; i++) tickStealth(s, h, 0.025);
  assert.notEqual(h.guards[0].state, "investigating");
});
test("suspicion builds and falls; sustained exposure catches", () => {
  const s = fresh();
  s.level = 2;
  s.player = { x: 5.5, y: 8.5 };
  const h = newStealth();
  for (let i = 0; i < 25; i++) tickStealth(s, h, 0.025);
  assert.ok(h.suspicion > 0 && h.suspicion < 100);
  s.player = { x: 3.5, y: 24.5 };
  for (let i = 0; i < 100; i++) tickStealth(s, h, 0.025);
  assert.equal(h.suspicion, 0);
  s.player = { x: 5.5, y: 8.5 };
  const j = newStealth();
  let result;
  for (let i = 0; i < 180; i++) {
    result = tickStealth(s, j, 0.025);
    if (result === "caught") break;
  }
  assert.equal(result, "caught");
  assert.equal(s.stats.detections, 1);
});
test("hiding expires and rejects known hiding locations", () => {
  const s = fresh(),
    h = newStealth();
  s.level = 2;
  h.suspicion = 60;
  hide(s, h);
  assert.equal(h.hidden, 0);
  h.suspicion = 0;
  hide(s, h);
  assert.equal(h.hidden, 5);
  for (let i = 0; i < 201; i++) tickStealth(s, h, 0.025);
  assert.equal(h.hidden, 0);
  assert.ok(h.hideCooldown > 0);
});
test("retry preserves significant discoveries, resets timed release", () => {
  const s = solveOffice();
  advance(s);
  s.flags.pass = true;
  s.flags.relay = true;
  retry(s);
  assert.equal(s.player.x, 17.5);
  assert.ok(s.flags.pass && s.flags.report);
  assert.equal(s.flags.relay, false);
  assert.equal(s.stats.retries, 1);
});
test("jump, slide, expiry, and cooldown rules", () => {
  assert.equal(hitObstacle("paper", "jump"), false);
  assert.equal(hitObstacle("bar", "slide"), false);
  assert.equal(hitObstacle("cabinet", "jump"), true);
  assert.equal(hitObstacle("paper", "slide"), true);
  const c = newChase(),
    s = fresh();
  assert.ok(chaseAction(c, "jump"));
  assert.equal(chaseAction(c, "slide"), false);
  tickChase(c, s, 0.7);
  assert.equal(c.action, "run");
  assert.equal(chaseAction(c, "slide"), false);
  tickChase(c, s, 0.21);
  assert.ok(chaseAction(c, "slide"));
});
test("all 60 waves are reachable with lane and action cooldowns", () => {
  const s = fresh();
  s.level = 3;
  const c = newChase();
  for (let i = 0; i < 60; i++) {
    const w = wave(i),
      lane = i === 56 ? 1 : w.finalTypes.findIndex((t) => t !== "cabinet"),
      action =
        w.finalTypes[lane] === "paper"
          ? "jump"
          : w.finalTypes[lane] === "bar"
            ? "slide"
            : null;
    while (c.lane !== lane) {
      assert.ok(chaseAction(c, c.lane < lane ? "right" : "left"));
      for (let j = 0; j < 7; j++) tickChase(c, s, 0.025);
    }
    while (c.time < w.duration - 0.35) tickChase(c, s, 0.025);
    if (action) assert.ok(chaseAction(c, action));
    if (i === 56) assert.ok(pressGate(c));
    while (c.wave === i && c.status === "playing") tickChase(c, s, 0.025);
    assert.notEqual(c.status, "lost");
  }
  assert.equal(c.status, "won");
  assert.equal(s.complete, true);
  assert.equal(s.stats.collisions, 0);
  assert.equal(tickChase(c, s, 1), null);
});
test("collisions cause pursuit failure; coffee rescues once", () => {
  const c = newChase(),
    s = fresh();
  s.inventory.push("Emergency coffee");
  for (let i = 0; i < 10 && c.status === "playing"; i++) {
    c.lane = wave(c.wave).finalTypes.findIndex((t) => t === "cabinet");
    if (c.lane < 0) c.lane = 0;
    tickChase(c, s, 3);
  }
  assert.equal(c.status, "lost");
  assert.ok(!s.inventory.includes("Emergency coffee"));
  assert.equal(newChase(40).wave, 40);
});
test("save validation rejects corruption and restores checkpoints", () => {
  assert.equal(validate(null), null);
  assert.equal(validate({ ...fresh(), level: 3, unlocked: 3 }), null);
  const s = solveOffice();
  advance(s);
  s.flags.pass = true;
  s.player = { x: 99, y: 99 };
  const restored = validate(s);
  assert.equal(restored.player.x, 17.5);
  assert.ok(restored.flags.report);
  assert.equal(readSave({ getItem: () => "{" }), null);
  assert.equal(
    writeSave(
      {
        setItem: () => {
          throw Error();
        },
      },
      s,
    ),
    false,
  );
});
test("restart and new game clear appropriate progression", () => {
  const s = solveOffice();
  advance(s);
  s.flags.pass = true;
  restart(s);
  assert.equal(s.flags.pass, undefined);
  assert.ok(s.flags.report);
  assert.equal(fresh().unlocked, 1);
  assert.deepEqual(fresh().inventory, []);
});
