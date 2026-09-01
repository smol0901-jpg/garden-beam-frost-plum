import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { AttendanceRow, Dashboard, Department, PersonStatus, Profile, ReportRow, Role, Shift, TeamStatus } from "@/lib/types";
import { canManageSchedule, canManageTeam, canViewAllAttendance, isActiveRole } from "@/lib/types";
import {
  addDays,
  GRACE_MINUTES,
  minutesBetween,
  mondayOf,
  moscowInstant,
  shiftMinutes,
  zonedYmd,
} from "@/lib/time";

type Sql = Awaited<ReturnType<typeof getSql>>;

type ProfileRow = {
  user_id: string;
  full_name: string;
  email: string | null;
  role: Role;
  department_id: number | null;
  department_name: string | null;
  position: string;
  created_at: unknown;
};

type ShiftRow = {
  id: number;
  user_id: string;
  work_date: string;
  start_time: string;
  end_time: string;
  break_minutes: number;
  notes: string;
};

type AttRow = {
  id: number;
  user_id: string;
  work_date: string;
  clock_in: unknown;
  clock_out: unknown;
  note: string;
  full_name?: string;
};

function asIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function asIsoOrNull(value: unknown): string | null {
  if (value == null) return null;
  return asIso(value);
}

function mapProfile(row: ProfileRow): Profile {
  return {
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    departmentId: row.department_id,
    departmentName: row.department_name,
    position: row.position,
    createdAt: asIso(row.created_at),
  };
}

function mapShift(row: ShiftRow): Shift {
  return {
    id: row.id,
    userId: row.user_id,
    workDate: String(row.work_date).slice(0, 10),
    startTime: String(row.start_time),
    endTime: String(row.end_time),
    breakMinutes: Number(row.break_minutes),
    notes: row.notes,
  };
}

function mapAttendance(row: AttRow): AttendanceRow {
  return {
    id: row.id,
    userId: row.user_id,
    workDate: String(row.work_date).slice(0, 10),
    clockIn: asIso(row.clock_in),
    clockOut: asIsoOrNull(row.clock_out),
    note: row.note,
    fullName: row.full_name,
  };
}

async function loadProfile(sql: Sql, userId: string): Promise<Profile | null> {
  const rows = await sql<ProfileRow>`
    select p.user_id, p.full_name, p.email, p.role, p.department_id, p.position, p.created_at,
           d.name as department_name
    from profiles p
    left join departments d on d.id = p.department_id
    where p.user_id = ${userId}
  `;
  return rows[0] ? mapProfile(rows[0]) : null;
}

async function ensureProfile(
  sql: Sql,
  userId: string,
  name?: string,
  email?: string | null,
): Promise<Profile> {
  const existing = await loadProfile(sql, userId);
  if (existing) {
    if ((name && !existing.fullName) || (email && !existing.email)) {
      await sql`
        update profiles
        set full_name = case when full_name = '' then ${name ?? ""} else full_name end,
            email = coalesce(email, ${email ?? null})
        where user_id = ${userId}
      `;
      return (await loadProfile(sql, userId)) ?? existing;
    }
    return existing;
  }
  const admins = await sql<{ n: number }>`
    select count(*)::int as n from profiles where role = 'admin'
  `;
  const role: Role = (admins[0]?.n ?? 0) === 0 ? "admin" : "pending";
  await sql`
    insert into profiles (user_id, full_name, email, role)
    values (${userId}, ${name?.trim() || ""}, ${email ?? null}, ${role})
  `;
  const created = await loadProfile(sql, userId);
  if (!created) throw new Error("Не удалось создать профиль");
  return created;
}

async function requireProfile(sql: Sql, userId: string): Promise<Profile> {
  const p = await loadProfile(sql, userId);
  if (!p) throw new Error("Профиль не найден");
  return p;
}

function forbid(): never {
  throw new Error("Недостаточно прав");
}

