import Link from "next/link";
import { cn } from "@/design-system/utils/cn";

export type SegmentedNavItem = {
  label: string;
  href: string;
  active: boolean;
  count?: number;
};

// URL-driven segmented control (filters live in the query string, so the
// page stays a Server Component and every state is linkable).
export function SegmentedNav({
  items,
  label,
}: {
  items: SegmentedNavItem[];
  label: string;
}) {
  return (
    <nav
      aria-label={label}
      className="inline-flex rounded-md border border-border bg-surface-muted p-1"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
            item.active
              ? "bg-surface text-fg shadow-sm"
              : "text-muted hover:text-fg",
          )}
        >
          {item.label}
          {item.count !== undefined && (
            <span className="text-xs tabular-nums text-soft">{item.count}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}
