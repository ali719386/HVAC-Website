import type { Metadata } from "next";
import { getBrand } from "@/lib/brand";
import { smsDoc } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo/meta";
import { LegalPage } from "@/components/legal/legal-page";

export function generateMetadata(): Metadata {
  const doc = smsDoc(getBrand().config);
  return pageMetadata({ title: doc.title, description: doc.description, path: "/sms-consent" });
}

export default function Page() {
  const { config } = getBrand();
  return <LegalPage doc={smsDoc(config)} path="/sms-consent" legal={config.legal} />;
}
