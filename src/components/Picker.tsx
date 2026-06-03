"use client";

import { useEffect, useState } from "react";
import {
  themes, fonts, logos, naturalMode,
  DEFAULT_THEME, DEFAULT_FONT, DEFAULT_LOGO,
  type ThemeId, type FontId, type LogoId, type ModeId,
} from "@/lib/themes";

const THEME_KEY = "jg-theme";
const FONT_KEY = "jg-font";
const LOGO_KEY = "jg-logo";
const MODE_KEY = "jg-mode";
const DISMISS_KEY = "jg-picker-dismissed";

export function Picker() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [font, setFont] = useState<FontId>(DEFAULT_FONT);
  const [logo, setLogo] = useState<LogoId>(DEFAULT_LOGO);
  const [mode, setMode] = useState<ModeId | null>(null);

  useEffect(() => {
    setTheme((localStorage.getItem(THEME_KEY) as ThemeId) || DEFAULT_THEME);
    setFont((localStorage.getItem(FONT_KEY) as FontId) || DEFAULT_FONT);
    setLogo((localStorage.getItem(LOGO_KEY) as LogoId) || DEFAULT_LOGO);
    const m = localStorage.getItem(MODE_KEY);
    setMode(m === "light" || m === "dark" ? m : null);
    // Open by default on first visit; stay closed once dismissed.
    if (!localStorage.getItem(DISMISS_KEY)) setOpen(true);
  }, []);

  // Any close is remembered so it doesn't reopen on every page.
  function close() {
    setOpen(false);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
  }
  function toggle() {
    setOpen((o) => {
      if (!o) return true;
      try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
      return false;
    });
  }

  const effectiveMode: ModeId = mode ?? naturalMode(theme);

  function applyTheme(id: ThemeId) {
    setTheme(id);
    document.documentElement.dataset.theme = id;
    localStorage.setItem(THEME_KEY, id);
  }
  function applyFont(id: FontId) {
    setFont(id);
    document.documentElement.dataset.font = id;
    localStorage.setItem(FONT_KEY, id);
  }
  function applyLogo(id: LogoId) {
    setLogo(id);
    document.documentElement.dataset.logo = id;
    localStorage.setItem(LOGO_KEY, id);
  }
  function applyMode(m: ModeId) {
    setMode(m);
    document.documentElement.dataset.mode = m;
    localStorage.setItem(MODE_KEY, m);
  }

  const serif = fonts.filter((f) => f.kind === "serif");
  const sans = fonts.filter((f) => f.kind === "sans");

  const fontRow = (f: (typeof fonts)[number]) => (
    <button
      key={f.id}
      onClick={() => applyFont(f.id)}
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
        font === f.id ? "bg-fg text-bg" : "hover:bg-fg/5"
      }`}
    >
      <span className="text-[0.8rem]">{f.name}</span>
      {font === f.id && (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
    </button>
  );

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {open && (
        <div className="pointer-events-auto w-[19rem] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-2xl shadow-black/20">
          <div className="no-bar max-h-[calc(100dvh-7.5rem)] overflow-y-auto rounded-[calc(1rem-0.375rem)] bg-bg p-4">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-accent">Appearance</span>
              <button onClick={close} aria-label="Close" className="text-faint hover:text-fg">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" /></svg>
              </button>
            </div>

            {/* Light / dark toggle */}
            <div className="mt-3 flex rounded-full border border-line p-1">
              {(["light", "dark"] as ModeId[]).map((m) => (
                <button
                  key={m}
                  onClick={() => applyMode(m)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-[0.78rem] font-medium capitalize transition-colors ${
                    effectiveMode === m ? "bg-fg text-bg" : "text-muted hover:text-fg"
                  }`}
                >
                  {m === "light" ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinejoin="round" /></svg>
                  )}
                  {m}
                </button>
              ))}
            </div>

            <div className="mt-4 eyebrow text-accent">Theme</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTheme(t.id)}
                  className={`group rounded-xl border p-2.5 text-left transition-colors ${
                    theme === t.id ? "border-accent bg-fg/[0.04]" : "border-line hover:border-fg/20"
                  }`}
                >
                  <div className="flex gap-1">
                    {t.swatch.map((c, i) => (
                      <span key={i} className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="mt-2 text-[0.8rem] font-medium text-fg">{t.name}</div>
                  <div className="text-[0.62rem] leading-tight text-faint">{t.desc}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 eyebrow text-accent">Logo</div>
            <div className="mt-2 flex flex-col gap-1">
              {logos.map((l) => (
                <button
                  key={l.id}
                  onClick={() => applyLogo(l.id)}
                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    logo === l.id ? "bg-fg text-bg" : "hover:bg-fg/5"
                  }`}
                >
                  <span className="text-[0.8rem]">{l.name}</span>
                  <span className="flex h-6 w-24 items-center justify-end overflow-hidden rounded bg-white/90 px-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.preview} alt="" className="max-h-5 w-auto object-contain" />
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 eyebrow text-accent">Typeface</div>
            <div className="mt-2 flex flex-col gap-1">
              <div className="px-3 pt-1 text-[0.6rem] uppercase tracking-wider text-faint">Serif</div>
              {serif.map(fontRow)}
              <div className="px-3 pt-2 text-[0.6rem] uppercase tracking-wider text-faint">Sans-serif</div>
              {sans.map(fontRow)}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        aria-label="Customize appearance"
        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-dark text-ondark shadow-xl shadow-black/30 transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 0 0 18 3 3 0 0 0 0-6 2 2 0 0 1 0-4 3 3 0 0 0 0-8Z" />
          <circle cx="8.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>
  );
}

export function ThemeScript() {
  const code = `(function(){try{var d=document.documentElement;d.dataset.theme=localStorage.getItem('${THEME_KEY}')||'${DEFAULT_THEME}';d.dataset.font=localStorage.getItem('${FONT_KEY}')||'${DEFAULT_FONT}';d.dataset.logo=localStorage.getItem('${LOGO_KEY}')||'${DEFAULT_LOGO}';var m=localStorage.getItem('${MODE_KEY}');if(m==='light'||m==='dark')d.dataset.mode=m;}catch(e){var x=document.documentElement;x.dataset.theme='${DEFAULT_THEME}';x.dataset.font='${DEFAULT_FONT}';x.dataset.logo='${DEFAULT_LOGO}';}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
