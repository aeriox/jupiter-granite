"use client";

import { useEffect, useMemo, useState } from "react";
import { lookConfig, type LookPreset, type LookValues } from "@/lib/look.config";

const AXIS = ["layout", "theme", "palette", "font", "logo", "logoVariant", "nav"] as const;

function cloneValues(v: LookValues): LookValues {
  return {
    layout: v.layout,
    theme: v.theme,
    palette: v.palette,
    font: v.font,
    logo: v.logo,
    logoVariant: v.logoVariant || "",
    nav: v.nav,
  };
}

function valuesEqual(a: LookValues, b: LookValues) {
  return AXIS.every((k) => (a[k] || "") === (b[k] || ""));
}

function matchPresetId(values: LookValues, presets: LookPreset[]) {
  const hit = presets.find((p) => valuesEqual(values, p.values));
  return hit?.id ?? null;
}

function applyDom(values: LookValues) {
  const html = document.documentElement;
  html.setAttribute("data-switching", "1");
  html.dataset.layout = values.layout;
  html.dataset.mode = values.theme;
  html.dataset.theme = values.palette; // kit palette blob
  html.dataset.font = values.font;
  html.dataset.logo = values.logo;
  html.dataset.nav = values.nav;
  html.dataset.palette = values.palette;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => html.removeAttribute("data-switching"));
  });
}

