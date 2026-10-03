import type { SessionUser } from "@/shared/contracts/api";
import { apiRequest } from "@/shared/lib/api-client";

export const authClient = {
  loginWithGoogle(idToken: string) {
    return apiRequest<{ user: SessionUser }>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
  },

  logout() {
    return apiRequest<{ ok: true }>("/auth/logout", { method: "POST" });
  },

  acceptLegal() {
    return apiRequest<{ version: string }>("/legal/accept", { method: "POST" });
  },
};
