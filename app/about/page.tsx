import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import type { Service } from "@/lib/brand/schema";
import { pageMetadata } from "@/lib/seo/meta";
import { PageHeader } from "@/components/ui/page-header";
import { BrandStrip, ServiceCards } from "@/components/home/sections";
import { TestimonialSlider } from "@/components/home/testimonials";
import { AboutMission, AboutStory, AboutWhy, PhotoCta } from "@/components/about/sections";

export function generateMetadata(): Metadata {
  const { config, content } = getBrand();
  return pageMetadata({
    title: content.copy.about.title,
    description: `${content.copy.about.intro} Serving ${config.company.address.city}, ${config.company.address.state} and nearby communities.`,
    path: "/about",
  });
}

export default function AboutPage() {
  const { config, content } = getBrand();
  const about = content.copy.about;
  const { images } = config;

  // Only services that exist in the brand content (so every "Learn more" link has a real page).
  const services: Service[] =
    about.services.items.length > 0
      ? about.services.items.flatMap((item) => {
          const s = content.services.find((x) => x.slug === item.slug);
          return s
            ? [{ ...s, title: item.title ?? s.title, summary: item.summary ?? s.summary, image: item.image ?? s.image }]
            : [];
        })
      : content.services.slice(0, 3);

  return (
    <>
      <PageHeader
        title={about.title}
        intro={about.intro}
        crumbs={[{ name: "About", href: "/about" }]}
        image={images.aboutHero}
        imageStyle="blend"
      />
      <AboutStory copy={about.story} image={images.aboutStory ?? images.about} inset={images.aboutStoryInset} company={config.company} />
      <AboutWhy copy={about.why} items={about.why.items.length > 0 ? about.why.items : content.whyChooseUs} />
      <AboutMission copy={about.mission} image={images.aboutMission ?? images.about} />
      {services.length > 0 ? <ServiceCards services={services} copy={about.services} /> : null}
      <BrandStrip brands={config.offerings.supportedBrands} title={content.copy.brandStrip.title} />
      <TestimonialSlider items={content.testimonials} copy={about.testimonials} tone="light" />
      <PhotoCta copy={about.cta} image={images.aboutCta} phone={config.company.phone} />
    </>
  );
}
