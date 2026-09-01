import "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./label-Dgemp69d.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function SelectNative({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("flex h-11 w-full appearance-none rounded-[10px] border border-line-strong bg-raised bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path fill=%22%231a2421%22 d=%22M1 1l5 5 5-5%22/>')] bg-[length:12px_8px] bg-[right_12px_center] bg-no-repeat px-3 pr-9 text-sm text-ink", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35", className),
		...props
	});
}
//#endregion
export { SelectNative as t };
