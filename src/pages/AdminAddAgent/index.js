import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import PageHeader from "../../components/ui/PageHeader";
import CustomerField from '../../components/CustomerField';
import CustomerInput from '../../components/CustomerInput';
import Button from '../../components/ui/Button';
import { useI18nStore } from "../../store/i18nStore";
import { User, Lock, UserPlus, AtSign, Phone, MapPin } from 'lucide-react';
import { api } from '../../lib/api';
export default function AdminAddAgent() {
    const navigate = useNavigate();
    const { translations: t } = useI18nStore();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phone: "",
        address: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error(t.auth.passwordMismatch);
            return;
        }
        if (!formData.username || !formData.password || !formData.fullName) {
            toast.error(t.common.fillAllFields);
            return;
        }
        try {
            await api.auth.createAgent({
                username: formData.username.toLowerCase(),
                password: formData.password,
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                role: 'representative'
            });
            toast.success(t.agent.addSuccess);
            navigate("/agents");
        }
        catch (error) {
            console.error("Error:", error);
            toast.error(error.message || t.common.error);
        }
    };
    return (_jsxs(Layout, { children: [_jsx(PageHeader, { title: t.agent.addNew }), _jsxs("form", { onSubmit: handleSubmit, className: "max-w-xl mx-auto mt-8", children: [_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "space-y-5", children: [_jsx(CustomerField, { label: t.agent.name, children: _jsxs("div", { className: "relative", children: [_jsx(CustomerInput, { type: "text", name: "fullName", required: true, value: formData.fullName, onChange: handleChange, isEditing: true, className: `${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`, placeholder: t.agent.namePlaceholder, dir: t.language === 'ar' ? 'rtl' : 'ltr' }), _jsx("div", { className: `absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`, children: _jsx(User, { className: "h-5 w-5 text-gray-400 dark:text-gray-500" }) })] }) }), _jsx(CustomerField, { label: t.agent.phone, children: _jsxs("div", { className: "relative", children: [_jsx(CustomerInput, { type: "tel", name: "phone", required: true, value: formData.phone, onChange: handleChange, isEditing: true, className: `${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`, placeholder: t.agent.phonePlaceholder, dir: "ltr" }), _jsx("div", { className: `absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`, children: _jsx(Phone, { className: "h-5 w-5 text-gray-400 dark:text-gray-500" }) })] }) }), _jsx(CustomerField, { label: t.agent.address, children: _jsxs("div", { className: "relative", children: [_jsx(CustomerInput, { type: "text", name: "address", required: true, value: formData.address, onChange: handleChange, isEditing: true, className: `${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`, placeholder: t.agent.addressPlaceholder, dir: t.language === 'ar' ? 'rtl' : 'ltr' }), _jsx("div", { className: `absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`, children: _jsx(MapPin, { className: "h-5 w-5 text-gray-400 dark:text-gray-500" }) })] }) })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: t.auth.accountInfo }), _jsxs("div", { className: "space-y-5", children: [_jsx(CustomerField, { label: t.auth.username, children: _jsxs("div", { className: "relative", children: [_jsx(CustomerInput, { type: "text", name: "username", required: true, value: formData.username, onChange: handleChange, isEditing: true, className: `${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`, placeholder: t.auth.usernamePlaceholder, dir: "ltr" }), _jsx("div", { className: `absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`, children: _jsx(AtSign, { className: "h-5 w-5 text-gray-400 dark:text-gray-500" }) })] }) }), _jsx(CustomerField, { label: t.auth.password, children: _jsxs("div", { className: "relative", children: [_jsx(CustomerInput, { type: "password", name: "password", required: true, value: formData.password, onChange: handleChange, isEditing: true, className: `${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`, placeholder: t.auth.passwordPlaceholder, dir: "ltr" }), _jsx("div", { className: `absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`, children: _jsx(Lock, { className: "h-5 w-5 text-gray-400 dark:text-gray-500" }) })] }) }), _jsx(CustomerField, { label: t.auth.confirmPassword, children: _jsxs("div", { className: "relative", children: [_jsx(CustomerInput, { type: "password", name: "confirmPassword", required: true, value: formData.confirmPassword, onChange: handleChange, isEditing: true, className: `${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`, placeholder: t.auth.confirmPasswordPlaceholder, dir: "ltr" }), _jsx("div", { className: `absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`, children: _jsx(Lock, { className: "h-5 w-5 text-gray-400 dark:text-gray-500" }) })] }) })] })] })] }), _jsx("div", { className: "mt-8 flex justify-end", children: _jsxs(Button, { type: "submit", className: "w-full sm:w-auto", children: [_jsx(UserPlus, { className: "h-5 w-5 mr-2" }), t.agent.addNew] }) })] })] }));
}
