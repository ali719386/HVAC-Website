import { HomeSections } from "@/components/home/registry";
import { getBrand, getServiceZips } from "@/lib/brand";

export default function HomePage() {
  const brand = getBrand();
  const heroEnabled = brand.config.homepage.sections.some((s) => s.key === "hero" && s.enabled);
  return (
    <>
      {heroEnabled ? null : <h1 className="sr-only">{brand.config.seo.defaultTitle}</h1>}
      <HomeSections brand={brand} areas={getServiceZips()} />
    </>
  );
}
