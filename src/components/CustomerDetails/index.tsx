import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useI18nStore } from '../../store/i18nStore';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../db/database';
import type { Customer } from '../../db/database';
import Modal from '../ui/Modal';
import CustomerHeader from './CustomerHeader';
import CustomerBasicInfo from './CustomerBasicInfo';
import CustomerSubscriptionInfo from './CustomerSubscriptionInfo';
import CustomerDates from './CustomerDates';
import CustomerActions from './CustomerActions';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

export interface CustomerDetailsModalProps {
  customer: Customer;
  onClose: () => void;
  isEditing?: boolean;
  onDelete?: (id: number) => Promise<void>;
  onUpdate?: (updatedCustomer: Customer) => Promise<void>;
}

export default function CustomerDetails({
  customer: initialCustomer,
  onClose,
  isEditing: initialIsEditing = false,
  onDelete,
  onUpdate
}: CustomerDetailsModalProps) {
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(initialCustomer);
  const { translations: t } = useI18nStore();
  const { user } = useAuthStore();

  const handleCopyCode = async (code: string, customerId: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(customerId);
    toast.success(t.common.copied);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedCustomer((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedCustomer?.id) return;
    
    try {
      // استخدام قاعدة البيانات المحلية بدلاً من supabase
      await db.customers.update(editedCustomer.id, {
        customerName: editedCustomer.customerName,
        businessName: editedCustomer.businessName,
        businessType: editedCustomer.businessType,
        phone: editedCustomer.phone,
        address: editedCustomer.address,
        activationCode: editedCustomer.activationCode,
        subscription_type: editedCustomer.subscription_type,
        device_count: editedCustomer.device_count,
        version_type: editedCustomer.version_type,
        notes: editedCustomer.notes
      });
      
      toast.success('تم تحديث بيانات العميل بنجاح');
      setIsEditing(false);
      
      // استدعاء دالة التحديث إذا كانت موجودة
      if (onUpdate) {
        await onUpdate(editedCustomer);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('حدث خطأ أثناء تحديث بيانات العميل');
    }
  };

  return (
    <>
      <Modal
        title={isEditing ? 'تعديل بيانات العميل' : t.common.details}
        onClose={onClose}
        footer={
          <CustomerActions
            isEditing={isEditing}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomerBasicInfo
            customer={editedCustomer}
            isEditing={isEditing}
            copiedCode={copiedCode}
            handleChange={handleChange}
            handleCopyCode={handleCopyCode}
          />

          <CustomerSubscriptionInfo
            customer={editedCustomer}
            isEditing={isEditing}
            handleChange={handleChange}
          />

          <CustomerDates
            startDate={editedCustomer.subscriptionStart}
            endDate={editedCustomer.subscriptionEnd}
          />
        </div>
      </Modal>

      {showDeleteConfirm && onDelete && (
        <DeleteConfirmationModal
          title="تأكيد حذف العميل"
          message={`هل أنت متأكد من حذف العميل ${editedCustomer.customerName}؟`}
          confirmLabel="حذف العميل"
          onConfirm={() => onDelete(editedCustomer.id!)}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}