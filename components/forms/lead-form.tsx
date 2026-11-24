"use client";

import Link from "next/link";
import Script from "next/script";
import { useId, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleAlert,
  ClipboardCheck,
  Fan,
  Flame,
  LoaderCircle,
  Lock,
  Phone as PhoneIcon,
  Siren,
  Snowflake,
  Terminal,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { Phone } from "@/lib/brand/schema";
import type { ClientArea } from "@/lib/geo/coverage";
import { track } from "@/lib/analytics";
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
  | { kind: "success"; reference?: string }
  | { kind: "dev"; message: string; reference?: string }
  | { kind: "error"; message: string };

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const OTHER = "other";

const serviceIcons: Record<ServiceType, LucideIcon> = {
  "ac-repair": Snowflake,
  "ac-installation": Fan,
  heating: Flame,
  maintenance: ClipboardCheck,
  commercial: Building2,
  "duct-cleaning": Wind,
};

/** Fields validated on each step (steps variant). */
const stepFields: LeadField[][] = [
  ["serviceType", "urgency"],
  ["zip", "street", "serviceState", "serviceCity"],
  ["name", "phone", "email", "preferredTime", "preferredDate", "message", "smsConsent"],
];
const stepTitles = ["What do you need?", "Where is the service needed?", "How can we reach you?"];
const stepShort = ["Service", "Location", "Contact"];

/** Formats US digits as (555) 555-0123 while typing. */
function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").replace(/^1(?=\d{10})/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Field chrome: 48px controls, token radius, primary focus ring with a soft glow. */
const control =
  "h-12 w-full rounded-btn border border-line bg-surface px-4 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand-primary)_18%,transparent)] aria-[invalid=true]:border-accent-dark";

export type NextStep = { title: string; body: string };

export function LeadForm({
  companyName,
  phone,
  emergencyPhone,
  serviceOptions = serviceTypes,
  areas = [],
  variant = "steps",
  defaultService,
  defaultMessage,
  defaultState,
  defaultCity,
  title,
  trustChips = [],
  privacy,
  nextSteps = [],
}: {
  companyName: string;
  phone: Phone;
  /** Shown in the emergency banner when Emergency is selected (only when configured). */
  emergencyPhone?: Phone;
  /** The brand's own service slugs (tiles / select). */
  serviceOptions?: readonly ServiceType[];
  /** Coverage for ZIP lookup and the state and city selects. */
  areas?: ClientArea[];
  /**
   * steps: 3-step form (default). simple: one page with name, phone, email, ZIP, service, urgency and message.
   * compact: name, phone, service, ZIP and urgency (CTA bands, sidebars).
   */
  variant?: "steps" | "simple" | "compact";
  defaultService?: ServiceType;
  defaultMessage?: string;
  /** Prefill from a city, state or project page. */
  defaultState?: string;
  defaultCity?: string;
  title?: string;
  /** Configured trust items only (license, insured...). */
  trustChips?: string[];
  privacy?: { text: string; href: string };
  /** Shown in the success state. */
  nextSteps?: NextStep[];
}) {
  // Single-page layouts (simple and compact) share the same code path; simple adds email and message.
  const compact = variant !== "steps";
  const simple = variant === "simple";
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showSummary, setShowSummary] = useState(false);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [valid, setValid] = useState<Partial<Record<LeadField, boolean>>>({});
  const [formKey, setFormKey] = useState(0);

  // Controlled values the UI depends on (summary, banners, dependent selects).
  const [service, setService] = useState<string>(defaultService ?? "");
  const [urgency, setUrgency] = useState<string>("");
  const [zip, setZip] = useState("");
  const [manualArea, setManualArea] = useState(false);
  const knownState = defaultState && areas.some((a) => a.abbr === defaultState) ? defaultState : "";
  const [placeState, setPlaceState] = useState(knownState);
  const [placeCity, setPlaceCity] = useState(
    knownState && areas.find((a) => a.abbr === knownState)?.cities.some((c) => c.name === defaultCity) ? (defaultCity ?? "") : "",
  );
  const [phoneValue, setPhoneValue] = useState("");
  const [time, setTime] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const consent = smsConsentText(companyName);
  const emergency = urgency === "emergency";

  // ZIP lookup against configured coverage (no external API).
  const zipHit = /^\d{5}$/.test(zip)
    ? areas.flatMap((a) => a.cities.filter((c) => c.zips.includes(zip)).map((c) => ({ abbr: a.abbr, city: c.name }))).at(0)
    : undefined;
  const autoArea = zipHit && !manualArea ? zipHit : undefined;
  const stateArea = areas.find((a) => a.abbr === placeState);
  const locationText = autoArea
    ? `${autoArea.city}, ${autoArea.abbr}`
    : placeCity && placeCity !== OTHER
      ? `${placeCity}, ${placeState}`
      : placeState && placeState !== OTHER
        ? (stateArea?.name ?? placeState)
        : "";

  function start() {
    if (started) return;
    setStarted(true);
    track("form_start", { variant });
  }

  function read(form: HTMLFormElement) {
    const fd = new FormData(form);
    const str = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" ? v : "";
    };
    const params = new URLSearchParams(window.location.search);
    const param = (k: string) => params.get(k)?.slice(0, LIMITS.tracking) || undefined;
    return {
      name: str("name"),
      phone: str("phone"),
      email: str("email"),
      zip: str("zip"),
      street: str("street"),
      serviceState: str("serviceState"),
      serviceCity: str("serviceCity"),
      serviceType: str("serviceType"),
      urgency: str("urgency"),
      preferredTime: str("preferredTime"),
      preferredDate: emergency ? "" : str("preferredDate"),
      message: str("message"),
      smsConsent: fd.get("smsConsent") === "on",
      website: str("website"),
      pageUrl: window.location.href.slice(0, LIMITS.pageUrl),
      referrer: document.referrer.slice(0, LIMITS.tracking) || undefined,
      utmSource: param("utm_source"),
      utmMedium: param("utm_medium"),
      utmCampaign: param("utm_campaign"),
      gclid: param("gclid"),
      turnstileToken: str("cf-turnstile-response") || undefined,
    };
  }

  const focusField = (name: string) => formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();

  /** Errors for the given fields only (whole-form parse, filtered). */
  function validate(fields: LeadField[] | null) {
    if (!formRef.current) return {};
    const parsed = leadSchema.safeParse(read(formRef.current));
    if (parsed.success) return {};
    const all = fieldErrors(parsed.error);
    return fields ? Object.fromEntries(Object.entries(all).filter(([k]) => fields.some((f) => f === k))) : all;
  }

  function goTo(next: number) {
    setStep(next);
    setErrors({});
    setShowSummary(false);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function onNext() {
    const fields = stepFields[step] ?? [];
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShowSummary(true);
      const first = Object.keys(errs)[0];
      if (first) focusField(first);
      return;
    }
    track("step_complete", { step: step + 1 });
    goTo(step + 1);
  }

  /** Inline validity check on blur (shows the check icon or the error). */
  function onBlur(e: FocusEvent<HTMLFormElement>) {
    const t = e.target;
    if (!(t instanceof HTMLInputElement || t instanceof HTMLSelectElement || t instanceof HTMLTextAreaElement)) return;
    const name = t.name;
    if (!isLeadField(name) || t.type === "radio" || t.type === "checkbox") return;
    const errs = validate([name]);
    setErrors((prev) => {
      const next = { ...prev };
      if (errs[name]) next[name] = errs[name];
      else delete next[name];
      return next;
    });
    setValid((v) => ({ ...v, [name]: !errs[name] && t.value.trim() !== "" }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    if (!compact && step < 2) return onNext();
    const errs = validate(null);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShowSummary(true);
      // Jump back to the first step that has an error.
      const firstStep = stepFields.findIndex((fs) => fs.some((f) => errs[f]));
      if (!compact && firstStep >= 0 && firstStep !== step) setStep(firstStep);
      const first = Object.keys(errs)[0];
      requestAnimationFrame(() => first && focusField(first));
      return;
    }
    setErrors({});
    setShowSummary(false);
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(read(e.currentTarget)),
      });
      const body: LeadResponse = await res.json().catch(() => ({ ok: false, error: "" }));
      if (body.ok && body.mode === "delivered") {
        setStatus({ kind: "success", reference: body.reference });
        track("form_submit", { variant, service, urgency });
      } else if (body.ok && body.mode === "dev") {
        setStatus({ kind: "dev", message: body.message, reference: body.reference });
        track("form_submit", { variant, service, urgency, dev: true });
      } else {
        const fe = body.ok ? {} : (body.fieldErrors ?? {});
        setErrors(fe);
        setShowSummary(Object.keys(fe).length > 0);
        setStatus({ kind: "error", message: (!body.ok && body.error) || "We could not send your request. Please try again or call us." });
        window.turnstile?.reset();
      }
    } catch {
      setStatus({ kind: "error", message: "Network error. Please check your connection and try again, or call us." });
      window.turnstile?.reset();
    }
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  function reset() {
    setStatus({ kind: "idle" });
    setErrors({});
    setValid({});
    setStep(0);
    setService(defaultService ?? "");
    setUrgency("");
    setZip("");
    setManualArea(false);
    setPlaceState(knownState);
    setPlaceCity("");
    setPhoneValue("");
    setTime("");
    setFormKey((k) => k + 1);
  }

  const callClick = () => track("click_to_call", { source: "lead_form" });
  const serviceLabel = service && serviceTypes.some((s) => s === service) ? serviceTypeLabels[service as ServiceType] : "";
  const urgencyLabel = urgencies.find((u) => u === urgency);
  const card = "relative overflow-hidden rounded-brand border border-line bg-surface shadow-brand-md before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-accent";

  /* ------------------------------ Success ------------------------------ */
  if (status.kind === "success" || status.kind === "dev") {
    const dev = status.kind === "dev";
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className={`${card} p-6 outline-none sm:p-8`}>
        {dev ? (
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-extrabold tracking-wide text-on-accent uppercase">
            <Terminal className="size-4" aria-hidden="true" />
            DEV MODE, not delivered
          </p>
        ) : null}
        <div className="flex items-center gap-4">
          <span className="lead-check grid size-14 shrink-0 place-items-center rounded-full bg-primary text-on-primary" aria-hidden="true">
            <Check className="size-7" strokeWidth={3} />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold">{dev ? "Request recorded (not delivered)" : "Thank you, your request was sent."}</h2>
            {status.reference ? <p className="mt-1 text-sm text-muted">Reference: <span className="font-bold text-ink">{status.reference}</span></p> : null}
          </div>
        </div>
        {dev ? <p className="mt-4 text-sm text-muted">{status.message}</p> : null}
        <dl className="mt-6 grid gap-3 rounded-brand-sm bg-surface-alt p-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Service</dt>
            <dd className="font-semibold">{serviceLabel || "-"}</dd>
          </div>
          <div>
            <dt className="text-muted">Urgency</dt>
            <dd className="font-semibold">{urgencyLabel ? urgencyLabels[urgencyLabel] : "-"}</dd>
          </div>
          <div>
            <dt className="text-muted">Location</dt>
            <dd className="font-semibold">{locationText || zip || "-"}</dd>
          </div>
        </dl>
        {nextSteps.length > 0 ? (
          <ol className="mt-6 grid gap-3">
            {nextSteps.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">{i + 1}</span>
                <span>
                  <span className="block font-semibold">{s.title}</span>
                  <span className="block text-sm text-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {emergency ? (
            <a
              href={`tel:${(emergencyPhone ?? phone).tel}`}
              onClick={callClick}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-btn bg-accent px-6 font-bold text-on-accent hover:bg-accent-dark"
            >
              <PhoneIcon className="size-4" aria-hidden="true" />
              Call {(emergencyPhone ?? phone).display}
            </a>
          ) : null}
          <button type="button" onClick={reset} className="inline-flex h-12 items-center justify-center rounded-btn border-2 border-primary px-6 font-semibold text-primary hover:bg-primary hover:text-on-primary">
            Send another request
          </button>
        </div>
      </div>
    );
  }

  const submitting = status.kind === "submitting";
  const errorList = Object.entries(errors) as [LeadField, string][];
  const showStep = (n: number) => compact || step === n;

  /* ------------------------------ Shared pieces ------------------------------ */
  const urgencyPills = (
    <fieldset className="mt-6" aria-describedby={errors.urgency ? `${id("urgency")}-error` : undefined}>
      <legend className="mb-2 text-sm font-semibold">
        How soon do you need service? <Req />
      </legend>
      <div className="flex flex-wrap gap-2">
        {urgencies.map((u) => (
          <label
            key={u}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-4 font-medium transition-colors has-checked:border-primary has-checked:bg-primary has-checked:text-on-primary has-focus-visible:ring-2 has-focus-visible:ring-primary/40"
          >
            <input type="radio" name="urgency" value={u} checked={urgency === u} onChange={() => setUrgency(u)} className="sr-only" />
            {u === "emergency" ? <Siren className="size-4" aria-hidden="true" /> : null}
            {urgencyLabels[u]}
          </label>
        ))}
      </div>
      <ErrorText id={`${id("urgency")}-error`} error={errors.urgency} />
    </fieldset>
  );

  const emergencyBanner =
    emergency && emergencyPhone ? (
      <div role="note" className="mt-5 flex flex-col gap-3 rounded-brand-sm border border-accent/40 bg-accent/8 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 font-medium">
          <Siren className="mt-0.5 size-5 shrink-0 text-accent-dark" aria-hidden="true" />
          For an emergency, calling is the fastest way to reach us.
        </p>
        <a
          href={`tel:${emergencyPhone.tel}`}
          onClick={callClick}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-btn bg-accent px-5 font-bold text-on-accent hover:bg-accent-dark"
        >
          <PhoneIcon className="size-4" aria-hidden="true" />
          {emergencyPhone.display}
        </a>
      </div>
    ) : null;

  const zipField = (
    <Field id={id("zip")} label="ZIP code" required error={errors.zip} valid={valid.zip}>
      <input
        id={id("zip")}
        name="zip"
        inputMode="numeric"
        autoComplete="postal-code"
        maxLength={5}
        value={zip}
        onChange={(e) => {
          setZip(e.target.value.replace(/\D/g, "").slice(0, 5));
          setManualArea(false);
        }}
        {...aria("zip", errors, id)}
        className={control}
      />
    </Field>
  );

  /** Hidden values when the area comes from the ZIP (or from page defaults in compact mode). */
  const areaHidden = autoArea ? (
    <>
      <input type="hidden" name="serviceState" value={autoArea.abbr} />
      <input type="hidden" name="serviceCity" value={autoArea.city} />
    </>
  ) : compact ? (
    <>
      <input type="hidden" name="serviceState" value={placeState} />
      <input type="hidden" name="serviceCity" value={placeCity} />
    </>
  ) : null;

  /* ------------------------------ Form ------------------------------ */
  return (
    <form
      key={formKey}
      ref={formRef}
      onSubmit={onSubmit}
      onBlur={onBlur}
      onFocus={start}
      noValidate
      aria-describedby={`${uid}-note`}
      className={`@container ${card} p-6 sm:p-8`}
    >
      {title ? <h2 className="mb-1 text-2xl font-extrabold">{title}</h2> : null}
      <p id={`${uid}-note`} className="mb-5 text-sm text-muted">
        Fields marked <Req /> are required.
      </p>

      {trustChips.length > 0 ? (
        <ul className="mb-5 flex flex-wrap gap-2" aria-label="Credentials">
          {trustChips.map((t) => (
            <li key={t} className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              {t}
            </li>
          ))}
        </ul>
      ) : null}

      {!compact ? (
        <nav aria-label="Form progress" className="mb-6">
          <ol className="grid grid-cols-3 gap-2">
            {stepShort.map((label, i) => (
              <li key={label} aria-current={i === step ? "step" : undefined} className="min-w-0">
                <span className={`block h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-line"}`} aria-hidden="true" />
                <span className={`mt-2 block truncate text-xs font-semibold ${i === step ? "text-primary" : "text-muted"}`}>
                  {i + 1}. {label}
                  {i < step ? <span className="sr-only"> (done)</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div ref={resultRef} tabIndex={-1} className="outline-none" aria-live="polite">
        {status.kind === "error" ? (
          <div role="alert" className="mb-5 flex gap-3 rounded-brand-sm border border-accent-dark/40 bg-accent/8 p-4">
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-accent-dark" aria-hidden="true" />
            <p className="font-medium">{status.message}</p>
          </div>
        ) : null}
        {showSummary && errorList.length > 0 ? (
          <div role="alert" className="mb-5 rounded-brand-sm border border-accent-dark/40 bg-accent/8 p-4">
            <p className="flex items-center gap-2 font-semibold">
              <CircleAlert className="size-5 shrink-0 text-accent-dark" aria-hidden="true" />
              Please fix {errorList.length === 1 ? "1 field" : `${errorList.length} fields`}:
            </p>
            <ul className="mt-2 grid gap-1 pl-7 text-sm">
              {errorList.map(([f, msg]) => (
                <li key={f}>
                  <a href={`#${id(f)}`} onClick={(e) => (e.preventDefault(), focusField(f))} className="underline underline-offset-2">
                    {msg}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* -------- Step 1 / compact: service and urgency -------- */}
      <section hidden={!showStep(0)} aria-labelledby={compact ? undefined : `${uid}-h0`}>
        {!compact ? (
          <h3 id={`${uid}-h0`} ref={step === 0 ? headingRef : undefined} tabIndex={-1} className="mb-4 text-xl font-bold outline-none">
            {stepTitles[0]}
          </h3>
        ) : null}
        {compact ? (
          <div className="grid gap-5 @lg:grid-cols-2">
            <Field id={id("name")} label="Full name" required error={errors.name} valid={valid.name}>
              <input id={id("name")} name="name" autoComplete="name" maxLength={LIMITS.name} {...aria("name", errors, id)} className={control} />
            </Field>
            <Field id={id("phone")} label="Phone" required error={errors.phone} valid={valid.phone}>
              <input
                id={id("phone")}
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(555) 555-0100"
                value={phoneValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneValue(formatPhone(e.target.value))}
                {...aria("phone", errors, id)}
                className={control}
              />
            </Field>
            {simple ? (
              <Field id={id("email")} label="Email (optional)" error={errors.email} valid={valid.email}>
                <input id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} {...aria("email", errors, id)} className={control} />
              </Field>
            ) : null}            <Field id={id("serviceType")} label="Service needed" required error={errors.serviceType} valid={valid.serviceType}>
              <select id={id("serviceType")} name="serviceType" value={service} onChange={(e) => setService(e.target.value)} {...aria("serviceType", errors, id)} className={control}>
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
            {zipField}
          </div>
        ) : (
          <fieldset aria-describedby={errors.serviceType ? `${id("serviceType")}-error` : undefined}>
            <legend className="mb-2 text-sm font-semibold">
              Service <Req />
            </legend>
            <div className="grid grid-cols-2 gap-2.5 @lg:grid-cols-3">
              {serviceOptions.map((s) => {
                const I = serviceIcons[s];
                return (
                  <label
                    key={s}
                    className="flex min-h-24 cursor-pointer flex-col items-start justify-between gap-2 rounded-brand-sm border border-line p-4 transition-colors hover:border-primary has-checked:border-primary has-checked:bg-primary/5 has-checked:ring-1 has-checked:ring-primary has-focus-visible:ring-2 has-focus-visible:ring-primary/40"
                  >
                    <input type="radio" name="serviceType" value={s} checked={service === s} onChange={() => setService(s)} className="sr-only" />
                    <I className="size-6 text-primary" aria-hidden="true" />
                    <span className="font-semibold leading-snug">{serviceTypeLabels[s]}</span>
                  </label>
                );
              })}
            </div>
            <ErrorText id={`${id("serviceType")}-error`} error={errors.serviceType} />
          </fieldset>
        )}
        {urgencyPills}
        {emergencyBanner}
      </section>

      {/* -------- Step 2: location -------- */}
      {!compact ? (
        <section hidden={step !== 1} aria-labelledby={`${uid}-h1`}>
          <h3 id={`${uid}-h1`} ref={step === 1 ? headingRef : undefined} tabIndex={-1} className="mb-4 text-xl font-bold outline-none">
            {stepTitles[1]}
          </h3>
          <div className="grid gap-5 @lg:grid-cols-2">
            {zipField}
            <Field id={id("street")} label="Street address (optional)" error={errors.street} valid={valid.street}>
              <input id={id("street")} name="street" autoComplete="street-address" maxLength={LIMITS.address} {...aria("street", errors, id)} className={control} />
            </Field>
          </div>
          {areaHidden}
          {autoArea ? (
            <p className="mt-5 flex flex-wrap items-center gap-3 rounded-brand-sm bg-surface-alt p-4">
              <Check className="size-5 text-primary" aria-hidden="true" />
              <span>
                <span className="text-muted">Service area: </span>
                <span className="font-semibold">{locationText}</span>
              </span>
              <button type="button" onClick={() => setManualArea(true)} className="min-h-11 font-bold text-primary underline underline-offset-4">
                Change
              </button>
            </p>
          ) : areas.length > 0 ? (
            <div className="mt-5 grid gap-5 @lg:grid-cols-2">
              <Field id={id("serviceState")} label="State" error={errors.serviceState} valid={valid.serviceState}>
                <select
                  id={id("serviceState")}
                  name="serviceState"
                  value={placeState}
                  onChange={(e) => {
                    setPlaceState(e.target.value);
                    setPlaceCity("");
                  }}
                  {...aria("serviceState", errors, id)}
                  className={control}
                >
                  <option value="">Choose a state</option>
                  {areas.map((a) => (
                    <option key={a.abbr} value={a.abbr}>
                      {a.name}
                    </option>
                  ))}
                  <option value={OTHER}>Not listed</option>
                </select>
              </Field>
              <Field id={id("serviceCity")} label="City" error={errors.serviceCity} valid={valid.serviceCity}>
                <select id={id("serviceCity")} name="serviceCity" value={placeCity} onChange={(e) => setPlaceCity(e.target.value)} {...aria("serviceCity", errors, id)} className={control}>
                  <option value="">{stateArea ? "Choose a city" : placeState === OTHER ? "Not listed" : "Choose a state first"}</option>
                  {stateArea?.cities.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value={OTHER}>Not listed</option>
                </select>
              </Field>
            </div>
          ) : null}
        </section>
      ) : (
        areaHidden
      )}

      {/* -------- Step 3: contact -------- */}
      {!compact ? (
        <section hidden={step !== 2} aria-labelledby={`${uid}-h2`}>
          <h3 id={`${uid}-h2`} ref={step === 2 ? headingRef : undefined} tabIndex={-1} className="mb-4 text-xl font-bold outline-none">
            {stepTitles[2]}
          </h3>
          <div className="grid gap-5 @lg:grid-cols-2">
            <Field id={id("name")} label="Full name" required error={errors.name} valid={valid.name}>
              <input id={id("name")} name="name" autoComplete="name" maxLength={LIMITS.name} {...aria("name", errors, id)} className={control} />
            </Field>
            <Field id={id("phone")} label="Phone" required error={errors.phone} valid={valid.phone}>
              <input
                id={id("phone")}
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(555) 555-0100"
                value={phoneValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneValue(formatPhone(e.target.value))}
                {...aria("phone", errors, id)}
                className={control}
              />
            </Field>
            <Field id={id("email")} label="Email (optional)" error={errors.email} valid={valid.email}>
              <input id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} {...aria("email", errors, id)} className={control} />
            </Field>
            {!emergency ? (
              <Field id={id("preferredDate")} label="Preferred date (optional)" error={errors.preferredDate} valid={valid.preferredDate}>
                <input id={id("preferredDate")} name="preferredDate" type="date" {...aria("preferredDate", errors, id)} className={control} />
              </Field>
            ) : null}
          </div>
          <fieldset className="mt-5">
            <legend className="mb-2 text-sm font-semibold">Preferred time (optional)</legend>
            <div className="flex flex-wrap gap-2">
              {preferredTimes.map((t) => (
                <label
                  key={t}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 font-medium transition-colors has-checked:border-primary has-checked:bg-primary has-checked:text-on-primary has-focus-visible:ring-2 has-focus-visible:ring-primary/40"
                >
                  <input type="radio" name="preferredTime" value={t} checked={time === t} onChange={() => setTime(t)} className="sr-only" />
                  {preferredTimeLabels[t]}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-5">
            <Field id={id("message")} label="Tell us what is going on (optional)" error={errors.message} valid={valid.message}>
              <textarea id={id("message")} name="message" rows={4} maxLength={LIMITS.message} defaultValue={defaultMessage} {...aria("message", errors, id)} className={`${control} h-auto py-3`} />
            </Field>
          </div>
        </section>
      ) : null}

      {/* Compact keeps message prefill (problem picker) without showing a textarea. */}
      {simple ? (
        <div className="mt-5">
          <Field id={id("message")} label="Tell us what is going on (optional)" error={errors.message} valid={valid.message}>
            <textarea id={id("message")} name="message" rows={4} maxLength={LIMITS.message} defaultValue={defaultMessage} {...aria("message", errors, id)} className={`${control} h-auto py-3`} />
          </Field>
        </div>
      ) : compact ? (
        <input type="hidden" name="message" value={defaultMessage ?? ""} />
      ) : null}

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {/* SMS consent: optional, unchecked by default, never required to submit. */}
      <div hidden={!showStep(2)} className="mt-6 rounded-brand-sm border border-line bg-surface-alt p-4">
        <label htmlFor={id("smsConsent")} className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input id={id("smsConsent")} name="smsConsent" type="checkbox" className="mt-1 size-5 shrink-0 accent-[var(--brand-primary)]" />
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
        <div hidden={!showStep(2)}>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
          <div className="cf-turnstile mt-5" data-sitekey={turnstileSiteKey} />
        </div>
      ) : null}

      {!compact && step === 2 ? (
        <dl className="mt-6 grid gap-3 rounded-brand-sm border border-line p-4 text-sm @lg:grid-cols-3">
          <div>
            <dt className="text-muted">Service</dt>
            <dd className="font-semibold">{serviceLabel || "-"}</dd>
          </div>
          <div>
            <dt className="text-muted">Urgency</dt>
            <dd className="font-semibold">{urgencyLabel ? urgencyLabels[urgencyLabel] : "-"}</dd>
          </div>
          <div>
            <dt className="text-muted">Location</dt>
            <dd className="font-semibold">{[locationText, zip].filter(Boolean).join(" · ") || "-"}</dd>
          </div>
        </dl>
      ) : null}

      {/* Actions: sticky at the bottom of the card on phones (above the sticky call bar). */}
      <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-10 -mx-6 mt-6 border-t border-line bg-surface px-6 pt-4 pb-1 sm:-mx-8 sm:px-8 md:static md:border-0 md:px-0 md:pt-0">
        <div className="flex gap-3">
          {!compact && step > 0 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-btn border-2 border-line px-5 font-semibold hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </button>
          ) : null}
          {!compact && step < 2 ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-btn bg-primary px-7 text-base font-bold text-on-primary transition-colors hover:bg-primary-dark"
            >
              Next
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-btn bg-accent px-7 text-base font-bold text-on-accent transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
              {submitting ? "Sending..." : emergency ? "Send emergency request" : "Send request"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-1 text-center text-sm text-muted">
        {privacy ? (
          <p className="inline-flex items-center gap-1.5">
            <Lock className="size-3.5" aria-hidden="true" />
            <Link href={privacy.href} className="underline underline-offset-2 hover:text-primary">
              {privacy.text}
            </Link>
          </p>
        ) : null}
        <p>
          Prefer to talk?{" "}
          <a href={`tel:${phone.tel}`} onClick={callClick} className="font-bold text-primary underline underline-offset-2">
            Call {phone.display}
          </a>
        </p>
      </div>
      <p aria-live="polite" className="sr-only">
        {submitting ? "Sending your request" : !compact ? `Step ${step + 1} of 3: ${stepTitles[step]}` : ""}
      </p>
    </form>
  );
}

const isLeadField = (name: string): name is LeadField => Object.hasOwn(leadSchema.shape, name);

function aria(field: LeadField, errors: FieldErrors, id: (f: string) => string) {
  return errors[field]
    ? { "aria-invalid": true as const, "aria-describedby": `${id(field)}-error` }
    : { "aria-invalid": undefined, "aria-describedby": undefined };
}

function Req() {
  return (
    <>
      <span aria-hidden="true" className="text-accent-dark">
        *
      </span>
      <span className="sr-only">(required)</span>
    </>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  return (
    <p id={id} aria-live="polite" className={error ? "mt-1.5 flex items-center gap-1.5 text-sm font-medium text-accent-dark" : "sr-only"}>
      {error ? (
        <>
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </>
      ) : null}
    </p>
  );
}

function Field({
  id,
  label,
  required = false,
  error,
  valid,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  valid?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between gap-2 text-sm font-semibold">
        <span>
          {label} {required ? <Req /> : null}
        </span>
        {valid && !error ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
            <Check className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Valid</span>
          </span>
        ) : null}
      </label>
      {children}
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  );
}

