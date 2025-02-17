import { jsx as _jsx } from "react/jsx-runtime";
export default function Card({ children, className = '' }) {
    return (_jsx("div", { className: `bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden ${className}`, children: children }));
}
