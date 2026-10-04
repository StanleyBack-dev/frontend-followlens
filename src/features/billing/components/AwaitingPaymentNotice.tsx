"use client";

import { useRouter } from "next/navigation";
import { Alert } from "@/design-system";
import { useSubscriptionActivation } from "@/features/billing/hooks/useSubscriptionActivation";

// The gateway confirms a payment asynchronously, so while a checkout is open
// the page keeps asking and refreshes itself once the Pro is granted.
export function AwaitingPaymentNotice({
  returnedFromCheckout,
}: {
  /** The customer has just come back from the hosted invoice. */
  returnedFromCheckout: boolean;
}) {
  const router = useRouter();
  useSubscriptionActivation(true, () => router.refresh());

  return returnedFromCheckout ? (
    <Alert tone="info" title="Pagamento em processamento">
      Assim que a Asaas confirmar o pagamento, o Pro é liberado e esta página se
      atualiza sozinha. Cartão e Pix costumam levar poucos segundos; boleto pode
      levar até 3 dias úteis.
    </Alert>
  ) : (
    <Alert tone="info" title="Há uma assinatura aguardando pagamento">
      O Pro é liberado assim que o pagamento for confirmado. Se você não chegou
      a pagar, pode iniciar a assinatura de novo abaixo — a cobrança anterior é
      descartada.
    </Alert>
  );
}
