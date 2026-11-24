import type { ChatEntry } from "./chatbot";

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
