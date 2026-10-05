import type { Metadata } from "next";
import { CheckCircle2, Flame, Lock } from "lucide-react";
import { Card, CardBody, CardHeader, cn, PageHeader } from "@/design-system";
import {
  ACHIEVEMENT_LABEL,
  weeks,
} from "@/features/engagement/model/engagement-labels";
import { authed } from "@/server/services/authed";
import { engagementService } from "@/server/services/engagement.service";
import { formatDate, formatNumber } from "@/shared/lib/format";

export const metadata: Metadata = { title: "Conquistas" };

export default async function AchievementsPage() {
  const { streak, achievements } = await authed((token) =>
    engagementService.achievements(token),
  );
  const unlocked = achievements.filter((item) => item.unlocked).length;

  return (
    <>
      <PageHeader
        title="Conquistas"
        description="Sua sequência de importações e os marcos do perfil selecionado."
      />

      <div className="space-y-6">
        <Card>
          <CardBody className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span
              className={cn(
                "grid size-14 shrink-0 place-items-center rounded-full",
                streak.current > 0
                  ? "bg-warning-soft text-warning"
                  : "bg-surface-muted text-soft",
              )}
            >
              <Flame className="size-7" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted">Sequência atual</p>
              <p className="text-2xl font-semibold text-fg">
                {streak.current > 0 ? weeks(streak.current) : "Sem sequência"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {streak.current === 0
                  ? "Importe pelo menos uma vez por semana para começar uma sequência."
                  : streak.activeThisWeek
                    ? "Você já importou nesta semana. Volte na próxima para manter."
                    : "Importe ainda nesta semana para não perder a sequência."}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-muted">Melhor sequência</p>
              <p className="text-lg font-semibold text-fg">
                {weeks(streak.best)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Marcos"
            description={`${unlocked} de ${achievements.length} conquistados.`}
          />
          <CardBody>
            <ul className="grid gap-3 sm:grid-cols-2">
              {achievements.map((achievement) => {
                const {
                  title,
                  description,
                  icon: Icon,
                } = ACHIEVEMENT_LABEL[achievement.key];
                const progress = Math.round(
                  (achievement.current / achievement.target) * 100,
                );
                return (
                  <li
                    key={achievement.key}
                    className={cn(
                      "flex gap-3 rounded-md border p-4",
                      achievement.unlocked
                        ? "border-accent/30 bg-accent-soft"
                        : "border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-full",
                        achievement.unlocked
                          ? "bg-accent text-accent-fg"
                          : "bg-surface-muted text-soft",
                      )}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-fg">
                        {title}
                        {achievement.unlocked ? (
                          <CheckCircle2
                            className="size-4 text-success"
                            aria-label="Conquistado"
                          />
                        ) : (
                          <Lock
                            className="size-3.5 text-soft"
                            aria-label="Bloqueado"
                          />
                        )}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">{description}</p>
                      {achievement.unlocked ? (
                        achievement.unlockedAt && (
                          <p className="mt-2 text-xs text-soft">
                            Em {formatDate(achievement.unlockedAt)}
                          </p>
                        )
                      ) : (
                        <div className="mt-3">
                          <div
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={achievement.target}
                            aria-valuenow={achievement.current}
                            aria-label={`Progresso de ${title}`}
                            className="h-1.5 overflow-hidden rounded-full bg-surface-sunken"
                          >
                            <div
                              className="h-full rounded-full bg-accent"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-soft">
                            {formatNumber(achievement.current)} de{" "}
                            {formatNumber(achievement.target)}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
