import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Calendar } from 'lucide-react';
import { useI18nStore } from '../../store/i18nStore';
import { useThemeStore } from '../../store/themeStore';
import { format, isAfter, startOfToday } from 'date-fns';
import CustomerField from '../../components/CustomerField';
import CustomerInput from '../../components/CustomerInput';
import CustomerSelect from '../../components/CustomerSelect';
import CustomerTextArea from '../../components/CustomerTextArea';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
const SUBSCRIPTION_TYPES = ['Monthly', 'Semi-annual', 'Annual', 'Permanent'];
const VERSION_TYPES = ['pc', 'android'];
export default function CustomerForm({ formData, onChange, onSubmit, onPaste }) {
    const { translations: t, language } = useI18nStore();
    const { theme } = useThemeStore();
    const isDarkMode = theme === 'dark';
    const today = startOfToday();
    const [dateInputValue, setDateInputValue] = useState('');
    const formatDateForDisplay = (dateStr) => {
        if (!dateStr)
            return '';
        try {
            const date = new Date(dateStr);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        catch {
            return '';
        }
    };
    useEffect(() => {
        setDateInputValue(formatDateForDisplay(formData.subscriptionStart));
    }, [formData.subscriptionStart]);
    const handleDateInput = (value) => {
        let cleanValue = value.replace(/[^\d/]/g, '');
        if (cleanValue.length === 2 && !cleanValue.includes('/')) {
            cleanValue = cleanValue + '/';
        }
        else if (cleanValue.length === 5 && cleanValue.split('/').length === 2) {
            cleanValue = cleanValue + '/';
        }
        cleanValue = cleanValue.slice(0, 10);
        setDateInputValue(cleanValue);
        if (cleanValue.length === 10) {
            const [day, month, year] = cleanValue.split('/');
            try {
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                if (!isNaN(date.getTime())) {
                    if (isAfter(date, today)) {
                        toast.error(t.subscription.futureDateError);
                        return;
                    }
                    onChange({
                        target: {
                            name: 'subscriptionStart',
                            value: format(date, 'yyyy-MM-dd')
                        }
                    });
                }
            }
            catch {
                // Invalid date, do nothing
            }
        }
    };
    return (_jsxs("form", { onSubmit: onSubmit, className: "space-y-6", children: [_jsx("div", { className: `rounded-lg p-6 space-y-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(CustomerField, { label: t.customer.name, children: _jsx(CustomerInput, { type: "text", name: "customerName", required: true, value: formData.customerName, onChange: onChange, isEditing: true }) }), _jsx(CustomerField, { label: t.customer.businessName, children: _jsx(CustomerInput, { type: "text", name: "businessName", required: true, value: formData.businessName, onChange: onChange, isEditing: true }) }), _jsx(CustomerField, { label: t.customer.businessType, children: _jsx(CustomerInput, { type: "text", name: "businessType", required: true, value: formData.businessType, onChange: onChange, isEditing: true }) }), _jsx(CustomerField, { label: t.customer.phone, children: _jsx(CustomerInput, { type: "tel", name: "phone", required: true, value: formData.phone, onChange: onChange, isEditing: true, dir: "ltr" }) }), _jsx(CustomerField, { label: t.customer.address, children: _jsx(CustomerInput, { type: "text", name: "address", required: true, value: formData.address, onChange: onChange, isEditing: true }) }), _jsx(CustomerField, { label: t.customer.activationCode, children: _jsxs("div", { className: "flex gap-2", children: [_jsx(CustomerInput, { type: "text", name: "activationCode", required: true, value: formData.activationCode, onChange: onChange, isEditing: true }), _jsx(Button, { type: "button", variant: "secondary", onClick: onPaste, className: "flex-shrink-0", children: t.common.paste })] }) }), _jsx(CustomerField, { label: t.customer.subscriptionType, children: _jsxs("div", { className: "relative", children: [_jsx(CustomerSelect, { name: "subscriptionType", value: formData.subscriptionType, onChange: onChange, required: true, isEditing: true, children: SUBSCRIPTION_TYPES.map(type => (_jsx("option", { value: type, children: t.subscription[type.toLowerCase().replace(/-/g, '')] }, type))) }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: _jsx(Calendar, { className: "h-5 w-5 text-gray-400" }) })] }) }), _jsx(CustomerField, { label: t.customer.versionType, children: _jsxs("div", { className: "relative", children: [_jsx(CustomerSelect, { name: "versionType", value: formData.versionType, onChange: onChange, required: true, isEditing: true, children: VERSION_TYPES.map(type => (_jsx("option", { value: type, children: t.customer[type] }, type))) }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: formData.versionType === 'pc' ? (_jsx(Monitor, { className: "h-5 w-5 text-gray-400" })) : (_jsx(Smartphone, { className: "h-5 w-5 text-gray-400" })) })] }) }), _jsx(CustomerField, { label: t.customer.deviceCount, children: _jsx(CustomerInput, { type: "number", name: "deviceCount", required: true, min: "1", value: String(formData.deviceCount), onChange: onChange, isEditing: true }) }), _jsx(CustomerField, { label: t.subscription.startDate, children: _jsxs("div", { className: "relative", children: [_jsx(CustomerInput, { type: "text", name: "subscriptionStartDisplay", required: true, value: dateInputValue || '', onChange: (e) => handleDateInput(e.target.value), isEditing: true, placeholder: "DD/MM/YYYY" }), _jsx("input", { type: "hidden", name: "subscriptionStart", value: formData.subscriptionStart || '' })] }) }), _jsx(CustomerField, { label: t.customer.notes, className: "md:col-span-2", children: _jsx(CustomerTextArea, { name: "notes", value: formData.notes || '', onChange: onChange, rows: 3, isEditing: true }) })] }) }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "submit", variant: "primary", className: "w-full sm:w-auto", children: t.customer.add }) })] }));
}
