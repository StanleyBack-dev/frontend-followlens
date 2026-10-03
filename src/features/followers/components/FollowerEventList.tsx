import { MailCheck } from "lucide-react";
import { Badge } from "@/design-system";
import { FollowerHandle } from "@/features/followers/components/FollowerHandle";
import { EVENT_LABEL } from "@/features/followers/model/event-labels";
import type { FollowerEvent } from "@/shared/contracts/api";
import { formatDateTime } from "@/shared/lib/format";

export function FollowerEventList({
  events,
  showType = true,
}: {
  events: FollowerEvent[];
  showType?: boolean;
}) {
  return (
    <ul className="divide-y divide-border">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <FollowerHandle username={event.username} />
          <div className="flex shrink-0 items-center gap-3 pl-11 sm:pl-0">
            {showType && (
              <Badge tone={EVENT_LABEL[event.type].tone}>
                {EVENT_LABEL[event.type].label}
              </Badge>
            )}
            {event.type === "lost" && event.notifiedAt && (
              <MailCheck
                className="size-4 text-soft"
                aria-label="Alerta enviado por e-mail"
              />
            )}
            <time
              dateTime={event.occurredAt}
              className="text-sm tabular-nums text-muted"
            >
              {formatDateTime(event.occurredAt)}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
}
