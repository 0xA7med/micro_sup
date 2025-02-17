import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import AgentListHeader from './AgentListHeader';
import AgentListTable from './AgentListTable';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { useI18nStore } from '../../store/i18nStore';
import { apiClient } from '../../lib/apiClient';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
const defaultTranslations = {
    agentList: {
        deleteSuccess: 'تم حذف المندوب بنجاح',
        deleteTitle: 'حذف المندوب',
        deleteDescription: 'هل أنت متأكد من حذف هذا المندوب؟',
        transferDescription: 'نقل العملاء إلى مدير النظام'
    },
    common: {
        error: 'حدث خطأ غير متوقع'
    }
};
export default function AgentList() {
    console.log('[AgentList] تهيئة المكون...');
    const [searchValue, setSearchValue] = useState('');
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingAgent, setDeletingAgent] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const i18nStore = useI18nStore();
    console.log('[AgentList] i18nStore:', i18nStore);
    // استخدام القيم الافتراضية إذا كانت الترجمات غير متوفرة
    const t = i18nStore?.translations || defaultTranslations;
    console.log('[AgentList] translations:', t);
    const fetchAgents = async () => {
        console.log('[AgentList] بدء تحميل المندوبين...');
        setLoading(true);
        setError(null);
        try {
            console.log('[AgentList] استدعاء API...');
            const result = await agents.getAll();
            console.log('[AgentList] استجابة API:', result);
            if (!result?.success || !result?.data) {
                throw new Error(result?.message || 'فشل في تحميل المندوبين');
            }
            if (!Array.isArray(result.data)) {
                console.error('[AgentList] خطأ في شكل البيانات:', result.data);
                throw new Error('البيانات المستلمة ليست مصفوفة!');
            }
            // التحقق من صحة بيانات كل مندوب
            const validAgents = result.data.filter(agent => {
                if (!agent.id || !agent.username || !agent.fullName) {
                    console.warn('[AgentList] مندوب غير صالح:', agent);
                    return false;
                }
                return true;
            });
            console.log('[AgentList] المندوبين الصالحين:', validAgents);
            setAgents(validAgents);
        }
        catch (error) {
            console.error('[AgentList] خطأ غير متوقع:', error);
            setError(error.message || 'حدث خطأ غير متوقع');
            setLoading(false);
            return;
        }
        setLoading(false);
    };
    useEffect(() => {
        console.log('[AgentList] تنفيذ useEffect...');
        fetchAgents();
    }, []);
    const handleDeleteAgent = async (transferCustomers) => {
        if (!deletingAgent || isDeleting) {
            console.warn('[AgentList] محاولة حذف غير صالحة:', { deletingAgent, isDeleting });
            return;
        }
        console.log('[AgentList] بدء عملية الحذف:', {
            agentId: deletingAgent.id,
            transferCustomers,
            customerCount: deletingAgent.customerCount
        });
        setIsDeleting(true);
        try {
            if (transferCustomers && deletingAgent.customerCount > 0) {
                console.log('[AgentList] البحث عن مدير النظام...');
                const adminUser = agents.find(agent => agent.role === 'admin');
                console.log('[AgentList] مدير النظام:', adminUser);
                if (!adminUser) {
                    throw new Error('لم يتم العثور على مدير النظام لنقل العملاء إليه. يرجى التأكد من وجود مدير نظام نشط.');
                }
                if (!apiClient?.agents?.transferCustomers) {
                    throw new Error('خطأ في تهيئة API: وظيفة نقل العملاء غير متوفرة');
                }
                console.log('[AgentList] نقل العملاء...');
                const transferResult = await apiClient.agents.transferCustomers(deletingAgent.id, adminUser.id);
                console.log('[AgentList] نتيجة نقل العملاء:', transferResult);
                if (!transferResult.success) {
                    throw new Error(transferResult.message || 'فشل في نقل العملاء');
                }
            }
            if (!apiClient?.agents?.delete) {
                throw new Error('خطأ في تهيئة API: وظيفة حذف المندوب غير متوفرة');
            }
            console.log('[AgentList] حذف المندوب...');
            const deleteResult = await apiClient.agents.delete(deletingAgent.id);
            console.log('[AgentList] نتيجة الحذف:', deleteResult);
            if (!deleteResult.success) {
                throw new Error(deleteResult.message || 'فشل في حذف المندوب');
            }
            console.log('[AgentList] تم الحذف بنجاح');
            toast.success(t.agentList.deleteSuccess);
            setAgents(prev => prev.filter(agent => agent.id !== deletingAgent.id));
        }
        catch (error) {
            console.error('[AgentList] خطأ في عملية الحذف:', error);
            toast.error(error.message || t.common.error);
        }
        finally {
            setDeletingAgent(null);
            setIsDeleting(false);
        }
    };
    const filteredAgents = useMemo(() => {
        console.log('[AgentList] تصفية المندوبين:', { searchValue, agentsCount: agents.length });
        return agents.filter(agent => {
            if (!agent.fullName || !agent.username) {
                console.warn('[AgentList] مندوب بدون اسم كامل أو اسم مستخدم:', agent);
                return false;
            }
            const searchLower = searchValue.toLowerCase();
            return (agent.fullName.toLowerCase().includes(searchLower) ||
                agent.username.toLowerCase().includes(searchLower));
        });
    }, [searchValue, agents]);
    if (loading) {
        return (_jsx(Layout, { children: _jsxs("div", { className: "flex flex-col items-center justify-center h-64", children: [_jsx(LoadingSpinner, { className: "animate-spin w-10 h-10 text-blue-500" }), _jsx("p", { className: "mt-4 text-gray-600 transition-opacity animate-pulse", children: "\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628\u064A\u0646..." })] }) }));
    }
    if (error) {
        return (_jsx(Layout, { children: _jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-center", children: [_jsxs("div", { className: "text-red-500 mb-4 font-semibold", children: ["\u26A0\uFE0F ", error] }), _jsx("button", { onClick: fetchAgents, className: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors", children: "\uD83D\uDD04 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629" })] }) }));
    }
    return (_jsxs(Layout, { children: [_jsx(AgentListHeader, { searchValue: searchValue, onSearchChange: setSearchValue }), filteredAgents.length === 0 ? (_jsx("div", { className: "flex flex-col items-center justify-center py-8", children: _jsx("div", { className: "text-gray-500 text-lg", children: searchValue ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "block mb-2", children: "\uD83D\uDD0D" }), _jsxs("span", { children: ["\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C \u0644\u0644\u0628\u062D\u062B \u0639\u0646 \"", searchValue, "\""] }), _jsx("button", { onClick: () => setSearchValue(''), className: "mt-4 text-blue-500 hover:text-blue-600 text-sm", children: "\u21A9\uFE0F \u0645\u0633\u062D \u0627\u0644\u0628\u062D\u062B" })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "block mb-2", children: "\uD83D\uDC65" }), _jsx("span", { children: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0646\u062F\u0648\u0628\u064A\u0646 \u062D\u0627\u0644\u064A\u0627\u064B" }), _jsx("button", { onClick: fetchAgents, className: "mt-4 text-blue-500 hover:text-blue-600 text-sm", children: "\uD83D\uDD04 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0642\u0627\u0626\u0645\u0629" })] })) }) })) : (_jsx(AgentListTable, { agents: filteredAgents, onDeleteClick: setDeletingAgent, isLoading: isDeleting })), deletingAgent && (_jsx(DeleteConfirmationModal, { isOpen: !!deletingAgent, onClose: () => !isDeleting && setDeletingAgent(null), onConfirm: handleDeleteAgent, title: t.agentList.deleteTitle, description: t.agentList.deleteDescription, showTransferOption: deletingAgent.customerCount > 0, transferDescription: t.agentList.transferDescription, isLoading: isDeleting }))] }));
}
