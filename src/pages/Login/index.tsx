import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoginForm from './LoginForm';
import { useAuthStore } from '../../store/authStore';
import { useI18nStore } from '../../store/i18nStore';

export default function Login() {
  const navigate = useNavigate();
  const { translations: t } = useI18nStore();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t.auth.invalidCredentials);
      }

      const user = await response.json();
      setUser(user);
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || t.auth.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <LoginForm onLogin={handleLogin} isLoading={isLoading} />
    </div>
  );
}