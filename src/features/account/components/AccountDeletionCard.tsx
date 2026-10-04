"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, Undo2 } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Modal,
} from "@/design-system";
import { accountClient } from "@/features/account/api/account.client";
import type { AccountProfile } from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatDate } from "@/shared/lib/format";

type Feedback = { tone: "success" | "warning" | "danger"; message: string };

function daysLabel(days: number): string {
  return days === 1 ? "1 dia" : `${days} dias`;
}

export function AccountDeletionCard({ profile }: { profile: AccountProfile }) {
  const router = useRouter();
  const [deletion, setDeletion] = useState(profile.deletion);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const grace = daysLabel(profile.deletionGraceDays);
  const emailMatches =
    confirmEmail.trim().toLowerCase() === profile.email.toLowerCase();

  function openModal() {
    setConfirmEmail("");
    setModalError(null);
    setModalOpen(true);
  }

  async function confirmDeletion() {
    if (!emailMatches) return;
    setBusy(true);
    setModalError(null);
    try {
      const result = await accountClient.requestDeletion(confirmEmail.trim());
      setDeletion(result.profile.deletion);
      setModalOpen(false);
      setFeedback(
        result.emailSent
          ? {
              tone: "success",
              message: `Exclusão agendada. Enviamos um aviso para ${profile.email}.`,
            }
          : {
              tone: "warning",
              message:
                "Exclusão agendada, mas não foi possível enviar o e-mail de aviso.",
            },
      );
      // The shell shows a notice while the deletion is pending.
      router.refresh();
    } catch (err) {
      setModalError(
        err instanceof ApiClientError
          ? err.message
          : "Não foi possível agendar a exclusão.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function cancelDeletion() {
    setBusy(true);
    setFeedback(null);
    try {
      const updated = await accountClient.cancelDeletion();
      setDeletion(updated.deletion);
      setFeedback({
        tone: "success",
        message: "Exclusão cancelada. Sua conta continua ativa.",
      });
      router.refresh();
    } catch (err) {
      setFeedback({
        tone: "danger",
        message:
          err instanceof ApiClientError
            ? err.message
            : "Não foi possível cancelar a exclusão.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-danger/40">
      <CardHeader
        title="Excluir conta"
        description={`Remove a conta e todos os seus dados após ${grace}.`}
      />
      <CardBody className="space-y-4">
        {deletion ? (
          <>
            <Alert tone="warning" title="Exclusão agendada">
              Sua conta e todos os dados serão excluídos em{" "}
              <strong>{formatDate(deletion.scheduledFor)}</strong>. Até lá você
              pode cancelar.
            </Alert>
            <Button
              variant="secondary"
              onClick={cancelDeletion}
              loading={busy}
              icon={<Undo2 className="size-4" />}
            >
              Cancelar exclusão
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted">
              Ao excluir, apagamos sua lista de seguidores, o histórico de
              unfollows e todas as importações. Você recebe um e-mail de aviso e
              tem {grace} para cancelar antes da remoção definitiva.
            </p>
            <Button
              variant="danger"
              onClick={openModal}
              icon={<Trash2 className="size-4" />}
            >
              Excluir conta
            </Button>
          </>
        )}
        {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}
      </CardBody>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Excluir sua conta?"
        tone="danger"
        icon={<AlertTriangle className="size-5" />}
        busy={busy}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              disabled={busy}
            >
              Voltar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeletion}
              loading={busy}
              disabled={!emailMatches}
            >
              Excluir conta
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p>
            Sua conta será excluída em <strong>{grace}</strong>, junto com a
            lista de seguidores, o histórico de unfollows e as importações.
            Depois disso não há como recuperar.
          </p>
          <p>
            Vamos enviar um e-mail de aviso para{" "}
            <strong className="text-fg">{profile.email}</strong>. Até a data da
            exclusão você pode cancelar por aqui.
          </p>
          <Field
            label="Digite seu e-mail para confirmar"
            name="confirmEmail"
            type="email"
            value={confirmEmail}
            onChange={(event) => setConfirmEmail(event.target.value)}
            placeholder={profile.email}
            autoComplete="off"
            maxLength={160}
          />
          {modalError && <Alert tone="danger">{modalError}</Alert>}
        </div>
      </Modal>
    </Card>
  );
}
