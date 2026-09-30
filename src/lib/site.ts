export const site = {
  name: "Jupiter Granite Co.",
  shortName: "Jupiter Granite",
  phone: "(561) 352-6232",
  phoneHref: "tel:+15613526232",
  phoneLabel: "Showroom appointments & estimating",
  fax: "(561) 741-3924",
  email: "info@jupitergranite.com",
  ownerEmail: "jason@jupitergranite.com",
  address: {
    street: "952 Jupiter Park Lane, Suite 2",
    city: "Jupiter",
    state: "FL",
    zip: "33458",
  },
  // Non-Google directions link built from the address.
  mapsUrl:
    "https://maps.apple.com/?address=952+Jupiter+Park+Ln+Suite+2,+Jupiter,+FL+33458",
  // Non-Google map of the same address: OpenStreetMap, marker from OSM's own geocode of
  // "952 Jupiter Park Lane" (26.9254828, -80.1437549).
  mapsEmbed:
    "https://www.openstreetmap.org/export/embed.html?bbox=-80.1537%2C26.9205%2C-80.1337%2C26.9305&layer=mapnik&marker=26.92548%2C-80.14375",
  facebook: "https://www.facebook.com/people/Jupiter-Granite-Co/100041686732236/",
  hours: "Mon – Fri · 9 AM – 5 PM · Showroom by appointment",
  license: "U-21494",
  owner: "Jason Demick",
  contacts: [
    { name: "Marcos", role: "Showroom Appointments & Estimating" },
    { name: "Nikki", role: "Showroom Appointments & Estimating" },
    { name: "Jason Demick", role: "Owner", email: "jason@jupitergranite.com" },
  ],
} as const;

/* ---------------- Navigation ---------------- */

