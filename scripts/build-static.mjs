import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { cpSync, mkdirSync, copyFileSync } from "node:fs";

const target = process.argv[2];
const extraArgs = process.argv.slice(3);
if (extraArgs.some(arg => arg !== "--webpack")) {
  throw new Error("Only --webpack is supported as an optional build flag");
}

if (target !== "staging" && target !== "production") {
  console.error("Usage: node scripts/build-static.mjs <staging|production>");
  process.exit(1);
}

const isProduction = target === "production";
const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const env = {
  ...process.env,
  NEXT_PUBLIC_ALLOW_INDEXING: isProduction ? "true" : "false",
  NEXT_PUBLIC_SITE_URL: isProduction ? "https://sc-bagration.ru" : "https://cp29116.tw1.ru",
};

console.log(`Building ${target}: ${env.NEXT_PUBLIC_SITE_URL}`);

const result = spawnSync(process.execPath, [nextBin, "build", ...extraArgs], {
  cwd: process.cwd(),
  env,
  stdio: "inherit",
});

if (result.status === 0) {
  cpSync("cms", "out/admin", { recursive: true });
  mkdirSync("out/preview", { recursive: true });
  copyFileSync("cms/preview.php", "out/preview/index.php");
  copyFileSync("cms/runtime.php", "out/preview/runtime.php");
  copyFileSync("cms/.htaccess", "out/preview/.htaccess");
}
process.exit(result.status ?? 1);
