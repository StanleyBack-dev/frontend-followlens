import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type { ActiveProfiles, UserProfiles } from "@/shared/contracts/api";

// The Instagram profiles of the session's own account.
export const profilesService = {
  list(token: string): Promise<ActiveProfiles> {
    return backendFetch("/profiles", { token });
  },

  create(token: string, name: string): Promise<UserProfiles> {
    return backendFetch("/profiles", { method: "POST", token, body: { name } });
  },

  rename(token: string, id: string, name: string): Promise<UserProfiles> {
    return backendFetch(`/profiles/${encodeURIComponent(id)}`, {
      method: "PATCH",
      token,
      body: { name },
    });
  },

  remove(token: string, id: string): Promise<UserProfiles> {
    return backendFetch(`/profiles/${encodeURIComponent(id)}`, {
      method: "DELETE",
      token,
    });
  },
};
