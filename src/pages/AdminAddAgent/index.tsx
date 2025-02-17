import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import PageHeader from "../../components/ui/PageHeader";
import CustomerField from '../../components/CustomerField';
import CustomerInput from '../../components/CustomerInput';
import Button from '../../components/ui/Button';
import { useI18nStore } from "../../store/i18nStore";
import { User, Lock, UserPlus, AtSign, Phone, MapPin } from 'lucide-react';
import { api } from '../../lib/api';

export default function AdminAddAgent() {
  const navigate = useNavigate();
  const { translations: t } = useI18nStore();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    address: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t.auth.passwordMismatch);
      return;
    }

    if (!formData.username || !formData.password || !formData.fullName) {
      toast.error(t.common.fillAllFields);
      return;
    }

    try {
      await api.auth.createAgent({
        username: formData.username.toLowerCase(),
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        role: 'representative'
      });

      toast.success(t.agent.addSuccess);
      navigate("/agents");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || t.common.error);
    }
  };

  return (
    <Layout>
      <PageHeader title={t.agent.addNew} />
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-8">
        <div className="space-y-8">
          {/* Personal Information Section */}
          <div className="space-y-5">
            {/* Full Name */}
            <CustomerField label={t.agent.name}>
              <div className="relative">
                <CustomerInput
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  isEditing={true}
                  className={`${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`}
                  placeholder={t.agent.namePlaceholder}
                  dir={t.language === 'ar' ? 'rtl' : 'ltr'}
                />
                <div className={`absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </CustomerField>

            {/* Phone */}
            <CustomerField label={t.agent.phone}>
              <div className="relative">
                <CustomerInput
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  isEditing={true}
                  className={`${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`}
                  placeholder={t.agent.phonePlaceholder}
                  dir="ltr"
                />
                <div className={`absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
                  <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </CustomerField>

            {/* Address */}
            <CustomerField label={t.agent.address}>
              <div className="relative">
                <CustomerInput
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  isEditing={true}
                  className={`${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`}
                  placeholder={t.agent.addressPlaceholder}
                  dir={t.language === 'ar' ? 'rtl' : 'ltr'}
                />
                <div className={`absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
                  <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </CustomerField>
          </div>

          {/* Account Information Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">{t.auth.accountInfo}</h2>
            <div className="space-y-5">
              {/* Username */}
              <CustomerField label={t.auth.username}>
                <div className="relative">
                  <CustomerInput
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    isEditing={true}
                    className={`${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`}
                    placeholder={t.auth.usernamePlaceholder}
                    dir="ltr"
                  />
                  <div className={`absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
                    <AtSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </CustomerField>

              {/* Password */}
              <CustomerField label={t.auth.password}>
                <div className="relative">
                  <CustomerInput
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    isEditing={true}
                    className={`${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`}
                    placeholder={t.auth.passwordPlaceholder}
                    dir="ltr"
                  />
                  <div className={`absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </CustomerField>

              {/* Confirm Password */}
              <CustomerField label={t.auth.confirmPassword}>
                <div className="relative">
                  <CustomerInput
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isEditing={true}
                    className={`${t.language === 'ar' ? 'pl-3 pr-12' : 'pl-12 pr-3'} h-11`}
                    placeholder={t.auth.confirmPasswordPlaceholder}
                    dir="ltr"
                  />
                  <div className={`absolute inset-y-0 ${t.language === 'ar' ? 'right-3' : 'left-3'} flex items-center pointer-events-none`}>
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
              </CustomerField>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button type="submit" className="w-full sm:w-auto">
            <UserPlus className="h-5 w-5 mr-2" />
            {t.agent.addNew}
          </Button>
        </div>
      </form>
    </Layout>
  );
}
