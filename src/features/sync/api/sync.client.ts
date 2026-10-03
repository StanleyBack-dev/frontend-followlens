import type { ManualSyncResult, SyncStatus } from "@/shared/contracts/api";
import { apiRequest } from "@/shared/lib/api-client";

export const syncClient = {
  status() {
    return apiRequest<SyncStatus>("/sync/status");
  },
  runManual() {
    return apiRequest<ManualSyncResult>("/sync/manual", { method: "POST" });
  },
};
