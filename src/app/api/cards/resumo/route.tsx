import { ImageResponse } from "next/og";
import { type NextRequest, NextResponse } from "next/server";
import {
  monthLabel,
  signed,
} from "@/features/engagement/model/engagement-labels";
import { readSessionToken } from "@/server/auth/session";
import { BackendError } from "@/server/http/backend-error";
import { engagementService } from "@/server/services/engagement.service";

const SIZE = { width: 1080, height: 1920 };
const ACCENT = "#7c5cff";
const number = new Intl.NumberFormat("pt-BR");

// Story-sized image of the signed-in user's month, for sharing. Only totals:
// no follower name ever goes on it.
export async function GET(request: NextRequest) {
  const token = await readSessionToken();
  if (!token) {
    return NextResponse.json(
      { code: "AUTH_ACCESS_TOKEN_MISSING", message: "Sessão expirada." },
      { status: 401 },
    );
  }

  let summary;
  try {
    summary = await engagementService.summary(
      token,
      request.nextUrl.searchParams.get("mes") ?? undefined,
    );
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(error.toApiError(), { status: error.status });
    }
    throw error;
  }

  const stat = (label: string, value: string, color: string) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 40,
        borderRadius: 36,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        border: "2px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color }}>
        {value}
      </div>
      <div style={{ display: "flex", fontSize: 34, color: "#b7b7c9" }}>
        {label}
      </div>
    </div>
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 96,
        color: "#ffffff",
        backgroundColor: "#0f0f17",
        backgroundImage:
          "radial-gradient(circle at 80% 12%, rgba(124, 92, 255, 0.4), rgba(15, 15, 23, 0) 55%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width="88" height="88" viewBox="0 0 32 32">
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
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700 }}>
          <span>Follow</span>
          <span style={{ color: ACCENT }}>Lens</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", fontSize: 48, color: "#b7b7c9" }}>
          Meu Instagram em {monthLabel(summary.month)}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 260,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -8,
            color: summary.net >= 0 ? "#3dd68c" : "#ff6369",
          }}
        >
          {signed(summary.net)}
        </div>
        <div style={{ display: "flex", fontSize: 52 }}>
          seguidores de saldo no mês
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", gap: 28 }}>
          {stat(
            "novos seguidores",
            signed(summary.gained + summary.returned),
            ACCENT,
          )}
          {stat("deixaram de seguir", number.format(summary.lost), "#ff6369")}
        </div>
        {summary.followersAtEnd !== null && (
          <div style={{ display: "flex", fontSize: 40, color: "#b7b7c9" }}>
            {number.format(summary.followersAtEnd)} seguidores no fim do mês
          </div>
        )}
        <div style={{ display: "flex", fontSize: 34, color: "#8a8a9e" }}>
          Descubra quem deixou de seguir você com o FollowLens
        </div>
      </div>
    </div>,
    {
      ...SIZE,
      headers: { "cache-control": "private, no-store" },
    },
  );
}
