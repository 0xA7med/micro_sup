import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useI18nStore } from '../store/i18nStore';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';
import { db } from '../db/database';
import LoginForm from './LoginForm';
import Button from '../components/ui/Button';
export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const { translations: t, language, setLanguage } = useI18nStore();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegistering) {
            if (formData.password !== formData.confirmPassword) {
                toast.error(t.auth.passwordMismatch);
                return;
            }
            try {
                await db.users.add({
                    username: formData.username.toLowerCase().trim(),
                    password: formData.password,
                    fullName: formData.fullName,
                    role: 'representative',
                    createdAt: new Date()
                });
                toast.success(t.auth.registerSuccess);
                setIsRegistering(false);
                setFormData({ username: '', password: '', confirmPassword: '', fullName: '' });
            }
            catch (error) {
                console.error('Error registering:', error);
                toast.error(t.auth.registerError);
            }
        }
        else {
            const success = await login(formData.username, formData.password);
            if (success) {
                toast.success(t.auth.loginSuccess);
                navigate('/');
            }
            else {
                toast.error(t.auth.loginError);
            }
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setFormData({ username: '', password: '', confirmPassword: '', fullName: '' });
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200", children: _jsxs("div", { className: "max-w-md w-full", children: [_jsxs("div", { className: "absolute top-4 right-4 flex items-center gap-2", children: [_jsx(ThemeToggle, {}), _jsx(Button, { variant: "ghost", onClick: () => setLanguage(language === 'ar' ? 'en' : 'ar'), className: "text-white", children: language === 'ar' ? 'EN' : 'عربي' })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(User, { className: "h-8 w-8 text-indigo-600 dark:text-indigo-300" }) }), _jsx("h2", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "MicroPOS Manager" }), _jsx("p", { className: "mt-2 text-sm text-gray-600 dark:text-gray-400", children: isRegistering ? t.auth.registerAsRep : t.auth.login })] }), _jsx(LoginForm, { isRegistering: isRegistering, formData: formData, handleChange: handleChange, handleSubmit: handleSubmit, toggleMode: toggleMode })] })] }) }));
}
