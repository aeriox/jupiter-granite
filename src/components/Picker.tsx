"use client";

import { useEffect, useState } from "react";
import { themes, fonts, DEFAULT_THEME, DEFAULT_FONT, type ThemeId, type FontId } from "@/lib/themes";

const THEME_KEY = "jg-theme";
const FONT_KEY = "jg-font";

export function Picker() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [font, setFont] = useState<FontId>(DEFAULT_FONT);

  useEffect(() => {
    const t = (localStorage.getItem(THEME_KEY) as ThemeId) || DEFAULT_THEME;
    const f = (localStorage.getItem(FONT_KEY) as FontId) || DEFAULT_FONT;
    setTheme(t);
    setFont(f);
  }, []);

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

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {open && (
        <div className="pointer-events-auto w-[19rem] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-2xl shadow-black/20">
          <div className="rounded-[calc(1rem-0.375rem)] bg-bg p-4">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-accent">Theme</span>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-faint hover:text-fg">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
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

            <div className="mt-4 eyebrow text-accent">Typeface</div>
            <div className="mt-2 flex flex-col gap-1">
              {fonts.map((f) => (
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
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Customize theme"
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
  const code = `(function(){try{var t=localStorage.getItem('${THEME_KEY}')||'${DEFAULT_THEME}';var f=localStorage.getItem('${FONT_KEY}')||'${DEFAULT_FONT}';document.documentElement.dataset.theme=t;document.documentElement.dataset.font=f;}catch(e){document.documentElement.dataset.theme='${DEFAULT_THEME}';document.documentElement.dataset.font='${DEFAULT_FONT}';}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
