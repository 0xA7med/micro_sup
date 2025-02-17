import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import CustomerField from './CustomerField';
import CustomerInput from '../CustomerInput';
import { useI18nStore } from '../../store/i18nStore';

const SUBSCRIPTION_TYPES = ['Semi-annual', 'Annual', 'Permanent', 'Trial'];
const VERSION_TYPES = ['android', 'pc'];

interface CustomerSubscriptionInfoProps {
  customer: any;
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
                {t.subscription[type.toLowerCase()]}
              </option>
            ))}
          </select>
        ) : (
          <p className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t.subscription[customer.subscription_type.toLowerCase()]}
          </p>
        )}
      </CustomerField>

      <CustomerField label="نوع النسخة">
        {isEditing ? (
          <div className="flex gap-4">
            {VERSION_TYPES.map((type) => (
              <label
                key={type}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer ${
                  customer.version_type === type
                    ? isDarkMode
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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
                {type === 'pc' ? (
                  <Monitor className="h-5 w-5" />
                ) : (
                  <Smartphone className="h-5 w-5" />
                )}
                <span>{t.customer[type]}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {t.customer[customer.version_type]}
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