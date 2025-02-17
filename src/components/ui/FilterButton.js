import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Filter, Check } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
export default function FilterButton({ label, options, value, onChange, icon }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const filterRef = React.useRef(null);
    const { theme } = useThemeStore();
    const isDarkMode = theme === 'dark';
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const selectedOption = options.find(opt => opt.value === value);
    return (_jsxs("div", { className: "relative", ref: filterRef, children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: `flex items-center gap-2 px-4 py-2 rounded-lg border ${value
                    ? isDarkMode
                        ? 'bg-indigo-900/20 border-indigo-500'
                        : 'bg-indigo-50 border-indigo-200'
                    : isDarkMode
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-300 hover:border-gray-400'} transition-colors duration-200`, children: [typeof icon === 'function' ? icon() : icon || _jsx(Filter, { className: "h-4 w-4" }), _jsx("span", { className: `text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`, children: value ? selectedOption?.label : label })] }), isOpen && (_jsx("div", { className: `absolute z-50 mt-2 w-56 rounded-lg border shadow-lg ${isDarkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'}`, children: _jsx("div", { className: "p-2", children: _jsx("div", { className: "space-y-1", children: options.map((option) => (_jsxs("button", { onClick: () => {
                                onChange(option.value === value ? '' : option.value);
                                setIsOpen(false);
                            }, className: `flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${option.value === value
                                ? isDarkMode
                                    ? 'bg-indigo-900/20 text-indigo-400'
                                    : 'bg-indigo-50 text-indigo-700'
                                : isDarkMode
                                    ? 'text-gray-200 hover:bg-gray-700'
                                    : 'text-gray-700 hover:bg-gray-50'}`, children: [option.label, option.value === value && (_jsx(Check, { className: "h-4 w-4" }))] }, option.value))) }) }) }))] }));
}
