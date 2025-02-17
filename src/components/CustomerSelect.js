import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useI18nStore } from '../store/i18nStore';
const CustomerSelect = forwardRef(({ isEditing, value, displayValue, children, className = '', ...props }, ref) => {
    const { theme } = useThemeStore();
    const { language } = useI18nStore();
    const isDarkMode = theme === 'dark';
    const isRTL = language === 'ar';
    const selectClasses = `block w-full rounded-lg border ${isDarkMode
        ? 'bg-gray-700 border-gray-600 text-white'
        : 'bg-white border-gray-300 text-gray-900'} p-2.5 focus:ring-2 focus:ring-indigo-500 ${className}`;
    if (!isEditing) {
        return (_jsx("p", { className: `text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`, children: displayValue || String(value) }));
    }
    return (_jsx("select", { ...props, ref: ref, value: String(value), className: selectClasses, dir: props.dir || (isRTL ? 'rtl' : 'ltr'), children: children }));
});
CustomerSelect.displayName = 'CustomerSelect';
export default CustomerSelect;
