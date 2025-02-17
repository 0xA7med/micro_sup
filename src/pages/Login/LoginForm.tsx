import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useI18nStore } from '../../store/i18nStore';
import ThemeToggle from '../../components/ThemeToggle';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export default function LoginForm({ onLogin, isLoading }: LoginFormProps) {
  const { translations: t, language, setLanguage } = useI18nStore();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(formData.username, formData.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md w-full">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="text-white"
        >
          {language === 'ar' ? 'EN' : 'عربي'}
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            MicroPOS Manager
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t.auth.login}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.auth.username}
            </label>
            <div className="mt-1 relative">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t.auth.usernamePlaceholder}
                dir="ltr"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.auth.password}
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t.auth.passwordPlaceholder}
                dir="ltr"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4"
            disabled={isLoading}
          >
            {isLoading ? t.common.loading : t.auth.login}
          </Button>
        </form>
      </div>
    </div>
  );
}