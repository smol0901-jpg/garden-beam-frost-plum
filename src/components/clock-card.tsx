import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogIn, LogOut } from "lucide-react";
import { clockIn, clockOut } from "@/lib/api";
import type { Dashboard } from "@/lib/types";
import { formatDay, formatDuration, hhmm, isoToHm, minutesBetween, weekdayLong, zonedHms } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

export function ClockCard({ data }: { data: Dashboard }) {
  const [now, setNow] = useState(() => new Date());
  const queryClient = useQueryClient();

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const inMut = useMutation({
    mutationFn: () => clockIn({ data: {} }),
    onSuccess: () => {
      toast.success("Приход отмечен");
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const outMut = useMutation({
    mutationFn: () => clockOut(),
    onSuccess: () => {
      toast.success("Уход отмечен");
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const open = Boolean(data.openClockIn);
  const elapsed = data.openClockIn
    ? minutesBetween(data.openClockIn, now.toISOString())
    : data.todaySessions.reduce(
        (acc, s) => acc + minutesBetween(s.clockIn, s.clockOut ?? now.toISOString()),
        0,
      );
  const shift = data.todayShift;
  const status = open
    ? data.todaySessions[0] &&
      shift &&
      new Date(data.todaySessions[0].clockIn).getTime() >
        new Date(
          `${shift.workDate}T${shift.startTime.length === 5 ? shift.startTime + ":00" : shift.startTime.slice(0, 8)}+03:00`,
        ).getTime() +
          5 * 60_000
      ? "late"
      : "present"
    : data.todaySessions.some((s) => s.clockOut)
      ? "done"
      : shift
        ? "planned"
        : "off";

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            {weekdayLong(data.today)} · {formatDay(data.today)}
          </p>
          <p className="mt-2 font-mono text-5xl font-medium tracking-tight tabular sm:text-6xl">
            {zonedHms(now)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            {shift ? (
              <span className="text-sm text-muted">
                смена {hhmm(shift.startTime)}–{hhmm(shift.endTime)}
              </span>
            ) : (
              <span className="text-sm text-muted">на сегодня смена не назначена</span>
            )}
          </div>
        </div>
        <div className="flex min-w-[200px] flex-col gap-3">
          {open ? (
            <Button
              size="stamp"
              variant="destructive"
              onClick={() => outMut.mutate()}
              disabled={outMut.isPending}
            >
              <LogOut />
              {outMut.isPending ? "Отмечаем…" : "Отметить уход"}
            </Button>
          ) : (
            <Button size="stamp" onClick={() => inMut.mutate()} disabled={inMut.isPending}>
              <LogIn />
              {inMut.isPending ? "Отмечаем…" : "Отметить приход"}
            </Button>
          )}
          <p className="text-center font-mono text-sm text-muted tabular">
            {open ? "на смене " : "сегодня "}
            {formatDuration(elapsed)}
            {data.openClockIn ? ` · с ${isoToHm(data.openClockIn)}` : null}
          </p>
        </div>
      </div>
    </Card>
  );
}