export const ensureMe = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      name: z.string().optional(),
      email: z.string().nullable().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    return ensureProfile(sql, context.userId, data.name, data.email);
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return ensureProfile(sql, context.userId);
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      fullName: z.string().min(1).max(120),
      position: z.string().max(80),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    await sql`
      update profiles
      set full_name = ${data.fullName.trim()}, position = ${data.position.trim()}
      where user_id = ${context.userId}
    `;
    return requireProfile(sql, context.userId);
  });

export const listDepartments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    return sql<Department>`select id, name from departments order by name`;
  });

export const addDepartment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ name: z.string().min(1).max(60) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (!canManageTeam(me.role)) forbid();
    const name = data.name.trim();
    await sql`insert into departments (name) values (${name}) on conflict (name) do nothing`;
    return sql<Department>`select id, name from departments order by name`;
  });

export const listTeam = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (me.role === "pending") return [] as Profile[];
    const rows = await sql<ProfileRow>`
      select p.user_id, p.full_name, p.email, p.role, p.department_id, p.position, p.created_at,
             d.name as department_name
      from profiles p
      left join departments d on d.id = p.department_id
      order by
        case p.role
          when 'pending' then 0
          when 'admin' then 1
          when 'manager' then 2
          else 3
        end,
        p.full_name
    `;
    if (canViewAllAttendance(me.role)) return rows.map(mapProfile);
    return rows.filter((r) => isActiveRole(r.role)).map(mapProfile);
  });

export const updateMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      userId: z.string().min(1),
      role: z.enum(["admin", "manager", "employee", "pending"]),
      departmentId: z.number().nullable(),
      position: z.string().max(80),
      fullName: z.string().max(120).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (!canManageTeam(me.role)) forbid();
    if (data.userId === me.userId && data.role !== "admin") {
      const otherAdmins = await sql<{ n: number }>`
        select count(*)::int as n from profiles where role = 'admin' and user_id <> ${me.userId}
      `;
      if ((otherAdmins[0]?.n ?? 0) === 0) {
        throw new Error("Нельзя снять последнего администратора");
      }
    }
    await sql`
      update profiles
      set role = ${data.role},
          department_id = ${data.departmentId},
          position = ${data.position.trim()},
          full_name = coalesce(nullif(${data.fullName?.trim() ?? ""}, ''), full_name)
      where user_id = ${data.userId}
    `;
    return { ok: true as const };
  });

export const listShifts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ from: z.string(), to: z.string() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (me.role === "pending") return [] as Shift[];
    const rows = await sql<ShiftRow>`
      select id, user_id, work_date, start_time, end_time, break_minutes, notes
      from shifts
      where work_date >= ${data.from}::date and work_date <= ${data.to}::date
      order by work_date, start_time
    `;
    return rows.map(mapShift);
  });

export const upsertShift = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      userId: z.string().min(1),
      workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      startTime: z.string().min(4),
      endTime: z.string().min(4),
      breakMinutes: z.number().int().min(0).max(240),
      notes: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (!canManageSchedule(me.role)) forbid();
    const start = data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime;
    const end = data.endTime.length === 5 ? `${data.endTime}:00` : data.endTime;
    await sql`
      insert into shifts (user_id, work_date, start_time, end_time, break_minutes, notes, created_by)
      values (
        ${data.userId}, ${data.workDate}::date, ${start}::time, ${end}::time,
        ${data.breakMinutes}, ${data.notes?.trim() ?? ""}, ${context.userId}
      )
      on conflict (user_id, work_date) do update set
        start_time = excluded.start_time,
        end_time = excluded.end_time,
        break_minutes = excluded.break_minutes,
        notes = excluded.notes
    `;
    return { ok: true };
  });

export const deleteShift = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number().int() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (!canManageSchedule(me.role)) forbid();
    await sql`delete from shifts where id = ${data.id}`;
    return { ok: true };
  });

