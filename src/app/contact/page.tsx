import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { Shell, Eyebrow, CTA } from "@/components/ui";
import { site, estimateSteps } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Estimate",
  description:
    "Request a free estimate from Jupiter Granite Co. Visit the showroom at 952 Jupiter Park Lane, Jupiter, FL, or send your project details. Call (561) 352-6232.",
};

export default function Contact() {
  return (
    <main>
      <Nav />

      {/* HEADER */}
      <section className="bg-bg pt-32 pb-[var(--section-y)]">
        <Shell>
          <Reveal className="max-w-3xl">
            <Eyebrow>Want an estimate?</Eyebrow>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98]">
              Let&apos;s talk <span className="font-display-italic text-accent">stone.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Estimates are free. Share a little about your project and we&apos;ll get right back to
              you — or call the showroom and book an unhurried, one-on-one appointment.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* FORM */}
            <div id="estimate" className="scroll-mt-28">
              <Reveal>
                <ContactForm />
              </Reveal>
            </div>

            {/* SIDEBAR */}
            <Reveal delay={120} className="flex flex-col gap-6">
              <div className="rounded-[var(--radius)] border border-line bg-surface p-7">
                <div className="eyebrow text-accent">What we need for an estimate</div>
                <ol className="mt-4 space-y-3">
                  {estimateSteps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="font-display text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[var(--radius-sm)] border border-line bg-surface p-5">
                  <div className="eyebrow text-faint">Call</div>
                  <a href={site.phoneHref} className="mt-2 block font-display text-xl hover:text-accent">{site.phone}</a>
                  <p className="mt-1 text-xs text-faint">Fax {site.fax}</p>
                </div>
                <div className="rounded-[var(--radius-sm)] border border-line bg-surface p-5">
                  <div className="eyebrow text-faint">Email</div>
                  <a href={`mailto:${site.email}`} className="mt-2 block text-sm hover:text-accent">{site.email}</a>
                  <a href={`mailto:${site.ownerEmail}`} className="mt-1 block text-sm text-muted hover:text-accent">{site.ownerEmail}</a>
                </div>
                <div className="rounded-[var(--radius-sm)] border border-line bg-surface p-5">
                  <div className="eyebrow text-faint">Showroom</div>
                  <p className="mt-2 text-sm text-muted">{site.address.street}<br />{site.address.city}, {site.address.state} {site.address.zip}</p>
                </div>
                <div className="rounded-[var(--radius-sm)] border border-line bg-surface p-5">
                  <div className="eyebrow text-faint">Hours</div>
                  <p className="mt-2 text-sm text-muted">{site.hours}</p>
                </div>
              </div>

              <div className="rounded-[var(--radius-sm)] border border-line bg-surface p-5">
                <div className="eyebrow text-faint">Ask for</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {site.contacts.map((c) => (
                    <span key={c.name} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                      {c.name} · {c.role}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Shell>
      </section>

      {/* MAP */}
      <section className="bg-dark py-[var(--section-y)] text-ondark">
        <Shell className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Eyebrow onDark>Find us</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] text-ondark">
              Slab warehouse, showroom &amp; fabrication shop
            </h2>
            <p className="mt-6 max-w-md text-lg text-ondarkmuted">
              All under one roof on Jupiter Park Lane. Stop in by appointment to walk the slabs and
              meet the team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA href={site.mapsUrl} variant="accent" external>Get directions</CTA>
              <CTA href={site.phoneHref} onDark variant="outline" external>Call {site.phone}</CTA>
            </div>
          </Reveal>
          <Reveal delay={120} className="min-h-[22rem]">
            <div className="h-full overflow-hidden rounded-[var(--radius)] border border-white/10 bg-white/5 p-1.5">
              <iframe
                title="Map to Jupiter Granite Co."
                src={site.mapsEmbed}
                className="h-full min-h-[22rem] w-full rounded-[calc(var(--radius)-0.375rem)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </Shell>
      </section>
    </main>
  );
}
