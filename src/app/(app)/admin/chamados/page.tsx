import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LifeBuoy, Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Pagination,
  Select,
} from "@/design-system";
import {
  formatProtocol,
  SUPPORT_CATEGORIES,
  SUPPORT_CATEGORY_LABEL,
  SUPPORT_CATEGORY_OPTIONS,
  SUPPORT_STATUS_LABEL,
  SUPPORT_STATUS_OPTIONS,
  SUPPORT_STATUSES,
} from "@/features/support/model/support-labels";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";
import { supportService } from "@/server/services/support.service";
import { formatDateTime } from "@/shared/lib/format";
import {
  buildHref,
  firstParam,
  oneOf,
  pageParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Chamados de suporte" };

const PATH = "/admin/chamados";

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const status = oneOf(firstParam(params, "status"), SUPPORT_STATUSES);
  const category = oneOf(firstParam(params, "category"), SUPPORT_CATEGORIES);
  const page = pageParam(params);

  const tickets = await authed(async (token) => {
    const me = await authService.me(token);
    if (!me.isAdmin) redirect("/dashboard");
    return supportService.tickets(token, { status, category, page, limit: 20 });
  });

  return (
    <>
      <form
        action={PATH}
        className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <Select
          label="Status"
          name="status"
          options={SUPPORT_STATUS_OPTIONS}
          placeholder="Todos"
          defaultValue={status ?? ""}
          className="sm:w-44"
        />
        <Select
          label="Categoria"
          name="category"
          options={SUPPORT_CATEGORY_OPTIONS}
          placeholder="Todas"
          defaultValue={category ?? ""}
          className="sm:w-60"
        />
        <Button type="submit" icon={<Search className="size-4" />}>
          Filtrar
        </Button>
      </form>

      <Card>
        {tickets.items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium tracking-wide text-soft uppercase">
                    <th className="px-5 py-3 font-medium">Protocolo</th>
                    <th className="px-5 py-3 font-medium">Usuário</th>
                    <th className="px-5 py-3 font-medium">Categoria</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Enviado em</th>
                    <th className="px-5 py-3 font-medium">Finalizado por</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.items.map((ticket) => (
                    <tr key={ticket.id} className="align-top">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <Link
                          href={`${PATH}/${ticket.id}`}
                          className="font-medium text-accent hover:underline"
                        >
                          {formatProtocol(ticket.protocolNumber)}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-fg">{ticket.userName}</p>
                        <p className="text-xs text-soft">{ticket.userEmail}</p>
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {SUPPORT_CATEGORY_LABEL[ticket.category]}
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          tone={SUPPORT_STATUS_LABEL[ticket.status].tone}
                          dot
                        >
                          {SUPPORT_STATUS_LABEL[ticket.status].label}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted">
                        {formatDateTime(ticket.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-muted">
                        {ticket.finalizedByName ?? "—"}
                        {ticket.finalizedAt && (
                          <span className="block text-xs text-soft">
                            {formatDateTime(ticket.finalizedAt)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={tickets.page}
              totalPages={tickets.totalPages}
              total={tickets.total}
              hrefFor={(target) =>
                buildHref(PATH, { status, category, page: target })
              }
            />
          </>
        ) : (
          <EmptyState
            icon={<LifeBuoy className="size-5" />}
            title="Nenhum chamado encontrado"
            description={
              status || category
                ? "Ajuste os filtros e tente novamente."
                : "As mensagens enviadas pelos usuários em Suporte aparecem aqui."
            }
          />
        )}
      </Card>
    </>
  );
}
