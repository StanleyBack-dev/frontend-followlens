"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Field } from "@/design-system";
import { accountClient } from "@/features/account/api/account.client";
import type { AccountProfile } from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";

const NAME_MIN = 2;
const NAME_MAX = 160;

type Feedback = { tone: "success" | "danger"; message: string };

export function ProfileForm({ profile }: { profile: AccountProfile }) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [savedName, setSavedName] = useState(profile.name);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const trimmed = name.trim();
  const tooShort = trimmed.length < NAME_MIN;
  const unchanged = trimmed === savedName;

  async function save(event: FormEvent) {
    event.preventDefault();
    if (tooShort || unchanged) return;
    setBusy(true);
    setFeedback(null);
    try {
      const updated = await accountClient.update({ name: trimmed });
      setName(updated.name);
      setSavedName(updated.name);
      setFeedback({ tone: "success", message: "Nome atualizado." });
      // The sidebar shows the name too.
      router.refresh();
    } catch (err) {
      setFeedback({
        tone: "danger",
        message:
          err instanceof ApiClientError
            ? err.message
            : "Não foi possível salvar.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nome"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={NAME_MAX}
          autoComplete="name"
          error={
            tooShort ? `Informe ao menos ${NAME_MIN} caracteres.` : undefined
          }
        />
        <div>
          <Field
            label="E-mail"
            name="email"
            value={profile.email}
            disabled
            readOnly
          />
          <p className="mt-1.5 text-xs text-soft">
            Vem da sua conta Google e não pode ser alterado aqui.
          </p>
        </div>
      </div>
      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}
      <Button type="submit" loading={busy} disabled={tooShort || unchanged}>
        Salvar alterações
      </Button>
    </form>
  );
}
