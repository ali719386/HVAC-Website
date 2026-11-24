"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CalendarCheck, Phone as PhoneIcon, RotateCw, Send, X } from "lucide-react";
import type { Copy, Phone } from "@/lib/brand/schema";
import type { ChatData, ChatLink } from "@/lib/chatbot";
import { matchQuestion, searchDocs } from "@/lib/chat-match";
import { track } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { whatsappHref, type WhatsAppConfig } from "./whatsapp";

type Msg = { role: "bot" | "user"; text: string; links?: ChatLink[]; handoff?: boolean };

/** Fired by other launchers (e.g. the mobile sticky bar) to open the assistant. */
export const CHAT_OPEN_EVENT = "chatbot:open";

const STORAGE_KEY = "site-assistant";
/** Quick-reply id for "Talk to a person" (call, WhatsApp and book buttons). */
const HANDOFF = "__handoff";

/**
 * Website assistant: answers only from this site's content (see lib/chatbot.ts), entirely in the
 * browser. Desktop launcher is a pill with the assistant and WhatsApp; phones open it from the sticky bar.
 */
export function Chatbot({
  quick: quickItems,
  name,
  avatar,
  copy,
  phone,
  whatsapp,
  bookLabel,
}: {
  /** Quick questions (small, rendered with the page). The full knowledge loads on first open. */
  quick: ChatData["quick"];
  name: string;
  avatar?: string;
  /** {company} already filled in. */
  copy: Copy["chatbot"];
  phone: Phone;
  whatsapp?: WhatsAppConfig;
  bookLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [spin, setSpin] = useState(0);
  const replyTimer = useRef<number | undefined>(undefined);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const welcome: Msg = { role: "bot", text: copy.welcome };
  // Knowledge base (/assistant.json), fetched once when the chat first opens.
  const kbRef = useRef<Promise<ChatData | null> | null>(null);
  const loadKb = () => {
    kbRef.current ??= fetch("/assistant.json")
      .then((r) => (r.ok ? (r.json() as Promise<ChatData>) : null))
      .catch(() => null);
    return kbRef.current;
  };

  // Restore this tab's conversation (per-visitor convenience only; never sent anywhere).
  function restore(): Msg[] {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as Msg[];
    } catch {
      /* storage blocked: start fresh */
    }
    return [welcome];
  }

  function persist(next: Msg[]) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(-40)));
    } catch {
      /* storage blocked: keep in memory only */
    }
  }

  function openChat() {
    void loadKb();
    setMessages((m) => (m.length > 0 ? m : restore()));
    setOpen(true);
    track("chat_open");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeChat() {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }

  // Other launchers (mobile sticky bar) open the panel through a window event.
  useEffect(() => {
    const onOpen = () => openChat();
    window.addEventListener(CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, onOpen);
  });

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, typing]);

  async function answer(question: string, entryId?: string) {
    const withUser = [...messages, { role: "user" as const, text: question }];
    setMessages(withUser);
    setTyping(true);
    const kb = await loadKb();
    const bot = reply(kb, question, entryId);
    // Short pause so the reply reads as a reply (not an animation; fine with reduced motion).
    window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      setTyping(false);
      const next = [...withUser, bot];
      setMessages(next);
      persist(next);
    }, 350);
  }

  /** Topic match first, then ZIP lookup, then a search over every site passage, then the fallback. */
  function reply(kb: ChatData | null, question: string, entryId?: string): Msg {
    if (entryId === HANDOFF) return { role: "bot", text: copy.handoffReply, handoff: true };
    if (!kb) return { role: "bot", text: copy.fallback, handoff: true };
    // A 5-digit number is treated as a ZIP code and checked against the configured list.
    const zip = !entryId ? question.match(/\b(\d{5})\b/)?.[1] : undefined;
    if (zip) {
      const hit = kb.zips[zip];
      track("chat_question", { matched: Boolean(hit), topic: "zip" });
      return hit
        ? { role: "bot", text: `Yes, ${zip} is in our service area (${hit.label}).`, links: [{ label: hit.label, href: hit.href }] }
        : { role: "bot", text: `I could not find ${zip} in our ZIP list. Check your city on the service areas page, or ask our team.`, links: [{ label: "Service areas", href: "/service-areas" }], handoff: true };
    }
    const entry = entryId ? kb.entries.find((e) => e.id === entryId) : matchQuestion(kb.entries, question);
    if (entry) {
      track("chat_question", { matched: true, topic: entry.id });
      return { role: "bot", text: entry.answer, links: entry.links, handoff: entry.handoff };
    }
    // Search fallback: the closest passage from the site, shown exactly as written there.
    const doc = searchDocs(kb.docs, question);
    if (doc) {
      track("chat_question", { matched: true, topic: "search" });
      return { role: "bot", text: doc.text, links: [{ label: `More: ${doc.title}`, href: doc.href }] };
    }
    track("chat_question", { matched: false, topic: "none" });
    return { role: "bot", text: copy.fallback, handoff: true };
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim().slice(0, 300);
    if (!q || typing) return;
    setInput("");
    void answer(q);
  }

  /** Refresh: clears this conversation (also from storage) and starts again with the welcome message. */
  function reset() {
    setSpin((n) => n + 1);
    window.clearTimeout(replyTimer.current);
    setTyping(false);
    setInput("");
    const fresh = [welcome];
    setMessages(fresh);
    persist(fresh);
    inputRef.current?.focus();
  }

  const handoff = (
    <div className="mt-3 flex flex-wrap gap-2">
      <a href={`tel:${phone.tel}`} onClick={() => track("click_to_call", { source: "chatbot" })} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-3 text-sm font-semibold text-on-primary">
        <PhoneIcon className="size-3.5" aria-hidden="true" />
        {phone.display}
      </a>
      {whatsapp ? (
        <a
          href={whatsappHref(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("click_to_whatsapp", { source: "chatbot" })}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#0d7468] px-3 text-sm font-semibold text-white"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp
        </a>
      ) : null}
      <Link href="/book" onClick={() => setOpen(false)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-3 text-sm font-semibold text-on-accent">
        <CalendarCheck className="size-3.5" aria-hidden="true" />
        {bookLabel}
      </Link>
    </div>
  );

  // Question shortcuts plus Talk to a person, shown once under the welcome message.
  const quick = (
    <div className="flex flex-wrap gap-2">
      {[...quickItems, { id: HANDOFF, label: copy.handoff }].map((q) => (
        <button
          key={q.id}
          type="button"
          disabled={typing}
          onClick={() => void answer(q.label, q.id)}
          className={`min-h-10 rounded-full border px-4 py-1.5 text-left text-sm font-medium transition-colors disabled:opacity-50 ${
            q.id === HANDOFF
              ? "border-accent/40 bg-surface text-accent-dark hover:bg-accent/8"
              : "border-primary/40 bg-surface text-primary hover:border-primary hover:bg-primary/5"
          }`}
        >
          {q.label}
        </button>
      ))}
    </div>
  );

  const avatarEl = (size: string) =>
    avatar ? (
      <Image src={avatar} alt="" width={64} height={64} className={`${size} shrink-0 rounded-full`} />
    ) : (
      <span aria-hidden="true" className={`${size} grid shrink-0 place-items-center rounded-full bg-primary font-bold text-on-primary`}>
        {name.charAt(0)}
      </span>
    );

  return (
    <>
      {/* Desktop launcher pill: assistant + WhatsApp. Phones use the sticky call bar instead. */}
      {!open ? (
        <div className="fixed right-6 bottom-6 z-30 hidden items-center gap-2 rounded-full bg-surface p-2 shadow-brand-lg ring-1 ring-line md:flex">
          <button
            ref={launcherRef}
            type="button"
            onClick={openChat}
            aria-haspopup="dialog"
            aria-controls={`${uid}-panel`}
            className="launcher-pulse grid size-14 place-items-center rounded-full shadow-brand-sm transition-[scale,translate,box-shadow] duration-200 [--ring:var(--brand-primary)] hover:-translate-y-1 hover:scale-110 hover:shadow-brand-lg focus-visible:ring-4 focus-visible:ring-primary/30 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
          >
            <span className="launcher-wiggle grid place-items-center">{avatarEl("size-14")}</span>
            <span className="sr-only">{copy.launcher}</span>
          </button>
          {whatsapp ? (
            <a
              href={whatsappHref(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("click_to_whatsapp", { source: "float" })}
              className="launcher-pulse grid size-14 place-items-center rounded-full bg-[#0d7468] text-white shadow-brand-sm transition-[scale,translate,background-color,box-shadow] duration-200 [--ring:#0d7468] hover:-translate-y-1 hover:scale-110 hover:bg-[#0a5f55] hover:shadow-brand-lg focus-visible:ring-4 focus-visible:ring-[#0d7468]/40 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
            >
              <WhatsAppIcon className="launcher-wiggle-late size-8" />
              <span className="sr-only">{whatsapp.label} (opens WhatsApp in a new tab)</span>
            </a>
          ) : null}
        </div>
      ) : null}

      {open ? (
        <div
          id={`${uid}-panel`}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${uid}-title`}
          onKeyDown={(e) => e.key === "Escape" && closeChat()}
          className="fixed inset-0 z-50 flex flex-col bg-surface shadow-brand-lg md:inset-auto md:right-6 md:bottom-6 md:h-[min(37rem,calc(100dvh-3rem))] md:w-[24rem] md:overflow-hidden md:rounded-[1.25rem] md:ring-1 md:ring-line"
        >
          {/* Header: light brand tint, avatar, name, subtitle, refresh and close. */}
          <header className="flex items-center gap-3 border-b border-line bg-linear-to-b from-primary/12 to-primary/4 px-4 py-3.5">
            <span className="rounded-full bg-surface p-0.5 shadow-brand-sm ring-2 ring-primary/20">{avatarEl("size-11")}</span>
            <div className="min-w-0 flex-1">
              <p id={`${uid}-title`} className="truncate font-heading text-lg leading-tight font-bold text-ink">
                {name}
              </p>
              <p className="truncate text-sm text-muted">{copy.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={reset}
              title={copy.reset}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-surface text-ink shadow-brand-sm transition-colors hover:text-primary"
            >
              {/* key changes on every refresh, so the icon spins once (no spin with reduced motion). */}
              <RotateCw key={spin} className={`size-4.5 ${spin > 0 ? "animate-[spin_0.5s_ease-out_1]" : ""} motion-reduce:animate-none`} aria-hidden="true" />
              <span className="sr-only">{copy.reset}</span>
            </button>
            <button type="button" onClick={closeChat} className="grid size-10 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-surface hover:text-primary">
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">{copy.close}</span>
            </button>
          </header>

          <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-surface px-4 py-4">
            {messages.map((m, i) => (
              <Fragment key={i}>
                <div className={m.role === "user" ? "flex justify-end" : "flex"}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed ${
                      m.role === "user" ? "rounded-br-md bg-primary text-on-primary" : "rounded-bl-md border border-primary/15 bg-primary/6 text-ink"
                    }`}
                  >
                    <span className="sr-only">{m.role === "user" ? "You: " : `${name}: `}</span>
                    {m.text}
                    {m.links && m.links.length > 0 ? (
                      <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {m.links.map((l) =>
                          l.href.startsWith("/") ? (
                            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-semibold text-primary underline underline-offset-2">
                              {l.label}
                            </Link>
                          ) : (
                            <a key={l.href} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm font-semibold text-primary underline underline-offset-2">
                              {l.label}
                            </a>
                          ),
                        )}
                      </span>
                    ) : null}
                    {m.handoff ? handoff : null}
                  </div>
                </div>
                {i === 0 ? quick : null}
              </Fragment>
            ))}
            {typing ? (
              <div className="flex" aria-label="Typing">
                <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-primary/15 bg-primary/6 px-4 py-3.5">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-1.5 animate-bounce rounded-full bg-primary/50 motion-reduce:animate-none" style={{ animationDelay: `${d * 120}ms` }} />
                  ))}
                </span>
              </div>
            ) : null}
          </div>

          <form onSubmit={onSubmit} className="border-t border-line bg-surface px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-2">
              <label htmlFor={`${uid}-q`} className="sr-only">
                {copy.placeholder}
              </label>
              <input
                ref={inputRef}
                id={`${uid}-q`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={300}
                autoComplete="off"
                placeholder={copy.placeholder}
                className="h-12 min-w-0 flex-1 rounded-full border border-primary/20 bg-primary/5 px-5 text-base outline-none transition-[border-color,box-shadow] placeholder:text-muted focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand-primary)_15%,transparent)]"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-on-primary transition-colors hover:bg-primary-dark disabled:bg-primary/35"
              >
                <Send className="size-5" aria-hidden="true" />
                <span className="sr-only">{copy.send}</span>
              </button>
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <p className="text-xs leading-snug text-muted">{copy.disclaimer}</p>
              {whatsapp ? (
                <a
                  href={whatsappHref(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("click_to_whatsapp", { source: "chatbot_footer" })}
                  className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#0d7468] hover:underline"
                >
                  <WhatsAppIcon className="size-4.5" />
                  {whatsapp.label}
                  <span className="sr-only"> (opens WhatsApp in a new tab)</span>
                </a>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

/** Opens the assistant from anywhere (e.g. the mobile sticky bar). */
export function ChatOpenButton({ label, avatar, className }: { label: string; avatar?: string; className: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(CHAT_OPEN_EVENT))} className={className}>
      {avatar ? <Image src={avatar} alt="" width={40} height={40} className="launcher-wiggle size-8 rounded-full" /> : null}
      <span className="sr-only">{label}</span>
    </button>
  );
}