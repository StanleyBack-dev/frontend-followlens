"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { importsClient } from "@/features/imports/api/imports.client";
import type { ImportResult } from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";

export type ImportFeedback =
  | { kind: "success"; result: ImportResult }
  | { kind: "error"; message: string };

const ACCEPTED = /\.(json|zip)$/i;

export function useImportUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<ImportFeedback | null>(null);

  const upload = useCallback(
    async (file: File) => {
      setFeedback(null);

      if (!ACCEPTED.test(file.name)) {
        setFeedback({
          kind: "error",
          message: "Envie o arquivo .json ou .zip exportado pelo Instagram.",
        });
        return;
      }

      setUploading(true);
      try {
        const result = await importsClient.upload(file);
        setFeedback({ kind: "success", result });
        router.refresh();
      } catch (error) {
        if (error instanceof ApiClientError && error.status === 401) {
          router.replace("/login?expired=1");
          return;
        }
        setFeedback({
          kind: "error",
          message:
            error instanceof ApiClientError
              ? error.message
              : "Falha ao importar o arquivo.",
        });
      } finally {
        setUploading(false);
      }
    },
    [router],
  );

  return { uploading, feedback, upload };
}
