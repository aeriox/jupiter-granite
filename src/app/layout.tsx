import type { Metadata } from "next";
import {
  Fraunces,
  Plus_Jakarta_Sans,
  Cormorant_Garamond,
  Mulish,
  Space_Grotesk,
  Sora,
  Playfair_Display,
  Manrope,
  DM_Serif_Display,
  DM_Sans,
  Bricolage_Grotesque,
  Hanken_Grotesk,
  Syne,
  Outfit,
  Schibsted_Grotesk,
} from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Footer } from "@/components/Footer";
import { Picker, ThemeScript } from "@/components/Picker";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const mulish = Mulish({ variable: "--font-mulish", subsets: ["latin"], display: "swap" });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"], display: "swap" });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const dmSerif = DM_Serif_Display({ variable: "--font-dmserif", subsets: ["latin"], weight: "400", display: "swap" });
const dmSans = DM_Sans({ variable: "--font-dmsans", subsets: ["latin"], display: "swap" });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap" });
const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin"], display: "swap" });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"], display: "swap" });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap" });
const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"], display: "swap" });

const fontVars = [fraunces, jakarta, cormorant, mulish, space, sora, playfair, manrope, dmSerif, dmSans, bricolage, hanken, syne, outfit, schibsted]
  .map((f) => f.variable)
  .join(" ");

export const metadata: Metadata = {
  metadataBase: new URL("https://jupitergranite.com"),
  title: {
    default: "Jupiter Granite Co. — Custom Stone Countertops in Jupiter, FL",
    template: "%s · Jupiter Granite Co.",
  },
  description:
    "Three generations of master stone craftsmanship on Florida's Treasure Coast. Custom granite, quartzite, marble, quartz & semi-precious surfaces — laser-templated, 5-axis fabricated, guaranteed for life. Rated 4.9★ across 190 Google reviews.",
  keywords: [
    "granite countertops Jupiter FL",
    "quartz countertops Palm Beach",
    "marble fabrication Jupiter",
    "semi-precious gem surfaces",
    "Cambria dealer Jupiter",
    "custom stone countertops Florida",
  ],
  openGraph: {
    title: "Jupiter Granite Co. — Custom Stone Countertops in Jupiter, FL",
    description: "Master stone craftsmanship since 2000. Granite, marble, quartz & semi-precious — guaranteed for life.",
    type: "website",
    locale: "en_US",
    images: ["/img/k-calacatta-waterfall.jpg"],
  },
  icons: { icon: "/icon.svg" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.name,
  image: "https://jupitergranite.com/img/storefront.jpg",
  telephone: site.phone,
  email: site.email,
  url: "https://jupitergranite.com",
  priceRange: "$$$",
  foundingDate: String(site.established),
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 26.9254366, longitude: -80.144471 },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating, reviewCount: site.reviewCount },
  areaServed: "Palm Beach County, FL",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="atelier" data-font="fraunces" data-logo="block" suppressHydrationWarning className={`${fontVars} h-full antialiased`}>
      <head>
        <ThemeScript />
      </head>
      <body className="grain min-h-full">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <Footer />
        <Picker />
      </body>
    </html>
  );
}
