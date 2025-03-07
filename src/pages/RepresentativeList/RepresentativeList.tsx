import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  ArrowUpDown,
  UserCircle,
  Phone,
  Mail,
  Edit,
} from 'lucide-react';
import { useI18nStore } from '../../store/i18nStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../../db/database';
import type { User } from '../../db/database';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import Button from '../../components/ui/Button';
import Layout from '../../components/Layout';

export default function RepresentativeList() {
  const navigate = useNavigate();
  const { translations: t, language } = useI18nStore();
  const user = useAuthStore((state) => state.user);
  const [representatives, setRepresentatives] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [representativeToDelete, setRepresentativeToDelete] = useState<User | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: 'asc' | 'desc';
  }>({ key: 'createdAt', direction: 'desc' });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const fetchRepresentatives = async () => {
      try {
        const allRepresentatives = await db.users
          .where('role')
          .equals('representative')
          .toArray();
        setRepresentatives(allRepresentatives);
      } catch (error) {
        console.error('Error fetching representatives:', error);
        toast.error(t.agent.fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchRepresentatives();
  }, [t.agent.fetchError]);

  const handleSort = (key: keyof User) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const handleDelete = async () => {
    if (!representativeToDelete) return;

    try {
      await db.users.delete(representativeToDelete.id!);
      setRepresentatives((prev) =>
        prev.filter((rep) => rep.id !== representativeToDelete.id)
      );
      toast.success(t.agent.deleteSuccess);
    } catch (error) {
      console.error('Error deleting representative:', error);
      toast.error(t.agent.deleteError);
    } finally {
      setShowDeleteModal(false);
      setRepresentativeToDelete(null);
    }
  };

  const handleEdit = (representative: User) => {
    navigate(`/representatives/edit/${representative.id}`);
  };

  const filteredRepresentatives = representatives
    .filter((rep) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        rep.username.toLowerCase().includes(searchLower) ||
        rep.fullName.toLowerCase().includes(searchLower) ||
        (rep.email && rep.email.toLowerCase().includes(searchLower)) ||
        (rep.phone && rep.phone.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (!aValue || !bValue) return 0;

      if (sortConfig.direction === 'asc') {
        return String(aValue) > String(bValue) ? 1 : -1;
      } else {
        return String(aValue) < String(bValue) ? 1 : -1;
      }
    });

  const dateLocale = language === 'ar' ? arSA : enUS;

  const columns = [
    {
      title: t.agent.name,
      dataIndex: 'fullName',
      key: 'fullName',
      filteredValue: [searchTerm],
      onFilter: (value: string, record: User) =>
        record.fullName.toLowerCase().includes(value.toLowerCase()) ||
        record.username.toLowerCase().includes(value.toLowerCase()) ||
        (record.email && record.email.toLowerCase().includes(value.toLowerCase())) ||
        (record.phone && record.phone.toLowerCase().includes(value.toLowerCase())),
    },
    {
      title: t.common.contact,
      key: 'contact',
      render: (_: any, record: User) => (
        <div className="space-y-1">
          {record.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              {record.phone}
            </div>
          )}
          {record.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              {record.email}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t.common.createdAt,
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'PPP', {
        locale: dateLocale,
      }),
    },
    {
      title: t.common.actions,
      key: 'action',
      render: (_: any, record: User) => (
        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => handleEdit(record)}
            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              setRepresentativeToDelete(record);
              setShowDeleteModal(true);
            }}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout title={t.agent.list}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{t.common.back}</span>
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {t.agent.list}
              </h1>
            </div>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              {filteredRepresentatives.length} {t.agent.list}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t.common.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg ${
                  viewMode === 'table'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            <Button
              onClick={() => navigate('/representatives/add')}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {t.agent.add}
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {t.common.loading}
            </div>
          ) : filteredRepresentatives.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              {t.agent.noResults}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredRepresentatives.map((representative) => (
                <div
                  key={representative.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <UserCircle className="h-12 w-12 text-indigo-500" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {representative.fullName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{representative.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleEdit(representative)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setRepresentativeToDelete(representative);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {representative.phone && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 mr-2" />
                        {representative.phone}
                      </div>
                    )}
                    {representative.email && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2" />
                        {representative.email}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                      {t.common.createdAt}:{' '}
                      {format(new Date(representative.createdAt), 'PPP', {
                        locale: dateLocale,
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {columns.map((column) => (
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        key={column.key}
                      >
                        {column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRepresentatives.map((representative) => (
                    <tr key={representative.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {columns.map((column) => (
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                          key={column.key}
                        >
                          {column.render ? column.render(representative) : representative[column.dataIndex as keyof User]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showDeleteModal && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setRepresentativeToDelete(null);
            }}
            onConfirm={handleDelete}
            title={t.agent.deleteTitle}
            message={t.agent.deleteConfirmation}
            description={representativeToDelete?.fullName}
          />
        )}
      </div>
    </Layout>
  );
}
