import React, { useRef, useState, useEffect } from 'react';
import { Monitor, Smartphone, Calendar } from 'lucide-react';
import { useI18nStore } from '../../store/i18nStore';
import { useThemeStore } from '../../store/themeStore';
import { format, parse, isAfter, startOfToday } from 'date-fns';
import CustomerField from '../../components/CustomerField';
import CustomerInput from '../../components/CustomerInput';
import CustomerSelect from '../../components/CustomerSelect';
import CustomerTextArea from '../../components/CustomerTextArea';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

interface CustomerFormData {
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
  agentName: string;
}

interface CustomerFormProps {
  formData: CustomerFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onPaste: () => Promise<void>;
}

const SUBSCRIPTION_TYPES = ['Monthly', 'Semi-annual', 'Annual', 'Permanent'];
const VERSION_TYPES = ['pc', 'android'];

export default function CustomerForm({ formData, onChange, onSubmit, onPaste }: CustomerFormProps) {
  const { translations: t, language } = useI18nStore();
  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';
  const today = startOfToday();
  const [dateInputValue, setDateInputValue] = useState('');

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    setDateInputValue(formatDateForDisplay(formData.subscriptionStart));
  }, [formData.subscriptionStart]);

  const handleDateInput = (value: string) => {
    let cleanValue = value.replace(/[^\d/]/g, '');
    
    if (cleanValue.length === 2 && !cleanValue.includes('/')) {
      cleanValue = cleanValue + '/';
    } else if (cleanValue.length === 5 && cleanValue.split('/').length === 2) {
      cleanValue = cleanValue + '/';
    }
    
    cleanValue = cleanValue.slice(0, 10);
    
    setDateInputValue(cleanValue);

    if (cleanValue.length === 10) {
      const [day, month, year] = cleanValue.split('/');
      try {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        if (!isNaN(date.getTime())) {
          if (isAfter(date, today)) {
            toast.error(t.subscription.futureDateError);
            return;
          }
          
          onChange({
            target: {
              name: 'subscriptionStart',
              value: format(date, 'yyyy-MM-dd')
            }
          } as React.ChangeEvent<HTMLInputElement>);
        }
      } catch {
        // Invalid date, do nothing
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className={`rounded-lg p-6 space-y-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Name */}
          <CustomerField label={t.customer.name}>
            <CustomerInput
              type="text"
              name="customerName"
              required
              value={formData.customerName}
              onChange={onChange}
              isEditing={true}
            />
          </CustomerField>

          {/* Business Name */}
          <CustomerField label={t.customer.businessName}>
            <CustomerInput
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={onChange}
              isEditing={true}
            />
          </CustomerField>

          {/* Business Type */}
          <CustomerField label={t.customer.businessType}>
            <CustomerInput
              type="text"
              name="businessType"
              required
              value={formData.businessType}
              onChange={onChange}
              isEditing={true}
            />
          </CustomerField>

          {/* Phone */}
          <CustomerField label={t.customer.phone}>
            <CustomerInput
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={onChange}
              isEditing={true}
              dir="ltr"
            />
          </CustomerField>

          {/* Address */}
          <CustomerField label={t.customer.address}>
            <CustomerInput
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={onChange}
              isEditing={true}
            />
          </CustomerField>

          {/* Activation Code */}
          <CustomerField label={t.customer.activationCode}>
            <div className="flex gap-2">
              <CustomerInput
                type="text"
                name="activationCode"
                required
                value={formData.activationCode}
                onChange={onChange}
                isEditing={true}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={onPaste}
                className="flex-shrink-0"
              >
                {t.common.paste}
              </Button>
            </div>
          </CustomerField>

          {/* Subscription Type */}
          <CustomerField label={t.customer.subscriptionType}>
            <div className="relative">
              <CustomerSelect
                name="subscriptionType"
                value={formData.subscriptionType}
                onChange={onChange}
                required
                isEditing={true}
              >
                {SUBSCRIPTION_TYPES.map(type => (
                  <option key={type} value={type}>
                    {t.subscription[type.toLowerCase().replace(/-/g, '')]}
                  </option>
                ))}
              </CustomerSelect>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </CustomerField>

          {/* Version Type */}
          <CustomerField label={t.customer.versionType}>
            <div className="relative">
              <CustomerSelect
                name="versionType"
                value={formData.versionType}
                onChange={onChange}
                required
                isEditing={true}
              >
                {VERSION_TYPES.map(type => (
                  <option key={type} value={type}>
                    {t.customer[type]}
                  </option>
                ))}
              </CustomerSelect>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {formData.versionType === 'pc' ? (
                  <Monitor className="h-5 w-5 text-gray-400" />
                ) : (
                  <Smartphone className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </CustomerField>

          {/* Device Count */}
          <CustomerField label={t.customer.deviceCount}>
            <CustomerInput
              type="number"
              name="deviceCount"
              required
              min="1"
              value={String(formData.deviceCount)}
              onChange={onChange}
              isEditing={true}
            />
          </CustomerField>

          {/* Subscription Start */}
          <CustomerField label={t.subscription.startDate}>
            <div className="relative">
              <CustomerInput
                type="text"
                name="subscriptionStartDisplay"
                required
                value={dateInputValue || ''}
                onChange={(e) => handleDateInput(e.target.value)}
                isEditing={true}
                placeholder="DD/MM/YYYY"
              />
              <input
                type="hidden"
                name="subscriptionStart"
                value={formData.subscriptionStart || ''}
              />
            </div>
          </CustomerField>

          {/* Notes */}
          <CustomerField label={t.customer.notes} className="md:col-span-2">
            <CustomerTextArea
              name="notes"
              value={formData.notes || ''}
              onChange={onChange}
              rows={3}
              isEditing={true}
            />
          </CustomerField>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          className="w-full sm:w-auto"
        >
          {t.customer.add}
        </Button>
      </div>
    </form>
  );
}
