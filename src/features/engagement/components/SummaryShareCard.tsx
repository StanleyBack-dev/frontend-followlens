"use client";

import { useState, useSyncExternalStore } from "react";
import { Download, Share2 } from "lucide-react";
import { Alert, Button, buttonClasses } from "@/design-system";

const noopSubscribe = () => () => {};

// Preview of the month's story card, with download and (on phones) the
// device's share sheet. The image is rendered by the BFF from the summary.
export function SummaryShareCard({
  month,
  label,
}: {
  /** YYYY-MM */
  month: string;
  /** e.g. "setembro de 2026" */
  label: string;
}) {
  const src = `/api/cards/resumo?mes=${month}`;
  const filename = `followlens-${month}.png`;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canShareFiles = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.share === "function" && "canShare" in navigator,
    () => false,
  );

  async function share() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(src, { credentials: "same-origin" });
      if (!response.ok) throw new Error("card");
      const file = new File([await response.blob()], filename, {
        type: "image/png",
      });
      if (!navigator.canShare({ files: [file] })) throw new Error("share");
      await navigator.share({ files: [file], title: `Meu ${label}` });
    } catch (err) {
      // Closing the share sheet is not an error worth showing.
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setError("Não foi possível compartilhar. Baixe a imagem e envie-a.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
      {/* eslint-disable-next-line @next/next/no-img-element -- generated per user, not a static asset */}
      <img
        src={src}
        alt={`Cartão com o resumo de ${label}`}
        width={1080}
        height={1920}
        loading="lazy"
        className="w-44 shrink-0 rounded-lg border border-border"
      />
      <div className="space-y-3">
        <p className="text-sm text-muted">
          A imagem mostra o saldo, os novos seguidores e os que saíram em{" "}
          {label}. Nenhum nome aparece nela.
        </p>
        <div className="flex flex-wrap gap-2">
          <a href={src} download={filename} className={buttonClasses()}>
            <Download className="size-4" aria-hidden />
            Baixar imagem
          </a>
          {canShareFiles && (
            <Button
              variant="secondary"
              onClick={share}
              loading={busy}
              icon={<Share2 className="size-4" />}
            >
              Compartilhar
            </Button>
          )}
        </div>
        {error && <Alert tone="warning">{error}</Alert>}
      </div>
    </div>
  );
}
