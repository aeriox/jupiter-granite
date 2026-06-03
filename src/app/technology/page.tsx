import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { Shell, Eyebrow, CTA } from "@/components/ui";
import { shopTech } from "@/lib/site";

export const metadata = { title: "Technology" };

const processSteps = [
  { n: "01", t: "Design & 3-D rendering", d: "CAD/CAM layout and photoreal renderings so you approve the finished room before a single slab is cut." },
  { n: "02", t: "Digital laser templating", d: "On-site laser templating since 2007 — your space captured to the millimeter, no wood sticks or guesswork." },
  { n: "03", t: "CNC fabrication & hand finish", d: "5-axis cutting handles the geometry; our craftsmen finish every edge, miter and polish by hand." },
  { n: "04", t: "White-glove installation", d: "Slabs set with vacuum lifters and invisible seams — sealed, guaranteed for life and ready to use." },
];

const credentials = [
  { n: "Since 2007", l: "Laser templating" },
  { n: "2,200 lbs", l: "Slabs handled with ease" },
  { n: "± mm", l: "Cut tolerance" },
  { n: "For life", l: "Workmanship guaranteed" },
];

export default function Technology() {
  const featured = shopTech.find((t) => t.name.includes("saw-waterjet"));
  const splits = shopTech.filter((t) => t !== featured);

  return (
    <main>
      <Nav />

      {/* HEADER */}
      <section className="bg-bg pt-32 pb-[var(--section-y)]">
        <Shell>
          <Reveal className="max-w-3xl">
            <Eyebrow>The shop</Eyebrow>
            <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95]">
              We love <span className="font-display-italic text-accent">technology.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              Jupiter Granite runs one of the most advanced fabrication shops anywhere — every
              machine in service of a more perfect, more repeatable result.
            </p>
          </Reveal>

          <Reveal delay={140} className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {credentials.map((c) => (
              <div key={c.l} className="rounded-[var(--radius-sm)] border border-line bg-surface p-5">
                <div className="font-display text-2xl text-accent">{c.n}</div>
                <div className="mt-1 text-sm text-muted">{c.l}</div>
              </div>
            ))}
          </Reveal>
        </Shell>
      </section>

      {/* EDITORIAL SPLITS */}
      {splits.map((item, i) => {
        const imageFirst = i % 2 === 0;
        return (
          <section key={item.name} className="bg-bg pb-[var(--section-y)]">
            <Shell className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal
                className={`relative h-[24rem] overflow-hidden rounded-[var(--radius)] border border-line ${
                  imageFirst ? "order-1 lg:order-1" : "order-1 lg:order-2"
                }`}
              >
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  sizes="(max-width:1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </Reveal>
              <Reveal
                delay={120}
                className={imageFirst ? "order-2 lg:order-2" : "order-2 lg:order-1"}
              >
                <Eyebrow>Machine {String(i + 1).padStart(2, "0")}</Eyebrow>
                <h2 className="mt-5 font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05]">
                  {item.name}
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{item.body}</p>
              </Reveal>
            </Shell>
          </section>
        );
      })}

      {/* FEATURED — saw-waterjet */}
      {featured && (
        <section className="bg-bg pb-[var(--section-y)]">
          <Shell>
            <Reveal className="relative h-[34rem] overflow-hidden rounded-[var(--radius)] border border-line">
              <Image
                src={featured.img}
                alt={featured.name}
                fill
                sizes="(max-width:1280px) 100vw, var(--shell)"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
                <div className="max-w-2xl">
                  <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-accent">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    Featured machine
                  </span>
                  <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] text-white">
                    {featured.name}
                  </h2>
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">
                    {featured.body}
                  </p>
                </div>
              </div>
            </Reveal>
          </Shell>
        </section>
      )}

      {/* PROCESS */}
      <section className="bg-bg pb-[var(--section-y)]">
        <Shell>
          <Reveal className="max-w-2xl">
            <Eyebrow>The process</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05]">
              Four steps, <span className="font-display-italic text-accent2">no surprises.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <Reveal key={s.n} delay={(i % 4) * 80}>
                <div className="h-full rounded-[var(--radius-sm)] border border-line bg-surface p-5">
                  <div className="font-display text-accent text-2xl">{s.n}</div>
                  <h3 className="mt-3 font-display text-lg">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Shell>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden bg-dark py-[var(--section-y)] text-ondark">
        <Shell className="relative text-center">
          <Reveal>
            <Eyebrow onDark>Start your project</Eyebrow>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1] text-ondark">
              Precision you can <span className="font-display-italic text-accent">feel.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ondarkmuted">
              Bring us your plans and let the shop go to work — sealed, guaranteed and finished by hand.
            </p>
            <div className="mt-9 flex justify-center">
              <CTA href="/contact" variant="accent">Get an estimate</CTA>
            </div>
          </Reveal>
        </Shell>
      </section>
    </main>
  );
}
