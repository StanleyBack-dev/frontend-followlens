import type { Tone } from "@/design-system";
import type { FollowerEventType } from "@/shared/contracts/api";

export const EVENT_LABEL: Record<
  FollowerEventType,
  { label: string; tone: Tone }
> = {
  lost: { label: "Deixou de seguir", tone: "danger" },
  gained: { label: "Novo seguidor", tone: "success" },
  returned: { label: "Voltou a seguir", tone: "info" },
};

export const EVENT_TYPES = [
  "lost",
  "gained",
  "returned",
] as const satisfies readonly FollowerEventType[];
