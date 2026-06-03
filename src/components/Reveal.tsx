"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  eager = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
  eager?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (eager) return; // CSS animation handles it
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  if (eager) {
    return (
      <Tag
        className={`reveal-eager ${className}`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
