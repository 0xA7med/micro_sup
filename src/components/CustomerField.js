import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useThemeStore } from '../store/themeStore';
export default function CustomerField({ label, children }) {
    const { theme } = useThemeStore();
    const isDarkMode = theme === 'dark';
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: `block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`, children: label }), children] }));
}
