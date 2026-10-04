import type { Metadata } from "next";
import { Avatar, Badge, Card, CardBody, CardHeader } from "@/design-system";
import { AccountDeletionCard } from "@/features/account/components/AccountDeletionCard";
import { ProfileForm } from "@/features/account/components/ProfileForm";
import { PLAN_LABEL, ROLE_LABEL } from "@/features/admin/model/admin-labels";
import { accountService } from "@/server/services/account.service";
import { authed } from "@/server/services/authed";
import { formatDate, formatDateTime } from "@/shared/lib/format";

export const metadata: Metadata = { title: "Perfil" };

export default async function AccountPage() {
  const profile = await authed((token) => accountService.profile(token));

  const details = [
    { label: "Plano", value: PLAN_LABEL[profile.plan] },
    {
      label: "Grupo de acesso",
      value: profile.isMaster ? "Admin master" : ROLE_LABEL[profile.role],
    },
    { label: "Membro desde", value: formatDate(profile.createdAt) },
    { label: "Último acesso", value: formatDateTime(profile.lastLoginAt) },
  ];

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <Avatar name={profile.name} src={profile.pictureUrl} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-fg">{profile.name}</p>
                <p className="truncate text-sm text-muted">{profile.email}</p>
              </div>
              <Badge tone={profile.plan === "pro" ? "accent" : "neutral"}>
                {PLAN_LABEL[profile.plan]}
              </Badge>
            </div>
            <dl className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
              {details.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-medium tracking-wide text-soft uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm text-fg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Dados pessoais"
            description="Como seu nome aparece no painel e nos e-mails."
          />
          <CardBody>
            <ProfileForm profile={profile} />
          </CardBody>
        </Card>

        <AccountDeletionCard profile={profile} />
      </div>
    </>
  );
}
