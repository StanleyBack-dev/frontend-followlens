import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  BadgeCheck,
  CircleDollarSign,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge, Card, CardBody, CardHeader, StatCard } from "@/design-system";
import {
  SUBSCRIPTION_STATUS_LABEL,
  SUBSCRIPTION_STATUSES,
} from "@/features/billing/model/billing-labels";
import { adminService } from "@/server/services/admin.service";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";
import { formatCurrency, formatNumber } from "@/shared/lib/format";
import { buildHref } from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminOverviewPage() {
  const dashboard = await authed(async (token) => {
    const me = await authService.me(token);
    if (!me.isAdmin) redirect("/dashboard");
    return adminService.dashboard(token);
  });
  const { users, subscriptions, support } = dashboard;
  // Pro without a paid subscription behind it: granted by an admin.
  const courtesyPro = Math.max(0, users.pro - subscriptions.activePro);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Usuários cadastrados"
          value={formatNumber(users.total)}
          hint={`${formatNumber(users.activeLast30Days)} ativos nos últimos 30 dias`}
          icon={<Users className="size-4" />}
          tone="accent"
        />
        <StatCard
          label="Assinaturas Pro ativas"
          value={formatNumber(subscriptions.activePro)}
          hint={`${formatNumber(subscriptions.byStatus.past_due)} com pagamento em atraso`}
          icon={<BadgeCheck className="size-4" />}
          tone="success"
        />
        <StatCard
          label="Receita recorrente estimada (MRR)"
          value={formatCurrency(subscriptions.monthlyRecurringRevenue)}
          hint="Assinaturas ativas; a anual conta 1/12 por mês"
          icon={<CircleDollarSign className="size-4" />}
          tone="info"
        />
        <StatCard
          label="Chamados de suporte abertos"
          value={formatNumber(support.openTickets)}
          hint={
            <Link
              href={buildHref("/admin/chamados", { status: "open" })}
              className="text-accent hover:underline"
            >
              Ver chamados
            </Link>
          }
          icon={<LifeBuoy className="size-4" />}
          tone={support.openTickets > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Assinaturas por situação"
            description="Todas as assinaturas já iniciadas no checkout."
          />
          <CardBody>
            <ul className="divide-y divide-border">
              {SUBSCRIPTION_STATUSES.map((status) => (
                <li
                  key={status}
                  className="flex items-center justify-between py-2.5 text-sm"
                >
                  <Link
                    href={buildHref("/admin/assinaturas", { status })}
                    className="hover:underline"
                  >
                    <Badge tone={SUBSCRIPTION_STATUS_LABEL[status].tone} dot>
                      {SUBSCRIPTION_STATUS_LABEL[status].label}
                    </Badge>
                  </Link>
                  <span className="font-medium text-fg tabular-nums">
                    {formatNumber(subscriptions.byStatus[status])}
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Planos e acessos"
            description="Como os usuários estão distribuídos."
          />
          <CardBody>
            <ul className="divide-y divide-border text-sm">
              {[
                {
                  icon: <Sparkles className="size-4 text-accent" />,
                  label: "Usuários no plano Pro",
                  value: users.pro,
                },
                {
                  icon: <BadgeCheck className="size-4 text-success" />,
                  label: "Pro concedido pela administração",
                  value: courtesyPro,
                },
                {
                  icon: <Users className="size-4 text-muted" />,
                  label: "Usuários no plano Free",
                  value: Math.max(0, users.total - users.pro),
                },
                {
                  icon: <ShieldCheck className="size-4 text-info" />,
                  label: "Administradores",
                  value: users.admins,
                },
                {
                  icon: <Activity className="size-4 text-success" />,
                  label: "Ativos nos últimos 30 dias",
                  value: users.activeLast30Days,
                },
              ].map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="flex items-center gap-2.5 text-fg">
                    {row.icon}
                    {row.label}
                  </span>
                  <span className="font-medium text-fg tabular-nums">
                    {formatNumber(row.value)}
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