export function LookThemeScript() {
  const d = lookConfig.DEFAULTS;
  const code = `(function(){try{var K=${JSON.stringify(lookConfig.key)};var D=${JSON.stringify(d)};var s=D;try{var r=localStorage.getItem(K);if(r){var p=JSON.parse(r);if(p&&typeof p==="object")s=Object.assign({},D,p);}}catch(e){}var h=document.documentElement;h.dataset.layout=s.layout||D.layout;h.dataset.mode=s.theme||D.theme;h.dataset.theme=s.palette||D.palette;h.dataset.font=s.font||D.font;h.dataset.logo=s.logo||D.logo;h.dataset.nav=s.nav||D.nav;h.dataset.palette=s.palette||D.palette;}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function Look() {
  const presets = lookConfig.PRESETS;
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [values, setValues] = useState<LookValues>(() => cloneValues(lookConfig.DEFAULTS));
  const [presetId, setPresetId] = useState<string | null>(presets[0]?.id ?? null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(lookConfig.key);
      if (!raw) {
        applyDom(lookConfig.DEFAULTS);
        return;
      }
      const parsed = JSON.parse(raw);
      const next = Object.assign(cloneValues(lookConfig.DEFAULTS), parsed) as LookValues;
      setValues(next);
      setPresetId(parsed.presetId || matchPresetId(next, presets));
      applyDom(next);
    } catch {
      applyDom(lookConfig.DEFAULTS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.dataset.pickerOpen = open ? "1" : "0";
    if (!open) delete document.documentElement.dataset.pickerOpen;
  }, [open]);

  function persist(next: LookValues, pid: string | null) {
    try {
      localStorage.setItem(lookConfig.key, JSON.stringify({ ...next, presetId: pid }));
    } catch {}
  }

  function commit(next: LookValues, pid: string | null) {
    setValues(next);
    setPresetId(pid);
    applyDom(next);
    persist(next, pid);
  }

  function applyPreset(p: LookPreset) {
    commit(cloneValues(p.values), p.id);
  }

  function setAxis<K extends keyof LookValues>(key: K, value: LookValues[K]) {
    const next = { ...values, [key]: value };
    commit(next, matchPresetId(next, presets));
  }

  function reset() {
    try { localStorage.removeItem(lookConfig.key); } catch {}
    commit(cloneValues(lookConfig.DEFAULTS), presets[0]?.id ?? null);
  }

  const status = useMemo(() => {
    if (!presetId) return "Custom";
    return presets.find((p) => p.id === presetId)?.name || "";
  }, [presetId, presets]);

  return (
    <div className={`look-picker pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 max-md:bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] ${open ? "is-open" : ""}`}>
      {open && (
        <div className="look-panel pointer-events-auto w-[19rem] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-2xl shadow-black/20">
          <div className="no-bar max-h-[min(70vh,calc(100dvh-5.5rem))] overflow-y-auto rounded-[calc(1rem-0.375rem)] bg-bg p-4">
            <div className="look-head flex items-center gap-2">
              <span className="eyebrow text-accent">Look</span>
              <span className="text-[0.7rem] text-faint">{status}</span>
              {!presetId && <span className="ml-auto text-[0.65rem] uppercase tracking-wider text-faint">Custom</span>}
              <button type="button" aria-label="Close" className="ml-auto text-faint hover:text-fg" onClick={() => setOpen(false)}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="look-presets mt-3 grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`look-preset rounded-xl border p-1.5 text-center transition-colors ${presetId === p.id ? "border-accent" : "border-line hover:border-fg/20"}`}
                  onClick={() => applyPreset(p)}
                  aria-label={p.name}
                >
                  <span
                    className="look-preset-thumb block aspect-[4/3] overflow-hidden rounded-lg bg-fg/5"
                    style={!p.thumb && p.swatch ? { background: `linear-gradient(135deg, ${p.swatch[0]} 0%, ${p.swatch[1]} 55%, ${p.swatch[2] || p.swatch[1]} 100%)` } : undefined}
                  >
                    {p.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.thumb} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-end p-1.5 text-[0.65rem] font-semibold" style={{ color: p.swatch?.[1] || "inherit" }}>
                        {p.name}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[0.72rem] font-medium">{p.name}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="look-customize-link mt-3 text-left text-[0.78rem] underline text-fg"
              aria-expanded={customize}
              aria-controls="look-customize"
              onClick={() => setCustomize((c) => !c)}
            >
              Customize
            </button>

            {customize && (
              <div id="look-customize" className="look-customize mt-3 space-y-3">
                {lookConfig.layouts.length >= 2 && (
                  <Axis label="Layout" options={lookConfig.layouts} value={values.layout} onPick={(id) => setAxis("layout", id)} />
                )}
                <Axis
                  label="Theme"
                  options={[{ id: "light", label: "Light" }, { id: "dark", label: "Dark" }]}
                  value={values.theme}
                  onPick={(id) => setAxis("theme", id as "light" | "dark")}
                />
                {lookConfig.palettes.length >= 2 && (
                  <Axis label="Palette" options={lookConfig.palettes} value={values.palette} onPick={(id) => setAxis("palette", id)} />
                )}
                {lookConfig.fonts.length >= 2 && (
                  <Axis label="Type" options={lookConfig.fonts} value={values.font} onPick={(id) => setAxis("font", id)} />
                )}
                {lookConfig.logos.length >= 2 && (
                  <Axis label="Logo" options={lookConfig.logos.map((l) => ({ id: l.id, label: l.label }))} value={values.logo} onPick={(id) => setAxis("logo", id)} />
                )}
                <Axis
                  label="Header"
                  options={[{ id: "pill", label: "Pill" }, { id: "bar", label: "Full width" }]}
                  value={values.nav}
                  onPick={(id) => setAxis("nav", id)}
                />
                <button type="button" className="look-reset text-[0.78rem] underline text-muted" onClick={reset}>
                  Reset to Look 1
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Look"
        aria-expanded={open}
        className="look-toggle pointer-events-auto flex h-12 items-center justify-center rounded-full bg-fg px-4 text-[0.8rem] max-md:h-10 max-md:px-3.5 max-md:text-[0.75rem] font-medium text-bg shadow-lg shadow-black/20"
      >
        Look
      </button>
    </div>
  );
}

function Axis({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onPick: (id: string) => void;
}) {
  return (
    <div>
      <div className="eyebrow text-accent">{label}</div>
      <div className="mt-2 flex flex-col gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onPick(o.id)}
            className={`rounded-lg px-3 py-2 text-left text-[0.8rem] transition-colors ${value === o.id ? "bg-fg text-bg" : "hover:bg-fg/5"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
