import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import CustomerField from './CustomerField';
import CustomerInput from '../CustomerInput';
import { useI18nStore } from '../../store/i18nStore';
import { Customer } from '../../db/database';

const SUBSCRIPTION_TYPES = ['semi-annual', 'annual', 'permanent', 'trial'] as const;
const VERSION_TYPES = ['android', 'pc'] as const;

type SubscriptionType = typeof SUBSCRIPTION_TYPES[number];
type VersionType = typeof VERSION_TYPES[number];

interface CustomerSubscriptionInfoProps {
  customer: Customer;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function CustomerSubscriptionInfo({
  customer,
  isEditing,
  handleChange
}: CustomerSubscriptionInfoProps) {
  const { translations: t } = useI18nStore();
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <>
      <CustomerField label="نوع الاشتراك">
        {isEditing ? (
          <select
            name="subscriptionType"
            value={customer.subscriptionType}
            onChange={handleChange}
            className="form-select"
          >
            {SUBSCRIPTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.subscription[type]}
              </option>
            ))}
          </select>
        ) : (
          <p className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t.subscription[customer.subscriptionType as SubscriptionType]}
          </p>
        )}
      </CustomerField>

      <CustomerField label="نوع النسخة">
        {isEditing ? (
          <div className="flex gap-4">
            {VERSION_TYPES.map((type) => (
              <label
                key={type}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  customer.versionType === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <input
                  type="radio"
                  name="versionType"
                  value={type}
                  checked={customer.versionType === type}
                  onChange={handleChange}
                  className="hidden"
                />
                {type === 'android' ? (
                  <Smartphone className="w-5 h-5" />
                ) : (
                  <Monitor className="w-5 h-5" />
                )}
                <span>{type.toUpperCase()}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {customer.versionType.toUpperCase()}
          </p>
        )}
      </CustomerField>

      <CustomerField label="عدد الأجهزة">
        <CustomerInput
          type="number"
          name="deviceCount"
          value={customer.deviceCount}
          onChange={handleChange}
          min="1"
          isEditing={isEditing}
        />
      </CustomerField>
    </>
  );
}