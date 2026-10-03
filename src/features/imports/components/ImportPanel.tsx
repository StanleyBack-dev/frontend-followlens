"use client";

import { ExternalLink } from "lucide-react";
import { Alert, Badge, Card, CardBody, CardHeader } from "@/design-system";
import { ImportDropzone } from "@/features/imports/components/ImportDropzone";
import { useImportUpload } from "@/features/imports/hooks/useImportUpload";
import type { ImportStatusView } from "@/shared/contracts/api";
import { formatDateTime, formatRelative } from "@/shared/lib/format";

export function ImportPanel({ status }: { status: ImportStatusView }) {
  const { uploading, feedback, upload } = useImportUpload();
  const { lastImport, today } = status;

  return (
    <Card>
      <CardHeader
        title="Importar seguidores"
        description={
          lastImport
            ? `Última importação ${formatRelative(lastImport.createdAt)} (${formatDateTime(lastImport.createdAt)})`
            : "Envie o arquivo exportado do Instagram para começar."
        }
        action={
          <Badge tone={today.remaining > 0 ? "neutral" : "warning"}>
            {today.remaining} de {today.limit} hoje
          </Badge>
        }
      />
      <CardBody className="space-y-4">
        {feedback?.kind === "success" && (
          <Alert
            tone={feedback.result.import.baseline ? "info" : "success"}
            title={
              feedback.result.import.baseline
                ? "Lista base criada"
                : "Importação concluída"
            }
          >
            {feedback.result.import.baseline
              ? `${feedback.result.import.followersCount} seguidores registrados. A partir da próxima importação os unfollows serão detectados.`
              : `${feedback.result.import.lostCount ?? 0} deixaram de seguir, ${feedback.result.import.gainedCount ?? 0} novos.${feedback.result.emailsSent > 0 ? ` ${feedback.result.emailsSent} alerta(s) por e-mail enviado(s).` : ""}`}
          </Alert>
        )}
        {feedback?.kind === "error" && (
          <Alert tone="danger">{feedback.message}</Alert>
        )}

        {today.remaining > 0 ? (
          <ImportDropzone uploading={uploading} onFile={upload} />
        ) : (
          <Alert tone="warning">
            Você atingiu o limite de {today.limit} importações hoje. Tente
            novamente amanhã.
          </Alert>
        )}

        <details className="rounded-md border border-border bg-surface-muted p-4 text-sm">
          <summary className="cursor-pointer font-medium text-fg">
            Como exportar seus seguidores no Instagram
          </summary>
          <a
            href="https://accountscenter.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg hover:bg-accent-hover"
          >
            Abrir a Central de Contas
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted">
            <li>
              Na Central de Contas, toque em &ldquo;Suas informações e
              permissões&rdquo; &rarr; &ldquo;Exportar suas informações&rdquo;.
            </li>
            <li>
              Crie uma exportação só de &ldquo;Seguidores e seguindo&rdquo;, no
              formato <strong>JSON</strong>, exportando para o dispositivo.
            </li>
            <li>
              Baixe o arquivo quando o Instagram avisar que ficou pronto (pode
              levar de minutos a algumas horas).
            </li>
            <li>
              Envie o .zip aqui, ou só o arquivo followers_1.json de dentro
              dele.
            </li>
          </ol>
        </details>
      </CardBody>
    </Card>
  );
}