export const nav = [
  { label: "Materials", href: "/materials" },
  { label: "Services", href: "/services" },
  { label: "Technology", href: "/technology" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
] as const;

/* ---------------- Materials ---------------- */

export const materials = [
  {
    slug: "granite",
    name: "Granite",
    tagline: "Lighter and darker color granites.",
    body: "Lighter and darker color granites for kitchens, vanities, bars and summer kitchens. All photos are actual jobs fabricated and installed by Jupiter Granite Co.",
    img: "/img/granite-tropical-brown.jpg",
    alt: "Tropical Brown granite kitchen",
    swatches: [
      { src: "/img/granite-golden-river.jpg", alt: "Golden River granite" },
      { src: "/img/granite-florensa-red.jpg", alt: "Florensa Red granite" },
      { src: "/img/granite-shivikashi.jpg", alt: "Shivikashi granite" },
      { src: "/img/granite-lady-dream.jpg", alt: "Lady Dream granite" },
    ],
  },
  {
    slug: "marble",
    name: "Marble",
    tagline: "Marble, the world's most popular stone finish!",
    body: "Statuary, Carrera, Travertine, Golden Travertine, New Porto, Verde Atlantis, Breccia Oniciata, Rainforest Green, Emporador, Rojo Alicante, Thasos and Mexican Shell Stone. On one job, nothing went to waste: we made the backsplash from the remaining Statuary and Costa Esmerelda, milled and cut to size on our CNC machine.",
    img: "/img/marble-statuary-costa-esmerelda-tub.jpg",
    alt: "Statuary & Costa Esmerelda tub surround",
    swatches: [
      { src: "/img/marble-breccia-oniciata.jpg", alt: "Breccia Oniciata marble" },
      { src: "/img/marble-rainforest-green.jpg", alt: "Rainforest Green marble" },
      { src: "/img/marble-emporador.jpg", alt: "Emporador marble" },
      { src: "/img/marble-statuary-supreme.jpg", alt: "Statuary Supreme marble" },
    ],
  },
  {
    slug: "quartz",
    name: "Fine Quartz",
    tagline: "Low maintenance, high durability, endless color.",
    body: "The largest variety of quartz surfaces from names like SileStone, CaesarStone, Zodiaq, Compac, Cambria, HanStone and many others. We are certified fabricators and installers: each quartz company has strict guidelines for fabricating and installing its products, and will not warranty work done by non-certified fabricators or installers.",
    img: "/img/quartz-zodiaq-celestial-blue.jpg",
    alt: "Zodiaq Celestial Blue quartz",
    swatches: [
      { src: "/img/quartz-stellar-snow.jpg", alt: "Stellar Snow SileStone" },
      { src: "/img/quartz-ebony-reflections.jpg", alt: "CaesarStone Ebony Reflections" },
      { src: "/img/quartz-champagne-limestone.jpg", alt: "CaesarStone Champagne Limestone" },
      { src: "/img/quartz-chrome-silestone.jpg", alt: "Chrome SileStone" },
    ],
  },
  {
    slug: "semi-precious",
    name: "Semi-Precious Gem Stones",
    tagline: "Ultra luxurious, semi-precious, gem stones.",
    body: "Concetto, Exotica & Gem Surfaces, for countertops, floors, walls, tables and other furniture. Available in 20mm-30mm thicknesses for general applications, and 10mm-15mm with aluminum honeycomb backing for light weight applications such as private aircraft and vessels. We are your international gem surface specialists.",
    img: "/img/gem-blue-agate.jpg",
    alt: "Blue Agate",
    swatches: [
      { src: "/img/gem-amethyst.jpg", alt: "Amethyst" },
      { src: "/img/gem-ice-quartz.jpg", alt: "Ice Quartz" },
      { src: "/img/gem-petrified-wood.jpg", alt: "Petrified Wood Classic" },
      { src: "/img/gem-smokey-quartz.jpg", alt: "Smokey Quartz" },
    ],
  },
] as const;

export const quartzBrands = [
  "Cambria",
  "Silestone",
  "Caesarstone",
  "Compac",
  "HanStone",
  "Zodiaq",
];

/* ---------------- Services ---------------- */

export const services = [
  {
    slug: "custom-work",
    name: "Custom Work",
    blurb:
      "Travertine fireplaces, quartz columns, decorative granite floor medallions, marble stair treads and risers, and many more.",
    img: "/img/custom-stair.jpg",
    alt: "Custom work: a curved stone staircase",
  },
  {
    slug: "summer-kitchens",
    name: "Summer Kitchens",
    blurb:
      "We build Summer Kitchens, from start to finish!",
    img: "/img/summer-kitchen.jpg",
    alt: "A summer kitchen with a built-in grill",
  },
  {
    slug: "fireplaces-columns",
    name: "Fireplaces & Columns",
    blurb:
      "One fireplace we installed was carved from solid marble. We also set solid marble columns.",
    img: "/img/fireplace-travertine-marble.jpg",
    alt: "Travertine Marble Fireplace",
  },
  {
    slug: "marine",
    name: "Marine Applications",
    blurb:
      "On the Lazzara vessel “Maggie” we replaced the wood flooring with HanStone quartz slabs, milled to 8mm to match the previous floor. We can mill stone to any thickness and add an aluminum honeycomb backing for strength.",
    img: "/img/marine-lazzara-maggie.jpg",
    alt: "The Lazzara vessel “Maggie”",
  },
  {
    slug: "repair-restoration",
    name: "Repair & Restoration",
    blurb:
      "Installation, repairs, restoration and maintenance, from marble floor crystallization and buffing to diamond grinding, honing and polishing. Chipped, scratched or cracked? Seams settling? Don't worry. We can fix it!",
    img: "/img/repair-crema-marfil-polish.jpg",
    alt: "Crema Marfil floor repair: finished polish",
  },
  {
    slug: "sinks",
    name: "Sinks & Faucets",
    blurb:
      "A huge variety of standard and designer sinks and faucets, from under mount to vessel: stainless, cast iron, hammered copper, stone composite, porcelain, glass and a giant clam shell.",
    img: "/img/sink-hammered-vessel.jpg",
    alt: "A textured under-mount sink in a granite top",
  },
  {
    slug: "3d-renderings",
    name: "3-D Renderings",
    blurb:
      "See EXACTLY what the finished layout will look like before we cut it! Our project for saxophonist Clarence Clemons required vein matching of 9 slabs of Blue Luis.",
    img: "/img/rendering-slab-layout.jpg",
    alt: "3-D rendering: kitchen and backsplash slab layout",
  },
] as const;

/* ---------------- Technology / The Shop ---------------- */

export const shopTech = [
  {
    name: "Laser templating since 2007",
    body: "No wood sticks and hot glue. We use the LT-55 XL Precision Laser Templator, and from the field we email the pictures, template and customer's signature back to the shop to begin fabrication.",
    img: "/img/shop-laser-templating.jpg",
    alt: "Laser templating in a client kitchen",
  },
  {
    name: "5-axis CNC fabrication",
    body: "The Denver Skema Logic C-180 CNC bridge saw can cut an entire kitchen automatically. It is more accurate, faster and easier to use than conventional saws, with user-friendly CAD-CAM software behind it.",
    img: "/img/shop-skema-cnc.jpg",
    alt: "The Denver Skema CNC bridge saw in our shop",
  },
  {
    name: "World's 1st 5 axis saw-water jet",
    body: "Jupiter Granite purchases world's 1st 5 axis saw-water jet! Laser templating, water-jet and CNC fabrication means we get it perfect every time.",
    img: "/img/shop-shaped-top-saw.jpg",
    alt: "A shaped cut in a stone slab on the saw bed in our shop",
  },
  {
    name: "Material handling & seam setting",
    body: "A Manzelli vacuum lifter and Gorbel overhead crane pick up slabs weighing as much as 2,200 lbs and tilt them from vertical to horizontal. Our Gorilla Grip seam clamp levels the seam and pulls it tight. We guarantee our seams will never settle or crack.",
    img: "/img/shop-vacuum-lifter.jpg",
    alt: "The Manzelli vacuum lifter on a shaped slab",
  },
] as const;

/* ---------------- Estimate steps ---------------- */

export const estimateSteps = [
  "A simple sketch with shapes and dimensions along the walls — note raised bars, overhangs, arches and backsplashes.",
  "Your material selection.",
  "Whether we need to remove any existing surfaces.",
  "Your contact information and the project location.",
] as const;

/* ---------------- Gallery ---------------- */

// Every photo is from their own photo albums on jupitergranite.com (captions are theirs).
// Spans sit at 0, 5, 10 and 16 so the 4-column grid fills 24 cells with no holes.
export const gallery = [
  { src: "/img/g-clam-shell-shell-stone.jpg", alt: "Giant clam shell sink on a Mexican Shell Stone top", span: "lg:col-span-2 lg:row-span-2" },
  { src: "/img/g-honey-onyx.jpg", alt: "Honey Onyx vanity top" },
  { src: "/img/g-emporador.jpg", alt: "Emporador marble vanity with a vessel sink" },
  { src: "/img/g-emerald-pearl.jpg", alt: "Emerald Pearl granite kitchen" },
  { src: "/img/g-carrera.jpg", alt: "Carrera marble double vanity" },
  { src: "/img/g-solarium-bar.jpg", alt: "Solarium Bar", span: "lg:col-span-2" },
  { src: "/img/g-golden-beach.jpg", alt: "Golden Beach granite with a double sink" },
  { src: "/img/g-travertine-desk.jpg", alt: "Travertine Desk" },
  { src: "/img/g-new-venetian-gold.jpg", alt: "New Venetian Gold granite kitchen" },
  { src: "/img/g-chiseled-travertine.jpg", alt: "Chiseled travertine bathroom" },
  { src: "/img/g-caesarstone-oyster.jpg", alt: "Caesarstone Oyster waterfall counter", span: "lg:col-span-2" },
  { src: "/img/g-madura-gold.jpg", alt: "Madura Gold granite" },
  { src: "/img/g-travertine-rojo-alicante.jpg", alt: "Travertine with Rojo Alicante & Crema Marfil" },
  { src: "/img/g-giallo-mac.jpg", alt: "Giallo Mac granite vanity" },
  { src: "/img/g-statuary-costa-esmerelda.jpg", alt: "Statuary & Costa Esmerelda vanity" },
  { src: "/img/g-red-dragon.jpg", alt: "Red Dragon granite vanity" },
  { src: "/img/g-desert-limestone.jpg", alt: "Desert Limestone Caesarstone", span: "lg:col-span-2" },
  { src: "/img/g-super-white.jpg", alt: "Super White kitchen" },
] as const;
