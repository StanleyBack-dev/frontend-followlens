import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/design-system";
import { GoogleSignIn } from "@/features/auth/components/GoogleSignIn";
import { ReferralCapture } from "@/features/referrals/components/ReferralCapture";
import { LoginShowcase } from "@/features/auth/components/LoginShowcase";
import { Logo } from "@/features/layout/components/Logo";
import { firstParam, type RawSearchParams } from "@/shared/lib/search-params";
import { REFERRAL_CODE, REFERRAL_PARAM } from "@/shared/lib/referral";
import { SITE_NAME, SITE_TAGLINE } from "@/shared/lib/site";

// The public face of the product: the only page (besides the legal ones)
// offered to search engines, so it carries the product title, not "Entrar".
export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
  alternates: { canonical: "/entrar" },
  robots: { index: true, follow: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const expired = firstParam(params, "expired") === "1";
  const referralCode = firstParam(params, REFERRAL_PARAM)?.toUpperCase();

  return (
    <main className="min-h-dvh lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* What it is + sign-in. First on every screen size. */}
      <section className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Logo size="lg" />
          <h1 className="mt-10 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Descubra quem deixou de seguir você no Instagram
          </h1>
          <p className="mt-4 text-base text-muted">
            O FollowLens compara as suas listas de seguidores e mostra quem
            saiu, quem chegou e quem voltou — sem pedir a senha do Instagram.
          </p>

          <Card className="mt-8 p-6">
            <h2 className="text-center text-base font-semibold text-fg">
              Entre ou crie sua conta
            </h2>
            <p className="mt-1 mb-5 text-center text-sm text-muted">
              É grátis para começar. Use a sua conta Google.
            </p>
            {expired && (
              <p className="mb-4 rounded-md bg-warning-soft px-3 py-2 text-center text-sm text-warning">
                Sua sessão expirou. Entre novamente.
              </p>
            )}
            {referralCode && REFERRAL_CODE.test(referralCode) && (
              <ReferralCapture code={referralCode} />
            )}
            <GoogleSignIn />
          </Card>

          <p className="mt-5 text-center text-xs text-soft">
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
      </section>

      {/* How it works. Beside the sign-in on wide screens, below it otherwise. */}
      <section className="flex flex-col justify-center border-t border-border bg-surface-sunken px-6 py-12 sm:px-10 lg:border-t-0 lg:border-l lg:px-16">
        <LoginShowcase />
      </section>
    </main>
  );
}
