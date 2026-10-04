import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge, Card, CardBody, CardHeader } from "@/design-system";
import { SupportTicketActions } from "@/features/support/components/SupportTicketActions";
import {
  formatProtocol,
  SUPPORT_CATEGORY_LABEL,
  SUPPORT_STATUS_LABEL,
} from "@/features/support/model/support-labels";
import { BackendError } from "@/server/http/backend-error";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";
import { supportService } from "@/server/services/support.service";
import { formatDateTime } from "@/shared/lib/format";

export const metadata: Metadata = { title: "Chamado de suporte" };

export default async function AdminSupportTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await authed(async (token) => {
    const me = await authService.me(token);
    if (!me.isAdmin) redirect("/dashboard");
    try {
      return await supportService.ticket(token, id);
    } catch (error) {
      // Unknown or malformed id.
      if (
        error instanceof BackendError &&
        (error.status === 404 || error.status === 400)
      ) {
        notFound();
      }
      throw error;
    }
  });

  const details = [
    { label: "Usuário", value: `${ticket.userName} (${ticket.userEmail})` },
    { label: "Categoria", value: SUPPORT_CATEGORY_LABEL[ticket.category] },
    { label: "Enviado em", value: formatDateTime(ticket.createdAt) },
    {
      label: "Respondido em",
      value: formatDateTime(ticket.repliedAt),
    },
    ...(ticket.finalizedAt
      ? [
          {
            label: "Finalizado",
            value: `${formatDateTime(ticket.finalizedAt)}${ticket.finalizedByName ? ` por ${ticket.finalizedByName}` : ""}`,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/admin/chamados"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Voltar para os chamados
      </Link>

      <Card>
        <CardHeader
          title={`Chamado ${formatProtocol(ticket.protocolNumber)}`}
          action={
            <Badge tone={SUPPORT_STATUS_LABEL[ticket.status].tone} dot>
              {SUPPORT_STATUS_LABEL[ticket.status].label}
            </Badge>
          }
        />
        <CardBody className="space-y-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            {details.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium tracking-wide text-soft uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm break-words text-fg">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
          <div>
            <p className="mb-1.5 text-sm font-medium text-fg">Mensagem</p>
            <p className="rounded-md border border-border bg-surface-muted px-4 py-3 text-sm whitespace-pre-wrap text-fg">
              {ticket.message}
            </p>
          </div>
          {ticket.adminReply && (
            <div>
              <p className="mb-1.5 text-sm font-medium text-fg">
                Resposta enviada
              </p>
              <p className="rounded-md border border-accent/30 bg-accent-soft px-4 py-3 text-sm whitespace-pre-wrap text-fg">
                {ticket.adminReply}
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Remount when the ticket changes state so the form starts clean. */}
      <SupportTicketActions
        key={`${ticket.id}:${ticket.status}:${ticket.repliedAt ?? ""}`}
        ticket={ticket}
      />
    </div>
  );
}
