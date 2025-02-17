import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}

export default function Modal({ title, children, onClose, footer }: ModalProps) {
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className={`max-w-2xl w-full rounded-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
            className="!p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          />
        </div>

        <div className="py-2">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}