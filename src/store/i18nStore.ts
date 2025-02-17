import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ar from '../i18n/ar.json';
import en from '../i18n/en.json';

type Language = 'ar' | 'en';

interface I18nStore {
  language: Language;
  translations: typeof ar;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nStore>()(
  persist(
    (set) => ({
      language: 'ar',
      translations: {
        ...ar,
        agent: {
          add: 'إضافة مندوب',
          addByAdmin: 'إضافة مندوب',
          list: 'قائمة المندوبين',
          customers: 'عملائي',
          name: 'الاسم الكامل',
          phone: 'رقم الهاتف',
          address: 'العنوان',
          namePlaceholder: 'أدخل الاسم الكامل للمندوب',
          phonePlaceholder: 'أدخل رقم الهاتف',
          addressPlaceholder: 'أدخل العنوان',
          formDescription: 'أدخل معلومات المندوب',
          personalInfo: 'المعلومات الشخصية',
          accountInfo: 'معلومات الحساب'
        },
        common: {
          cancel: 'إلغاء',
          save: 'حفظ',
          error: 'حدث خطأ',
          phoneNumber: 'رقم الهاتف',
          address: 'العنوان',
          phonePlaceholder: 'أدخل رقم الهاتف',
          addressPlaceholder: 'أدخل العنوان',
        },
      },
      setLanguage: (lang) => set({ 
        language: lang, 
        translations: lang === 'ar' ? { 
          ...ar, 
          agent: {
            add: 'إضافة مندوب',
            addByAdmin: 'إضافة مندوب',
            list: 'قائمة المندوبين',
            customers: 'عملائي',
            name: 'الاسم الكامل',
            phone: 'رقم الهاتف',
            address: 'العنوان',
            namePlaceholder: 'أدخل الاسم الكامل للمندوب',
            phonePlaceholder: 'أدخل رقم الهاتف',
            addressPlaceholder: 'أدخل العنوان',
            formDescription: 'أدخل معلومات المندوب',
            personalInfo: 'المعلومات الشخصية',
            accountInfo: 'معلومات الحساب'
          },
          common: {
            cancel: 'إلغاء',
            save: 'حفظ',
            error: 'حدث خطأ',
            phoneNumber: 'رقم الهاتف',
            address: 'العنوان',
            phonePlaceholder: 'أدخل رقم الهاتف',
            addressPlaceholder: 'أدخل العنوان',
          },
        } : { 
          ...en, 
          agent: {
            add: 'Add Representative',
            addByAdmin: 'Add Representative',
            list: 'Representatives List',
            customers: 'My Customers',
            name: 'Full Name',
            phone: 'Phone Number',
            address: 'Address',
            namePlaceholder: 'Enter representative full name',
            phonePlaceholder: 'Enter phone number',
            addressPlaceholder: 'Enter address',
            formDescription: 'Enter representative information',
            personalInfo: 'Personal Information',
            accountInfo: 'Account Information'
          },
          common: {
            cancel: 'Cancel',
            save: 'Save',
            error: 'An error occurred',
            phoneNumber: 'Phone Number',
            address: 'Address',
            phonePlaceholder: 'Enter phone number',
            addressPlaceholder: 'Enter address',
          },
        } 
      }),
    }),
    {
      name: 'language-storage',
    }
  )
);