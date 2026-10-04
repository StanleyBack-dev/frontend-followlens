"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Avatar, Badge, Select, Spinner } from "@/design-system";
import { adminClient } from "@/features/admin/api/admin.client";
import {
  PLAN_OPTIONS,
  ROLE_OPTIONS,
} from "@/features/admin/model/admin-labels";
import type {
  AdminUser,
  UpdateUserAccessInput,
  UserPlan,
  UserRole,
} from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatDate, formatRelative } from "@/shared/lib/format";

export function AdminUsersTable({
  users: initialUsers,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);

  async function update(user: AdminUser, input: UpdateUserAccessInput) {
    setSavingId(user.id);
    setError(null);
    setSavedName(null);
    try {
      const updated = await adminClient.updateAccess(user.id, input);
      setUsers((rows) =>
        rows.map((row) => (row.id === updated.id ? updated : row)),
      );
      setSavedName(updated.name);
      // Refresh the counters (admins) rendered by the server page.
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Não foi possível salvar a alteração.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <>
      {(error || savedName) && (
        <div className="px-5 pt-5">
          {error ? (
            <Alert tone="danger" title="Alteração não salva">
              {error}
            </Alert>
          ) : (
            <Alert tone="success">Acesso de {savedName} atualizado.</Alert>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium tracking-wide text-soft uppercase">
              <th className="px-5 py-3 font-medium">Usuário</th>
              <th className="px-5 py-3 font-medium">Grupo</th>
              <th className="px-5 py-3 font-medium">Plano</th>
              <th className="px-5 py-3 font-medium">Último acesso</th>
              <th className="px-5 py-3 font-medium">Cadastro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => {
              const saving = savingId === user.id;
              return (
                <tr key={user.id} className="align-middle">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={user.name}
                        src={user.pictureUrl}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-medium text-fg">
                          <span className="truncate">{user.name}</span>
                          {user.isMaster && <Badge tone="accent">Master</Badge>}
                          {user.id === currentUserId && (
                            <Badge tone="neutral">Você</Badge>
                          )}
                        </p>
                        <p className="truncate text-xs text-soft">
                          {user.email}
                        </p>
                        {!user.termsAccepted && (
                          <p className="mt-0.5 text-xs text-warning">
                            Termos pendentes
                          </p>
                        )}
                      </div>
                      {saving && (
                        <Spinner
                          size="sm"
                          label="Salvando"
                          className="ml-auto"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Select
                      label={`Grupo de ${user.name}`}
                      hideLabel
                      className="w-32"
                      options={ROLE_OPTIONS}
                      value={user.role}
                      disabled={saving || user.isMaster}
                      title={
                        user.isMaster
                          ? "O admin master não pode ser alterado."
                          : undefined
                      }
                      onChange={(event) =>
                        update(user, { role: event.target.value as UserRole })
                      }
                    />
                  </td>
                  <td className="px-5 py-3">
                    <Select
                      label={`Plano de ${user.name}`}
                      hideLabel
                      className="w-28"
                      options={PLAN_OPTIONS}
                      value={user.plan}
                      disabled={saving}
                      onChange={(event) =>
                        update(user, { plan: event.target.value as UserPlan })
                      }
                    />
                  </td>
                  {/* Relative time depends on the clock, so server and client may differ. */}
                  <td
                    className="px-5 py-3 whitespace-nowrap text-muted"
                    suppressHydrationWarning
                  >
                    {user.lastLoginAt ? formatRelative(user.lastLoginAt) : "—"}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-muted">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
