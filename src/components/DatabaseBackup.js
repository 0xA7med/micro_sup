import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Download, Upload, Database, X } from 'lucide-react';
import { db } from '../db/database';
import toast from 'react-hot-toast';
export default function DatabaseBackup({ onClose }) {
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
        }
        catch (error) {
            console.error('Backup error:', error);
            toast.error('حدث خطأ أثناء إنشاء النسخة الاحتياطية');
        }
    };
    const handleRestore = async (event) => {
        try {
            const file = event.target.files?.[0];
            if (!file)
                return;
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const backup = JSON.parse(e.target?.result);
                    if (!backup.customers || !backup.users || !backup.timestamp) {
                        throw new Error('ملف النسخة الاحتياطية غير صالح');
                    }
                    await db.customers.clear();
                    await db.users.clear();
                    await db.customers.bulkAdd(backup.customers);
                    await db.users.bulkAdd(backup.users);
                    toast.success('تم استعادة النسخة الاحتياطية بنجاح');
                    if (onClose)
                        onClose();
                }
                catch (error) {
                    console.error('Restore error:', error);
                    toast.error('حدث خطأ أثناء استعادة النسخة الاحتياطية');
                }
            };
            reader.readAsText(file);
        }
        catch (error) {
            console.error('File reading error:', error);
            toast.error('حدث خطأ أثناء قراءة الملف');
        }
        event.target.value = '';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Database, { className: "h-5 w-5 text-indigo-600" }), _jsx("h3", { className: "text-lg font-medium", children: "\u0625\u062F\u0627\u0631\u0629 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A" })] }), onClose && (_jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-500", children: _jsx(X, { className: "h-5 w-5" }) }))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("button", { onClick: handleBackup, className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: [_jsx(Download, { className: "h-4 w-4" }), "\u062A\u0646\u0632\u064A\u0644 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629"] }), _jsxs("label", { className: "w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer", children: [_jsx(Upload, { className: "h-4 w-4" }), "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629", _jsx("input", { type: "file", accept: ".json", onChange: handleRestore, className: "hidden" })] })] })] }));
}
