"use client";

import { usePathname } from "next/navigation";
import { SegmentedNav } from "@/design-system";

const TABS = [
  { href: "/admin/users", label: "Usuários" },
  { href: "/admin/syncs", label: "Sincronizações" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <SegmentedNav
      label="Seções do admin"
      items={TABS.map((tab) => ({
        ...tab,
        active: pathname === tab.href || pathname.startsWith(`${tab.href}/`),
      }))}
    />
  );
}