export const copyWeek = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      fromMonday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      toMonday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (!canManageSchedule(me.role)) forbid();
    const fromEnd = addDays(data.fromMonday, 6);
    const source = await sql<ShiftRow>`
      select id, user_id, work_date, start_time, end_time, break_minutes, notes
      from shifts
      where work_date >= ${data.fromMonday}::date and work_date <= ${fromEnd}::date
    `;
    let copied = 0;
    for (const row of source) {
      const ymd = String(row.work_date).slice(0, 10);
      const offset =
        (Date.parse(`${ymd}T00:00:00Z`) - Date.parse(`${data.fromMonday}T00:00:00Z`)) /
        86400000;
      const dest = addDays(data.toMonday, offset);
      await sql`
        insert into shifts (user_id, work_date, start_time, end_time, break_minutes, notes, created_by)
        values (
          ${row.user_id}, ${dest}::date, ${row.start_time}::time, ${row.end_time}::time,
          ${row.break_minutes}, ${row.notes}, ${context.userId}
        )
        on conflict (user_id, work_date) do update set
          start_time = excluded.start_time,
          end_time = excluded.end_time,
          break_minutes = excluded.break_minutes,
          notes = excluded.notes
      `;
      copied += 1;
    }
    return { copied };
  });

export const fillWeekdays = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      userId: z.string().min(1),
      monday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      startTime: z.string().min(4),
      endTime: z.string().min(4),
      breakMinutes: z.number().int().min(0).max(240),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (!canManageSchedule(me.role)) forbid();
    const start = data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime;
    const end = data.endTime.length === 5 ? `${data.endTime}:00` : data.endTime;
    for (let i = 0; i < 5; i += 1) {
      const day = addDays(data.monday, i);
      await sql`
        insert into shifts (user_id, work_date, start_time, end_time, break_minutes, notes, created_by)
        values (
          ${data.userId}, ${day}::date, ${start}::time, ${end}::time,
          ${data.breakMinutes}, '', ${context.userId}
        )
        on conflict (user_id, work_date) do update set
          start_time = excluded.start_time,
          end_time = excluded.end_time,
          break_minutes = excluded.break_minutes
      `;
    }
    return { ok: true };
  });

export const clockIn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ note: z.string().max(200).optional() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (!isActiveRole(me.role)) throw new Error("Дождитесь подтверждения администратора");
    const open = await sql<{ id: number }>`
      select id from attendance where user_id = ${context.userId} and clock_out is null limit 1
    `;
    if (open[0]) throw new Error("Вы уже отметили приход");
    const today = zonedYmd();
    await sql`
      insert into attendance (user_id, work_date, clock_in, note)
      values (${context.userId}, ${today}::date, now(), ${data.note?.trim() ?? ""})
    `;
    return { ok: true, at: new Date().toISOString() };
  });

export const clockOut = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (!isActiveRole(me.role)) throw new Error("Дождитесь подтверждения администратора");
    const open = await sql<{ id: number }>`
      select id from attendance
      where user_id = ${context.userId} and clock_out is null
      order by clock_in desc
      limit 1
    `;
    if (!open[0]) throw new Error("Нет открытой смены");
    await sql`update attendance set clock_out = now() where id = ${open[0].id} and user_id = ${context.userId}`;
    return { ok: true, at: new Date().toISOString() };
  });

export const listAttendance = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      from: z.string(),
      to: z.string(),
      userId: z.string().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (me.role === "pending") return [] as AttendanceRow[];
    const target = data.userId && canViewAllAttendance(me.role) ? data.userId : context.userId;
    const filterAll = canViewAllAttendance(me.role) && !data.userId;
    const rows = filterAll
      ? await sql<AttRow>`
          select a.id, a.user_id, a.work_date, a.clock_in, a.clock_out, a.note, p.full_name
          from attendance a
          join profiles p on p.user_id = a.user_id
          where a.work_date >= ${data.from}::date and a.work_date <= ${data.to}::date
          order by a.clock_in desc
        `
      : await sql<AttRow>`
          select a.id, a.user_id, a.work_date, a.clock_in, a.clock_out, a.note, p.full_name
          from attendance a
          join profiles p on p.user_id = a.user_id
          where a.user_id = ${target}
            and a.work_date >= ${data.from}::date
            and a.work_date <= ${data.to}::date
          order by a.clock_in desc
        `;
    return rows.map(mapAttendance);
  });

