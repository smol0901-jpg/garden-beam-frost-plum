import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as canManageTeam, d as initials, t as ROLE_LABEL } from "./time-C4zR4hs7.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Input, r as Label, t as Button } from "./label-Dgemp69d.mjs";
import { _ as listDepartments, a as DialogTitle, b as updateMember, i as DialogDescription, m as getMe, n as Dialog, o as Skeleton, r as DialogContent, s as addDepartment, t as AppShell, y as listTeam } from "./app-shell-C8UeNNPx.mjs";
import { t as Card } from "./card-DDD3sZCh.mjs";
import { t as SelectNative } from "./select-native-DZpc2Wns.mjs";
import { t as Badge } from "./badge-Cx-peHFg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/team-DA8O_e4f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamPage() {
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe()
	});
	const team = useQuery({
		queryKey: ["team"],
		queryFn: () => listTeam()
	});
	const deps = useQuery({
		queryKey: ["departments"],
		queryFn: () => listDepartments()
	});
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [depName, setDepName] = (0, import_react.useState)("");
	const queryClient = useQueryClient();
	const addDep = useMutation({
		mutationFn: () => addDepartment({ data: { name: depName } }),
		onSuccess: () => {
			setDepName("");
			toast.success("Отдел добавлен");
			queryClient.invalidateQueries({ queryKey: ["departments"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (me.data && !canManageTeam(me.data.role)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" }) });
	const pending = (team.data ?? []).filter((p) => p.role === "pending");
	const active = (team.data ?? []).filter((p) => p.role !== "pending");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "Роли"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl font-semibold tracking-tight",
					children: "Команда"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm text-muted",
					children: "Подтверждайте новых сотрудников и назначайте роли: администратор, руководитель или сотрудник."
				})
			]
		}),
		team.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-xl" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-8",
			children: [
				pending.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "Ожидают подтверждения"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: pending.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonCard, {
						person: p,
						onEdit: () => setEdit(p)
					}, p.userId))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "Сотрудники"
				}), active.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "mt-3 p-6 text-sm text-muted",
					children: "Пока только вы. Попросите коллег зарегистрироваться — они появятся в списке ожидания."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: active.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonCard, {
						person: p,
						onEdit: () => setEdit(p)
					}, p.userId))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Отделы"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: (deps.data ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: d.name }, d.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 flex max-w-md gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							if (depName.trim()) addDep.mutate();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: depName,
							onChange: (e) => setDepName(e.target.value),
							placeholder: "Новый отдел"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							disabled: addDep.isPending,
							children: "Добавить"
						})]
					})
				] })
			]
		}),
		edit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberDialog, {
			person: edit,
			departments: deps.data ?? [],
			onClose: () => setEdit(null)
		})
	] });
}
function PersonCard({ person, onEdit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onEdit,
		className: "flex min-h-20 w-full items-center gap-3 rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-card)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-11 shrink-0 place-items-center rounded-full bg-pine text-sm font-semibold text-pine-fg",
				children: initials(person.fullName || person.email || "?")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate font-medium",
					children: person.fullName || "Без имени"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "block truncate text-xs text-muted",
					children: [person.email || "нет email", person.position ? ` · ${person.position}` : ""]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: person.role === "pending" ? "warn" : "pine",
				children: ROLE_LABEL[person.role]
			})
		]
	}) });
}
function MemberDialog({ person, departments, onClose }) {
	const queryClient = useQueryClient();
	const [role, setRole] = (0, import_react.useState)(person.role === "pending" ? "employee" : person.role);
	const [departmentId, setDepartmentId] = (0, import_react.useState)(person.departmentId ? String(person.departmentId) : "");
	const [position, setPosition] = (0, import_react.useState)(person.position);
	const [fullName, setFullName] = (0, import_react.useState)(person.fullName);
	const save = useMutation({
		mutationFn: () => updateMember({ data: {
			userId: person.userId,
			role,
			departmentId: departmentId ? Number(departmentId) : null,
			position,
			fullName
		} }),
		onSuccess: () => {
			toast.success("Сотрудник обновлён");
			queryClient.invalidateQueries({ queryKey: ["team"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Карточка сотрудника" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: person.email || person.userId }),
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
							htmlFor: "mn",
							children: "Имя"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "mn",
							value: fullName,
							onChange: (e) => setFullName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "role",
							children: "Роль"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectNative, {
							id: "role",
							value: role,
							onChange: (e) => setRole(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "employee",
									children: "Сотрудник — график и свой приход"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "manager",
									children: "Руководитель — график и табель команды"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "admin",
									children: "Администратор — роли и отделы"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pending",
									children: "Ожидает"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "dep",
							children: "Отдел"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectNative, {
							id: "dep",
							value: departmentId,
							onChange: (e) => setDepartmentId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Без отдела"
							}), departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d.id,
								children: d.name
							}, d.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "pos",
							children: "Должность"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "pos",
							value: position,
							onChange: (e) => setPosition(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: save.isPending,
						children: save.isPending ? "Сохраняем…" : "Сохранить"
					})
				]
			})
		] })
	});
}
//#endregion
export { TeamPage as component };
