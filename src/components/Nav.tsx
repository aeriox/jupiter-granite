"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";
import { nav, site } from "@/lib/site";

export function Nav({ overHero = false }: { overHero?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const solid = scrolled || !overHero;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4">
      <nav
        className={`pointer-events-auto mt-5 flex w-full max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 pl-5 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          solid ? "border-white/10 bg-dark/80 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <Link href="/" aria-label="Jupiter Granite — home">
          <Wordmark onDark />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-ondarkmuted transition-colors duration-300 hover:text-ondark"
            >
              {n.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="group hidden items-center gap-2 rounded-full bg-bg py-2 pl-4 pr-2 text-sm font-medium text-fg transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] sm:flex"
          >
            <span>Get an estimate</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-fg/10 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-[1px]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 md:hidden"
          >
            <span className={`absolute h-px w-4 bg-ondark transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "rotate-45" : "-translate-y-1"}`} />
            <span className={`absolute h-px w-4 bg-ondark transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "-rotate-45" : "translate-y-1"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`pointer-events-auto fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-dark/95 px-8 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {nav.map((n, i) => (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={`font-display text-4xl text-ondark transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
          >
            {n.label}
          </Link>
        ))}
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className={`mt-8 inline-flex w-max items-center gap-3 rounded-full bg-accent px-6 py-3 text-base font-medium text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: open ? `${120 + nav.length * 60}ms` : "0ms" }}
        >
          Get an estimate
        </Link>
      </div>
    </header>
  );
}
