import React, { useEffect, useState } from 'react';
import { stats } from '../../lib/apiClient';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';

interface Stats {
  totalCustomers: number;
  totalAgents: number;
  recentCustomers: Array<{
    id: number;
    name: string;
    createdAt: string;
  }>;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const { user } = useAuthStore();

  console.log('[Dashboard] 👤 بيانات المستخدم:', user);

  const fetchStats = async () => {
    console.log('[Dashboard] 📊 جلب الإحصائيات...');
    setLoading(true);
    setError(null);

    try {
      const result = await stats.get();
      console.log('[Dashboard] 📊 نتيجة الإحصائيات:', result);

      if (!result.success || !result.data) {
        throw new Error(result.message || 'فشل في جلب الإحصائيات');
      }

      // التحقق من صحة البيانات
      const data = result.data;
      if (typeof data.totalCustomers !== 'number' || 
          typeof data.totalAgents !== 'number' || 
          !Array.isArray(data.recentCustomers)) {
        console.error('[Dashboard] ❌ بيانات غير صالحة:', data);
        throw new Error('البيانات المستلمة غير صالحة');
      }

      setStatsData(data);
    } catch (error: any) {
      console.error('[Dashboard] ❌ خطأ:', error);
      setError(error.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[Dashboard] 🔄 تحميل البيانات...');
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <LoadingSpinner className="animate-spin w-10 h-10 text-blue-500" />
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🔄 إعادة المحاولة
          </button>
        </div>
      </Layout>
    );
  }

  if (!statsData) {
    return (
      <Layout>
        <div className="text-center py-8 text-gray-500">
          لا توجد بيانات متاحة
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">👥 إجمالي العملاء</h3>
          <p className="text-3xl font-bold text-blue-600">
            {statsData.totalCustomers}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">👤 إجمالي المندوبين</h3>
          <p className="text-3xl font-bold text-green-600">
            {statsData.totalAgents}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">📅 آخر العملاء المضافين</h3>
        {statsData.recentCustomers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            لا يوجد عملاء حديثين
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                    الاسم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                    تاريخ الإضافة
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {statsData.recentCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}