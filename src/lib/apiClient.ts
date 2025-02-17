import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة interceptor للتحقق من المصادقة
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('[API] 🔐 التحقق من المصادقة:', { 
      hasToken: !!token,
      url: config.url,
      method: config.method
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('[API] ❌ خطأ في إعداد الطلب:', error);
    return Promise.reject(error);
  }
);

// إضافة interceptor للتحقق من الاستجابة
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API] ✅ استجابة ناجحة:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('[API] ❌ خطأ في الاستجابة:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// تعريف الواجهات
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

interface Agent {
  id: number;
  username: string;
  fullName: string;
  role: string;
  phone?: string;
  address?: string;
  customerCount: number;
}

interface Stats {
  totalCustomers: number;
  totalAgents: number;
  recentCustomers: Array<{
    id: number;
    name: string;
    createdAt: string;
  }>;
}

// تعريف وظائف API
const agents = {
  getAll: async (): Promise<ApiResponse<Agent[]>> => {
    try {
      console.log('[API] 📊 جلب قائمة المندوبين...');
      const response = await apiClient.get('/agents');
      
      if (!response.data) {
        throw new Error('لم يتم استلام بيانات من الخادم');
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('[API] ❌ خطأ في جلب المندوبين:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  },

  getById: async (id: number): Promise<ApiResponse<Agent>> => {
    try {
      console.log(`[API] 📊 جلب المندوب ${id}...`);
      const response = await apiClient.get(`/agents/${id}`);

      if (!response.data) {
        throw new Error('لم يتم استلام بيانات من الخادم');
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('[API] ❌ خطأ في جلب المندوب:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  },

  delete: async (id: number): Promise<ApiResponse> => {
    try {
      console.log('[API] 🗑️ حذف المندوب:', id);
      await apiClient.delete(`/agents/${id}`);
      return { success: true };
    } catch (error: any) {
      console.error('[API] ❌ خطأ في حذف المندوب:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  },

  transferCustomers: async (fromId: number, toId: number): Promise<ApiResponse> => {
    try {
      console.log('[API] 🔄 نقل العملاء:', { fromId, toId });
      await apiClient.post(`/agents/${fromId}/transfer`, { toId });
      return { success: true };
    } catch (error: any) {
      console.error('[API] ❌ خطأ في نقل العملاء:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }
};

const stats = {
  get: async (): Promise<ApiResponse<Stats>> => {
    try {
      console.log('[API] 📊 جلب الإحصائيات...');
      const response = await apiClient.get('/stats');
      
      if (!response.data) {
        throw new Error('لم يتم استلام بيانات من الخادم');
      }

      // التحقق من صحة البيانات
      const stats = response.data;
      if (typeof stats.totalCustomers !== 'number' || 
          typeof stats.totalAgents !== 'number' || 
          !Array.isArray(stats.recentCustomers)) {
        throw new Error('البيانات المستلمة غير صالحة');
      }

      return {
        success: true,
        data: stats
      };
    } catch (error: any) {
      console.error('[API] ❌ خطأ في جلب الإحصائيات:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }
};

export { apiClient, agents, stats };
