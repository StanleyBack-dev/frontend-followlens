import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { History } from "lucide-react";
import { Card, EmptyState, Pagination } from "@/design-system";
import { SyncRunsTable } from "@/features/sync/components/SyncRunsTable";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";
import { syncService } from "@/server/services/sync.service";
import {
  buildHref,
  pageParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Sincronizações" };

const PATH = "/admin/sincronizacoes";

export default async function AdminSyncsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const page = pageParam(await searchParams);
  const runs = await authed(async (token) => {
    const user = await authService.me(token);
    if (!user.isAdmin) redirect("/dashboard");
    return syncService.runs(token, { page, limit: 20 });
  });

  return (
    <Card>
      {runs.items.length > 0 ? (
        <>
          <SyncRunsTable runs={runs.items} />
          <Pagination
            page={runs.page}
            totalPages={runs.totalPages}
            total={runs.total}
            hrefFor={(target) => buildHref(PATH, { page: target })}
          />
        </>
      ) : (
        <EmptyState
          icon={<History className="size-5" />}
          title="Nenhuma sincronização ainda"
          description="Execuções automáticas (sessão do Instagram), manuais e diárias aparecem aqui."
        />
      )}
    </Card>
  );
}
