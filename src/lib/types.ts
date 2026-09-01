export const ROLES = ["admin", "manager", "employee", "pending"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Администратор",
  manager: "Руководитель",
  employee: "Сотрудник",
  pending: "Ожидает",
};

export function canManageTeam(role: Role) {
  return role === "admin";
}

export function canManageSchedule(role: Role) {
  return role === "admin" || role === "manager";
}

export function canViewAllAttendance(role: Role) {
  return role === "admin" || role === "manager";
}

export function isActiveRole(role: Role) {
  return role !== "pending";
}

export type Department = {
  id: number;
  name: string;
};

export type Profile = {
  userId: string;
  fullName: string;
  email: string | null;
  role: Role;
  departmentId: number | null;
  departmentName: string | null;
  position: string;
  createdAt: string;
};

export type Shift = {
  id: number;
  userId: string;
  workDate: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  notes: string;
};

export type AttendanceRow = {
  id: number;
  userId: string;
  workDate: string;
  clockIn: string;
  clockOut: string | null;
  note: string;
  fullName?: string;
};

export type PersonStatus =
  | "present"
  | "late"
  | "done"
  | "absent"
  | "off"
  | "planned";

export type TeamStatus = {
  profile: Profile;
  shift: Shift | null;
  clockIn: string | null;
  clockOut: string | null;
  status: PersonStatus;
  workedMinutes: number;
};

export type Dashboard = {
  me: Profile;
  today: string;
  todayShift: Shift | null;
  openClockIn: string | null;
  todaySessions: AttendanceRow[];
  team: TeamStatus[];
  weekScheduledMinutes: number;
  weekWorkedMinutes: number;
};

export type ReportRow = {
  profile: Profile;
  scheduledMinutes: number;
  workedMinutes: number;
  lateCount: number;
  absentCount: number;
  presentDays: number;
};
