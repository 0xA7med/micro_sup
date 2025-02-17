import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useI18nStore } from '../../store/i18nStore';
import ThemeToggle from '../../components/ThemeToggle';
export default function LoginForm({ onLogin, isLoading }) {
    const { translations: t, language, setLanguage } = useI18nStore();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onLogin(formData.username, formData.password);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    return (_jsxs("div", { className: "max-w-md w-full", children: [_jsxs("div", { className: "absolute top-4 right-4 flex items-center gap-2", children: [_jsx(ThemeToggle, {}), _jsx(Button, { variant: "ghost", onClick: () => setLanguage(language === 'ar' ? 'en' : 'ar'), className: "text-white", children: language === 'ar' ? 'EN' : 'عربي' })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(User, { className: "h-8 w-8 text-indigo-600 dark:text-indigo-300" }) }), _jsx("h2", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "MicroPOS Manager" }), _jsx("p", { className: "mt-2 text-sm text-gray-600 dark:text-gray-400", children: t.auth.login })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t.auth.username }), _jsxs("div", { className: "mt-1 relative", children: [_jsx("input", { id: "username", name: "username", type: "text", required: true, value: formData.username, onChange: handleChange, className: "appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white", placeholder: t.auth.usernamePlaceholder, dir: "ltr" }), _jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(User, { className: "h-5 w-5 text-gray-400" }) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: t.auth.password }), _jsxs("div", { className: "mt-1 relative", children: [_jsx("input", { id: "password", name: "password", type: "password", required: true, value: formData.password, onChange: handleChange, className: "appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white", placeholder: t.auth.passwordPlaceholder, dir: "ltr" }), _jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) })] })] }), _jsx(Button, { type: "submit", className: "w-full flex justify-center py-2 px-4", disabled: isLoading, children: isLoading ? t.common.loading : t.auth.login })] })] })] }));
}
