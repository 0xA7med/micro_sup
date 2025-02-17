import React from 'react';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { Monitor, Smartphone, X } from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';
import type { Customer } from '../db/database';

interface CustomerDetailsModalProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerDetailsModal({
  customer,
  onClose,
}: CustomerDetailsModalProps) {
  const { translations: t, language } = useI18nStore();
  const dateLocale = language === 'ar' ? arSA : enUS;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.customer.details}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {t.customer.basicInfo}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.name}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {customer.customerName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.businessName}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {customer.businessName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.businessType}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {customer.businessType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.phone}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {customer.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.address}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {customer.address}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {t.customer.subscriptionInfo}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.activationCode}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white font-mono">
                    {customer.activationCode}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.subscriptionType}
                  </label>
                  <p className="mt-1">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                      {t.subscription[customer.subscriptionType.toLowerCase()]}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.versionType}
                  </label>
                  <p className="mt-1 flex items-center text-gray-900 dark:text-white">
                    {customer.versionType === 'pc' ? (
                      <Monitor className="h-5 w-5 mr-2" />
                    ) : (
                      <Smartphone className="h-5 w-5 mr-2" />
                    )}
                    {t.version[customer.versionType]}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.deviceCount}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {customer.deviceCount}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.subscriptionStart}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {format(new Date(customer.subscriptionStart), 'PPP', {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.customer.subscriptionEnd}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {format(new Date(customer.subscriptionEnd), 'PPP', {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {customer.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {t.customer.notes}
              </h3>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {customer.notes}
              </p>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>
              {t.common.createdBy}: {customer.agentName}
            </p>
            <p>
              {t.common.createdAt}:{' '}
              {format(new Date(customer.createdAt), 'PPP', {
                locale: dateLocale,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}