import Link from "next/link";
import Image from "next/image";
import { assetExists } from "./brand-image";

/** Logo file when present, otherwise a token-colored wordmark built from the company name. */
export function Logo({
  name,
  src,
  onDark = false,
}: {
  name: string;
  src: string | undefined;
  onDark?: boolean;
}) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2.5" aria-label={`${name}, home`}>
      {assetExists(src) ? (
        <Image src={src} alt="" width={180} height={48} className="h-10 w-auto sm:h-12" preload />
      ) : (
        <>
          <span
            aria-hidden="true"
            className={`grid size-10 place-items-center rounded-brand-sm font-heading text-xl font-extrabold ${
              onDark ? "bg-on-primary text-primary" : "bg-primary text-on-primary"
            }`}
          >
            {initial}
          </span>
          <span
            className={`max-w-[11rem] font-heading text-lg leading-tight font-extrabold sm:max-w-none ${
              onDark ? "text-on-primary" : "text-primary"
            }`}
          >
            {name}
          </span>
        </>
      )}
    </Link>
  );
}
