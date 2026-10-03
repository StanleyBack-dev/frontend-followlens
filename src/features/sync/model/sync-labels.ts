import type { Tone } from "@/design-system";
import type {
  SyncDenialReason,
  SyncRunStatus,
  SyncTrigger,
} from "@/shared/contracts/api";

export const TRIGGER_LABEL: Record<SyncTrigger, string> = {
  manual: "Manual",
  cron: "Diária (cron)",
};

export const STATUS_LABEL: Record<
  SyncRunStatus,
  { label: string; tone: Tone }
> = {
  running: { label: "Em andamento", tone: "info" },
  paused: { label: "Pausada", tone: "warning" },
  completed: { label: "Concluída", tone: "success" },
  failed: { label: "Falhou", tone: "danger" },
};

export const DENIAL_MESSAGE: Record<SyncDenialReason, string> = {
  "manual-daily-limit": "Você já usou a sincronização manual de hoje.",
  "already-synced-today": "A lista já foi sincronizada hoje.",
  "min-interval": "Aguarde o intervalo mínimo entre sincronizações.",
  "not-configured": "Sessão do Instagram não configurada no backend.",
  "integration-blocked":
    "Integração pausada por segurança — renove os cookies da sessão.",
  "already-running": "Já existe uma sincronização em andamento.",
};

export const ERROR_CODE_LABEL: Record<string, string> = {
  SESSION_INVALID: "Sessão do Instagram recusada",
  RATE_LIMITED: "Instagram pediu para aguardar",
  INSTAGRAM_UNAVAILABLE: "Instagram indisponível",
  TIME_BUDGET: "Continua na próxima execução",
  SNAPSHOT_REJECTED: "Lista incompleta descartada (proteção)",
  ABANDONED: "Interrompida e descartada",
  UNEXPECTED: "Erro inesperado",
};
