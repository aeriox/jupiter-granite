import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jupitergranite.co"),
  title: {
    default: "Jupiter Granite Co. — Custom Stone Countertops in Jupiter, FL",
    template: "%s · Jupiter Granite Co.",
  },
  description:
    "Three generations of master stone craftsmanship on Florida's Treasure Coast. Custom granite, quartzite, marble & quartz countertops — laser-templated, 5-axis fabricated, and guaranteed for life. Rated 4.9★ across 190 Google reviews.",
  keywords: [
    "granite countertops Jupiter FL",
    "quartz countertops Palm Beach",
    "marble fabrication Jupiter",
    "quartzite countertops",
    "Cambria dealer Jupiter",
    "custom stone countertops Florida",
  ],
  openGraph: {
    title: "Jupiter Granite Co. — Custom Stone Countertops in Jupiter, FL",
    description:
      "Master stone craftsmanship since 2000. Granite, quartzite, marble & quartz — guaranteed for life.",
    type: "website",
    locale: "en_US",
    images: ["/img/k-calacatta-waterfall.jpg"],
  },
  icons: { icon: "/favicon.ico" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.name,
  image: "https://jupitergranite.co/img/storefront.jpg",
  telephone: site.phone,
  url: "https://jupitergranite.co",
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: site.rating,
    reviewCount: site.reviewCount,
  },
  areaServed: "Palm Beach County, FL",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="grain min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
