"use client";

import { Clock, RefreshCw, ShieldAlert } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@/design-system";
import { useManualSync } from "@/features/sync/hooks/useManualSync";
import {
  DENIAL_MESSAGE,
  ERROR_CODE_LABEL,
  STATUS_LABEL,
} from "@/features/sync/model/sync-labels";
import type { SyncStatus } from "@/shared/contracts/api";
import {
  formatDateTime,
  formatNumber,
  formatRelative,
} from "@/shared/lib/format";

export function SyncPanel({ initialStatus }: { initialStatus: SyncStatus }) {
  const { status, running, feedback, start } = useManualSync(initialStatus);
  const { manualSync, integration, currentRun, lastCompletedRun, limits } =
    status;

  return (
    <Card>
      <CardHeader
        title="Sincronização automática"
        description={
          lastCompletedRun
            ? `Última sincronização ${formatRelative(lastCompletedRun.finishedAt)}`
            : "Puxa a lista direto do Instagram usando a sessão configurada."
        }
        action={
          <Button
            onClick={start}
            loading={running}
            disabled={!manualSync.available}
            icon={<RefreshCw className="size-4" />}
          >
            {running
              ? "Sincronizando…"
              : manualSync.willResume
                ? "Continuar"
                : "Sincronizar agora"}
          </Button>
        }
      />
      <CardBody className="space-y-4">
        {integration.blocked && (
          <Alert tone="danger" title="Integração pausada por segurança">
            O Instagram recusou a sessão ({integration.reason}). Renove os
            cookies no backend e faça o redeploy.
          </Alert>
        )}
        {!integration.configured && (
          <Alert tone="info" title="Modo automático não configurado">
            Defina INSTAGRAM_SESSION_ID, INSTAGRAM_CSRF_TOKEN e
            INSTAGRAM_DS_USER_ID no backend para usar a sincronização
            automática. Você ainda pode importar o arquivo manualmente.
          </Alert>
        )}

        {currentRun && (
          <div className="rounded-md border border-border bg-surface-muted p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge tone={STATUS_LABEL[currentRun.status].tone} dot>
                {STATUS_LABEL[currentRun.status].label}
              </Badge>
              <span className="text-xs text-muted">
                {formatNumber(currentRun.followersCollected)} seguidores ·{" "}
                {currentRun.pagesFetched} páginas
              </span>
            </div>
            {currentRun.status === "paused" && currentRun.errorCode && (
              <p className="mt-2 text-xs text-muted">
                {ERROR_CODE_LABEL[currentRun.errorCode] ?? currentRun.errorCode}{" "}
                — retoma no próximo agendamento ou pelo botão “Continuar”.
              </p>
            )}
          </div>
        )}

        {feedback?.kind === "success" && (
          <Alert
            tone={
              feedback.result.run.status === "completed"
                ? "success"
                : feedback.result.run.status === "failed"
                  ? "danger"
                  : "info"
            }
            title={
              feedback.result.run.status === "completed"
                ? "Sincronização concluída"
                : feedback.result.run.status === "paused"
                  ? "Sincronização pausada — continua depois"
                  : "Sincronização não concluída"
            }
          >
            {feedback.result.run.status === "completed"
              ? `${feedback.result.run.lostCount ?? 0} perdido(s), ${feedback.result.run.gainedCount ?? 0} novo(s).`
              : (ERROR_CODE_LABEL[feedback.result.run.errorCode ?? ""] ??
                feedback.result.run.errorMessage)}
          </Alert>
        )}
        {feedback?.kind === "error" && (
          <Alert tone="danger">{feedback.message}</Alert>
        )}

        {!running &&
          !manualSync.available &&
          manualSync.reason &&
          integration.configured &&
          !integration.blocked && (
            <p className="flex items-center gap-2 text-sm text-muted">
              <Clock className="size-4 shrink-0" aria-hidden />
              {DENIAL_MESSAGE[manualSync.reason]}
              {manualSync.nextAllowedAt &&
                ` Liberado ${formatRelative(manualSync.nextAllowedAt)}.`}
            </p>
          )}

        <p className="flex items-start gap-2 text-xs text-soft">
          <ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Travas: {limits.manualDailyLimit} sincronização manual por dia,
          intervalo mínimo de {limits.minIntervalMinutes} min e uma
          sincronização diária automática.
          {lastCompletedRun &&
            ` Última: ${formatDateTime(lastCompletedRun.finishedAt)}.`}
        </p>
      </CardBody>
    </Card>
  );
}
