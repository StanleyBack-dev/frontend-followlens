import { cn } from "@/design-system/utils/cn";

type SpinnerProps = { size?: "sm" | "md"; className?: string; label?: string };

export function Spinner({
  size = "md",
  className,
  label = "Carregando",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-r-transparent",
        size === "sm" ? "size-3.5" : "size-5",
        className,
      )}
    />
  );
}
