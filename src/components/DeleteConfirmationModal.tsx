import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import LoadingSpinner from './ui/LoadingSpinner';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transferCustomers: boolean) => void;
  title: string;
  description: string;
  showTransferOption?: boolean;
  transferDescription?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  showTransferOption = false,
  transferDescription = '',
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const [transferCustomers, setTransferCustomers] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onClose={() => !isLoading && onClose()}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4 text-right">
            {title}
          </Dialog.Title>

          <Dialog.Description className="mb-4 text-gray-600 text-right">
            {description}
          </Dialog.Description>

          {showTransferOption && (
            <div className="mb-4">
              <label className="flex items-center justify-end gap-2">
                <input
                  type="checkbox"
                  checked={transferCustomers}
                  onChange={(e) => setTransferCustomers(e.target.checked)}
                  disabled={isLoading}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{transferDescription}</span>
              </label>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onConfirm(transferCustomers)}
              disabled={isLoading}
              className={`px-4 py-2 rounded text-white transition-colors ${
                isLoading
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner className="w-4 h-4" />
                  <span>جاري الحذف...</span>
                </div>
              ) : (
                'حذف'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`px-4 py-2 rounded transition-colors ${
                isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              إلغاء
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}