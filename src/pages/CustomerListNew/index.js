import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Grid, List as ListIcon, Calendar, Clock, Monitor, Smartphone, Infinity, CircleDot, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/ui/Button';
import FilterButton from '../../components/ui/FilterButton';
import { useI18nStore } from '../../store/i18nStore';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';
export default function CustomerList() {
    const { translations: t } = useI18nStore();
    const { theme } = useThemeStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const isDarkMode = theme === 'dark';
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        subscriptionType: '',
        versionType: '',
        status: '' // active, expired, all
    });
    useEffect(() => {
        fetchCustomers();
    }, [user]);
    useEffect(() => {
        filterCustomers();
    }, [searchTerm, filters, customers]);
    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const data = await api.customers.getAll();
            setCustomers(data);
        }
        catch (error) {
            console.error('Error fetching customers:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const filterCustomers = () => {
        let filtered = [...customers];
        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(customer => customer.customerName.toLowerCase().includes(searchLower) ||
                customer.businessName.toLowerCase().includes(searchLower) ||
                customer.phone.includes(searchTerm));
        }
        // Subscription type filter
        if (filters.subscriptionType) {
            filtered = filtered.filter(customer => customer.subscriptionType === filters.subscriptionType);
        }
        // Version type filter
        if (filters.versionType) {
            filtered = filtered.filter(customer => customer.versionType === filters.versionType);
        }
        // Status filter
        if (filters.status) {
            const now = new Date();
            filtered = filtered.filter(customer => {
                if (customer.subscriptionType === 'Permanent') {
                    return filters.status === 'active';
                }
                const endDate = customer.subscriptionEnd ? new Date(customer.subscriptionEnd) : null;
                const isActive = endDate ? endDate > now : false;
                return filters.status === (isActive ? 'active' : 'expired');
            });
        }
        setFilteredCustomers(filtered);
    };
    const getStatusColor = (customer) => {
        if (customer.subscriptionType === 'Permanent') {
            return isDarkMode ? 'text-green-400' : 'text-green-500';
        }
        const now = new Date();
        const endDate = customer.subscriptionEnd ? new Date(customer.subscriptionEnd) : null;
        const isActive = endDate ? endDate > now : false;
        return isActive
            ? isDarkMode ? 'text-green-400' : 'text-green-500'
            : isDarkMode ? 'text-red-400' : 'text-red-500';
    };
    // Filter options with icons
    const subscriptionOptions = [
        { value: '', label: t.subscription.subscriptionType, mobileLabel: t.subscription.subscriptionType },
        { value: 'Monthly', label: t.subscription.monthly, mobileLabel: t.subscription.monthly },
        { value: 'Semi-annual', label: t.subscription.semiannual, mobileLabel: t.subscription.semiannual },
        { value: 'Annual', label: t.subscription.annual, mobileLabel: t.subscription.annual },
        { value: 'Permanent', label: t.subscription.permanent, mobileLabel: t.subscription.permanent }
    ];
    const versionOptions = [
        { value: '', label: t.customer.versionType, mobileLabel: t.customer.versionType },
        { value: 'pc', label: t.customer.pc, mobileLabel: t.customer.pc },
        { value: 'android', label: t.customer.android, mobileLabel: t.customer.android }
    ];
    const statusOptions = [
        { value: '', label: t.subscription.status, mobileLabel: t.subscription.status },
        { value: 'active', label: t.subscription.active, mobileLabel: t.subscription.active },
        { value: 'expired', label: t.subscription.expired, mobileLabel: t.subscription.expired }
    ];
    return (_jsx(Layout, { children: _jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px]", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate('/'), className: "flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors", children: [_jsx(ArrowLeft, { className: "h-5 w-5" }), _jsx("span", { children: t.common.back })] }), _jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white", children: t.customer.list })] }), _jsxs("p", { className: "mt-2 text-base text-gray-500 dark:text-gray-400", children: [filteredCustomers.length, " ", t.customer.totalCustomers] })] }), _jsxs(Button, { variant: "primary", onClick: () => navigate('/customers/new'), className: "w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5", children: [_jsx(UserPlus, { className: "h-5 w-5" }), t.customer.add] })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-8", children: _jsxs("div", { className: "flex flex-col lg:flex-row items-start gap-6", children: [_jsx("div", { className: "w-full lg:w-80", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: t.common.search, className: `w-full h-10 rounded-lg border text-sm ${isDarkMode
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-10` }), _jsx(Search, { className: "absolute left-3 top-2.5 h-5 w-5 text-gray-400" })] }) }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx(FilterButton, { label: t.subscriptionType, options: subscriptionOptions, value: filters.subscriptionType, onChange: (value) => setFilters(prev => ({ ...prev, subscriptionType: value })), icon: _jsx(Calendar, { className: "h-4 w-4" }) }), _jsx(FilterButton, { label: t.versionType, options: versionOptions, value: filters.versionType, onChange: (value) => setFilters(prev => ({ ...prev, versionType: value })), icon: _jsx(Monitor, { className: "h-4 w-4" }) }), _jsx(FilterButton, { label: t.status, options: statusOptions, value: filters.status, onChange: (value) => setFilters(prev => ({ ...prev, status: value })), icon: _jsx(CircleDot, { className: "h-4 w-4" }) }), _jsxs("div", { className: "flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg p-1", children: [_jsx("button", { onClick: () => setViewMode('grid'), className: `p-1.5 rounded ${viewMode === 'grid'
                                                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`, children: _jsx(Grid, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => setViewMode('list'), className: `p-1.5 rounded ${viewMode === 'list'
                                                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`, children: _jsx(ListIcon, { className: "h-5 w-5" }) })] })] })] }) }), isLoading ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" }) })) : filteredCustomers.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "mx-auto h-12 w-12 text-gray-400", children: _jsx(UserPlus, { className: "h-12 w-12" }) }), _jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900 dark:text-white", children: t.customer.noCustomers }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: t.customer.startByAdding }), _jsx("div", { className: "mt-6", children: _jsxs(Button, { variant: "primary", onClick: () => navigate('/customers/new'), children: [_jsx(UserPlus, { className: "h-5 w-5 mr-2" }), t.customer.add] }) })] })) : viewMode === 'grid' ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredCustomers.map((customer) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer", onClick: () => navigate(`/customers/${customer.id}`), children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: customer.customerName }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: customer.businessName })] }), _jsx("div", { className: `flex items-center ${getStatusColor(customer)}`, children: customer.subscriptionType === 'Permanent' ? (_jsx(Infinity, { className: "h-5 w-5" })) : (customer.subscriptionEnd && new Date(customer.subscriptionEnd) > new Date() ? (_jsx(CheckCircle2, { className: "h-5 w-5" })) : (_jsx(XCircle, { className: "h-5 w-5" }))) })] }), _jsxs("div", { className: "mt-4 space-y-2", children: [_jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [_jsx(Calendar, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: t.subscription[customer.subscriptionType.toLowerCase()] })] }), _jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [customer.versionType === 'pc' ? (_jsx(Monitor, { className: "h-4 w-4 mr-2" })) : (_jsx(Smartphone, { className: "h-4 w-4 mr-2" })), _jsxs("span", { children: [customer.versionType === 'pc' ? t.customer.pc : t.customer.android, " (", customer.deviceCount, ")"] })] }), customer.subscriptionType !== 'Permanent' && (_jsxs("div", { className: "flex items-center text-sm text-gray-500 dark:text-gray-400", children: [_jsx(Clock, { className: "h-4 w-4 mr-2" }), _jsx("span", { children: new Date(customer.subscriptionEnd).toLocaleDateString() })] }))] })] }, customer.id))) })) : (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-900/50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t.customer.name }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t.customer.business }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t.subscription.type }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t.customer.version }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t.subscription.endDate }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t.subscription.status })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: filteredCustomers.map((customer) => (_jsxs("tr", { onClick: () => navigate(`/customers/${customer.id}`), className: "hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: customer.customerName }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: customer.businessName }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: t.subscription[customer.subscriptionType.toLowerCase()] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: [customer.versionType === 'pc' ? t.customer.pc : t.customer.android, " (", customer.deviceCount, ")"] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: customer.subscriptionType === 'Permanent' ? (_jsx(Infinity, { className: "h-4 w-4" })) : (new Date(customer.subscriptionEnd).toLocaleDateString()) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: `text-sm ${getStatusColor(customer)} flex items-center`, children: [customer.subscriptionType === 'Permanent' ? (_jsx(Infinity, { className: "h-4 w-4 mr-1" })) : (customer.subscriptionEnd && new Date(customer.subscriptionEnd) > new Date() ? (_jsx(CheckCircle2, { className: "h-4 w-4 mr-1" })) : (_jsx(XCircle, { className: "h-4 w-4 mr-1" }))), _jsx("span", { children: customer.subscriptionType === 'Permanent'
                                                                ? t.subscription.permanent
                                                                : customer.subscriptionEnd && new Date(customer.subscriptionEnd) > new Date()
                                                                    ? t.subscription.active
                                                                    : t.subscription.expired })] }) })] }, customer.id))) })] }) }) }))] }) }));
}
