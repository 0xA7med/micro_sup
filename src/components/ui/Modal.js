import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
import Button from './Button';
export default function Modal({ title, children, onClose, footer }) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: `max-w-2xl w-full rounded-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: `text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`, children: title }), _jsx(Button, { variant: "ghost", size: "sm", icon: X, onClick: onClose, className: "!p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" })] }), _jsx("div", { className: "py-2", children: children }), footer && (_jsx("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700", children: footer }))] }) }));
}
