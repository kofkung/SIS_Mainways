import { readFile, rm, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";

function parseEnv(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );
}

const modeArg = process.argv.find((arg) => arg.startsWith("--mode="));
const mode = modeArg?.split("=")[1];
let modeEnv = {};
const effectiveMode = mode || "production";
if (existsSync(`.env.${effectiveMode}`)) {
  modeEnv = parseEnv(await readFile(`.env.${effectiveMode}`, "utf8"));
}

const configuredUrl = (process.env.VITE_SITE_URL || modeEnv.VITE_SITE_URL || "").replace(/\/$/, "");
const routes = [
  "",
  "about",
  "services",
  "projects",
  "products",
  "products/category/embedded",
  "products/category/ai",
  "products/category/panel",
  "products/category/signage",
  "products/category/transport",
  "products/category/risc",
  "products/category/bna",
  "contact",
];

let robots = "User-agent: *\nAllow: /\n";
if (configuredUrl) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((route) => `  <url><loc>${configuredUrl}/${route}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
  await writeFile("dist/sitemap.xml", sitemap, "utf8");
  robots += `Sitemap: ${configuredUrl}/sitemap.xml\n`;
} else if (existsSync("dist/sitemap.xml")) {
  await unlink("dist/sitemap.xml");
}

await writeFile("dist/robots.txt", robots, "utf8");

// Render is a static host and cannot execute PHP. Do not publish backend source
// or vendored mailer files there; the API is included only in the cPanel build.
if (mode !== "cpanel" && existsSync("dist/api")) {
  await rm("dist/api", { recursive: true, force: true });
}
