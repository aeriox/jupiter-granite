# Jupiter Granite Co. — Website

Marketing site for [Jupiter Granite Co.](https://maps.google.com/?q=Jupiter+Granite+Co), a third-generation custom stone fabricator in Jupiter, FL (granite, quartzite, marble, quartz, porcelain & semi-precious surfaces).

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4**
- `next/font` — Fraunces (display) + Plus Jakarta Sans (body)
- Deployed on **Vercel**

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

```
src/
  app/
    layout.tsx     # fonts, SEO metadata, LocalBusiness JSON-LD
    page.tsx       # all page sections
    globals.css    # design tokens + animations
    icon.svg       # favicon (wave mark)
  components/
    Nav.tsx        # floating glass nav + mobile overlay
    Gallery.tsx    # bento grid + lightbox
    Reveal.tsx     # IntersectionObserver scroll reveals
    Logo.tsx       # SVG wave mark + wordmark
  lib/
    site.ts        # business info, materials, gallery, reviews
public/img/        # curated project photography
```

## Content notes

Business details, project photography and customer reviews were sourced from Jupiter
Granite Co.'s public Google Business Profile. Update copy and imagery in `src/lib/site.ts`
and `public/img/` as needed.
