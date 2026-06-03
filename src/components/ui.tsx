import Link from "next/link";

export function Shell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[var(--shell)] px-[var(--shell-px)] ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
        onDark ? "border-white/15 bg-white/5 text-accent" : "border-line bg-fg/[0.04] text-accent"
      }`}
    >
      <span className="h-1 w-1 rounded-full bg-accent" />
      {children}
    </span>
  );
}

export function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-accent">
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" />
        </svg>
      ))}
    </span>
  );
}

type CTAProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "accent" | "outline";
  onDark?: boolean;
  external?: boolean;
};

export function CTA({ href, children, variant = "solid", onDark = false, external = false }: CTAProps) {
  const styles: Record<string, string> = {
    solid: onDark ? "bg-bg text-fg" : "bg-fg text-bg",
    accent: "bg-accent text-white",
    outline: onDark
      ? "border border-white/25 text-ondark hover:bg-white/10"
      : "border border-line text-fg hover:bg-fg/5",
  };
  const knob =
    variant === "outline"
      ? "hidden"
      : variant === "accent"
        ? "bg-white/20"
        : onDark
          ? "bg-fg/10"
          : "bg-bg/15";
  const inner = (
    <>
      <span>{children}</span>
      {variant !== "outline" && (
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${knob} transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px]`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </>
  );
  const cls = `group inline-flex items-center gap-2 rounded-full text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
    variant === "outline" ? "px-6 py-3" : "py-3 pl-6 pr-2.5"
  } ${styles[variant]}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  onDark = false,
  center = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  onDark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>
      <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05]">{title}</h2>
      {intro && (
        <p className={`mt-5 text-lg leading-relaxed ${onDark ? "text-ondarkmuted" : "text-muted"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
