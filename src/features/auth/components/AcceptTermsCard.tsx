"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, Card } from "@/design-system";
import { authClient } from "@/features/auth/api/auth.client";
import { Logo } from "@/features/layout/components/Logo";
import { ApiClientError } from "@/shared/lib/api-client";

export function AcceptTermsCard() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function accept() {
    setBusy(true);
    setError(null);
    try {
      await authClient.acceptLegal();
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Não foi possível continuar.",
      );
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <Card className="p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-fg">Antes de começar</h1>
          <p className="mt-2 text-sm text-muted">
            Para usar o FollowLens, você precisa ler e aceitar nossos{" "}
            <Link
              href="/terms"
              target="_blank"
              className="text-accent underline"
            >
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="text-accent underline"
            >
              Política de Privacidade
            </Link>
            .
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted">
            <li>
              • Seus dados de seguidores são privados e exclusivos da sua conta.
            </li>
            <li>
              • Você envia seus dados pela exportação oficial do Instagram.
            </li>
            <li>• Você pode excluir sua conta e seus dados quando quiser.</li>
          </ul>
          {error && (
            <Alert tone="danger" className="mt-4">
              {error}
            </Alert>
          )}
          <Button
            className="mt-6 w-full"
            size="lg"
            loading={busy}
            onClick={accept}
          >
            Li e aceito
          </Button>
        </Card>
      </div>
    </main>
  );
}
