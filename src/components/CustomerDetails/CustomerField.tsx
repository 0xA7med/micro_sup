import React from 'react';

interface CustomerFieldProps {
  label: string;
  children: React.ReactNode;
}

export default function CustomerField({ label, children }: CustomerFieldProps) {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return (
    <div>
      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="mt-1">
        {children}
      </div>
    </div>
  );
}