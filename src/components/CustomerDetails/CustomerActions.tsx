import React from 'react';
import Button from '../ui/Button';

interface CustomerActionsProps {
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export default function CustomerActions({ isEditing, onCancel, onSave }: CustomerActionsProps) {
  if (!isEditing) return null;

  return (
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onClick={onCancel}>
        إلغاء
      </Button>
      <Button onClick={onSave}>
        حفظ
      </Button>
    </div>
  );
}