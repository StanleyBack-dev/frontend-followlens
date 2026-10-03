"use client";

import { useEffect, useRef, useState } from "react";
import { Combobox } from "@/design-system";
import {
  type FilterOptionsScope,
  followersClient,
} from "@/features/followers/api/followers.client";
import { useFilterNavigation } from "@/features/followers/components/FilterTransition";
import type { FollowerFilterOptions } from "@/shared/contracts/api";
import { buildHref } from "@/shared/lib/search-params";

const SEARCH_DEBOUNCE_MS = 250;

type FollowerFilterComboboxProps = {
  /** Options rendered by the server for the current context (no search). */
  initialOptions: FollowerFilterOptions;
  /** Context the options must be scoped to (page status / event type). */
  scope: FilterOptionsScope;
  /** Currently selected @username (from the URL). */
  value: string | undefined;
  /** Page path and the other query params to keep when the filter changes. */
  path: string;
  query: Record<string, string | undefined>;
};

// Type-to-search follower filter. The typed text is sent to the backend,
// which does the matching; the chosen @username goes to the URL and the
// backend validates it when the list is loaded.
export function FollowerFilterCombobox({
  initialOptions,
  scope,
  value,
  path,
  query,
}: FollowerFilterComboboxProps) {
  const navigate = useFilterNavigation();
  const [result, setResult] = useState(initialOptions);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflight = useRef<AbortController | null>(null);

  // New server data (page/context changed) resets the list.
  const [serverOptions, setServerOptions] = useState(initialOptions);
  if (serverOptions !== initialOptions) {
    setServerOptions(initialOptions);
    setResult(initialOptions);
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      inflight.current?.abort();
    },
    [],
  );

  function search(text: string) {
    if (timer.current) clearTimeout(timer.current);
    inflight.current?.abort();

    if (!text.trim()) {
      setLoading(false);
      setResult(initialOptions);
      return;
    }

    setLoading(true);
    timer.current = setTimeout(async () => {
      const controller = new AbortController();
      inflight.current = controller;
      try {
        setResult(
          await followersClient.filterOptions(scope, text, controller.signal),
        );
      } catch {
        if (!controller.signal.aborted)
          setResult({ options: [], truncated: false });
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);
  }

  const total = initialOptions.options.length;

  return (
    <Combobox
      className="w-full sm:w-80"
      label="Filtrar por seguidor"
      hideLabel
      placeholder={`Buscar entre ${total}${initialOptions.truncated ? "+" : ""} seguidores`}
      value={value ?? null}
      selectedLabel={value ? `@${value}` : undefined}
      disabled={total === 0}
      loading={loading}
      emptyText="Nenhum seguidor encontrado"
      footer={
        result.truncated
          ? "Mostrando os primeiros resultados — continue digitando para refinar."
          : undefined
      }
      onInputChange={search}
      onSelect={(next) =>
        navigate(buildHref(path, { ...query, user: next ?? undefined }))
      }
      options={result.options.map((option) => ({
        value: option.username,
        label: `@${option.username}`,
      }))}
    />
  );
}
