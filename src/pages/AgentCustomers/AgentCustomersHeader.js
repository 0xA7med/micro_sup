import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/SearchInput';
import { useI18nStore } from '../../store/i18nStore';
export default function AgentCustomersHeader({ agentName, searchValue, onSearchChange }) {
    const { translations: t } = useI18nStore();
    return (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(PageHeader, { title: `${t.agent.customers} - ${agentName}`, backUrl: "/agents" }), _jsx(SearchInput, { value: searchValue, onChange: onSearchChange, placeholder: t.common.search })] }));
}
