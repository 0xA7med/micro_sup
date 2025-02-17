import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function FormField({ label, children, fullWidth = false }) {
    return (_jsxs("div", { className: fullWidth ? 'md:col-span-2' : '', children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: label }), children] }));
}
