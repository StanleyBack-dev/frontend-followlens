import type { Metadata } from "next";
import {
  BadgeCheck,
  CalendarClock,
  Gift,
  MousePointerClick,
  UserPlus,
} from "lucide-react";
import {
  Alert,
  Badge,
  Card,
  CardHeader,
  EmptyState,
  StatCard,
} from "@/design-system";
import { ShareAppCard } from "@/features/share/components/ShareAppCard";
import { authed } from "@/server/services/authed";
import { referralsService } from "@/server/services/referrals.service";
import { formatDate, formatDateTime, formatNumber } from "@/shared/lib/format";
import { referralLink } from "@/shared/lib/referral";
import { SITE_NAME, SITE_TAGLINE, siteUrl } from "@/shared/lib/site";

export const metadata: Metadata = { title: "Indicações" };

function percent(part: number, whole: number): string {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : "—";
}

export default async function ReferralsPage() {
  const referrals = await authed((token) => referralsService.overview(token));
  const days =
    referrals.rewardDays === 1 ? "1 dia" : `${referrals.rewardDays} dias`;

  return (
    <div className="space-y-6">
      <Alert tone="info" title={`Indique e ganhe ${days} de Pro`}>
        Cada amigo que entrar pelo seu link e assinar o Pro rende {days} de Pro
        para você. Se você já é assinante, a sua próxima cobrança é adiada em{" "}
        {days}.
      </Alert>

      {referrals.proBonusUntil && (
        <Alert tone="success">
          Você está com o Pro por indicações até{" "}
          <strong>{formatDate(referrals.proBonusUntil)}</strong>.
        </Alert>
      )}

      <ShareAppCard
        title="Seu link de indicação"
        description="Compartilhe este link. Quem criar a conta por ele fica ligado à sua indicação."
        url={referralLink(siteUrl(), referrals.code)}
        message={`${SITE_TAGLINE} com o ${SITE_NAME}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Cliques no link"
          value={formatNumber(referrals.clicks)}
          hint={`${formatNumber(referrals.clicksLast7Days)} nos últimos 7 dias`}
          icon={<MousePointerClick className="size-4" />}
          tone="accent"
        />
        <StatCard
          label="Cadastros"
          value={formatNumber(referrals.invited)}
          hint={`${percent(referrals.invited, referrals.clicks)} dos cliques viraram conta`}
          icon={<UserPlus className="size-4" />}
          tone="info"
        />
        <StatCard
          label="Assinaram o Pro"
          value={formatNumber(referrals.qualified)}
          hint={`${percent(referrals.qualified, referrals.invited)} dos cadastros assinaram`}
          icon={<BadgeCheck className="size-4" />}
          tone="success"
        />
        <StatCard
          label="Dias de Pro ganhos"
          value={formatNumber(referrals.daysEarned)}
          hint={`${days} por indicação que assina`}
          icon={<Gift className="size-4" />}
          tone="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Amigos indicados"
            description="Quem criou a conta pelo seu link."
          />
          {referrals.friends.length > 0 ? (
            <ul className="mt-3 divide-y divide-border border-t border-border">
              {referrals.friends.map((friend, index) => (
                <li
                  key={`${friend.joinedAt}-${index}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-fg">
                      {friend.name}
                    </p>
                    <p className="text-xs text-soft">
                      Entrou em {formatDate(friend.joinedAt)}
                    </p>
                  </div>
                  <Badge tone={friend.qualified ? "success" : "neutral"} dot>
                    {friend.qualified ? "Assinou o Pro" : "No plano Free"}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<UserPlus className="size-5" />}
              title="Ninguém entrou pelo seu link ainda"
              description="Os amigos aparecem aqui assim que criarem a conta."
            />
          )}
        </Card>

        <Card>
          <CardHeader
            title="Últimos cliques"
            description="Quando o seu link foi aberto. Só a data e a hora são registradas."
          />
          {referrals.latestClicks.length > 0 ? (
            <ul className="mt-3 divide-y divide-border border-t border-border">
              {referrals.latestClicks.map((clickedAt, index) => (
                <li
                  key={`${clickedAt}-${index}`}
                  className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-fg"
                >
                  <CalendarClock className="size-4 text-soft" aria-hidden />
                  {formatDateTime(clickedAt)}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<MousePointerClick className="size-5" />}
              title="Nenhum clique ainda"
              description="Cada vez que alguém abrir o seu link, o horário aparece aqui."
            />
          )}
        </Card>
      </div>
    </div>
  );
}
