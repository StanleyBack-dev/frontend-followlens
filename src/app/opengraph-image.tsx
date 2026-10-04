import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/shared/lib/site";

// Banner shown when a link to the app is shared (WhatsApp, Facebook, X...).
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#7c5cff";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#ffffff",
        backgroundColor: "#0f0f17",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(124, 92, 255, 0.35), rgba(15, 15, 23, 0) 55%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width="72" height="72" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <circle cx="16" cy="16" r="6.2" fill={ACCENT} />
          <circle cx="13.7" cy="13.7" r="1.9" fill="#ffffff" />
        </svg>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
          <span>Follow</span>
          <span style={{ color: ACCENT }}>Lens</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 980,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#b7b7c9" }}>
          Veja quem saiu, quem chegou e quem voltou — sem a senha do Instagram.
        </div>
      </div>
    </div>,
    size,
  );
}
