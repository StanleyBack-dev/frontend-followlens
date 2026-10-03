import type {
  FollowerEventType,
  FollowerFilterOptions,
  FollowerStatus,
} from "@/shared/contracts/api";
import { apiRequest } from "@/shared/lib/api-client";

export type FilterOptionsScope =
  | { scope: "followers"; status?: FollowerStatus }
  | { scope: "events"; type?: FollowerEventType };

export const followersClient = {
  filterOptions(
    scope: FilterOptionsScope,
    search: string,
    signal?: AbortSignal,
  ): Promise<FollowerFilterOptions> {
    const params = new URLSearchParams({ scope: scope.scope });
    if (scope.scope === "followers" && scope.status)
      params.set("status", scope.status);
    if (scope.scope === "events" && scope.type) params.set("type", scope.type);
    if (search) params.set("search", search);
    return apiRequest(`/followers/filter-options?${params.toString()}`, {
      signal,
    });
  },
};
