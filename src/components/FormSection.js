import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function FormSection({ title, children }) {
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3", children: title }), children] }));
}
