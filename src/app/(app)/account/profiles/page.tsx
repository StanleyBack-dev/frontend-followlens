import type { Metadata } from "next";
import { PageHeader } from "@/design-system";
import { ProfilesManager } from "@/features/profiles/components/ProfilesManager";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";
import { profilesService } from "@/server/services/profiles.service";

export const metadata: Metadata = { title: "Perfis do Instagram" };

export default async function ProfilesPage() {
  const [me, profiles] = await authed((token) =>
    Promise.all([authService.me(token), profilesService.list(token)]),
  );

  return (
    <>
      <PageHeader
        title="Perfis do Instagram"
        description="Os perfis que você acompanha nesta conta. O perfil em uso é escolhido no menu lateral."
      />
      <ProfilesManager profiles={profiles} isPro={me.isPro} />
    </>
  );
}
