import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "../../components/Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/database";
import { useAuthStore } from "../../store/authStore";
import { useI18nStore } from "../../store/i18nStore";
import { format } from 'date-fns';
import type { Customer } from '../../db/database';
import CustomerDetailsModal from '../../components/CustomerDetailsModal';

export default function MyCustomers() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { translations: t } = useI18nStore();
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  const customers = useLiveQuery(
    () => user?.id ? 
      db.customers
        .where('createdBy')
        .equals(user.id)
        .reverse()
        .sortBy('createdAt')
    : []
  ) || [];

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setSelectedCustomer(updatedCustomer);
  };

  return (
    <Layout title={t.agent.customers}>
      <div className="space-y-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t.common.back}
        </button>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead className="table-head">
                <tr>
                  <th className="table-header">
                    {t.customer.name}
                  </th>
                  <th className="table-header">
                    {t.customer.businessName}
                  </th>
                  <th className="table-header">
                    {t.customer.phone}
                  </th>
                  <th className="table-header">
                    {t.customer.subscriptionType}
                  </th>
                  <th className="table-header">
                    {t.customer.endDate}
                  </th>
                </tr>
              </thead>
              <tbody className="table-body">
                {customers.map((customer) => (
                  <tr 
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="table-row"
                  >
                    <td className="table-cell">
                      <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                        {customer.customerName}
                      </span>
                    </td>
                    <td className="table-cell">
                      {customer.businessName}
                    </td>
                    <td className="table-cell">
                      {customer.phone}
                    </td>
                    <td className="table-cell">
                      <span className="badge badge-success">
                        {t.subscription[customer.subscriptionType.toLowerCase() as keyof typeof t.subscription]}
                      </span>
                    </td>
                    <td className="table-cell">
                      {format(customer.subscriptionEnd, 'yyyy-MM-dd')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedCustomer && (
          <CustomerDetailsModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onUpdate={handleCustomerUpdate}
          />
        )}
      </div>
    </Layout>
  );
}