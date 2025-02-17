import React from 'react';
import { Lock, User, UserPlus } from 'lucide-react';
import { useI18nStore } from '../store/i18nStore';
import Button from '../components/ui/Button';

interface LoginFormProps {
  isRegistering: boolean;
  formData: {
    username: string;
    password: string;
    confirmPassword: string;
    fullName: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  toggleMode: () => void;
}

export default function LoginForm({
  isRegistering,
  formData,
  handleChange,
  handleSubmit,
  toggleMode,
}: LoginFormProps) {
  const { translations: t } = useI18nStore();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {isRegistering && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.agent.name}
            </label>
            <div className="relative">
              <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder={t.agent.name}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.auth.username}
          </label>
          <div className="relative">
            <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder={t.auth.username}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.auth.password}
          </label>
          <div className="relative">
            <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder={t.auth.password}
            />
          </div>
        </div>

        {isRegistering && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.auth.confirmPassword}
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder={t.auth.confirmPassword}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full"
        >
          {isRegistering ? t.auth.register : t.auth.login}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={toggleMode}
          className="w-full flex items-center justify-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          {isRegistering ? t.auth.backToLogin : t.auth.registerAsRep}
        </Button>
      </div>
    </form>
  );
}
