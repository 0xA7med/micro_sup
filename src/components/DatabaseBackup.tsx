import React from 'react';
import { Download, Upload, Database, X } from 'lucide-react';
import { db } from '../db/database';
import toast from 'react-hot-toast';

interface DatabaseBackupProps {
  onClose?: () => void;
}

export default function DatabaseBackup({ onClose }: DatabaseBackupProps) {
  const handleBackup = async () => {
    try {
      const backup = {
        customers: await db.customers.toArray(),
        users: await db.users.toArray(),
        timestamp: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `micropos_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('تم تنزيل النسخة الاحتياطية بنجاح');
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('حدث خطأ أثناء إنشاء النسخة الاحتياطية');
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string);
          
          if (!backup.customers || !backup.users || !backup.timestamp) {
            throw new Error('ملف النسخة الاحتياطية غير صالح');
          }

          await db.customers.clear();
          await db.users.clear();
          await db.customers.bulkAdd(backup.customers);
          await db.users.bulkAdd(backup.users);

          toast.success('تم استعادة النسخة الاحتياطية بنجاح');
          if (onClose) onClose();
        } catch (error) {
          console.error('Restore error:', error);
          toast.error('حدث خطأ أثناء استعادة النسخة الاحتياطية');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('File reading error:', error);
      toast.error('حدث خطأ أثناء قراءة الملف');
    }
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-medium">إدارة قاعدة البيانات</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <button
          onClick={handleBackup}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="h-4 w-4" />
          تنزيل نسخة احتياطية
        </button>
        
        <label className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
          <Upload className="h-4 w-4" />
          استعادة نسخة احتياطية
          <input
            type="file"
            accept=".json"
            onChange={handleRestore}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}