#!/usr/bin/env node
/**
 * Lists remaining placeholder content, TODOs and missing images per brand.
 * Usage:  npm run check:placeholders            (all brands)
 *         npm run check:placeholders -- default (one brand)
 *         npm run check:placeholders -- --strict (exit 1 if anything remains)
 * Cross-platform: plain Node, no shell features.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const only = args.find((a) => !a.startsWith("--"));
const brandsDir = path.join(root, "brands");

const IMG = /["']([a-z0-9][a-z0-9/_.-]*\.(?:jpg|jpeg|png|webp|avif|svg))["']/g;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

const rel = (p) => path.relative(root, p).split(path.sep).join("/");
let total = 0;

const slugs = readdirSync(brandsDir).filter((d) => statSync(path.join(brandsDir, d)).isDirectory());
for (const slug of slugs) {
  if (only && only !== slug) continue;
  const files = walk(path.join(brandsDir, slug));
  const placeholders = [];
  const todos = [];
  const images = new Set();

  for (const file of files) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      const loc = `${rel(file)}:${i + 1}`;
      if (/placeholder:\s*true/.test(line)) placeholders.push(loc);
      const todo = line.match(/TODO:?\s*(.*)$/);
      if (todo) todos.push(`${loc}  ${todo[1].replace(/["`,]+$/, "").trim() || "(see line)"}`);
      for (const m of line.matchAll(IMG)) images.add(m[1]);
    });
  }

  const missing = [...images].filter((img) => !existsSync(path.join(root, "public", "brands", slug, "images", ...img.split("/"))));

  // Coverage (content/cities.ts, one entry per line) and per-state licenses (config.ts).
  const coverageFile = path.join(brandsDir, slug, "content", "cities.ts");
  const coverageText = existsSync(coverageFile) ? readFileSync(coverageFile, "utf8") : "";
  const coverageLines = coverageText.split(/\r?\n/);
  const states = coverageLines.flatMap((l) => {
    const m = l.match(/\{\s*abbr:\s*"([A-Z]{2})"/);
    return m ? [{ abbr: m[1], placeholder: /placeholder:\s*true/.test(l) }] : [];
  });
  const cities = coverageLines.flatMap((l) => {
    const m = l.match(/\{\s*name:\s*"([^"]+)",\s*stateAbbr:\s*"([A-Z]{2})"/);
    return m ? [{ label: `${m[1]}, ${m[2]}`, placeholder: /placeholder:\s*true/.test(l), noZips: /zips:\s*\[\s*\]/.test(l) || !/zips:/.test(l) }] : [];
  });
  const configText = readFileSync(path.join(brandsDir, slug, "config.ts"), "utf8");
  const licensed = new Set([...configText.matchAll(/stateAbbr:\s*"([A-Z]{2})",\s*number:/g)].map((m) => m[1]));
  const placeholderStates = states.filter((s) => s.placeholder).map((s) => s.abbr);
  const placeholderCities = cities.filter((c) => c.placeholder).map((c) => c.label);
  const unlicensed = states.filter((s) => !licensed.has(s.abbr)).map((s) => s.abbr);
  const zipless = cities.filter((c) => c.noZips).map((c) => c.label);

  const count = placeholders.length + todos.length + missing.length;
  total += count;

  console.log(`\n=== Brand: ${slug} ===`);
  console.log(`\nPlaceholder items (placeholder: true): ${placeholders.length}`);
  placeholders.forEach((p) => console.log(`  - ${p}`));
  console.log(`\nTODOs: ${todos.length}`);
  todos.forEach((t) => console.log(`  - ${t}`));
  console.log(`\nMissing images in public/brands/${slug}/images/: ${missing.length} of ${images.size}`);
  missing.sort().forEach((m) => console.log(`  - ${m}`));

  console.log(`\nCoverage: ${states.length} states, ${cities.length} cities`);
  console.log(`  Placeholder states (noindex, not in sitemap): ${placeholderStates.length}${placeholderStates.length ? ` - ${placeholderStates.join(", ")}` : ""}`);
  console.log(`  Placeholder cities (noindex, not in sitemap): ${placeholderCities.length}`);
  placeholderCities.forEach((c) => console.log(`    - ${c}`));
  console.log(`  States without a configured license (company.licenses): ${unlicensed.length}${unlicensed.length ? ` - ${unlicensed.join(", ")}` : ""}`);
  console.log(`  Cities without ZIP data (checker uses the city picker): ${zipless.length}`);
}

// Shared fallback content can also carry placeholders.
const sharedTodos = walk(path.join(root, "content")).flatMap((file) =>
  readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((l, i) => (/placeholder:\s*true/.test(l) ? `${rel(file)}:${i + 1}` : null))
    .filter(Boolean),
);
if (!only) {
  console.log(`\n=== Shared fallback defaults (used only when a brand omits that content) ===`);
  console.log(`Placeholder items: ${sharedTodos.length}`);
}

console.log(`\nTotal brand items to resolve: ${total}`);
if (strict && total > 0) process.exit(1);
