"use client";

import { site } from "@/lib/site";

/**
 * Mobile-only thumb bar: Free estimate (/contact) + Call (tel:).
 * Hidden while the appearance picker is open (`html[data-picker-open="1"]`).
 * Phone comes from site.ts — never invent numbers; if phoneHref is missing,
 * the estimate CTA alone remains.
 */
export function StickyMobileBar() {
  const phoneHref = site.phoneHref?.trim() || "";
  const phoneLabel = site.phone?.trim() || "";
  const hasPhone = Boolean(phoneHref && phoneHref.startsWith("tel:"));
  const callName = site.owner?.trim()
    ? `Call ${site.owner.trim().split(/\s+/)[0]}`
    : "Call";

  return (
    <div className="sticky-mobile-bar" aria-label="Quick contact">
      <a href="/contact" className="sticky-mobile-estimate">
        Free estimate
      </a>
      {hasPhone && (
        <a href={phoneHref} className="sticky-mobile-call">
          <span className="sticky-mobile-call-label">{callName}</span>
          {phoneLabel ? <span className="sticky-mobile-call-num">{phoneLabel}</span> : null}
        </a>
      )}
    </div>
  );
}
