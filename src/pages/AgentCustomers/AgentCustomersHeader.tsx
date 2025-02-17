import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/SearchInput';
import { useI18nStore } from '../../store/i18nStore';

interface AgentCustomersHeaderProps {
  agentName: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function AgentCustomersHeader({ agentName, searchValue, onSearchChange }: AgentCustomersHeaderProps) {
  const { translations: t } = useI18nStore();

  return (
    <div className="flex justify-between items-center">
      <PageHeader 
        title={`${t.agent.customers} - ${agentName}`} 
        backUrl="/agents" 
      />
      <SearchInput
        value={searchValue}
        onChange={onSearchChange}
        placeholder={t.common.search}
      />
    </div>
  );
}