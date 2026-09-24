export type LookValues = {
  layout: string; theme: "light" | "dark"; palette: string; font: string;
  logo: string; logoVariant: string; nav: string;
};
export type LookPreset = { id: string; name: string; thumb?: string; swatch?: [string, string, string]; values: LookValues };
export const lookConfig = {
  key: "jupiter-granite-look",
  brand: "Jupiter Granite Co.",
  DEFAULTS: {"layout": "mosaic", "theme": "light", "palette": "atelier", "font": "fraunces", "logo": "block", "logoVariant": "", "nav": "pill"} as LookValues,
  PRESETS: [{"id": "current", "name": "Current", "thumb": "/img/k-white-island.jpg", "values": {"layout": "mosaic", "theme": "light", "palette": "atelier", "font": "fraunces", "logo": "block", "logoVariant": "", "nav": "pill"}}, {"id": "showroom", "name": "Showroom", "thumb": "/img/storefront.jpg", "values": {"layout": "editorial", "theme": "light", "palette": "coastal", "font": "montserrat", "logo": "serif", "logoVariant": "", "nav": "bar"}}, {"id": "artisan", "name": "Artisan", "thumb": "/img/mat-calacatta.jpg", "values": {"layout": "magazine", "theme": "dark", "palette": "monolith", "font": "cormorant", "logo": "stone", "logoVariant": "", "nav": "pill"}}] as LookPreset[],
  layouts: [{"id":"mosaic","label":"Mosaic"},{"id":"editorial","label":"Editorial"},{"id":"magazine","label":"Magazine"}],
  palettes: [{"id":"atelier","label":"Atelier"},{"id":"coastal","label":"Coastal"},{"id":"monolith","label":"Monolith"}],
  fonts: [{"id":"fraunces","label":"Fraunces / Jakarta"},{"id":"montserrat","label":"Montserrat"},{"id":"cormorant","label":"Cormorant / Mulish"}],
  logos: [
    {"id":"block","label":"Planet wordmark","preview":"/img/logos/block-on-light.png"},
    {"id":"blockinv","label":"Planet · inverted","preview":"/img/logos/block-inv-on-light.png"},
    {"id":"serif","label":"Marble serif","preview":"/img/logos/serif-on-light.png"},
    {"id":"stone","label":"Stone wordmark","preview":"/img/logos/stone-on-light.png"}
  ],
};
