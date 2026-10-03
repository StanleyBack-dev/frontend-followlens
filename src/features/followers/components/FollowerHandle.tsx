import { Avatar } from "@/design-system";
import { instagramProfileUrl } from "@/shared/lib/format";

// The export gives only the @username, so we show the handle (with an initials
// avatar) linking to the live Instagram profile.
export function FollowerHandle({ username }: { username: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={username} />
      <a
        href={instagramProfileUrl(username)}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate font-medium text-fg hover:text-accent"
      >
        @{username}
      </a>
    </div>
  );
}
