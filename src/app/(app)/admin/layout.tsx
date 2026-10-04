import { redirect } from "next/navigation";
import { PageHeader } from "@/design-system";
import { AdminTabs } from "@/features/admin/components/AdminTabs";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";

// Everything under /admin is admin-only. The backend guards are the real
// gate; this redirect only spares a non-admin from seeing a 403 page. Each
// page repeats the check, since a layout doesn't re-run on tab navigation.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await authed((token) => authService.me(token));
  if (!me.isAdmin) redirect("/dashboard");

  return (
    <>
      <PageHeader
        title="Admin"
        description="Usuários, assinaturas, chamados de suporte e sincronizações."
      />
      <div className="mb-6 overflow-x-auto">
        <AdminTabs />
      </div>
      {children}
    </>
  );
}
