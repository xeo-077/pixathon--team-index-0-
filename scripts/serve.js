import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve(process.argv[2] || "dist"),
  port = Number(process.env.PORT || 8000);
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const file = resolve(
        root,
        "." + pathname + (pathname.endsWith("/") ? "index.html" : ""),
      );
      if (!file.startsWith(root + sep)) {
        res.writeHead(403);
        return res.end();
      }
      const body = await readFile(file);
      res.writeHead(200, {
        "Content-Type":
          {
            ".html": "text/html",
            ".js": "text/javascript",
            ".css": "text/css",
            ".png": "image/png",
          }[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Game: http://127.0.0.1:${port}`),
  );
