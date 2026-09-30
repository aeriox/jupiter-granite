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
    title: "Clarence Clemons’ “Blue Luis”",
    body: "This project for legendary saxophonist Clarence Clemons required vein matching of 9 slabs of Blue Luis.",
    img: "/img/story-blue-luis-slab.jpg",
    alt: "Blue Luis slab from the Clarence Clemons project",
  },
  {
    tag: "Marine Applications",
    title: "The Lazzara “Maggie”",
    body: "On the Lazzara vessel “Maggie” we replaced the wood flooring with HanStone quartz slabs which we milled to 8mm to match the previous floor’s thickness.",
    img: "/img/story-lazzara-maggie.jpg",
    alt: "Aboard the Lazzara vessel “Maggie”",
  },
  {
    tag: "Sinks & Faucets",
    title: "A giant clam shell sink",
    body: "Our client had been holding on to this giant clam shell for over 10 years. We were able to turn it into a vessel sink and mount it to the Shell Stone top for her.",
    img: "/img/story-clam-shell-sink.jpg",
    alt: "Giant clam shell vessel sink",
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
              We are your full service stone professionals! Custom work, summer kitchens,
              fireplaces and columns, marine applications, repair and restoration, sinks and 3-D
              renderings. In fact, we guarantee all of our work for life!
            </p>
          </Reveal>
        </Shell>
      </section>

      {/* SERVICES GRID */}
      <section className="bg-bg pb-[var(--section-y)]">
        <Shell>
          <div className="grid gap-[var(--gallery-gap)] sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal
                key={s.slug}
                delay={(i % 3) * 90}
                // Seven cards: spans keep both the 2- and 3-column grids free of holes.
                className={i === 0 || i === 5 ? "lg:col-span-2" : i === 6 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <article
                  id={s.slug}
                  className="group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-[var(--radius-sm)] border border-line bg-surface"
                >
                  <div className="relative h-56 overflow-hidden rounded-[var(--img-radius)]">
                    <Image
                      src={s.img}
                      alt={s.alt}
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
              Signature{" "}
              <span className="font-display-italic text-accent">projects</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ondarkmuted">
              A few projects from our pages. Jupiter Granite will bring your idea to reality.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-[var(--gallery-gap)] lg:grid-cols-3">
            {stories.map((st, i) => (
              <Reveal key={st.title} delay={i * 110}>
                <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-sm)] border border-white/10 bg-white/[0.04]">
                  <div className="relative h-48 overflow-hidden rounded-[var(--img-radius)] ring-1 ring-white/10">
                    <Image
                      src={st.img}
                      alt={st.alt}
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
