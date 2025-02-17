import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function FormField({ label, children, fullWidth = false }: FormFieldProps) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}