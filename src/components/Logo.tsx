/* eslint-disable @next/next/no-img-element */

export function WaveMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      {/* A cut-stone facet. (The old wave glyph traced a logo found through Google that
          is not theirs, so it is gone. A solid accent stroke: a shared gradient id broke
          whenever its first copy sat in a hidden logo option.) */}
      <path
        d="M20 10h24l12 14-24 30L8 24zM8 24h48M26 10l-4 14 10 30 10-30-4-14"
        stroke="var(--color-accent)"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Renders all three logo options; CSS (driven by html[data-logo]) reveals the
 * active one. The image wordmarks pick a light/dark variant from `onDark`.
 */
export function Wordmark({
  className = "",
  onDark = true,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const variant = onDark ? "on-dark" : "on-light";
  return (
    <div className={`flex items-center ${className}`}>
      {/* Wave mark + text (default) */}
      <span className="logo-opt logo-wave flex items-center gap-2.5">
        <WaveMark className="h-8 w-8 shrink-0" />
        <span className="leading-none">
          <span className={`block font-display text-[1.15rem] font-semibold ${onDark ? "text-ondark" : "text-fg"}`} style={{ letterSpacing: "-0.01em" }}>
            Jupiter Granite
          </span>
          <span className={`eyebrow mt-1 block text-[0.5rem] ${onDark ? "text-ondarkmuted" : "text-faint"}`}>
            Jupiter, FL
          </span>
        </span>
      </span>

      {/* Planet wordmark image */}
      <img
        src={`/img/logos/block-${variant}.png`}
        alt="Jupiter Granite Co."
        className="logo-opt logo-block h-9 w-auto"
      />

      {/* Planet wordmark — inverted planet */}
      <img
        src={`/img/logos/block-inv-${variant}.png`}
        alt="Jupiter Granite Co."
        className="logo-opt logo-blockinv h-9 w-auto"
      />

      {/* Marble serif wordmark — bronze in light mode, silver in dark mode */}
      <img
        src="/img/logos/serif-on-light.png"
        alt="Jupiter Granite Co."
        className="logo-opt serif-bronze h-10 w-auto"
      />
      <img
        src="/img/logos/serif-on-dark.png"
        alt="Jupiter Granite Co."
        className="logo-opt serif-silver h-10 w-auto"
      />

      {/* Stone-textured wordmark image */}
      <img
        src={`/img/logos/stone-${variant}.png`}
        alt="Jupiter Granite Co."
        className="logo-opt logo-stone h-10 w-auto"
      />
    </div>
  );
}
