"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Tells the AERIOX add-on scripts (public/aeriox/*.js) that the page changed. They load once, in the root
 * layout, and the layout stays mounted across client-side <Link> navigation, so on each new route they look up
 * the page's own parts again (the header, the home hero's buttons) through window "ax:route".
 */
export function AerioxRoute() {
  const pathname = usePathname();
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("ax:route")));
    return () => cancelAnimationFrame(id);
  }, [pathname]);
  return null;
}
