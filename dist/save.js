import { fresh, defaults } from "./engine.js";
export const SAVE_KEY = "distraction.sapphire.v2";
const flagNames =
  "email board authorized meeting printer report priya dev receipt helpedPriya coffee hrTip fuse queue pass log terminal phone noisePrinter relay revision".split(
    " ",
  );
export function validate(raw) {
  if (
    !raw ||
    raw.version !== 2 ||
    ![1, 2, 3].includes(raw.level) ||
    !Number.isInteger(raw.unlocked) ||
    raw.unlocked < raw.level ||
    raw.unlocked > 3
  )
    return null;
  if (
    !raw.flags ||
    !Array.isArray(raw.inventory) ||
    !raw.stats ||
    !raw.settings
  )
    return null;
  const s = fresh();
  s.level = raw.level;
  s.unlocked = raw.unlocked;
  for (const k of flagNames)
    if (typeof raw.flags[k] === "boolean") s.flags[k] = raw.flags[k];
  if (
    s.level > 1 &&
    ![
      "email",
      "board",
      "authorized",
      "meeting",
      "printer",
      "report",
      "priya",
      "dev",
      "receipt",
    ].every((k) => s.flags[k])
  )
    return null;
  if (
    s.level === 3 &&
    !["pass", "log", "terminal", "phone", "noisePrinter"].every(
      (k) => s.flags[k],
    )
  )
    return null;
  const items = [
    "Signed release",
    "Corrected report",
    "Fuse",
    "Printed report",
    "Receipt",
    "Emergency coffee",
    "Patrol memo",
    "Visitor pass",
    "Circuit note",
  ];
  s.inventory = [...new Set(raw.inventory.filter((x) => items.includes(x)))];
  s.attention = Number.isFinite(raw.attention)
    ? Math.max(0, Math.min(5, raw.attention))
    : 0;
  s.complete = s.level === 3 && raw.complete === true;
  s.chaseCheckpoint = [0, 20, 40, 56].includes(raw.chaseCheckpoint)
    ? raw.chaseCheckpoint
    : 0;
  for (const k of [
    "retries",
    "detections",
    "collisions",
    "hints",
    "nearMisses",
  ])
    s.stats[k] = Number.isFinite(raw.stats[k])
      ? Math.max(0, Math.floor(raw.stats[k]))
      : 0;
  s.stats.seconds = Array.isArray(raw.stats.seconds)
    ? [0, 1, 2].map((i) =>
        Number.isFinite(raw.stats.seconds[i])
          ? Math.max(0, raw.stats.seconds[i])
          : 0,
      )
    : [0, 0, 0];
  s.settings = validateSettings(raw.settings);
  s.achievements = Array.isArray(raw.achievements)
    ? raw.achievements
        .filter((v) => typeof v === "string" && v.length < 60)
        .slice(0, 12)
    : [];
  s.player =
    s.level === 1
      ? { x: 5.5, y: 9.5, face: 1.57 }
      : s.flags.pass
        ? { x: 17.5, y: 24.5, face: -1.57 }
        : { x: 3.5, y: 24.5, face: -1.57 };
  s.flags.relay = false;
  return s;
}
export function validateSettings(raw = {}) {
  const d = defaults();
  for (const k of ["music", "sound"])
    if (Number.isFinite(raw[k])) d[k] = Math.max(0, Math.min(1, raw[k]));
  for (const k of ["mute", "reduced", "large"])
    if (typeof raw[k] === "boolean") d[k] = raw[k];
  d.pace = raw.pace === "assist" ? "assist" : "standard";
  return d;
}
export function readSave(storage) {
  try {
    return validate(JSON.parse(storage.getItem(SAVE_KEY)));
  } catch {
    return null;
  }
}
export function writeSave(storage, s) {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}
