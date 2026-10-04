import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UserMinus } from "lucide-react";
import { Card, CardHeader, EmptyState, PageHeader } from "@/design-system";
import { FollowerEventList } from "@/features/followers/components/FollowerEventList";
import { OverviewStats } from "@/features/followers/components/OverviewStats";
import { ImportPanel } from "@/features/imports/components/ImportPanel";
import { SyncPanel } from "@/features/sync/components/SyncPanel";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";
import { followersService } from "@/server/services/followers.service";
import { importsService } from "@/server/services/imports.service";
import { profilesService } from "@/server/services/profiles.service";
import { syncService } from "@/server/services/sync.service";

export const metadata: Metadata = { title: "Visão geral" };

export default async function DashboardPage() {
  const { overview, importStatus, recentLost, syncStatus, profileName } =
    await authed(async (token) => {
      const user = await authService.me(token);
      const [overview, importStatus, recentLost, profiles] = await Promise.all([
        followersService.overview(token),
        importsService.status(token),
        followersService.events(token, { type: "lost", limit: 6 }),
        profilesService.list(token),
      ]);
      // The session-sync panel is owner-only.
      const syncStatus = user.isAdmin ? await syncService.status(token) : null;
      // Only worth naming the profile when there is more than one to pick.
      const usable = profiles.profiles.filter((profile) => !profile.locked);
      const profileName =
        usable.length > 1
          ? usable.find((profile) => profile.id === profiles.activeId)?.name
          : undefined;
      return { overview, importStatus, recentLost, syncStatus, profileName };
    });

  return (
    <>
      <PageHeader
        title="Visão geral"
        description="Seus seguidores e as últimas mudanças detectadas."
      />

      <OverviewStats overview={overview} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader
            title="Unfollows recentes"
            description="Quem deixou de seguir você nas últimas importações."
            action={
              recentLost.total > 0 && (
                <Link
                  href="/historico"
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  Ver todos <ArrowRight className="size-3.5" />
                </Link>
              )
            }
          />
          <div className="mt-3">
            {recentLost.items.length > 0 ? (
              <FollowerEventList events={recentLost.items} showType={false} />
            ) : (
              <EmptyState
                icon={<UserMinus className="size-5" />}
                title="Nenhum unfollow registrado"
                description={
                  overview.activeFollowers === 0
                    ? "Importe o arquivo de seguidores para criar a lista base."
                    : "Ninguém deixou de seguir você desde a lista base."
                }
              />
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <ImportPanel status={importStatus} profileName={profileName} />
          {syncStatus && <SyncPanel initialStatus={syncStatus} />}
        </div>
      </div>
    </>
  );
}
