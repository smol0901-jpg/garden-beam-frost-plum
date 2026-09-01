import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as formatDayShort, h as mondayOf, i as canManageSchedule, n as addDays, u as hhmm, x as zonedYmd, y as weekdayShort } from "./time-C4zR4hs7.mjs";
import { c as Copy, d as ChevronLeft, i as Trash2, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as cn, n as Input, r as Label, t as Button } from "./label-Dgemp69d.mjs";
import { a as DialogTitle, d as deleteShift, f as fillWeekdays, i as DialogDescription, m as getMe, n as Dialog, o as Skeleton, r as DialogContent, t as AppShell, u as copyWeek, v as listShifts, x as upsertShift, y as listTeam } from "./app-shell-C8UeNNPx.mjs";
import { t as SelectNative } from "./select-native-DZpc2Wns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schedule-CguQ9O9F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WeekBoard({ monday, onMondayChange, people, shifts, role, selfId }) {
	const days = (0, import_react.useMemo)(() => Array.from({ length: 7 }, (_, i) => addDays(monday, i)), [monday]);
	const today = zonedYmd();
	const manage = canManageSchedule(role);
	const queryClient = useQueryClient();
	const [edit, setEdit] = (0, import_react.useState)(null);
	const byKey = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const s of shifts) map.set(`${s.userId}:${s.workDate}`, s);
		return map;
	}, [shifts]);
	const copy = useMutation({
		mutationFn: () => copyWeek({ data: {
			fromMonday: addDays(monday, -7),
			toMonday: monday
		} }),
		onSuccess: (r) => {
			toast.success(r.copied ? `Скопировано смен: ${r.copied}` : "На прошлой неделе смен не было");
			queryClient.invalidateQueries({ queryKey: ["shifts"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const shownPeople = manage ? people : people.filter((p) => p.userId === selfId || p.role !== "pending");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								"aria-label": "Предыдущая неделя",
								onClick: () => onMondayChange(addDays(monday, -7)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => onMondayChange(mondayOf(zonedYmd())),
								children: "Сегодня"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								"aria-label": "Следующая неделя",
								onClick: () => onMondayChange(addDays(monday, 7)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-lg font-semibold",
						children: [
							formatDayShort(monday),
							" — ",
							formatDayShort(addDays(monday, 6))
						]
					}),
					manage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						className: "ml-auto",
						onClick: () => copy.mutate(),
						disabled: copy.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "С прошлой недели"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-card)] md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] border-collapse text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-line text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "w-44 px-4 py-3 text-xs font-medium tracking-wide text-muted uppercase",
							children: "Сотрудник"
						}), days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: cn("px-2 py-3 text-center text-xs font-medium", d === today ? "text-pine" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block uppercase",
								children: weekdayShort(d)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm tabular text-ink",
								children: formatDayShort(d)
							})]
						}, d))]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [shownPeople.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 8,
						className: "px-4 py-10 text-center text-muted",
						children: "Пока нет сотрудников. Подтвердите заявки в разделе «Команда»."
					}) }), shownPeople.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-line last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: p.fullName || "Без имени"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted",
								children: p.position || p.departmentName || "—"
							})]
						}), days.map((d) => {
							const shift = byKey.get(`${p.userId}:${d}`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: !manage,
									onClick: () => setEdit({
										userId: p.userId,
										date: d
									}),
									className: cn("flex min-h-12 w-full flex-col items-center justify-center rounded-lg px-1 py-2 text-xs", shift ? "bg-pine/8 font-mono tabular text-pine" : "text-subtle hover:bg-ink/5", manage && "cursor-pointer", d === today && "ring-1 ring-pine/25"),
									children: shift ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										hhmm(shift.startTime),
										"–",
										hhmm(shift.endTime)
									] }) : manage ? "назначить" : "—"
								})
							}, d);
						})]
					}, p.userId))] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3 md:hidden",
				children: days.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-3 shadow-[var(--shadow-card)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cn("text-sm font-medium", d === today ? "text-pine" : "text-ink"),
						children: [
							weekdayShort(d),
							" · ",
							formatDayShort(d)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex flex-col gap-1",
						children: shownPeople.map((p) => {
							const shift = byKey.get(`${p.userId}:${d}`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !manage,
								onClick: () => setEdit({
									userId: p.userId,
									date: d
								}),
								className: "flex min-h-11 w-full items-center justify-between rounded-lg px-2 text-sm hover:bg-ink/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: p.fullName || "Без имени"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs tabular text-pine",
									children: shift ? `${hhmm(shift.startTime)}–${hhmm(shift.endTime)}` : "—"
								})]
							}) }, p.userId);
						})
					})]
				}, d))
			}),
			edit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShiftDialog, {
				people,
				shift: byKey.get(`${edit.userId}:${edit.date}`) ?? null,
				userId: edit.userId,
				date: edit.date,
				monday,
				onClose: () => setEdit(null)
			})
		]
	});
}
function ShiftDialog({ people, shift, userId, date, monday, onClose }) {
	const queryClient = useQueryClient();
	const person = people.find((p) => p.userId === userId);
	const [start, setStart] = (0, import_react.useState)(hhmm(shift?.startTime ?? "09:00"));
	const [end, setEnd] = (0, import_react.useState)(hhmm(shift?.endTime ?? "18:00"));
	const [brk, setBrk] = (0, import_react.useState)(String(shift?.breakMinutes ?? 60));
	const [notes, setNotes] = (0, import_react.useState)(shift?.notes ?? "");
	const [who, setWho] = (0, import_react.useState)(userId);
	const save = useMutation({
		mutationFn: () => upsertShift({ data: {
			userId: who,
			workDate: date,
			startTime: start,
			endTime: end,
			breakMinutes: Number(brk) || 0,
			notes
		} }),
		onSuccess: () => {
			toast.success("Смена сохранена");
			queryClient.invalidateQueries({ queryKey: ["shifts"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	const fill = useMutation({
		mutationFn: () => fillWeekdays({ data: {
			userId: who,
			monday,
			startTime: start,
			endTime: end,
			breakMinutes: Number(brk) || 0
		} }),
		onSuccess: () => {
			toast.success("Пн–пт заполнены");
			queryClient.invalidateQueries({ queryKey: ["shifts"] });
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: () => deleteShift({ data: { id: shift.id } }),
		onSuccess: () => {
			toast.success("Смена удалена");
			queryClient.invalidateQueries({ queryKey: ["shifts"] });
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: shift ? "Смена" : "Назначить смену" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
				person?.fullName || "Сотрудник",
				" · ",
				formatDayShort(date)
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex flex-col gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "who",
							children: "Сотрудник"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectNative, {
							id: "who",
							value: who,
							onChange: (e) => setWho(e.target.value),
							children: people.filter((p) => p.role !== "pending").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.userId,
								children: p.fullName || p.email || p.userId
							}, p.userId))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "start",
								children: "Приход"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "start",
								type: "time",
								value: start,
								onChange: (e) => setStart(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "end",
								children: "Уход"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "end",
								type: "time",
								value: end,
								onChange: (e) => setEnd(e.target.value)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "brk",
							children: "Перерыв, мин"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "brk",
							type: "number",
							min: 0,
							max: 240,
							value: brk,
							onChange: (e) => setBrk(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "notes",
							children: "Заметка"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "notes",
							value: notes,
							onChange: (e) => setNotes(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: save.isPending,
						children: save.isPending ? "Сохраняем…" : "Сохранить"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: () => fill.mutate(),
						disabled: fill.isPending,
						children: "Заполнить пн–пт этими часами"
					}),
					shift && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "ghost",
						className: "text-absent",
						onClick: () => remove.mutate(),
						disabled: remove.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Удалить смену"]
					})
				]
			})
		] })
	});
}
function SchedulePage() {
	const [monday, setMonday] = (0, import_react.useState)(() => mondayOf(zonedYmd()));
	const to = (0, import_react.useMemo)(() => addDays(monday, 6), [monday]);
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe()
	});
	const team = useQuery({
		queryKey: ["team"],
		queryFn: () => listTeam()
	});
	const shifts = useQuery({
		queryKey: [
			"shifts",
			monday,
			to
		],
		queryFn: () => listShifts({ data: {
			from: monday,
			to
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: "Расписание"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl font-semibold tracking-tight",
				children: "График смен"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-sm text-muted",
				children: "Неделя с понедельника. Руководитель назначает смены, сотрудники видят своё расписание и команду."
			})
		]
	}), !me.data || shifts.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 w-full rounded-xl" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekBoard, {
		monday,
		onMondayChange: setMonday,
		people: (team.data ?? []).filter((p) => p.role !== "pending"),
		shifts: shifts.data ?? [],
		role: me.data.role,
		selfId: me.data.userId
	})] });
}
//#endregion
export { SchedulePage as component };
