import type { Metadata } from "next";
import { History } from "lucide-react";
import { Card, EmptyState, PageHeader, Pagination } from "@/design-system";
import { ImportHistoryTable } from "@/features/imports/components/ImportHistoryTable";
import { authed } from "@/server/services/authed";
import { importsService } from "@/server/services/imports.service";
import {
  buildHref,
  pageParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Importações" };

export default async function ImportsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const page = pageParam(await searchParams);
  const imports = await authed((token) =>
    importsService.list(token, { page, limit: 20 }),
  );

  return (
    <>
      <PageHeader
        title="Importações"
        description="Histórico dos arquivos de seguidores que você enviou."
      />
      <Card>
        {imports.items.length > 0 ? (
          <>
            <ImportHistoryTable imports={imports.items} />
            <Pagination
              page={imports.page}
              totalPages={imports.totalPages}
              total={imports.total}
              hrefFor={(target) => buildHref("/importacoes", { page: target })}
            />
          </>
        ) : (
          <EmptyState
            icon={<History className="size-5" />}
            title="Nenhuma importação ainda"
            description="Envie o arquivo de seguidores na Visão geral para começar."
          />
        )}
      </Card>
    </>
  );
}
