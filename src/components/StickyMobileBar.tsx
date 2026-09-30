"use client";

import { site } from "@/lib/site";

/**
 * Mobile-only thumb bar: Get an estimate (/contact) + Call the showroom (tel:).
 * The number is their "Showroom Appointments & Estimating" line, not a direct line,
 * so the label says so.
 * Hidden while the appearance picker is open (`html[data-picker-open="1"]`).
 * Phone comes from site.ts — never invent numbers; if phoneHref is missing,
 * the estimate CTA alone remains.
 */
export function StickyMobileBar() {
  const phoneHref = site.phoneHref?.trim() || "";
  const phoneLabel = site.phone?.trim() || "";
  const hasPhone = Boolean(phoneHref && phoneHref.startsWith("tel:"));

  return (
    <div className="sticky-mobile-bar" aria-label="Quick contact">
      <a href="/contact" className="sticky-mobile-estimate">
        Get an estimate
      </a>
      {hasPhone && (
        <a href={phoneHref} className="sticky-mobile-call">
          <span className="sticky-mobile-call-label">Call the showroom</span>
          {phoneLabel ? <span className="sticky-mobile-call-num">{phoneLabel}</span> : null}
        </a>
      )}
    </div>
  );
}
