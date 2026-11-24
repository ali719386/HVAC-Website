/** WAI-ARIA tabs keyboard model: arrows wrap, Home/End jump to the ends. Returns -1 for other keys. */
export function tabKeyTarget(key: string, index: number, count: number): number {
  if (key === "ArrowRight") return (index + 1) % count;
  if (key === "ArrowLeft") return (index - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return -1;
}
