import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  createdAt: Date;
}

interface AuthStore {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const API_URL = 'http://localhost:3001';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (username: string, password: string) => {
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
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
  logout: async () => {
    set({ user: null });
  },
}));