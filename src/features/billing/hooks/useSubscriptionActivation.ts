"use client";

import { useEffect, useRef } from "react";
import { billingClient } from "@/features/billing/api/billing.client";

const POLL_MS = 5_000;

// While a payment is being made elsewhere (hosted invoice, banking app), asks
// the backend every few seconds whether the gateway already confirmed it.
export function useSubscriptionActivation(
  waiting: boolean,
  onActivated: () => void,
) {
  const callback = useRef(onActivated);
  useEffect(() => {
    callback.current = onActivated;
  });

  useEffect(() => {
    if (!waiting) return;
    let stopped = false;
    const timer = setInterval(async () => {
      try {
        const summary = await billingClient.subscription();
        if (!stopped && summary.subscription?.status === "active") {
          stopped = true;
          clearInterval(timer);
          callback.current();
        }
      } catch {
        // A failed poll is simply retried on the next tick.
      }
    }, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [waiting]);
}
