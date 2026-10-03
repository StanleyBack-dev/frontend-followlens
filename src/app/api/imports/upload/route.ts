import { NextResponse } from "next/server";
import { readSessionToken } from "@/server/auth/session";
import { bffRoute, errorResponse } from "@/server/http/route-handler";
import { importsService } from "@/server/services/imports.service";

// Hard cap here too, so a huge upload is rejected before reaching the backend.
const MAX_BYTES = 8 * 1024 * 1024;

export const maxDuration = 60;

export const POST = bffRoute(async (request) => {
  const token = await readSessionToken();
  if (!token) {
    return errorResponse(401, {
      code: "AUTH_ACCESS_TOKEN_MISSING",
      message: "Sessão expirada.",
    });
  }

  const body = await request.arrayBuffer();
  if (body.byteLength === 0) {
    return errorResponse(422, {
      code: "IMPORT_INVALID_FILE",
      message: "Nenhum arquivo foi enviado.",
    });
  }
  if (body.byteLength > MAX_BYTES) {
    return errorResponse(413, {
      code: "IMPORT_FILE_TOO_LARGE",
      message: "Arquivo muito grande.",
    });
  }

  const filename = request.nextUrl.searchParams.get("filename") ?? "export";
  return NextResponse.json(
    await importsService.upload(token, { filename, body }),
  );
});
