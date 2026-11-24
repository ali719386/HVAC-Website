"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CalendarCheck, Phone as PhoneIcon, RotateCw, Send, X } from "lucide-react";
import type { Copy, Phone } from "@/lib/brand/schema";
import type { ChatData, ChatLink } from "@/lib/chatbot";
import { matchQuestion } from "@/lib/chat-match";
import { track } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { whatsappHref, type WhatsAppConfig } from "./whatsapp";

type Msg = { role: "bot" | "user"; text: string; links?: ChatLink[]; handoff?: boolean };

/** Fired by other launchers (e.g. the mobile sticky bar) to open the assistant. */
export const CHAT_OPEN_EVENT = "chatbot:open";

const STORAGE_KEY = "site-assistant";

/**
 * Website assistant: answers only from this site's content (see lib/chatbot.ts), entirely in the
 * browser. Desktop launcher is a pill with the assistant and WhatsApp; phones open it from the sticky bar.
 */
export function Chatbot({
  data,
  name,
  avatar,
  copy,
  phone,
  whatsapp,
  bookLabel,
}: {
  data: ChatData;
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

  function answer(question: string, entryId?: string) {
    const entry = entryId ? data.entries.find((e) => e.id === entryId) : matchQuestion(data.entries, question);
    const user: Msg = { role: "user", text: question };
    const bot: Msg = entry ? { role: "bot", text: entry.answer, links: entry.links } : { role: "bot", text: copy.fallback, handoff: true };
    const withUser = [...messages, user];
    setMessages(withUser);
    setTyping(true);
    track("chat_question", { matched: Boolean(entry), topic: entry?.id ?? "none" });
    // Short pause so the reply reads as a reply (not an animation; fine with reduced motion).
    window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      setTyping(false);
      const next = [...withUser, bot];
      setMessages(next);
      persist(next);
    }, 450);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim().slice(0, 300);
    if (!q || typing) return;
    setInput("");
    answer(q);
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
          className="fixed inset-0 z-50 flex flex-col bg-surface shadow-brand-lg md:inset-auto md:right-6 md:bottom-6 md:h-[min(36rem,calc(100dvh-3rem))] md:w-[23rem] md:overflow-hidden md:rounded-brand md:ring-1 md:ring-line"
        >
          <header className="flex items-center gap-3 bg-primary px-4 py-3 text-on-primary">
            {avatarEl("size-10")}
            <div className="min-w-0 flex-1">
              <p id={`${uid}-title`} className="truncate font-heading font-bold">
                {name}
              </p>
              <p className="truncate text-xs text-on-primary/80">{copy.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={reset}
              title={copy.reset}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-on-primary/30 px-3 text-sm font-semibold transition-colors hover:bg-on-primary/10"
            >
              {/* key changes on every refresh, so the icon spins once (no spin with reduced motion). */}
              <RotateCw key={spin} className={`size-4 ${spin > 0 ? "animate-[spin_0.5s_ease-out_1]" : ""} motion-reduce:animate-none`} aria-hidden="true" />
              {copy.reset}
            </button>
            <button type="button" onClick={closeChat} className="grid size-11 place-items-center rounded-full hover:bg-on-primary/10">
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">{copy.close}</span>
            </button>
          </header>

          <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-surface-alt px-4 py-4">
            {messages.map((m, i) => (
              <Fragment key={i}>
              <div className={m.role === "user" ? "flex justify-end" : "flex gap-2"}>
                {m.role === "bot" ? avatarEl("size-7") : null}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.95rem] leading-relaxed ${
                    m.role === "user" ? "rounded-br-sm bg-primary text-on-primary" : "rounded-tl-sm bg-surface text-ink shadow-brand-sm"
                  }`}
                >
                  <span className="sr-only">{m.role === "user" ? "You: " : `${name}: `}</span>
                  {m.text}
                  {m.links && m.links.length > 0 ? (
                    <span className="mt-2 flex flex-wrap gap-2">
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
              </Fragment>
            ))}
            {typing ? (
              <div className="flex gap-2" aria-label="Typing">
                {avatarEl("size-7")}
                <span className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface px-3.5 py-3 shadow-brand-sm">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted motion-reduce:animate-none" style={{ animationDelay: `${d * 120}ms` }} />
                  ))}
                </span>
              </div>
            ) : null}

          </div>

          <form onSubmit={onSubmit} className="border-t border-line bg-surface p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex gap-2">
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
                className="h-11 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <button type="submit" disabled={!input.trim() || typing} className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-on-accent disabled:opacity-50">
                <Send className="size-4" aria-hidden="true" />
                <span className="sr-only">{copy.send}</span>
              </button>
            </div>
            <p className="mt-2 text-center text-[0.7rem] leading-snug text-muted">{copy.disclaimer}</p>
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