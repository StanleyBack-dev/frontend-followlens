import type { Metadata } from "next";
import { Card, CardBody, CardHeader } from "@/design-system";
import { SupportForm } from "@/features/support/components/SupportForm";
import { authed } from "@/server/services/authed";
import { authService } from "@/server/services/auth.service";
import { supportService } from "@/server/services/support.service";

export const metadata: Metadata = { title: "Suporte" };

export default async function SupportPage() {
  const [me, status] = await authed((token) =>
    Promise.all([authService.me(token), supportService.status(token)]),
  );

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader
          title="Falar com o suporte"
          description="Você pode abrir um chamado por dia. A resposta chega no seu e-mail."
        />
        <CardBody>
          <SupportForm status={status} email={me.email} />
        </CardBody>
      </Card>
    </>
  );
}
