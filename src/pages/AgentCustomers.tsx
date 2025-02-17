import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import SearchInput from '../components/SearchInput';
import { createColumnHelper } from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { db } from '../db/database';
import type { Customer } from '../db/database';
import { useI18nStore } from '../store/i18nStore';

export default function AgentCustomers() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { translations: t, language } = useI18nStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [agentName, setAgentName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!agentId) return;

        const agent = await db.users.get(parseInt(agentId));
        if (agent) {
          setAgentName(agent.fullName);
        }

        const agentCustomers = await db.customers
          .where('createdBy')
          .equals(parseInt(agentId))
          .toArray();

        setCustomers(agentCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error(t.customer.fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentId, t.customer.fetchError]);

  const columnHelper = createColumnHelper<Customer>();
  const columns = [
    columnHelper.accessor('customerName', {
      header: t.customer.name,
    }),
    columnHelper.accessor('businessName', {
      header: t.customer.businessName,
    }),
    columnHelper.accessor('phone', {
      header: t.customer.phone,
    }),
    columnHelper.accessor('subscriptionType', {
      header: t.customer.subscriptionType,
    }),
    columnHelper.accessor('subscriptionEnd', {
      header: t.customer.subscriptionEnd,
      cell: (info) => format(new Date(info.getValue()), 'PPP', {
        locale: language === 'ar' ? arSA : enUS,
      }),
    }),
  ];

  if (loading) {
    return (
      <Layout title={t.customer.loading}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${t.customer.listFor} ${agentName}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/agents')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t.common.back}
          </button>
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            placeholder={t.common.search}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <DataTable
            data={customers}
            columns={columns}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        </div>
      </div>
    </Layout>
  );
}