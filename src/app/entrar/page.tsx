import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/design-system";
import { GoogleSignIn } from "@/features/auth/components/GoogleSignIn";
import { Logo } from "@/features/layout/components/Logo";
import { firstParam, type RawSearchParams } from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const expired = firstParam(params, "expired") === "1";

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <Card className="p-6 sm:p-8">
          <h1 className="text-center text-xl font-semibold text-fg">
            Entrar no FollowLens
          </h1>
          <p className="mt-1 mb-6 text-center text-sm text-muted">
            Descubra quem deixou de seguir você.
          </p>
          {expired && (
            <p className="mb-4 rounded-md bg-warning-soft px-3 py-2 text-center text-sm text-warning">
              Sua sessão expirou. Entre novamente.
            </p>
          )}
          <GoogleSignIn />
        </Card>
        <p className="mt-6 text-center text-xs text-soft">
          Ao entrar, você concorda com os{" "}
          <Link href="/termos" className="underline hover:text-muted">
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link href="/privacidade" className="underline hover:text-muted">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
