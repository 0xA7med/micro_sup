export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  role: 'ADMIN' | 'AGENT' | 'REPRESENTATIVE';
}
