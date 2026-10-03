import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type {
  ImportRecord,
  ImportResult,
  ImportStatusView,
  Paginated,
} from "@/shared/contracts/api";

// Parsing + diff can take a few seconds for a large follower list.
const UPLOAD_TIMEOUT_MS = 60_000;

export const importsService = {
  status(token: string): Promise<ImportStatusView> {
    return backendFetch("/imports/status", { token });
  },

  list(
    token: string,
    params: { page?: number; limit?: number },
  ): Promise<Paginated<ImportRecord>> {
    return backendFetch("/imports", { token, query: params });
  },

  upload(
    token: string,
    file: { filename: string; body: ArrayBuffer },
  ): Promise<ImportResult> {
    return backendFetch("/imports/upload", {
      method: "POST",
      token,
      rawBody: file.body,
      headers: { "x-filename": file.filename },
      timeoutMs: UPLOAD_TIMEOUT_MS,
    });
  },
};
