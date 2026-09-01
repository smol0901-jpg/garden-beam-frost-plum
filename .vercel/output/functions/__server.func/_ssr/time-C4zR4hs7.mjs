import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/time-C4zR4hs7.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-B40BzJxt.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-XSwBq3J2.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var ROLE_LABEL = {
	admin: "Администратор",
	manager: "Руководитель",
	employee: "Сотрудник",
	pending: "Ожидает"
};
function canManageTeam(role) {
	return role === "admin";
}
function canManageSchedule(role) {
	return role === "admin" || role === "manager";
}
function canViewAllAttendance(role) {
	return role === "admin" || role === "manager";
}
function isActiveRole(role) {
	return role !== "pending";
}
/** Organization clock — Moscow, no DST. */
var ORG_TZ = "Europe/Moscow";
var MOSCOW_OFFSET = "+03:00";
function zonedYmd(date = /* @__PURE__ */ new Date(), timeZone = ORG_TZ) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(date);
	const pick = (t) => parts.find((p) => p.type === t)?.value ?? "00";
	return `${pick("year")}-${pick("month")}-${pick("day")}`;
}
function zonedHm(date = /* @__PURE__ */ new Date(), timeZone = ORG_TZ) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	}).formatToParts(date);
	const pick = (t) => parts.find((p) => p.type === t)?.value ?? "00";
	return `${pick("hour")}:${pick("minute")}`;
}
function zonedHms(date = /* @__PURE__ */ new Date(), timeZone = ORG_TZ) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	}).formatToParts(date);
	const pick = (t) => parts.find((p) => p.type === t)?.value ?? "00";
	return `${pick("hour")}:${pick("minute")}:${pick("second")}`;
}
function parseHm(value) {
	const [h, m] = value.split(":").map((n) => Number(n));
	return [h || 0, m || 0];
}
function hhmm(value) {
	if (!value) return "—";
	return value.slice(0, 5);
}
/** Interpret a civil date + clock time as an instant in Moscow. */
function moscowInstant(ymd, hm) {
	const time = hm.length >= 8 ? hm.slice(0, 8) : `${hm.slice(0, 5)}:00`;
	return /* @__PURE__ */ new Date(`${ymd}T${time}${MOSCOW_OFFSET}`);
}
function addDays(ymd, days) {
	const [y, m, d] = ymd.split("-").map(Number);
	const dt = new Date(Date.UTC(y, m - 1, d + days));
	return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}
/** Monday of the week containing ymd (ISO, week starts Monday). */
function mondayOf(ymd) {
	const [y, m, d] = ymd.split("-").map(Number);
	const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
	return addDays(ymd, day === 0 ? -6 : 1 - day);
}
function shiftMinutes(start, end, breakMin) {
	const [sh, sm] = parseHm(start);
	const [eh, em] = parseHm(end);
	let mins = eh * 60 + em - (sh * 60 + sm);
	if (mins < 0) mins += 1440;
	return Math.max(0, mins - Math.max(0, breakMin));
}
function minutesBetween(aIso, bIso) {
	const a = new Date(aIso).getTime();
	const b = new Date(bIso).getTime();
	if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
	return Math.max(0, Math.round((b - a) / 6e4));
}
function formatDuration(mins) {
	const sign = mins < 0 ? "−" : "";
	const abs = Math.abs(Math.round(mins));
	const h = Math.floor(abs / 60);
	const m = abs % 60;
	if (h === 0) return `${sign}${m} мин`;
	if (m === 0) return `${sign}${h} ч`;
	return `${sign}${h} ч ${m} мин`;
}
function weekdayShort(ymd) {
	const names = [
		"вс",
		"пн",
		"вт",
		"ср",
		"чт",
		"пт",
		"сб"
	];
	const [y, m, d] = ymd.split("-").map(Number);
	return names[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}
function weekdayLong(ymd) {
	const names = [
		"воскресенье",
		"понедельник",
		"вторник",
		"среда",
		"четверг",
		"пятница",
		"суббота"
	];
	const [y, m, d] = ymd.split("-").map(Number);
	return names[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}
function formatDay(ymd) {
	const [y, m, d] = ymd.split("-").map(Number);
	return `${d} ${[
		"января",
		"февраля",
		"марта",
		"апреля",
		"мая",
		"июня",
		"июля",
		"августа",
		"сентября",
		"октября",
		"ноября",
		"декабря"
	][m - 1]} ${y}`;
}
function formatDayShort(ymd) {
	const [, m, d] = ymd.split("-");
	return `${d}.${m}`;
}
function isoToHm(iso) {
	return zonedHm(new Date(iso));
}
function initials(name) {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
//#endregion
export { shiftMinutes as _, canManageTeam as a, zonedHms as b, formatDayShort as c, initials as d, isActiveRole as f, moscowInstant as g, mondayOf as h, canManageSchedule as i, formatDuration as l, minutesBetween as m, addDays as n, canViewAllAttendance as o, isoToHm as p, authMiddleware as r, formatDay as s, ROLE_LABEL as t, hhmm as u, weekdayLong as v, zonedYmd as x, weekdayShort as y };
