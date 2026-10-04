import type {
  CancelSubscriptionInput,
  SubscribeToProInput,
  SubscribeToProResult,
  SubscriptionSummary,
} from "@/shared/contracts/api";
import { apiRequest } from "@/shared/lib/api-client";

export const billingClient = {
  subscription() {
    return apiRequest<SubscriptionSummary>("/billing/subscription");
  },

  subscribe(input: SubscribeToProInput) {
    return apiRequest<SubscribeToProResult>("/billing/subscribe", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  cancel(input: CancelSubscriptionInput) {
    return apiRequest<SubscriptionSummary>("/billing/cancel", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
