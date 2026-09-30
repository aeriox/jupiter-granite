# Jupiter Granite Co. — Website

Marketing site for [Jupiter Granite Co.](https://jupitergranite.com), a custom stone fabricator in Jupiter, FL (granite, marble, onyx, quartz & semi-precious gem stones).

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
    icon.png       # favicon (their own logo, from their Facebook page)
  components/
    Nav.tsx        # floating glass nav + mobile overlay
    Gallery.tsx    # bento grid + lightbox
    Reveal.tsx     # IntersectionObserver scroll reveals
    Logo.tsx       # SVG facet mark + wordmark
  lib/
    site.ts        # business info, materials, services, gallery
public/img/        # their own project photography
```

## Content notes

Copy and facts come from Jupiter Granite Co.'s own site (jupitergranite.com) and their
Facebook page. Every photo in `public/img/` is from their own site and photo albums, with
their captions as alt text. No Google data (ratings, reviews, photos, maps) is used. Update
copy and imagery in `src/lib/site.ts` and `public/img/` as needed.
