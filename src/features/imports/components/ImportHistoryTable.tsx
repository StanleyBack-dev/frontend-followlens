import { Badge } from "@/design-system";
import {
  IMPORT_ERROR_LABEL,
  IMPORT_STATUS_LABEL,
} from "@/features/imports/model/import-labels";
import type { ImportRecord } from "@/shared/contracts/api";
import { formatDateTime, formatNumber } from "@/shared/lib/format";

export function ImportHistoryTable({ imports }: { imports: ImportRecord[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium tracking-wide text-soft uppercase">
            <th className="px-5 py-3 font-medium">Data</th>
            <th className="px-5 py-3 font-medium">Arquivo</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 text-right font-medium">Seguidores</th>
            <th className="px-5 py-3 text-right font-medium">Perdas / novos</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {imports.map((record) => (
            <tr key={record.id} className="align-top">
              <td className="px-5 py-3 whitespace-nowrap text-fg">
                {formatDateTime(record.createdAt)}
              </td>
              <td
                className="max-w-[180px] truncate px-5 py-3 text-muted"
                title={record.filename ?? ""}
              >
                {record.filename ?? "—"}
              </td>
              <td className="px-5 py-3">
                <Badge tone={IMPORT_STATUS_LABEL[record.status].tone} dot>
                  {IMPORT_STATUS_LABEL[record.status].label}
                </Badge>
                {record.errorCode && (
                  <p className="mt-1 max-w-xs text-xs text-soft">
                    {IMPORT_ERROR_LABEL[record.errorCode] ?? record.errorCode}
                  </p>
                )}
                {record.baseline && (
                  <p className="mt-1 text-xs text-soft">Lista base</p>
                )}
              </td>
              <td className="px-5 py-3 text-right tabular-nums text-muted">
                {formatNumber(record.followersCount)}
              </td>
              <td className="px-5 py-3 text-right tabular-nums">
                {record.status === "completed" && !record.baseline ? (
                  <>
                    <span className="text-danger">
                      −{record.lostCount ?? 0}
                    </span>
                    <span className="text-soft"> / </span>
                    <span className="text-success">
                      +{record.gainedCount ?? 0}
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
