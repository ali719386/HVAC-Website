"use client";

import Script from "next/script";
import { useId, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, ClipboardCheck, LoaderCircle, Terminal } from "lucide-react";
import type { Copy } from "@/lib/brand/schema";
import { LIMITS } from "@/lib/lead/constants";
import { checklistSchema, type ChecklistErrors, type LeadResponse } from "@/lib/lead/schema";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success" } | { kind: "dev"; message: string } | { kind: "error"; message: string };

/** Email signup for the seasonal checklist. Posts to /api/lead with source "checklist" (no SMS). */
export function ChecklistSignup({ copy }: { copy: Copy["blog"]["checklist"] }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<ChecklistErrors>({});
  const uid = useId();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    const fd = new FormData(e.currentTarget);
    const str = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" ? v : "";
    };
    const data = {
      source: "checklist" as const,
      email: str("email"),
      consent: fd.get("consent") === "on",
      website: str("website"),
      pageUrl: window.location.href.slice(0, LIMITS.pageUrl),
      turnstileToken: str("cf-turnstile-response") || undefined,
    };
    const parsed = checklistSchema.safeParse(data);
    if (!parsed.success) {
      const errs: ChecklistErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if ((key === "email" || key === "consent") && !errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      const body: LeadResponse = await res.json().catch(() => ({ ok: false, error: "" }));
      if (body.ok && body.mode === "delivered") setStatus({ kind: "success" });
      else if (body.ok && body.mode === "dev") setStatus({ kind: "dev", message: body.message });
      else {
        setErrors(body.ok ? {} : (body.checklistErrors ?? {}));
        setStatus({ kind: "error", message: (!body.ok && body.error) || "We could not send your request. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  if (status.kind === "success" || status.kind === "dev") {
    return (
      <div role="status" className="rounded-brand border border-line bg-surface p-6">
        {status.kind === "dev" ? (
          <>
            <p className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-extrabold tracking-wide text-on-accent uppercase">
              <Terminal className="size-3.5" aria-hidden="true" />
              DEV MODE, not delivered
            </p>
            <p className="mt-3 text-sm text-muted">{status.message}</p>
          </>
        ) : (
          <p className="flex items-start gap-2 font-medium">
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            {copy.success}
          </p>
        )}
      </div>
    );
  }

  const submitting = status.kind === "submitting";
  return (
    <form onSubmit={onSubmit} noValidate className="rounded-brand border border-line bg-surface p-6">
      <p className="flex items-center gap-2 font-heading text-lg font-bold">
        <ClipboardCheck className="size-5 text-primary" aria-hidden="true" />
        {copy.title}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{copy.body}</p>
      {status.kind === "error" ? (
        <p role="alert" className="mt-4 flex items-start gap-2 text-sm font-medium text-accent-dark">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {status.message}
        </p>
      ) : null}
      <label htmlFor={`${uid}-email`} className="mt-4 mb-1.5 block text-sm font-semibold">
        {copy.emailLabel} <span aria-hidden="true" className="text-accent-dark">*</span>
      </label>
      <input
        id={`${uid}-email`}
        name="email"
        type="email"
        autoComplete="email"
        maxLength={LIMITS.email}
        aria-invalid={errors.email ? true : undefined}
        aria-describedby={errors.email ? `${uid}-email-error` : undefined}
        className="h-11 w-full rounded-btn border border-line bg-surface px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-accent-dark"
      />
      {errors.email ? (
        <p id={`${uid}-email-error`} className="mt-1.5 text-sm font-medium text-accent-dark">
          {errors.email}
        </p>
      ) : null}
      <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed">
        <input
          name="consent"
          type="checkbox"
          className="mt-1 size-4 shrink-0 accent-[var(--brand-primary)]"
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? `${uid}-consent-error` : undefined}
        />
        <span>{copy.consent}</span>
      </label>
      {errors.consent ? (
        <p id={`${uid}-consent-error`} className="mt-1.5 text-sm font-medium text-accent-dark">
          {errors.consent}
        </p>
      ) : null}
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      {turnstileSiteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
          <div className="cf-turnstile mt-4" data-sitekey={turnstileSiteKey} />
        </>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-accent px-5 font-bold text-on-accent transition-colors hover:bg-accent-dark disabled:opacity-70"
      >
        {submitting ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
        {copy.submit}
      </button>
    </form>
  );
}
