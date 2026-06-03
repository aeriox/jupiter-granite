export type ThemeId = "atelier" | "coastal" | "mosaic" | "monolith";
export type ModeId = "light" | "dark";
export type FontId =
  | "fraunces"
  | "cormorant"
  | "playfair"
  | "dmserif"
  | "space"
  | "bricolage"
  | "syne"
  | "schibsted"
  | "montserrat"
  | "dmsans"
  | "jost"
  | "poppins";
export type LogoId = "block" | "serif";

export const themes: {
  id: ThemeId;
  name: string;
  desc: string;
  swatch: [string, string, string];
}[] = [
  { id: "atelier", name: "Atelier", desc: "Editorial luxury · warm stone & bronze", swatch: ["#f4efe6", "#15130f", "#b58a4d"] },
  { id: "coastal", name: "Coastal", desc: "Light & airy · ocean blue", swatch: ["#ffffff", "#0e2530", "#1685b8"] },
  { id: "mosaic", name: "Mosaic", desc: "Full-bleed editorial · flush galleries", swatch: ["#faf8f4", "#111010", "#a8794f"] },
  { id: "monolith", name: "Monolith", desc: "Architectural · sharp & minimal", swatch: ["#16161a", "#f2f0eb", "#c9a877"] },
];

export const fonts: { id: FontId; name: string; kind: "serif" | "sans" }[] = [
  { id: "fraunces", name: "Fraunces / Jakarta", kind: "serif" },
  { id: "cormorant", name: "Cormorant / Mulish", kind: "serif" },
  { id: "playfair", name: "Playfair / Manrope", kind: "serif" },
  { id: "dmserif", name: "DM Serif / DM Sans", kind: "serif" },
  { id: "montserrat", name: "Montserrat", kind: "sans" },
  { id: "dmsans", name: "DM Sans", kind: "sans" },
  { id: "jost", name: "Jost (Gotham-style)", kind: "sans" },
  { id: "poppins", name: "Poppins (Garet-style)", kind: "sans" },
  { id: "space", name: "Space Grotesk / Sora", kind: "sans" },
  { id: "bricolage", name: "Bricolage / Hanken", kind: "sans" },
  { id: "syne", name: "Syne / Outfit", kind: "sans" },
  { id: "schibsted", name: "Schibsted Grotesk", kind: "sans" },
];

export const logos: { id: LogoId; name: string; preview: string }[] = [
  { id: "block", name: "Planet wordmark", preview: "/img/logos/block-on-light.png" },
  { id: "serif", name: "Marble serif", preview: "/img/logos/serif-on-light.png" },
];

export const DEFAULT_THEME: ThemeId = "atelier";
export const DEFAULT_FONT: FontId = "fraunces";
export const DEFAULT_LOGO: LogoId = "block";

/** Natural mode for a theme when the visitor hasn't picked one. */
export function naturalMode(theme: ThemeId): ModeId {
  return theme === "monolith" ? "dark" : "light";
}
