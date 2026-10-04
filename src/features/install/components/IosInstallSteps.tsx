import { PlusSquare, Share } from "lucide-react";

// Safari has no install prompt: the app is added from the Share menu.
export function IosInstallSteps() {
  return (
    <ol className="space-y-1.5 text-sm text-muted">
      <li className="flex items-center gap-2">
        <span className="font-medium text-fg">1.</span>
        Toque em
        <span className="inline-flex items-center gap-1 font-medium text-fg">
          <Share className="size-4" aria-hidden />
          Compartilhar
        </span>
        no Safari.
      </li>
      <li className="flex items-center gap-2">
        <span className="font-medium text-fg">2.</span>
        Escolha
        <span className="inline-flex items-center gap-1 font-medium text-fg">
          <PlusSquare className="size-4" aria-hidden />
          Adicionar à Tela de Início
        </span>
        .
      </li>
    </ol>
  );
}
