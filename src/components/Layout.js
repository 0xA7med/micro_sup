import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { LogOut, Languages, Moon, Sun, Building, Users2, UserPlus2, UserCog2, ClipboardList, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useI18nStore } from '../store/i18nStore';
import { useThemeStore } from '../store/themeStore';
import { NavLink } from 'react-router-dom';
export default function Layout({ children, title }) {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { language, setLanguage, translations: t } = useI18nStore();
    const { theme, toggleTheme } = useThemeStore();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const toggleLanguage = () => {
        setLanguage(language === 'ar' ? 'en' : 'ar');
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", dir: language === 'ar' ? 'rtl' : 'ltr', children: [_jsx("nav", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4", children: _jsxs("div", { className: "flex justify-between h-16 items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Building, { className: "h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 dark:text-indigo-400" }), _jsx("span", { className: "ml-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white", children: "MicroPOS" })] }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-4", children: [user?.role === 'admin' && (_jsxs(_Fragment, { children: [_jsxs(NavLink, { to: "/customers", className: ({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx(Users2, { className: "h-5 w-5" }), _jsx("span", { className: "hidden sm:inline", children: t.customer.list })] }), _jsxs(NavLink, { to: "/customers/new", className: ({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx(UserPlus2, { className: "h-5 w-5" }), _jsx("span", { className: "hidden sm:inline", children: t.customer.add })] }), _jsxs(NavLink, { to: "/representatives", className: ({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx(UserCog2, { className: "h-5 w-5" }), _jsx("span", { className: "hidden sm:inline", children: t.agent.list })] }), _jsxs(NavLink, { to: "/representatives/add", className: ({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx(ShieldCheck, { className: "h-5 w-5" }), _jsx("span", { className: "hidden sm:inline", children: t.agent.add })] })] })), user?.role === 'representative' && (_jsxs(_Fragment, { children: [_jsxs(NavLink, { to: "/my-customers", className: ({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx(ClipboardList, { className: "h-5 w-5" }), _jsx("span", { className: "hidden sm:inline", children: t.customer.myCustomers })] }), _jsxs(NavLink, { to: "/customers/new", className: ({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx(UserPlus2, { className: "h-5 w-5" }), _jsx("span", { className: "hidden sm:inline", children: t.customer.add })] })] })), _jsx("div", { className: "h-6 border-r border-gray-300 dark:border-gray-600 mx-2" }), _jsx("button", { onClick: toggleLanguage, className: "p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200", title: t.common.language, children: _jsx(Languages, { className: "h-5 w-5" }) }), _jsx("button", { onClick: toggleTheme, className: "p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200", title: t.common.theme, children: theme === 'dark' ? (_jsx(Sun, { className: "h-5 w-5" })) : (_jsx(Moon, { className: "h-5 w-5" })) }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200", title: t.auth.logout, children: [_jsx(LogOut, { className: "h-5 w-5" }), _jsx("span", { className: "hidden sm:inline", children: t.auth.logout })] })] })] }) }) }), _jsx("main", { className: "max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "px-0 py-4 sm:py-6", children: [_jsx("h1", { className: "text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6", children: title }), children] }) })] }));
}
