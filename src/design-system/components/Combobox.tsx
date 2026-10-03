"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { inputClasses } from "@/design-system/components/Field";
import { Spinner } from "@/design-system/components/Spinner";
import { cn } from "@/design-system/utils/cn";

export type ComboboxOption = {
  value: string;
  label: string;
  description?: string;
};

type ComboboxProps = {
  label: string;
  hideLabel?: boolean;
  placeholder?: string;
  options: ComboboxOption[];
  /** Selected value (null = nothing selected). */
  value: string | null;
  /** Text shown in the input while a value is selected and the list is closed. */
  selectedLabel?: string;
  onSelect: (value: string | null) => void;
  /** Called on every keystroke; the parent decides how to fetch options. */
  onInputChange?: (text: string) => void;
  loading?: boolean;
  emptyText?: string;
  footer?: string;
  disabled?: boolean;
  className?: string;
};

// Searchable select following the WAI-ARIA combobox pattern: type to narrow
// the list, ↑/↓ to move, Enter to pick, Esc to close.
export function Combobox({
  label,
  hideLabel = false,
  placeholder,
  options,
  value,
  selectedLabel,
  onSelect,
  onInputChange,
  loading = false,
  emptyText = "Nenhum resultado",
  footer,
  disabled = false,
  className,
}: ComboboxProps) {
  const id = useId();
  const listId = `${id}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  // Close when clicking anywhere else.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  // Keep the highlighted option visible while navigating with the keyboard.
  useEffect(() => {
    if (activeIndex < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function openList() {
    if (disabled) return;
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setActiveIndex(-1);
    if (text) {
      setText("");
      onInputChange?.("");
    }
  }

  function choose(next: string | null) {
    close();
    if (next !== value) onSelect(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        openList();
        setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Enter":
        if (open && activeIndex >= 0 && options[activeIndex]) {
          event.preventDefault();
          choose(options[activeIndex].value);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          close();
        }
        break;
    }
  }

  const inputValue = open ? text : (selectedLabel ?? "");
  const activeId =
    open && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <label
        htmlFor={id}
        className={cn(
          "mb-1.5 block text-sm font-medium text-fg",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-soft"
          aria-hidden
        />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          autoComplete="off"
          spellCheck={false}
          maxLength={64}
          disabled={disabled}
          placeholder={value ? selectedLabel : placeholder}
          value={inputValue}
          onFocus={openList}
          onClick={openList}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            setText(event.target.value);
            setActiveIndex(-1);
            openList();
            onInputChange?.(event.target.value);
          }}
          className={cn(
            inputClasses,
            "pr-16 pl-9",
            value && !open && "font-medium",
          )}
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
          {loading && (
            <Spinner size="sm" className="text-soft" label="Buscando" />
          )}
          {value && !disabled ? (
            <button
              type="button"
              aria-label="Limpar filtro"
              onClick={() => choose(null)}
              className="grid size-6 place-items-center rounded-sm text-soft hover:bg-surface-muted hover:text-fg"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <ChevronDown className="mr-1 size-4 text-soft" aria-hidden />
          )}
        </div>
      </div>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-md border border-border bg-surface shadow-card">
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label={label}
            className="max-h-72 overflow-y-auto py-1"
          >
            {options.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted">
                {loading ? "Buscando…" : emptyText}
              </li>
            ) : (
              options.map((option, index) => {
                const selected = option.value === value;
                return (
                  <li
                    key={option.value}
                    id={`${id}-option-${index}`}
                    data-index={index}
                    role="option"
                    aria-selected={selected}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => choose(option.value)}
                    onPointerMove={() => setActiveIndex(index)}
                    className={cn(
                      "flex cursor-pointer flex-col px-3 py-2 text-sm",
                      index === activeIndex && "bg-surface-muted",
                      selected && "text-accent",
                    )}
                  >
                    <span className="truncate font-medium">{option.label}</span>
                    {option.description && (
                      <span className="truncate text-xs text-muted">
                        {option.description}
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
          {footer && (
            <p className="border-t border-border px-3 py-2 text-xs text-soft">
              {footer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
