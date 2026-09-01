import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { h as mondayOf, l as formatDuration, n as addDays, o as canViewAllAttendance, x as zonedYmd } from "./time-C4zR4hs7.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as getReport, m as getMe, o as Skeleton, t as AppShell } from "./app-shell-C8UeNNPx.mjs";
import { t as Card } from "./card-DDD3sZCh.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-D3XVQTXe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const today = zonedYmd();
	const from = mondayOf(today);
	const to = addDays(from, 6);
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe()
	});
	const report = useQuery({
		queryKey: [
			"report",
			from,
			to
		],
		queryFn: () => getReport({ data: {
			from,
			to
		} })
	});
	const chart = (0, import_react.useMemo)(() => (report.data ?? []).map((r) => ({
		name: (r.profile.fullName || "Без имени").split(" ")[0],
		план: Math.round(r.scheduledMinutes / 60),
		факт: Math.round(r.workedMinutes / 60)
	})), [report.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: "Неделя"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl font-semibold tracking-tight",
				children: "Отчёт по часам"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					from.slice(8, 10),
					".",
					from.slice(5, 7),
					" — ",
					to.slice(8, 10),
					".",
					to.slice(5, 7),
					" · план против факта"
				]
			})
		]
	}), report.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 w-full rounded-xl" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [chart.length > 0 && canViewAllAttendance(me.data?.role ?? "employee") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: chart,
						barGap: 4,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false,
								unit: "ч"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-raised)",
								border: "1px solid var(--color-line)",
								borderRadius: 12,
								fontSize: 13
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "план",
								fill: "var(--color-line-strong)",
								radius: [
									4,
									4,
									0,
									0
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "факт",
								fill: "var(--color-pine)",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					})
				})
			})
		}), (report.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-8 text-sm text-muted",
			children: "За эту неделю данных ещё нет."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "overflow-hidden p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden grid-cols-[1.4fr_repeat(4,1fr)] border-b border-line px-4 py-2 text-xs font-medium tracking-wide text-muted uppercase md:grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Сотрудник" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "План" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Факт" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Опоздания" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Пропуски" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: (report.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "grid grid-cols-2 gap-2 border-b border-line px-4 py-3 last:border-0 md:grid-cols-[1.4fr_repeat(4,1fr)] md:items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: r.profile.fullName || "Без имени"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted md:hidden",
						children: r.profile.departmentName || r.profile.position || "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-sm tabular",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-2 text-muted md:hidden",
							children: "план "
						}), formatDuration(r.scheduledMinutes)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-sm tabular",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-2 text-muted md:hidden",
							children: "факт "
						}), formatDuration(r.workedMinutes)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-2 text-muted md:hidden",
							children: "опоздания "
						}), r.lateCount]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-2 text-muted md:hidden",
							children: "пропуски "
						}), r.absentCount]
					})
				]
			}, r.profile.userId)) })]
		})]
	})] });
}
//#endregion
export { ReportsPage as component };
