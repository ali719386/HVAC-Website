import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Phone as PhoneIcon } from "lucide-react";
import type { Phone } from "@/lib/brand/schema";

type Variant = "primary" | "accent" | "outline" | "light" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-dark",
  accent: "bg-accent text-on-accent hover:bg-accent-dark",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-on-primary",
  light: "bg-surface text-primary hover:bg-surface-alt",
  /** Inherits the surrounding text color; use on dark or accent backgrounds. */
  ghost: "border-2 border-current text-current hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return [
    "inline-flex items-center justify-center gap-2 rounded-btn font-semibold whitespace-nowrap",
    // Press feedback: a slight scale (transform only, no layout). Off with reduced motion.
    "transition-[color,background-color,border-color,scale] duration-200 active:scale-[0.98] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    extra,
  ].join(" ");
}

type LinkButtonProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function LinkButton({ variant, size, className = "", ...rest }: LinkButtonProps) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />;
}

/** Click-to-call link. Always uses the E.164 tel: value from brand config. */
export function CallButton({
  phone,
  variant = "accent",
  size = "md",
  className = "",
  label,
}: {
  phone: Phone;
  variant?: Variant;
  size?: Size;
  className?: string;
  label?: ReactNode;
}) {
  return (
    <a href={`tel:${phone.tel}`} className={buttonClass(variant, size, className)}>
      <PhoneIcon className="size-4" aria-hidden="true" />
      {label ?? <span>{phone.display}</span>}
    </a>
  );
}
