"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { gallery } from "@/lib/site";

export function Gallery({ bleed = false }: { bleed?: boolean }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const move = useCallback(
    (dir: number) =>
      setActive((i) => (i === null ? i : (i + dir + gallery.length) % gallery.length)),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, move]);

  return (
    <div className={bleed ? "bleed" : ""}>
      <div
        className="grid auto-rows-[clamp(160px,22vw,260px)] grid-cols-2 gap-[var(--gallery-gap)] lg:grid-cols-4"
      >
        {gallery.map((g, i) => (
          <button
            key={g.src}
            onClick={() => setActive(i)}
            aria-label={`View ${g.alt}`}
            className={`group relative overflow-hidden rounded-[var(--img-radius)] bg-surface2 ${
              "span" in g ? (g as { span?: string }).span ?? "" : ""
            }`}
          >
            <Image
              src={g.src}
              alt={g.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute bottom-3 left-3 right-3 translate-y-2 text-left text-[0.7rem] leading-snug text-white/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white/90">
              {g.alt}
            </span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-4 backdrop-blur-xl" onClick={close}>
          <button onClick={close} aria-label="Close" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label="Previous" className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 sm:left-8">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="relative h-[78vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={gallery[active].src} alt={gallery[active].alt} fill sizes="90vw" className="rounded-lg object-contain" priority />
            <p className="absolute -bottom-9 left-0 right-0 text-center text-sm text-white/70">{gallery[active].alt}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); move(1); }} aria-label="Next" className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 sm:right-8">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
