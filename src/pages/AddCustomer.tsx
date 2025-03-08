import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, addMonths, addYears } from 'date-fns';
import { useI18nStore } from '../store/i18nStore';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { db } from '../db/database';
import Button from '../components/ui/Button';
import Layout from '../components/Layout';

const SUBSCRIPTION_TYPES = ['Monthly', 'Semi-annual', 'Annual', 'Permanent'] as const;
const VERSION_TYPES = ['android', 'pc'] as const;

export default function AddCustomer() {
  const navigate = useNavigate();
  const { translations: t, language, setLanguage } = useI18nStore();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();

  console.log('Theme:', theme);

  const formatDateForInput = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return format(date, 'yyyy-MM-dd');
  };

  const formatDateForDisplay = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return format(date, 'dd/MM/yyyy');
  };

  const [formData, setFormData] = useState({
    customerName: '',
    businessName: '',
    businessType: '',
    phone: '',
    address: '',
    activationCode: '',
    subscriptionType: '',
    versionType: '',
    deviceCount: '1',
    notes: '',
    startDate: formatDateForInput(new Date()),
    endDate: '',
    displayStartDate: formatDateForDisplay(new Date()),
    displayEndDate: '',
  });

  const calculateEndDate = (startDate: string, subscriptionType: string) => {
    const start = new Date(startDate);
    let end = '';
    
    switch (subscriptionType) {
      case 'Monthly':
        end = format(addMonths(start, 1), 'yyyy-MM-dd');
        break;
      case 'Semi-annual':
        end = format(addMonths(start, 6), 'yyyy-MM-dd');
        break;
      case 'Annual':
        end = format(addYears(start, 1), 'yyyy-MM-dd');
        break;
      case 'Permanent':
        end = format(addYears(start, 100), 'yyyy-MM-dd');
        break;
      default:
        end = '';
    }

    return {
      endDate: end,
      displayEndDate: end ? formatDateForDisplay(end) : ''
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'startDate') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        toast.error(t.subscription.futureDateError);
        return;
      }
      
      if (formData.subscriptionType) {
        const { endDate, displayEndDate } = calculateEndDate(value, formData.subscriptionType);
        setFormData(prev => ({
          ...prev,
          startDate: value,
          endDate,
          displayEndDate
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        startDate: value
      }));
      return;
    }
    
    if (name === 'subscriptionType') {
      const { endDate, displayEndDate } = calculateEndDate(formData.startDate, value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        endDate,
        displayEndDate
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateActivationCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user) {
        toast.error('يجب تسجيل الدخول أولاً');
        navigate('/login');
        return;
      }

      // التحقق من البيانات المطلوبة
      if (!formData.customerName || !formData.businessName || !formData.phone) {
        toast.error('يرجى ملء جميع الحقول المطلوبة');
        return;
      }

      // إنشاء رمز التفعيل
      const activationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const customerData = {
        customerName: formData.customerName,
        businessName: formData.businessName,
        businessType: formData.businessType,
        phone: formData.phone,
        address: formData.address,
        activationCode,
        subscriptionType: formData.subscriptionType === 'Monthly' ? 'semi-annual' :
                          formData.subscriptionType === 'Semi-annual' ? 'semi-annual' :
                          formData.subscriptionType === 'Annual' ? 'annual' :
                          formData.subscriptionType === 'Permanent' ? 'permanent' : 'trial',
        versionType: formData.versionType as 'android' | 'pc',
        deviceCount: Number(formData.deviceCount),
        subscriptionStart: new Date(formData.startDate).toISOString(),
        subscriptionEnd: formData.endDate ? new Date(formData.endDate).toISOString() : new Date(formData.startDate).toISOString(),
        notes: formData.notes,
        createdBy: user.id,
        agentName: user.username,
        createdAt: new Date().toISOString(),
      };

      console.log('Adding customer:', customerData);
      await db.customers.add(customerData);
      console.log('Customer added successfully');

      toast.success(t.customer.addSuccess);
      navigate('/customers');
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error(t.customer.addError);
    }
  };

  const inputClasses = `mt-1 block w-full rounded-lg border p-2.5 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white`;

  const labelClasses = `block text-base font-medium text-gray-700 dark:text-indigo-100`;

  return (
    <Layout title={t.customer.add}>
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/customers')}
              className="flex items-center text-gray-600 dark:text-indigo-100 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t.common.back}
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>{t.customer.name}</label>
              <input
                type="text"
                name="customerName"
                required
                value={formData.customerName}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>{t.customer.businessName}</label>
              <input
                type="text"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>{t.customer.businessType}</label>
              <input
                type="text"
                name="businessType"
                required
                value={formData.businessType}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>{t.customer.phone}</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>{t.customer.address}</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>

            <div className="relative">
              <label className={labelClasses}>{t.customer.subscriptionType}</label>
              <select
                id="subscriptionType"
                name="subscriptionType"
                value={formData.subscriptionType}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 text-base rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white appearance-none"
                required
                style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
              >
                <option value="" className="bg-white dark:bg-gray-700">{t.common.select}</option>
                <option value="Monthly" className="bg-white dark:bg-gray-700">{language === 'ar' ? 'شهري' : 'Monthly'}</option>
                <option value="Semi-annual" className="bg-white dark:bg-gray-700">{language === 'ar' ? 'نصف سنوي' : 'Semi-annual'}</option>
                <option value="Annual" className="bg-white dark:bg-gray-700">{language === 'ar' ? 'سنوي' : 'Annual'}</option>
                <option value="Permanent" className="bg-white dark:bg-gray-700">{language === 'ar' ? 'دائم' : 'Permanent'}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
                <svg className="h-4 w-4 fill-current text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>

            <div>
              <label className={labelClasses}>{t.subscription.startDateLabel}</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`${inputClasses} dark:text-white dark:[color-scheme:dark] text-gray-700`}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>{t.subscription.endDateLabel}</label>
              <input
                type="text"
                value={formData.displayEndDate}
                className={`${inputClasses} bg-gray-50 dark:bg-gray-700`}
                readOnly
                placeholder="DD/MM/YYYY"
              />
            </div>

            <div>
              <label className={labelClasses}>{t.customer.versionType}</label>
              <div className="mt-1 flex gap-4">
                {VERSION_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer ${
                      formData.versionType === type
                        ? 'bg-indigo-50 dark:bg-indigo-600 border-indigo-500 text-indigo-700 dark:text-white'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="versionType"
                      value={type}
                      checked={formData.versionType === type}
                      onChange={handleInputChange}
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
            </div>

            <div>
              <label className={labelClasses}>{t.customer.deviceCount}</label>
              <input
                type="number"
                name="deviceCount"
                required
                min="1"
                value={formData.deviceCount}
                onChange={handleInputChange}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>{t.customer.notes}</label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className={inputClasses}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/customers')}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit">
              {t.customer.add}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}