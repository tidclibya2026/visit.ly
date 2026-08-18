import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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

const siteOrigin = (process.env.PAGES_SITE_ORIGIN ?? "https://tidclibya2026.github.io/visit.ly").replace(/\/+$/, "");
const locales = ["ar", "en", "fr", "it", "de", "es", "zh"];
const routes = ["", "destinations", "experiences", "culture", "heritage", "services", "atlas", "events", "trip", ...["tripoli", "benghazi", "ghadames", "acacus", "leptis", "shahat", "sabratha", "tolmeitha", "qasr-libya", "awjila"].map((id) => `destinations/${id}`)];
const indexDocument = readFileSync(indexPath, "utf8");
const localeName = { ar: "العربية", en: "English", fr: "Français", it: "Italiano", de: "Deutsch", es: "Español", zh: "中文" };

function localizedDocument(locale, route) {
  const href = `${siteOrigin}/${locale}${route ? `/${route}` : ""}/`;
  const alternates = locales.map((item) => `<link rel="alternate" hreflang="${item}" href="${siteOrigin}/${item}${route ? `/${route}` : ""}/" />`).join("");
  const seo = `<link rel="canonical" href="${href}" />${alternates}<meta name="description" content="Visit Libya — ${localeName[locale]} tourism guide for destinations, culture, heritage and travel planning." />`;
  return indexDocument.replace("<html", `<html lang="${locale}"`).replace("</head>", `${seo}</head>`);
}

for (const locale of locales) {
  for (const route of routes) {
    const dir = resolve(outputDirectory, locale, route);
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, "index.html"), localizedDocument(locale, route), "utf8");
  }
}

const sitemapUrls = locales.flatMap((locale) => routes.map((route) => `${siteOrigin}/${locale}${route ? `/${route}` : ""}/`));
writeFileSync(resolve(outputDirectory, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");
