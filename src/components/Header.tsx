import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';
import { useThemeStore } from '../store/themeStore';
import Button from './ui/Button';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { currentLanguage, setLanguage, t } = useI18nStore();

  const handleLanguageChange = () => {
    const newLang = currentLanguage === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-end items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleLanguageChange}
            className="flex items-center gap-2"
          >
            {currentLanguage === 'ar' ? 'English' : 'عربي'}
          </Button>
          <Button
            variant="outline"
            onClick={toggleDarkMode}
            className="flex items-center gap-2"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
