/* eslint-disable @next/next/no-img-element */

export function WaveMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="jg-wave" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#46c0ef" />
          <stop offset="1" stopColor="#1a6e97" />
        </linearGradient>
      </defs>
      <path
        d="M32 6c14.36 0 26 11.64 26 26S46.36 58 32 58c-9.2 0-16-5.4-16-13.2 0-6.7 5-11.6 11.6-11.6 5 0 8.7 3.2 8.7 7.7 0 3.3-2.2 5.7-5.3 5.7-2.2 0-3.8-1.3-3.8-3.3"
        stroke="url(#jg-wave)"
        strokeWidth="6.4"
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
            Est. 2000 · Jupiter, FL
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
