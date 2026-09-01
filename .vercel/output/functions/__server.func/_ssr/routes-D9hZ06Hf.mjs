import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { b as zonedHms, l as formatDuration, m as minutesBetween, o as canViewAllAttendance, p as isoToHm, s as formatDay, u as hhmm, v as weekdayLong } from "./time-C4zR4hs7.mjs";
import { a as LogOut, o as LogIn } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./label-Dgemp69d.mjs";
import { c as clockIn, l as clockOut, o as Skeleton, p as getDashboard, t as AppShell } from "./app-shell-C8UeNNPx.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DDD3sZCh.mjs";
import { t as Badge } from "./badge-Cx-peHFg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D9hZ06Hf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LABEL = {
	present: "На смене",
	late: "Опоздание",
	done: "Смена закрыта",
	absent: "Не отметился",
	off: "Выходной",
	planned: "Ожидается"
};
var TONE = {
	present: "present",
	late: "late",
	done: "pine",
	absent: "absent",
	off: "muted",
	planned: "warn"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: TONE[status],
		children: LABEL[status]
	});
}
function ClockCard({ data }) {
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const queryClient = useQueryClient();
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => window.clearInterval(id);
	}, []);
	const inMut = useMutation({
		mutationFn: () => clockIn({ data: {} }),
		onSuccess: () => {
			toast.success("Приход отмечен");
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			queryClient.invalidateQueries({ queryKey: ["attendance"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const outMut = useMutation({
		mutationFn: () => clockOut(),
		onSuccess: () => {
			toast.success("Уход отмечен");
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			queryClient.invalidateQueries({ queryKey: ["attendance"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const open = Boolean(data.openClockIn);
	const elapsed = data.openClockIn ? minutesBetween(data.openClockIn, now.toISOString()) : data.todaySessions.reduce((acc, s) => acc + minutesBetween(s.clockIn, s.clockOut ?? now.toISOString()), 0);
	const shift = data.todayShift;
	const status = open ? data.todaySessions[0] && shift && new Date(data.todaySessions[0].clockIn).getTime() > (/* @__PURE__ */ new Date(`${shift.workDate}T${shift.startTime.length === 5 ? shift.startTime + ":00" : shift.startTime.slice(0, 8)}+03:00`)).getTime() + 3e5 ? "late" : "present" : data.todaySessions.some((s) => s.clockOut) ? "done" : shift ? "planned" : "off";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "overflow-hidden p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: [
						weekdayLong(data.today),
						" · ",
						formatDay(data.today)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-mono text-5xl font-medium tracking-tight tabular sm:text-6xl",
					children: zonedHms(now)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status }), shift ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted",
						children: [
							"смена ",
							hhmm(shift.startTime),
							"–",
							hhmm(shift.endTime)
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: "на сегодня смена не назначена"
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-[200px] flex-col gap-3",
				children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "stamp",
					variant: "destructive",
					onClick: () => outMut.mutate(),
					disabled: outMut.isPending,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {}), outMut.isPending ? "Отмечаем…" : "Отметить уход"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "stamp",
					onClick: () => inMut.mutate(),
					disabled: inMut.isPending,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, {}), inMut.isPending ? "Отмечаем…" : "Отметить приход"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center font-mono text-sm text-muted tabular",
					children: [
						open ? "на смене " : "сегодня ",
						formatDuration(elapsed),
						data.openClockIn ? ` · с ${isoToHm(data.openClockIn)}` : null
					]
				})]
			})]
		})
	});
}
function Home() {
	const q = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => getDashboard()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: q.isPending || !q.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-48" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-xl" })
		]
	}) : q.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-absent",
		children: q.error.message
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardView, { data: q.data }) });
}
function DashboardView({ data }) {
	const staff = canViewAllAttendance(data.me.role);
	const present = data.team.filter((t) => t.status === "present" || t.status === "late").length;
	const late = data.team.filter((t) => t.status === "late").length;
	const absent = data.team.filter((t) => t.status === "absent").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: "Главная"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-1 font-display text-3xl font-semibold tracking-tight",
				children: ["Здравствуйте", data.me.fullName ? `, ${data.me.fullName.split(" ")[0]}` : ""]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClockCard, { data }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "План на неделю",
						value: formatDuration(data.weekScheduledMinutes)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Отработано",
						value: formatDuration(data.weekWorkedMinutes)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Разница",
						value: formatDuration(data.weekWorkedMinutes - data.weekScheduledMinutes)
					})
				]
			}),
			staff && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex-row items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Кто на месте" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"На смене ",
						present,
						late ? ` · опозданий ${late}` : "",
						absent ? ` · не отметились ${absent}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/team",
					className: "text-sm font-medium text-pine hover:underline",
					children: "Команда"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: data.team.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Пока никого нет. Сотрудники регистрируются сами — подтвердите их в «Команде»."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col",
				children: data.team.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex min-h-14 items-center justify-between gap-3 border-b border-line py-2 last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium",
							children: row.profile.fullName || row.profile.email || "Без имени"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								row.shift ? `${hhmm(row.shift.startTime)}–${hhmm(row.shift.endTime)}` : "выходной",
								row.clockIn ? ` · приход ${isoToHm(row.clockIn)}` : "",
								row.clockOut ? ` · уход ${isoToHm(row.clockOut)}` : ""
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: row.status })]
				}, row.profile.userId))
			}) })] })
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-mono text-xl font-medium tabular",
			children: value
		})]
	});
}
//#endregion
export { Home as component };
