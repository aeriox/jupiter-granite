import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { Gallery } from "@/components/Gallery";
import { BrandMarquee } from "@/components/BrandMarquee";
import { WaveMark } from "@/components/Logo";
import { Shell, Eyebrow, CTA, SectionHead } from "@/components/ui";
import { site, materials } from "@/lib/site";

export default function Home() {
  return (
    <main id="top">
      <Nav overHero />

      {/* HERO */}
      <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-dark">
        <Image
          src="/img/hero-juparana-kitchen.jpg"
          alt="Juparana Crema Bordeaux granite kitchen island by Jupiter Granite Co."
          fill priority sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAGAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDBv7tp4zBIgVgcZRjjt2ooopbstI//2Q=="
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

        <Shell className="relative pb-28 pt-32 sm:pb-24">
          <div className="max-w-3xl">
            <Reveal eager><Eyebrow onDark>Jupiter · Palm Beach · South Florida</Eyebrow></Reveal>
            <Reveal eager delay={80}>
              <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] text-white">
                Exotic stone &amp;<br />
                <span className="font-display-italic text-accent">quartz surfaces.</span>
              </h1>
            </Reveal>
            <Reveal eager delay={160}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">
                Granite, marble, onyx and quartz. Laser templating, water-jet and CNC fabrication
                means we get it perfect every time. In fact, we guarantee all of our work for life!
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
      </section>

      {/* MARQUEE */}
      <section className="border-y border-line bg-dark py-5 text-ondark">
        <div className="flex overflow-hidden">
          <div className="marquee flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 text-ondarkmuted">
            {[...Array(2)].map((_, dup) => (
              <span key={dup} className="flex items-center gap-10">
                {["Granite", "Marble", "Onyx", "Fine Quartz", "Quartzite", "Semi-Precious Gem Stones", "Laser Templating", "Guaranteed for Life"].map((t) => (
                  <span key={t} className="flex items-center gap-10 font-display text-lg font-display-italic">
                    {t}<WaveMark className="h-4 w-4" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-bg py-[var(--section-y)]">
        <Shell className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Reveal>
            <Eyebrow>The shop</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05]">
              The most efficient and technologically advanced fabrication shop{" "}
              <span className="font-display-italic text-accent2">around.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Owner &amp; Jupiter Native, {site.owner}, is a 3rd generation master craftsman. His
              experience combined with a state of the art stone fabrication facility insures every
              job receives the highest level of quality.
            </p>
            <div className="mt-7"><CTA href="/about" variant="outline">Our story</CTA></div>
          </Reveal>

          <Reveal delay={120} className="rounded-[var(--radius)] border border-line bg-surface p-1.5">
            <div className="space-y-5 rounded-[calc(var(--radius)-0.375rem)] bg-bg px-6 py-7">
              {[
                "Jupiter Granite purchases world\u2019s 1st 5 axis saw-water jet!",
                "Laser templating since 2007.",
                "We guarantee all of our work for life!",
                `Palm Beach County Contractor License # ${site.license}`,
              ].map((t) => (
                <p key={t} className="flex items-start gap-3 text-[0.95rem] leading-relaxed">
                  <WaveMark className="mt-1 h-4 w-4 shrink-0" />
                  <span>{t}</span>
                </p>
              ))}
            </div>
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
                    <Image src={m.img} alt={m.alt} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.07]" />
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
              Semi-precious <span className="font-display-italic text-accent">gem stones</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ondarkmuted">
              Ultra luxurious, semi-precious, gem stones. Such as countertops, floors, walls,
              tables and other types of furniture. We are your international gem surface
              specialists.
            </p>
            <ul className="mt-8 space-y-3">
              {["Gem stones with back lighting", "20mm-30mm thicknesses for general applications", "10mm-15mm with aluminum honeycomb backing for private aircraft and vessels"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-ondark/85">
                  <WaveMark className="mt-0.5 h-4 w-4 shrink-0" /><span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8"><CTA href="/materials#semi-precious" onDark>Explore gem surfaces</CTA></div>
          </Reveal>

          <Reveal delay={120} className="order-1 grid grid-cols-2 gap-[var(--gallery-gap)] lg:order-2">
            <div className="relative col-span-2 h-64 overflow-hidden rounded-[var(--img-radius)] ring-1 ring-white/10">
              <Image src="/img/gem-grey-agate.jpg" alt="Grey agate" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
            </div>
            <div className="relative h-44 overflow-hidden rounded-[var(--img-radius)] ring-1 ring-white/10">
              <Image src="/img/gem-white-quartz.jpg" alt="White Quartz semi-precious gem stone" fill sizes="(max-width:1024px) 50vw, 20vw" className="object-cover" />
            </div>
            <div className="relative h-44 overflow-hidden rounded-[var(--img-radius)] ring-1 ring-white/10">
              <Image src="/img/gem-feldspar.jpg" alt="Feldspar semi-precious gem stone" fill sizes="(max-width:1024px) 50vw, 20vw" className="object-cover" />
            </div>
          </Reveal>
        </Shell>
      </section>

      {/* TECH TEASER */}
      <section className="bg-bg py-[var(--section-y)]">
        <Shell className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative order-2 h-[24rem] overflow-hidden rounded-[var(--radius)] border border-line lg:order-1">
            <Image src="/img/shop-vacuum-lifter-saw.jpg" alt="The vacuum lifter setting a slab on the CNC saw in our shop" fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2">
            <SectionHead
              eyebrow="The craft"
              title={<>The latest technology from template to install</>}
              intro="Laser templating since 2007, a 5-axis CNC bridge saw and the world's 1st 5 axis saw-water jet. Laser templating, water-jet and CNC fabrication means we get it perfect every time."
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
          <Shell><Gallery phoneLimit={6} /></Shell>
        </div>
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
              Book a showroom visit, or send us your plans for an estimate.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <CTA href="/contact" variant="accent">Request your estimate</CTA>
              <CTA href={site.phoneHref} onDark variant="outline" external>Call the showroom {site.phone}</CTA>
            </div>
          </Reveal>
        </Shell>
      </section>
    </main>
  );
}
