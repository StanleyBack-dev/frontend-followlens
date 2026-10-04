"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  CircleUserRound,
  History,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  UserMinus,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Alert, Button, cn, Modal, Spinner } from "@/design-system";
import { authClient } from "@/features/auth/api/auth.client";
import { Logo } from "@/features/layout/components/Logo";
import { LogoMark } from "@/features/layout/components/LogoMark";
import type { SessionUser } from "@/shared/contracts/api";
import { formatDate } from "@/shared/lib/format";

type NavItem = { href: string; label: string; icon: LucideIcon };

const BASE_NAV: NavItem[] = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/unfollows", label: "Unfollows", icon: UserMinus },
  { href: "/followers", label: "Seguidores", icon: Users },
  { href: "/imports", label: "Importações", icon: History },
];

// "Conta" group. Every user sees their own profile.
const ACCOUNT_NAV: NavItem[] = [
  { href: "/account", label: "Perfil", icon: UserRound },
];

// Admin-only item (users + sync history live under /admin). `isAdmin` comes
// from the backend and only hides the link; the backend rejects non-admins on
// every admin endpoint.
const ADMIN_ACCOUNT_NAV: NavItem[] = [
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

// The collapsed state is a per-browser preference. It lives in localStorage
// (read through an external store so the server render stays expanded).
const COLLAPSED_KEY = "fl:sidebar-collapsed";
const collapsedListeners = new Set<() => void>();

function subscribeCollapsed(listener: () => void) {
  collapsedListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    collapsedListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeCollapsed(collapsed: boolean) {
  try {
    window.localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
  } catch {
    // Storage blocked: the toggle still works for this page via listeners.
  }
  collapsedListeners.forEach((listener) => listener());
}

function NavPendingHint() {
  const { pending } = useLinkStatus();
  return pending ? (
    <Spinner size="sm" className="ml-auto" label="Carregando página" />
  ) : null;
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  pathname,
  rail = false,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  /** Icon-only (collapsed desktop sidebar). */
  rail?: boolean;
  onNavigate: () => void;
}) {
  const { href, label, icon: Icon } = item;
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={rail ? label : undefined}
      title={rail ? label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors",
        rail ? "justify-center px-0" : "px-3",
        active
          ? "bg-accent-soft text-accent"
          : "text-muted hover:bg-surface-muted hover:text-fg",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {!rail && (
        <>
          {label}
          <NavPendingHint />
        </>
      )}
    </Link>
  );
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
  const [logoutOpen, setLogoutOpen] = useState(false);
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    readCollapsed,
    () => false,
  );

  const accountItems = user.isAdmin
    ? [...ACCOUNT_NAV, ...ADMIN_ACCOUNT_NAV]
    : ACCOUNT_NAV;
  const accountActive = accountItems.some((item) =>
    isActive(pathname, item.href),
  );
  // Starts open only when the current page lives inside the group.
  const [accountOpen, setAccountOpen] = useState(accountActive);

  async function logout() {
    setLeaving(true);
    await authClient.logout().catch(() => undefined);
    router.replace("/login");
    router.refresh();
  }

  const closeMobile = () => setOpen(false);

  function renderNav(rail: boolean) {
    return (
      <nav aria-label="Principal" className="flex flex-col gap-1">
        {BASE_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            rail={rail}
            onNavigate={closeMobile}
          />
        ))}
      </nav>
    );
  }

  function renderAccount(rail: boolean) {
    // Icon rail: no room for a sub-menu, so the items are shown directly.
    if (rail) {
      return (
        <nav aria-label="Conta" className="flex flex-col gap-1">
          {accountItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              rail
              onNavigate={closeMobile}
            />
          ))}
          {renderLogout(true)}
        </nav>
      );
    }
    return (
      <nav aria-label="Conta">
        <button
          type="button"
          onClick={() => setAccountOpen((value) => !value)}
          aria-expanded={accountOpen}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            accountActive && !accountOpen
              ? "text-accent"
              : "text-muted hover:bg-surface-muted hover:text-fg",
          )}
        >
          <CircleUserRound className="size-4 shrink-0" aria-hidden />
          <span className="flex-1 text-left">Conta</span>
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              accountOpen && "rotate-180",
            )}
            aria-hidden
          />
        </button>
        {accountOpen && (
          <div className="mt-1 ml-5 flex flex-col gap-1 border-l border-border pl-2">
            {accountItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                onNavigate={closeMobile}
              />
            ))}
            {renderLogout(false)}
          </div>
        )}
      </nav>
    );
  }

  // Last entry of the "Conta" group, styled like its links.
  function renderLogout(rail: boolean) {
    return (
      <button
        type="button"
        onClick={() => {
          closeMobile();
          setLogoutOpen(true);
        }}
        aria-label={rail ? "Sair" : undefined}
        title={rail ? "Sair" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-md py-2 text-sm font-medium text-muted transition-colors",
          "hover:bg-surface-muted hover:text-fg",
          rail ? "justify-center px-0" : "px-3",
        )}
      >
        <LogOut className="size-4 shrink-0" aria-hidden />
        {!rail && "Sair"}
      </button>
    );
  }

  function renderFooter(rail: boolean) {
    return (
      <div className="border-t border-border pt-4">{renderAccount(rail)}</div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-dvh lg:grid lg:transition-[grid-template-columns] lg:duration-200",
        collapsed ? "lg:grid-cols-[68px_1fr]" : "lg:grid-cols-[240px_1fr]",
      )}
    >
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh flex-col justify-between overflow-x-hidden overflow-y-auto border-r border-border bg-surface py-5 lg:flex",
          collapsed ? "px-2" : "px-3",
        )}
      >
        <div>
          <div
            className={cn(
              "mb-8 flex items-center",
              collapsed ? "flex-col gap-3" : "justify-between pr-1 pl-3",
            )}
          >
            {collapsed ? <LogoMark className="size-8 text-accent" /> : <Logo />}
            <button
              type="button"
              onClick={() => writeCollapsed(!collapsed)}
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
              title={collapsed ? "Expandir menu" : "Recolher menu"}
              aria-expanded={!collapsed}
              className="grid size-8 shrink-0 place-items-center rounded-md text-soft transition-colors hover:bg-surface-muted hover:text-fg"
            >
              {collapsed ? (
                <PanelLeftOpen className="size-[18px]" aria-hidden />
              ) : (
                <PanelLeftClose className="size-[18px]" aria-hidden />
              )}
            </button>
          </div>
          {renderNav(collapsed)}
        </div>
        {renderFooter(collapsed)}
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
        <div className="fixed inset-x-0 top-14 z-20 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-border bg-surface p-4 shadow-card lg:hidden">
          {renderNav(false)}
          <div className="mt-4">{renderFooter(false)}</div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {user.deletionScheduledFor && (
          <Alert
            tone="warning"
            title="Exclusão de conta agendada"
            className="mb-6"
          >
            Sua conta e todos os dados serão excluídos em{" "}
            {formatDate(user.deletionScheduledFor)}.{" "}
            <Link href="/account" className="font-medium underline">
              Cancelar exclusão
            </Link>
          </Alert>
        )}
        {children}
      </main>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Encerrar sessão"
        icon={<LogOut className="size-5" />}
        busy={leaving}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setLogoutOpen(false)}
              disabled={leaving}
            >
              Cancelar
            </Button>
            <Button onClick={logout} loading={leaving}>
              Sair
            </Button>
          </>
        }
      >
        Você tem certeza que deseja sair do FollowLens?
      </Modal>
    </div>
  );
}
