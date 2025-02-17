import { create } from 'zustand';
const API_URL = 'http://localhost:3001';
export const useAuthStore = create((set) => ({
    user: null,
    login: async (username, password) => {
        try {
            console.log('Attempting login for username:', username);
            console.log('Login credentials:', { username, password });
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            console.log('Login response status:', response.status);
            const responseData = await response.text();
            console.log('Login response data:', responseData);
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const user = JSON.parse(responseData);
            console.log('Setting user state:', user);
            set({ user });
            return true;
        }
        catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },
    logout: async () => {
        set({ user: null });
    },
}));
