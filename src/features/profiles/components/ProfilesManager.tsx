"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Field,
  Modal,
} from "@/design-system";
import { ProUpsell } from "@/features/billing/components/ProUpsell";
import { profilesClient } from "@/features/profiles/api/profiles.client";
import type { ActiveProfiles, InstagramProfile } from "@/shared/contracts/api";
import { ApiClientError } from "@/shared/lib/api-client";
import { formatDate } from "@/shared/lib/format";

const NAME_MAX = 40;

function messageOf(error: unknown, fallback: string): string {
  return error instanceof ApiClientError ? error.message : fallback;
}

export function ProfilesManager({
  profiles,
  isPro,
}: {
  profiles: ActiveProfiles;
  isPro: boolean;
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<InstagramProfile | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleting, setDeleting] = useState<InstagramProfile | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const { limit } = profiles;
  const atLimit = profiles.profiles.length >= limit;

  // The server list is the source of truth; the layout re-reads it too.
  async function run(action: () => Promise<unknown>, fallback: string) {
    setBusy(true);
    try {
      await action();
      router.refresh();
      return true;
    } catch (err) {
      const message = messageOf(err, fallback);
      if (renaming || deleting) setModalError(message);
      else setError(message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function create(event: FormEvent) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setError(null);
    if (
      await run(
        () => profilesClient.create(name),
        "Não foi possível criar o perfil.",
      )
    ) {
      setNewName("");
    }
  }

  async function rename() {
    const name = renameValue.trim();
    if (!renaming || !name) return;
    setModalError(null);
    if (
      await run(
        () => profilesClient.rename(renaming.id, name),
        "Não foi possível renomear o perfil.",
      )
    ) {
      setRenaming(null);
    }
  }

  async function remove() {
    if (!deleting) return;
    setModalError(null);
    if (
      await run(
        () => profilesClient.remove(deleting.id),
        "Não foi possível excluir o perfil.",
      )
    ) {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Seus perfis"
          description="Cada perfil tem a sua própria lista de seguidores, histórico e importações."
          action={
            <Badge tone={atLimit ? "warning" : "neutral"}>
              {profiles.profiles.length} de {limit}
            </Badge>
          }
        />
        <ul className="mt-3 divide-y divide-border border-t border-border">
          {profiles.profiles.map((profile) => (
            <li
              key={profile.id}
              className="flex flex-wrap items-center gap-3 px-5 py-3.5"
            >
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-fg">
                  <span className="truncate">{profile.name}</span>
                  {profile.isDefault && <Badge>Principal</Badge>}
                  {profile.id === profiles.activeId && (
                    <Badge tone="accent">Em uso</Badge>
                  )}
                  {profile.locked && (
                    <Badge tone="warning">
                      <Lock className="size-3" aria-hidden />
                      Bloqueado no Free
                    </Badge>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-soft">
                  Criado em {formatDate(profile.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setModalError(null);
                    setRenameValue(profile.name);
                    setRenaming(profile);
                  }}
                  icon={<Pencil className="size-4" />}
                >
                  Renomear
                </Button>
                {!profile.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setModalError(null);
                      setDeleting(profile);
                    }}
                    icon={<Trash2 className="size-4" />}
                  >
                    Excluir
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {atLimit && !isPro ? (
        <ProUpsell title="Acompanhe mais de um perfil">
          O plano Free permite {limit} perfil. No Pro você acompanha vários na
          mesma conta, cada um com o seu histórico.
        </ProUpsell>
      ) : (
        <Card>
          <CardHeader
            title="Adicionar perfil"
            description="Use um nome que identifique o perfil, como o @ do Instagram. Cabe a você importar em cada perfil o arquivo da conta certa."
          />
          <CardBody>
            {atLimit ? (
              <Alert tone="info">
                Você já tem os {limit} perfis que o seu plano permite. Exclua um
                para adicionar outro.
              </Alert>
            ) : (
              <form
                onSubmit={create}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
              >
                <Field
                  label="Nome do perfil"
                  name="name"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="@meuperfil"
                  maxLength={NAME_MAX}
                  autoComplete="off"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  loading={busy}
                  disabled={!newName.trim()}
                  icon={<Plus className="size-4" />}
                >
                  Adicionar
                </Button>
              </form>
            )}
            {error && (
              <Alert tone="danger" className="mt-4">
                {error}
              </Alert>
            )}
          </CardBody>
        </Card>
      )}

      <Modal
        open={renaming !== null}
        onClose={() => setRenaming(null)}
        title="Renomear perfil"
        icon={<Pencil className="size-5" />}
        busy={busy}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setRenaming(null)}
              disabled={busy}
            >
              Cancelar
            </Button>
            <Button
              onClick={rename}
              loading={busy}
              disabled={!renameValue.trim()}
            >
              Salvar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Nome do perfil"
            name="rename"
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            maxLength={NAME_MAX}
            autoComplete="off"
          />
          {modalError && <Alert tone="danger">{modalError}</Alert>}
        </div>
      </Modal>

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Excluir este perfil?"
        tone="danger"
        icon={<Trash2 className="size-5" />}
        busy={busy}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleting(null)}
              disabled={busy}
            >
              Voltar
            </Button>
            <Button variant="danger" onClick={remove} loading={busy}>
              Excluir perfil
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p>
            O perfil <strong className="text-fg">{deleting?.name}</strong> será
            excluído agora, junto com a lista de seguidores, o histórico de
            unfollows e as importações dele. Não há como recuperar.
          </p>
          {modalError && <Alert tone="danger">{modalError}</Alert>}
        </div>
      </Modal>
    </div>
  );
}
