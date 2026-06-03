export const site = {
  name: "Jupiter Granite Co.",
  shortName: "Jupiter Granite",
  phone: "(561) 352-6232",
  phoneHref: "tel:+15613526232",
  fax: "(561) 741-3924",
  email: "info@jupitergranite.com",
  ownerEmail: "jason@jupitergranite.com",
  address: {
    street: "952 Jupiter Park Lane, Suite 2",
    city: "Jupiter",
    state: "FL",
    zip: "33458",
  },
  mapsUrl:
    "https://www.google.com/maps/place/Jupiter+Granite+Co./@26.9254366,-80.144471,17z",
  mapsEmbed:
    "https://www.google.com/maps?q=952+Jupiter+Park+Ln+Suite+2,+Jupiter,+FL+33458&output=embed",
  hours: "Mon – Fri · 9 AM – 5 PM · By appointment",
  rating: 4.9,
  reviewCount: 190,
  established: 2000,
  license: "U-21494",
  owner: "Jason Demick",
  contacts: [
    { name: "Marcos", role: "Showroom & estimating" },
    { name: "Nikki", role: "Showroom & estimating" },
    { name: "Jason Demick", role: "Owner & master craftsman", email: "jason@jupitergranite.com" },
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
    tagline: "Endlessly varied, virtually indestructible.",
    body: "Every slab is one of a kind, warm underhand and built to outlast the home around it. We fabricate and install lighter and darker granites for kitchens, baths, bars and outdoor living — all cut and finished in-house.",
    img: "/img/mat-river-white.jpg",
    swatches: ["/img/k-speckled.jpg", "/img/k-brown-veined.jpg", "/img/k-black-granite.jpg", "/img/k-blue-granite.jpg"],
  },
  {
    slug: "marble",
    name: "Marble",
    tagline: "The world's most timeless stone finish.",
    body: "Statuary, Carrera, Travertine, New Porto, Verde Atlantis, Breccia Oniciata, Rainforest Green, Emperador, Rojo Alicante and more. We mill and bookmatch on our CNC so nothing goes to waste — including the backsplash cut from a single remaining slab.",
    img: "/img/mat-marble.jpg",
    swatches: ["/img/mat-calacatta.jpg", "/img/backlit-marble.jpg", "/img/marble-moody.jpg", "/img/k-calacatta-waterfall.jpg"],
  },
  {
    slug: "quartz",
    name: "Fine Quartz",
    tagline: "Engineered color without compromise.",
    body: "The largest selection in the area — Cambria, Silestone, Caesarstone, Compac, HanStone, Zodiaq and more. Low maintenance, high durability, endless color. We're certified fabricators and installers, so your manufacturer warranty stays intact.",
    img: "/img/mat-quartzite.jpg",
    swatches: ["/img/k-white-island.jpg", "/img/k-waterfall-hood.jpg", "/img/k-island-wood.jpg", "/img/k-white-backsplash.jpg"],
  },
  {
    slug: "semi-precious",
    name: "Semi-Precious Gem Stones",
    tagline: "Ultra-luxurious surfaces that glow from within.",
    body: "Concetto, Exotica and gem surfaces — agate, onyx and quartz crystal for countertops, floors, walls, tables and furniture. Backlit for drama, and available with aluminum honeycomb backing at 10–15mm for private aircraft and vessels. We're international gem-surface specialists.",
    img: "/img/agate-detail.jpg",
    swatches: ["/img/backlit-agate-island.jpg", "/img/agate-runner.jpg", "/img/backlit-feature.jpg", "/img/backlit-marble.jpg"],
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
      "One-off commissions where the brief is simply: make it perfect. If it can be cut from stone, we've likely already built it.",
    img: "/img/k-conference-oceanview.jpg",
  },
  {
    slug: "summer-kitchens",
    name: "Summer Kitchens",
    blurb:
      "Outdoor kitchens built start to finish — surfaces engineered for Florida sun, salt air and entertaining.",
    img: "/img/k-travertine-living.jpg",
  },
  {
    slug: "fireplaces-columns",
    name: "Fireplaces & Columns",
    blurb:
      "Fireplaces carved from solid marble and columns capped by hand — architectural stonework, not cladding.",
    img: "/img/marble-moody.jpg",
  },
  {
    slug: "marine",
    name: "Marine Applications",
    blurb:
      "Stone for yachts and aircraft. On the Lazzara “Maggie” we milled HanStone quartz to 8mm to match the original floor — with honeycomb backing when weight matters.",
    img: "/img/mat-quartzite.jpg",
  },
  {
    slug: "repair-restoration",
    name: "Repair & Restoration",
    blurb:
      "Full-service stone care: crystallization, diamond grinding, honing and polishing. Chips, scratches, settling seams and dropping sinks — we fix what others can't.",
    img: "/img/detail-edge.jpg",
  },
  {
    slug: "sinks",
    name: "Sinks & Faucets",
    blurb:
      "From undermount to vessel — stainless, cast iron, hammered copper, stone composite, porcelain, glass, and even a client's 10-year-old giant clam shell turned into a sink.",
    img: "/img/detail-sink2.jpg",
  },
  {
    slug: "3d-renderings",
    name: "3-D Renderings",
    blurb:
      "See the finished layout before we cut. For saxophonist Clarence Clemons we vein-matched nine slabs of Blue Louise from a single rendering.",
    img: "/img/install-template.jpg",
  },
] as const;

