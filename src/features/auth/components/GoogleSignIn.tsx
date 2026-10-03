"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Alert, Spinner } from "@/design-system";
import { authClient } from "@/features/auth/api/auth.client";
import { ApiClientError } from "@/shared/lib/api-client";

// The Google Client ID is public by design (it identifies the app to Google).
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!CLIENT_ID) {
    return (
      <Alert tone="warning" title="Login não configurado">
        Defina NEXT_PUBLIC_GOOGLE_CLIENT_ID para habilitar o login com Google.
      </Alert>
    );
  }

  async function onCredential(idToken: string | undefined) {
    if (!idToken) {
      setError("Não foi possível obter as credenciais do Google.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await authClient.loginWithGoogle(idToken);
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Não foi possível entrar.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <Alert tone="danger">{error}</Alert>}
      <div className="flex min-h-[44px] items-center justify-center">
        {busy ? (
          <span className="flex items-center gap-2 text-sm text-muted">
            <Spinner size="sm" /> Entrando…
          </span>
        ) : (
          <GoogleOAuthProvider clientId={CLIENT_ID}>
            <GoogleLogin
              onSuccess={(response) => onCredential(response.credential)}
              onError={() => setError("Falha no login com o Google.")}
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
            />
          </GoogleOAuthProvider>
        )}
      </div>
    </div>
  );
}
