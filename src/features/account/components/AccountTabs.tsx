"use client";

import { usePathname } from "next/navigation";
import { SegmentedNav } from "@/design-system";

const TABS = [
  { href: "/conta", label: "Perfil", exact: true },
  { href: "/conta/perfis", label: "Perfis do Instagram" },
  { href: "/conta/assinatura", label: "Assinatura" },
  { href: "/suporte", label: "Suporte" },
];

export function AccountTabs() {
  const pathname = usePathname();
  return (
    <SegmentedNav
      label="Seções da conta"
      items={TABS.map(({ href, label, exact }) => ({
        href,
        label,
        active:
          pathname === href || (!exact && pathname.startsWith(`${href}/`)),
      }))}
    />
  );
}
