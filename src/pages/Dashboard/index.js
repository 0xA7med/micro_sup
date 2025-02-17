import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { stats } from '../../lib/apiClient';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';
export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statsData, setStatsData] = useState(null);
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
        }
        catch (error) {
            console.error('[Dashboard] ❌ خطأ:', error);
            setError(error.message || 'حدث خطأ غير متوقع');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        console.log('[Dashboard] 🔄 تحميل البيانات...');
        fetchStats();
    }, []);
    if (loading) {
        return (_jsx(Layout, { children: _jsxs("div", { className: "flex flex-col items-center justify-center h-64", children: [_jsx(LoadingSpinner, { className: "animate-spin w-10 h-10 text-blue-500" }), _jsx("p", { className: "mt-4 text-gray-600", children: "\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A..." })] }) }));
    }
    if (error) {
        return (_jsx(Layout, { children: _jsxs("div", { className: "flex flex-col items-center justify-center h-64", children: [_jsxs("div", { className: "text-red-500 mb-4", children: ["\u26A0\uFE0F ", error] }), _jsx("button", { onClick: fetchStats, className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", children: "\uD83D\uDD04 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629" })] }) }));
    }
    if (!statsData) {
        return (_jsx(Layout, { children: _jsx("div", { className: "text-center py-8 text-gray-500", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u0645\u062A\u0627\u062D\u0629" }) }));
    }
    return (_jsxs(Layout, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "\uD83D\uDC65 \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0639\u0645\u0644\u0627\u0621" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: statsData.totalCustomers })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "\uD83D\uDC64 \u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0646\u062F\u0648\u0628\u064A\u0646" }), _jsx("p", { className: "text-3xl font-bold text-green-600", children: statsData.totalAgents })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\uD83D\uDCC5 \u0622\u062E\u0631 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0645\u0636\u0627\u0641\u064A\u0646" }), statsData.recentCustomers.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-4", children: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u0644\u0627\u0621 \u062D\u062F\u064A\u062B\u064A\u0646" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500", children: "\u0627\u0644\u0627\u0633\u0645" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500", children: "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0625\u0636\u0627\u0641\u0629" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: statsData.recentCustomers.map((customer) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: customer.name }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(customer.createdAt).toLocaleDateString('ar-SA') })] }, customer.id))) })] }) }))] })] }));
}
