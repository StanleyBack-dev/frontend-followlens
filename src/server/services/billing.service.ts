import "server-only";
import { backendFetch } from "@/server/http/backend-client";
import type {
  BillingPayment,
  CancelSubscriptionInput,
  Paginated,
  SubscribeToProInput,
  SubscribeToProResult,
  SubscriptionSummary,
} from "@/shared/contracts/api";

// The gateway round-trips (customer + subscription + first invoice) take a
// few seconds.
const GATEWAY_TIMEOUT_MS = 45_000;

// Every call acts on the session's own subscription.
export const billingService = {
  subscription(token: string): Promise<SubscriptionSummary> {
    return backendFetch("/billing/subscription", { token });
  },

  payments(
    token: string,
    params: { page?: number; limit?: number },
  ): Promise<Paginated<BillingPayment>> {
    return backendFetch("/billing/payments", { token, query: params });
  },

  subscribe(
    token: string,
    input: SubscribeToProInput,
  ): Promise<SubscribeToProResult> {
    return backendFetch("/billing/subscribe", {
      method: "POST",
      token,
      body: input,
      timeoutMs: GATEWAY_TIMEOUT_MS,
    });
  },

  cancel(
    token: string,
    input: CancelSubscriptionInput,
  ): Promise<SubscriptionSummary> {
    return backendFetch("/billing/cancel", {
      method: "POST",
      token,
      body: input,
      timeoutMs: GATEWAY_TIMEOUT_MS,
    });
  },
};
