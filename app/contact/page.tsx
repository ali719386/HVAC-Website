import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo/meta";
import { LeadForm } from "@/components/forms/lead-form";
import { ContactCard } from "@/components/layout/contact-card";
import { PageHeader } from "@/components/ui/page-header";

export function generateMetadata(): Metadata {
  const { config } = getBrand();
  const { company } = config;
  return pageMetadata({
    title: "Contact Us",
    description: `Contact ${company.name} in ${company.address.city}, ${company.address.state}. Call ${company.phone.display} or send us a message.`,
    path: "/contact",
  });
}

export default function ContactPage() {
  const { config, content } = getBrand();
  const c = content.copy.contact;
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro || undefined} crumbs={[{ name: "Contact", href: "/contact" }]} />
      <div className="container-site section-y grid gap-10 lg:grid-cols-[24rem_1fr] lg:gap-14">
        <aside aria-label="Contact details">
          <ContactCard config={config} />
        </aside>
        <LeadForm companyName={config.company.name} phone={config.company.phone} title="Send us a message" />
      </div>
    </>
  );
}
