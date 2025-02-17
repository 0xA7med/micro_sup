import React from 'react';
import { useThemeStore } from '../store/themeStore';

interface CustomerFieldProps {
  label: string;
  children: React.ReactNode;
}

export default function CustomerField({ label, children }: CustomerFieldProps) {
  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${
        isDarkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>
        {label}
      </label>
      {children}
    </div>
  );
}