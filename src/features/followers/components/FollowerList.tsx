import { Badge } from "@/design-system";
import { FollowerHandle } from "@/features/followers/components/FollowerHandle";
import type { Follower } from "@/shared/contracts/api";
import { formatDate } from "@/shared/lib/format";

export function FollowerList({ followers }: { followers: Follower[] }) {
  return (
    <ul className="divide-y divide-border">
      {followers.map((follower) => (
        <li
          key={follower.username}
          className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <FollowerHandle username={follower.username} />
          <div className="flex shrink-0 items-center gap-3 pl-11 text-sm text-muted sm:pl-0">
            {follower.status === "lost" ? (
              <>
                <Badge tone="danger">Deixou de seguir</Badge>
                <span className="tabular-nums">
                  {formatDate(follower.lostAt)}
                </span>
              </>
            ) : (
              <span className="tabular-nums">
                Desde {formatDate(follower.firstSeenAt)}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
