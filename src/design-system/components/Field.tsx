import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/design-system/utils/cn";

export const inputClasses = cn(
  "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg",
  "placeholder:text-soft transition-colors",
  "focus:border-accent focus:outline-none focus:ring-4 focus:ring-ring/30",
  "disabled:opacity-60",
);

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Field({ label, error, className, id, ...props }: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-fg"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(inputClasses, error && "border-danger")}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
