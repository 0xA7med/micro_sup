import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { useI18nStore } from '../../store/i18nStore';
export default function AgentListHeader({ searchValue, onSearchChange, }) {
    const { translations: t } = useI18nStore();
    return (_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-4 mb-6", children: [_jsx(PageHeader, { title: t.agent.list, backUrl: "/" }), _jsxs("div", { className: "relative w-full sm:w-96", children: [_jsx("label", { htmlFor: "agent-search", className: "sr-only", children: t.common.search }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "search", id: "agent-search", name: "agent-search", className: "block w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", placeholder: t.common.search, value: searchValue, onChange: (e) => onSearchChange(e.target.value), autoComplete: "off", "aria-label": t.common.search })] })] }), _jsx(Link, { to: "/agents/new", className: "w-full sm:w-auto", "aria-label": t.agent.addNew, children: _jsx(Button, { variant: "primary", className: "w-full sm:w-auto", icon: Plus, children: t.agent.addNew }) })] }));
}
