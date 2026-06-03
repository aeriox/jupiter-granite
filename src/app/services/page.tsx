import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { WaveMark } from "@/components/Logo";
import { Shell, Eyebrow, CTA } from "@/components/ui";
import { services } from "@/lib/site";

export const metadata = { title: "Services" };

const stories = [
  {
    tag: "3-D Renderings",
    title: "Clarence Clemons’ “Blue Louise”",
    body: "For the late E Street Band saxophonist, we vein-matched nine slabs of Blue Louise quartzite from a single 3-D rendering — every seam flowing as one continuous river of stone.",
    img: "/img/install-template.jpg",
  },
  {
    tag: "Marine Applications",
    title: "The Lazzara “Maggie”",
    body: "Aboard the Lazzara yacht “Maggie,” we milled HanStone quartz down to 8mm to match the original floor exactly — honeycomb-backed where every pound of weight mattered.",
    img: "/img/mat-quartzite.jpg",
  },
  {
    tag: "Sinks & Faucets",
    title: "A ten-year-old clam shell",
    body: "A client kept a giant clam shell for a decade waiting for the right home. We hollowed, sealed and plumbed it into a one-of-a-kind vessel sink no catalog could ever offer.",
    img: "/img/detail-sink2.jpg",
  },
];

export default function ServicesPage() {
  return (
    <main>
      <Nav />

      {/* HEADER */}
      <section className="bg-bg pb-[var(--section-y)] pt-32">
        <Shell>
          <Reveal>
            <Eyebrow>What we do</Eyebrow>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98]">
              Beyond the <span className="font-display-italic text-accent">countertop</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              Full-service stone — from custom commissions and summer kitchens to marine work,
              restoration, sinks and 3-D renderings. Every project leaves our shop finished by hand
              and guaranteed for life.
            </p>
          </Reveal>
        </Shell>
      </section>

      {/* SERVICES GRID */}
      <section className="bg-bg pb-[var(--section-y)]">
        <Shell>
          <div className="grid gap-[var(--gallery-gap)] sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 90}>
                <article
                  id={s.slug}
                  className="group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface"
                >
                  <div className="relative h-56 overflow-hidden rounded-[var(--img-radius)]">
                    <Image
                      src={s.img}
                      alt={s.name}
                      fill
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.07]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-2xl">{s.name}</h2>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{s.blurb}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Shell>
      </section>

      {/* SIGNATURE STORIES */}
      <section className="relative overflow-hidden bg-dark py-[var(--section-y)] text-ondark">
        <div className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full bg-accent2/20 blur-[120px] drift" />
        <Shell className="relative">
          <Reveal className="max-w-2xl">
            <Eyebrow onDark>Signature stories</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] text-ondark">
              When the brief is{" "}
              <span className="font-display-italic text-accent">impossible</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ondarkmuted">
              A few of the commissions clients still talk about — proof that if it can be cut, set or
              shaped from stone, we have probably already done it.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-[var(--gallery-gap)] lg:grid-cols-3">
            {stories.map((st, i) => (
              <Reveal key={st.title} delay={i * 110}>
                <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-sm)] border border-white/10 bg-white/[0.04]">
                  <div className="relative h-48 overflow-hidden rounded-[var(--img-radius)] ring-1 ring-white/10">
                    <Image
                      src={st.img}
                      alt={st.title}
                      fill
                      sizes="(max-width:1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="eyebrow flex items-center gap-2 text-accent">
                      <WaveMark className="h-3.5 w-3.5" />
                      {st.tag}
                    </span>
                    <h3 className="mt-3 font-display text-xl text-ondark">{st.title}</h3>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ondarkmuted">{st.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Shell>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden bg-dark py-[var(--section-y)] text-ondark">
        <div className="pointer-events-none absolute -left-40 -top-20 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-[140px] drift" />
        <Shell className="relative text-center">
          <Reveal>
            <Eyebrow onDark>Start your project</Eyebrow>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1] text-ondark">
              Bring us the idea that{" "}
              <span className="font-display-italic text-accent">won&apos;t leave you.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ondarkmuted">
              Custom commission or full restoration — tell us what you have in mind and we will show
              you what stone can do.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <CTA href="/contact" variant="accent">
                Start a project
              </CTA>
              <CTA href="/gallery" onDark variant="outline">
                See the work
              </CTA>
            </div>
          </Reveal>
        </Shell>
      </section>
    </main>
  );
}
