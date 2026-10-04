import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { buttonClasses, cn } from "@/design-system";
import { BILLING_PATH } from "@/features/billing/model/billing-labels";

// Shown in place of (or next to) something the Free plan locks.
export function ProUpsell({
  title,
  children,
  className,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-md border border-accent/30 bg-accent-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 gap-3">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
        <div className="min-w-0 text-sm">
          <p className="font-semibold text-fg">{title}</p>
          {children && <div className="mt-0.5 text-muted">{children}</div>}
        </div>
      </div>
      <Link
        href={BILLING_PATH}
        className={cn(buttonClasses("primary", "sm"), "shrink-0")}
      >
        Conhecer o Pro
      </Link>
    </div>
  );
}