function statusOf(args: {
  shift: Shift | null;
  clockIn: string | null;
  clockOut: string | null;
  now: Date;
  today: string;
}): PersonStatus {
  const { shift, clockIn, clockOut, now, today } = args;
  if (clockOut) return "done";
  if (clockIn) {
    if (shift) {
      const start = moscowInstant(shift.workDate, shift.startTime);
      const lateMs = start.getTime() + GRACE_MINUTES * 60_000;
      if (new Date(clockIn).getTime() > lateMs) return "late";
    }
    return "present";
  }
  if (!shift) return "off";
  if (today < shift.workDate) return "planned";
  const start = moscowInstant(shift.workDate, shift.startTime);
  if (now.getTime() > start.getTime() + GRACE_MINUTES * 60_000) return "absent";
  return "planned";
}

function workedMinutesOf(sessions: AttendanceRow[], nowIso: string): number {
  let total = 0;
  for (const s of sessions) {
    total += minutesBetween(s.clockIn, s.clockOut ?? nowIso);
  }
  return total;
}

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Dashboard> => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    const today = zonedYmd();
    const weekStart = mondayOf(today);
    const weekEnd = addDays(weekStart, 6);
    const now = new Date();
    const nowIso = now.toISOString();

    const myShiftRows = await sql<ShiftRow>`
      select id, user_id, work_date, start_time, end_time, break_minutes, notes
      from shifts where user_id = ${context.userId} and work_date = ${today}::date
    `;
    const todayShift = myShiftRows[0] ? mapShift(myShiftRows[0]) : null;

    const todayAtt = await sql<AttRow>`
      select id, user_id, work_date, clock_in, clock_out, note
      from attendance
      where user_id = ${context.userId} and work_date = ${today}::date
      order by clock_in
    `;
    const todaySessions = todayAtt.map(mapAttendance);
    const open = todaySessions.find((s) => !s.clockOut);

    const weekShifts = await sql<ShiftRow>`
      select id, user_id, work_date, start_time, end_time, break_minutes, notes
      from shifts
      where user_id = ${context.userId}
        and work_date >= ${weekStart}::date
        and work_date <= ${weekEnd}::date
    `;
    const weekAtt = await sql<AttRow>`
      select id, user_id, work_date, clock_in, clock_out, note
      from attendance
      where user_id = ${context.userId}
        and work_date >= ${weekStart}::date
        and work_date <= ${weekEnd}::date
    `;
    const weekScheduledMinutes = weekShifts
      .map(mapShift)
      .reduce((acc, s) => acc + shiftMinutes(s.startTime, s.endTime, s.breakMinutes), 0);
    const weekWorkedMinutes = workedMinutesOf(weekAtt.map(mapAttendance), nowIso);

    let team: TeamStatus[] = [];
    if (canViewAllAttendance(me.role)) {
      const people = await sql<ProfileRow>`
        select p.user_id, p.full_name, p.email, p.role, p.department_id, p.position, p.created_at,
               d.name as department_name
        from profiles p
        left join departments d on d.id = p.department_id
        where p.role in ('admin', 'manager', 'employee')
        order by p.full_name
      `;
      const shiftsToday = await sql<ShiftRow>`
        select id, user_id, work_date, start_time, end_time, break_minutes, notes
        from shifts where work_date = ${today}::date
      `;
      const attToday = await sql<AttRow>`
        select id, user_id, work_date, clock_in, clock_out, note
        from attendance where work_date = ${today}::date
        order by clock_in
      `;
      const shiftByUser = new Map(shiftsToday.map((s) => [s.user_id, mapShift(s)]));
      const attByUser = new Map<string, AttendanceRow[]>();
      for (const a of attToday) {
        const list = attByUser.get(a.user_id) ?? [];
        list.push(mapAttendance(a));
        attByUser.set(a.user_id, list);
      }
      team = people.map((p) => {
        const profile = mapProfile(p);
        const shift = shiftByUser.get(p.user_id) ?? null;
        const sessions = attByUser.get(p.user_id) ?? [];
        const last = sessions[sessions.length - 1];
        const clockIn = sessions[0]?.clockIn ?? null;
        const openSession = sessions.find((s) => !s.clockOut);
        const clockOut = openSession ? null : (last?.clockOut ?? null);
        return {
          profile,
          shift,
          clockIn,
          clockOut,
          status: statusOf({
            shift,
            clockIn,
            clockOut,
            now,
            today,
          }),
          workedMinutes: workedMinutesOf(sessions, nowIso),
        };
      });
    }

    return {
      me,
      today,
      todayShift,
      openClockIn: open?.clockIn ?? null,
      todaySessions,
      team,
      weekScheduledMinutes,
      weekWorkedMinutes,
    };
  });

