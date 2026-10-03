export type RawSearchParams = Record<string, string | string[] | undefined>;

export function firstParam(
  params: RawSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function pageParam(params: RawSearchParams): number {
  const page = Number(firstParam(params, "page"));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function oneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined;
}

/** Builds `path?query` dropping empty values. */
export function buildHref(
  path: string,
  query: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (
      value !== undefined &&
      value !== "" &&
      !(key === "page" && value === 1)
    ) {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}
