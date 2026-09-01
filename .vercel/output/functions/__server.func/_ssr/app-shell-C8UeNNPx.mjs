import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as canManageTeam, d as initials, f as isActiveRole, o as canViewAllAttendance, r as authMiddleware, t as ROLE_LABEL } from "./time-C4zR4hs7.mjs";
import { cn as _enum, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { a as LogOut, f as ChartColumn, l as ClipboardList, n as Users, p as CalendarDays, s as LayoutDashboard, t as X } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as createSsrRpc } from "./router-sIs1kd-L.mjs";
import { a as useCurrentUserState, i as cn, n as Input, r as Label, t as Button } from "./label-Dgemp69d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-C8UeNNPx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
var ensureMe = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	name: string().optional(),
	email: string().nullable().optional()
})).handler(createSsrRpc("068557b4a8a6e0497667098c3e6a0f2438f80f699e277cce97232788ce3b9512"));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4ca0e640a65ed12abad4b14cff9dab3700c6b87e68cdfb1ea5a507f52c4711c1"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	fullName: string().min(1).max(120),
	position: string().max(80)
})).handler(createSsrRpc("038dd137658e51afc70da5ff317a4196338c3c81c6258ef7dc08077c87ee87b2"));
var listDepartments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f835648f6d99557c4dc37c344a2de071b9ba7dcfe92b6202036b30383651a9db"));
var addDepartment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ name: string().min(1).max(60) })).handler(createSsrRpc("53472430131e9d523d46452b46f40346d50f0aff606cfb34e908c849aa10fcba"));
var listTeam = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("41daabd011c06c3aad70132712e9a8d530891d2612205cf78a4d994152ae5cf5"));
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
})).handler(createSsrRpc("e7661d4293974243c0086332089cb02d28937b9b2055a7461abd14c567d2c9a1"));
var listShifts = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	from: string(),
	to: string()
})).handler(createSsrRpc("f6000557ee53ee508cb8fe5fc3b19d742218e04eb6e0c1acebb7b1d2e6066bd8"));
var upsertShift = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	workDate: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	startTime: string().min(4),
	endTime: string().min(4),
	breakMinutes: number().int().min(0).max(240),
	notes: string().max(200).optional()
})).handler(createSsrRpc("e3cb57822fa21ff8a167fbc04dd8f490308c5b22ee06cc2aee09fbc6b1973f16"));
var deleteShift = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number().int() })).handler(createSsrRpc("b4fba57df63391caac40bbb6f7001bade274d232d590f123e6b0d8abe588ca46"));
var copyWeek = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	fromMonday: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	toMonday: string().regex(/^\d{4}-\d{2}-\d{2}$/)
})).handler(createSsrRpc("a805410195a4b1144d20ad6ae00f81c5896dd5707a4eaea1db640c8ef08521c4"));
var fillWeekdays = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	monday: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	startTime: string().min(4),
	endTime: string().min(4),
	breakMinutes: number().int().min(0).max(240)
})).handler(createSsrRpc("4d26cefaad5f3a918d7a35845beabe541ba81472f0401d94d1f139a45e7ecd5b"));
var clockIn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ note: string().max(200).optional() })).handler(createSsrRpc("fba0a5c8c2933f644512bc63c8dbf9e36c85637e13529fc8f48b45f1e2e94f16"));
var clockOut = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("c0c5728fd9f931719a4178e71e446c9d0d7993566503e9707871217af5b1f0bc"));
var listAttendance = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	from: string(),
	to: string(),
	userId: string().optional()
})).handler(createSsrRpc("48df56e5fb505cf5b1bea4eaa2a9c62dc477b9a06b0fc0acfc36e90332670601"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9702758c6fd0cb855b9213cc5e565c91c6cccffe5c6a276226117b92c405025e"));
var getReport = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	from: string(),
	to: string()
})).handler(createSsrRpc("ddeb4888f85c2cba6c86762939f9d40025f63fea7b0a7c5ed76371dfbb9fd383"));
var Dialog = Dialog$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in data-[state=closed]:animate-out", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-raised p-5 shadow-[var(--shadow-card)]", "focus:outline-none", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3.5 right-3.5 grid size-9 place-items-center rounded-lg text-muted hover:bg-ink/5 hover:text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Закрыть"
			})]
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-semibold tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("mt-1 text-sm text-muted", className),
		...props
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-lg bg-ink/8", className),
		...props
	});
}
var NAV = [
	{
		to: "/",
		label: "Главная",
		icon: LayoutDashboard,
		staff: false
	},
	{
		to: "/schedule",
		label: "График",
		icon: CalendarDays,
		staff: false
	},
	{
		to: "/attendance",
		label: "Табель",
		icon: ClipboardList,
		staff: false
	},
	{
		to: "/team",
		label: "Команда",
		icon: Users,
		staff: true,
		admin: true
	},
	{
		to: "/reports",
		label: "Отчёт",
		icon: ChartColumn,
		staff: true
	}
];
function AppShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const queryClient = useQueryClient();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		ensureMe({ data: {
			name: user.displayName ?? "",
			email: user.primaryEmail
		} }).then(() => queryClient.invalidateQueries({ queryKey: ["me"] }));
	}, [user, queryClient]);
	const meQuery = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "paper-grain min-h-dvh px-4 py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 w-full rounded-xl" })]
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const me = meQuery.data;
	const role = me?.role ?? "pending";
	if (meQuery.error instanceof Error && meQuery.error.message === "Unauthorized") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (meQuery.isPending && !me) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "paper-grain min-h-dvh px-4 py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 w-full rounded-xl" })]
		})
	});
	if (me && !isActiveRole(me.role)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingScreen, {
		name: me.fullName || user.displayName || user.primaryEmail || "Сотрудник",
		signingOut,
		onSignOut: () => {
			setSigningOut(true);
			signOut().catch(() => setSigningOut(false));
		}
	});
	const visibleNav = NAV.filter((item) => {
		if ("admin" in item && item.admin) return canManageTeam(role);
		if (item.staff) return canViewAllAttendance(role);
		return true;
	});
	const displayName = me?.fullName || user.displayName || "Сотрудник";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper-grain min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-line px-4 py-6 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-8 flex flex-col gap-1",
						children: visibleNav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
							...item,
							active: pathname === item.to
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-auto pt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountChip, {
							name: displayName,
							role,
							onProfile: () => setProfileOpen(true),
							signingOut,
							onSignOut: () => {
								setSigningOut(true);
								signOut().catch(() => setSigningOut(false));
							}
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setProfileOpen(true),
							className: "grid size-11 place-items-center rounded-full bg-pine text-sm font-semibold text-pine-fg",
							children: initials(displayName)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 px-4 py-5 pb-24 md:px-8 md:py-8 md:pb-8",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto grid max-w-6xl",
							style: { gridTemplateColumns: `repeat(${visibleNav.length}, minmax(0, 1fr))` },
							children: visibleNav.map((item) => {
								const Icon = item.icon;
								const active = pathname === item.to;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: item.to,
									className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-pine" : "text-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-5",
										strokeWidth: active ? 2.2 : 1.8
									}), item.label]
								}, item.to);
							})
						})
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileDialog, {
			open: profileOpen,
			onOpenChange: setProfileOpen,
			name: me?.fullName || displayName,
			position: me?.position ?? "",
			onSignOut: () => {
				setSigningOut(true);
				signOut().catch(() => setSigningOut(false));
			},
			signingOut
		})]
	});
}
function Brand({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-9 place-items-center rounded-[10px] bg-pine text-pine-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StampMark, {})
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "leading-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-display text-lg font-semibold tracking-tight",
					children: "Смена"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[11px] text-muted",
					children: "табель и график"
				})]
			}),
			compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-lg font-semibold tracking-tight",
				children: "Смена"
			})
		]
	});
}
function StampMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5",
		fill: "none",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "8.2",
			stroke: "currentColor",
			strokeWidth: "1.7"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M12 7.5v5l3.2 2",
			stroke: "currentColor",
			strokeWidth: "1.7",
			strokeLinecap: "round"
		})]
	});
}
function NavLink({ to, label, icon: Icon, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex h-11 items-center gap-2.5 rounded-[10px] px-3 text-sm font-medium transition-colors duration-150", active ? "bg-pine text-pine-fg" : "text-ink/80 hover:bg-ink/5"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), label]
	});
}
function AccountChip({ name, role, onProfile, onSignOut, signingOut }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-raised p-3 shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onProfile,
			className: "flex w-full items-center gap-2.5 text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-9 shrink-0 place-items-center rounded-full bg-pine text-xs font-semibold text-pine-fg",
				children: initials(name)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-sm font-medium",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[11px] text-muted",
					children: ROLE_LABEL[role]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onSignOut,
			disabled: signingOut,
			className: "mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-muted hover:bg-ink/5 hover:text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), signingOut ? "Выходим…" : "Выйти"]
		})]
	});
}
function PendingScreen({ name, onSignOut, signingOut }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "paper-grain grid min-h-dvh place-items-center px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl bg-surface p-7 shadow-[var(--shadow-card)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-8 font-display text-3xl font-semibold tracking-tight",
					children: "Ожидание доступа"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-muted",
					children: [name, ", аккаунт создан. Администратор должен подтвердить вас в разделе «Команда» и назначить роль — после этого откроются график и отметка прихода."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "mt-6 w-full",
					onClick: onSignOut,
					disabled: signingOut,
					children: signingOut ? "Выходим…" : "Выйти"
				})
			]
		})
	});
}
function ProfileDialog({ open, onOpenChange, name, position, onSignOut, signingOut }) {
	const queryClient = useQueryClient();
	const [fullName, setFullName] = (0, import_react.useState)(name);
	const [pos, setPos] = (0, import_react.useState)(position);
	(0, import_react.useEffect)(() => {
		setFullName(name);
		setPos(position);
	}, [
		name,
		position,
		open
	]);
	const save = useMutation({
		mutationFn: () => updateMyProfile({ data: {
			fullName,
			position: pos
		} }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["me"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			queryClient.invalidateQueries({ queryKey: ["team"] });
			onOpenChange(false);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Профиль" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Имя будет видно в графике и табеле." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5 flex flex-col gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "fullName",
							children: "Фамилия и имя"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "fullName",
							value: fullName,
							onChange: (e) => setFullName(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "position",
							children: "Должность"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "position",
							value: pos,
							onChange: (e) => setPos(e.target.value),
							placeholder: "например, кассир"
						})]
					}),
					save.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-absent",
						children: save.error.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: save.isPending,
						children: save.isPending ? "Сохраняем…" : "Сохранить"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onSignOut,
						disabled: signingOut,
						children: signingOut ? "Выходим…" : "Выйти из аккаунта"
					})
				]
			})
		] })
	});
}
//#endregion
export { listDepartments as _, DialogTitle as a, updateMember as b, clockIn as c, deleteShift as d, fillWeekdays as f, listAttendance as g, getReport as h, DialogDescription as i, clockOut as l, getMe as m, Dialog as n, Skeleton as o, getDashboard as p, DialogContent as r, addDepartment as s, AppShell as t, copyWeek as u, listShifts as v, upsertShift as x, listTeam as y };
