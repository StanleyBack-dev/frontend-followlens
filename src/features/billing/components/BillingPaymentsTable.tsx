import { ExternalLink } from "lucide-react";
import { Badge } from "@/design-system";
import { PAYMENT_STATUS_LABEL } from "@/features/billing/model/billing-labels";
import type { BillingPayment } from "@/shared/contracts/api";
import { formatCurrency, formatDate } from "@/shared/lib/format";

export function BillingPaymentsTable({
  payments,
}: {
  payments: BillingPayment[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium tracking-wide text-soft uppercase">
            <th className="px-5 py-3 font-medium">Vencimento</th>
            <th className="px-5 py-3 font-medium">Valor</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Pago em</th>
            <th className="px-5 py-3 text-right font-medium">Fatura</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-5 py-3 whitespace-nowrap text-fg">
                {formatDate(payment.dueDate)}
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-fg">
                {formatCurrency(payment.amount)}
              </td>
              <td className="px-5 py-3">
                <Badge tone={PAYMENT_STATUS_LABEL[payment.status].tone} dot>
                  {PAYMENT_STATUS_LABEL[payment.status].label}
                </Badge>
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-muted">
                {formatDate(payment.paidAt)}
              </td>
              <td className="px-5 py-3 text-right">
                {payment.invoiceUrl ? (
                  <a
                    href={payment.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                  >
                    Abrir
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                ) : (
                  <span className="text-soft">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
