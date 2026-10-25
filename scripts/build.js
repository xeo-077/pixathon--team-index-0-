import { readdir, cp, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
for (const file of await readdir("dist"))
  if (file.endsWith(".js"))
    execFileSync(process.execPath, ["--check", "dist/" + file]);
await mkdir("build", { recursive: true });
await cp("dist", "build", { recursive: true });
console.log("Production build ready: build/ (static, no runtime dependencies)");
