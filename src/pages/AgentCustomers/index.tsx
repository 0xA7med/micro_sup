import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import AgentCustomersHeader from './AgentCustomersHeader';
import AgentCustomersTable from './AgentCustomersTable';
import CustomerDetailsModal from '../../components/CustomerDetailsModal';
import { useI18nStore } from '../../store/i18nStore';
import { api } from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Customer {
  id: number;
  customerName: string;
  businessName: string;
  businessType: string;
  phone: string;
  address: string;
  activationCode: string;
  subscriptionType: string;
  versionType: string;
  deviceCount: number;
  subscriptionStart: string;
  subscriptionEnd: string;
  notes: string;
  createdBy: number;
  agentName: string;
  createdAt: string;
}

interface Agent {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  address: string;
  createdAt: string;
}

export default function AgentCustomers() {
  const { agentId } = useParams();
  const { translations: t } = useI18nStore();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!agentId) return;
      
      try {
        // Fetch agent details
        const agentData = await api.agents.getById(parseInt(agentId));
        setAgent(agentData);

        // Fetch customers
        const customerData = await api.customers.getByAgent(parseInt(agentId));
        setCustomers(customerData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t.common.error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentId, t.common.error]);

  if (loading) {
    return (
      <Layout title={t.agent.customers}>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!agent) return null;

  const filteredCustomers = customers.filter(customer =>
    customer.customerName.toLowerCase().includes(searchValue.toLowerCase()) ||
    customer.businessName.toLowerCase().includes(searchValue.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Layout title={`${t.agent.customers} - ${agent.fullName}`}>
      <div className="space-y-6">
        <AgentCustomersHeader
          agentName={agent.fullName}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        
        <AgentCustomersTable
          customers={filteredCustomers}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onCustomerClick={setSelectedCustomer}
        />

        {selectedCustomer && (
          <CustomerDetailsModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </Layout>
  );
}