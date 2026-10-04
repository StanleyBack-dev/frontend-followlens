import type { SelectOption, Tone } from "@/design-system";
import type {
  SupportCategory,
  SupportTicketStatus,
} from "@/shared/contracts/api";

export const SUPPORT_CATEGORY_LABEL: Record<SupportCategory, string> = {
  doubt: "Dúvida",
  technical_issue: "Problema técnico / Bug",
  suggestion: "Sugestão",
  billing: "Financeiro / Cobrança",
  other: "Outro",
};

export const SUPPORT_CATEGORIES = Object.keys(
  SUPPORT_CATEGORY_LABEL,
) as SupportCategory[];

export const SUPPORT_CATEGORY_OPTIONS: SelectOption[] = SUPPORT_CATEGORIES.map(
  (value) => ({ value, label: SUPPORT_CATEGORY_LABEL[value] }),
);

export const SUPPORT_STATUS_LABEL: Record<
  SupportTicketStatus,
  { label: string; tone: Tone }
> = {
  open: { label: "Aberto", tone: "warning" },
  answered: { label: "Respondido", tone: "info" },
  resolved: { label: "Finalizado", tone: "success" },
};

export const SUPPORT_STATUSES = Object.keys(
  SUPPORT_STATUS_LABEL,
) as SupportTicketStatus[];

export const SUPPORT_STATUS_OPTIONS: SelectOption[] = SUPPORT_STATUSES.map(
  (value) => ({ value, label: SUPPORT_STATUS_LABEL[value].label }),
);

export const SUPPORT_MESSAGE_MAX = 2000;

/** How the protocol is written everywhere: #000042. */
export function formatProtocol(protocolNumber: number): string {
  return `#${String(protocolNumber).padStart(6, "0")}`;
}
