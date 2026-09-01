import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { h as mondayOf, l as formatDuration, m as minutesBetween, n as addDays, o as canViewAllAttendance, p as isoToHm, s as formatDay, x as zonedYmd } from "./time-C4zR4hs7.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as listAttendance, m as getMe, o as Skeleton, t as AppShell, y as listTeam } from "./app-shell-C8UeNNPx.mjs";
import { t as Card } from "./card-DDD3sZCh.mjs";
import { t as SelectNative } from "./select-native-DZpc2Wns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attendance-D_vNywsE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AttendancePage() {
	const today = zonedYmd();
	const [from, setFrom] = (0, import_react.useState)(() => mondayOf(today));
	const to = (0, import_react.useMemo)(() => addDays(from, 6), [from]);
	const [userId, setUserId] = (0, import_react.useState)("");
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe()
	});
	const team = useQuery({
		queryKey: ["team"],
		queryFn: () => listTeam()
	});
	const staff = me.data ? canViewAllAttendance(me.data.role) : false;
	const att = useQuery({
		queryKey: [
			"attendance",
			from,
			to,
			userId
		],
		queryFn: () => listAttendance({ data: {
			from,
			to,
			userId: userId || void 0
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-5 flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted uppercase",
			children: "Фиксация"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl font-semibold tracking-tight",
			children: "Табель прихода"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectNative, {
				value: from,
				onChange: (e) => setFrom(e.target.value),
				children: [
					-2,
					-1,
					0,
					1
				].map((w) => {
					const m = addDays(mondayOf(today), w * 7);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: m,
						children: [
							"неделя с ",
							m.slice(8, 10),
							".",
							m.slice(5, 7)
						]
					}, m);
				})
			}), staff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectNative, {
				value: userId,
				onChange: (e) => setUserId(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Все сотрудники"
				}), (team.data ?? []).filter((p) => p.role !== "pending").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: p.userId,
					children: p.fullName || p.email || p.userId
				}, p.userId))]
			})]
		})]
	}), att.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 w-full rounded-xl" }) : !att.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-8 text-sm text-muted",
		children: "За эту неделю отметок нет. Приход и уход фиксируются на главной."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "overflow-hidden p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: att.data.map((row) => {
			const mins = minutesBetween(row.clockIn, row.clockOut ?? (/* @__PURE__ */ new Date()).toISOString());
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 last:border-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-medium",
					children: [row.fullName || "Сотрудник", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-sm font-normal text-muted",
						children: formatDay(row.workDate)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs text-muted tabular",
					children: [
						isoToHm(row.clockIn),
						" → ",
						row.clockOut ? isoToHm(row.clockOut) : "на смене",
						row.note ? ` · ${row.note}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-sm tabular",
					children: formatDuration(mins)
				})]
			}, row.id);
		}) })
	})] });
}
//#endregion
export { AttendancePage as component };
