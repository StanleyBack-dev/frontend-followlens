import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/features/layout/components/Logo";

export function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 py-10 sm:px-6">
      <Link href="/login" className="inline-block">
        <Logo />
      </Link>
      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-fg">
        {title}
      </h1>
      <p className="mt-1 text-sm text-soft">Última atualização: {updatedAt}</p>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted [&_h2]:mt-7 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-fg [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
      <footer className="mt-10 border-t border-border pt-5 text-xs text-soft">
        <Link href="/terms" className="hover:text-muted">
          Termos de Uso
        </Link>
        {" · "}
        <Link href="/privacy" className="hover:text-muted">
          Política de Privacidade
        </Link>
        {" · "}
        <Link href="/login" className="hover:text-muted">
          Entrar
        </Link>
      </footer>
    </main>
  );
}
