import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AcceptTermsCard } from "@/features/auth/components/AcceptTermsCard";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";

export const metadata: Metadata = { title: "Aceitar os termos" };
export const dynamic = "force-dynamic";

export default async function AcceptTermsPage() {
  const user = await authed((token) => authService.me(token));
  // Already accepted → nothing to do here.
  if (user.termsAccepted) redirect("/dashboard");
  return <AcceptTermsCard />;
}
