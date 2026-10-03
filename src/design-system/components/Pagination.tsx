import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonClasses } from "@/design-system/components/Button";
import { cn } from "@/design-system/utils/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  hrefFor: (page: number) => string;
};

export function Pagination({
  page,
  totalPages,
  total,
  hrefFor,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageLink = (
    target: number,
    label: string,
    icon: ReactNode,
    disabled: boolean,
  ) =>
    disabled ? (
      <span
        aria-disabled
        className={cn(
          buttonClasses("secondary", "sm"),
          "pointer-events-none opacity-40",
        )}
      >
        {icon}
        <span className="sr-only sm:not-sr-only">{label}</span>
      </span>
    ) : (
      <Link href={hrefFor(target)} className={buttonClasses("secondary", "sm")}>
        {icon}
        <span className="sr-only sm:not-sr-only">{label}</span>
      </Link>
    );

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-between gap-3 border-t border-border px-5 py-3"
    >
      <p className="text-sm text-muted">
        Página <span className="font-medium text-fg">{page}</span> de{" "}
        {totalPages}
        <span className="hidden sm:inline"> · {total} registros</span>
      </p>
      <div className="flex gap-2">
        {pageLink(
          page - 1,
          "Anterior",
          <ChevronLeft className="size-4" />,
          page <= 1,
        )}
        {pageLink(
          page + 1,
          "Próxima",
          <ChevronRight className="size-4" />,
          page >= totalPages,
        )}
      </div>
    </nav>
  );
}
