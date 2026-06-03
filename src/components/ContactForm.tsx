"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "ok" | "error";

const field =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-fg placeholder:text-faint outline-none transition focus:border-accent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("ok");
        form.reset();
      } else if (data.unconfigured) {
        // Graceful fallback: open the user's mail client pre-filled.
        const body = encodeURIComponent(
          `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || ""}\nProject location: ${payload.location || ""}\nMaterial: ${payload.material || ""}\nRemove existing surfaces: ${payload.removal || ""}\n\n${payload.message || ""}`
        );
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Estimate request — " + payload.name)}&body=${body}`;
        setStatus("idle");
      } else {
        setStatus("error");
        setError(data.error || "Something went wrong. Please call us or email " + site.email + ".");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please call us or email " + site.email + ".");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-[var(--radius)] border border-line bg-surface p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="mt-5 font-display text-2xl">Request received</h3>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          Thank you — we&apos;ll be in touch shortly. For anything urgent, call{" "}
          <a href={site.phoneHref} className="text-accent">{site.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius)] border border-line bg-surface p-1.5">
      <div className="rounded-[calc(var(--radius)-0.375rem)] bg-bg p-6 sm:p-8">
        {/* honeypot */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px]" aria-hidden />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="eyebrow text-faint">Name *</span>
            <input name="name" required placeholder="Your name" className={`mt-2 ${field}`} />
          </label>
          <label className="block">
            <span className="eyebrow text-faint">Email *</span>
            <input name="email" type="email" required placeholder="you@email.com" className={`mt-2 ${field}`} />
          </label>
          <label className="block">
            <span className="eyebrow text-faint">Phone</span>
            <input name="phone" placeholder="(561) 000-0000" className={`mt-2 ${field}`} />
          </label>
          <label className="block">
            <span className="eyebrow text-faint">Project location</span>
            <input name="location" placeholder="City / address" className={`mt-2 ${field}`} />
          </label>
          <label className="block">
            <span className="eyebrow text-faint">Material of interest</span>
            <select name="material" defaultValue="" className={`mt-2 ${field}`}>
              <option value="" disabled>Select…</option>
              <option>Granite</option>
              <option>Marble</option>
              <option>Fine Quartz</option>
              <option>Quartzite</option>
              <option>Semi-Precious Gem Stone</option>
              <option>Not sure yet</option>
            </select>
          </label>
          <label className="block">
            <span className="eyebrow text-faint">Remove existing surfaces?</span>
            <select name="removal" defaultValue="" className={`mt-2 ${field}`}>
              <option value="" disabled>Select…</option>
              <option>Yes</option>
              <option>No</option>
              <option>Not sure</option>
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="eyebrow text-faint">Project details</span>
          <textarea name="message" rows={4} placeholder="Tell us about your project — dimensions, rooms, timeline, or anything else. You can email a sketch separately." className={`mt-2 ${field} resize-none`} />
        </label>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex items-center gap-2 rounded-full bg-accent py-3 pl-6 pr-2.5 text-sm font-medium text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-60"
          >
            <span>{status === "sending" ? "Sending…" : "Send request"}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-[1px]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </button>
          <p className="text-xs text-faint">Or email <a href={`mailto:${site.email}`} className="text-accent">{site.email}</a></p>
        </div>

        {status === "error" && <p className="mt-4 text-sm text-accent">{error}</p>}
      </div>
    </form>
  );
}
