import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface I18nState {
  language: 'ar' | 'en';
  translations: any;
  setLanguage: (language: 'ar' | 'en') => void;
}

const ar = {
  common: {
    back: 'رجوع',
    save: 'حفظ',
    cancel: 'إلغاء',
    search: 'بحث',
    loading: 'جاري التحميل',
    edit: 'تعديل',
    delete: 'حذف',
    actions: 'إجراءات',
    submit: 'إرسال',
    next: 'التالي',
    page: 'صفحة',
    of: 'من',
    copy: 'نسخ',
    copied: 'تم النسخ',
    error: 'خطأ',
    contact: 'معلومات الاتصال',
    createdAt: 'تاريخ الإنشاء',
    phoneNumber: 'رقم الهاتف',
    address: 'العنوان',
    phonePlaceholder: 'أدخل رقم الهاتف',
    addressPlaceholder: 'أدخل العنوان',
    noResults: 'لا توجد نتائج'
  },
  agent: {
    add: 'إضافة وكيل',
    addByAdmin: 'إضافة وكيل بواسطة الإدارة',
    list: 'قائمة الوكلاء',
    customers: 'العملاء',
    name: 'اسم الوكيل',
    phone: 'رقم الهاتف',
    address: 'العنوان',
    namePlaceholder: 'أدخل اسم الوكيل',
    phonePlaceholder: 'أدخل رقم الهاتف',
    addressPlaceholder: 'أدخل العنوان',
    formDescription: 'قم بإدخال معلومات الوكيل',
    personalInfo: 'المعلومات الشخصية',
    accountInfo: 'معلومات الحساب',
    fetchError: 'حدث خطأ أثناء جلب البيانات'
  },
  representative: {
    add: 'إضافة مندوب',
    addByAdmin: 'إضافة مندوب بواسطة الإدارة',
    list: 'قائمة المندوبين',
    name: 'اسم المندوب',
    phone: 'رقم الهاتف',
    address: 'العنوان',
    namePlaceholder: 'أدخل اسم المندوب',
    phonePlaceholder: 'أدخل رقم الهاتف',
    addressPlaceholder: 'أدخل العنوان',
    formDescription: 'قم بإدخال معلومات المندوب',
    personalInfo: 'المعلومات الشخصية',
    accountInfo: 'معلومات الحساب',
    fetchError: 'حدث خطأ أثناء جلب البيانات'
  },
  customer: {
    add: 'إضافة عميل',
    list: 'قائمة العملاء',
    name: 'اسم العميل',
    phone: 'رقم الهاتف',
    address: 'العنوان',
    namePlaceholder: 'أدخل اسم العميل',
    phonePlaceholder: 'أدخل رقم الهاتف',
    addressPlaceholder: 'أدخل العنوان'
  },
  subscription: {
    type: 'نوع الاشتراك',
    version: 'نسخة البرنامج',
    status: 'حالة الاشتراك',
    startDate: 'تاريخ البداية',
    endDate: 'تاريخ النهاية',
    price: 'السعر',
    notes: 'ملاحظات'
  }
};

const en = {
  common: {
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    loading: 'Loading',
    edit: 'Edit',
    delete: 'Delete',
    actions: 'Actions',
    submit: 'Submit',
    next: 'Next',
    page: 'Page',
    of: 'of',
    copy: 'Copy',
    copied: 'Copied',
    error: 'Error',
    contact: 'Contact Information',
    createdAt: 'Created At',
    phoneNumber: 'Phone Number',
    address: 'Address',
    phonePlaceholder: 'Enter phone number',
    addressPlaceholder: 'Enter address',
    noResults: 'No results found'
  },
  agent: {
    add: 'Add Agent',
    addByAdmin: 'Add Agent by Admin',
    list: 'Agents List',
    customers: 'Customers',
    name: 'Agent Name',
    phone: 'Phone Number',
    address: 'Address',
    namePlaceholder: 'Enter agent name',
    phonePlaceholder: 'Enter phone number',
    addressPlaceholder: 'Enter address',
    formDescription: 'Enter agent information',
    personalInfo: 'Personal Information',
    accountInfo: 'Account Information',
    fetchError: 'Error fetching data'
  },
  representative: {
    add: 'Add Representative',
    addByAdmin: 'Add Representative by Admin',
    list: 'Representatives List',
    name: 'Representative Name',
    phone: 'Phone Number',
    address: 'Address',
    namePlaceholder: 'Enter representative name',
    phonePlaceholder: 'Enter phone number',
    addressPlaceholder: 'Enter address',
    formDescription: 'Enter representative information',
    personalInfo: 'Personal Information',
    accountInfo: 'Account Information',
    fetchError: 'Error fetching data'
  },
  customer: {
    add: 'Add Customer',
    list: 'Customers List',
    name: 'Customer Name',
    phone: 'Phone Number',
    address: 'Address',
    namePlaceholder: 'Enter customer name',
    phonePlaceholder: 'Enter phone number',
    addressPlaceholder: 'Enter address'
  },
  subscription: {
    type: 'Subscription Type',
    version: 'Software Version',
    status: 'Subscription Status',
    startDate: 'Start Date',
    endDate: 'End Date',
    price: 'Price',
    notes: 'Notes'
  }
};

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: 'ar',
      translations: ar,
      setLanguage: (language) => set({ language, translations: language === 'ar' ? ar : en }),
    }),
    {
      name: 'language-storage',
    }
  )
);