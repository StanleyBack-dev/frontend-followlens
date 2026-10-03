import { useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { inputClasses } from "@/design-system/components/Field";
import { cn } from "@/design-system/utils/cn";

export type SelectOption = { value: string; label: string };

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  /** Visually hide the label (still read by screen readers). */
  hideLabel?: boolean;
  options: SelectOption[];
  /** First option, with value "" (e.g. "Todos"). */
  placeholder?: string;
};

// Native <select> styled with the design tokens: accessible, keyboard and
// mobile friendly out of the box.
export function Select({
  label,
  hideLabel = false,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className={className}>
      <label
        htmlFor={selectId}
        className={cn(
          "mb-1.5 block text-sm font-medium text-fg",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={cn(inputClasses, "cursor-pointer appearance-none pr-9")}
          {...props}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-soft"
          aria-hidden
        />
      </div>
    </div>
  );
}
