"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type GalleryImage = { src: string; alt: string; caption: string };

/**
 * Thumbnail grid + lightbox. Uses a native modal <dialog>: the rest of the page becomes inert (focus
 * stays inside), Esc closes, and focus returns to the thumbnail that opened it. Arrow keys and
 * horizontal swipes move between photos. Only pass images whose files exist.
 */
export function Gallery({
  images,
  labels,
}: {
  images: GalleryImage[];
  labels: { open: string; close: string; prev: string; next: string };
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const swipeX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const current = images[index];
  const n = images.length;

  function open(i: number, button: HTMLButtonElement) {
    openerRef.current = button;
    setIndex(i);
    dialogRef.current?.showModal();
  }
  const close = () => dialogRef.current?.close();
  const go = (step: number) => setIndex((i) => (i + step + n) % n);

  function onKey(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else return;
    e.preventDefault();
  }
  const onPointerDown = (e: PointerEvent) => {
    swipeX.current = e.pointerType === "mouse" ? null : e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const navBtn =
    "grid size-12 place-items-center rounded-full bg-surface/90 text-primary shadow-brand-md transition-colors hover:bg-surface";

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.src} className={i === 0 && n > 2 ? "col-span-2 row-span-2" : ""}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group relative block aspect-[4/3] size-full overflow-hidden rounded-brand-sm bg-surface-alt"
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes={i === 0 && n > 2 ? "(min-width: 1024px) 520px, 66vw" : "(min-width: 1024px) 260px, 50vw"}
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
              />
              <span className="sr-only">
                {labels.open}: {img.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onKeyDown={onKey}
        onClose={() => openerRef.current?.focus()}
        aria-label={current?.caption || current?.alt}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-surface-dark/90"
      >
        {current ? (
          <figure
            className="relative grid w-[min(92vw,68rem)] touch-pan-y gap-3"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-brand bg-surface-dark sm:aspect-[16/10]">
              <Image src={current.src} alt={current.alt} fill sizes="92vw" className="object-contain" />
            </div>
            <figcaption className="flex items-center justify-between gap-4 text-on-primary">
              <span className="font-medium">{current.caption}</span>
              <span className="shrink-0 text-sm text-on-primary/75" aria-hidden="true">
                {index + 1} / {n}
              </span>
            </figcaption>
            <button type="button" onClick={close} className={`${navBtn} absolute top-3 right-3`} autoFocus>
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">{labels.close}</span>
            </button>
            {n > 1 ? (
              <>
                <button type="button" onClick={() => go(-1)} className={`${navBtn} absolute top-1/2 left-3 -translate-y-1/2`}>
                  <ChevronLeft className="size-5" aria-hidden="true" />
                  <span className="sr-only">{labels.prev}</span>
                </button>
                <button type="button" onClick={() => go(1)} className={`${navBtn} absolute top-1/2 right-3 -translate-y-1/2`}>
                  <ChevronRight className="size-5" aria-hidden="true" />
                  <span className="sr-only">{labels.next}</span>
                </button>
              </>
            ) : null}
          </figure>
        ) : null}
      </dialog>
    </>
  );
}
