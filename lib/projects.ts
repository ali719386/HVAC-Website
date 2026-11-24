import type { Project, ProjectCategory, ServiceType } from "@/lib/brand/schema";

/** Service type used to prefill the quote form and link the service page for a project category. */
export const categoryService: Record<ProjectCategory, ServiceType> = {
  "ac-installation": "ac-installation",
  heating: "heating",
  repair: "ac-repair",
  maintenance: "maintenance",
  commercial: "commercial",
};

export const cityLabel = (p: Pick<Project, "city" | "state">) => `${p.city}, ${p.state}`;

/** Replaces {count} in a copy template. */
export const withCount = (template: string, count: number) => template.replace("{count}", String(count));

/** Up to `limit` other projects: same category and city first, then same category, then same city. */
export function relatedProjects(all: Project[], p: Project, limit = 3): Project[] {
  const score = (o: Project) => (o.category === p.category ? 2 : 0) + (o.city === p.city && o.state === p.state ? 1 : 0);
  return all
    .filter((o) => o.slug !== p.slug && score(o) > 0)
    .sort((a, b) => score(b) - score(a) || b.completedYear - a.completedYear)
    .slice(0, limit);
}
