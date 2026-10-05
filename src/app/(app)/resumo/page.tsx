import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  History,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import {
  buttonClasses,
  Card,
  CardBody,
  CardHeader,
  cn,
  EmptyState,
  PageHeader,
  StatCard,
} from "@/design-system";
import { SummaryShareCard } from "@/features/engagement/components/SummaryShareCard";
import {
  addMonths,
  monthLabel,
  signed,
} from "@/features/engagement/model/engagement-labels";
import { authed } from "@/server/services/authed";
import { engagementService } from "@/server/services/engagement.service";
import { formatNumber } from "@/shared/lib/format";
import {
  buildHref,
  firstParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Resumo mensal" };

const PATH = "/resumo";

export default async function MonthlySummaryPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const requested = firstParam(await searchParams, "mes");
  const summary = await authed((token) =>
    engagementService.summary(token, requested),
  );

  const label = monthLabel(summary.month);
  const hasPrevious =
    summary.firstMonth !== null && summary.month > summary.firstMonth;
  const newFollowers = summary.gained + summary.returned;
  const navClasses = cn(buttonClasses("secondary", "sm"), "px-2");

  return (
    <>
      <PageHeader
        title="Resumo mensal"
        description="O saldo do mês no perfil selecionado."
        actions={
          <>
            {hasPrevious ? (
              <Link
                href={buildHref(PATH, { mes: addMonths(summary.month, -1) })}
                aria-label="Mês anterior"
                className={navClasses}
              >
                <ChevronLeft className="size-4" aria-hidden />
              </Link>
            ) : (
              <span
                aria-hidden
                className={cn(navClasses, "cursor-not-allowed opacity-40")}
              >
                <ChevronLeft className="size-4" />
              </span>
            )}
            <span className="min-w-36 text-center text-sm font-medium text-fg capitalize">
              {label}
            </span>
            {summary.current ? (
              <span
                aria-hidden
                className={cn(navClasses, "cursor-not-allowed opacity-40")}
              >
                <ChevronRight className="size-4" />
              </span>
            ) : (
              <Link
                href={buildHref(PATH, { mes: addMonths(summary.month, 1) })}
                aria-label="Próximo mês"
                className={navClasses}
              >
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            )}
          </>
        }
      />

      {summary.imports === 0 ? (
        <Card>
          <EmptyState
            icon={<History className="size-5" />}
            title={`Nenhuma importação em ${label}`}
            description="O resumo é montado a partir das importações feitas no mês."
          />
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Saldo do mês"
              value={signed(summary.net)}
              hint={summary.current ? "Mês em andamento" : "Mês fechado"}
              icon={<TrendingUp className="size-4" />}
              tone={summary.net >= 0 ? "success" : "danger"}
            />
            <StatCard
              label="Novos seguidores"
              value={signed(newFollowers)}
              hint={`${formatNumber(summary.returned)} voltaram a seguir`}
              icon={<UserPlus className="size-4" />}
              tone="accent"
            />
            <StatCard
              label="Deixaram de seguir"
              value={formatNumber(summary.lost)}
              icon={<UserMinus className="size-4" />}
              tone="danger"
            />
            <StatCard
              label="Seguidores no fim do mês"
              value={formatNumber(summary.followersAtEnd)}
              hint={
                summary.followersAtStart !== null
                  ? `Começou com ${formatNumber(summary.followersAtStart)}`
                  : undefined
              }
              icon={<Users className="size-4" />}
              tone="info"
            />
          </div>

          <Card>
            <CardHeader
              title="Compartilhe o seu mês"
              description="Uma imagem pronta para o story, só com os números do mês."
            />
            <CardBody>
              <SummaryShareCard month={summary.month} label={label} />
            </CardBody>
          </Card>

          <p className="text-sm text-muted">
            {formatNumber(summary.imports)}{" "}
            {summary.imports === 1 ? "importação" : "importações"} em {label}.
            Os números contam as mudanças detectadas entre as importações do
            mês.
          </p>
        </div>
      )}
    </>
  );
}
