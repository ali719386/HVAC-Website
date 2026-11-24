import type { ChatDoc, ChatEntry } from "./chatbot";

/** Entry weights: place names beat generic words, emergencies beat services, small talk loses to any real topic. */
const weightFor = (id: string) =>
  id.startsWith("city-") || id.startsWith("state-") ? 3 : id === "emergency" || id === "brands" || id === "brands-other" ? 2 : id.startsWith("talk-") ? 0.5 : id.startsWith("faq-") ? 1 : 1.5;

const normalize = (s: string) =>
  ` ${s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9/\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;

/** Best matching entry for a question, or undefined (the caller shows the "only about this website" fallback). */
export function matchQuestion(entries: ChatEntry[], question: string): ChatEntry | undefined {
  const q = normalize(question);
  if (q.trim().length === 0) return undefined;
  const tokens = new Set(q.trim().split(" ").flatMap((t) => [t, t.replace(/s$/, "")]));
  let best: { entry: ChatEntry; score: number } | undefined;
  for (const entry of entries) {
    let hits = 0;
    let score = 0;
    // Count a keyword and its singular/plural only once (e.g. "service" and "services").
    const seen = new Set<string>();
    for (const k of entry.keywords) {
      const stem = k.replace(/s$/, "");
      if (seen.has(stem)) continue;
      const multi = k.includes(" ");
      const found = multi ? q.includes(` ${k} `) : tokens.has(k) || tokens.has(stem);
      if (found) {
        seen.add(stem);
        hits += 1;
        score += multi ? k.split(" ").length * 2 : 1;
      }
    }
    if (hits < (entry.min ?? 1)) continue;
    score *= weightFor(entry.id);
    if (!best || score > best.score) best = { entry, score };
  }
  return best?.entry;
}

/* ------------------------------ Search fallback ------------------------------ */

const STOP = new Set(
  "a an the and or of to in on for with is are was were be been do does did can could should would will my your our you we i me it its this that these those what when where how why which who whom have has had get got there their them they am at by from as if any about need want please tell know some more much very just also than then so but not no yes into over out up down".split(" "),
);

/** Significant, lightly stemmed words. */
const terms = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map((w) => w.replace(/(ing|ed|es|s)$/, ""))
    .filter((w) => w.length > 2);

let indexCache: { docs: ChatDoc[]; sets: Set<string>[]; df: Map<string, number> } | undefined;

function index(docs: ChatDoc[]) {
  if (indexCache?.docs === docs) return indexCache;
  const sets = docs.map((d) => new Set(terms(`${d.title} ${d.text}`)));
  const df = new Map<string, number>();
  for (const s of sets) for (const t of s) df.set(t, (df.get(t) ?? 0) + 1);
  indexCache = { docs, sets, df };
  return indexCache;
}

/**
 * Best passage for a question by rarity-weighted word overlap (IDF). Needs at least two matching
 * words, so a single common word never produces an answer. Returns the passage unchanged.
 */
export function searchDocs(docs: ChatDoc[], question: string): ChatDoc | undefined {
  const q = [...new Set(terms(question))];
  if (q.length === 0 || docs.length === 0) return undefined;
  const { sets, df } = index(docs);
  const n = docs.length;
  let best: { i: number; score: number; hits: number } | undefined;
  sets.forEach((set, i) => {
    let score = 0;
    let hits = 0;
    for (const t of q) {
      if (!set.has(t)) continue;
      hits += 1;
      score += Math.log(1 + n / (df.get(t) ?? 1));
    }
    if (hits >= Math.min(2, q.length) && (q.length > 1 || hits === 1) && (!best || score > best.score)) best = { i, score, hits };
  });
  // A one-word question needs that word to be fairly specific (not on most pages).
  if (best && q.length === 1 && (df.get(q[0] ?? "") ?? 0) > n / 4) return undefined;
  return best ? docs[best.i] : undefined;
}