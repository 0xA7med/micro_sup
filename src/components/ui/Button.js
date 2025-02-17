import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Button({ children, variant = 'primary', size = 'md', icon: Icon, iconPosition = 'left', className = '', ...props }) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
    const variantClasses = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
    };
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    };
    return (_jsxs("button", { className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`, ...props, children: [Icon && iconPosition === 'left' && _jsx(Icon, { className: "h-5 w-5 mr-2" }), children, Icon && iconPosition === 'right' && _jsx(Icon, { className: "h-5 w-5 ml-2" })] }));
}
