import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { SelectNative } from "@/components/ui/select-native";
import { Skeleton } from "@/components/ui/skeleton";
import { getMe, listAttendance, listTeam } from "@/lib/api";
import { addDays, formatDay, formatDuration, isoToHm, minutesBetween, mondayOf, zonedYmd } from "@/lib/time";
import { canViewAllAttendance } from "@/lib/types";

export const Route = createFileRoute("/attendance")({ component: AttendancePage });

function AttendancePage() {
  const today = zonedYmd();
  const [from, setFrom] = useState(() => mondayOf(today));
  const to = useMemo(() => addDays(from, 6), [from]);
  const [userId, setUserId] = useState<string>("");

  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const team = useQuery({ queryKey: ["team"], queryFn: () => listTeam() });
  const staff = me.data ? canViewAllAttendance(me.data.role) : false;

  const att = useQuery({
    queryKey: ["attendance", from, to, userId],
    queryFn: () =>
      listAttendance({
        data: { from, to, userId: userId || undefined },
      }),
  });

  return (
    <AppShell>
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Фиксация</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Табель прихода</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <SelectNative value={from} onChange={(e) => setFrom(e.target.value)}>
            {[-2, -1, 0, 1].map((w) => {
              const m = addDays(mondayOf(today), w * 7);
              return (
                <option key={m} value={m}>
                  неделя с {m.slice(8, 10)}.{m.slice(5, 7)}
                </option>
              );
            })}
          </SelectNative>
          {staff && (
            <SelectNative value={userId} onChange={(e) => setUserId(e.target.value)}>
              <option value="">Все сотрудники</option>
              {(team.data ?? [])
                .filter((p) => p.role !== "pending")
                .map((p) => (
                  <option key={p.userId} value={p.userId}>
                    {p.fullName || p.email || p.userId}
                  </option>
                ))}
            </SelectNative>
          )}
        </div>
      </header>

      {att.isPending ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : !att.data?.length ? (
        <Card className="p-8 text-sm text-muted">
          За эту неделю отметок нет. Приход и уход фиксируются на главной.
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <ul>
            {att.data.map((row) => {
              const mins = minutesBetween(row.clockIn, row.clockOut ?? new Date().toISOString());
              return (
                <li
                  key={row.id}
                  className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {row.fullName || "Сотрудник"}
                      <span className="ml-2 text-sm font-normal text-muted">
                        {formatDay(row.workDate)}
                      </span>
                    </p>
                    <p className="font-mono text-xs text-muted tabular">
                      {isoToHm(row.clockIn)} → {row.clockOut ? isoToHm(row.clockOut) : "на смене"}
                      {row.note ? ` · ${row.note}` : ""}
                    </p>
                  </div>
                  <p className="font-mono text-sm tabular">{formatDuration(mins)}</p>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </AppShell>
  );
}
