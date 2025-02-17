import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import AgentCustomersHeader from './AgentCustomersHeader';
import AgentCustomersTable from './AgentCustomersTable';
import CustomerDetailsModal from '../../components/CustomerDetailsModal';
import { useI18nStore } from '../../store/i18nStore';
import { api } from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
export default function AgentCustomers() {
    const { agentId } = useParams();
    const { translations: t } = useI18nStore();
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [agent, setAgent] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            if (!agentId)
                return;
            try {
                // Fetch agent details
                const agentData = await api.agents.getById(parseInt(agentId));
                setAgent(agentData);
                // Fetch customers
                const customerData = await api.customers.getByAgent(parseInt(agentId));
                setCustomers(customerData);
            }
            catch (error) {
                console.error('Error fetching data:', error);
                toast.error(t.common.error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [agentId, t.common.error]);
    if (loading) {
        return (_jsx(Layout, { title: t.agent.customers, children: _jsx("div", { className: "flex justify-center items-center h-64", children: _jsx(LoadingSpinner, { size: "lg" }) }) }));
    }
    if (!agent)
        return null;
    const filteredCustomers = customers.filter(customer => customer.customerName.toLowerCase().includes(searchValue.toLowerCase()) ||
        customer.businessName.toLowerCase().includes(searchValue.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchValue.toLowerCase()));
    return (_jsx(Layout, { title: `${t.agent.customers} - ${agent.fullName}`, children: _jsxs("div", { className: "space-y-6", children: [_jsx(AgentCustomersHeader, { agentName: agent.fullName, searchValue: searchValue, onSearchChange: setSearchValue }), _jsx(AgentCustomersTable, { customers: filteredCustomers, searchValue: searchValue, onSearchChange: setSearchValue, onCustomerClick: setSelectedCustomer }), selectedCustomer && (_jsx(CustomerDetailsModal, { customer: selectedCustomer, onClose: () => setSelectedCustomer(null) }))] }) }));
}
