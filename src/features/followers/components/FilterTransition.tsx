"use client";

import { createContext, use, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type Navigate = (href: string) => void;

const FilterNavigationContext = createContext<Navigate | null>(null);

// Wraps a filterable section: filter changes navigate inside a transition,
// so the current results stay on screen (dimmed) until the new ones arrive —
// no skeleton swap, no flicker.
export function FilterTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const navigate: Navigate = (href) =>
    startTransition(() => router.push(href, { scroll: false }));

  return (
    <FilterNavigationContext value={navigate}>
      <div
        aria-busy={pending || undefined}
        className={
          pending
            ? "pointer-events-none opacity-60 transition-opacity"
            : "transition-opacity"
        }
      >
        {children}
      </div>
    </FilterNavigationContext>
  );
}

export function useFilterNavigation(): Navigate {
  const navigate = use(FilterNavigationContext);
  if (!navigate) {
    throw new Error(
      "useFilterNavigation must be used inside <FilterTransition>",
    );
  }
  return navigate;
}
