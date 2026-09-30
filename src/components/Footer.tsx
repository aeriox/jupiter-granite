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
              Granite, marble, quartz and semi-precious gem stones. Jupiter - Palm Beach - South
              Florida. We guarantee all of our work for life!
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
              <p><a href={site.phoneHref} className="inline-block hover:text-ondark max-md:py-2">{site.phone}</a><br /><span className="text-xs">{site.phoneLabel}</span></p>
              <p><a href={`mailto:${site.email}`} className="inline-block hover:text-ondark max-md:py-2">{site.email}</a></p>
              <p>{site.hours}</p>
              <p><a href={site.facebook} target="_blank" rel="noopener noreferrer" className="inline-block hover:text-ondark max-md:py-2">Facebook</a></p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-ondarkmuted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Jupiter Granite Co. All rights reserved. · Palm Beach County Contractor License # {site.license}</p>
          <p>
            Jupiter - Palm Beach - South Florida
            <span aria-hidden="true"> · </span>
            <a href="#buy-panel" data-buy-open aria-haspopup="dialog" aria-controls="buy-panel" className="inline-block hover:text-ondark max-md:py-2">Buy this site</a>
          </p>
        </div>
      </Shell>
    </footer>
  );
}
