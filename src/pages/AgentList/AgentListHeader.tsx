import React from 'react';
import { Plus, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import { useI18nStore } from '../../store/i18nStore';

interface AgentListHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function AgentListHeader({
  searchValue,
  onSearchChange,
}: AgentListHeaderProps) {
  const { translations: t } = useI18nStore();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <PageHeader title={t.agent.list} backUrl="/" />
      <div className="relative w-full sm:w-96">
        <label htmlFor="agent-search" className="sr-only">
          {t.common.search}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="search"
            id="agent-search"
            name="agent-search"
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={t.common.search}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
            aria-label={t.common.search}
          />
        </div>
      </div>

      <Link
        to="/agents/new"
        className="w-full sm:w-auto"
        aria-label={t.agent.addNew}
      >
        <Button
          variant="primary"
          className="w-full sm:w-auto"
          icon={Plus}
        >
          {t.agent.addNew}
        </Button>
      </Link>
    </div>
  );
}