"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Send } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  inputClasses,
  Modal,
} from "@/design-system";
import { supportClient } from "@/features/support/api/support.client";
import {
  formatProtocol,
  SUPPORT_MESSAGE_MAX,
} from "@/features/support/model/support-labels";
import type { SupportTicket } from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";

const DEFAULT_REPLY =
  "Olá! Obrigado por entrar em contato com o suporte do FollowLens. " +
  "Analisamos sua solicitação e, a partir de agora, ela está sendo tratada pela nossa equipe. " +
  "Assim que tivermos uma atualização, avisaremos você por aqui.";

type Feedback = { tone: "success" | "danger"; message: string };

// Reply and finalize, for the support team.
export function SupportTicketActions({ ticket }: { ticket: SupportTicket }) {
  const router = useRouter();
  const replyId = useId();
  const [reply, setReply] = useState("");
  const [useDefault, setUseDefault] = useState(false);
  const [replying, setReplying] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  if (ticket.status === "resolved") {
    return (
      <Alert tone="success" title="Chamado finalizado">
        Este chamado foi encerrado e não aceita novas respostas.
      </Alert>
    );
  }

  const busy = replying || finalizing;
  const canFinalize = ticket.status === "answered";

  async function sendReply(event: FormEvent) {
    event.preventDefault();
    if (!reply.trim()) return;
    setReplying(true);
    setFeedback(null);
    try {
      await supportClient.reply(ticket.id, reply.trim());
      // The page re-renders with the saved reply and remounts this form.
      router.refresh();
    } catch (err) {
      setFeedback({
        tone: "danger",
        message:
          err instanceof ApiClientError
            ? err.message
            : "Não foi possível enviar a resposta.",
      });
      setReplying(false);
    }
  }

  async function finalize() {
    setFinalizing(true);
    setFeedback(null);
    try {
      await supportClient.finalize(ticket.id);
      setConfirmOpen(false);
      router.refresh();
    } catch (err) {
      setConfirmOpen(false);
      setFeedback({
        tone: "danger",
        message:
          err instanceof ApiClientError
            ? err.message
            : "Não foi possível finalizar o chamado.",
      });
      setFinalizing(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title="Responder chamado"
        description={
          ticket.adminReply
            ? "Uma nova resposta substitui a anterior e é enviada ao usuário por e-mail."
            : "A resposta é enviada ao usuário por e-mail."
        }
      />
      <CardBody>
        <form onSubmit={sendReply} className="space-y-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg">
            <input
              type="checkbox"
              className="size-4 accent-[var(--accent)]"
              checked={useDefault}
              onChange={(event) => {
                setUseDefault(event.target.checked);
                setReply(event.target.checked ? DEFAULT_REPLY : "");
              }}
            />
            Usar mensagem padrão de resposta
          </label>
          <div>
            <label
              htmlFor={replyId}
              className="mb-1.5 block text-sm font-medium text-fg"
            >
              Sua resposta
            </label>
            <textarea
              id={replyId}
              rows={6}
              maxLength={SUPPORT_MESSAGE_MAX}
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Escreva a resposta para o usuário..."
              className={`${inputClasses} h-auto py-2`}
            />
          </div>
          {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}
          <div className="flex flex-wrap justify-end gap-2">
            {canFinalize && (
              <Button
                variant="secondary"
                onClick={() => setConfirmOpen(true)}
                disabled={busy}
                icon={<CheckCircle2 className="size-4" />}
              >
                Finalizar chamado
              </Button>
            )}
            <Button
              type="submit"
              loading={replying}
              disabled={busy || !reply.trim()}
              icon={<Send className="size-4" />}
            >
              Enviar resposta
            </Button>
          </div>
        </form>
      </CardBody>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Finalizar chamado"
        icon={<CheckCircle2 className="size-5" />}
        busy={finalizing}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={finalizing}
            >
              Cancelar
            </Button>
            <Button onClick={finalize} loading={finalizing}>
              Finalizar
            </Button>
          </>
        }
      >
        O chamado {formatProtocol(ticket.protocolNumber)} será encerrado e{" "}
        {ticket.userName} será avisado por e-mail. Depois disso ele não aceita
        novas respostas.
      </Modal>
    </Card>
  );
}
