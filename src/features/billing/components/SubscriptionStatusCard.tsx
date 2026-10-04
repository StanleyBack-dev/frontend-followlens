"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleSlash } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  inputClasses,
  Modal,
} from "@/design-system";
import { billingClient } from "@/features/billing/api/billing.client";
import {
  CANCELLATION_REASONS,
  CYCLE_LABEL,
  METHOD_LABEL,
} from "@/features/billing/model/billing-labels";
import type {
  CancellationReason,
  SubscriptionSummary,
} from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatCurrency, formatDate } from "@/shared/lib/format";

type PaidSubscription = NonNullable<SubscriptionSummary["subscription"]>;

// The paid subscription (active or overdue), with the cancellation flow.
export function SubscriptionStatusCard({
  subscription,
  prices,
  pastDueGraceDays,
}: {
  subscription: PaidSubscription;
  prices: SubscriptionSummary["prices"];
  pastDueGraceDays: number;
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { billingCycle, paymentMethod, currentPeriodEnd, cancelAtPeriodEnd } =
    subscription;
  const pastDue = subscription.status === "past_due";

  function toggle(reason: CancellationReason) {
    setReasons((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason],
    );
  }

  async function cancel() {
    if (reasons.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      await billingClient.cancel({
        reasons,
        otherReason: otherReason.trim() || undefined,
      });
      setModalOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Não foi possível cancelar a assinatura.",
      );
    } finally {
      setBusy(false);
    }
  }

  const details = [
    { label: "Plano", value: billingCycle ? CYCLE_LABEL[billingCycle] : "—" },
    {
      label: "Valor",
      value: billingCycle ? formatCurrency(prices[billingCycle]) : "—",
    },
    {
      label: "Pagamento",
      value: paymentMethod ? METHOD_LABEL[paymentMethod] : "—",
    },
    {
      label: cancelAtPeriodEnd ? "Acesso até" : "Próxima cobrança",
      value: formatDate(currentPeriodEnd),
    },
  ];

  return (
    <Card>
      <CardHeader
        title="FollowLens Pro"
        action={
          <Badge
            tone={
              pastDue ? "danger" : cancelAtPeriodEnd ? "warning" : "success"
            }
            dot
          >
            {pastDue
              ? "Pagamento em atraso"
              : cancelAtPeriodEnd
                ? "Cancelada"
                : "Ativa"}
          </Badge>
        }
      />
      <CardBody className="space-y-4">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {details.map((item) => (
            <div key={item.label}>
              <dt className="text-xs font-medium tracking-wide text-soft uppercase">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm text-fg">{item.value}</dd>
            </div>
          ))}
        </dl>

        {pastDue && (
          <Alert tone="danger" title="Não identificamos o último pagamento">
            O acesso Pro continua por {pastDueGraceDays}{" "}
            {pastDueGraceDays === 1 ? "dia" : "dias"} após o vencimento. A
            cobrança em aberto está no histórico abaixo. Depois desse prazo a
            conta volta para o Free, sem apagar nenhum dado.
          </Alert>
        )}
        {cancelAtPeriodEnd ? (
          <Alert tone="warning">
            A assinatura foi cancelada e não será renovada. Você continua com o
            Pro até {formatDate(currentPeriodEnd)}.
          </Alert>
        ) : (
          <Button
            variant="secondary"
            onClick={() => {
              setError(null);
              setModalOpen(true);
            }}
            icon={<CircleSlash className="size-4" />}
          >
            Cancelar assinatura
          </Button>
        )}
      </CardBody>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Cancelar a assinatura Pro?"
        tone="danger"
        icon={<CircleSlash className="size-5" />}
        busy={busy}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={busy}
            >
              Manter o Pro
            </Button>
            <Button
              variant="danger"
              onClick={cancel}
              loading={busy}
              disabled={reasons.length === 0}
            >
              Cancelar assinatura
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p>
            Não haverá novas cobranças.{" "}
            {currentPeriodEnd && !pastDue
              ? `Você continua com o Pro até ${formatDate(currentPeriodEnd)}; depois a conta volta para o Free.`
              : "A conta volta para o Free."}{" "}
            Nenhum dado é apagado.
          </p>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-fg">
              Por que você está cancelando?
            </legend>
            <div className="space-y-2">
              {CANCELLATION_REASONS.map((reason) => (
                <label
                  key={reason.value}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-fg"
                >
                  <input
                    type="checkbox"
                    className="size-4 accent-[var(--accent)]"
                    checked={reasons.includes(reason.value)}
                    onChange={() => toggle(reason.value)}
                  />
                  {reason.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label
              htmlFor="cancel-other-reason"
              className="mb-1.5 block text-sm font-medium text-fg"
            >
              Quer contar mais? (opcional)
            </label>
            <textarea
              id="cancel-other-reason"
              rows={3}
              maxLength={500}
              value={otherReason}
              onChange={(event) => setOtherReason(event.target.value)}
              className={`${inputClasses} h-auto py-2`}
            />
          </div>
          {error && <Alert tone="danger">{error}</Alert>}
        </div>
      </Modal>
    </Card>
  );
}
