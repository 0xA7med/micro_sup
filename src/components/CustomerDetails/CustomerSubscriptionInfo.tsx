import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import CustomerField from './CustomerField';
import CustomerInput from '../CustomerInput';
import { useI18nStore } from '../../store/i18nStore';

const SUBSCRIPTION_TYPES = ['semi-annual', 'annual', 'permanent', 'trial'] as const;
const VERSION_TYPES = ['android', 'pc'] as const;

type SubscriptionType = typeof SUBSCRIPTION_TYPES[number];
type VersionType = typeof VERSION_TYPES[number];

interface CustomerSubscriptionInfoProps {
  customer: {
    subscription_type: SubscriptionType;
    version_type: VersionType;
    device_count: number;
  };
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
            name="subscription_type"
            value={customer.subscription_type}
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
            {t.subscription[customer.subscription_type]}
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
                  customer.version_type === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <input
                  type="radio"
                  name="version_type"
                  value={type}
                  checked={customer.version_type === type}
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
            {customer.version_type.toUpperCase()}
          </p>
        )}
      </CustomerField>

      <CustomerField label="عدد الأجهزة">
        <CustomerInput
          type="number"
          name="device_count"
          value={customer.device_count}
          onChange={handleChange}
          min="1"
          isEditing={isEditing}
        />
      </CustomerField>
    </>
  );
}