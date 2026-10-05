import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type { ReferralOverview } from "@/shared/contracts/api";

export const referralsService = {
  overview(token: string): Promise<ReferralOverview> {
    return backendFetch("/referrals", { token });
  },

  // No session: the visitor opening a referral link is not signed in yet.
  recordClick(code: string): Promise<void> {
    return backendFetch("/referrals/clicks", {
      method: "POST",
      body: { code },
    });
  },
};
