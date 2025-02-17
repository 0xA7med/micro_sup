import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useI18nStore } from '../store/i18nStore';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';
import { db } from '../db/database';
import LoginForm from './LoginForm';
import Button from '../components/ui/Button';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { translations: t, language, setLanguage } = useI18nStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
      if (formData.password !== formData.confirmPassword) {
        toast.error(t.auth.passwordMismatch);
        return;
      }

      try {
        await db.users.add({
          username: formData.username.toLowerCase().trim(),
          password: formData.password,
          fullName: formData.fullName,
          role: 'representative',
          createdAt: new Date()
        });
        
        toast.success(t.auth.registerSuccess);
        setIsRegistering(false);
        setFormData({ username: '', password: '', confirmPassword: '', fullName: '' });
      } catch (error) {
        console.error('Error registering:', error);
        toast.error(t.auth.registerError);
      }
    } else {
      const success = await login(formData.username, formData.password);
      if (success) {
        toast.success(t.auth.loginSuccess);
        navigate('/');  
      } else {
        toast.error(t.auth.loginError);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setFormData({ username: '', password: '', confirmPassword: '', fullName: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
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
              {isRegistering ? t.auth.registerAsRep : t.auth.login}
            </p>
          </div>

          <LoginForm
            isRegistering={isRegistering}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            toggleMode={toggleMode}
          />
        </div>
      </div>
    </div>
  );
}