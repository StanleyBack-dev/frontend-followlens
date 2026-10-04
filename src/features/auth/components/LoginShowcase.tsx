import {
  BellRing,
  FileArchive,
  History,
  KeyRound,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { Badge } from "@/design-system";

// What the product does, shown next to the sign-in card. Everything here is
// static: the preview is an illustration, not real data.

const PREVIEW_STATS = [
  { label: "Seguidores ativos", value: "1.284", icon: Users },
  { label: "Perdidos em 7 dias", value: "6", icon: UserMinus },
  { label: "Novos em 30 dias", value: "41", icon: UserPlus },
];

const PREVIEW_EVENTS = [
  { handle: "@perfil.exemplo", when: "há 2 dias" },
  { handle: "@outro_exemplo", when: "há 5 dias" },
  { handle: "@exemplo.123", when: "há 6 dias" },
];

const STEPS = [
  {
    title: "Exporte seus seguidores",
    body: "Peça ao Instagram o arquivo de “Seguidores e seguindo”, pela Central de Contas.",
  },
  {
    title: "Envie o arquivo aqui",
    body: "A primeira importação vira a sua lista base.",
  },
  {
    title: "Veja quem saiu",
    body: "A cada novo arquivo mostramos quem deixou de seguir, quem chegou e quem voltou.",
  },
];

const FEATURES = [
  {
    icon: KeyRound,
    title: "Sem a senha do Instagram",
    body: "Você usa a exportação oficial; o FollowLens nunca acessa a sua conta.",
  },
  {
    icon: History,
    title: "Histórico das mudanças",
    body: "Cada unfollow fica registrado com a data em que foi detectado.",
  },
  {
    icon: BellRing,
    title: "Alertas por e-mail",
    body: "No plano Pro, um aviso chega a cada importação com quem saiu.",
  },
];

export function LoginShowcase() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-10">
      <figure
        aria-label="Exemplo do painel do FollowLens"
        className="rounded-xl border border-border bg-surface p-5 shadow-card"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-fg">Visão geral</p>
          <Badge>Exemplo</Badge>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {PREVIEW_STATS.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-lg border border-border bg-surface-muted p-3"
            >
              <Icon className="size-4 text-accent" aria-hidden />
              <p className="mt-2 text-xl font-semibold text-fg tabular-nums">
                {value}
              </p>
              <p className="text-xs text-soft">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs font-medium tracking-wide text-soft uppercase">
          Unfollows recentes
        </p>
        <ul className="mt-2 divide-y divide-border">
          {PREVIEW_EVENTS.map((event) => (
            <li
              key={event.handle}
              className="flex items-center justify-between gap-3 py-2.5 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-danger-soft text-danger">
                  <UserMinus className="size-3.5" aria-hidden />
                </span>
                <span className="truncate font-medium text-fg">
                  {event.handle}
                </span>
              </span>
              <span className="shrink-0 text-xs text-soft">{event.when}</span>
            </li>
          ))}
        </ul>
      </figure>

      <section aria-labelledby="como-funciona">
        <h2
          id="como-funciona"
          className="flex items-center gap-2 text-sm font-semibold text-fg"
        >
          <FileArchive className="size-4 text-accent" aria-hidden />
          Como funciona
        </h2>
        <ol className="mt-4 space-y-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-fg">{step.title}</p>
                <p className="text-sm text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <ul className="grid gap-5 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <li key={title}>
            <Icon className="size-4 text-accent" aria-hidden />
            <p className="mt-2 text-sm font-medium text-fg">{title}</p>
            <p className="mt-0.5 text-sm text-muted">{body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
