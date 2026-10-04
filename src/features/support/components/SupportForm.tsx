"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { Alert, Button, inputClasses, Select } from "@/design-system";
import { supportClient } from "@/features/support/api/support.client";
import {
  formatProtocol,
  SUPPORT_CATEGORY_OPTIONS,
  SUPPORT_MESSAGE_MAX,
} from "@/features/support/model/support-labels";
import type {
  SentSupportMessage,
  SupportCategory,
  SupportMessageStatus,
} from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatDateTime } from "@/shared/lib/format";

export function SupportForm({
  status,
  email,
}: {
  status: SupportMessageStatus;
  /** Where the reply will arrive. */
  email: string;
}) {
  const router = useRouter();
  const messageId = useId();
  const [category, setCategory] = useState<SupportCategory>("doubt");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<SentSupportMessage | null>(null);

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setBusy(true);
    setError(null);
    try {
      setSent(await supportClient.send({ category, message: message.trim() }));
      setMessage("");
      // Re-reads the daily limit, which this message has just used.
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Não foi possível enviar sua mensagem.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <Alert tone="success" title="Mensagem enviada">
        Seu chamado {formatProtocol(sent.protocolNumber)} foi aberto. Nossa
        equipe responde pelo e-mail {email}.
      </Alert>
    );
  }

  if (!status.canSend) {
    return (
      <Alert tone="info" title="Você já enviou uma mensagem hoje">
        É possível abrir um chamado por dia. O próximo fica disponível em{" "}
        {formatDateTime(status.nextAllowedAt)}. A resposta ao chamado de hoje
        chega pelo e-mail {email}.
      </Alert>
    );
  }

  return (
    <form onSubmit={send} className="space-y-4">
      <Select
        label="Categoria"
        name="category"
        className="sm:max-w-xs"
        options={SUPPORT_CATEGORY_OPTIONS}
        value={category}
        onChange={(event) => setCategory(event.target.value as SupportCategory)}
      />
      <div>
        <label
          htmlFor={messageId}
          className="mb-1.5 block text-sm font-medium text-fg"
        >
          Mensagem
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={6}
          maxLength={SUPPORT_MESSAGE_MAX}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Descreva sua dúvida, problema ou sugestão..."
          className={`${inputClasses} h-auto py-2`}
        />
        <p className="mt-1.5 text-right text-xs text-soft">
          {message.length} de {SUPPORT_MESSAGE_MAX}
        </p>
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
      <Button
        type="submit"
        loading={busy}
        disabled={!message.trim()}
        icon={<Send className="size-4" />}
      >
        Enviar mensagem
      </Button>
    </form>
  );
}
