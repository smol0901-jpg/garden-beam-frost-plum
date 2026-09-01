import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { WeekBoard } from "@/components/week-board";
import { Skeleton } from "@/components/ui/skeleton";
import { getMe, listShifts, listTeam } from "@/lib/api";
import { addDays, mondayOf, zonedYmd } from "@/lib/time";

export const Route = createFileRoute("/schedule")({ component: SchedulePage });

function SchedulePage() {
  const [monday, setMonday] = useState(() => mondayOf(zonedYmd()));
  const to = useMemo(() => addDays(monday, 6), [monday]);

  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const team = useQuery({ queryKey: ["team"], queryFn: () => listTeam() });
  const shifts = useQuery({
    queryKey: ["shifts", monday, to],
    queryFn: () => listShifts({ data: { from: monday, to } }),
  });

  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">Расписание</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">График смен</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Неделя с понедельника. Руководитель назначает смены, сотрудники видят своё расписание и
          команду.
        </p>
      </header>
      {!me.data || shifts.isPending ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : (
        <WeekBoard
          monday={monday}
          onMondayChange={setMonday}
          people={(team.data ?? []).filter((p) => p.role !== "pending")}
          shifts={shifts.data ?? []}
          role={me.data.role}
          selfId={me.data.userId}
        />
      )}
    </AppShell>
  );
}
