import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-DKicHFvW.mjs";
import { _ as shiftMinutes, a as canManageTeam, f as isActiveRole, g as moscowInstant, h as mondayOf, i as canManageSchedule, m as minutesBetween, n as addDays, o as canViewAllAttendance, r as authMiddleware, x as zonedYmd } from "./time-C4zR4hs7.mjs";
import { cn as _enum, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-tKYpaEau.js
function asIso(value) {
	if (value instanceof Date) return value.toISOString();
	return String(value);
}
function asIsoOrNull(value) {
	if (value == null) return null;
	return asIso(value);
}
function mapProfile(row) {
	return {
		userId: row.user_id,
		fullName: row.full_name,
		email: row.email,
		role: row.role,
		departmentId: row.department_id,
		departmentName: row.department_name,
		position: row.position,
		createdAt: asIso(row.created_at)
	};
}
function mapShift(row) {
	return {
		id: row.id,
		userId: row.user_id,
		workDate: String(row.work_date).slice(0, 10),
		startTime: String(row.start_time),
		endTime: String(row.end_time),
		breakMinutes: Number(row.break_minutes),
		notes: row.notes
	};
}
function mapAttendance(row) {
	return {
		id: row.id,
		userId: row.user_id,
		workDate: String(row.work_date).slice(0, 10),
		clockIn: asIso(row.clock_in),
		clockOut: asIsoOrNull(row.clock_out),
		note: row.note,
		fullName: row.full_name
	};
}
async function loadProfile(sql, userId) {
	const rows = await sql`
    select p.user_id, p.full_name, p.email, p.role, p.department_id, p.position, p.created_at,
           d.name as department_name
    from profiles p
    left join departments d on d.id = p.department_id
    where p.user_id = ${userId}
  `;
	return rows[0] ? mapProfile(rows[0]) : null;
}
async function ensureProfile(sql, userId, name, email) {
	const existing = await loadProfile(sql, userId);
	if (existing) {
		if (name && !existing.fullName || email && !existing.email) {
			await sql`
        update profiles
        set full_name = case when full_name = '' then ${name ?? ""} else full_name end,
            email = coalesce(email, ${email ?? null})
        where user_id = ${userId}
      `;
			return await loadProfile(sql, userId) ?? existing;
		}
		return existing;
	}
	const role = ((await sql`
    select count(*)::int as n from profiles where role = 'admin'
  `)[0]?.n ?? 0) === 0 ? "admin" : "pending";
	await sql`
    insert into profiles (user_id, full_name, email, role)
    values (${userId}, ${name?.trim() || ""}, ${email ?? null}, ${role})
  `;
	const created = await loadProfile(sql, userId);
	if (!created) throw new Error("Не удалось создать профиль");
	return created;
}
async function requireProfile(sql, userId) {
	const p = await loadProfile(sql, userId);
	if (!p) throw new Error("Профиль не найден");
	return p;
}
function forbid() {
	throw new Error("Недостаточно прав");
}
var ensureMe_createServerFn_handler = createServerRpc({
	id: "068557b4a8a6e0497667098c3e6a0f2438f80f699e277cce97232788ce3b9512",
	name: "ensureMe",
	filename: "src/lib/api.ts"
}, (opts) => ensureMe.__executeServer(opts));
var ensureMe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	name: string().optional(),
	email: string().nullable().optional()
})).handler(ensureMe_createServerFn_handler, async ({ context, data }) => {
	return ensureProfile(await getSql(), context.userId, data.name, data.email);
});
var getMe_createServerFn_handler = createServerRpc({
	id: "4ca0e640a65ed12abad4b14cff9dab3700c6b87e68cdfb1ea5a507f52c4711c1",
	name: "getMe",
	filename: "src/lib/api.ts"
}, (opts) => getMe.__executeServer(opts));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMe_createServerFn_handler, async ({ context }) => {
	return ensureProfile(await getSql(), context.userId);
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "038dd137658e51afc70da5ff317a4196338c3c81c6258ef7dc08077c87ee87b2",
	name: "updateMyProfile",
	filename: "src/lib/api.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	fullName: string().min(1).max(120),
	position: string().max(80)
})).handler(updateMyProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	await sql`
      update profiles
      set full_name = ${data.fullName.trim()}, position = ${data.position.trim()}
      where user_id = ${context.userId}
    `;
	return requireProfile(sql, context.userId);
});
var listDepartments_createServerFn_handler = createServerRpc({
	id: "f835648f6d99557c4dc37c344a2de071b9ba7dcfe92b6202036b30383651a9db",
	name: "listDepartments",
	filename: "src/lib/api.ts"
}, (opts) => listDepartments.__executeServer(opts));
var listDepartments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listDepartments_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	return sql`select id, name from departments order by name`;
});
var addDepartment_createServerFn_handler = createServerRpc({
	id: "53472430131e9d523d46452b46f40346d50f0aff606cfb34e908c849aa10fcba",
	name: "addDepartment",
	filename: "src/lib/api.ts"
}, (opts) => addDepartment.__executeServer(opts));
var addDepartment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ name: string().min(1).max(60) })).handler(addDepartment_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const me = await ensureProfile(sql, context.userId);
	if (!canManageTeam(me.role)) forbid();
	await sql`insert into departments (name) values (${data.name.trim()}) on conflict (name) do nothing`;
	return sql`select id, name from departments order by name`;
});
var listTeam_createServerFn_handler = createServerRpc({
	id: "41daabd011c06c3aad70132712e9a8d530891d2612205cf78a4d994152ae5cf5",
	name: "listTeam",
	filename: "src/lib/api.ts"
}, (opts) => listTeam.__executeServer(opts));
var listTeam = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTeam_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const me = await ensureProfile(sql, context.userId);
	if (me.role === "pending") return [];
	const rows = await sql`
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
var updateMember_createServerFn_handler = createServerRpc({
	id: "e7661d4293974243c0086332089cb02d28937b9b2055a7461abd14c567d2c9a1",
	name: "updateMember",
	filename: "src/lib/api.ts"
}, (opts) => updateMember.__executeServer(opts));
var updateMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	role: _enum([
		"admin",
		"manager",
		"employee",
		"pending"
	]),
	departmentId: number().nullable(),
	position: string().max(80),
	fullName: string().max(120).optional()
})).handler(updateMember_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const me = await ensureProfile(sql, context.userId);
	if (!canManageTeam(me.role)) forbid();
	if (data.userId === me.userId && data.role !== "admin") {
		if (((await sql`
        select count(*)::int as n from profiles where role = 'admin' and user_id <> ${me.userId}
      `)[0]?.n ?? 0) === 0) throw new Error("Нельзя снять последнего администратора");
	}
	await sql`
      update profiles
      set role = ${data.role},
          department_id = ${data.departmentId},
          position = ${data.position.trim()},
          full_name = coalesce(nullif(${data.fullName?.trim() ?? ""}, ''), full_name)
      where user_id = ${data.userId}
    `;
	return { ok: true };
});
var listShifts_createServerFn_handler = createServerRpc({
	id: "f6000557ee53ee508cb8fe5fc3b19d742218e04eb6e0c1acebb7b1d2e6066bd8",
	name: "listShifts",
	filename: "src/lib/api.ts"
}, (opts) => listShifts.__executeServer(opts));
var listShifts = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	from: string(),
	to: string()
})).handler(listShifts_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await ensureProfile(sql, context.userId)).role === "pending") return [];
	return (await sql`
      select id, user_id, work_date, start_time, end_time, break_minutes, notes
      from shifts
      where work_date >= ${data.from}::date and work_date <= ${data.to}::date
      order by work_date, start_time
    `).map(mapShift);
});
var upsertShift_createServerFn_handler = createServerRpc({
	id: "e3cb57822fa21ff8a167fbc04dd8f490308c5b22ee06cc2aee09fbc6b1973f16",
	name: "upsertShift",
	filename: "src/lib/api.ts"
}, (opts) => upsertShift.__executeServer(opts));
var upsertShift = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	workDate: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	startTime: string().min(4),
	endTime: string().min(4),
	breakMinutes: number().int().min(0).max(240),
	notes: string().max(200).optional()
})).handler(upsertShift_createServerFn_handler, async ({ context, data }) => {
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
var deleteShift_createServerFn_handler = createServerRpc({
	id: "b4fba57df63391caac40bbb6f7001bade274d232d590f123e6b0d8abe588ca46",
	name: "deleteShift",
	filename: "src/lib/api.ts"
}, (opts) => deleteShift.__executeServer(opts));
var deleteShift = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number().int() })).handler(deleteShift_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const me = await ensureProfile(sql, context.userId);
	if (!canManageSchedule(me.role)) forbid();
	await sql`delete from shifts where id = ${data.id}`;
	return { ok: true };
});
var copyWeek_createServerFn_handler = createServerRpc({
	id: "a805410195a4b1144d20ad6ae00f81c5896dd5707a4eaea1db640c8ef08521c4",
	name: "copyWeek",
	filename: "src/lib/api.ts"
}, (opts) => copyWeek.__executeServer(opts));
var copyWeek = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	fromMonday: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	toMonday: string().regex(/^\d{4}-\d{2}-\d{2}$/)
})).handler(copyWeek_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const me = await ensureProfile(sql, context.userId);
	if (!canManageSchedule(me.role)) forbid();
	const fromEnd = addDays(data.fromMonday, 6);
	const source = await sql`
      select id, user_id, work_date, start_time, end_time, break_minutes, notes
      from shifts
      where work_date >= ${data.fromMonday}::date and work_date <= ${fromEnd}::date
    `;
	let copied = 0;
	for (const row of source) {
		const ymd = String(row.work_date).slice(0, 10);
		const offset = (Date.parse(`${ymd}T00:00:00Z`) - Date.parse(`${data.fromMonday}T00:00:00Z`)) / 864e5;
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
var fillWeekdays_createServerFn_handler = createServerRpc({
	id: "4d26cefaad5f3a918d7a35845beabe541ba81472f0401d94d1f139a45e7ecd5b",
	name: "fillWeekdays",
	filename: "src/lib/api.ts"
}, (opts) => fillWeekdays.__executeServer(opts));
var fillWeekdays = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	monday: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	startTime: string().min(4),
	endTime: string().min(4),
	breakMinutes: number().int().min(0).max(240)
})).handler(fillWeekdays_createServerFn_handler, async ({ context, data }) => {
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
var clockIn_createServerFn_handler = createServerRpc({
	id: "fba0a5c8c2933f644512bc63c8dbf9e36c85637e13529fc8f48b45f1e2e94f16",
	name: "clockIn",
	filename: "src/lib/api.ts"
}, (opts) => clockIn.__executeServer(opts));
var clockIn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ note: string().max(200).optional() })).handler(clockIn_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const me = await ensureProfile(sql, context.userId);
	if (!isActiveRole(me.role)) throw new Error("Дождитесь подтверждения администратора");
	if ((await sql`
      select id from attendance where user_id = ${context.userId} and clock_out is null limit 1
    `)[0]) throw new Error("Вы уже отметили приход");
	const today = zonedYmd();
	await sql`
      insert into attendance (user_id, work_date, clock_in, note)
      values (${context.userId}, ${today}::date, now(), ${data.note?.trim() ?? ""})
    `;
	return {
		ok: true,
		at: (/* @__PURE__ */ new Date()).toISOString()
	};
});
var clockOut_createServerFn_handler = createServerRpc({
	id: "c0c5728fd9f931719a4178e71e446c9d0d7993566503e9707871217af5b1f0bc",
	name: "clockOut",
	filename: "src/lib/api.ts"
}, (opts) => clockOut.__executeServer(opts));
var clockOut = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(clockOut_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const me = await ensureProfile(sql, context.userId);
	if (!isActiveRole(me.role)) throw new Error("Дождитесь подтверждения администратора");
	const open = await sql`
      select id from attendance
      where user_id = ${context.userId} and clock_out is null
      order by clock_in desc
      limit 1
    `;
	if (!open[0]) throw new Error("Нет открытой смены");
	await sql`update attendance set clock_out = now() where id = ${open[0].id} and user_id = ${context.userId}`;
	return {
		ok: true,
		at: (/* @__PURE__ */ new Date()).toISOString()
	};
});
var listAttendance_createServerFn_handler = createServerRpc({
	id: "48df56e5fb505cf5b1bea4eaa2a9c62dc477b9a06b0fc0acfc36e90332670601",
	name: "listAttendance",
	filename: "src/lib/api.ts"
}, (opts) => listAttendance.__executeServer(opts));
var listAttendance = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	from: string(),
	to: string(),
	userId: string().optional()
})).handler(listAttendance_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const me = await ensureProfile(sql, context.userId);
	if (me.role === "pending") return [];
	const target = data.userId && canViewAllAttendance(me.role) ? data.userId : context.userId;
	return (canViewAllAttendance(me.role) && !data.userId ? await sql`
          select a.id, a.user_id, a.work_date, a.clock_in, a.clock_out, a.note, p.full_name
          from attendance a
          join profiles p on p.user_id = a.user_id
          where a.work_date >= ${data.from}::date and a.work_date <= ${data.to}::date
          order by a.clock_in desc
        ` : await sql`
          select a.id, a.user_id, a.work_date, a.clock_in, a.clock_out, a.note, p.full_name
          from attendance a
          join profiles p on p.user_id = a.user_id
          where a.user_id = ${target}
            and a.work_date >= ${data.from}::date
            and a.work_date <= ${data.to}::date
          order by a.clock_in desc
        `).map(mapAttendance);
});
function statusOf(args) {
	const { shift, clockIn, clockOut, now, today } = args;
	if (clockOut) return "done";
	if (clockIn) {
		if (shift) {
			const lateMs = moscowInstant(shift.workDate, shift.startTime).getTime() + 3e5;
			if (new Date(clockIn).getTime() > lateMs) return "late";
		}
		return "present";
	}
	if (!shift) return "off";
	if (today < shift.workDate) return "planned";
	const start = moscowInstant(shift.workDate, shift.startTime);
	if (now.getTime() > start.getTime() + 3e5) return "absent";
	return "planned";
}
function workedMinutesOf(sessions, nowIso) {
	let total = 0;
	for (const s of sessions) total += minutesBetween(s.clockIn, s.clockOut ?? nowIso);
	return total;
}
var getDashboard_createServerFn_handler = createServerRpc({
	id: "9702758c6fd0cb855b9213cc5e565c91c6cccffe5c6a276226117b92c405025e",
	name: "getDashboard",
	filename: "src/lib/api.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const me = await ensureProfile(sql, context.userId);
	const today = zonedYmd();
	const weekStart = mondayOf(today);
	const weekEnd = addDays(weekStart, 6);
	const now = /* @__PURE__ */ new Date();
	const nowIso = now.toISOString();
	const myShiftRows = await sql`
      select id, user_id, work_date, start_time, end_time, break_minutes, notes
      from shifts where user_id = ${context.userId} and work_date = ${today}::date
    `;
	const todayShift = myShiftRows[0] ? mapShift(myShiftRows[0]) : null;
	const todaySessions = (await sql`
      select id, user_id, work_date, clock_in, clock_out, note
      from attendance
      where user_id = ${context.userId} and work_date = ${today}::date
      order by clock_in
    `).map(mapAttendance);
	const open = todaySessions.find((s) => !s.clockOut);
	const weekShifts = await sql`
      select id, user_id, work_date, start_time, end_time, break_minutes, notes
      from shifts
      where user_id = ${context.userId}
        and work_date >= ${weekStart}::date
        and work_date <= ${weekEnd}::date
    `;
	const weekAtt = await sql`
      select id, user_id, work_date, clock_in, clock_out, note
      from attendance
      where user_id = ${context.userId}
        and work_date >= ${weekStart}::date
        and work_date <= ${weekEnd}::date
    `;
	const weekScheduledMinutes = weekShifts.map(mapShift).reduce((acc, s) => acc + shiftMinutes(s.startTime, s.endTime, s.breakMinutes), 0);
	const weekWorkedMinutes = workedMinutesOf(weekAtt.map(mapAttendance), nowIso);
	let team = [];
	if (canViewAllAttendance(me.role)) {
		const people = await sql`
        select p.user_id, p.full_name, p.email, p.role, p.department_id, p.position, p.created_at,
               d.name as department_name
        from profiles p
        left join departments d on d.id = p.department_id
        where p.role in ('admin', 'manager', 'employee')
        order by p.full_name
      `;
		const shiftsToday = await sql`
        select id, user_id, work_date, start_time, end_time, break_minutes, notes
        from shifts where work_date = ${today}::date
      `;
		const attToday = await sql`
        select id, user_id, work_date, clock_in, clock_out, note
        from attendance where work_date = ${today}::date
        order by clock_in
      `;
		const shiftByUser = new Map(shiftsToday.map((s) => [s.user_id, mapShift(s)]));
		const attByUser = /* @__PURE__ */ new Map();
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
			const clockOut = sessions.find((s) => !s.clockOut) ? null : last?.clockOut ?? null;
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
					today
				}),
				workedMinutes: workedMinutesOf(sessions, nowIso)
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
		weekWorkedMinutes
	};
});
var getReport_createServerFn_handler = createServerRpc({
	id: "ddeb4888f85c2cba6c86762939f9d40025f63fea7b0a7c5ed76371dfbb9fd383",
	name: "getReport",
	filename: "src/lib/api.ts"
}, (opts) => getReport.__executeServer(opts));
var getReport = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	from: string(),
	to: string()
})).handler(getReport_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const me = await ensureProfile(sql, context.userId);
	if (!canViewAllAttendance(me.role) && me.role !== "employee") return [];
	const people = canViewAllAttendance(me.role) ? await sql`
          select p.user_id, p.full_name, p.email, p.role, p.department_id, p.position, p.created_at,
                 d.name as department_name
          from profiles p
          left join departments d on d.id = p.department_id
          where p.role in ('admin', 'manager', 'employee')
          order by p.full_name
        ` : await sql`
          select p.user_id, p.full_name, p.email, p.role, p.department_id, p.position, p.created_at,
                 d.name as department_name
          from profiles p
          left join departments d on d.id = p.department_id
          where p.user_id = ${context.userId}
        `;
	const shifts = await sql`
      select id, user_id, work_date, start_time, end_time, break_minutes, notes
      from shifts
      where work_date >= ${data.from}::date and work_date <= ${data.to}::date
    `;
	const att = await sql`
      select id, user_id, work_date, clock_in, clock_out, note
      from attendance
      where work_date >= ${data.from}::date and work_date <= ${data.to}::date
    `;
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	return people.map((p) => {
		const profile = mapProfile(p);
		const userShifts = shifts.filter((s) => s.user_id === p.user_id).map(mapShift);
		const userAtt = att.filter((a) => a.user_id === p.user_id).map(mapAttendance);
		const scheduledMinutes = userShifts.reduce((acc, s) => acc + shiftMinutes(s.startTime, s.endTime, s.breakMinutes), 0);
		const workedMinutes = workedMinutesOf(userAtt, nowIso);
		let lateCount = 0;
		let absentCount = 0;
		const attDates = new Set(userAtt.map((a) => a.workDate));
		for (const s of userShifts) {
			const first = userAtt.filter((a) => a.workDate === s.workDate).sort((a, b) => a.clockIn.localeCompare(b.clockIn))[0];
			if (!first) {
				if (s.workDate < zonedYmd()) absentCount += 1;
				continue;
			}
			const start = moscowInstant(s.workDate, s.startTime);
			if (new Date(first.clockIn).getTime() > start.getTime() + 3e5) lateCount += 1;
		}
		return {
			profile,
			scheduledMinutes,
			workedMinutes,
			lateCount,
			absentCount,
			presentDays: attDates.size
		};
	});
});
//#endregion
export { addDepartment_createServerFn_handler, clockIn_createServerFn_handler, clockOut_createServerFn_handler, copyWeek_createServerFn_handler, deleteShift_createServerFn_handler, ensureMe_createServerFn_handler, fillWeekdays_createServerFn_handler, getDashboard_createServerFn_handler, getMe_createServerFn_handler, getReport_createServerFn_handler, listAttendance_createServerFn_handler, listDepartments_createServerFn_handler, listShifts_createServerFn_handler, listTeam_createServerFn_handler, updateMember_createServerFn_handler, updateMyProfile_createServerFn_handler, upsertShift_createServerFn_handler };
