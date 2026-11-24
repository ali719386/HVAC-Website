"use client";

import Link from "next/link";
import Script from "next/script";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Terminal } from "lucide-react";
import type { Phone } from "@/lib/brand/schema";
import type { ClientArea } from "@/lib/geo/coverage";
import {
  LIMITS,
  preferredTimeLabels,
  preferredTimes,
  serviceTypeLabels,
  serviceTypes,
  smsConsentText,
  urgencies,
  urgencyLabels,
  type ServiceType,
} from "@/lib/lead/constants";
import { fieldErrors, leadSchema, type FieldErrors, type LeadField, type LeadResponse } from "@/lib/lead/schema";

declare global {
  interface Window {
    turnstile?: { reset: (widget?: string) => void };
  }
}

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "dev"; message: string }
  | { kind: "error"; message: string };

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const input =
  "w-full rounded-btn border border-line bg-surface px-4 text-base text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-accent-dark";

export function LeadForm({
  companyName,
  phone,
  defaultService,
  defaultMessage,
  title,
  compact = false,
  serviceOptions = serviceTypes,
  areas = [],
  defaultState,
  defaultCity,
}: {
  /** Service choices in the dropdown (pass the brand's own service slugs). Defaults to every type. */
  serviceOptions?: readonly ServiceType[];
  /** Coverage for the state and city selects (hidden when empty). */
  areas?: ClientArea[];
  /** Prefill: state abbreviation and city name from coverage (e.g. on a city page). */
  defaultState?: string;
  defaultCity?: string;
  companyName: string;
  phone: Phone;
  defaultService?: ServiceType;
  /** Prefills "Tell us what is going on" (e.g. from a /services problem picker link). */
  defaultMessage?: string;
  title?: string;
  /** Shorter form for inline CTAs: hides the optional email and preferred-time fields. */
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const known = (abbr?: string) => (abbr && areas.some((a) => a.abbr === abbr) ? abbr : "");
  const [placeState, setPlaceState] = useState(known(defaultState));
  const stateArea = areas.find((a) => a.abbr === placeState);
  const initialCity = stateArea?.cities.some((c) => c.name === defaultCity) ? (defaultCity ?? "") : "";
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const consent = smsConsentText(companyName);

  function read(form: HTMLFormElement) {
    const fd = new FormData(form);
    const str = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" ? v : "";
    };
    return {
      name: str("name"),
      phone: str("phone"),
      email: str("email"),
      address: str("address"),
      serviceState: str("serviceState"),
      serviceCity: str("serviceCity"),
      serviceType: str("serviceType"),
      urgency: str("urgency"),
      preferredTime: str("preferredTime"),
      message: str("message"),
      smsConsent: fd.get("smsConsent") === "on",
      website: str("website"),
      pageUrl: window.location.href.slice(0, LIMITS.pageUrl),
      turnstileToken: str("cf-turnstile-response") || undefined,
    };
  }

  function focusFirstError(errs: FieldErrors) {
    const first = Object.keys(errs)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    const data = read(e.currentTarget);
    const parsed = leadSchema.safeParse(data);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      setStatus({ kind: "idle" });
      focusFirstError(errs);
      return;
    }
    setErrors({});
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body: LeadResponse = await res.json().catch(() => ({ ok: false, error: "" }));
      if (body.ok && body.mode === "delivered") setStatus({ kind: "success" });
      else if (body.ok && body.mode === "dev") setStatus({ kind: "dev", message: body.message });
      else {
        const errs = body.ok ? {} : (body.fieldErrors ?? {});
        setErrors(errs);
        setStatus({
          kind: "error",
          message: (!body.ok && body.error) || "We could not send your request. Please try again or call us.",
        });
        window.turnstile?.reset();
        focusFirstError(errs);
      }
    } catch {
      setStatus({ kind: "error", message: "Network error. Please check your connection and try again, or call us." });
      window.turnstile?.reset();
    }
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  if (status.kind === "success" || status.kind === "dev") {
    const dev = status.kind === "dev";
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="rounded-brand border border-line bg-surface p-8 text-center shadow-brand-md outline-none">
        {dev ? (
          <>
            <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-extrabold tracking-wide text-on-accent uppercase">
              <Terminal className="size-4" aria-hidden="true" />
              DEV MODE, not delivered
            </p>
            <p className="mt-4 text-muted">{status.message}</p>
          </>
        ) : (
          <>
            <CircleCheck className="mx-auto size-14 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-extrabold">Thank you, your request was sent.</h2>
            <p className="mt-2 text-muted">
              Our team will contact you to confirm the details. For urgent problems, call{" "}
              <a className="font-bold text-primary underline underline-offset-4" href={`tel:${phone.tel}`}>
                {phone.display}
              </a>
              .
            </p>
          </>
        )}
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;
  const submitting = status.kind === "submitting";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${uid}-note`}
      className="@container rounded-brand border border-line bg-surface p-6 shadow-brand-md sm:p-8"
    >
      {title ? <h2 className="mb-1 text-2xl font-extrabold">{title}</h2> : null}
      <p id={`${uid}-note`} className="mb-6 text-sm text-muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div ref={resultRef} tabIndex={-1} className="outline-none">
        {status.kind === "error" ? (
          <div role="alert" className="mb-6 flex gap-3 rounded-brand-sm border border-accent-dark/40 bg-accent/8 p-4">
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-accent-dark" aria-hidden="true" />
            <p className="font-medium">{status.message}</p>
          </div>
        ) : errorCount > 0 ? (
          <div role="alert" className="mb-6 flex gap-3 rounded-brand-sm border border-accent-dark/40 bg-accent/8 p-4">
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-accent-dark" aria-hidden="true" />
            <p className="font-medium">
              Please fix {errorCount === 1 ? "1 field" : `${errorCount} fields`} below.
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 @lg:grid-cols-2">
        <Field id={id("name")} label="Full name" required error={errors.name}>
          <input id={id("name")} name="name" autoComplete="name" maxLength={LIMITS.name} {...aria("name", errors, id)} className={`${input} h-12`} />
        </Field>
        <Field id={id("phone")} label="Phone" required error={errors.phone}>
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel-national" inputMode="tel" placeholder="(555) 555-0100" maxLength={20} {...aria("phone", errors, id)} className={`${input} h-12`} />
        </Field>
        {compact ? null : (
          <Field id={id("email")} label="Email" error={errors.email}>
            <input id={id("email")} name="email" type="email" autoComplete="email" maxLength={LIMITS.email} {...aria("email", errors, id)} className={`${input} h-12`} />
          </Field>
        )}
        <Field id={id("address")} label="Address or ZIP code" required error={errors.address}>
          <input id={id("address")} name="address" autoComplete="street-address" maxLength={LIMITS.address} {...aria("address", errors, id)} className={`${input} h-12`} />
        </Field>
        {areas.length > 0 ? (
          <>
            <Field id={id("serviceState")} label="State" error={errors.serviceState}>
              <select
                id={id("serviceState")}
                name="serviceState"
                value={placeState}
                onChange={(e) => setPlaceState(e.target.value)}
                {...aria("serviceState", errors, id)}
                className={`${input} h-12`}
              >
                <option value="">Choose a state</option>
                {areas.map((a) => (
                  <option key={a.abbr} value={a.abbr}>
                    {a.name}
                  </option>
                ))}
                <option value="other">Not listed</option>
              </select>
            </Field>
            <Field id={id("serviceCity")} label="City" error={errors.serviceCity}>
              {/* key: reset the city when the state changes. */}
              <select
                key={placeState}
                id={id("serviceCity")}
                name="serviceCity"
                defaultValue={initialCity}
                {...aria("serviceCity", errors, id)}
                className={`${input} h-12`}
              >
                <option value="">{stateArea ? "Choose a city" : "Choose a state first"}</option>
                {stateArea?.cities.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="other">Not listed</option>
              </select>
            </Field>
          </>
        ) : null}
        <Field id={id("serviceType")} label="Service needed" required error={errors.serviceType}>
          <select id={id("serviceType")} name="serviceType" defaultValue={defaultService ?? ""} {...aria("serviceType", errors, id)} className={`${input} h-12`}>
            <option value="" disabled>
              Choose a service
            </option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {serviceTypeLabels[s]}
              </option>
            ))}
          </select>
        </Field>
        {compact ? null : (
          <Field id={id("preferredTime")} label="Preferred time" error={errors.preferredTime}>
            <select id={id("preferredTime")} name="preferredTime" defaultValue="" {...aria("preferredTime", errors, id)} className={`${input} h-12`}>
              <option value="">No preference</option>
              {preferredTimes.map((t) => (
                <option key={t} value={t}>
                  {preferredTimeLabels[t]}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <fieldset className="mt-5" aria-describedby={errors.urgency ? `${id("urgency")}-error` : undefined}>
        <legend className="mb-2 text-sm font-semibold">
          How soon do you need service? <span aria-hidden="true" className="text-accent-dark">*</span>
        </legend>
        <div className="grid gap-2 @md:grid-cols-3">
          {urgencies.map((u) => (
            <label key={u} className="flex h-12 cursor-pointer items-center gap-3 rounded-btn border border-line px-4 font-medium has-checked:border-primary has-checked:bg-surface-alt has-focus-visible:ring-2 has-focus-visible:ring-primary/40">
              <input type="radio" name="urgency" value={u} className="size-4 accent-[var(--brand-primary)]" />
              {urgencyLabels[u]}
            </label>
          ))}
        </div>
        {errors.urgency ? <ErrorText id={`${id("urgency")}-error`}>{errors.urgency}</ErrorText> : null}
      </fieldset>

      <div className="mt-5">
        <Field id={id("message")} label="Tell us what is going on" error={errors.message}>
          <textarea id={id("message")} name="message" rows={compact ? 3 : 4} maxLength={LIMITS.message} defaultValue={defaultMessage} {...aria("message", errors, id)} className={`${input} py-3`} />
        </Field>
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-6 rounded-brand-sm bg-surface-alt p-4">
        <label htmlFor={id("smsConsent")} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input id={id("smsConsent")} name="smsConsent" type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--brand-primary)]" />
          <span>
            <span className="font-semibold">Optional:</span> {consent} See our{" "}
            <Link href="/sms-consent" className="font-semibold text-primary underline underline-offset-2">
              SMS Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-primary underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      </div>

      {turnstileSiteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
          <div className="cf-turnstile mt-5" data-sitekey={turnstileSiteKey} />
        </>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-btn bg-accent px-7 text-base font-bold text-on-accent transition-colors hover:bg-accent-dark disabled:opacity-70"
      >
        {submitting ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
        {submitting ? "Sending..." : "Send request"}
      </button>
      <p className="mt-3 text-center text-sm text-muted">
        Prefer to talk?{" "}
        <a href={`tel:${phone.tel}`} className="font-bold text-primary underline underline-offset-2">
          Call {phone.display}
        </a>
      </p>
      <p aria-live="polite" className="sr-only">
        {submitting ? "Sending your request" : ""}
      </p>
    </form>
  );
}

function aria(field: LeadField, errors: FieldErrors, id: (f: string) => string) {
  return errors[field]
    ? { "aria-invalid": true as const, "aria-describedby": `${id(field)}-error` }
    : { "aria-invalid": undefined, "aria-describedby": undefined };
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-accent-dark">
      <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

function Field({
  id,
  label,
  required = false,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label} {required ? <span aria-hidden="true" className="text-accent-dark">*</span> : null}
      </label>
      {children}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}
