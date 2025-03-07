import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, Search, Grid, List as ListIcon, 
  Calendar, Clock, Monitor, Smartphone, 
  CalendarDays, CalendarRange, Infinity, Filter,
  CircleDot, CheckCircle2, XCircle, RotateCcw,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import Button from '../../components/ui/Button';
import FilterButton from '../../components/ui/FilterButton';
import { useI18nStore } from '../../store/i18nStore';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';

interface Customer {
  id: number;
  customerName: string;
  businessName: string;
  businessType: string;
  phone: string;
  address: string;
  subscriptionType: string;
  versionType: string;
  deviceCount: number;
  subscriptionStart: string;
  subscriptionEnd: string;
  notes?: string;
  createdBy?: number;
  agentName: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerList() {
  const { translations: t } = useI18nStore();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isDarkMode = theme === 'dark';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    subscriptionType: '',
    versionType: '',
    status: '' // active, expired, all
  });

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, filters, customers]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await api.customers.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.customerName.toLowerCase().includes(searchLower) ||
        customer.businessName.toLowerCase().includes(searchLower) ||
        customer.phone.includes(searchTerm)
      );
    }

    // Subscription type filter
    if (filters.subscriptionType) {
      filtered = filtered.filter(customer => 
        customer.subscriptionType === filters.subscriptionType
      );
    }

    // Version type filter
    if (filters.versionType) {
      filtered = filtered.filter(customer => 
        customer.versionType === filters.versionType
      );
    }

    // Status filter
    if (filters.status) {
      const now = new Date();
      filtered = filtered.filter(customer => {
        if (customer.subscriptionType === 'Permanent') {
          return filters.status === 'active';
        }
        
        const endDate = customer.subscriptionEnd ? new Date(customer.subscriptionEnd) : null;
        const isActive = endDate ? endDate > now : false;
        return filters.status === (isActive ? 'active' : 'expired');
      });
    }

    setFilteredCustomers(filtered);
  };

  const getStatusColor = (customer: Customer) => {
    if (customer.subscriptionType === 'Permanent') {
      return isDarkMode ? 'text-green-400' : 'text-green-500';
    }

    const now = new Date();
    const endDate = customer.subscriptionEnd ? new Date(customer.subscriptionEnd) : null;
    const isActive = endDate ? endDate > now : false;

    return isActive
      ? isDarkMode ? 'text-green-400' : 'text-green-500'
      : isDarkMode ? 'text-red-400' : 'text-red-500';
  };

  // Filter options with icons
  const subscriptionOptions = [
    { value: '', label: t.subscription.subscriptionType, mobileLabel: t.subscription.subscriptionType },
    { value: 'Monthly', label: t.subscription.monthly, mobileLabel: t.subscription.monthly },
    { value: 'Semi-annual', label: t.subscription.semiannual, mobileLabel: t.subscription.semiannual },
    { value: 'Annual', label: t.subscription.annual, mobileLabel: t.subscription.annual },
    { value: 'Permanent', label: t.subscription.permanent, mobileLabel: t.subscription.permanent }
  ];

  const versionOptions = [
    { value: '', label: t.customer.versionType, mobileLabel: t.customer.versionType },
    { value: 'pc', label: t.customer.pc, mobileLabel: t.customer.pc },
    { value: 'android', label: t.customer.android, mobileLabel: t.customer.android }
  ];

  const statusOptions = [
    { value: '', label: t.subscription.status, mobileLabel: t.subscription.status },
    { value: 'active', label: t.subscription.active, mobileLabel: t.subscription.active },
    { value: 'expired', label: t.subscription.expired, mobileLabel: t.subscription.expired }
  ];

  return (
    <Layout title={t.customer.customerList}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
                {t.customer.list}
              </h1>
            </div>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              {filteredCustomers.length} {t.customer.totalCustomers}
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => navigate('/customers/new')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5"
          >
            <UserPlus className="h-5 w-5" />
            {t.customer.add}
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Search */}
            <div className="w-full lg:w-80">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.common.search}
                  className={`w-full h-10 rounded-lg border text-sm ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-10`}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Subscription Type Filter */}
              <FilterButton
                label={t.subscriptionType}
                options={subscriptionOptions}
                value={filters.subscriptionType}
                onChange={(value) => setFilters(prev => ({ ...prev, subscriptionType: value }))}
                icon={<Calendar className="h-4 w-4" />}
              />

              {/* Version Type Filter */}
              <FilterButton
                label={t.versionType}
                options={versionOptions}
                value={filters.versionType}
                onChange={(value) => setFilters(prev => ({ ...prev, versionType: value }))}
                icon={<Monitor className="h-4 w-4" />}
              />

              {/* Status Filter */}
              <FilterButton
                label={t.status}
                options={statusOptions}
                value={filters.status}
                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                icon={<CircleDot className="h-4 w-4" />}
              />

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${
                    viewMode === 'grid'
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${
                    viewMode === 'list'
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Grid/List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <UserPlus className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t.customer.noCustomers}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.customer.startByAdding}</p>
            <div className="mt-6">
              <Button variant="primary" onClick={() => navigate('/customers/new')}>
                <UserPlus className="h-5 w-5 mr-2" />
                {t.customer.add}
              </Button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {customer.customerName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {customer.businessName}
                    </p>
                  </div>
                  <div className={`flex items-center ${getStatusColor(customer)}`}>
                    {customer.subscriptionType === 'Permanent' ? (
                      <Infinity className="h-5 w-5" />
                    ) : (
                      customer.subscriptionEnd && new Date(customer.subscriptionEnd) > new Date() ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{t.subscription[customer.subscriptionType.toLowerCase()]}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {customer.versionType === 'pc' ? (
                      <Monitor className="h-4 w-4 mr-2" />
                    ) : (
                      <Smartphone className="h-4 w-4 mr-2" />
                    )}
                    <span>
                      {customer.versionType === 'pc' ? t.customer.pc : t.customer.android} ({customer.deviceCount})
                    </span>
                  </div>
                  {customer.subscriptionType !== 'Permanent' && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(customer.subscriptionEnd).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.customer.name}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.customer.business}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.subscription.type}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.customer.version}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.subscription.endDate}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t.subscription.status}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => navigate(`/customers/${customer.id}`)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {customer.customerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.businessName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {t.subscription[customer.subscriptionType.toLowerCase()]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.versionType === 'pc' ? t.customer.pc : t.customer.android} ({customer.deviceCount})
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.subscriptionType === 'Permanent' ? (
                            <Infinity className="h-4 w-4" />
                          ) : (
                            new Date(customer.subscriptionEnd).toLocaleDateString()
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${getStatusColor(customer)} flex items-center`}>
                          {customer.subscriptionType === 'Permanent' ? (
                            <Infinity className="h-4 w-4 mr-1" />
                          ) : (
                            customer.subscriptionEnd && new Date(customer.subscriptionEnd) > new Date() ? (
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )
                          )}
                          <span>
                            {customer.subscriptionType === 'Permanent'
                              ? t.subscription.permanent
                              : customer.subscriptionEnd && new Date(customer.subscriptionEnd) > new Date()
                              ? t.subscription.active
                              : t.subscription.expired}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
