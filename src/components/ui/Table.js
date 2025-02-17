import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, } from '@tanstack/react-table';
import Button from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18nStore } from '../../store/i18nStore';
export default function Table({ data, columns, searchValue, onSearchChange }) {
    const { translations: t } = useI18nStore();
    const table = useReactTable({
        data,
        columns,
        state: { globalFilter: searchValue },
        onGlobalFilterChange: onSearchChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (_jsxs("div", { children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: table.getHeaderGroups().map((headerGroup) => (_jsx("tr", { children: headerGroup.headers.map((header) => (_jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: flexRender(header.column.columnDef.header, header.getContext()) }, header.id))) }, headerGroup.id))) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: table.getRowModel().rows.map((row) => (_jsx("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700", children: row.getVisibleCells().map((cell) => (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100", children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id))) })] }) }), _jsxs("div", { className: "flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "secondary", size: "sm", icon: ChevronRight, onClick: () => table.previousPage(), disabled: !table.getCanPreviousPage(), children: t.common.back }), _jsx(Button, { variant: "secondary", size: "sm", icon: ChevronLeft, iconPosition: "right", onClick: () => table.nextPage(), disabled: !table.getCanNextPage(), children: t.common.next })] }), _jsxs("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: [t.common.page, " ", table.getState().pagination.pageIndex + 1, " ", t.common.of, ' ', table.getPageCount()] })] })] }));
}
