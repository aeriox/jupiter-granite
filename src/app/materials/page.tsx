import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { Shell, Eyebrow, CTA } from "@/components/ui";
import { materials, quartzBrands } from "@/lib/site";

export const metadata = { title: "Materials" };

export default function MaterialsPage() {
  return (
    <main>
      <Nav />

      {/* HEADER */}
      <section className="bg-bg pt-32 pb-[var(--section-y)]">
        <Shell>
          <Reveal>
            <Eyebrow>Materials</Eyebrow>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98]">
              Every surface we{" "}
              <span className="font-display-italic text-accent">shape</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              Granite, marble, fine quartz and semi-precious gem stones — every slab is selected,
              cut and finished in-house on our 5-axis machinery, then set by hand. Whatever the
              material, the standard is the same.
            </p>
          </Reveal>
        </Shell>
      </section>

      {/* ONE EDITORIAL SPLIT PER MATERIAL */}
      {materials.map((m, i) => {
        const imageLeft = i % 2 === 0;
        const dark = m.slug === "semi-precious";
        return (
          <section
            key={m.slug}
            id={m.slug}
            className={`scroll-mt-24 py-[var(--section-y)] ${
              dark ? "relative overflow-hidden bg-dark text-ondark" : "bg-bg"
            }`}
          >
            {dark && (
              <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-accent2/20 blur-[120px] drift" />
            )}
            <Shell className="relative grid items-center gap-12 lg:grid-cols-2">
              {/* IMAGE */}
              <Reveal
                className={`relative h-[26rem] overflow-hidden rounded-[var(--img-radius)] ${
                  dark ? "ring-1 ring-white/10" : "border border-line"
                } ${imageLeft ? "lg:order-1" : "lg:order-2"}`}
              >
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  sizes="(max-width:1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.04]"
                />
              </Reveal>

              {/* COPY */}
              <Reveal
                delay={120}
                className={imageLeft ? "lg:order-2" : "lg:order-1"}
              >
                <h2
                  className={`font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] ${
                    dark ? "text-ondark" : ""
                  }`}
                >
                  {m.name}
                </h2>
                <p
                  className={`mt-4 font-display-italic text-xl ${
                    dark ? "text-accent" : "text-accent2"
                  }`}
                >
                  {m.tagline}
                </p>
                <p
                  className={`mt-6 max-w-xl text-lg leading-relaxed ${
                    dark ? "text-ondarkmuted" : "text-muted"
                  }`}
                >
                  {m.body}
                </p>

                {/* SWATCHES */}
                <div className="mt-8 grid grid-cols-4 gap-[var(--gallery-gap)]">
                  {m.swatches.map((s, si) => (
                    <div
                      key={s}
                      className={`relative h-24 overflow-hidden rounded-[var(--img-radius)] ${
                        dark ? "ring-1 ring-white/10" : "border border-line"
                      }`}
                    >
                      <Image
                        src={s}
                        alt={`${m.name} sample ${si + 1}`}
                        fill
                        sizes="(max-width:1024px) 22vw, 11vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* QUARTZ BRAND PILLS */}
                {m.slug === "quartz" && (
                  <div className="mt-7 flex flex-wrap gap-2">
                    {quartzBrands.map((b) => (
                      <span
                        key={b}
                        className="rounded-full border border-line px-4 py-1.5 text-xs text-muted"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </Reveal>
            </Shell>
          </section>
        );
      })}

      {/* CTA BAND */}
      <section className="relative overflow-hidden bg-dark py-[var(--section-y)] text-ondark">
        <div className="pointer-events-none absolute -right-40 -top-20 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-[140px] drift" />
        <Shell className="relative text-center">
          <Reveal>
            <Eyebrow onDark>Start your project</Eyebrow>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1] text-ondark">
              Find the stone that&apos;s{" "}
              <span className="font-display-italic text-accent">yours.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ondarkmuted">
              Visit the showroom to see full slabs in person, or send us your plans for a free,
              no-pressure estimate.
            </p>
            <div className="mt-9 flex justify-center">
              <CTA href="/contact" variant="accent">
                Request your estimate
              </CTA>
            </div>
          </Reveal>
        </Shell>
      </section>
    </main>
  );
}
