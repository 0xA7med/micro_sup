import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, ClipboardList } from 'lucide-react';
import Layout from '../components/Layout';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { addDays, format } from 'date-fns';
import { useI18nStore } from '../store/i18nStore';
import { useAuthStore } from '../store/authStore';
import DatabaseBackup from '../components/DatabaseBackup';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
export default function Dashboard() {
    const navigate = useNavigate();
    const { translations: t } = useI18nStore();
    const user = useAuthStore(state => state.user);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showBackupModal, setShowBackupModal] = useState(false);
    const stats = useLiveQuery(async () => {
        try {
            console.log('Fetching stats...');
            const now = new Date();
            const twentyDaysFromNow = addDays(now, 20);
            const totalCustomers = await db.customers.count();
            const activeSubscriptions = await db.customers
                .filter(customer => customer.subscriptionEnd && new Date(customer.subscriptionEnd) > now)
                .count();
            const expiringSubscriptions = await db.customers
                .filter(customer => customer.subscriptionEnd &&
                new Date(customer.subscriptionEnd) > now &&
                new Date(customer.subscriptionEnd) <= twentyDaysFromNow)
                .count();
            console.log('Stats fetched:', { totalCustomers, activeSubscriptions, expiringSubscriptions });
            return {
                totalCustomers,
                activeSubscriptions,
                expiringSubscriptions,
            };
        }
        catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalCustomers: 0,
                activeSubscriptions: 0,
                expiringSubscriptions: 0,
            };
        }
    }, []);
    const recentCustomers = useLiveQuery(async () => {
        try {
            console.log('Fetching recent customers...');
            return await db.customers
                .orderBy('createdAt')
                .reverse()
                .limit(5)
                .toArray();
        }
        catch (error) {
            console.error('Error fetching recent customers:', error);
            return [];
        }
    }, []);
    const handleCustomerUpdate = async (updatedCustomer) => {
        try {
            if (!updatedCustomer.id)
                return;
            await db.customers.update(updatedCustomer.id, updatedCustomer);
            setSelectedCustomer(null);
        }
        catch (error) {
            console.error('Error updating customer:', error);
        }
    };
    return (_jsx(Layout, { title: t.dashboard.title, children: _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "h-8 w-8 text-indigo-500" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: t.dashboard.totalCustomers }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: stats?.totalCustomers || 0 })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx(UserPlus, { className: "h-8 w-8 text-green-500" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: t.dashboard.activeSubscriptions }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: stats?.activeSubscriptions || 0 })] })] }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx(ClipboardList, { className: "h-8 w-8 text-yellow-500" }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: t.dashboard.expiringSubscriptions }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: stats?.expiringSubscriptions || 0 })] })] }) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: t.dashboard.recentCustomers }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t.customer.name }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t.customer.business }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t.subscription.type }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: t.subscription.endDate })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: recentCustomers?.map((customer) => (_jsxs("tr", { className: "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700", onClick: () => setSelectedCustomer(customer), children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: customer.customerName }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: customer.businessName }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: t.subscription[customer.subscriptionType.toLowerCase()] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: customer.subscriptionEnd ? format(new Date(customer.subscriptionEnd), 'dd/MM/yyyy') : '-' })] }, customer.id))) })] }) })] }), selectedCustomer && (_jsx(CustomerDetailsModal, { customer: selectedCustomer, onClose: () => setSelectedCustomer(null), onUpdate: handleCustomerUpdate })), showBackupModal && (_jsx(DatabaseBackup, { onClose: () => setShowBackupModal(false) }))] }) }));
}
