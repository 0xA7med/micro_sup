import { jsx as _jsx } from "react/jsx-runtime";
export default function LoadingSpinner({ size = 'md' }) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };
    return (_jsx("div", { className: "flex justify-center items-center", children: _jsx("div", { className: `animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}` }) }));
}
