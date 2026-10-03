"use client";

import { useState } from "react";
import { cn } from "@/design-system/utils/cn";

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md";
  className?: string;
};

function initials(name: string): string {
  return name
    .replace(/^@/, "")
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

// Remote CDN avatars expire and block hotlinking often, so the image is
// best-effort with an initials fallback.
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const dimension = size === "sm" ? "size-8 text-xs" : "size-10 text-sm";

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external, short-lived CDN URLs
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn(
          "shrink-0 rounded-full bg-surface-muted object-cover",
          dimension,
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent",
        dimension,
        className,
      )}
    >
      {initials(name) || "?"}
    </span>
  );
}
