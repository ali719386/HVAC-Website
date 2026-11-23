import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MapPin, Wrench } from "lucide-react";
import { getBrand, getProject } from "@/lib/brand";
import { serviceTypeLabels } from "@/lib/lead/constants";
import { pageMetadata } from "@/lib/seo/meta";
import { BrandImage } from "@/components/ui/brand-image";
import { CallButton, LinkButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CtaBand } from "@/components/home/sections";
import { Reveal, RevealGroup } from "@/components/motion/reveal";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getBrand().content.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.title} in ${project.location}`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.image.src,
  });
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const { config, content } = getBrand();
  const service = content.services.find((s) => s.slug === project.service);
  const others = content.projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={serviceTypeLabels[project.service]}
        title={project.title}
        intro={project.summary}
        crumbs={[
          { name: "Projects", href: "/projects" },
          { name: project.title, href: `/projects/${project.slug}` },
        ]}
      >
        <p className="inline-flex items-center gap-2 text-on-primary/85">
          <MapPin className="size-4" aria-hidden="true" />
          {project.location}
        </p>
      </PageHeader>

      <div className="container-site section-y grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <article>
          <BrandImage image={project.image} sizes="(min-width: 1024px) 760px, 100vw" aspect="aspect-[16/9]" />

          {project.challenge ? (
            <Reveal variant="fade-up" className="mt-10 rounded-brand border-l-4 border-accent bg-surface-alt p-6">
              <h2 className="text-sm font-bold tracking-[0.12em] text-accent-dark uppercase">The challenge</h2>
              <p className="mt-2 text-lg leading-relaxed">{project.challenge}</p>
            </Reveal>
          ) : null}

          {project.body.length > 0 ? (
            <Reveal variant="fade-up" className="mt-10">
              <h2 className="text-2xl font-extrabold sm:text-3xl">What we did</h2>
              <div className="mt-5 grid gap-4 text-lg leading-relaxed text-muted">
                {project.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Link href="/projects" className="mt-10 inline-flex items-center gap-2 font-bold text-primary hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            All projects
          </Link>
        </article>

        <aside className="grid content-start gap-6 lg:sticky lg:top-28">
          <div className="rounded-brand border border-line p-6">
            <h2 className="font-heading text-lg font-bold">Project details</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-muted">Location</dt>
                  <dd className="font-semibold">{project.location}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wrench className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-muted">Service</dt>
                  <dd className="font-semibold">
                    {service ? (
                      <Link href={`/services/${service.slug}`} className="text-primary hover:underline">
                        {service.title}
                      </Link>
                    ) : (
                      serviceTypeLabels[project.service]
                    )}
                  </dd>
                </div>
              </div>
            </dl>
            {project.scope.length > 0 ? (
              <>
                <h3 className="mt-6 font-heading font-bold">Scope of work</h3>
                <ul className="mt-3 grid gap-2 text-sm">
                  {project.scope.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <div className="rounded-brand bg-primary p-6 text-on-primary">
            <p className="font-heading text-lg font-bold">{content.copy.expert.title}</p>
            <p className="mt-2 text-on-primary/85">{content.copy.expert.intro}</p>
            <LinkButton href={`/book?service=${project.service}`} variant="accent" className="mt-5 w-full">
              {content.copy.hero.primaryCta}
            </LinkButton>
            <CallButton phone={config.company.phone} variant="ghost" className="mt-3 w-full" />
          </div>
        </aside>
      </div>

      {others.length > 0 ? (
        <Section tone="alt" labelledBy="more-projects">
          <h2 id="more-projects" className="text-3xl font-extrabold">
            More projects
          </h2>
          <RevealGroup as="ul" className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.slug} className="group relative overflow-hidden rounded-brand border border-line bg-surface shadow-brand-sm hover:shadow-brand-md">
                <BrandImage image={p.image} rounded={false} aspect="aspect-[16/10]" sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" />
                <div className="p-6">
                  <p className="text-sm text-muted">{p.location}</p>
                  <h3 className="mt-1 text-lg font-bold">
                    <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-primary">
                      {p.title}
                    </Link>
                  </h3>
                  <span aria-hidden="true" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    View project <ArrowRight className="size-4" />
                  </span>
                </div>
              </li>
            ))}
          </RevealGroup>
        </Section>
      ) : null}
      <div className="pt-[var(--brand-section-y)]">
        <CtaBand config={config} copy={content.copy.ctaBand} />
      </div>
    </>
  );
}
