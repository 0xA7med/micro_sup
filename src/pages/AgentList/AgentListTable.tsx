import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Table from '../../components/ui/Table';
import { useI18nStore } from '../../store/i18nStore';
import { useNavigate } from 'react-router-dom';

interface Agent {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  address: string;
  createdAt: string;
  customerCount: number;
}

interface AgentListTableProps {
  agents: Agent[];
  onDeleteClick: (agent: Agent) => void;
  isLoading?: boolean;
}

export default function AgentListTable({
  agents,
  onDeleteClick,
  isLoading = false
}: AgentListTableProps) {
  const { translations: t } = useI18nStore();
  const navigate = useNavigate();
  const columnHelper = createColumnHelper<Agent>();

  const columns = [
    columnHelper.accessor('fullName', {
      header: t.agent.name,
      cell: (info) => (
        <button
          onClick={() => navigate(`/agent-customers/${info.row.original.id}`)}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('username', {
      header: t.auth.username,
    }),
    columnHelper.accessor('createdAt', {
      header: t.common.registrationDate,
      cell: (info) => format(new Date(info.getValue()), 'yyyy-MM-dd'),
    }),
    columnHelper.accessor('customerCount', {
      header: t.customer.totalCustomers,
      cell: (info) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: t.common.actions,
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(info.row.original);
            }}
            className="p-1 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ];

  const [searchValue, setSearchValue] = React.useState('');

  return (
    <Table
      data={agents}
      columns={columns}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
    />
  );
}