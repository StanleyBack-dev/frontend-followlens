import type { UserProfiles } from "@/shared/contracts/api";
import { apiRequest } from "@/shared/lib/api-client";

export const profilesClient = {
  create(name: string) {
    return apiRequest<UserProfiles>("/profiles", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  rename(id: string, name: string) {
    return apiRequest<UserProfiles>(`/profiles/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
  },

  remove(id: string) {
    return apiRequest<UserProfiles>(`/profiles/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  select(id: string) {
    return apiRequest<{ ok: true }>("/profiles/active", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },
};
