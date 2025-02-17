import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Edit, Trash2, X } from 'lucide-react';
import Button from '../ui/Button';
export default function CustomerHeader({ title, isAdmin, isEditing, onEdit, onDelete, onClose }) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: `text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`, children: title }), _jsxs("div", { className: "flex gap-2", children: [isAdmin && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", size: "sm", icon: Edit, onClick: onEdit, className: "!p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" }), _jsx(Button, { variant: "ghost", size: "sm", icon: Trash2, onClick: onDelete, className: "!p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400" })] })), _jsx(Button, { variant: "ghost", size: "sm", icon: X, onClick: onClose, className: "!p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" })] })] }));
}
