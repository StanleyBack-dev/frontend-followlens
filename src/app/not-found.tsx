import Link from "next/link";
import { buttonClasses } from "@/design-system";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-medium text-accent">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-fg">
          Página não encontrada
        </h1>
        <Link
          href="/dashboard"
          className={`${buttonClasses("secondary")} mt-6`}
        >
          Voltar ao painel
        </Link>
      </div>
    </main>
  );
}
