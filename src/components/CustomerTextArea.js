import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useI18nStore } from '../store/i18nStore';
const CustomerTextArea = forwardRef(({ isEditing, value, displayValue, className = '', ...props }, ref) => {
    const { theme } = useThemeStore();
    const { language } = useI18nStore();
    const isDarkMode = theme === 'dark';
    const isRTL = language === 'ar';
    const textareaClasses = `block w-full rounded-lg border ${isDarkMode
        ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} p-2.5 focus:ring-2 focus:ring-indigo-500 ${className}`;
    if (!isEditing) {
        return (_jsx("p", { className: `text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`, children: displayValue || value }));
    }
    return (_jsx("textarea", { ...props, ref: ref, value: value, className: textareaClasses, dir: props.dir || (isRTL ? 'rtl' : 'ltr') }));
});
CustomerTextArea.displayName = 'CustomerTextArea';
export default CustomerTextArea;
