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
  const count = placeholders.length + todos.length + missing.length;
  total += count;

  console.log(`\n=== Brand: ${slug} ===`);
  console.log(`\nPlaceholder items (placeholder: true): ${placeholders.length}`);
  placeholders.forEach((p) => console.log(`  - ${p}`));
  console.log(`\nTODOs: ${todos.length}`);
  todos.forEach((t) => console.log(`  - ${t}`));
  console.log(`\nMissing images in public/brands/${slug}/images/: ${missing.length} of ${images.size}`);
  missing.sort().forEach((m) => console.log(`  - ${m}`));
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
