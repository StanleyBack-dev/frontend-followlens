"use client";

import { useState, type ReactNode } from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  ShieldCheck,
  UserMinus,
  Users,
  X,
} from "lucide-react";
import { Avatar, Badge, Button, cn, Spinner } from "@/design-system";
import { authClient } from "@/features/auth/api/auth.client";
import { Logo } from "@/features/layout/components/Logo";
import type { SessionUser } from "@/shared/contracts/api";

const BASE_NAV = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/unfollows", label: "Unfollows", icon: UserMinus },
  { href: "/followers", label: "Seguidores", icon: Users },
  { href: "/imports", label: "Importações", icon: History },
];

// Admin-only items. `isAdmin` comes from the backend and only hides links;
// the backend rejects non-admins on every admin endpoint.
const ADMIN_NAV = [
  { href: "/syncs", label: "Sincronizações", icon: RefreshCw },
  { href: "/admin/users", label: "Usuários", icon: ShieldCheck },
];

function NavPendingHint() {
  const { pending } = useLinkStatus();
  return pending ? (
    <Spinner size="sm" className="ml-auto" label="Carregando página" />
  ) : null;
}

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const navItems = user.isAdmin ? [...BASE_NAV, ...ADMIN_NAV] : BASE_NAV;

  async function logout() {
    setLeaving(true);
    await authClient.logout().catch(() => undefined);
    router.replace("/login");
    router.refresh();
  }

  const nav = (
    <nav aria-label="Principal" className="flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent-soft text-accent"
                : "text-muted hover:bg-surface-muted hover:text-fg",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
            <NavPendingHint />
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-border pt-4">
      <div className="flex items-center gap-2.5 px-2">
        <Avatar name={user.name} src={user.pictureUrl} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fg" title={user.name}>
            {user.name}
          </p>
          <p className="truncate text-xs text-soft" title={user.email}>
            {user.email}
          </p>
        </div>
        <Badge tone={user.plan === "pro" ? "accent" : "neutral"}>
          {user.plan === "pro" ? "Pro" : "Free"}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full justify-start"
        onClick={logout}
        loading={leaving}
        icon={<LogOut className="size-4" />}
      >
        Sair
      </Button>
    </div>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col justify-between border-r border-border bg-surface px-3 py-5 lg:flex">
        <div>
          <div className="mb-8 px-3">
            <Logo />
          </div>
          {nav}
        </div>
        {footer}
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur lg:hidden">
        <Logo />
        <Button
          variant="ghost"
          size="sm"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          icon={open ? <X className="size-5" /> : <Menu className="size-5" />}
        />
      </header>
      {open && (
        <div className="fixed inset-x-0 top-14 z-20 border-b border-border bg-surface p-4 shadow-card lg:hidden">
          {nav}
          <div className="mt-4">{footer}</div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
