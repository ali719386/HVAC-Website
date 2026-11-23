"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { observe } from "./observer";

export type RevealVariant = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "zoom-in" | "mask-up";
type Tag = "div" | "section" | "article" | "aside" | "header" | "footer" | "ul" | "ol" | "li" | "dl" | "figure" | "span";

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  /** Extra delay before the transition starts, in ms. */
  delay?: number;
  /** Reveal once (default) or toggle every time the element enters/leaves. */
  once?: boolean;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
  id?: string;
  role?: string;
  tabIndex?: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function useRevealRef(once: boolean) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(el, (visible) => el.classList.toggle("is-visible", visible), once);
  }, [once]);
  return ref;
}

/**
 * Reveals its content when scrolled into view. Hidden styles apply only when JS is running
 * (html.js) and the brand has motion enabled; otherwise content is always visible.
 */
export function Reveal({ children, variant = "fade-up", delay = 0, once = true, as = "div", className = "", style, ...rest }: RevealProps) {
  const ref = useRevealRef(once);
  return createElement(
    as,
    {
      ref,
      className: `reveal ${className}`,
      "data-reveal": variant,
      style: delay ? { ...style, "--reveal-delay": `${delay}ms` } : style,
      ...rest,
    },
    children,
  );
}

/**
 * Reveals its direct children one after another (stagger from the brand's motion.staggerMs,
 * or the `stagger` prop). Use it as the list element itself, e.g. as="ul" around <li> cards.
 */
export function RevealGroup({
  stagger,
  variant = "fade-up",
  delay = 0,
  once = true,
  as = "div",
  className = "",
  style,
  children,
  ...rest
}: RevealProps & { stagger?: number }) {
  const ref = useRevealRef(once);
  const vars: CSSProperties = { ...style };
  if (delay) vars["--reveal-delay"] = `${delay}ms`;
  if (stagger !== undefined) vars["--reveal-stagger"] = `${stagger}ms`;
  return createElement(
    as,
    { ref, className: `reveal-group ${className}`, "data-reveal": variant, style: vars, ...rest },
    children,
  );
}
