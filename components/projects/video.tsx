"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Click-to-load video. Nothing from the video host loads (no iframe, no script) until the visitor
 * presses play. No autoplay before that click.
 */
export function VideoEmbed({ url, title, poster, playLabel }: { url: string; title: string; poster?: string; playLabel: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-brand bg-surface-dark">
      {on ? (
        <iframe
          src={url}
          title={title}
          className="absolute inset-0 size-full"
          allow="encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 grid place-items-center">
          {poster ? <Image src={poster} alt="" fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover opacity-70" /> : null}
          <span className="relative grid size-20 place-items-center rounded-full bg-accent text-on-accent shadow-brand-lg transition-transform group-hover:scale-105">
            <Play className="size-8 translate-x-0.5" aria-hidden="true" />
          </span>
          <span className="sr-only">
            {playLabel}: {title}
          </span>
        </button>
      )}
    </div>
  );
}
