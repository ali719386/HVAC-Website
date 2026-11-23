import type { ReactNode } from "react";

type Tone = "light" | "alt" | "dark" | "primary";

const tones: Record<Tone, string> = {
  light: "bg-surface text-ink",
  alt: "bg-surface-alt text-ink",
  dark: "bg-surface-dark text-on-primary",
  primary: "bg-primary text-on-primary",
};

export function Section({
  id,
  tone = "light",
  className = "",
  labelledBy,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`section-y ${tones[tone]} ${className}`}>
      <div className="container-site">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
  onDark = false,
  as: Tag = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  onDark?: boolean;
  as?: "h1" | "h2";
}) {
  const center = align === "center";
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p
          className={`mb-3 inline-flex items-center gap-2 text-sm font-bold tracking-[0.14em] uppercase ${
            onDark ? "text-on-primary/80" : "text-accent"
          }`}
        >
          <span aria-hidden="true" className={`h-0.5 w-6 ${onDark ? "bg-on-primary/60" : "bg-accent"}`} />
          {eyebrow}
        </p>
      ) : null}
      <Tag id={id} className="text-3xl leading-tight font-extrabold sm:text-4xl lg:text-[2.75rem]">
        {title}
      </Tag>
      {intro ? (
        <p className={`mt-4 text-lg leading-relaxed ${onDark ? "text-on-primary/85" : "text-muted"}`}>{intro}</p>
      ) : null}
    </div>
  );
}
