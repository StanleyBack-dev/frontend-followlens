"use client";

import { useRef, useState, type DragEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { cn } from "@/design-system";

type ImportDropzoneProps = {
  uploading: boolean;
  onFile: (file: File) => void;
};

export function ImportDropzone({ uploading, onFile }: ImportDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors",
        dragging
          ? "border-accent bg-accent-soft"
          : "border-border bg-surface-muted",
        uploading && "pointer-events-none opacity-70",
      )}
    >
      <span className="mb-3 grid size-11 place-items-center rounded-full bg-surface text-accent">
        {uploading ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : (
          <FileUp className="size-5" aria-hidden />
        )}
      </span>
      <p className="text-sm font-medium text-fg">
        {uploading ? "Processando o arquivo…" : "Arraste o arquivo aqui"}
      </p>
      <p className="mt-1 text-xs text-muted">
        .zip ou .json de &ldquo;Seguidores e seguindo&rdquo;
      </p>
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="mt-4 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-fg hover:bg-surface-muted disabled:opacity-60"
      >
        Escolher arquivo
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".json,.zip,application/json,application/zip"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}
