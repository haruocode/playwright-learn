// app/ の中身をそのまま返すだけの静的サーバー。
// npm パッケージを増やさないために Node の標準機能だけで書いている。
// この章の学習対象ではないので、中身が分からなくても問題ない。
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = join(fileURLToPath(new URL(".", import.meta.url)), "app");
const port = 3000;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

const server = createServer(async (req, res) => {
  // "/" でアクセスされたら index.html を返す
  const path = req.url === "/" ? "/index.html" : req.url;

  try {
    const body = await readFile(join(appDir, path));
    res.writeHead(200, { "content-type": contentTypes[extname(path)] ?? "text/plain" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`http://localhost:${port} で起動しました`);
});
