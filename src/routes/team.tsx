import { useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import { Skeleton } from "@/components/ui/skeleton";
import { addDepartment, getMe, listDepartments, listTeam, updateMember } from "@/lib/api";
import { initials } from "@/lib/time";
import { canManageTeam, ROLE_LABEL, type Profile, type Role } from "@/lib/types";

export const Route = createFileRoute("/team")({ component: TeamPage });

function TeamPage() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe() });
  const team = useQuery({ queryKey: ["team"], queryFn: () => listTeam() });
  const deps = useQuery({ queryKey: ["departments"], queryFn: () => listDepartments() });
  const [edit, setEdit] = useState<Profile | null>(null);
  const [depName, setDepName] = useState("");
  const queryClient = useQueryClient();

  const addDep = useMutation({
    mutationFn: () => addDepartment({ data: { name: depName } }),
    onSuccess: () => {
      setDepName("");
      toast.success("Отдел добавлен");
      void queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (me.data && !canManageTeam(me.data.role)) {
    return (
      <AppShell>
        <Navigate to="/" />
      </AppShell>
    );
  }

  const pending = (team.data ?? []).filter((p) => p.role === "pending");
  const active = (team.data ?? []).filter((p) => p.role !== "pending");

  return (
    <AppShell>
      <header className="mb-5">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">Роли</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Команда</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Подтверждайте новых сотрудников и назначайте роли: администратор, руководитель или
          сотрудник.
        </p>
      </header>

      {team.isPending ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="flex flex-col gap-8">
          {pending.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-semibold">Ожидают подтверждения</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {pending.map((p) => (
                  <PersonCard key={p.userId} person={p} onEdit={() => setEdit(p)} />
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="font-display text-xl font-semibold">Сотрудники</h2>
            {active.length === 0 ? (
              <Card className="mt-3 p-6 text-sm text-muted">
                Пока только вы. Попросите коллег зарегистрироваться — они появятся в списке ожидания.
              </Card>
            ) : (
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {active.map((p) => (
                  <PersonCard key={p.userId} person={p} onEdit={() => setEdit(p)} />
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Отделы</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(deps.data ?? []).map((d) => (
                <Badge key={d.id}>{d.name}</Badge>
              ))}
            </div>
            <form
              className="mt-3 flex max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (depName.trim()) addDep.mutate();
              }}
            >
              <Input
                value={depName}
                onChange={(e) => setDepName(e.target.value)}
                placeholder="Новый отдел"
              />
              <Button type="submit" variant="secondary" disabled={addDep.isPending}>
                Добавить
              </Button>
            </form>
          </section>
        </div>
      )}

      {edit && (
        <MemberDialog
          person={edit}
          departments={deps.data ?? []}
          onClose={() => setEdit(null)}
        />
      )}
    </AppShell>
  );
}

function PersonCard({ person, onEdit }: { person: Profile; onEdit: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onEdit}
        className="flex min-h-20 w-full items-center gap-3 rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-card)]"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-pine text-sm font-semibold text-pine-fg">
          {initials(person.fullName || person.email || "?")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{person.fullName || "Без имени"}</span>
          <span className="block truncate text-xs text-muted">
            {person.email || "нет email"}
            {person.position ? ` · ${person.position}` : ""}
          </span>
        </span>
        <Badge tone={person.role === "pending" ? "warn" : "pine"}>{ROLE_LABEL[person.role]}</Badge>
      </button>
    </li>
  );
}

function MemberDialog({
  person,
  departments,
  onClose,
}: {
  person: Profile;
  departments: { id: number; name: string }[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [role, setRole] = useState<Role>(person.role === "pending" ? "employee" : person.role);
  const [departmentId, setDepartmentId] = useState(person.departmentId ? String(person.departmentId) : "");
  const [position, setPosition] = useState(person.position);
  const [fullName, setFullName] = useState(person.fullName);

  const save = useMutation({
    mutationFn: () =>
      updateMember({
        data: {
          userId: person.userId,
          role,
          departmentId: departmentId ? Number(departmentId) : null,
          position,
          fullName,
        },
      }),
    onSuccess: () => {
      toast.success("Сотрудник обновлён");
      void queryClient.invalidateQueries({ queryKey: ["team"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogTitle>Карточка сотрудника</DialogTitle>
        <DialogDescription>{person.email || person.userId}</DialogDescription>
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mn">Имя</Label>
            <Input id="mn" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Роль</Label>
            <SelectNative id="role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="employee">Сотрудник — график и свой приход</option>
              <option value="manager">Руководитель — график и табель команды</option>
              <option value="admin">Администратор — роли и отделы</option>
              <option value="pending">Ожидает</option>
            </SelectNative>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dep">Отдел</Label>
            <SelectNative
              id="dep"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">Без отдела</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </SelectNative>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pos">Должность</Label>
            <Input id="pos" value={position} onChange={(e) => setPosition(e.target.value)} />
          </div>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Сохраняем…" : "Сохранить"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
