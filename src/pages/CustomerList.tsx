import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArrowUpDown, ArrowLeft, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { useI18nStore } from '../store/i18nStore';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Layout from '../components/Layout';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import Header from '../components/Header';
import { api } from '../lib/api';

const API_URL = 'http://localhost:5000';

export default function CustomerList() {
  const navigate = useNavigate();
  const { translations: t, language, setLanguage } = useI18nStore();
  const user = useAuthStore((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await api.customers.getAll();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [user]);

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const filteredCustomers = customers
    .filter((customer) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.customerName.toLowerCase().includes(searchLower) ||
        customer.businessName.toLowerCase().includes(searchLower) ||
        customer.phone.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const dateLocale = language === 'ar' ? arSA : enUS;

  return (
    <Layout title={t.customer.list}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t.common.back}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/customers/add')} className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {t.customer.add}
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
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
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('customerName')}
                  >
                    <div className="flex items-center gap-2">
                      {t.customer.name}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('businessName')}
                  >
                    <div className="flex items-center gap-2">
                      {t.customer.businessName}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center gap-2">
                      {t.customer.phone}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('subscription_type')}
                  >
                    <div className="flex items-center gap-2">
                      {t.customer.subscriptionType}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('subscriptionEnd')}
                  >
                    <div className="flex items-center gap-2">
                      {t.customer.subscriptionEnd}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  {user?.role === 'admin' && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {t.customer.agent}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={user?.role === 'admin' ? 6 : 5}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      {t.common.loading}
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={user?.role === 'admin' ? 6 : 5}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      {t.customer.noResults}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {customer.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {customer.businessName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                          {t.subscription[customer.subscriptionType.toLowerCase()]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {(() => {
                          const endDate = new Date(customer.subscriptionEnd);
                          console.log('Subscription End Date:', endDate);
                          if (isNaN(endDate.getTime())) {
                            return 'Invalid Date';
                          }
                          return format(endDate, 'PPP', { locale: dateLocale });
                        })()}
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {customer.agentName}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedCustomer && (
          <CustomerDetailsModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>
    </Layout>
  );
}