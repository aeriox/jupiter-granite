import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { Gallery } from "@/components/Gallery";
import { Shell, Eyebrow, CTA } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <main>
      <Nav />

      {/* HEADER */}
      <section className="bg-bg pt-32 pb-[var(--section-y)]">
        <Shell>
          <div className="max-w-3xl">
            <Reveal><Eyebrow>Our work</Eyebrow></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.98]">
                A portfolio in <span className="font-display-italic text-accent">stone.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 text-lg leading-relaxed text-muted">
                Granite, marble and quartz jobs from our own photo albums. All photos are actual
                jobs fabricated and installed by Jupiter Granite Co. Jupiter - Palm Beach - South
                Florida.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 text-sm text-faint">Tap any image to enlarge.</p>
            </Reveal>
          </div>
        </Shell>
      </section>

      {/* GALLERY */}
      <section className="bg-bg pb-[var(--section-y)]">
        <Shell>
          <Reveal>
            <p className="mb-10 max-w-xl text-sm leading-relaxed text-faint">
              Captions are the stone names from our own albums.
            </p>
          </Reveal>
        </Shell>
        <Reveal>
          <Gallery bleed />
        </Reveal>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden bg-dark py-[var(--section-y)] text-ondark">
        <div className="pointer-events-none absolute -right-40 -top-20 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-[140px] drift" />
        <Shell className="relative text-center">
          <Reveal>
            <Eyebrow onDark>Start your project</Eyebrow>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1] text-ondark">
              Ready to see your space <span className="font-display-italic text-accent">in stone?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ondarkmuted">
              Send us your plans, or book a showroom visit, for an estimate.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <CTA href="/contact" variant="accent">Get an estimate</CTA>
              <CTA href={site.phoneHref} onDark variant="outline" external>Call the showroom {site.phone}</CTA>
            </div>
          </Reveal>
        </Shell>
      </section>
    </main>
  );
}
