import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { privacyDoc } from "@/lib/legal";
import { aiEnabled } from "@/lib/chat-ai";
import { pageMetadata } from "@/lib/seo/meta";
import { LegalPage } from "@/components/legal/legal-page";

export function generateMetadata(): Metadata {
  const doc = privacyDoc(getBrand().config);
  return pageMetadata({ title: doc.title, description: doc.description, path: "/privacy" });
}

export default function Page() {
  const { config } = getBrand();
  return <LegalPage doc={privacyDoc(config, aiEnabled())} path="/privacy" legal={config.legal} />;
}
