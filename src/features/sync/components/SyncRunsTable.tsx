import { Badge } from "@/design-system";
import {
  ERROR_CODE_LABEL,
  STATUS_LABEL,
  TRIGGER_LABEL,
} from "@/features/sync/model/sync-labels";
import type { SyncRun } from "@/shared/contracts/api";
import { formatDateTime, formatNumber } from "@/shared/lib/format";

export function SyncRunsTable({ runs }: { runs: SyncRun[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium tracking-wide text-soft uppercase">
            <th className="px-5 py-3 font-medium">Início</th>
            <th className="px-5 py-3 font-medium">Origem</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 text-right font-medium">Seguidores</th>
            <th className="px-5 py-3 text-right font-medium">Perdas / novos</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {runs.map((run) => (
            <tr key={run.id} className="align-top">
              <td className="px-5 py-3 whitespace-nowrap text-fg">
                {formatDateTime(run.startedAt)}
              </td>
              <td className="px-5 py-3 text-muted">
                {TRIGGER_LABEL[run.trigger]}
              </td>
              <td className="px-5 py-3">
                <Badge tone={STATUS_LABEL[run.status].tone} dot>
                  {STATUS_LABEL[run.status].label}
                </Badge>
                {run.errorCode && (
                  <p
                    className="mt-1 max-w-xs text-xs text-soft"
                    title={run.errorMessage ?? undefined}
                  >
                    {ERROR_CODE_LABEL[run.errorCode] ?? run.errorCode}
                  </p>
                )}
              </td>
              <td className="px-5 py-3 text-right tabular-nums text-muted">
                {formatNumber(run.followersCollected)}
              </td>
              <td className="px-5 py-3 text-right tabular-nums">
                {run.status === "completed" ? (
                  <>
                    <span className="text-danger">−{run.lostCount ?? 0}</span>
                    <span className="text-soft"> / </span>
                    <span className="text-success">
                      +{run.gainedCount ?? 0}
                    </span>
                  </>
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
