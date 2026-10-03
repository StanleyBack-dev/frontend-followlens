import { Activity, UserMinus, UserPlus, Users } from "lucide-react";
import { StatCard } from "@/design-system";
import type { FollowersOverview } from "@/shared/contracts/api";
import { formatNumber } from "@/shared/lib/format";

export function OverviewStats({ overview }: { overview: FollowersOverview }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Seguidores ativos"
        value={formatNumber(overview.activeFollowers)}
        hint="Na última lista completa"
        icon={<Users className="size-4.5" />}
        tone="accent"
      />
      <StatCard
        label="Perdidos em 7 dias"
        value={formatNumber(overview.lostLast7Days)}
        hint={`${formatNumber(overview.lostLast30Days)} em 30 dias`}
        icon={<UserMinus className="size-4.5" />}
        tone="danger"
      />
      <StatCard
        label="Novos em 30 dias"
        value={formatNumber(overview.gainedLast30Days)}
        hint="Inclui quem voltou a seguir"
        icon={<UserPlus className="size-4.5" />}
        tone="success"
      />
      <StatCard
        label="Saldo em 30 dias"
        value={`${overview.gainedLast30Days - overview.lostLast30Days >= 0 ? "+" : ""}${formatNumber(
          overview.gainedLast30Days - overview.lostLast30Days,
        )}`}
        hint={`${formatNumber(overview.lostFollowersTotal)} perdidos no total`}
        icon={<Activity className="size-4.5" />}
        tone="neutral"
      />
    </div>
  );
}
