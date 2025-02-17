import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
export default function PageHeader({ title, backUrl, actions }) {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { className: "flex items-center", children: [backUrl && (_jsx(Button, { variant: "ghost", icon: ArrowLeft, onClick: () => navigate(backUrl), className: "mr-4", children: "\u0631\u062C\u0648\u0639" })), _jsx("h1", { className: "text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white", children: title })] }), actions && _jsx("div", { className: "flex items-center gap-2", children: actions })] }));
}
