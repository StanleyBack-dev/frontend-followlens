import { redirect } from "next/navigation";
import { AppShell } from "@/features/layout/components/AppShell";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await authed((token) => authService.me(token));
  if (!user.termsAccepted) redirect("/accept-terms");
  return <AppShell user={user}>{children}</AppShell>;
}
