"use client";

import { usePathname } from "next/navigation";
import { SegmentedNav } from "@/design-system";

const TABS = [
  { href: "/admin/visao-geral", label: "Visão geral" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/assinaturas", label: "Assinaturas" },
  { href: "/admin/chamados", label: "Chamados" },
  { href: "/admin/sincronizacoes", label: "Sincronizações" },
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
