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

export function Wordmark({
  className = "",
  onDark = true,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <WaveMark className="h-8 w-8 shrink-0" />
      <div className="leading-none">
        <div
          className={`font-display text-[1.15rem] font-semibold ${onDark ? "text-ondark" : "text-fg"}`}
          style={{ letterSpacing: "-0.01em" }}
        >
          Jupiter Granite
        </div>
        <div className={`eyebrow mt-1 text-[0.5rem] ${onDark ? "text-ondarkmuted" : "text-faint"}`}>
          Est. 2000 · Jupiter, FL
        </div>
      </div>
    </div>
  );
}
