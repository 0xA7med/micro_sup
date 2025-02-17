import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function CustomerField({ label, children }) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return (_jsxs("div", { children: [_jsx("label", { className: `block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`, children: label }), _jsx("div", { className: "mt-1", children: children })] }));
}
