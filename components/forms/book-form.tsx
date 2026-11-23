"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import { serviceTypes, type ServiceType } from "@/lib/lead/constants";
import { LeadForm } from "./lead-form";

const isServiceType = (v: string | null): v is ServiceType => serviceTypes.some((s) => s === v);

/** LeadForm with ?service=<type> prefill. Render inside <Suspense> with a plain LeadForm fallback. */
export function BookForm(props: Omit<ComponentProps<typeof LeadForm>, "defaultService">) {
  const param = useSearchParams().get("service");
  const defaultService = isServiceType(param) ? param : undefined;
  return <LeadForm key={defaultService ?? "none"} {...props} defaultService={defaultService} />;
}
