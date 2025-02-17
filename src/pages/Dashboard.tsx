import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, ClipboardList, Database } from 'lucide-react';
import Layout from '../components/Layout';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { addDays, format } from 'date-fns';
import { useI18nStore } from '../store/i18nStore';
import { useAuthStore } from '../store/authStore';
import DatabaseBackup from '../components/DatabaseBackup';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import type { Customer } from '../db/database';

export default function Dashboard() {
  const navigate = useNavigate();
  const { translations: t } = useI18nStore();
  const user = useAuthStore(state => state.user);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showBackupModal, setShowBackupModal] = useState(false);
  
  const stats = useLiveQuery(async () => {
    try {
      console.log('Fetching stats...');
      const now = new Date();
      const twentyDaysFromNow = addDays(now, 20);
      
      const totalCustomers = await db.customers.count();
      const activeSubscriptions = await db.customers
        .filter(customer => customer.subscriptionEnd && new Date(customer.subscriptionEnd) > now)
        .count();
      const expiringSubscriptions = await db.customers
        .filter(customer => 
          customer.subscriptionEnd && 
          new Date(customer.subscriptionEnd) > now && 
          new Date(customer.subscriptionEnd) <= twentyDaysFromNow
        )
        .count();

      console.log('Stats fetched:', { totalCustomers, activeSubscriptions, expiringSubscriptions });
      return {
        totalCustomers,
        activeSubscriptions,
        expiringSubscriptions,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalCustomers: 0,
        activeSubscriptions: 0,
        expiringSubscriptions: 0,
      };
    }
  }, []);

  const recentCustomers = useLiveQuery(async () => {
    try {
      console.log('Fetching recent customers...');
      return await db.customers
        .orderBy('createdAt')
        .reverse()
        .limit(5)
        .toArray();
    } catch (error) {
      console.error('Error fetching recent customers:', error);
      return [];
    }
  }, []);

  const handleCustomerUpdate = async (updatedCustomer: Customer) => {
    try {
      if (!updatedCustomer.id) return;
      await db.customers.update(updatedCustomer.id, updatedCustomer);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return (
    <Layout title={t.dashboard.title}>
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Customers */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.dashboard.totalCustomers}</p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats?.totalCustomers || 0}</h3>
              </div>
            </div>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.dashboard.activeSubscriptions}</p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats?.activeSubscriptions || 0}</h3>
              </div>
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.dashboard.expiringSubscriptions}</p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{stats?.expiringSubscriptions || 0}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.dashboard.recentCustomers}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
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
                    {t.subscription.endDate}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentCustomers?.map((customer) => (
                  <tr 
                    key={customer.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {customer.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {customer.businessName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {t.subscription[customer.subscriptionType.toLowerCase()]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {customer.subscriptionEnd ? format(new Date(customer.subscriptionEnd), 'dd/MM/yyyy') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <CustomerDetailsModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onUpdate={handleCustomerUpdate}
          />
        )}

        {/* Database Backup Modal */}
        {showBackupModal && (
          <DatabaseBackup
            onClose={() => setShowBackupModal(false)}
          />
        )}
      </div>
    </Layout>
  );
}