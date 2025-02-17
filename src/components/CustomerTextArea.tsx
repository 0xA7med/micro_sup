import React, { forwardRef } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useI18nStore } from '../store/i18nStore';

interface CustomerTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isEditing: boolean;
  value: string;
  displayValue?: string;
}

const CustomerTextArea = forwardRef<HTMLTextAreaElement, CustomerTextAreaProps>(
  ({ isEditing, value, displayValue, className = '', ...props }, ref) => {
    const { theme } = useThemeStore();
    const { language } = useI18nStore();
    const isDarkMode = theme === 'dark';
    const isRTL = language === 'ar';
    
    const textareaClasses = `block w-full rounded-lg border ${
      isDarkMode 
        ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
    } p-2.5 focus:ring-2 focus:ring-indigo-500 ${className}`;

    if (!isEditing) {
      return (
        <p className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {displayValue || value}
        </p>
      );
    }

    return (
      <textarea
        {...props}
        ref={ref}
        value={value}
        className={textareaClasses}
        dir={props.dir || (isRTL ? 'rtl' : 'ltr')}
      />
    );
  }
);

CustomerTextArea.displayName = 'CustomerTextArea';

export default CustomerTextArea;
