import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type {
  ManualSyncResult,
  Paginated,
  SyncRun,
  SyncStatus,
} from "@/shared/contracts/api";

// The backend may work for up to its time budget (~4 min) on a manual sync.
const MANUAL_SYNC_TIMEOUT_MS = 290_000;

export const syncService = {
  status(token: string): Promise<SyncStatus> {
    return backendFetch("/sync/status", { token });
  },

  runManual(token: string): Promise<ManualSyncResult> {
    return backendFetch("/sync/manual", {
      method: "POST",
      token,
      timeoutMs: MANUAL_SYNC_TIMEOUT_MS,
    });
  },

  runs(
    token: string,
    params: { page?: number; limit?: number },
  ): Promise<Paginated<SyncRun>> {
    return backendFetch("/sync/runs", { token, query: params });
  },
};
