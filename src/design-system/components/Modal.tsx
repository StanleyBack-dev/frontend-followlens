"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/design-system/utils/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Shown next to the title (e.g. a warning icon). */
  icon?: ReactNode;
  tone?: "neutral" | "danger";
  children: ReactNode;
  /** Action buttons, right-aligned in the footer. */
  footer?: ReactNode;
  /** Blocks closing (Esc / backdrop) while an action is in flight. */
  busy?: boolean;
};

// Built on the native <dialog>: showModal() gives the focus trap, Esc handling
// and the top layer for free.
export function Modal({
  open,
  onClose,
  title,
  icon,
  tone = "neutral",
  children,
  footer,
  busy = false,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Keep the open state owned by the parent.
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current && !busy) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-border bg-surface p-0 text-fg shadow-card backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start gap-3 p-5 pb-3">
        {icon && (
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-md",
              tone === "danger"
                ? "bg-danger-soft text-danger"
                : "bg-accent-soft text-accent",
            )}
          >
            {icon}
          </span>
        )}
        <h2
          id={titleId}
          className="min-w-0 flex-1 pt-2 text-base font-semibold"
        >
          {title}
        </h2>
      </div>
      <div className="px-5 pb-5 text-sm text-muted">{children}</div>
      {footer && (
        <div className="flex justify-end gap-2 border-t border-border bg-surface-muted px-5 py-3.5">
          {footer}
        </div>
      )}
    </dialog>
  );
}
