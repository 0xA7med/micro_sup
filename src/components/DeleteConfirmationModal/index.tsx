import React from 'react';
import { Modal } from 'antd';
import { useI18nStore } from '@/store/i18nStore';

export interface DeleteConfirmationModalProps {
  visible: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const { translations: t } = useI18nStore();

  return (
    <Modal
      title={t.common.delete}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={t.common.delete}
      cancelText={t.common.cancel}
      okButtonProps={{ danger: true }}
    >
      <p>هل أنت متأكد من حذف هذا العنصر؟</p>
    </Modal>
  );
};