export const getReport = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ from: z.string(), to: z.string() }))
  .handler(async ({ context, data }): Promise<ReportRow[]> => {
    const sql = await getSql();
    const me = await ensureProfile(sql, context.userId);
    if (!canViewAllAttendance(me.role) && me.role !== "employee") return [];

    const people = canViewAllAttendance(me.role)
      ? await sql<ProfileRow>`
          select p.user_id, p.full_name, p.email, p.role, p.department_id, p.position, p.created_at,
                 d.name as department_name
          from profiles p
          left join departments d on d.id = p.department_id
          where p.role in ('admin', 'manager', 'employee')
          order by p.full_name
        `
      : await sql<ProfileRow>`
          select p.user_id, p.full_name, p.email, p.role, p.department_id, p.position, p.created_at,
                 d.name as department_name
          from profiles p
          left join departments d on d.id = p.department_id
          where p.user_id = ${context.userId}
        `;

    const shifts = await sql<ShiftRow>`
      select id, user_id, work_date, start_time, end_time, break_minutes, notes
      from shifts
      where work_date >= ${data.from}::date and work_date <= ${data.to}::date
    `;
    const att = await sql<AttRow>`
      select id, user_id, work_date, clock_in, clock_out, note
      from attendance
      where work_date >= ${data.from}::date and work_date <= ${data.to}::date
    `;

    const nowIso = new Date().toISOString();
    return people.map((p) => {
      const profile = mapProfile(p);
      const userShifts = shifts.filter((s) => s.user_id === p.user_id).map(mapShift);
      const userAtt = att.filter((a) => a.user_id === p.user_id).map(mapAttendance);
      const scheduledMinutes = userShifts.reduce(
        (acc, s) => acc + shiftMinutes(s.startTime, s.endTime, s.breakMinutes),
        0,
      );
      const workedMinutes = workedMinutesOf(userAtt, nowIso);
      let lateCount = 0;
      let absentCount = 0;
      const attDates = new Set(userAtt.map((a) => a.workDate));
      for (const s of userShifts) {
        const first = userAtt
          .filter((a) => a.workDate === s.workDate)
          .sort((a, b) => a.clockIn.localeCompare(b.clockIn))[0];
        if (!first) {
          if (s.workDate < zonedYmd()) absentCount += 1;
          continue;
        }
        const start = moscowInstant(s.workDate, s.startTime);
        if (new Date(first.clockIn).getTime() > start.getTime() + GRACE_MINUTES * 60_000) {
          lateCount += 1;
        }
      }
      return {
        profile,
        scheduledMinutes,
        workedMinutes,
        lateCount,
        absentCount,
        presentDays: attDates.size,
      };
    });
  });
