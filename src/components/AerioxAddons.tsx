import Script from "next/script";
import { lookConfig } from "@/lib/look.config";
import { CHAT_SNIPPET } from "@/aeriox/chatSnippet";
import { AerioxRoute } from "./AerioxRoute";
import "@/aeriox/addons.css";

/**
 * The AERIOX add-ons on this demo, in the root layout after the Look panel:
 *  - "Buy this site": the ribbon and the purchase panel (public/aeriox/buy.js). Checkout runs on aeriox.co
 *    (demo "jupiter-granite-original"); the Look panel's "Buy this site with this look" (Look.tsx) and the
 *    footer's "Buy this site" (Footer.tsx) open it too, through data-buy-open.
 *  - "Talk to our front desk": the voice demo's pill (#vd, public/aeriox/voice-pill.js), which loads the call
 *    panel (public/aeriox/voice.js, tenant "jupiter-granite" on aeriox.co) on first use.
 *  - "Ask our front desk": the AI chat's launcher (#axc, tenant "jupiter-granite" on app.aeriox.co), in the
 *    pill's place, with Type | Talk in the chat.
 * Styles: src/aeriox/addons.css. Scripts load once and hear about client-side navigation through
 * AerioxRoute ("ax:route").
 */
export function AerioxAddons() {
  // What buy.js needs of the Look panel's config to name the picks in "Your look:" (src/lib/look.config.ts).
  const look = {
    layouts: lookConfig.layouts,
    palettes: lookConfig.palettes,
    fonts: lookConfig.fonts,
    logos: lookConfig.logos.map(({ id, label }) => ({ id, label })),
    PRESETS: lookConfig.PRESETS.map(({ id, name, values }) => ({ id, name, values })),
  };
  const lookJson = JSON.stringify(look).replace(/</g, "\\u003c");

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `window.__LOOK_CONFIG__=${lookJson};` }} />

      {/* Voice demo: an AERIOX agent answering as Jupiter Granite Co.'s front desk. Only the pill loads with the
          page; voice.js (the call panel) loads on its first hover, focus or tap. data-api is AERIOX's voice relay. */}
      <div className="vd" id="vd" data-api="https://aeriox.co">
        <button className="vd-pill" type="button" aria-haspopup="dialog" aria-expanded="false">
          <span className="vd-badge" aria-hidden="true">
            <svg className="vd-i" viewBox="0 0 24 24">
              <rect x="9" y="3" width="6" height="11.5" rx="3" />
              <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
            </svg>
          </span>
          <span className="vd-pill-txt">
            <span className="vd-pill-long">Talk to our front desk</span>
            <span className="vd-pill-short">Front desk</span>
          </span>
        </button>
      </div>

      {/* AI chat: an AERIOX agent answering as Jupiter Granite Co.'s front desk in text. The launcher is all that
          loads with the page; the chat loads on its first hover, focus or tap. */}
      <div className="ax-chat" dangerouslySetInnerHTML={{ __html: CHAT_SNIPPET }} />

      {/* The booking panel's mount (another add-on, built separately). It renders into #ax-booking in the buy
          panel's layer and card (addons.css header), opens from a CTA that says what it does, and while open sets
          html.ax-open and dispatches window "ax:open" with its own detail, so the chat and the voice panel step
          back. Empty and hidden until then. */}
      <div id="ax-booking" hidden />

      <AerioxRoute />
      <Script src="/aeriox/voice-pill.js?v=voice-1" strategy="afterInteractive" />
      <Script src="/aeriox/buy.js?v=buy-1" strategy="afterInteractive" />
    </>
  );
}
