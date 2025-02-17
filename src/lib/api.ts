import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

const API_URL = '/api';

interface CreateCustomerData {
  customerName: string;
  businessName: string;
  businessType: string;
  phone: string;
  address: string;
  activationCode: string;
  subscriptionType: string;
  versionType: string;
  deviceCount: number;
  subscriptionStart: string;
  subscriptionEnd: string;
  notes?: string;
  createdBy?: number;
  agentName: string;
}

export const api = {
  // User operations
  users: {
    create: async (data: { username: string; password: string; fullName: string; role: string }) => {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return prisma.user.create({
        data: {
          ...data,
          password: hashedPassword
        }
      });
    },
    
    authenticate: async (username: string, password: string) => {
      const user = await prisma.user.findUnique({
        where: { username }
      });
      
      if (!user) return null;
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return null;
      
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  },

  // Auth operations
  auth: {
    checkAdmin: () => 
      fetch('/api/auth/check-admin').then(res => res.json()),
    
    createAdmin: (data: {
      username: string;
      password: string;
      fullName: string;
      role: string;
    }) =>
      fetch(`${API_URL}/auth/create-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    createAgent: (data: {
      username: string;
      password: string;
      fullName: string;
      phone: string;
      address: string;
      role: string;
    }) =>
      fetch(`${API_URL}/auth/create-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    
    login: (data: { username: string; password: string }) =>
      fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(res => res.json())
  },

  // Agent operations
  agents: {
    getAll: async () => {
      try {
        console.log('Fetching agents from:', `${API_URL}/agents`);
        const response = await fetch(`${API_URL}/agents`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Error response:', errorData);
          throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Agents data:', data);
        return data;
      } catch (error) {
        console.error('Error in getAll agents:', error);
        throw error;
      }
    },
    
    getById: (id: number) =>
      fetch(`/api/agents/${id}`).then(res => res.json()),
    
    delete: (id: number) =>
      fetch(`/api/agents/${id}`, {
        method: 'DELETE'
      }).then(res => res.json()),
    
    transferCustomers: (fromAgentId: number, toAgentId: number) =>
      fetch('/api/agents/transfer-customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAgentId, toAgentId })
      }).then(res => res.json())
  },

  // Customer operations
  customers: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/customers`);
      return response.json();
    },

    getRecent: async () => {
      const response = await fetch(`${API_URL}/customers/recent`);
      return response.json();
    },

    getByAgent: async (agentId: number) => {
      const response = await fetch(`${API_URL}/customers/agent/${agentId}`);
      return response.json();
    },

    create: async (data: CreateCustomerData) => {
      const response = await fetch(`${API_URL}/customers/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (id: number, data: Partial<CreateCustomerData>) => {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (id: number) => {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },

  // Stats operations
  stats: {
    getAll: () =>
      fetch('/api/stats').then(res => res.json()),
    
    get: async () => {
      const response = await fetch(`${API_URL}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    }
  }
};
