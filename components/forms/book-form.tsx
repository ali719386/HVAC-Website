"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentProps } from "react";
import { serviceTypes, type ServiceType } from "@/lib/lead/constants";
import { LeadForm } from "./lead-form";

const isServiceType = (v: string | null): v is ServiceType => serviceTypes.some((s) => s === v);

/** Known ?issue= values (from the /services problem picker), mapped to a service and a starter message. */
export type IssuePrefill = Record<string, { service: ServiceType; message: string }>;

/**
 * LeadForm with URL prefill: ?service=<type>, ?issue=<symptom id>, ?state=<abbr>&city=<name>. Unknown values are ignored.
 * Render inside <Suspense> with a plain LeadForm fallback.
 */
export function BookForm({
  issues = {},
  ...props
}: Omit<ComponentProps<typeof LeadForm>, "defaultService" | "defaultMessage" | "defaultState" | "defaultCity"> & { issues?: IssuePrefill }) {
  const params = useSearchParams();
  const issueKey = params.get("issue");
  const issue = issueKey && Object.hasOwn(issues, issueKey) ? issues[issueKey] : undefined;
  const param = params.get("service");
  const defaultService = isServiceType(param) ? param : issue?.service;
  // ?state=TX&city=Houston (unknown values are ignored by LeadForm).
  const defaultState = params.get("state")?.toUpperCase() ?? undefined;
  const defaultCity = params.get("city") ?? undefined;
  return (
    <LeadForm
      key={`${defaultService ?? "none"}-${issueKey ?? ""}-${defaultState ?? ""}-${defaultCity ?? ""}`}
      {...props}
      defaultService={defaultService}
      defaultMessage={issue?.message}
      defaultState={defaultState}
      defaultCity={defaultCity}
    />
  );
}
