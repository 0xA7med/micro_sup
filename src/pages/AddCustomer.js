import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, addMonths, addYears } from 'date-fns';
import { useI18nStore } from '../store/i18nStore';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { db } from '../db/database';
import Button from '../components/ui/Button';
import Layout from '../components/Layout';
const SUBSCRIPTION_TYPES = ['Monthly', 'Semi-annual', 'Annual', 'Permanent'];
const VERSION_TYPES = ['android', 'pc'];
export default function AddCustomer() {
    const navigate = useNavigate();
    const { translations: t, language, setLanguage } = useI18nStore();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    console.log('Theme:', theme);
    const formatDateForInput = (date) => {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return format(date, 'yyyy-MM-dd');
    };
    const formatDateForDisplay = (date) => {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return format(date, 'dd/MM/yyyy');
    };
    const [formData, setFormData] = useState({
        customerName: '',
        businessName: '',
        businessType: '',
        phone: '',
        address: '',
        activationCode: '',
        subscriptionType: '',
        versionType: '',
        deviceCount: '1',
        notes: '',
        startDate: formatDateForInput(new Date()),
        endDate: '',
        displayStartDate: formatDateForDisplay(new Date()),
        displayEndDate: '',
    });
    const calculateEndDate = (startDate, subscriptionType) => {
        const start = new Date(startDate);
        let end = '';
        switch (subscriptionType) {
            case 'Monthly':
                end = format(addMonths(start, 1), 'yyyy-MM-dd');
                break;
            case 'Semi-annual':
                end = format(addMonths(start, 6), 'yyyy-MM-dd');
                break;
            case 'Annual':
                end = format(addYears(start, 1), 'yyyy-MM-dd');
                break;
            case 'Permanent':
                end = format(addYears(start, 100), 'yyyy-MM-dd');
                break;
            default:
                end = '';
        }
        return {
            endDate: end,
            displayEndDate: end ? formatDateForDisplay(end) : ''
        };
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate > today) {
                toast.error(t.subscription.futureDateError);
                return;
            }
            if (formData.subscriptionType) {
                const { endDate, displayEndDate } = calculateEndDate(value, formData.subscriptionType);
                setFormData(prev => ({
                    ...prev,
                    startDate: value,
                    endDate,
                    displayEndDate
                }));
                return;
            }
            setFormData(prev => ({
                ...prev,
                startDate: value
            }));
            return;
        }
        if (name === 'subscriptionType') {
            const { endDate, displayEndDate } = calculateEndDate(formData.startDate, value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                endDate,
                displayEndDate
            }));
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const generateActivationCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 16; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!user) {
                toast.error('يجب تسجيل الدخول أولاً');
                navigate('/login');
                return;
            }
            // التحقق من البيانات المطلوبة
            if (!formData.customerName || !formData.businessName || !formData.phone) {
                toast.error('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            // إنشاء رمز التفعيل
            const activationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const customerData = {
                customerName: formData.customerName,
                businessName: formData.businessName,
                businessType: formData.businessType,
                phone: formData.phone,
                address: formData.address,
                activationCode,
                subscriptionType: formData.subscriptionType,
                versionType: formData.versionType,
                deviceCount: Number(formData.deviceCount),
                subscriptionStart: new Date(formData.startDate),
                subscriptionEnd: formData.endDate ? new Date(formData.endDate) : new Date(formData.startDate),
                notes: formData.notes,
                createdBy: user.id,
                agentName: user.username,
                createdAt: new Date(),
            };
            console.log('Adding customer:', customerData);
            await db.customers.add(customerData);
            console.log('Customer added successfully');
            toast.success(t.customer.addSuccess);
            navigate('/customers');
        }
        catch (error) {
            console.error('Error adding customer:', error);
            toast.error(t.customer.addError);
        }
    };
    const inputClasses = `mt-1 block w-full rounded-lg border p-2.5 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white`;
    const labelClasses = `block text-base font-medium text-gray-700 dark:text-indigo-100`;
    return (_jsx(Layout, { title: t.customer.add, children: _jsxs("div", { className: "max-w-2xl mx-auto p-4", children: [_jsx("div", { className: "flex justify-between items-center mb-6", children: _jsx("div", { className: "flex items-center gap-4", children: _jsxs("button", { onClick: () => navigate('/customers'), className: "flex items-center text-gray-600 dark:text-indigo-100 hover:text-gray-900 dark:hover:text-white", children: [_jsx(ArrowLeft, { className: "h-5 w-5 mr-2" }), t.common.back] }) }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: labelClasses, children: t.customer.name }), _jsx("input", { type: "text", name: "customerName", required: true, value: formData.customerName, onChange: handleInputChange, className: inputClasses })] }), _jsxs("div", { children: [_jsx("label", { className: labelClasses, children: t.customer.businessName }), _jsx("input", { type: "text", name: "businessName", required: true, value: formData.businessName, onChange: handleInputChange, className: inputClasses })] }), _jsxs("div", { children: [_jsx("label", { className: labelClasses, children: t.customer.businessType }), _jsx("input", { type: "text", name: "businessType", required: true, value: formData.businessType, onChange: handleInputChange, className: inputClasses })] }), _jsxs("div", { children: [_jsx("label", { className: labelClasses, children: t.customer.phone }), _jsx("input", { type: "tel", name: "phone", required: true, value: formData.phone, onChange: handleInputChange, className: inputClasses })] }), _jsxs("div", { children: [_jsx("label", { className: labelClasses, children: t.customer.address }), _jsx("input", { type: "text", name: "address", required: true, value: formData.address, onChange: handleInputChange, className: inputClasses })] }), _jsxs("div", { className: "relative", children: [_jsx("label", { className: labelClasses, children: t.customer.subscriptionType }), _jsxs("select", { id: "subscriptionType", name: "subscriptionType", value: formData.subscriptionType, onChange: handleInputChange, className: "mt-1 block w-full px-3 py-2 text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white appearance-none", required: true, style: { direction: language === 'ar' ? 'rtl' : 'ltr' }, children: [_jsx("option", { value: "", className: "bg-white dark:bg-gray-700", children: t.common.select }), _jsx("option", { value: "Monthly", className: "bg-white dark:bg-gray-700", children: language === 'ar' ? 'شهري' : 'Monthly' }), _jsx("option", { value: "Semi-annual", className: "bg-white dark:bg-gray-700", children: language === 'ar' ? 'نصف سنوي' : 'Semi-annual' }), _jsx("option", { value: "Annual", className: "bg-white dark:bg-gray-700", children: language === 'ar' ? 'سنوي' : 'Annual' }), _jsx("option", { value: "Permanent", className: "bg-white dark:bg-gray-700", children: language === 'ar' ? 'دائم' : 'Permanent' })] }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6", children: _jsx("svg", { className: "h-4 w-4 fill-current text-gray-500 dark:text-gray-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", children: _jsx("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" }) }) })] }), _jsxs("div", { children: [_jsx("label", { className: labelClasses, children: t.subscription.startDateLabel }), _jsx("input", { type: "date", name: "startDate", value: formData.startDate, onChange: handleInputChange, className: `${inputClasses} dark:text-white dark:[color-scheme:dark] text-gray-700`, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: labelClasses, children: t.subscription.endDateLabel }), _jsx("input", { type: "text", value: formData.displayEndDate, className: `${inputClasses} bg-gray-50 dark:bg-gray-700`, readOnly: true, placeholder: "DD/MM/YYYY" })] }), _jsxs("div", { children: [_jsx("label", { className: labelClasses, children: t.customer.versionType }), _jsx("div", { className: "mt-1 flex gap-4", children: VERSION_TYPES.map((type) => (_jsxs("label", { className: `flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer ${formData.versionType === type
                                                    ? 'bg-indigo-50 dark:bg-indigo-600 border-indigo-500 text-indigo-700 dark:text-white'
                                                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`, children: [_jsx("input", { type: "radio", name: "versionType", value: type, checked: formData.versionType === type, onChange: handleInputChange, className: "hidden" }), type === 'pc' ? (_jsx(Monitor, { className: "h-5 w-5" })) : (_jsx(Smartphone, { className: "h-5 w-5" })), _jsx("span", { children: t.customer[type] })] }, type))) })] }), _jsxs("div", { children: [_jsx("label", { className: labelClasses, children: t.customer.deviceCount }), _jsx("input", { type: "number", name: "deviceCount", required: true, min: "1", value: formData.deviceCount, onChange: handleInputChange, className: inputClasses })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelClasses, children: t.customer.notes }), _jsx("textarea", { name: "notes", rows: 3, value: formData.notes, onChange: handleInputChange, className: inputClasses })] }), _jsxs("div", { className: "flex justify-end gap-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => navigate('/customers'), children: t.common.cancel }), _jsx(Button, { type: "submit", children: t.customer.add })] })] })] }) }));
}
