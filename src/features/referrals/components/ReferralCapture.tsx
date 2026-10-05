"use client";

import { useEffect } from "react";
import { REFERRAL_COOKIE, REFERRAL_COOKIE_DAYS } from "@/shared/lib/referral";

const COUNTED_KEY = "fl:referral-click";

// Rendered on the login page when it was opened through a referral link:
// remembers the code for the sign-up and counts the click once per browser.
export function ReferralCapture({ code }: { code: string }) {
  useEffect(() => {
    const maxAge = REFERRAL_COOKIE_DAYS * 24 * 60 * 60;
    document.cookie = `${REFERRAL_COOKIE}=${code}; path=/; max-age=${maxAge}; samesite=lax`;

    try {
      if (window.localStorage.getItem(COUNTED_KEY) === code) return;
      window.localStorage.setItem(COUNTED_KEY, code);
    } catch {
      // Storage blocked: count it anyway rather than lose the click.
    }
    void fetch("/api/referrals/click", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
      keepalive: true,
    }).catch(() => undefined);
  }, [code]);

  return null;
}
