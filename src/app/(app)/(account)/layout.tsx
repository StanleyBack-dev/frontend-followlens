import { PageHeader } from "@/design-system";
import { AccountTabs } from "@/features/account/components/AccountTabs";

// One "Minha conta" area with tabs. The route group keeps the existing URLs
// (/conta/..., /suporte) while sharing this header.
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        title="Minha conta"
        description="Seu perfil, os perfis do Instagram, a assinatura e o suporte."
      />
      <div className="mb-6 overflow-x-auto">
        <AccountTabs />
      </div>
      {children}
    </>
  );
}
