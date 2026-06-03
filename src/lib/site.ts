export const site = {
  name: "Jupiter Granite Co.",
  shortName: "Jupiter Granite",
  phone: "(561) 352-6232",
  phoneHref: "tel:+15613526232",
  email: "info@jupitergranite.com",
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
} as const;

export const materials = [
  {
    name: "Quartzite",
    blurb:
      "Nature's hardest decorative stone — the depth of marble with the resilience of granite.",
    img: "/img/mat-quartzite.jpg",
  },
  {
    name: "Marble",
    blurb:
      "Timeless veining for those who want a kitchen that reads like sculpture.",
    img: "/img/mat-marble.jpg",
  },
  {
    name: "Granite",
    blurb:
      "Endlessly varied, virtually indestructible, and warm underhand for generations.",
    img: "/img/mat-river-white.jpg",
  },
  {
    name: "Quartz",
    blurb:
      "Engineered consistency from Cambria, Silestone & Caesarstone — color without compromise.",
    img: "/img/mat-calacatta.jpg",
  },
  {
    name: "Porcelain",
    blurb:
      "Ultra-thin large-format slabs for facades, floors and feather-light waterfalls.",
    img: "/img/detail-edge.jpg",
  },
  {
    name: "Semi-Precious",
    blurb:
      "Backlit agate, onyx and gemstone surfaces — our signature one-of-a-kind statements.",
    img: "/img/agate-detail.jpg",
  },
] as const;

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
  { src: "/img/detail-sink.jpg", alt: "Hand-polished undermount sink cutout" },
  { src: "/img/k-traditional-wood.jpg", alt: "Traditional wood kitchen with calacatta island" },
] as const;

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

export const nav = [
  { label: "Materials", href: "#materials" },
  { label: "Signature", href: "#signature" },
  { label: "Craft", href: "#process" },
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#about" },
] as const;
