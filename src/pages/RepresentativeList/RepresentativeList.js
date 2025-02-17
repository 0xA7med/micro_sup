import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { ArrowLeft, Plus, Trash2, Search, ArrowUpDown, UserCircle, Phone, Mail, Edit, } from 'lucide-react';
import { useI18nStore } from '../../store/i18nStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../../db/database';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import Button from '../../components/ui/Button';
import Layout from '../../components/Layout';
export default function RepresentativeList() {
    const navigate = useNavigate();
    const { translations: t, language } = useI18nStore();
    const user = useAuthStore((state) => state.user);
    const [representatives, setRepresentatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [representativeToDelete, setRepresentativeToDelete] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [viewMode, setViewMode] = useState('grid');
    useEffect(() => {
        const fetchRepresentatives = async () => {
            try {
                const allRepresentatives = await db.users
                    .where('role')
                    .equals('representative')
                    .toArray();
                setRepresentatives(allRepresentatives);
            }
            catch (error) {
                console.error('Error fetching representatives:', error);
                toast.error(t.agent.fetchError);
            }
            finally {
                setLoading(false);
            }
        };
        fetchRepresentatives();
    }, [t.agent.fetchError]);
    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc'
                ? 'desc'
                : 'asc',
        }));
    };
    const handleDelete = async () => {
        if (!representativeToDelete)
            return;
        try {
            await db.users.delete(representativeToDelete.id);
            setRepresentatives((prev) => prev.filter((rep) => rep.id !== representativeToDelete.id));
            toast.success(t.agent.deleteSuccess);
        }
        catch (error) {
            console.error('Error deleting representative:', error);
            toast.error(t.agent.deleteError);
        }
        finally {
            setShowDeleteModal(false);
            setRepresentativeToDelete(null);
        }
    };
    const handleEdit = (representative) => {
        navigate(`/representatives/edit/${representative.id}`);
    };
    const filteredRepresentatives = representatives
        .filter((rep) => {
        const searchLower = searchTerm.toLowerCase();
        return (rep.username.toLowerCase().includes(searchLower) ||
            rep.fullName.toLowerCase().includes(searchLower) ||
            (rep.email && rep.email.toLowerCase().includes(searchLower)) ||
            (rep.phone && rep.phone.toLowerCase().includes(searchLower)));
    })
        .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        }
        else {
            return aValue < bValue ? 1 : -1;
        }
    });
    const dateLocale = language === 'ar' ? arSA : enUS;
    const renderGridView = () => (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6", children: filteredRepresentatives.map((representative) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center space-x-3 rtl:space-x-reverse", children: [_jsx(UserCircle, { className: "h-12 w-12 text-indigo-500" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: representative.fullName }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["@", representative.username] })] })] }), _jsxs("div", { className: "flex space-x-2 rtl:space-x-reverse", children: [_jsx("button", { onClick: () => handleEdit(representative), className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300", children: _jsx(Edit, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => {
                                        setRepresentativeToDelete(representative);
                                        setShowDeleteModal(true);
                                    }, className: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300", children: _jsx(Trash2, { className: "h-5 w-5" }) })] })] }), _jsxs("div", { className: "space-y-2", children: [representative.phone && (_jsxs("div", { className: "flex items-center text-sm text-gray-600 dark:text-gray-300", children: [_jsx(Phone, { className: "h-4 w-4 mr-2" }), representative.phone] })), representative.email && (_jsxs("div", { className: "flex items-center text-sm text-gray-600 dark:text-gray-300", children: [_jsx(Mail, { className: "h-4 w-4 mr-2" }), representative.email] })), _jsxs("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-4", children: [t.common.createdAt, ":", ' ', format(new Date(representative.created_at), 'PPP', {
                                    locale: dateLocale,
                                })] })] })] }, representative.id))) }));
    const renderTableView = () => (_jsx("div", { className: "overflow-x-auto mt-6", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-700", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer", onClick: () => handleSort('fullName'), children: _jsxs("div", { className: "flex items-center gap-2", children: [t.agent.name, _jsx(ArrowUpDown, { className: "h-4 w-4" })] }) }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer", onClick: () => handleSort('username'), children: _jsxs("div", { className: "flex items-center gap-2", children: [t.auth.username, _jsx(ArrowUpDown, { className: "h-4 w-4" })] }) }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: t.common.contact }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer", onClick: () => handleSort('created_at'), children: _jsxs("div", { className: "flex items-center gap-2", children: [t.common.createdAt, _jsx(ArrowUpDown, { className: "h-4 w-4" })] }) }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: t.common.actions })] }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700", children: filteredRepresentatives.map((representative) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-700", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: representative.fullName }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: representative.username }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: _jsxs("div", { className: "space-y-1", children: [representative.phone && (_jsxs("div", { className: "flex items-center", children: [_jsx(Phone, { className: "h-4 w-4 mr-2 text-gray-400" }), representative.phone] })), representative.email && (_jsxs("div", { className: "flex items-center", children: [_jsx(Mail, { className: "h-4 w-4 mr-2 text-gray-400" }), representative.email] }))] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: format(new Date(representative.created_at), 'PPP', {
                                    locale: dateLocale,
                                }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex justify-end space-x-2 rtl:space-x-reverse", children: [_jsx("button", { onClick: () => handleEdit(representative), className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300", children: _jsx(Edit, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => {
                                                setRepresentativeToDelete(representative);
                                                setShowDeleteModal(true);
                                            }, className: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300", children: _jsx(Trash2, { className: "h-5 w-5" }) })] }) })] }, representative.id))) })] }) }));
    return (_jsx(Layout, { title: t.agent.list, children: _jsxs("div", { className: "max-w-7xl mx-auto p-4", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start sm:items-center gap-4 mb-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => navigate('/'), className: "flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors", children: [_jsx(ArrowLeft, { className: "h-5 w-5" }), _jsx("span", { children: t.common.back })] }), _jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white", children: t.agent.list })] }), _jsxs("p", { className: "mt-2 text-base text-gray-500 dark:text-gray-400", children: [filteredRepresentatives.length, " ", t.agent.list] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: t.common.search, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" })] }), _jsxs("div", { className: "flex items-center space-x-2 rtl:space-x-reverse", children: [_jsx("button", { onClick: () => setViewMode('grid'), className: `p-2 rounded-lg ${viewMode === 'grid'
                                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: _jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" }) }) }), _jsx("button", { onClick: () => setViewMode('table'), className: `p-2 rounded-lg ${viewMode === 'table'
                                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: _jsx("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 10h16M4 14h16M4 18h16" }) }) })] }), _jsxs(Button, { onClick: () => navigate('/representatives/add'), className: "flex items-center gap-2", children: [_jsx(Plus, { className: "h-5 w-5" }), t.agent.add] })] })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden", children: loading ? (_jsx("div", { className: "p-6 text-center text-gray-500 dark:text-gray-400", children: t.common.loading })) : filteredRepresentatives.length === 0 ? (_jsx("div", { className: "p-6 text-center text-gray-500 dark:text-gray-400", children: t.agent.noResults })) : viewMode === 'grid' ? (renderGridView()) : (renderTableView()) }), showDeleteModal && (_jsx(DeleteConfirmationModal, { onConfirm: handleDelete, onCancel: () => {
                        setShowDeleteModal(false);
                        setRepresentativeToDelete(null);
                    } }))] }) }));
}
