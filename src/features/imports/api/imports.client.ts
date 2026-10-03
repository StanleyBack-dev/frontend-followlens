import type { ImportResult, ImportStatusView } from "@/shared/contracts/api";
import { apiRequest } from "@/shared/lib/api-client";

export const importsClient = {
  status() {
    return apiRequest<ImportStatusView>("/imports/status");
  },

  upload(file: File) {
    return apiRequest<ImportResult>(
      `/imports/upload?filename=${encodeURIComponent(file.name)}`,
      {
        method: "POST",
        body: file,
        // Let the browser send the raw bytes; override the JSON default.
        headers: { "content-type": "application/octet-stream" },
      },
    );
  },
};
