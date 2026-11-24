import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { absoluteUrl, getBrand, getProject, getServiceZips } from "@/lib/brand";
import type { ProjectImage } from "@/lib/brand/schema";
import { serviceTypeLabels } from "@/lib/lead/constants";
import { categoryService, cityLabel, relatedProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo/meta";
import { ServiceAreaChecker } from "@/components/forms/area-checker";
import { LeadForm } from "@/components/forms/lead-form";
import { CtaBand } from "@/components/home/sections";
import { TestimonialFigure } from "@/components/home/testimonials";
import { TrustList } from "@/components/layout/trust-list";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { BeforeAfter } from "@/components/projects/before-after";
import { ProjectCard } from "@/components/projects/card";
import {
  ChallengeSolution,
  DetailHeading,
  EquipmentList,
  FactsBar,
  PrevNext,
  ResultsBlock,
  WorkTimeline,
} from "@/components/projects/detail";
import { Gallery } from "@/components/projects/gallery";
import { ShareRow } from "@/components/projects/share";
import { VideoEmbed } from "@/components/projects/video";
import { assetExists, BrandImage } from "@/components/ui/brand-image";
import { CallButton } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-header";
import { Section, SectionHeading } from "@/components/ui/section";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getBrand().content.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.title} in ${cityLabel(project)}`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.cover.src,
  });
}

/** Only images whose files exist (the gallery, lightbox and comparison never show empty frames). */
const existing = (images: (ProjectImage | undefined)[]) => images.filter((i): i is ProjectImage => assetExists(i?.src));

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const { config, content } = getBrand();
  const { company } = config;
  const pp = content.copy.projectsPage;
  const d = pp.detail;
  const p = project;

  const serviceType = categoryService[p.category];
  const service = content.services.find((s) => s.slug === serviceType);
  const serviceLabel = service?.title ?? serviceTypeLabels[serviceType];
  const all = content.projects;
  const i = all.findIndex((x) => x.slug === p.slug);
  const prev = all[i - 1];
  const next = all[i + 1];
  const related = relatedProjects(all, p);
  const gallery = existing(p.gallery);
  const [before, after] = existing([p.before, p.after]).length === 2 ? [p.before, p.after] : [];
  const review = p.testimonialId ? content.testimonials.find((t) => t.id === p.testimonialId) : undefined;
  const url = absoluteUrl(`/projects/${p.slug}`);

  return (
    <>
      <PageHero
        eyebrow={pp.categories[p.category]}
        title={p.title}
        intro={p.summary}
        crumbs={[
          { name: "Projects", href: "/projects" },
          { name: p.title, href: `/projects/${p.slug}` },
        ]}
      >
        <p className="flex flex-wrap items-center gap-3 text-on-primary/90">
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4" aria-hidden="true" />
            {cityLabel(p)}
          </span>
          <span className="rounded-full border border-on-primary/25 bg-on-primary/8 px-3 py-1 text-sm font-semibold">{p.systemType}</span>
        </p>
      </PageHero>

      <div className="container-site section-y grid gap-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
        <article className="grid min-w-0 content-start gap-12">
          <FactsBar project={p} serviceLabel={serviceLabel} labels={d} />

          <BrandImage image={p.cover} sizes="(min-width: 1024px) 760px, 100vw" aspect="aspect-[16/9]" preload />

          <Reveal as="section" variant="fade-up" aria-labelledby="overview-title">
            <DetailHeading id="overview-title">{d.overview}</DetailHeading>
            <p className="mt-5 text-lg leading-relaxed text-muted">{p.overview}</p>
          </Reveal>

          <ChallengeSolution project={p} labels={d} />
          <EquipmentList items={p.equipment} label={d.equipment} />
          <WorkTimeline steps={p.timeline} label={d.timeline} />

          {gallery.length > 0 ? (
            <section aria-labelledby="gallery-title">
              <DetailHeading id="gallery-title">{d.gallery}</DetailHeading>
              <div className="mt-6">
                <Gallery
                  images={gallery}
                  labels={{ open: d.galleryOpen, close: d.galleryClose, prev: d.galleryPrev, next: d.galleryNext }}
                />
              </div>
            </section>
          ) : null}

          {before && after ? (
            <section aria-labelledby="before-after-title">
              <DetailHeading id="before-after-title">{d.beforeAfter}</DetailHeading>
              <div className="mt-6">
                <BeforeAfter before={before} after={after} labels={{ before: d.before, after: d.after, control: d.beforeAfterControl }} />
              </div>
            </section>
          ) : null}

          {p.videoUrl ? (
            <section aria-labelledby="video-title">
              <DetailHeading id="video-title">{d.video}</DetailHeading>
              <div className="mt-6">
                <VideoEmbed
                  url={p.videoUrl}
                  title={p.title}
                  poster={assetExists(p.cover.src) ? p.cover.src : undefined}
                  playLabel={d.playVideo}
                />
              </div>
            </section>
          ) : null}

          <ResultsBlock results={p.results} label={d.results} />

          {review ? (
            <Reveal as="section" variant="fade-up" aria-labelledby="review-title">
              <DetailHeading id="review-title">{d.testimonial}</DetailHeading>
              <div className="mt-6 flex rounded-brand border border-line bg-surface-alt">
                <TestimonialFigure t={review} />
              </div>
            </Reveal>
          ) : null}

          <div className="grid gap-8 border-t border-line pt-8">
            <ShareRow url={url} title={p.title} labels={{ share: d.share, copy: d.copyLink, copied: d.copied, email: d.emailLink }} />
            <PrevNext prev={prev} next={next} labels={d} />
          </div>
        </article>

        {/* Sticky on desktop; on phones it stacks below the article as the closing CTA. */}
        <aside aria-label={d.quoteTitle} className="grid content-start gap-6 lg:sticky lg:top-28 lg:self-start">
          <CallButton phone={company.phone} variant="primary" size="lg" className="w-full" />
          <div className="text-ink">
            <LeadForm
              companyName={company.name}
              phone={company.phone}
              defaultService={service ? serviceType : undefined}
              serviceOptions={content.services.map((s) => s.slug)}
              title={d.quoteTitle}
              compact
            />
          </div>
          <TrustList company={company} variant="chips" />
          <div className="rounded-brand border border-line p-6">
            <p className="font-heading text-lg font-bold">{d.areaTitle}</p>
            <div className="mt-4">
              <ServiceAreaChecker areas={getServiceZips()} phone={company.phone} />
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <Section tone="alt" labelledBy="related-title">
          <SectionHeading id="related-title" eyebrow={pp.grid.eyebrow} title={d.related} />
          <RevealGroup as="ul" variant="fade-up" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <ProjectCard project={r} copy={pp} />
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
