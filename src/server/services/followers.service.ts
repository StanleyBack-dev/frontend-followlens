import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type {
  Follower,
  FollowerEvent,
  FollowerEventType,
  FollowerFilterOptions,
  FollowersOverview,
  FollowerStatus,
  Paginated,
} from "@/shared/contracts/api";

export type ListFollowersParams = {
  status?: FollowerStatus;
  search?: string;
  username?: string;
  page?: number;
  limit?: number;
};

export type ListEventsParams = {
  type?: FollowerEventType;
  username?: string;
  page?: number;
  limit?: number;
};

export const followersService = {
  overview(token: string): Promise<FollowersOverview> {
    return backendFetch("/followers/overview", { token });
  },

  list(
    token: string,
    params: ListFollowersParams,
  ): Promise<Paginated<Follower>> {
    return backendFetch("/followers", { token, query: params });
  },

  events(
    token: string,
    params: ListEventsParams,
  ): Promise<Paginated<FollowerEvent>> {
    return backendFetch("/followers/events", { token, query: params });
  },

  filterOptions(
    token: string,
    params: { status?: FollowerStatus; search?: string },
  ): Promise<FollowerFilterOptions> {
    return backendFetch("/followers/filter-options", { token, query: params });
  },

  eventFilterOptions(
    token: string,
    params: { type?: FollowerEventType; search?: string },
  ): Promise<FollowerFilterOptions> {
    return backendFetch("/followers/events/filter-options", {
      token,
      query: params,
    });
  },
};
