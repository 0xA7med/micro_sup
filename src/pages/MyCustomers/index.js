import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "../../components/Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/database";
import { useAuthStore } from "../../store/authStore";
import { useI18nStore } from "../../store/i18nStore";
import { format } from 'date-fns';
import CustomerDetailsModal from '../../components/CustomerDetailsModal';
export default function MyCustomers() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { translations: t } = useI18nStore();
    const [selectedCustomer, setSelectedCustomer] = React.useState(null);
    const customers = useLiveQuery(() => user?.id ?
        db.customers
            .where('createdBy')
            .equals(user.id)
            .reverse()
            .sortBy('createdAt')
        : []) || [];
    const handleCustomerUpdate = (updatedCustomer) => {
        setSelectedCustomer(updatedCustomer);
    };
    return (_jsx(Layout, { title: t.agent.customers, children: _jsxs("div", { className: "space-y-6", children: [_jsxs("button", { onClick: () => navigate('/'), className: "flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white", children: [_jsx(ArrowLeft, { className: "h-5 w-5 mr-2" }), t.common.back] }), _jsx("div", { className: "card", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "table-base", children: [_jsx("thead", { className: "table-head", children: _jsxs("tr", { children: [_jsx("th", { className: "table-header", children: t.customer.name }), _jsx("th", { className: "table-header", children: t.customer.businessName }), _jsx("th", { className: "table-header", children: t.customer.phone }), _jsx("th", { className: "table-header", children: t.customer.subscriptionType }), _jsx("th", { className: "table-header", children: t.customer.endDate })] }) }), _jsx("tbody", { className: "table-body", children: customers.map((customer) => (_jsxs("tr", { onClick: () => setSelectedCustomer(customer), className: "table-row", children: [_jsx("td", { className: "table-cell", children: _jsx("span", { className: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300", children: customer.customerName }) }), _jsx("td", { className: "table-cell", children: customer.businessName }), _jsx("td", { className: "table-cell", children: customer.phone }), _jsx("td", { className: "table-cell", children: _jsx("span", { className: "badge badge-success", children: t.subscription[customer.subscriptionType.toLowerCase()] }) }), _jsx("td", { className: "table-cell", children: format(customer.subscriptionEnd, 'yyyy-MM-dd') })] }, customer.id))) })] }) }) }), selectedCustomer && (_jsx(CustomerDetailsModal, { customer: selectedCustomer, onClose: () => setSelectedCustomer(null), onUpdate: handleCustomerUpdate }))] }) }));
}
