"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { syncClient } from "@/features/sync/api/sync.client";
import type { ManualSyncResult, SyncStatus } from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";

const POLL_INTERVAL_MS = 4_000;

export type ManualSyncFeedback =
  | { kind: "success"; result: ManualSyncResult }
  | { kind: "error"; message: string };

// Fires the (long) manual sync request and, while it runs, polls the status
// endpoint so the panel can show live progress.
export function useManualSync(initialStatus: SyncStatus) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [running, setRunning] = useState(false);
  const [feedback, setFeedback] = useState<ManualSyncFeedback | null>(null);
  const poller = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fresh server data (after router.refresh) replaces the polled snapshot.
  const [serverStatus, setServerStatus] = useState(initialStatus);
  if (serverStatus !== initialStatus) {
    setServerStatus(initialStatus);
    setStatus(initialStatus);
  }

  const stopPolling = useCallback(() => {
    if (poller.current) clearInterval(poller.current);
    poller.current = null;
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const start = useCallback(async () => {
    setRunning(true);
    setFeedback(null);
    poller.current = setInterval(() => {
      syncClient
        .status()
        .then(setStatus)
        .catch(() => undefined);
    }, POLL_INTERVAL_MS);

    try {
      const result = await syncClient.runManual();
      setFeedback({ kind: "success", result });
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        router.replace("/entrar?expired=1");
        return;
      }
      setFeedback({
        kind: "error",
        message:
          error instanceof ApiClientError
            ? error.message
            : "Falha ao sincronizar.",
      });
    } finally {
      stopPolling();
      setRunning(false);
      router.refresh();
    }
  }, [router, stopPolling]);

  return { status, running, feedback, start };
}
