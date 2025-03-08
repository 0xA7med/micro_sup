import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import AgentListHeader from './AgentListHeader';
import AgentListTable from './AgentListTable';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { useI18nStore } from '../../store/i18nStore';
import Dexie from 'dexie';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Agent {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  address: string;
  createdAt: string;
  customerCount: number;
  role?: string;
}

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

const db = new Dexie('MyDatabase');
db.version(1).stores({
  users: '++id, username, fullName, phone, address, createdAt, customerCount, role'
});

export default function AgentList() {
  console.log('[AgentList] تهيئة المكون...');
  
  const [searchValue, setSearchValue] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingAgent, setDeletingAgent] = useState<Agent | null>(null);
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
      console.log('[AgentList] استدعاء قاعدة البيانات...');
      // استخدام Dexie بدلاً من API
      const agentsList = await db.users.filter(user => user.role === 'agent').toArray();
      console.log('[AgentList] استجابة قاعدة البيانات:', agentsList);

      // التحقق من صحة بيانات كل مندوب
      const validAgents = agentsList.filter(agent => {
        if (!agent.id || !agent.username || !agent.fullName) {
          console.warn('[AgentList] مندوب غير صالح:', agent);
          return false;
        }
        return true;
      });

      console.log('[AgentList] المندوبين الصالحين:', validAgents);
      setAgents(validAgents);
    } catch (error: any) {
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

  const handleDeleteAgent = async (transferCustomers: boolean) => {
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
        const adminUser = await db.users.get({ role: 'admin' });
        console.log('[AgentList] مدير النظام:', adminUser);

        if (!adminUser) {
          throw new Error('لم يتم العثور على مدير النظام لنقل العملاء إليه. يرجى التأكد من وجود مدير نظام نشط.');
        }

        // نقل العملاء إلى مدير النظام
        await db.users.update(deletingAgent.id, { customerCount: 0 });
        await db.users.update(adminUser.id, { customerCount: adminUser.customerCount + deletingAgent.customerCount });
      }

      // حذف المندوب من قاعدة البيانات
      await db.users.delete(deletingAgent.id);

      console.log('[AgentList] تم الحذف بنجاح');
      toast.success(t.agentList.deleteSuccess);
      setAgents(prev => prev.filter(agent => agent.id !== deletingAgent.id));
    } catch (error: any) {
      console.error('[AgentList] خطأ في عملية الحذف:', error);
      toast.error(error.message || t.common.error);
    } finally {
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
      return (
        agent.fullName.toLowerCase().includes(searchLower) ||
        agent.username.toLowerCase().includes(searchLower)
      );
    });
  }, [searchValue, agents]);

  if (loading) {
    return (
      <Layout title={t.agentList}>
        <div className="flex flex-col items-center justify-center h-64">
          <LoadingSpinner className="animate-spin w-10 h-10 text-blue-500" />
          <p className="mt-4 text-gray-600 transition-opacity animate-pulse">
            جاري تحميل قائمة المندوبين...
          </p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={t.agentList}>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-red-500 mb-4 font-semibold">
            ⚠️ {error}
          </div>
          <button
            onClick={fetchAgents}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            🔄 إعادة المحاولة
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t.agentList}>
      <AgentListHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      
      {filteredAgents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="text-gray-500 text-lg">
            {searchValue ? (
              <>
                <span className="block mb-2">🔍</span>
                <span>لا توجد نتائج للبحث عن "{searchValue}"</span>
                <button
                  onClick={() => setSearchValue('')}
                  className="mt-4 text-blue-500 hover:text-blue-600 text-sm"
                >
                  ↩️ مسح البحث
                </button>
              </>
            ) : (
              <>
                <span className="block mb-2">👥</span>
                <span>لا يوجد مندوبين حالياً</span>
                <button
                  onClick={fetchAgents}
                  className="mt-4 text-blue-500 hover:text-blue-600 text-sm"
                >
                  🔄 تحديث القائمة
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <AgentListTable
          agents={filteredAgents}
          onDeleteClick={setDeletingAgent}
          isLoading={isDeleting}
        />
      )}

      {deletingAgent && (
        <DeleteConfirmationModal
          isOpen={!!deletingAgent}
          onClose={() => !isDeleting && setDeletingAgent(null)}
          onConfirm={handleDeleteAgent}
          title={t.agentList.deleteTitle}
          description={t.agentList.deleteDescription}
          showTransferOption={deletingAgent.customerCount > 0}
          transferDescription={t.agentList.transferDescription}
          isLoading={isDeleting}
        />
      )}
    </Layout>
  );
}