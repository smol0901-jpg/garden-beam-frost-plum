import { Badge } from "@/components/ui/badge";
import type { PersonStatus } from "@/lib/types";

const LABEL: Record<PersonStatus, string> = {
  present: "На смене",
  late: "Опоздание",
  done: "Смена закрыта",
  absent: "Не отметился",
  off: "Выходной",
  planned: "Ожидается",
};

const TONE: Record<PersonStatus, "present" | "late" | "absent" | "muted" | "pine" | "warn"> = {
  present: "present",
  late: "late",
  done: "pine",
  absent: "absent",
  off: "muted",
  planned: "warn",
};

export function StatusBadge({ status }: { status: PersonStatus }) {
  return <Badge tone={TONE[status]}>{LABEL[status]}</Badge>;
}

export function statusLabel(status: PersonStatus) {
  return LABEL[status];
}
