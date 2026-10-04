"use client";

import { useState } from "react";
import { CheckCircle2, Download } from "lucide-react";
import { Alert, Button, Card, CardBody, CardHeader } from "@/design-system";
import { IosInstallSteps } from "@/features/install/components/IosInstallSteps";
import {
  promptInstall,
  useInstallState,
} from "@/features/install/model/install-store";

// Permanent home of the install option (the one-time invite points here).
export function InstallAppCard() {
  const { ready, installed, canPrompt, ios } = useInstallState();
  const [busy, setBusy] = useState(false);
  const [declined, setDeclined] = useState(false);

  async function install() {
    setBusy(true);
    setDeclined(!(await promptInstall()));
    setBusy(false);
  }

  return (
    <Card>
      <CardHeader
        title="Aplicativo"
        description="Instale o FollowLens neste dispositivo e abra o painel direto da tela inicial, sem passar pelo navegador."
      />
      <CardBody className="space-y-4">
        {!ready ? null : installed ? (
          <p className="flex items-center gap-2 text-sm text-fg">
            <CheckCircle2 className="size-4 text-success" aria-hidden />O
            FollowLens já está instalado neste dispositivo.
          </p>
        ) : canPrompt ? (
          <Button
            onClick={install}
            loading={busy}
            icon={<Download className="size-4" />}
          >
            Instalar o app
          </Button>
        ) : ios ? (
          <IosInstallSteps />
        ) : (
          <p className="text-sm text-muted">
            Abra o menu do navegador e escolha{" "}
            <strong className="text-fg">Instalar app</strong> ou{" "}
            <strong className="text-fg">Adicionar à tela inicial</strong>. A
            opção aparece no Chrome e no Edge; se o app já estiver instalado,
            ela não é oferecida de novo.
          </p>
        )}
        {declined && (
          <Alert tone="info">
            A instalação foi cancelada. Para tentar de novo, recarregue a página
            ou use o menu do navegador.
          </Alert>
        )}
      </CardBody>
    </Card>
  );
}
