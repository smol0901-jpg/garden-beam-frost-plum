import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ensureMe, getMe, updateMyProfile } from "@/lib/api";
import { canManageTeam, canViewAllAttendance, isActiveRole, ROLE_LABEL, type Role } from "@/lib/types";
import { initials } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSplash } from "@/components/login-screen";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Главная", icon: LayoutDashboard, staff: false },
  { to: "/schedule", label: "График", icon: CalendarDays, staff: false },
  { to: "/attendance", label: "Табель", icon: ClipboardList, staff: false },
  { to: "/team", label: "Команда", icon: Users, staff: true, admin: true },
  { to: "/reports", label: "Отчёт", icon: BarChart3, staff: true },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [signingOut, setSigningOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    void ensureMe({ data: { name: user.displayName ?? "", email: user.primaryEmail } }).then(
      () => queryClient.invalidateQueries({ queryKey: ["me"] }),
    );
  }, [user, queryClient]);

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    enabled: Boolean(user),
  });

  if (isPending) {
    return <AuthSplash />;
  }
  if (!user) return <RedirectToSignIn />;

  const me = meQuery.data;
  const role: Role = me?.role ?? "pending";
  const unauthorized =
    meQuery.error instanceof Error && meQuery.error.message === "Unauthorized";
  if (unauthorized) return <RedirectToSignIn />;

  if (meQuery.isPending && !me) {
    return <AuthSplash />;
  }

  if (me && !isActiveRole(me.role)) {
    return (
      <PendingScreen
        name={me.fullName || user.displayName || user.primaryEmail || "Сотрудник"}
        signingOut={signingOut}
        onSignOut={() => {
          setSigningOut(true);
          void signOut().catch(() => setSigningOut(false));
        }}
      />
    );
  }

  const visibleNav = NAV.filter((item) => {
    if ("admin" in item && item.admin) return canManageTeam(role);
    if (item.staff) return canViewAllAttendance(role);
    return true;
  });

  const displayName = me?.fullName || user.displayName || "Сотрудник";

  return (
    <div className="paper-grain min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-6xl">
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-line px-4 py-6 md:flex">
          <Brand />
          <nav className="mt-8 flex flex-col gap-1">
            {visibleNav.map((item) => (
              <NavLink key={item.to} {...item} active={pathname === item.to} />
            ))}
          </nav>
          <div className="mt-auto pt-6">
            <AccountChip
              name={displayName}
              role={role}
              onProfile={() => setProfileOpen(true)}
              signingOut={signingOut}
              onSignOut={() => {
                setSigningOut(true);
                void signOut().catch(() => setSigningOut(false));
              }}
            />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:hidden">
            <Brand compact />
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="grid size-11 place-items-center rounded-full bg-pine text-sm font-semibold text-pine-fg"
            >
              {initials(displayName)}
            </button>
          </header>
          <main className="flex-1 px-4 py-5 pb-24 md:px-8 md:py-8 md:pb-8">{children}</main>
          <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur md:hidden">
            <div
              className="mx-auto grid max-w-6xl"
              style={{ gridTemplateColumns: `repeat(${visibleNav.length}, minmax(0, 1fr))` }}
            >
              {visibleNav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                      active ? "text-pine" : "text-muted",
                    )}
                  >
                    <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
      <ProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        name={me?.fullName || displayName}
        position={me?.position ?? ""}
        onSignOut={() => {
          setSigningOut(true);
          void signOut().catch(() => setSigningOut(false));
        }}
        signingOut={signingOut}
      />
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-[10px] bg-pine text-pine-fg">
        <StampMark />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-lg font-semibold tracking-tight">Смена</span>
          <span className="block text-[11px] text-muted">табель и график</span>
        </span>
      )}
      {compact && (
        <span className="font-display text-lg font-semibold tracking-tight">Смена</span>
      )}
    </Link>
  );
}

function StampMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.5v5l3.2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function NavLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex h-11 items-center gap-2.5 rounded-[10px] px-3 text-sm font-medium transition-colors duration-150",
        active ? "bg-pine text-pine-fg" : "text-ink/80 hover:bg-ink/5",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

function AccountChip({
  name,
  role,
  onProfile,
  onSignOut,
  signingOut,
}: {
  name: string;
  role: Role;
  onProfile: () => void;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  return (
    <div className="rounded-xl bg-raised p-3 shadow-[var(--shadow-card)]">
      <button type="button" onClick={onProfile} className="flex w-full items-center gap-2.5 text-left">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-pine text-xs font-semibold text-pine-fg">
          {initials(name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{name}</span>
          <span className="block text-[11px] text-muted">{ROLE_LABEL[role]}</span>
        </span>
      </button>
      <button
        type="button"
        onClick={onSignOut}
        disabled={signingOut}
        className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-muted hover:bg-ink/5 hover:text-ink"
      >
        <LogOut className="size-3.5" />
        {signingOut ? "Выходим…" : "Выйти"}
      </button>
    </div>
  );
}

function PendingScreen({
  name,
  onSignOut,
  signingOut,
}: {
  name: string;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  return (
    <div className="paper-grain grid min-h-dvh place-items-center px-5">
      <div className="w-full max-w-md rounded-xl bg-surface p-7 shadow-[var(--shadow-card)]">
        <Brand />
        <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight">Ожидание доступа</h1>
        <p className="mt-3 text-muted">
          {name}, аккаунт создан. Администратор должен подтвердить вас в разделе «Команда» и
          назначить роль — после этого откроются график и отметка прихода.
        </p>
        <Button
          variant="outline"
          className="mt-6 w-full"
          onClick={onSignOut}
          disabled={signingOut}
        >
          {signingOut ? "Выходим…" : "Выйти"}
        </Button>
      </div>
    </div>
  );
}

function ProfileDialog({
  open,
  onOpenChange,
  name,
  position,
  onSignOut,
  signingOut,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  name: string;
  position: string;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState(name);
  const [pos, setPos] = useState(position);
  useEffect(() => {
    setFullName(name);
    setPos(position);
  }, [name, position, open]);

  const save = useMutation({
    mutationFn: () => updateMyProfile({ data: { fullName, position: pos } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["team"] });
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Профиль</DialogTitle>
        <DialogDescription>Имя будет видно в графике и табеле.</DialogDescription>
        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Фамилия и имя</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="position">Должность</Label>
            <Input
              id="position"
              value={pos}
              onChange={(e) => setPos(e.target.value)}
              placeholder="например, кассир"
            />
          </div>
          {save.error && (
            <p className="text-sm text-absent">{save.error.message}</p>
          )}
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Сохраняем…" : "Сохранить"}
          </Button>
          <Button type="button" variant="ghost" onClick={onSignOut} disabled={signingOut}>
            {signingOut ? "Выходим…" : "Выйти из аккаунта"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
