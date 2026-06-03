/* eslint-disable @next/next/no-img-element */

const brands = [
  { src: "/img/brands-strip/cambria.png", alt: "Cambria" },
  { src: "/img/brands-strip/silestone.png", alt: "Silestone by Cosentino" },
  { src: "/img/brands-strip/caesarstone.png", alt: "Caesarstone" },
  { src: "/img/brands-strip/compac.png", alt: "Compac" },
  { src: "/img/brands-strip/hanstone.png", alt: "HanStone" },
  { src: "/img/brands-strip/one.png", alt: "ONE Quartz Surfaces" },
];

export function BrandMarquee({ label = "Certified fabricator & installer" }: { label?: string }) {
  return (
    <section className="overflow-hidden border-y border-black/5 bg-[#f4f1ea] py-7">
      {label && (
        <p className="mb-5 text-center text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#9a9183]">
          {label}
        </p>
      )}
      <div className="flex overflow-hidden">
        <div className="marquee flex shrink-0 items-center gap-14 pr-14 sm:gap-20 sm:pr-20" style={{ animationDuration: "55s" }}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-14 sm:gap-20">
              {brands.map((b) => (
                <img
                  key={b.alt}
                  src={b.src}
                  alt={b.alt}
                  className="h-6 w-auto shrink-0 opacity-55 grayscale transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-100 hover:grayscale-0 sm:h-7"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
