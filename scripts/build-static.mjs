import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const target = process.argv[2];

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

const result = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: process.cwd(),
  env,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
