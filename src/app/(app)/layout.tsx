import { redirect } from "next/navigation";
import { AppShell } from "@/features/layout/components/AppShell";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";
import { profilesService } from "@/server/services/profiles.service";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await authed((token) => authService.me(token));
  if (!user.termsAccepted) redirect("/aceitar-termos");
  const profiles = await authed((token) => profilesService.list(token));
  return (
    <AppShell user={user} profiles={profiles}>
      {children}
    </AppShell>
  );
}
