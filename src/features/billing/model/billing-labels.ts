import type { SelectOption, Tone } from "@/design-system";
import type {
  BillingCycle,
  BillingPaymentStatus,
  CancellationReason,
  PaymentMethod,
  SubscriptionStatus,
} from "@/shared/contracts/api";

export const BILLING_PATH = "/conta/assinatura";

export const CYCLE_LABEL: Record<BillingCycle, string> = {
  monthly: "Mensal",
  yearly: "Anual",
};

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  checkout: "Cartão, boleto ou Pix",
  pix_automatic: "Pix Automático",
};

export const PAYMENT_STATUS_LABEL: Record<
  BillingPaymentStatus,
  { label: string; tone: Tone }
> = {
  pending: { label: "Aguardando", tone: "neutral" },
  confirmed: { label: "Pago", tone: "success" },
  received: { label: "Pago", tone: "success" },
  overdue: { label: "Em atraso", tone: "danger" },
  refunded: { label: "Estornado", tone: "warning" },
  deleted: { label: "Cancelado", tone: "neutral" },
};

export const CANCELLATION_REASONS: {
  value: CancellationReason;
  label: string;
}[] = [
  { value: "too_expensive", label: "Está caro para mim" },
  { value: "not_using", label: "Não estou usando" },
  { value: "missing_feature", label: "Falta um recurso que eu preciso" },
  { value: "import_too_manual", label: "Importar o arquivo dá trabalho" },
  { value: "technical_issues", label: "Tive problemas técnicos" },
  { value: "other", label: "Outro motivo" },
];

/** What Pro unlocks, shown wherever an upgrade is offered. */
export function proBenefits(limits: {
  freeImportIntervalDays: number;
  freeHistoryDays: number;
  freeProfiles: number;
  proProfiles: number;
}): string[] {
  return [
    `Até ${limits.proProfiles} perfis do Instagram na mesma conta (no Free, ${limits.freeProfiles})`,
    `Importações sem espera (no Free, uma a cada ${limits.freeImportIntervalDays} dias)`,
    `Histórico completo de unfollows (no Free, só os últimos ${limits.freeHistoryDays} dias)`,
    "Lista de novos seguidores e de quem voltou a seguir",
    "Alerta por e-mail a cada importação",
    "Busca e filtro por seguidor nas listas",
  ];
}

export const SUBSCRIPTION_STATUS_LABEL: Record<
  SubscriptionStatus,
  { label: string; tone: Tone }
> = {
  active: { label: "Ativa", tone: "success" },
  past_due: { label: "Em atraso", tone: "danger" },
  pending: { label: "Aguardando pagamento", tone: "neutral" },
  canceled: { label: "Cancelada", tone: "warning" },
  expired: { label: "Expirada", tone: "neutral" },
};

export const SUBSCRIPTION_STATUSES = Object.keys(
  SUBSCRIPTION_STATUS_LABEL,
) as SubscriptionStatus[];

export const SUBSCRIPTION_STATUS_OPTIONS: SelectOption[] =
  SUBSCRIPTION_STATUSES.map((value) => ({
    value,
    label: SUBSCRIPTION_STATUS_LABEL[value].label,
  }));