/* ---------------- Technology / The Shop ---------------- */

export const shopTech = [
  {
    name: "Laser templating since 2007",
    body: "No wood sticks and hot glue. The LT-55 XL Precision Laser Templator captures your room to the millimeter; from the field we email the template, photos and your signature straight to the shop to begin fabrication.",
    img: "/img/install-template.jpg",
  },
  {
    name: "5-axis CNC fabrication",
    body: "Our Denver Skema Logic C-180 CNC bridge saw can cut an entire kitchen automatically — faster, more accurate and more repeatable than conventional saws, with full CAD/CAM design behind it.",
    img: "/img/tech-cnc.jpg",
  },
  {
    name: "World's-first 5-axis saw-waterjet",
    body: "Jupiter Granite purchased one of the first 5-axis saw-waterjets, cutting intricate radii, mitered waterfalls and drainboards to a tolerance the hand only ever has to finish — never correct.",
    img: "/img/tech-waterjet.jpg",
  },
  {
    name: "Effortless material handling & seam setting",
    body: "A Manzelli vacuum lifter and Gorbel overhead crane suspend slabs up to 2,200 lbs and tilt them from vertical to horizontal. Our Gorilla Grip seam clamp pulls invisible, lasting seams.",
    img: "/img/tech-polish.jpg",
  },
] as const;

/* ---------------- Estimate steps ---------------- */

export const estimateSteps = [
  "A simple sketch with shapes and dimensions along the walls — note raised bars, overhangs, arches and backsplashes.",
  "Your material selection (or bring photos / inspiration and we'll guide you).",
  "Whether we need to remove any existing surfaces.",
  "Your contact information and the project location.",
] as const;

/* ---------------- Gallery ---------------- */

export const gallery = [
  { src: "/img/k-calacatta-waterfall.jpg", alt: "Calacatta quartz waterfall island in a bright modern kitchen", span: "lg:col-span-2 lg:row-span-2" },
  { src: "/img/k-waterfall-hood.jpg", alt: "White waterfall island beneath a custom range hood" },
  { src: "/img/k-island-wood.jpg", alt: "Veined waterfall island over warm wood flooring" },
  { src: "/img/k-black-granite.jpg", alt: "Classic wood kitchen with black granite countertops" },
  { src: "/img/k-travertine-living.jpg", alt: "Travertine island flowing into a waterfront living space", span: "lg:col-span-2" },
  { src: "/img/k-white-backsplash.jpg", alt: "White kitchen with patterned stone backsplash" },
  { src: "/img/k-brown-veined.jpg", alt: "Brown-veined granite countertops with bar seating" },
  { src: "/img/k-conference-oceanview.jpg", alt: "Stone conference table overlooking the Intracoastal" },
  { src: "/img/k-speckled.jpg", alt: "Speckled granite counters in a transitional kitchen" },
  { src: "/img/k-open-concept.jpg", alt: "Open-concept island in a light-filled great room", span: "lg:col-span-2" },
  { src: "/img/k-mosaic.jpg", alt: "Quartz counters with mosaic tile backsplash" },
  { src: "/img/k-blue-granite.jpg", alt: "Blue pearl granite with matching tile" },
  { src: "/img/backlit-agate-island.jpg", alt: "Backlit blue agate semi-precious island" },
  { src: "/img/k-waterfall-pair.jpg", alt: "Paired white waterfall islands during installation" },
  { src: "/img/detail-sink.jpg", alt: "Hand-polished undermount sink cutout" },
  { src: "/img/k-traditional-wood.jpg", alt: "Traditional wood kitchen with calacatta island" },
  { src: "/img/k-grey.jpg", alt: "Grey-and-white transitional kitchen" },
  { src: "/img/k-white-corner.jpg", alt: "Bright white corner kitchen with quartz counters" },
] as const;

/* ---------------- Reviews ---------------- */

export const reviews = [
  {
    quote:
      "We are extremely happy with the quartz we chose and the timely installation. They worked hard to get us installed before the holidays and worked with our cabinet installer to figure out the best way to attach our shelves. Such a professional team.",
    name: "Tammy Drury",
    meta: "Google review · 5★",
  },
  {
    quote:
      "Working with Anastasia and all of the other employees was a true pleasure. From choosing our quartz slabs to the completed installation was effortless. The workmanship couldn't be better! We highly recommend Jupiter Granite to everyone.",
    name: "Robert Kohn",
    meta: "Google Local Guide · 5★",
  },
  {
    quote:
      "Beyond happy with the finished product. Ana is very professional and very sweet — taking her time helping me pick out the right color and answering every question. Very quick response with messages. Highly recommend Jupiter Granite.",
    name: "Liz Renneberg",
    meta: "Google review · 5★",
  },
] as const;
