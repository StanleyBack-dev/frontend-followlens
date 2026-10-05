import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type { SessionUser } from "@/shared/contracts/api";

type GoogleLoginResponse = {
  accessToken: string;
  expiresAt: string;
  user: SessionUser;
};

export const authService = {
  loginWithGoogle(
    idToken: string,
    referralCode?: string,
  ): Promise<GoogleLoginResponse> {
    return backendFetch<GoogleLoginResponse>("/auth/google", {
      method: "POST",
      body: { idToken, referralCode },
    });
  },

  me(token: string): Promise<SessionUser> {
    return backendFetch("/auth/me", { token });
  },

  acceptLegal(token: string): Promise<{ version: string; acceptedAt: string }> {
    return backendFetch("/legal/accept", { method: "POST", token });
  },
};
