"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, ExternalLink, QrCode } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  buttonClasses,
  Card,
  CardBody,
  CardHeader,
  cn,
  Field,
  Modal,
  Spinner,
} from "@/design-system";
import { billingClient } from "@/features/billing/api/billing.client";
import { useSubscriptionActivation } from "@/features/billing/hooks/useSubscriptionActivation";
import {
  CYCLE_LABEL,
  METHOD_LABEL,
} from "@/features/billing/model/billing-labels";
import type {
  BillingCycle,
  PaymentMethod,
  SubscriptionSummary,
} from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatCurrency } from "@/shared/lib/format";

const CYCLES: BillingCycle[] = ["monthly", "yearly"];
const METHODS: { value: PaymentMethod; hint: string }[] = [
  {
    value: "checkout",
    hint: "Você escolhe a forma de pagamento na página segura da Asaas.",
  },
  {
    value: "pix_automatic",
    hint: "Autorize uma vez pelo QR Code e o Pix é debitado a cada renovação.",
  },
];

type PixQrCode = { payload: string | null; image: string | null };

function optionClasses(selected: boolean) {
  return cn(
    "flex w-full flex-col rounded-md border p-4 text-left transition-colors",
    selected
      ? "border-accent bg-accent-soft"
      : "border-border hover:bg-surface-muted",
  );
}

