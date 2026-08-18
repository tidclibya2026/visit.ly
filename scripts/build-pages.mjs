import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(import.meta.dirname, "..");
const outputDirectory = resolve(projectRoot, "dist/public");
const assetOrigin = (process.env.PAGES_ASSET_ORIGIN ?? "https://libyatour-c2jjh75a.manus.space").replace(/\/+$/, "");
const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const build = spawnSync(command, ["vite", "build"], {
  cwd: projectRoot,
  env: { ...process.env, VITE_BASE_PATH: "/visit.ly/" },
  stdio: "inherit",
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

function rewriteArchiveUrls(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      rewriteArchiveUrls(entryPath);
      continue;
    }
    if (!/\.(?:html|css|js)$/u.test(entry.name)) continue;

    const source = readFileSync(entryPath, "utf8");
    const output = source.replaceAll("/manus-storage/", `${assetOrigin}/manus-storage/`);
    if (output !== source) writeFileSync(entryPath, output, "utf8");
  }
}

const indexPath = resolve(outputDirectory, "index.html");
if (!existsSync(indexPath)) {
  throw new Error("Expected GitHub Pages entry file was not created at dist/public/index.html.");
}

rewriteArchiveUrls(outputDirectory);
cpSync(indexPath, resolve(outputDirectory, "404.html"));
