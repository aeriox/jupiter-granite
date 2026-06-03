export type ThemeId = "atelier" | "coastal" | "mosaic" | "monolith";
export type FontId = "fraunces" | "cormorant" | "space" | "playfair" | "dmserif";
export type LogoId = "wave" | "block" | "serif";

export const themes: {
  id: ThemeId;
  name: string;
  desc: string;
  swatch: [string, string, string];
}[] = [
  { id: "atelier", name: "Atelier", desc: "Editorial luxury · warm stone & bronze", swatch: ["#f4efe6", "#15130f", "#b58a4d"] },
  { id: "coastal", name: "Coastal", desc: "Light & airy · ocean blue", swatch: ["#ffffff", "#0e2530", "#1685b8"] },
  { id: "mosaic", name: "Mosaic", desc: "Full-bleed editorial · flush galleries", swatch: ["#faf8f4", "#111010", "#a8794f"] },
  { id: "monolith", name: "Monolith", desc: "Dark & architectural", swatch: ["#0c0c0d", "#f2f0eb", "#c9a877"] },
];

export const fonts: { id: FontId; name: string; display: string }[] = [
  { id: "fraunces", name: "Fraunces / Jakarta", display: "Fraunces" },
  { id: "cormorant", name: "Cormorant / Mulish", display: "Cormorant Garamond" },
  { id: "space", name: "Space Grotesk / Sora", display: "Space Grotesk" },
  { id: "playfair", name: "Playfair / Manrope", display: "Playfair Display" },
  { id: "dmserif", name: "DM Serif / DM Sans", display: "DM Serif Display" },
];

export const logos: { id: LogoId; name: string; preview: string; previewOnDark: boolean }[] = [
  { id: "wave", name: "Wave mark", preview: "", previewOnDark: true },
  { id: "block", name: "Planet wordmark", preview: "/img/logos/block-on-light.png", previewOnDark: false },
  { id: "serif", name: "Marble serif", preview: "/img/logos/serif-on-light.png", previewOnDark: false },
];

export const DEFAULT_THEME: ThemeId = "atelier";
export const DEFAULT_FONT: FontId = "fraunces";
export const DEFAULT_LOGO: LogoId = "wave";
