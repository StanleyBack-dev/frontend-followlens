import type {
  AccountDeletionResult,
  AccountProfile,
  UpdateAccountProfileInput,
} from "@/shared/contracts/api";
import { apiRequest } from "@/shared/lib/api-client";

export const accountClient = {
  update(input: UpdateAccountProfileInput) {
    return apiRequest<AccountProfile>("/account", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  requestDeletion(confirmEmail: string) {
    return apiRequest<AccountDeletionResult>("/account/deletion", {
      method: "POST",
      body: JSON.stringify({ confirmEmail }),
    });
  },

  cancelDeletion() {
    return apiRequest<AccountProfile>("/account/deletion", {
      method: "DELETE",
    });
  },
};
