import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMe, getReport } from "@/lib/api";
import { addDays, formatDuration, mondayOf, zonedYmd } from "@/lib/time";
import { canViewAllAttendance } from "@/lib/types";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

function ReportsPage() {
  const today = zonedYmd();
  const from = mondayOf(today);
  const to = addDays(from, 6);
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const report = useQuery({
    queryKey: ["report", from, to],
    queryFn: () => getReport({ data: { from, to } }),
  });

  const chart = useMemo(
    () =>
      (report.data ?? []).map((r) => ({
        name: (r.profile.fullName || "Без имени").split(" ")[0],
        план: Math.round(r.scheduledMinutes / 60),
        факт: Math.round(r.workedMinutes / 60),
      })),
    [report.data],
  );

  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">Неделя</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Отчёт по часам</h1>
        <p className="mt-1 text-sm text-muted">
          {from.slice(8, 10)}.{from.slice(5, 7)} — {to.slice(8, 10)}.{to.slice(5, 7)} · план против
          факта
        </p>
      </header>

      {report.isPending ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : (
        <div className="flex flex-col gap-6">
          {chart.length > 0 && canViewAllAttendance(me.data?.role ?? "employee") && (
            <Card className="p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart} barGap={4}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "var(--color-muted)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      unit="ч"
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-raised)",
                        border: "1px solid var(--color-line)",
                        borderRadius: 12,
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="план" fill="var(--color-line-strong)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="факт" fill="var(--color-pine)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {(report.data ?? []).length === 0 ? (
            <Card className="p-8 text-sm text-muted">За эту неделю данных ещё нет.</Card>
          ) : (
            <Card className="overflow-hidden p-0">
              <div className="hidden grid-cols-[1.4fr_repeat(4,1fr)] border-b border-line px-4 py-2 text-xs font-medium tracking-wide text-muted uppercase md:grid">
                <span>Сотрудник</span>
                <span>План</span>
                <span>Факт</span>
                <span>Опоздания</span>
                <span>Пропуски</span>
              </div>
              <ul>
                {(report.data ?? []).map((r) => (
                  <li
                    key={r.profile.userId}
                    className="grid grid-cols-2 gap-2 border-b border-line px-4 py-3 last:border-0 md:grid-cols-[1.4fr_repeat(4,1fr)] md:items-center"
                  >
                    <div>
                      <p className="font-medium">{r.profile.fullName || "Без имени"}</p>
                      <p className="text-xs text-muted md:hidden">
                        {r.profile.departmentName || r.profile.position || "—"}
                      </p>
                    </div>
                    <p className="font-mono text-sm tabular">
                      <span className="mr-2 text-muted md:hidden">план </span>
                      {formatDuration(r.scheduledMinutes)}
                    </p>
                    <p className="font-mono text-sm tabular">
                      <span className="mr-2 text-muted md:hidden">факт </span>
                      {formatDuration(r.workedMinutes)}
                    </p>
                    <p className="text-sm">
                      <span className="mr-2 text-muted md:hidden">опоздания </span>
                      {r.lateCount}
                    </p>
                    <p className="text-sm">
                      <span className="mr-2 text-muted md:hidden">пропуски </span>
                      {r.absentCount}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </AppShell>
  );
}
