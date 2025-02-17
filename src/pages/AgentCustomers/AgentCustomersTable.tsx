import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import Table from '../../components/ui/Table';
import { useI18nStore } from '../../store/i18nStore';

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

interface AgentCustomersTableProps {
  customers: Customer[];
  onViewDetails: (customer: Customer) => void;
}

export default function AgentCustomersTable({
  customers,
  onViewDetails
}: AgentCustomersTableProps) {
  const { translations: t } = useI18nStore();
  const columnHelper = createColumnHelper<Customer>();

  const columns = [
    columnHelper.accessor('customerName', {
      header: t.customer.name,
      cell: (info) => (
        <button
          onClick={() => onViewDetails(info.row.original)}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('businessName', {
      header: t.customer.businessName,
    }),
    columnHelper.accessor('phone', {
      header: t.customer.phone,
    }),
    columnHelper.accessor('subscriptionType', {
      header: t.customer.subscriptionType,
      cell: (info) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: t.common.registrationDate,
      cell: (info) => format(new Date(info.getValue()), 'yyyy-MM-dd'),
    }),
  ];

  return (
    <Table
      data={customers}
      columns={columns}
    />
  );
}