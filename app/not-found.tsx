import type { Metadata } from "next";
import Link from "next/link";
import { getBrand } from "@/lib/brand";
import { CallButton, LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  const { config, content } = getBrand();
  return (
    <section className="container-site section-y text-center">
      <p className="font-heading text-7xl font-extrabold text-primary sm:text-8xl">404</p>
      <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">We couldn&apos;t find that page</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
        The page may have moved. Try one of the links below, or call us if you need help right away.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <LinkButton href="/" variant="primary" size="lg">
          Back to home
        </LinkButton>
        <CallButton phone={config.company.phone} variant="accent" size="lg" />
      </div>
      <nav aria-label="Popular pages" className="mt-12">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 font-semibold text-primary">
          {content.services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="underline-offset-4 hover:underline">
                {s.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/contact" className="underline-offset-4 hover:underline">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
