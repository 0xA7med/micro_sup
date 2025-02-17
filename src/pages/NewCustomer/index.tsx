import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import PageHeader from '../../components/ui/PageHeader';
import CustomerForm from './CustomerForm';
import { useAuthStore } from '../../store/authStore';
import { useI18nStore } from '../../store/i18nStore';
import { api } from '../../lib/api';

export default function NewCustomer() {
  const user = useAuthStore((state) => state.user);
  const { translations: t } = useI18nStore();
  const navigate = useNavigate();
  
  const today = new Date();
  const [formData, setFormData] = React.useState({
    customerName: '',
    businessName: '',
    businessType: '',
    phone: '',
    address: '',
    activationCode: '',
    subscriptionType: 'Monthly',
    versionType: 'pc',
    deviceCount: 1,
    subscriptionStart: format(today, 'yyyy-MM-dd'),
    subscriptionEnd: format(addDays(today, 30), 'yyyy-MM-dd'),
    notes: '',
    agentName: user?.username || ''
  });

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFormData(prev => ({ ...prev, activationCode: text }));
      toast.success(t.common.pasteSuccess);
    } catch (err) {
      toast.error(t.common.error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updates: any = { [name]: value };

      if (name === 'deviceCount') {
        updates.deviceCount = parseInt(value) || 1;
      } else if (name === 'subscriptionStart' || name === 'subscriptionType') {
        const startDate = name === 'subscriptionStart' ? value : prev.subscriptionStart;
        const subscriptionType = name === 'subscriptionType' ? value : prev.subscriptionType;
        
        let endDate = new Date(startDate);
        switch (subscriptionType) {
          case 'Monthly':
            endDate = addDays(endDate, 30);
            break;
          case 'Semi-annual':
            endDate = addDays(endDate, 182);
            break;
          case 'Annual':
            endDate = addDays(endDate, 365);
            break;
          case 'Permanent':
            endDate = new Date('2099-12-31');
            break;
        }
        
        updates.subscriptionEnd = format(endDate, 'yyyy-MM-dd');
      }
      
      return { ...prev, ...updates };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.customers.create({
        customerName: formData.customerName,
        businessName: formData.businessName,
        businessType: formData.businessType,
        phone: formData.phone,
        address: formData.address,
        activationCode: formData.activationCode,
        subscriptionType: formData.subscriptionType,
        versionType: formData.versionType,
        deviceCount: formData.deviceCount,
        subscriptionStart: formData.subscriptionStart,
        subscriptionEnd: formData.subscriptionEnd,
        notes: formData.notes,
        agentId: user?.id || 0,
        agentName: formData.agentName || user?.username || ''
      });

      toast.success(t.customer.addSuccess);
      navigate('/customers');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || t.common.error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title={t.customer.add}
          backButton
          backButtonText={t.common.back}
          backButtonLink="/customers"
        />
        
        <div className="mt-8">
          <CustomerForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onPaste={handlePaste}
          />
        </div>
      </div>
    </Layout>
  );
}
