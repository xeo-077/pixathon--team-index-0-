import { test, expect } from "@playwright/test";
import { wave } from "../../dist/engine.js";
const snap = (page) => page.evaluate(() => window.gameTest.snapshot());
const step = (page, t) => page.evaluate((t) => window.gameTest.step(t), t);
test("HR detection explains the failure and retry restores a playable checkpoint", async ({
  page,
}, info) => {
  await page.goto("/?test=1&demo=1");
  await page
    .getByRole("button", { name: "Developer demo", exact: true })
    .click();
  await page.getByRole("button", { name: "Demo act 2", exact: true }).click();
  await page.evaluate(async () => {
    const { MAPS } = await import("/world.js"),
      { pathTo } = await import("/engine.js"),
      game = window.gameTest;
    const route = pathTo(MAPS[2], game.snapshot().state.player, {
      x: 10.5,
      y: 16.5,
    });
    for (const [x, y] of route)
      for (const axis of ["x", "y"]) {
        const target = (axis === "x" ? x : y) + 0.5;
        let count = 0;
        while (
          Math.abs(game.snapshot().state.player[axis] - target) > 0.015 &&
          count++ < 25 &&
          !game.snapshot().panel
        ) {
          const delta = target - game.snapshot().state.player[axis],
            key =
              axis === "x" ? (delta > 0 ? "d" : "a") : delta > 0 ? "s" : "w";
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key, bubbles: true }),
          );
          game.step(Math.min(0.025, Math.abs(delta) / 3.6));
          document.dispatchEvent(
            new KeyboardEvent("keyup", { key, bubbles: true }),
          );
        }
      }
    game.step(15);
  });
  await expect(
    page.getByRole("heading", { name: "HR WOULD LIKE A WORD", exact: true }),
  ).toBeVisible();
  expect((await snap(page)).state.stats.detections).toBe(1);
  await page.screenshot({ path: info.outputPath("09-hr-failure.png") });
  await page.getByRole("button", { name: "Adjust pacing" }).click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("button", { name: "Retry checkpoint" }).click();
  expect((await snap(page)).panel).toBe(null);
  expect((await snap(page)).stealth.suspicion).toBe(0);
  expect(
    await page.evaluate(() => localStorage.getItem("distraction.sapphire.v2")),
  ).toBe(null);
});
async function go(page, id, via = []) {
  const result = await page.evaluate(
    async ({ id, via }) => {
      const { MAPS } = await import("/world.js"),
        { pathTo, blocked } = await import("/engine.js");
      const game = window.gameTest,
        s = game.snapshot().state,
        map = MAPS[s.level],
        o = map.objects.find((o) => o.id === id);
      const ends = [
        [0, 1],
        [-1, 0],
        [1, 0],
        [0, -1],
      ]
        .map(([dx, dy]) => ({ x: o.x + dx + 0.5, y: o.y + dy + 0.5 }))
        .filter((p) => !blocked(map, p.x, p.y));
      const lead = [];
      let from = s.player;
      for (const p of via) {
        lead.push(...pathTo(map, from, p));
        from = p;
      }
      const paths = ends
        .map((p) => pathTo(map, from, p))
        .filter((p) => p.length)
        .sort((a, b) => a.length - b.length);
      if (!paths.length) throw Error("No path to " + id);
      for (const [x, y] of [...lead, ...paths[0]])
        for (const axis of ["x", "y"]) {
          const target = (axis === "x" ? x : y) + 0.5;
          let count = 0;
          while (
            Math.abs(game.snapshot().state.player[axis] - target) > 0.015 &&
            count++ < 25
          ) {
            const now = game.snapshot();
            if (now.panel)
              return { failed: true, id, panel: now.panel, state: now.state };
            const delta = target - now.state.player[axis],
              key =
                axis === "x" ? (delta > 0 ? "d" : "a") : delta > 0 ? "s" : "w";
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key, bubbles: true }),
            );
            game.step(Math.min(0.025, Math.abs(delta) / 3.6));
            document.dispatchEvent(
              new KeyboardEvent("keyup", { key, bubbles: true }),
            );
          }
        }
      return { failed: false, id, at: game.snapshot().state.player };
    },
    { id, via },
  );
  expect(result.failed, JSON.stringify(result)).toBe(false);
  await page.keyboard.press("e");
}
async function chat(page, id, answer) {
  await go(page, id);
  if (answer)
    await page.getByRole("button", { name: answer, exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
}
test("complete real-input playthrough, checkpoints, failure, retry and ending", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?test=1");
  await page.screenshot({ path: info.outputPath("01-title.png") });
  await page.getByRole("button", { name: "New Game", exact: true }).click();
  await page.getByRole("button", { name: "Clock out. Somehow." }).click();
  await page.screenshot({ path: info.outputPath("02-office.png") });
  await chat(page, "email");
  await chat(page, "board");
  await chat(page, "cabinet");
  await go(page, "maya");
  await page.screenshot({ path: info.outputPath("03-dialogue.png") });
  await page
    .getByRole("button", {
      name: "Verify the 184 total from the archive",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await chat(page, "meeting", "2417");
  await chat(page, "supply");
  await chat(page, "printer", "Triangle → Circle → Square");
  await chat(page, "computer", "Send revision 6 — total 184");
  await chat(page, "priya", "Share the submitted report with Dev");
  await chat(page, "dev", "Send the written summary and receipt");
  await chat(page, "coffee");
  await page.reload();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  expect((await snap(page)).state.flags.report).toBe(true);
  await go(page, "elevator");
  await page
    .getByRole("button", { name: "Scan the delivery receipt and signed total" })
    .click();
  await page
    .getByRole("button", { name: "HR would like a word.", exact: true })
    .click();
  expect((await snap(page)).state.level).toBe(2);
  await page.screenshot({ path: info.outputPath("04-stealth.png") });
  await go(page, "noisePrinter");
  await chat(page, "pass");
  await chat(page, "locker");
  await chat(page, "terminal", "Circuit B");
  await go(page, "phone", [
    { x: 38.5, y: 8.5 },
    { x: 38.5, y: 21.5 },
  ]);
  await chat(page, "relay");
  await go(page, "stairs", [
    { x: 38.5, y: 5.5 },
    { x: 38.5, y: 25.5 },
  ]);
  await page.getByRole("button", { name: "Take the stairs." }).click();
  await page.getByRole("button", { name: "Run! (Skip / continue)" }).click();
  await page.getByRole("button", { name: "I’m not available." }).click();
  await page.screenshot({ path: info.outputPath("05-chase.png") });
  // Deliberately fail with real time and no evasive input; coffee is consumed once.
  for (let i = 0; i < 80 && (await snap(page)).panel === null; i++)
    await step(page, 2.1);
  await expect(
    page.getByRole("button", { name: "Retry checkpoint" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Retry checkpoint" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Retry checkpoint" }).click();
  for (let n = 0; n < 70; n++) {
    const current = await snap(page);
    if (current.state.complete) break;
    const c = current.chase,
      w = wave(c.wave),
      lane = c.wave === 56 ? 1 : w.finalTypes.findIndex((t) => t !== "cabinet");
    while ((await snap(page)).chase.lane !== lane) {
      const at = (await snap(page)).chase.lane;
      await page.keyboard.press(at < lane ? "ArrowRight" : "ArrowLeft");
      await step(page, 0.175);
    }
    const t = (await snap(page)).chase.time;
    await step(page, Math.max(0, w.duration - 0.32 - t));
    if (w.finalTypes[lane] === "paper") await page.keyboard.press("Space");
    if (w.finalTypes[lane] === "bar") await page.keyboard.press("ArrowDown");
    if (c.wave === 56) await page.keyboard.press("e");
    await step(page, 0.34);
  }
  expect((await snap(page)).state.complete).toBe(true);
  await expect(
    page.getByRole("heading", { name: "YOU’RE THE DISTRACTION", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("06-victory.png") });
  expect(errors).toEqual([]);
  console.log(
    "Browser playthrough stats:",
    JSON.stringify((await snap(page)).state.stats),
  );
});
test("mobile layout, keyboard menus, touch, pause, settings and reset", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?test=1");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  const before = (await snap(page)).state.player;
  const b = page.getByRole("button", { name: "Move right", exact: true });
  await b.dispatchEvent("pointerdown", { pointerId: 1 });
  await step(page, 0.2);
  await b.dispatchEvent("pointerup", { pointerId: 1 });
  expect((await snap(page)).state.player.x).toBeGreaterThan(before.x);
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  const t = (await snap(page)).state.stats.seconds[0];
  await step(page, 5);
  expect((await snap(page)).state.stats.seconds[0]).toBe(t);
  await page.getByRole("button", { name: "Settings & controls" }).click();
  await page.getByLabel("Larger dialogue").check();
  await page.getByLabel("Assist pacing (slower hazards)").check();
  await page.screenshot({ path: info.outputPath("07-mobile-settings.png") });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.screenshot({ path: info.outputPath("08-mobile-office.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Settings & controls" }).click();
  await page.getByRole("button", { name: "Reset all progress" }).click();
  await page.getByRole("button", { name: "Reset permanently" }).click();
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toHaveCount(0);
});
