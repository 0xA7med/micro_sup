import { jsx as _jsx } from "react/jsx-runtime";
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import Table from '../../components/ui/Table';
import { useI18nStore } from '../../store/i18nStore';
export default function AgentCustomersTable({ customers, onViewDetails }) {
    const { translations: t } = useI18nStore();
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor('customerName', {
            header: t.customer.name,
            cell: (info) => (_jsx("button", { onClick: () => onViewDetails(info.row.original), className: "text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300", children: info.getValue() })),
        }),
        columnHelper.accessor('businessName', {
            header: t.customer.businessName,
        }),
        columnHelper.accessor('phone', {
            header: t.customer.phone,
        }),
        columnHelper.accessor('subscriptionType', {
            header: t.customer.subscriptionType,
            cell: (info) => (_jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100", children: info.getValue() })),
        }),
        columnHelper.accessor('createdAt', {
            header: t.common.registrationDate,
            cell: (info) => format(new Date(info.getValue()), 'yyyy-MM-dd'),
        }),
    ];
    return (_jsx(Table, { data: customers, columns: columns }));
}
