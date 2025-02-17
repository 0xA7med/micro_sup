import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../db/database';
import type { User } from '../db/database';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Button from '../components/ui/Button';
import Layout from '../components/Layout';

export default function AgentList() {
  const navigate = useNavigate();
  const { translations: t, language } = useI18nStore();
  const user = useAuthStore((state) => state.user);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<User | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const allAgents = await db.users
          .where('role')
          .equals('representative')
          .toArray();
        setAgents(allAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast.error(t.agent.fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [t.agent.fetchError]);

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const handleDelete = async () => {
    if (!agentToDelete) return;

    try {
      await db.users.delete(agentToDelete.id!);
      setAgents((prev) =>
        prev.filter((agent) => agent.id !== agentToDelete.id)
      );
      toast.success(t.agent.deleteSuccess);
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error(t.agent.deleteError);
    } finally {
      setShowDeleteModal(false);
      setAgentToDelete(null);
    }
  };

  const filteredAgents = agents
    .filter((agent) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        agent.username.toLowerCase().includes(searchLower) ||
        agent.fullName.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key as keyof User];
      const bValue = b[sortConfig.key as keyof User];

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const dateLocale = language === 'ar' ? arSA : enUS;

  return (
    <Layout title={t.agent.list}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t.common.back}
          </button>

          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t.common.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <Button
            onClick={() => navigate('/representatives/add')}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            {t.agent.add}
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center gap-2">
                      {t.agent.name}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('username')}
                  >
                    <div className="flex items-center gap-2">
                      {t.auth.username}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2">
                      {t.common.createdAt}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {t.common.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      {t.common.loading}
                    </td>
                  </tr>
                ) : filteredAgents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      {t.agent.noResults}
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {agent.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {agent.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {format(new Date(agent.created_at), 'PPP', {
                          locale: dateLocale,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setAgentToDelete(agent);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showDeleteModal && (
          <DeleteConfirmationModal
            onConfirm={handleDelete}
            onCancel={() => {
              setShowDeleteModal(false);
              setAgentToDelete(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}