import React from 'react';
import { format } from 'date-fns';
import { useI18nStore } from '../../store/i18nStore';
import Card from '../../components/ui/Card';

interface Customer {
  id: number;
  customerName: string;
  businessName: string;
  businessType: string;
  phone: string;
  address: string;
  activationCode: string;
  subscriptionType: string;
  versionType: string;
  deviceCount: number;
  subscriptionStart: string;
  subscriptionEnd: string;
  notes: string;
  createdBy: number;
  agentName: string;
  createdAt: string;
}

interface RecentCustomersTableProps {
  customers: Customer[];
  onViewDetails: (customer: Customer) => void;
}

export default function RecentCustomersTable({
  customers,
  onViewDetails
}: RecentCustomersTableProps) {
  const { translations: t } = useI18nStore();

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t.customer.name}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t.customer.businessName}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t.customer.phone}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t.agent.name}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t.customer.subscriptionType}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t.customer.endDate}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => onViewDetails(customer)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                    {customer.customerName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {customer.businessName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {customer.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {customer.agentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                    {t.subscription[customer.subscriptionType.toLowerCase()]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {format(new Date(customer.subscriptionEnd), 'yyyy-MM-dd')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}