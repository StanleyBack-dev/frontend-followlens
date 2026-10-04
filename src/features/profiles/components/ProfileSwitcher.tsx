"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/design-system";
import { profilesClient } from "@/features/profiles/api/profiles.client";
import type { ActiveProfiles } from "@/shared/contracts/api";

// Picks which Instagram profile the whole panel shows. Hidden while the
// account has a single usable profile, so it adds nothing to the Free plan.
export function ProfileSwitcher({ profiles }: { profiles: ActiveProfiles }) {
  const router = useRouter();
  const [switching, setSwitching] = useState(false);
  const usable = profiles.profiles.filter((profile) => !profile.locked);

  if (usable.length < 2) return null;

  async function select(id: string) {
    setSwitching(true);
    try {
      await profilesClient.select(id);
      // Every page reads its data for the selected profile.
      router.refresh();
    } catch {
      // Selection not saved: the list simply stays on the current profile.
    } finally {
      setSwitching(false);
    }
  }

  return (
    <Select
      className="mb-4"
      label="Perfil do Instagram"
      hideLabel
      disabled={switching}
      value={profiles.activeId}
      onChange={(event) => select(event.target.value)}
      options={usable.map((profile) => ({
        value: profile.id,
        label: profile.name,
      }))}
    />
  );
}
