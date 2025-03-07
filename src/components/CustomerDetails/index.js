import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useI18nStore } from '../../store/i18nStore';
import { useAuthStore } from '../../store/authStore';
import Modal from '../ui/Modal';
import CustomerBasicInfo from './CustomerBasicInfo';
import CustomerSubscriptionInfo from './CustomerSubscriptionInfo';
import CustomerDates from './CustomerDates';
import CustomerActions from './CustomerActions';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
export default function CustomerDetails({ customer: initialCustomer, onClose, isEditing: initialIsEditing = false, onDelete }) {
    const [copiedCode, setCopiedCode] = useState(null);
    const [isEditing, setIsEditing] = useState(initialIsEditing);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState(initialCustomer);
    const { translations: t } = useI18nStore();
    const { user } = useAuthStore();
    const handleCopyCode = async (code, customerId) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(customerId);
        toast.success(t.common.copied);
        setTimeout(() => setCopiedCode(null), 2000);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCustomer(prev => ({ ...prev, [name]: value }));
    };
    const handleSave = async () => {
        if (!editedCustomer?.id)
            return;
        try {
            const { error } = await supabase
                .from('customers')
                .update({
                customer_name: editedCustomer.customer_name,
                business_name: editedCustomer.business_name,
                business_type: editedCustomer.business_type,
                phone: editedCustomer.phone,
                address: editedCustomer.address,
                activation_code: editedCustomer.activation_code,
                subscription_type: editedCustomer.subscription_type,
                device_count: editedCustomer.device_count,
                version_type: editedCustomer.version_type,
                notes: editedCustomer.notes
            })
                .eq('id', editedCustomer.id);
            if (error)
                throw error;
            toast.success('تم تحديث بيانات العميل بنجاح');
            setIsEditing(false);
        }
        catch (error) {
            console.error('Error updating customer:', error);
            toast.error('حدث خطأ أثناء تحديث بيانات العميل');
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Modal, { title: isEditing ? 'تعديل بيانات العميل' : t.common.details, onClose: onClose, footer: _jsx(CustomerActions, { isEditing: isEditing, onCancel: () => setIsEditing(false), onSave: handleSave }), children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(CustomerBasicInfo, { customer: editedCustomer, isEditing: isEditing, copiedCode: copiedCode, handleChange: handleChange, handleCopyCode: handleCopyCode }), _jsx(CustomerSubscriptionInfo, { customer: editedCustomer, isEditing: isEditing, handleChange: handleChange }), _jsx(CustomerDates, { startDate: editedCustomer.subscription_start, endDate: editedCustomer.subscription_end })] }) }), showDeleteConfirm && onDelete && (_jsx(DeleteConfirmationModal, { title: "\u062A\u0623\u0643\u064A\u062F \u062D\u0630\u0641 \u0627\u0644\u0639\u0645\u064A\u0644", message: `هل أنت متأكد من حذف العميل ${editedCustomer.customer_name}؟`, confirmLabel: "\u062D\u0630\u0641 \u0627\u0644\u0639\u0645\u064A\u0644", onConfirm: () => onDelete(editedCustomer.id), onClose: () => setShowDeleteConfirm(false) }))] }));
}
