import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type { AchievementsView, MonthlySummary } from "@/shared/contracts/api";

// Both are scoped to the Instagram profile selected in the UI.
export const engagementService = {
  achievements(token: string): Promise<AchievementsView> {
    return backendFetch("/engagement/achievements", { token });
  },

  summary(token: string, month?: string): Promise<MonthlySummary> {
    return backendFetch("/engagement/summary", { token, query: { month } });
  },
};
