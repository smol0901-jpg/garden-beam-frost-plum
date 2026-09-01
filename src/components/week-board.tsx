import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { copyWeek, deleteShift, fillWeekdays, upsertShift } from "@/lib/api";
import type { Profile, Shift } from "@/lib/types";
import { canManageSchedule, type Role } from "@/lib/types";
import { addDays, formatDayShort, hhmm, mondayOf, weekdayShort, zonedYmd } from "@/lib/time";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import { cn } from "@/lib/utils";

export function WeekBoard({
  monday,
  onMondayChange,
  people,
  shifts,
  role,
  selfId,
}: {
  monday: string;
  onMondayChange: (ymd: string) => void;
  people: Profile[];
  shifts: Shift[];
  role: Role;
  selfId: string;
}) {
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(monday, i)), [monday]);
  const today = zonedYmd();
  const manage = canManageSchedule(role);
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState<{ userId: string; date: string } | null>(null);

  const byKey = useMemo(() => {
    const map = new Map<string, Shift>();
    for (const s of shifts) map.set(`${s.userId}:${s.workDate}`, s);
    return map;
  }, [shifts]);

  const copy = useMutation({
    mutationFn: () =>
      copyWeek({ data: { fromMonday: addDays(monday, -7), toMonday: monday } }),
    onSuccess: (r) => {
      toast.success(r.copied ? `Скопировано смен: ${r.copied}` : "На прошлой неделе смен не было");
      void queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const shownPeople = manage ? people : people.filter((p) => p.userId === selfId || p.role !== "pending");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Предыдущая неделя"
            onClick={() => onMondayChange(addDays(monday, -7))}
          >
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMondayChange(mondayOf(zonedYmd()))}>
            Сегодня
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Следующая неделя"
            onClick={() => onMondayChange(addDays(monday, 7))}
          >
            <ChevronRight />
          </Button>
        </div>
        <p className="font-display text-lg font-semibold">
          {formatDayShort(monday)} — {formatDayShort(addDays(monday, 6))}
        </p>
        {manage && (
          <Button
            variant="secondary"
            size="sm"
            className="ml-auto"
            onClick={() => copy.mutate()}
            disabled={copy.isPending}
          >
            <Copy className="size-3.5" />
            С прошлой недели
          </Button>
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-card)] md:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="w-44 px-4 py-3 text-xs font-medium tracking-wide text-muted uppercase">
                Сотрудник
              </th>
              {days.map((d) => (
                <th
                  key={d}
                  className={cn(
                    "px-2 py-3 text-center text-xs font-medium",
                    d === today ? "text-pine" : "text-muted",
                  )}
                >
                  <span className="block uppercase">{weekdayShort(d)}</span>
                  <span className="font-mono text-sm tabular text-ink">{formatDayShort(d)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shownPeople.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted">
                  Пока нет сотрудников. Подтвердите заявки в разделе «Команда».
                </td>
              </tr>
            )}
            {shownPeople.map((p) => (
              <tr key={p.userId} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.fullName || "Без имени"}</div>
                  <div className="text-xs text-muted">{p.position || p.departmentName || "—"}</div>
                </td>
                {days.map((d) => {
                  const shift = byKey.get(`${p.userId}:${d}`);
                  return (
                    <td key={d} className="p-1.5">
                      <button
                        type="button"
                        disabled={!manage}
                        onClick={() => setEdit({ userId: p.userId, date: d })}
                        className={cn(
                          "flex min-h-12 w-full flex-col items-center justify-center rounded-lg px-1 py-2 text-xs",
                          shift
                            ? "bg-pine/8 font-mono tabular text-pine"
                            : "text-subtle hover:bg-ink/5",
                          manage && "cursor-pointer",
                          d === today && "ring-1 ring-pine/25",
                        )}
                      >
                        {shift ? (
                          <>
                            {hhmm(shift.startTime)}–{hhmm(shift.endTime)}
                          </>
                        ) : manage ? (
                          "назначить"
                        ) : (
                          "—"
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {days.map((d) => (
          <div key={d} className="rounded-xl bg-surface p-3 shadow-[var(--shadow-card)]">
            <p className={cn("text-sm font-medium", d === today ? "text-pine" : "text-ink")}>
              {weekdayShort(d)} · {formatDayShort(d)}
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {shownPeople.map((p) => {
                const shift = byKey.get(`${p.userId}:${d}`);
                return (
                  <li key={p.userId}>
                    <button
                      type="button"
                      disabled={!manage}
                      onClick={() => setEdit({ userId: p.userId, date: d })}
                      className="flex min-h-11 w-full items-center justify-between rounded-lg px-2 text-sm hover:bg-ink/5"
                    >
                      <span className="truncate">{p.fullName || "Без имени"}</span>
                      <span className="font-mono text-xs tabular text-pine">
                        {shift ? `${hhmm(shift.startTime)}–${hhmm(shift.endTime)}` : "—"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {edit && (
        <ShiftDialog
          people={people}
          shift={byKey.get(`${edit.userId}:${edit.date}`) ?? null}
          userId={edit.userId}
          date={edit.date}
          monday={monday}
          onClose={() => setEdit(null)}
        />
      )}
    </div>
  );
}

function ShiftDialog({
  people,
  shift,
  userId,
  date,
  monday,
  onClose,
}: {
  people: Profile[];
  shift: Shift | null;
  userId: string;
  date: string;
  monday: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const person = people.find((p) => p.userId === userId);
  const [start, setStart] = useState(hhmm(shift?.startTime ?? "09:00"));
  const [end, setEnd] = useState(hhmm(shift?.endTime ?? "18:00"));
  const [brk, setBrk] = useState(String(shift?.breakMinutes ?? 60));
  const [notes, setNotes] = useState(shift?.notes ?? "");
  const [who, setWho] = useState(userId);

  const save = useMutation({
    mutationFn: () =>
      upsertShift({
        data: {
          userId: who,
          workDate: date,
          startTime: start,
          endTime: end,
          breakMinutes: Number(brk) || 0,
          notes,
        },
      }),
    onSuccess: () => {
      toast.success("Смена сохранена");
      void queryClient.invalidateQueries({ queryKey: ["shifts"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const fill = useMutation({
    mutationFn: () =>
      fillWeekdays({
        data: {
          userId: who,
          monday,
          startTime: start,
          endTime: end,
          breakMinutes: Number(brk) || 0,
        },
      }),
    onSuccess: () => {
      toast.success("Пн–пт заполнены");
      void queryClient.invalidateQueries({ queryKey: ["shifts"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () => deleteShift({ data: { id: shift!.id } }),
    onSuccess: () => {
      toast.success("Смена удалена");
      void queryClient.invalidateQueries({ queryKey: ["shifts"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogTitle>{shift ? "Смена" : "Назначить смену"}</DialogTitle>
        <DialogDescription>
          {person?.fullName || "Сотрудник"} · {formatDayShort(date)}
        </DialogDescription>
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="who">Сотрудник</Label>
            <SelectNative id="who" value={who} onChange={(e) => setWho(e.target.value)}>
              {people
                .filter((p) => p.role !== "pending")
                .map((p) => (
                  <option key={p.userId} value={p.userId}>
                    {p.fullName || p.email || p.userId}
                  </option>
                ))}
            </SelectNative>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="start">Приход</Label>
              <Input id="start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="end">Уход</Label>
              <Input id="end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brk">Перерыв, мин</Label>
            <Input
              id="brk"
              type="number"
              min={0}
              max={240}
              value={brk}
              onChange={(e) => setBrk(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Заметка</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Сохраняем…" : "Сохранить"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => fill.mutate()} disabled={fill.isPending}>
            Заполнить пн–пт этими часами
          </Button>
          {shift && (
            <Button
              type="button"
              variant="ghost"
              className="text-absent"
              onClick={() => remove.mutate()}
              disabled={remove.isPending}
            >
              <Trash2 className="size-4" />
              Удалить смену
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
