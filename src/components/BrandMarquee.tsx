/* eslint-disable @next/next/no-img-element */

const brands = [
  { src: "/img/brands-strip/cambria.png", alt: "Cambria" },
  { src: "/img/brands-strip/silestone.png", alt: "Silestone by Cosentino" },
  { src: "/img/brands-strip/caesarstone.png", alt: "Caesarstone" },
  { src: "/img/brands-strip/compac.png", alt: "Compac" },
  { src: "/img/brands-strip/hanstone.png", alt: "HanStone" },
  { src: "/img/brands-strip/one.png", alt: "ONE Quartz Surfaces" },
];

// Even number of copies so the track is two identical halves (seamless at -50%),
// and enough of them that one half always exceeds the viewport (no gap).
const COPIES = 8;

export function BrandMarquee({ label = "The quartz brands we carry & fabricate" }: { label?: string }) {
  return (
    <section className="overflow-hidden border-y border-black/5 bg-[#f4f1ea] py-7">
      {label && (
        <p className="mb-5 text-center text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#9a9183]">
          {label}
        </p>
      )}
      <div className="flex">
        <div className="marquee flex w-max items-center" style={{ animationDuration: "220s" }}>
          {Array.from({ length: COPIES }).map((_, c) =>
            brands.map((b) => (
              <img
                key={`${c}-${b.alt}`}
                src={b.src}
                alt={b.alt}
                aria-hidden={c > 0}
                className="mr-14 h-6 w-auto shrink-0 opacity-55 grayscale transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-100 hover:grayscale-0 sm:mr-20 sm:h-7"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
