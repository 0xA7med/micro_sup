import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}