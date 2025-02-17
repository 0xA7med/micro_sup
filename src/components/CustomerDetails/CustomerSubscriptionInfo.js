import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Monitor, Smartphone } from 'lucide-react';
import CustomerField from './CustomerField';
import CustomerInput from '../CustomerInput';
import { useI18nStore } from '../../store/i18nStore';
const SUBSCRIPTION_TYPES = ['Semi-annual', 'Annual', 'Permanent', 'Trial'];
const VERSION_TYPES = ['android', 'pc'];
export default function CustomerSubscriptionInfo({ customer, isEditing, handleChange }) {
    const { translations: t } = useI18nStore();
    const isDarkMode = document.documentElement.classList.contains('dark');
    return (_jsxs(_Fragment, { children: [_jsx(CustomerField, { label: "\u0646\u0648\u0639 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643", children: isEditing ? (_jsx("select", { name: "subscription_type", value: customer.subscription_type, onChange: handleChange, className: "form-select", children: SUBSCRIPTION_TYPES.map((type) => (_jsx("option", { value: type, children: t.subscription[type.toLowerCase()] }, type))) })) : (_jsx("p", { className: `text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`, children: t.subscription[customer.subscription_type.toLowerCase()] })) }), _jsx(CustomerField, { label: "\u0646\u0648\u0639 \u0627\u0644\u0646\u0633\u062E\u0629", children: isEditing ? (_jsx("div", { className: "flex gap-4", children: VERSION_TYPES.map((type) => (_jsxs("label", { className: `flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer ${customer.version_type === type
                            ? isDarkMode
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: [_jsx("input", { type: "radio", name: "version_type", value: type, checked: customer.version_type === type, onChange: handleChange, className: "hidden" }), type === 'pc' ? (_jsx(Monitor, { className: "h-5 w-5" })) : (_jsx(Smartphone, { className: "h-5 w-5" })), _jsx("span", { children: t.customer[type] })] }, type))) })) : (_jsx("p", { className: `text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`, children: t.customer[customer.version_type] })) }), _jsx(CustomerField, { label: "\u0639\u062F\u062F \u0627\u0644\u0623\u062C\u0647\u0632\u0629", children: _jsx(CustomerInput, { type: "number", name: "device_count", value: customer.device_count, onChange: handleChange, min: "1", isEditing: isEditing }) })] }));
}
