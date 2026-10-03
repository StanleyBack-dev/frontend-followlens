import type { AdminUser, UpdateUserAccessInput } from "@/shared/contracts/api";
import { apiRequest } from "@/shared/lib/api-client";

export const adminClient = {
  updateAccess(userId: string, input: UpdateUserAccessInput) {
    return apiRequest<AdminUser>(`/admin/users/${encodeURIComponent(userId)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },
};
