import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from '../../components/ui/Card';
export default function DashboardCard({ title, value, icon: Icon, color, onClick }) {
    return (_jsx("button", { onClick: onClick, className: "w-full transition-shadow duration-200 hover:shadow-lg", children: _jsx(Card, { className: "p-4 sm:p-5", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Icon, { className: `h-5 w-5 sm:h-6 sm:w-6 text-white p-1 rounded-full ${color}` }) }), _jsx("div", { className: "ml-3 sm:ml-5 w-0 flex-1", children: _jsxs("dl", { children: [_jsx("dt", { className: "text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate", children: title }), _jsx("dd", { className: "text-base sm:text-lg font-semibold text-gray-900 dark:text-white", children: value })] }) })] }) }) }));
}
