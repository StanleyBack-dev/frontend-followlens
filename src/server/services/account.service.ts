import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type {
  AccountDeletionResult,
  AccountProfile,
  UpdateAccountProfileInput,
} from "@/shared/contracts/api";

// Every call acts on the session's own account; the backend never takes a
// user id here.
export const accountService = {
  profile(token: string): Promise<AccountProfile> {
    return backendFetch("/account", { token });
  },

  update(
    token: string,
    input: UpdateAccountProfileInput,
  ): Promise<AccountProfile> {
    return backendFetch("/account", { method: "PATCH", token, body: input });
  },

  requestDeletion(
    token: string,
    confirmEmail: string,
  ): Promise<AccountDeletionResult> {
    return backendFetch("/account/deletion", {
      method: "POST",
      token,
      body: { confirmEmail },
    });
  },

  cancelDeletion(token: string): Promise<AccountProfile> {
    return backendFetch("/account/deletion", { method: "DELETE", token });
  },
};
