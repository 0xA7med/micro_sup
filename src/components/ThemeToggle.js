import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
export default function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();
    // Listen for system theme changes
    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            useThemeStore.getState().setTheme(e.matches ? 'dark' : 'light');
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
    return (_jsx("button", { onClick: toggleTheme, className: "p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200", "aria-label": "Toggle theme", children: theme === 'dark' ? (_jsx(Sun, { className: "h-5 w-5 text-gray-300" })) : (_jsx(Moon, { className: "h-5 w-5 text-gray-300" })) }));
}
