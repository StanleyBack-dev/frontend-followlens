import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Pagination,
} from "@/design-system";
import { AwaitingPaymentNotice } from "@/features/billing/components/AwaitingPaymentNotice";
import { BillingPaymentsTable } from "@/features/billing/components/BillingPaymentsTable";
import { CheckoutCard } from "@/features/billing/components/CheckoutCard";
import { SubscriptionStatusCard } from "@/features/billing/components/SubscriptionStatusCard";
import {
  BILLING_PATH,
  proBenefits,
} from "@/features/billing/model/billing-labels";
import { authed } from "@/server/services/authed";
import { billingService } from "@/server/services/billing.service";
import { formatDate } from "@/shared/lib/format";
import {
  buildHref,
  firstParam,
  pageParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Assinatura" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const page = pageParam(params);
  const returnedFromCheckout = firstParam(params, "checkout") === "success";

  const [summary, payments] = await authed((token) =>
    Promise.all([
      billingService.subscription(token),
      billingService.payments(token, { page, limit: 12 }),
    ]),
  );

  const { subscription } = summary;
  const paying =
    subscription?.status === "active" || subscription?.status === "past_due";
  // Admins can still go through the checkout (to test it); a courtesy Pro
  // has nothing to buy.
  const canSubscribe = !paying && summary.proSource !== "courtesy";

  return (
    <>
      <div className="space-y-6">
        {!paying &&
          (returnedFromCheckout || subscription?.status === "pending") && (
            <AwaitingPaymentNotice
              returnedFromCheckout={returnedFromCheckout}
            />
          )}

        {paying && subscription ? (
          <SubscriptionStatusCard
            subscription={subscription}
            prices={summary.prices}
            pastDueGraceDays={summary.pastDueGraceDays}
          />
        ) : (
          <Card>
            <CardHeader
              title={summary.hasProAccess ? "FollowLens Pro" : "Plano Free"}
              description={
                summary.proSource === "bonus"
                  ? `Você está com o Pro por indicações até ${formatDate(summary.proBonusUntil)}.`
                  : summary.proSource === "courtesy"
                    ? "Seu Pro foi liberado pela administração, sem cobrança."
                    : summary.proSource === "admin"
                      ? "Administradores têm todos os recursos do Pro, sem cobrança."
                      : "O que você ganha ao assinar o Pro:"
              }
              action={
                <Badge tone={summary.hasProAccess ? "accent" : "neutral"}>
                  {summary.hasProAccess ? "Pro" : "Free"}
                </Badge>
              }
            />
            <CardBody>
              <ul className="space-y-2 text-sm text-fg">
                {proBenefits(summary.freeLimits).map((benefit) => (
                  <li key={benefit} className="flex gap-2.5">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-success"
                      aria-hidden
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        {subscription?.status === "expired" && (
          <Alert tone="warning">
            Sua assinatura anterior foi encerrada por falta de pagamento. Seus
            dados continuam aqui; assine de novo para liberar o Pro.
          </Alert>
        )}

        {canSubscribe && (
          <CheckoutCard
            prices={summary.prices}
            pixAutomaticEnabled={summary.pixAutomaticEnabled}
          />
        )}

        {payments.total > 0 && (
          <Card>
            <CardHeader title="Histórico de pagamentos" />
            <div className="mt-3">
              <BillingPaymentsTable payments={payments.items} />
              <Pagination
                page={payments.page}
                totalPages={payments.totalPages}
                total={payments.total}
                hrefFor={(target) => buildHref(BILLING_PATH, { page: target })}
              />
            </div>
          </Card>
        )}
        <p className="text-sm text-muted">
          Dúvida sobre a cobrança?{" "}
          <Link
            href="/suporte"
            className="font-medium text-accent hover:underline"
          >
            Fale com o suporte
          </Link>
          .
        </p>
      </div>
    </>
  );
}
