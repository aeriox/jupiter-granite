import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { Gallery } from "@/components/Gallery";
import { BrandMarquee } from "@/components/BrandMarquee";
import { WaveMark } from "@/components/Logo";
import { Shell, Eyebrow, Stars, CTA, SectionHead } from "@/components/ui";
import { site, materials, reviews } from "@/lib/site";

export default function Home() {
  return (
    <main id="top">
      <Nav overHero />

      {/* HERO */}
      <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-dark">
        <Image
          src="/img/hero-waterfront-island.jpg"
          alt="Modern waterfront kitchen with a custom stone island by Jupiter Granite"
          fill priority sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAFAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAT/xAAeEAACAgAHAAAAAAAAAAAAAAAAAQIDBAUSFCEiQf/EABQBAQAAAAAAAAAAAAAAAAAAAAL/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEQMRAD8AjzPE7a6lxg5aue8m/QAClH//2Q=="
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

        <Shell className="relative pb-16 pt-32 sm:pb-24">
          <div className="max-w-3xl">
            <Reveal eager><Eyebrow onDark>Jupiter · Palm Beach · Treasure Coast</Eyebrow></Reveal>
            <Reveal eager delay={80}>
              <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] text-white">
                Natural stone,<br />
                <span className="font-display-italic text-accent">mastered.</span>
              </h1>
            </Reveal>
            <Reveal eager delay={160}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">
                Three generations of craftsmen turning raw granite, quartzite and marble into the
                surfaces your home is built around — fabricated on Florida&apos;s most advanced
                stone machinery and guaranteed for life.
              </p>
            </Reveal>
            <Reveal eager delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <CTA href="/contact">Get an estimate</CTA>
                <Link href="/gallery" className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/90 transition-colors duration-300 hover:bg-white/10">
                  See our work
                </Link>
              </div>
            </Reveal>
          </div>
        </Shell>

        <Reveal eager delay={320} className="absolute bottom-8 right-5 hidden rounded-2xl border border-white/10 bg-white/[0.06] p-1.5 backdrop-blur-md lg:block">
          <div className="rounded-[calc(1rem-0.375rem)] bg-black/40 px-5 py-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl text-white">{site.rating}</span>
              <Stars />
            </div>
            <p className="mt-1 text-xs text-white/60">{site.reviewCount} Google reviews</p>
          </div>
        </Reveal>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-line bg-dark py-5 text-ondark">
        <div className="flex overflow-hidden">
          <div className="marquee flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 text-ondarkmuted">
            {[...Array(2)].map((_, dup) => (
              <span key={dup} className="flex items-center gap-10">
                {["Granite", "Quartzite", "Marble", "Fine Quartz", "Porcelain", "Onyx & Semi-Precious", "Cambria Authorized Seller", "Lifetime Guarantee", "Family-Owned · Est. 2000"].map((t) => (
                  <span key={t} className="flex items-center gap-10 font-display text-lg font-display-italic">
                    {t}<WaveMark className="h-4 w-4" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO + STATS */}
      <section className="bg-bg py-[var(--section-y)]">
        <Shell className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Reveal>
            <Eyebrow>The studio</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05]">
              A fabrication shop that thinks like an{" "}
              <span className="font-display-italic text-accent2">atelier.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Founded in 2000 and led by Jupiter native and third-generation master craftsman{" "}
              {site.owner}, Jupiter Granite pairs old-world stoneworking instinct with a
              state-of-the-art facility — including one of the first 5-axis saw-waterjets in the
              country. Every job, from a powder-room vanity to a waterfront summer kitchen,
              receives the same obsessive eye.
            </p>
            <div className="mt-7"><CTA href="/about" variant="outline">Our story</CTA></div>
          </Reveal>

          <Reveal delay={120} className="grid grid-cols-2 gap-3">
            {[
              { n: "25+", l: "Years fabricating stone" },
              { n: "4.9★", l: "Across 190 reviews" },
              { n: "5-Axis", l: "Saw-waterjet precision" },
              { n: "Lifetime", l: "Workmanship guarantee" },
            ].map((s) => (
              <div key={s.l} className="rounded-[var(--radius)] border border-line bg-surface p-1.5">
                <div className="rounded-[calc(var(--radius)-0.375rem)] bg-bg px-5 py-6">
                  <div className="font-display text-3xl">{s.n}</div>
                  <div className="mt-1 text-sm text-muted">{s.l}</div>
                </div>
              </div>
            ))}
          </Reveal>
        </Shell>
      </section>

      {/* MATERIALS TEASER */}
      <section className="bg-bg pb-[var(--section-y)]">
        <Shell>
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Materials" title="Every stone we shape" />
            <CTA href="/materials" variant="outline">All materials</CTA>
          </Reveal>
          <div className="mt-12 grid gap-[var(--gallery-gap)] sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((m, i) => (
              <Reveal key={m.slug} delay={(i % 4) * 80}>
                <Link href={`/materials#${m.slug}`} className="group block h-full overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={m.img} alt={m.name} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.07]" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl">{m.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{m.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Shell>
      </section>

      {/* BRAND MARQUEE */}
      <BrandMarquee />

      {/* SIGNATURE */}
      <section className="relative overflow-hidden bg-dark py-[var(--section-y)] text-ondark">
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-accent2/20 blur-[120px] drift" />
        <Shell className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow onDark>Signature work</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] text-ondark">
              Backlit agate &amp; <span className="font-display-italic text-accent">semi-precious</span> stone
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ondarkmuted">
              It&apos;s what people remember. We fabricate illuminated agate, onyx and gemstone
              surfaces into floors, feature walls, bar tops and islands that glow from within —
              singular installations you won&apos;t find anywhere else on the Treasure Coast.
            </p>
            <ul className="mt-8 space-y-3">
              {["Backlit slab fabrication & LED integration", "Bookmatched agate & onyx feature panels", "Marine & aircraft applications with honeycomb backing"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-ondark/85">
                  <WaveMark className="mt-0.5 h-4 w-4 shrink-0" /><span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8"><CTA href="/materials#semi-precious" onDark>Explore gem surfaces</CTA></div>
          </Reveal>

          <Reveal delay={120} className="order-1 grid grid-cols-2 gap-[var(--gallery-gap)] lg:order-2">
            <div className="relative col-span-2 h-64 overflow-hidden rounded-[var(--img-radius)] ring-1 ring-white/10">
              <Image src="/img/backlit-agate-island.jpg" alt="Backlit blue agate island" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
            </div>
            <div className="relative h-44 overflow-hidden rounded-[var(--img-radius)] ring-1 ring-white/10">
              <Image src="/img/agate-runner.jpg" alt="Illuminated agate floor runner" fill sizes="20vw" className="object-cover" />
            </div>
            <div className="relative h-44 overflow-hidden rounded-[var(--img-radius)] ring-1 ring-white/10">
              <Image src="/img/backlit-marble.jpg" alt="Backlit translucent marble detail" fill sizes="20vw" className="object-cover" />
            </div>
          </Reveal>
        </Shell>
      </section>

      {/* TECH TEASER */}
      <section className="bg-bg py-[var(--section-y)]">
        <Shell className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative order-2 h-[24rem] overflow-hidden rounded-[var(--radius)] border border-line lg:order-1">
            <Image src="/img/tech-waterjet.jpg" alt="5-axis saw-waterjet cutting stone" fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2">
            <SectionHead
              eyebrow="The craft"
              title={<>Laser-precise, from template to install</>}
              intro="Technology removes the guesswork; craftsmen supply the soul. Laser templating since 2007, a 5-axis CNC bridge saw, one of America's first 5-axis saw-waterjets, and hands that finish every edge."
            />
            <div className="mt-7"><CTA href="/technology" variant="outline">Inside the shop</CTA></div>
          </Reveal>
        </Shell>
      </section>

      {/* GALLERY TEASER */}
      <section className="bg-dark py-[var(--section-y)] text-ondark">
        <Shell>
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Selected work" title="Kitchens, baths & beyond" onDark />
            <CTA href="/gallery" onDark variant="outline">Full gallery</CTA>
          </Reveal>
        </Shell>
        <div className="mt-12">
          <Shell><Gallery /></Shell>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-bg py-[var(--section-y)]">
        <Shell>
          <Reveal className="flex items-center justify-between gap-4">
            <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)]">Loved by Treasure Coast homeowners</h2>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="font-display text-2xl">{site.rating}</span><Stars />
            </div>
          </Reveal>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 90}>
                <figure className="flex h-full flex-col rounded-[var(--radius-sm)] border border-line bg-surface p-7">
                  <Stars className="mb-4" />
                  <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-muted">&ldquo;{r.quote}&rdquo;</blockquote>
                  <figcaption className="mt-6 border-t border-line pt-4">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-faint">{r.meta}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Shell>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden bg-dark py-[var(--section-y)] text-ondark">
        <div className="pointer-events-none absolute -right-40 -top-20 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-[140px] drift" />
        <Shell className="relative text-center">
          <Reveal>
            <Eyebrow onDark>Start your project</Eyebrow>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1] text-ondark">
              Let&apos;s design something <span className="font-display-italic text-accent">worth keeping.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ondarkmuted">
              Visit the showroom or send us your plans for a free, no-pressure estimate.
            </p>
            <div className="mt-9 flex justify-center gap-3">
              <CTA href="/contact" variant="accent">Request your estimate</CTA>
              <CTA href={site.phoneHref} onDark variant="outline" external>Call {site.phone}</CTA>
            </div>
          </Reveal>
        </Shell>
      </section>
    </main>
  );
}
