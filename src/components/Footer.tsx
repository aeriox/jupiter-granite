import Link from "next/link";
import { Wordmark } from "./Logo";
import { Shell } from "./ui";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-dark text-ondark">
      <Shell className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark onDark />
            <p className="mt-5 max-w-xs text-sm text-ondarkmuted">
              Third-generation custom stone fabrication on Florida&apos;s Treasure Coast —
              granite, marble, quartz and semi-precious surfaces, guaranteed for life.
            </p>
          </div>

          <div>
            <div className="eyebrow text-accent">Explore</div>
            <ul className="mt-4 space-y-2 text-sm max-md:space-y-0">
              <li><Link href="/" className="inline-block text-ondarkmuted hover:text-ondark max-md:py-2.5">Home</Link></li>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-block text-ondarkmuted hover:text-ondark max-md:py-2.5">{n.label}</Link>
                </li>
              ))}
              <li><Link href="/contact" className="inline-block text-ondarkmuted hover:text-ondark max-md:py-2.5">Contact & estimate</Link></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow text-accent">Visit</div>
            <address className="mt-4 space-y-2 text-sm not-italic text-ondarkmuted">
              <p>{site.address.street}<br />{site.address.city}, {site.address.state} {site.address.zip}</p>
              <p><a href={site.phoneHref} className="inline-block hover:text-ondark max-md:py-2">{site.phone}</a></p>
              <p><a href={`mailto:${site.email}`} className="inline-block hover:text-ondark max-md:py-2">{site.email}</a></p>
              <p>{site.hours}</p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-ondarkmuted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved. · License {site.license}</p>
          <p>Family-owned · Serving Jupiter &amp; all of Palm Beach County</p>
        </div>
      </Shell>
    </footer>
  );
}
