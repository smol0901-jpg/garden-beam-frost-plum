import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { ClockCard } from "@/components/clock-card";
import { AuthSplash, LoginScreen } from "@/components/login-screen";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getDashboard } from "@/lib/api";
import { formatDuration, hhmm, isoToHm } from "@/lib/time";
import { canViewAllAttendance, type Dashboard } from "@/lib/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();
  const { sessionUser } = useRouteContext({ from: "__root__" });
  if (user) {
    return (
      <AppShell>
        <DashboardBody />
      </AppShell>
    );
  }
  if (isPending && sessionUser) return <AuthSplash />;
  return <LoginScreen />;
}

function DashboardBody() {
  const q = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboard() });

  if (q.isPending || !q.data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Главная</h1>
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }
  if (q.error) return <p className="text-absent">{q.error.message}</p>;
  return <DashboardView data={q.data} />;
}

function DashboardView({ data }: { data: Dashboard }) {
  const staff = canViewAllAttendance(data.me.role);
  const present = data.team.filter((t) => t.status === "present" || t.status === "late").length;
  const late = data.team.filter((t) => t.status === "late").length;
  const absent = data.team.filter((t) => t.status === "absent").length;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-medium tracking-wide text-muted uppercase">Главная</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          Здравствуйте{data.me.fullName ? `, ${data.me.fullName.split(" ")[0]}` : ""}
        </h1>
      </header>

      <ClockCard data={data} />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="План на неделю" value={formatDuration(data.weekScheduledMinutes)} />
        <Stat label="Отработано" value={formatDuration(data.weekWorkedMinutes)} />
        <Stat
          label="Разница"
          value={formatDuration(data.weekWorkedMinutes - data.weekScheduledMinutes)}
        />
      </div>

      {staff && (
        <Card>
          <CardHeader className="flex-row items-end justify-between">
            <div>
              <CardTitle>Кто на месте</CardTitle>
              <p className="text-sm text-muted">
                На смене {present}
                {late ? ` · опозданий ${late}` : ""}
                {absent ? ` · не отметились ${absent}` : ""}
              </p>
            </div>
            <Link to="/team" className="text-sm font-medium text-pine hover:underline">
              Команда
            </Link>
          </CardHeader>
          <CardContent>
            {data.team.length === 0 ? (
              <p className="text-sm text-muted">
                Пока никого нет. Сотрудники регистрируются сами — подтвердите их в «Команде».
              </p>
            ) : (
              <ul className="flex flex-col">
                {data.team.map((row) => (
                  <li
                    key={row.profile.userId}
                    className="flex min-h-14 items-center justify-between gap-3 border-b border-line py-2 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {row.profile.fullName || row.profile.email || "Без имени"}
                      </p>
                      <p className="text-xs text-muted">
                        {row.shift
                          ? `${hhmm(row.shift.startTime)}–${hhmm(row.shift.endTime)}`
                          : "выходной"}
                        {row.clockIn ? ` · приход ${isoToHm(row.clockIn)}` : ""}
                        {row.clockOut ? ` · уход ${isoToHm(row.clockOut)}` : ""}
                      </p>
                    </div>
                    <StatusBadge status={row.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 font-mono text-xl font-medium tabular">{value}</p>
    </Card>
  );
}
