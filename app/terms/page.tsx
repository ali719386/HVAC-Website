import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { termsDoc } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo/meta";
import { LegalPage } from "@/components/legal/legal-page";

export function generateMetadata(): Metadata {
  const doc = termsDoc(getBrand().config);
  return pageMetadata({ title: doc.title, description: doc.description, path: "/terms" });
}

export default function Page() {
  const { config } = getBrand();
  return <LegalPage doc={termsDoc(config)} path="/terms" legal={config.legal} />;
}
