import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { Gallery } from "@/components/Gallery";
import { WaveMark, Wordmark } from "@/components/Logo";
import { site, materials, reviews } from "@/lib/site";

/* ---------- small primitives ---------- */

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-bronze">
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" />
        </svg>
      ))}
    </span>
  );
}

function CTA({
  href,
  children,
  tone = "dark",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "dark" | "light" | "bronze";
}) {
  const base =
    tone === "bronze"
      ? "bg-bronze text-white"
      : tone === "light"
        ? "bg-cream text-ink"
        : "bg-ink text-cream";
  const knob =
    tone === "bronze" ? "bg-white/20" : tone === "light" ? "bg-ink/10" : "bg-white/15";
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full py-3 pl-6 pr-2.5 text-sm font-medium transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${base}`}
    >
      <span>{children}</span>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full ${knob} transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px]`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}

function Eyebrow({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
        tone === "light"
          ? "border-white/15 bg-white/5 text-bronze-soft"
          : "border-ink/10 bg-ink/[0.04] text-bronze"
      }`}
    >
      <span className="h-1 w-1 rounded-full bg-bronze" />
      {children}
    </span>
  );
}

/* ============================================================ */

export default function Home() {
  return (
    <main id="top">
      <Nav />

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-obsidian">
        <Image
          src="/img/hero-waterfront-island.jpg"
          alt="Modern waterfront kitchen with a custom stone island by Jupiter Granite"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/55 to-obsidian/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/70 to-transparent" />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-32 sm:pb-24">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow tone="light">Jupiter · Palm Beach · Treasure Coast</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,6rem)] font-light leading-[0.95] tracking-tight text-cream">
                Natural stone,
                <br />
                <span className="italic text-bronze-soft">mastered.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/75">
                Three generations of craftsmen turning raw granite, quartzite and
                marble into the surfaces your home is built around — fabricated on
                Florida's most advanced stone machinery and guaranteed for life.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <CTA href="#contact" tone="light">
                  Book a showroom visit
                </CTA>
                <a
                  href="#work"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-cream/90 transition-colors duration-300 hover:bg-white/10"
                >
                  See our work
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* floating rating chip */}
        <Reveal
          delay={320}
          className="absolute bottom-8 right-5 hidden rounded-2xl border border-white/10 bg-white/[0.06] p-1.5 backdrop-blur-md lg:block"
        >
          <div className="rounded-[calc(1rem-0.375rem)] bg-obsidian/40 px-5 py-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl text-cream">{site.rating}</span>
              <Stars />
            </div>
            <p className="mt-1 text-xs text-cream/60">{site.reviewCount} Google reviews</p>
          </div>
        </Reveal>
      </section>

      {/* ============ MARQUEE / TRUST ============ */}
      <section className="border-y border-ink/10 bg-ink py-5 text-cream">
        <div className="flex overflow-hidden">
          <div className="marquee flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 text-cream/55">
            {[...Array(2)].map((_, dup) => (
              <span key={dup} className="flex items-center gap-10">
                {[
                  "Granite",
                  "Quartzite",
                  "Marble",
                  "Quartz",
                  "Porcelain",
                  "Onyx & Semi-Precious",
                  "Cambria Authorized Seller",
                  "Lifetime Guarantee",
                  "Women-Owned · Est. 2000",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-10 font-display text-lg italic">
                    {t}
                    <WaveMark className="h-4 w-4" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INTRO STATS ============ */}
      <section className="bg-canvas py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Reveal>
            <Eyebrow>The studio</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-[1.05] tracking-tight">
              A fabrication shop that thinks like an{" "}
              <span className="italic text-ocean-deep">atelier.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-dark">
              Founded in 2000 and led by Jupiter native and third-generation master
              craftsman {site.owner}, Jupiter Granite pairs old-world stoneworking
              instinct with a state-of-the-art facility — including one of the first
              5-axis saw-waterjets in the country. Every job, from a powder-room vanity
              to a waterfront summer kitchen, receives the same obsessive eye.
            </p>
          </Reveal>

          <Reveal delay={120} className="grid grid-cols-2 gap-3">
            {[
              { n: "25+", l: "Years fabricating stone" },
              { n: "4.9★", l: "Across 190 reviews" },
              { n: "5-Axis", l: "Saw-waterjet precision" },
              { n: "Lifetime", l: "Workmanship guarantee" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-[1.5rem] border border-ink/10 bg-cream p-1.5"
              >
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-canvas px-5 py-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
                  <div className="font-display text-3xl text-ink">{s.n}</div>
                  <div className="mt-1 text-sm text-stone-dark">{s.l}</div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============ MATERIALS ============ */}
      <section id="materials" className="scroll-mt-24 bg-canvas pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Materials</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-[1.05] tracking-tight">
                Every stone we shape
              </h2>
            </div>
            <p className="max-w-sm text-stone-dark">
              We stock and fabricate the full spectrum of natural and engineered
              surfaces — and help you choose the right one for how you actually live.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((m, i) => (
              <Reveal key={m.name} delay={(i % 3) * 90}>
                <article className="group relative h-full overflow-hidden rounded-[1.75rem] border border-ink/10 bg-cream">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={m.img}
                      alt={`${m.name} surface`}
                      fill
                      sizes="(max-width:1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.07]"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl text-ink">{m.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-dark">{m.blurb}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SIGNATURE — semi-precious ============ */}
      <section id="signature" className="scroll-mt-24 relative overflow-hidden bg-obsidian py-24 text-cream sm:py-32">
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-ocean-deep/20 blur-[120px] drift" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow tone="light">Signature work</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-[1.05] tracking-tight text-cream">
              Backlit agate &amp; <span className="italic text-ocean">semi-precious</span> stone
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/70">
              It's what people remember. We fabricate illuminated agate, onyx and
              gemstone surfaces into floors, feature walls, bar tops and islands that
              glow from within — singular installations you won't find anywhere else
              on the Treasure Coast.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Backlit slab fabrication & LED integration",
                "Bookmatched agate & onyx feature panels",
                "Marine, fireplace & summer-kitchen applications",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-cream/80">
                  <WaveMark className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="order-1 grid grid-cols-2 gap-3 lg:order-2">
            <div className="relative col-span-2 h-64 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
              <Image src="/img/backlit-agate-island.jpg" alt="Backlit blue agate island" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
            </div>
            <div className="relative h-44 overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
              <Image src="/img/agate-runner.jpg" alt="Illuminated agate floor runner" fill sizes="20vw" className="object-cover" />
            </div>
            <div className="relative h-44 overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
              <Image src="/img/backlit-marble.jpg" alt="Backlit translucent marble detail" fill sizes="20vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ PROCESS / CRAFT ============ */}
      <section id="process" className="scroll-mt-24 bg-canvas py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="max-w-2xl">
            <Eyebrow>The craft</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-[1.05] tracking-tight">
              Laser-precise from template to install
            </h2>
            <p className="mt-6 text-lg text-stone-dark">
              Technology removes the guesswork; craftsmen supply the soul. Here's how a
              slab becomes a surface you'll keep for life.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-3 lg:grid-cols-12">
            {/* big tech feature */}
            <Reveal className="lg:col-span-7">
              <div className="relative h-full min-h-[20rem] overflow-hidden rounded-[2rem] border border-ink/10">
                <Image src="/img/tech-waterjet.jpg" alt="5-axis saw-waterjet cutting a stone slab" fill sizes="(max-width:1024px) 100vw, 58vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
                <div className="absolute bottom-0 p-7">
                  <div className="eyebrow text-bronze-soft">In the shop</div>
                  <h3 className="mt-2 font-display text-2xl text-cream">
                    One of America's first 5-axis saw-waterjets
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-cream/70">
                    Cuts intricate radii, mitered waterfalls and drainboards to a
                    tolerance the human hand can finish but never has to correct.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="grid gap-3 lg:col-span-5">
              {[
                { n: "01", t: "Design & 3-D rendering", d: "See your kitchen in full before a single cut — layouts, seams and edge profiles agreed up front." },
                { n: "02", t: "Digital laser templating", d: "A laser captures your cabinets to the millimeter, so the template is the room, not an approximation." },
                { n: "03", t: "CNC fabrication & hand finish", d: "Waterjet and CNC rough the slab; our craftsmen ease every edge and polish by hand." },
                { n: "04", t: "White-glove installation", d: "Tight seams, level surfaces, sealed and guaranteed for life — then we clean up after ourselves." },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="flex gap-4 rounded-[1.5rem] border border-ink/10 bg-cream p-5">
                    <span className="font-display text-xl text-bronze">{s.n}</span>
                    <div>
                      <h4 className="font-medium text-ink">{s.t}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-stone-dark">{s.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ WORK / GALLERY ============ */}
      <section id="work" className="scroll-mt-24 bg-ink py-24 text-cream sm:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow tone="light">Selected work</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-light leading-[1.05] tracking-tight text-cream">
                Kitchens, baths &amp; beyond
              </h2>
            </div>
            <p className="max-w-sm text-cream/60">
              A selection of recent installations across Jupiter, Palm Beach Gardens and
              the wider Treasure Coast. Tap any image to enlarge.
            </p>
          </Reveal>

          <div className="mt-12">
            <Gallery />
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="scroll-mt-24 bg-canvas py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative h-[26rem] overflow-hidden rounded-[2rem] border border-ink/10">
              <Image src="/img/storefront.jpg" alt="Jupiter Granite Co. showroom storefront" fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-5 -right-2 rounded-2xl border border-ink/10 bg-cream p-1.5 shadow-xl sm:right-6">
              <div className="rounded-[calc(1rem-0.375rem)] bg-canvas px-5 py-3">
                <p className="text-xs text-stone-dark">Identifies as</p>
                <p className="font-display text-lg text-ink">Women-Owned</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>Our studio</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.2rem)] font-light leading-[1.05] tracking-tight">
              Built on family, finished by hand
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-stone-dark">
              Jupiter Granite Co. is a family business in the truest sense. Owner{" "}
              {site.owner} carries a craft handed down across three generations, and the
              team — including the designers our clients rave about by name — treats every
              home as if it were their own.
            </p>
            <p className="mt-4 leading-relaxed text-stone-dark">
              Our Jupiter Park Lane showroom displays full slabs alongside cabinetry, tile,
              sinks and fixtures, so you can design the whole space in one visit. And
              because we stand behind the work, every installation is backed by our
              lifetime workmanship guarantee.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Cambria Authorized Seller", "Silestone", "Caesarstone", `License ${site.license}`].map((b) => (
                <span key={b} className="rounded-full border border-ink/15 bg-cream px-4 py-1.5 text-xs text-stone-dark">
                  {b}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="bg-canvas pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="flex items-center justify-between gap-4">
            <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-light tracking-tight">
              Loved by Treasure Coast homeowners
            </h2>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="font-display text-2xl">{site.rating}</span>
              <Stars />
            </div>
          </Reveal>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 90}>
                <figure className="flex h-full flex-col rounded-[1.75rem] border border-ink/10 bg-cream p-7">
                  <Stars className="mb-4" />
                  <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-stone-dark">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-ink/10 pt-4">
                    <div className="font-medium text-ink">{r.name}</div>
                    <div className="text-xs text-stone">{r.meta}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT / CTA ============ */}
      <section id="contact" className="scroll-mt-24 relative overflow-hidden bg-obsidian py-24 text-cream sm:py-32">
        <div className="pointer-events-none absolute -right-40 -top-20 h-[28rem] w-[28rem] rounded-full bg-bronze/15 blur-[140px] drift" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:items-stretch">
          <Reveal>
            <Eyebrow tone="light">Start your project</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,3.8rem)] font-light leading-[1] tracking-tight text-cream">
              Let&apos;s design something
              <br />
              <span className="italic text-bronze-soft">worth keeping.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-cream/70">
              Visit the showroom or send us your plans for a free, no-pressure estimate.
              Appointments keep your visit unhurried and one-on-one.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <CTA href={site.phoneHref} tone="bronze">
                Call {site.phone}
              </CTA>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-cream/90 transition-colors duration-300 hover:bg-white/10"
              >
                Get directions
              </a>
            </div>

            <dl className="mt-12 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="eyebrow text-bronze-soft">Showroom</dt>
                <dd className="mt-2 text-cream/85">
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-bronze-soft">Hours</dt>
                <dd className="mt-2 text-cream/85">{site.hours}</dd>
              </div>
              <div>
                <dt className="eyebrow text-bronze-soft">Phone</dt>
                <dd className="mt-2">
                  <a href={site.phoneHref} className="text-cream/85 hover:text-cream">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-bronze-soft">Serving</dt>
                <dd className="mt-2 text-cream/85">Jupiter & all of Palm Beach County</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={120} className="min-h-[22rem]">
            <div className="h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-1.5">
              <iframe
                title="Map to Jupiter Granite Co."
                src={site.mapsEmbed}
                className="h-full min-h-[22rem] w-full rounded-[calc(2rem-0.375rem)] grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-ink py-12 text-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 sm:flex-row sm:items-center">
          <Wordmark tone="light" />
          <p className="text-sm text-cream/50">
            © {new Date().getFullYear()} {site.name} · {site.address.city}, {site.address.state} · License {site.license}
          </p>
          <a href={site.phoneHref} className="text-sm text-cream/70 transition-colors hover:text-cream">
            {site.phone}
          </a>
        </div>
      </footer>
    </main>
  );
}
