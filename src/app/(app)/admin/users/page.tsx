import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Activity, Search, ShieldCheck, Users } from "lucide-react";
import {
  Button,
  Card,
  EmptyState,
  Field,
  PageHeader,
  Pagination,
  Select,
  StatCard,
} from "@/design-system";
import { AdminUsersTable } from "@/features/admin/components/AdminUsersTable";
import { ROLE_OPTIONS } from "@/features/admin/model/admin-labels";
import { adminService } from "@/server/services/admin.service";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";
import { formatNumber } from "@/shared/lib/format";
import {
  buildHref,
  firstParam,
  oneOf,
  pageParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Usuários" };

const PATH = "/admin/users";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const search = firstParam(params, "search")?.trim().slice(0, 160) || undefined;
  const role = oneOf(firstParam(params, "role"), ["user", "admin"] as const);
  const page = pageParam(params);

  // The backend's AdminGuard is the real gate; this redirect only spares a
  // non-admin from seeing a 403 page.
  const { me, overview, users } = await authed(async (token) => {
    const me = await authService.me(token);
    if (!me.isAdmin) redirect("/dashboard");
    const [overview, users] = await Promise.all([
      adminService.overview(token),
      adminService.users(token, { search, role, page, limit: 20 }),
    ]);
    return { me, overview, users };
  });

  return (
    <>
      <PageHeader
        title="Usuários"
        description="Contas cadastradas, grupos de acesso e planos."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Usuários"
          value={formatNumber(overview.total)}
          icon={<Users className="size-4" />}
          tone="accent"
        />
        <StatCard
          label="Ativos (30 dias)"
          value={formatNumber(overview.activeLast30Days)}
          hint="Fizeram login no último mês"
          icon={<Activity className="size-4" />}
          tone="success"
        />
        <StatCard
          label="Admins"
          value={formatNumber(overview.admins)}
          hint="Acesso à sincronização por sessão"
          icon={<ShieldCheck className="size-4" />}
          tone="info"
        />
      </div>

      <form
        action={PATH}
        className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <Field
          label="Buscar"
          name="search"
          type="search"
          placeholder="Nome ou e-mail"
          defaultValue={search}
          maxLength={160}
          className="flex-1"
        />
        <Select
          label="Grupo"
          name="role"
          options={ROLE_OPTIONS}
          placeholder="Todos"
          defaultValue={role ?? ""}
          className="sm:w-40"
        />
        <Button type="submit" icon={<Search className="size-4" />}>
          Filtrar
        </Button>
      </form>

      <Card>
        {users.items.length > 0 ? (
          <>
            <AdminUsersTable
              // Remount on a new result set so local edits never go stale.
              key={`${search ?? ""}|${role ?? ""}|${users.page}`}
              users={users.items}
              currentUserId={me.id}
            />
            <Pagination
              page={users.page}
              totalPages={users.totalPages}
              total={users.total}
              hrefFor={(target) => buildHref(PATH, { search, role, page: target })}
            />
          </>
        ) : (
          <EmptyState
            icon={<Users className="size-5" />}
            title="Nenhum usuário encontrado"
            description={
              search || role ? "Ajuste os filtros e tente novamente." : undefined
            }
          />
        )}
      </Card>
    </>
  );
}
