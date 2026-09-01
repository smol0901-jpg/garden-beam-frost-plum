import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./label-Dgemp69d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-Cx-peHFg.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { tone: {
		default: "bg-ink/8 text-ink",
		pine: "bg-pine/12 text-pine",
		present: "bg-present/12 text-present",
		late: "bg-late/12 text-late",
		absent: "bg-absent/12 text-absent",
		muted: "bg-ink/6 text-muted",
		warn: "bg-warn/12 text-warn"
	} },
	defaultVariants: { tone: "default" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
//#endregion
export { Badge as t };
