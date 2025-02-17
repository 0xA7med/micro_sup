import { jsx as _jsx } from "react/jsx-runtime";
import { createColumnHelper } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Table from '../../components/ui/Table';
import { useI18nStore } from '../../store/i18nStore';
import { useNavigate } from 'react-router-dom';
export default function AgentListTable({ agents, onDeleteClick }) {
    const { translations: t } = useI18nStore();
    const navigate = useNavigate();
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor('fullName', {
            header: t.agent.name,
            cell: (info) => (_jsx("button", { onClick: () => navigate(`/agent-customers/${info.row.original.id}`), className: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300", children: info.getValue() })),
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
            cell: (info) => (_jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100", children: info.getValue() })),
        }),
        columnHelper.display({
            id: 'actions',
            header: t.common.actions,
            cell: (info) => (_jsx("div", { className: "flex items-center gap-2", children: _jsx("button", { onClick: (e) => {
                        e.stopPropagation();
                        onDeleteClick(info.row.original);
                    }, className: "p-1 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300", children: _jsx(Trash2, { className: "h-4 w-4" }) }) })),
        }),
    ];
    return (_jsx(Table, { data: agents, columns: columns }));
}
