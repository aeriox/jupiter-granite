import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { WaveMark } from "@/components/Logo";
import { Shell, Eyebrow, CTA, SectionHead } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = { title: "About" };

const credentials = [
  { n: "3rd-Gen", l: "Jason Demick, master craftsman" },
  { n: "For life", l: "We guarantee all of our work" },
  { n: "Certified", l: "Quartz fabricators and installers" },
  { n: site.license, l: "Palm Beach County contractor license" },
];

export default function About() {
  return (
    <main>
      <Nav />

      {/* HEADER */}
      <section className="bg-bg pt-32 pb-[var(--section-y)]">
        <Shell>
          <Reveal>
            <Eyebrow>Our studio</Eyebrow>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.97]">
              Owner Jason Demick,{" "}
              <span className="font-display-italic text-accent">3rd generation master craftsman.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              Jason is a Jupiter native. His experience combined with a state of the art stone
              fabrication facility insures every job receives the highest level of quality.
            </p>
          </Reveal>
        </Shell>
      </section>

      {/* EDITORIAL SPLIT */}
      <section className="bg-bg pb-[var(--section-y)]">
        <Shell className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative">
            <div className="relative h-[30rem] overflow-hidden rounded-[var(--img-radius)] border border-line sm:h-[36rem]">
              <Image
                src="/img/shop-crane-slab.jpg"
                alt="A slab on the overhead crane in our fabrication shop"
                fill
                sizes="(max-width:1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>

            {/* Floating heritage badge */}
            <div className="absolute -bottom-5 right-5 rounded-2xl border border-line bg-surface p-1.5 shadow-xl sm:right-8">
              <div className="rounded-[calc(1rem-0.375rem)] bg-bg px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <WaveMark className="h-5 w-5" />
                  <span className="font-display text-lg">3rd Generation</span>
                </div>
                <p className="mt-1 text-xs text-faint">Jason Demick, master craftsman</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>The story</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05]">
              A state of the art stone{" "}
              <span className="font-display-italic text-accent2">fabrication facility.</span>
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
              <p>
                Palm Beach County Contractor License # {site.license}. Laser templating, water-jet
                and CNC fabrication means we get it perfect every time.
              </p>
              <p>
                Our slab warehouse, showroom and fabrication shop are at {site.address.street},
                Jupiter. We also offer a huge variety of standard and designer sinks and faucets for
                your kitchen and bath project.
              </p>
              <p>
                We guarantee all of our work for life! We accept all major credit cards!
              </p>
            </div>
          </Reveal>
        </Shell>
      </section>

      {/* CREDENTIALS ROW */}
      <section className="bg-bg pb-[var(--section-y)]">
        <Shell>
          <Reveal className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {credentials.map((c, i) => (
              <Reveal key={c.n} delay={(i % 4) * 80}>
                <div className="h-full rounded-[var(--radius)] border border-line bg-surface p-1.5">
                  <div className="h-full rounded-[calc(var(--radius)-0.375rem)] bg-bg px-6 py-7">
                    <div className="font-display text-2xl">{c.n}</div>
                    <div className="mt-2 text-sm leading-relaxed text-muted">{c.l}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </Reveal>
        </Shell>
      </section>

      {/* MEET THE TEAM */}
      <section className="bg-dark py-[var(--section-y)] text-ondark">
        <Shell>
          <Reveal>
            <SectionHead
              eyebrow="Meet the team"
              title={
                <span className="text-ondark">
                  The people behind the <span className="font-display-italic text-accent">stone</span>
                </span>
              }
              intro="Showroom appointments and estimating: (561) 352-6232. Owner Jason Demick: jason@jupitergranite.com."
              onDark
            />
          </Reveal>

          <div className="mt-12 grid gap-3 md:grid-cols-3">
            {site.contacts.map((person, i) => (
              <Reveal key={person.name} delay={i * 90}>
                <div className="flex h-full flex-col rounded-[var(--radius-sm)] border border-white/10 bg-white/[0.04] p-7">
                  <div className="flex items-center gap-3">
                    <WaveMark className="h-5 w-5 shrink-0" />
                    <h3 className="font-display text-xl text-ondark">{person.name}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ondarkmuted">{person.role}</p>
                  {"email" in person && person.email && (
                    <a
                      href={`mailto:${person.email}`}
                      className="mt-5 inline-flex w-max border-b border-white/20 pb-0.5 text-sm text-accent transition-colors duration-300 hover:border-accent"
                    >
                      {person.email}
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-8">
            <a href={site.phoneHref} className="group inline-flex items-center gap-2 text-ondark transition-colors hover:text-accent max-md:py-2">
              <WaveMark className="h-4 w-4" />
              <span className="text-lg">{site.phone}</span>
            </a>
            <a href={`mailto:${site.email}`} className="group inline-flex items-center gap-2 text-ondark transition-colors hover:text-accent max-md:py-2">
              <WaveMark className="h-4 w-4" />
              <span className="text-lg">{site.email}</span>
            </a>
          </Reveal>
        </Shell>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden bg-dark py-[var(--section-y)] text-ondark">
        <div className="pointer-events-none absolute -right-40 -top-20 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-[140px] drift" />
        <Shell className="relative text-center">
          <Reveal>
            <Eyebrow onDark>Come see the slabs</Eyebrow>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1] text-ondark">
              Slab warehouse, showroom{" "}
              <span className="font-display-italic text-accent">&amp; fabrication shop</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ondarkmuted">
              {site.address.street}. Monday to Friday, by appointment.
            </p>
            <div className="mt-9 flex justify-center">
              <CTA href="/contact" variant="accent">Book a showroom visit</CTA>
            </div>
          </Reveal>
        </Shell>
      </section>
    </main>
  );
}
