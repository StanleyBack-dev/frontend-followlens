import type { Tone } from "@/design-system";
import type { ImportStatus } from "@/shared/contracts/api";

export const IMPORT_STATUS_LABEL: Record<
  ImportStatus,
  { label: string; tone: Tone }
> = {
  completed: { label: "Concluída", tone: "success" },
  failed: { label: "Falhou", tone: "danger" },
};

// Maps backend error codes to friendly text for the import history.
export const IMPORT_ERROR_LABEL: Record<string, string> = {
  IMPORT_SNAPSHOT_REJECTED: "Arquivo recusado (muitas perdas de uma vez)",
  IMPORT_EMPTY_FOLLOWERS: "Nenhum seguidor no arquivo",
  IMPORT_INVALID_FILE: "Arquivo inválido",
};
