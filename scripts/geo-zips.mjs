#!/usr/bin/env node
/**
 * Prints a `zips: [...]` array for one city from a LOCAL CSV you supply (nothing is downloaded).
 * Usage:  npm run geo:zips -- <file.csv> "<City name>" <STATE>
 * Example: npm run geo:zips -- data/zips.csv "St. Louis" MO
 *
 * The CSV needs a header row with a ZIP column (zip, zipcode, zip_code or postal_code), a city
 * column (city, primary_city or city_name) and a state column (state, state_id, state_abbr or st).
 * Paste the printed line into the city's entry in brands/<slug>/content/cities.ts.
 * Cross-platform: plain Node, no shell features.
 */
import { readFileSync } from "node:fs";

const [file, cityArg, stateArg] = process.argv.slice(2);
if (!file || !cityArg || !stateArg) {
  console.error('Usage: npm run geo:zips -- <file.csv> "<City name>" <STATE>');
  process.exit(1);
}

/** Minimal CSV line parser with quoted-field support. */
function parseLine(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((v) => v.trim());
}

let text;
try {
  text = readFileSync(file, "utf8");
} catch (err) {
  console.error(`Could not read ${file}: ${err.message}`);
  process.exit(1);
}

const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
const header = parseLine(lines[0] ?? "").map((h) => h.toLowerCase().replace(/^﻿/, ""));
const col = (names) => header.findIndex((h) => names.includes(h));
const zipCol = col(["zip", "zipcode", "zip_code", "postal_code", "postalcode"]);
const cityCol = col(["city", "primary_city", "city_name"]);
const stateCol = col(["state", "state_id", "state_abbr", "st"]);
if (zipCol < 0 || cityCol < 0 || stateCol < 0) {
  console.error(`Missing columns. Found: ${header.join(", ")}. Need a ZIP, a city and a state column.`);
  process.exit(1);
}

const wantCity = cityArg.trim().toLowerCase();
const wantState = stateArg.trim().toUpperCase();
const zips = new Set();
for (const line of lines.slice(1)) {
  const row = parseLine(line);
  const zip = (row[zipCol] ?? "").padStart(5, "0");
  if (!/^\d{5}$/.test(zip)) continue;
  if ((row[cityCol] ?? "").toLowerCase() === wantCity && (row[stateCol] ?? "").toUpperCase() === wantState) zips.add(zip);
}

if (zips.size === 0) {
  console.error(`No ZIP codes found for "${cityArg}, ${wantState}" in ${file}.`);
  process.exit(1);
}
const sorted = [...zips].sort();
console.log(`// ${sorted.length} ZIP codes for ${cityArg}, ${wantState} from ${file}`);
console.log(`zips: [${sorted.map((z) => `"${z}"`).join(", ")}],`);
