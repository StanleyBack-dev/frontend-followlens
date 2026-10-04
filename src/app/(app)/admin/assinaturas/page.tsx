import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreditCard, Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Pagination,
  Select,
} from "@/design-system";
import {
  CYCLE_LABEL,
  METHOD_LABEL,
  SUBSCRIPTION_STATUS_LABEL,
  SUBSCRIPTION_STATUS_OPTIONS,
  SUBSCRIPTION_STATUSES,
} from "@/features/billing/model/billing-labels";
import { adminService } from "@/server/services/admin.service";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";
import { formatCurrency, formatDate } from "@/shared/lib/format";
import {
  buildHref,
  firstParam,
  oneOf,
  pageParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Assinaturas" };

const PATH = "/admin/assinaturas";

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const status = oneOf(firstParam(params, "status"), SUBSCRIPTION_STATUSES);
  const page = pageParam(params);

  const subscriptions = await authed(async (token) => {
    const me = await authService.me(token);
    if (!me.isAdmin) redirect("/dashboard");
    return adminService.subscriptions(token, { status, page, limit: 20 });
  });

  return (
    <>
      <form action={PATH} className="mb-4 flex items-end gap-3">
        <Select
          label="Situação"
          name="status"
          options={SUBSCRIPTION_STATUS_OPTIONS}
          placeholder="Todas"
          defaultValue={status ?? ""}
          className="w-52"
        />
        <Button type="submit" icon={<Search className="size-4" />}>
          Filtrar
        </Button>
      </form>

      <Card>
        {subscriptions.items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium tracking-wide text-soft uppercase">
                    <th className="px-5 py-3 font-medium">Usuário</th>
                    <th className="px-5 py-3 font-medium">Situação</th>
                    <th className="px-5 py-3 font-medium">Plano</th>
                    <th className="px-5 py-3 font-medium">Pagamento</th>
                    <th className="px-5 py-3 font-medium">Pro desde</th>
                    <th className="px-5 py-3 font-medium">
                      Próxima cobrança / fim
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {subscriptions.items.map((subscription) => (
                    <tr key={subscription.id} className="align-top">
                      <td className="px-5 py-3">
                        <p className="font-medium text-fg">
                          {subscription.userName}
                        </p>
                        <p className="text-xs text-soft">
                          {subscription.userEmail}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          tone={
                            SUBSCRIPTION_STATUS_LABEL[subscription.status].tone
                          }
                          dot
                        >
                          {SUBSCRIPTION_STATUS_LABEL[subscription.status].label}
                        </Badge>
                        {subscription.cancelAtPeriodEnd && (
                          <p className="mt-1 text-xs text-soft">
                            Cancelada, ativa até o fim do período
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-fg">
                        {subscription.billingCycle
                          ? CYCLE_LABEL[subscription.billingCycle]
                          : "—"}
                        {subscription.price !== null && (
                          <span className="block text-xs text-soft">
                            {formatCurrency(subscription.price)}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {subscription.paymentMethod
                          ? METHOD_LABEL[subscription.paymentMethod]
                          : "—"}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted">
                        {formatDate(subscription.proStartedAt)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted">
                        {formatDate(subscription.currentPeriodEnd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={subscriptions.page}
              totalPages={subscriptions.totalPages}
              total={subscriptions.total}
              hrefFor={(target) => buildHref(PATH, { status, page: target })}
            />
          </>
        ) : (
          <EmptyState
            icon={<CreditCard className="size-5" />}
            title="Nenhuma assinatura encontrada"
            description={
              status
                ? "Ajuste o filtro e tente novamente."
                : "As assinaturas aparecem aqui quando alguém inicia o checkout do Pro."
            }
          />
        )}
      </Card>
    </>
  );
}
