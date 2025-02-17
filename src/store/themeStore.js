import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useThemeStore = create()(persist((set) => ({
    theme: 'light',
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return { theme: newTheme };
    }),
    setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
    },
}), {
    name: 'theme-storage',
    onRehydrateStorage: () => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.getItem('theme-storage');
        const theme = storedTheme ? JSON.parse(storedTheme).state.theme : (isDark ? 'dark' : 'light');
        // Ensure theme is applied immediately
        document.documentElement.classList.toggle('dark', theme === 'dark');
        return (state) => {
            if (state) {
                state.setTheme(theme);
            }
        };
    },
}));
