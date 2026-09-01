import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-LrXDokVF.mjs";
import { a as useCurrentUserState, i as cn, n as Input, r as Label, t as Button } from "./label-Dgemp69d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DvRSRB28.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function onEmail(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			if (mode === "up") {
				const { error: err } = await authClient.signUp.email({
					email,
					password,
					name: name.trim() || email.split("@")[0] || "Сотрудник",
					callbackURL: "/"
				});
				if (err) throw new Error(err.message || "Не удалось зарегистрироваться");
			} else {
				const { error: err } = await authClient.signIn.email({
					email,
					password,
					callbackURL: "/"
				});
				if (err) throw new Error(err.message || "Неверный email или пароль");
			}
			window.location.href = "/";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ошибка входа");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "paper-grain min-h-dvh lg:grid lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative hidden flex-col justify-between overflow-hidden bg-pine px-10 py-10 text-pine-fg lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 place-items-center rounded-[10px] bg-pine-fg/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
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
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl font-semibold",
						children: "Смена"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-5xl leading-[1.05] font-semibold tracking-tight",
					children: [
						"График.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Приход.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Уход."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-sm text-sm leading-relaxed text-pine-fg/75",
					children: "Один табель для всей команды: расписание смен, отметка на месте и отчёт по часам — с ролями администратора, руководителя и сотрудника."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimesheetPreview, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex min-h-dvh items-center justify-center px-5 py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl font-semibold tracking-tight",
							children: "Смена"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Табель прихода и график работы"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-semibold tracking-tight",
						children: "Вход в табель"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Первый зарегистрировавшийся становится администратором и подтверждает остальных."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid grid-cols-2 rounded-xl bg-ink/5 p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMode("in"),
								className: cn("h-10 rounded-[10px] text-sm font-medium", mode === "in" ? "bg-raised text-ink shadow-[var(--shadow-card)]" : "text-muted"),
								children: "Вход"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMode("up"),
								className: cn("h-10 rounded-[10px] text-sm font-medium", mode === "up" ? "bg-raised text-ink shadow-[var(--shadow-card)]" : "text-muted"),
								children: "Регистрация"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-5 flex flex-col gap-3",
							onSubmit: onEmail,
							children: [
								mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "Имя"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										value: name,
										onChange: (e) => setName(e.target.value),
										placeholder: "Иванов Иван",
										autoComplete: "name"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										required: true,
										autoComplete: "email"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Пароль"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										required: true,
										minLength: 8,
										autoComplete: mode === "up" ? "new-password" : "current-password"
									})]
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-absent",
									children: error
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy,
									size: "lg",
									children: busy ? "Подождите…" : mode === "up" ? "Создать аккаунт" : "Войти"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-5 flex items-center gap-3 text-xs text-subtle",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line-strong" }),
								"или",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line-strong" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-2",
							children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => signIn(p.providerId, { callbackURL: "/" }),
								children: ["Продолжить через ", p.label]
							}, p.providerId))
						})
					] })
				]
			})
		})]
	});
}
function TimesheetPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-pine-fg/8 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-medium tracking-wide text-pine-fg/60 uppercase",
			children: "Сегодня · табель"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid grid-cols-[1fr_1fr_auto] gap-x-4 gap-y-2 font-mono text-sm",
			children: [
				[
					"09:02",
					"18:05",
					"офис"
				],
				[
					"08:57",
					"17:12",
					"склад"
				],
				[
					"—",
					"—",
					"вых."
				],
				[
					"09:18",
					"18:01",
					"опозд."
				]
			].map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "contents",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular text-pine-fg/90",
						children: r[0]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular text-pine-fg/90",
						children: r[1]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-right text-pine-fg/55",
						children: r[2]
					})
				]
			}, i))
		})]
	});
}
//#endregion
export { Login as component };
