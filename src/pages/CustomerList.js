import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, ArrowLeft, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { useI18nStore } from '../store/i18nStore';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Layout from '../components/Layout';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import { api } from '../lib/api';
const API_URL = 'http://localhost:5000';
export default function CustomerList() {
    const navigate = useNavigate();
    const { translations: t, language, setLanguage } = useI18nStore();
    const user = useAuthStore((state) => state.user);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await api.customers.getAll();
                setCustomers(data);
            }
            catch (error) {
                console.error('Error fetching customers:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [user]);
    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc'
                ? 'desc'
                : 'asc',
        }));
    };
    const filteredCustomers = customers
        .filter((customer) => {
        const searchLower = searchTerm.toLowerCase();
        return (customer.customerName.toLowerCase().includes(searchLower) ||
            customer.businessName.toLowerCase().includes(searchLower) ||
            customer.phone.toLowerCase().includes(searchLower));
    })
        .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        }
        else {
            return aValue < bValue ? 1 : -1;
        }
    });
    const dateLocale = language === 'ar' ? arSA : enUS;
    return (_jsx(Layout, { title: t.customer.list, children: _jsxs("div", { className: "max-w-7xl mx-auto p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("div", { className: "flex items-center gap-4", children: _jsxs("button", { onClick: () => navigate('/'), className: "flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white", children: [_jsx(ArrowLeft, { className: "h-5 w-5 mr-2" }), t.common.back] }) }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs(Button, { onClick: () => navigate('/customers/add'), className: "flex items-center gap-2", children: [_jsx(UserPlus, { className: "h-5 w-5" }), t.customer.add] }) })] }), _jsx("div", { className: "flex flex-col md:flex-row justify-between items-center mb-6 gap-4", children: _jsxs("div", { className: "relative flex-1 max-w-md w-full", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: t.common.search, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer", onClick: () => handleSort('customerName'), children: _jsxs("div", { className: "flex items-center gap-2", children: [t.customer.name, _jsx(ArrowUpDown, { className: "h-4 w-4" })] }) }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer", onClick: () => handleSort('businessName'), children: _jsxs("div", { className: "flex items-center gap-2", children: [t.customer.businessName, _jsx(ArrowUpDown, { className: "h-4 w-4" })] }) }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer", onClick: () => handleSort('phone'), children: _jsxs("div", { className: "flex items-center gap-2", children: [t.customer.phone, _jsx(ArrowUpDown, { className: "h-4 w-4" })] }) }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer", onClick: () => handleSort('subscriptionType'), children: _jsxs("div", { className: "flex items-center gap-2", children: [t.customer.subscriptionType, _jsx(ArrowUpDown, { className: "h-4 w-4" })] }) }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer", onClick: () => handleSort('subscriptionEnd'), children: _jsxs("div", { className: "flex items-center gap-2", children: [t.customer.subscriptionEnd, _jsx(ArrowUpDown, { className: "h-4 w-4" })] }) }), user?.role === 'admin' && (_jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: t.customer.agent }))] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: user?.role === 'admin' ? 6 : 5, className: "px-6 py-4 text-center text-gray-500 dark:text-gray-400", children: t.common.loading }) })) : filteredCustomers.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: user?.role === 'admin' ? 6 : 5, className: "px-6 py-4 text-center text-gray-500 dark:text-gray-400", children: t.customer.noResults }) })) : (filteredCustomers.map((customer) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer", onClick: () => setSelectedCustomer(customer), children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: customer.customerName }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: customer.businessName }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: customer.phone }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: _jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100", children: t.subscription[customer.subscriptionType.toLowerCase()] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: (() => {
                                                    const endDate = new Date(customer.subscriptionEnd);
                                                    console.log('Subscription End Date:', endDate);
                                                    if (isNaN(endDate.getTime())) {
                                                        return 'Invalid Date';
                                                    }
                                                    return format(endDate, 'PPP', { locale: dateLocale });
                                                })() }), user?.role === 'admin' && (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: customer.agentName }))] }, customer.id)))) })] }) }) }), selectedCustomer && (_jsx(CustomerDetailsModal, { customer: selectedCustomer, onClose: () => setSelectedCustomer(null) }))] }) }));
}
