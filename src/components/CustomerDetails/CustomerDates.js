import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { format } from 'date-fns';
import CustomerField from './CustomerField';
export default function CustomerDates({ startDate, endDate }) {
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'yyyy-MM-dd');
        }
        catch (error) {
            console.error('Invalid date:', dateString);
            return 'Invalid date';
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(CustomerField, { label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0628\u062F\u0627\u064A\u0629", children: _jsx("p", { className: "text-sm text-gray-900 dark:text-gray-100", children: formatDate(startDate) }) }), _jsx(CustomerField, { label: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0646\u0647\u0627\u064A\u0629", children: _jsx("p", { className: "text-sm text-gray-900 dark:text-gray-100", children: formatDate(endDate) }) })] }));
}
