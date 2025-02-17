import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Languages, 
  Moon, 
  Sun,
  Building,
  Users2,
  UserPlus2,
  UserCog2,
  UserPlus,
  ClipboardList,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useI18nStore } from '../store/i18nStore';
import { useThemeStore } from '../store/themeStore';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { language, setLanguage, translations: t } = useI18nStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Building className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">MicroPOS</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {user?.role === 'admin' && (
                <>
                  <NavLink
                    to="/customers"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <Users2 className="h-5 w-5" />
                    <span className="hidden sm:inline">{t.customer.list}</span>
                  </NavLink>

                  <NavLink
                    to="/customers/new"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <UserPlus2 className="h-5 w-5" />
                    <span className="hidden sm:inline">{t.customer.add}</span>
                  </NavLink>

                  <NavLink
                    to="/representatives"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <UserCog2 className="h-5 w-5" />
                    <span className="hidden sm:inline">{t.agent.list}</span>
                  </NavLink>

                  <NavLink
                    to="/representatives/add"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <ShieldCheck className="h-5 w-5" />
                    <span className="hidden sm:inline">{t.agent.add}</span>
                  </NavLink>
                </>
              )}

              {user?.role === 'representative' && (
                <>
                  <NavLink
                    to="/my-customers"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <ClipboardList className="h-5 w-5" />
                    <span className="hidden sm:inline">{t.customer.myCustomers}</span>
                  </NavLink>

                  <NavLink
                    to="/customers/new"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <UserPlus2 className="h-5 w-5" />
                    <span className="hidden sm:inline">{t.customer.add}</span>
                  </NavLink>
                </>
              )}

              <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-2" />

              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                title={t.common.language}
              >
                <Languages className="h-5 w-5" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                title={t.common.theme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                title={t.auth.logout}
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">{t.auth.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="px-0 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}