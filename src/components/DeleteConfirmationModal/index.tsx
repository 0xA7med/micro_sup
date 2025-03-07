import React from 'react';
import { Dialog } from '@headlessui/react';
import { useI18nStore } from '../../store/i18nStore';
import Button from '../ui/Button';
import { X } from 'lucide-react';

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transferCustomers?: boolean) => void;
  title: string;
  message?: string;
  description?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  showTransferOption?: boolean;
  transferDescription?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message = "هل أنت متأكد من حذف هذا العنصر؟",
  description,
  confirmLabel,
  onCancel,
  showTransferOption = false,
  transferDescription,
  isLoading = false
}: DeleteConfirmationModalProps) {
  const { translations: t } = useI18nStore();
  const [transferCustomers, setTransferCustomers] = React.useState(false);
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70" />

        <div className="relative mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </Dialog.Title>
            <button
              onClick={handleCancel}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
            {description && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}

            {showTransferOption && (
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={transferCustomers}
                    onChange={(e) => setTransferCustomers(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">
                    {transferDescription || "نقل العملاء إلى مندوب آخر"}
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {t.common.cancel}
            </Button>
            <Button
              variant="danger"
              onClick={() => onConfirm(transferCustomers)}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t.common.loading}
                </span>
              ) : (
                confirmLabel || t.common.delete
              )}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