export function CheckoutCard({
  prices,
  pixAutomaticEnabled,
}: {
  prices: SubscriptionSummary["prices"];
  pixAutomaticEnabled: boolean;
}) {
  const router = useRouter();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [method, setMethod] = useState<PaymentMethod>("checkout");
  const [taxId, setTaxId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pix, setPix] = useState<PixQrCode | null>(null);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const digits = taxId.replace(/\D/g, "");
  const taxIdValid = digits.length === 11 || digits.length === 14;
  const yearlySaving = Math.round(
    (1 - prices.yearly / (prices.monthly * 12)) * 100,
  );

  useSubscriptionActivation(pix !== null || invoiceUrl !== null, () => {
    setPix(null);
    setInvoiceUrl(null);
    router.refresh();
  });

  async function subscribe(event: FormEvent) {
    event.preventDefault();
    if (!taxIdValid) return;
    setBusy(true);
    setError(null);
    try {
      const result = await billingClient.subscribe({
        cpfCnpj: digits,
        billingCycle: cycle,
        paymentMethod: method,
      });
      if (result.checkoutUrl) {
        // Hosted invoice: the gateway collects the payment on its own page,
        // opened in another tab while this one waits for the confirmation.
        setInvoiceUrl(result.checkoutUrl);
      } else if (result.pixQrCode?.payload || result.pixQrCode?.image) {
        setPix(result.pixQrCode);
      } else {
        setError("Não foi possível gerar a cobrança. Tente novamente.");
      }
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Não foi possível iniciar a assinatura.",
      );
    }
    setBusy(false);
  }

  async function copyPayload() {
    if (!pix?.payload) return;
    try {
      await navigator.clipboard.writeText(pix.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the code stays selectable on screen.
    }
  }

  if (invoiceUrl) {
    return (
      <Card>
        <CardHeader
          title="Falta só o pagamento"
          description={`Assinatura ${CYCLE_LABEL[cycle].toLowerCase()} de ${formatCurrency(prices[cycle])} criada.`}
        />
        <CardBody className="space-y-4">
          <p className="text-sm text-muted">
            O pagamento é feito na página segura da Asaas, com cartão, boleto ou
            Pix. Ela abre em outra aba; esta página libera o Pro sozinha assim
            que o pagamento for confirmado.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "lg")}
            >
              Ir para o pagamento
              <ExternalLink className="size-4" aria-hidden />
            </a>
            <Button variant="ghost" onClick={() => setInvoiceUrl(null)}>
              Escolher outro plano
            </Button>
          </div>
          <p className="flex items-center gap-2 text-xs text-soft">
            <Spinner size="sm" />
            Aguardando a confirmação do pagamento…
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Assinar o Pro"
        description="Cancele quando quiser; o acesso vale até o fim do período pago."
      />
      <CardBody>
        <form onSubmit={subscribe} className="space-y-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-fg">Plano</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {CYCLES.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={cycle === option}
                  onClick={() => setCycle(option)}
                  className={optionClasses(cycle === option)}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-fg">
                    {CYCLE_LABEL[option]}
                    {option === "yearly" && yearlySaving > 0 && (
                      <Badge tone="success">{yearlySaving}% de desconto</Badge>
                    )}
                  </span>
                  <span className="mt-1 text-xl font-semibold text-fg">
                    {formatCurrency(prices[option])}
                    <span className="text-sm font-normal text-muted">
                      {option === "yearly" ? " por ano" : " por mês"}
                    </span>
                  </span>
                  {option === "yearly" && (
                    <span className="mt-0.5 text-xs text-soft">
                      Equivale a {formatCurrency(prices.yearly / 12)} por mês
                    </span>
                  )}
                </button>
              ))}
            </div>
          </fieldset>

          {/* With a single method there is nothing to choose. */}
          <fieldset hidden={!pixAutomaticEnabled}>
            <legend className="mb-2 text-sm font-medium text-fg">
              Forma de pagamento
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {METHODS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={method === option.value}
                  onClick={() => setMethod(option.value)}
                  className={optionClasses(method === option.value)}
                >
                  <span className="text-sm font-semibold text-fg">
                    {METHOD_LABEL[option.value]}
                  </span>
                  <span className="mt-1 text-xs text-muted">{option.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="sm:max-w-xs">
            <Field
              label="CPF ou CNPJ do pagador"
              name="cpfCnpj"
              inputMode="numeric"
              autoComplete="off"
              value={taxId}
              onChange={(event) => setTaxId(event.target.value)}
              placeholder="000.000.000-00"
              maxLength={18}
              error={
                taxId && !taxIdValid
                  ? "Informe os 11 dígitos do CPF ou os 14 do CNPJ."
                  : undefined
              }
            />
            <p className="mt-1.5 text-xs text-soft">
              Exigido pela Asaas para emitir a cobrança. Não fica guardado no
              FollowLens.
            </p>
          </div>

          {error && <Alert tone="danger">{error}</Alert>}

          <Button type="submit" size="lg" loading={busy} disabled={!taxIdValid}>
            Assinar por {formatCurrency(prices[cycle])}
            {cycle === "yearly" ? " por ano" : " por mês"}
          </Button>
        </form>
      </CardBody>

      <Modal
        open={pix !== null}
        onClose={() => setPix(null)}
        title="Autorize o Pix Automático"
        icon={<QrCode className="size-5" />}
        footer={
          <Button variant="secondary" onClick={() => setPix(null)}>
            Fechar
          </Button>
        }
      >
        <div className="space-y-4">
          <p>
            Leia o QR Code no aplicativo do seu banco. O pagamento confirma a
            assinatura e autoriza as próximas renovações.
          </p>
          {pix?.image && (
            // eslint-disable-next-line @next/next/no-img-element -- inline base64 from the gateway
            <img
              src={`data:image/png;base64,${pix.image}`}
              alt="QR Code do Pix"
              className="mx-auto size-56 rounded-md bg-white p-2"
            />
          )}
          {pix?.payload && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-fg">
                Ou use o Pix copia e cola
              </p>
              <div className="flex gap-2">
                <code className="min-w-0 flex-1 truncate rounded-md border border-border bg-surface-muted px-3 py-2 text-xs text-fg">
                  {pix.payload}
                </code>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-auto"
                  onClick={copyPayload}
                  icon={
                    copied ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )
                  }
                >
                  {copied ? "Copiado" : "Copiar"}
                </Button>
              </div>
            </div>
          )}
          <p className="flex items-center gap-2 text-xs text-soft">
            <Spinner size="sm" />
            Aguardando a confirmação do pagamento…
          </p>
        </div>
      </Modal>
    </Card>
  );
}
