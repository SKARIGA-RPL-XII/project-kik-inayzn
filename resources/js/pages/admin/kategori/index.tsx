import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header';

export default function CategoryIndex({ categories }: any) {
    // --- STATE LOGIC ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedName, setSelectedName] = useState('');
    
    // State untuk Notifikasi
    const [notification, setNotification] = useState<{show: boolean, message: string} | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nama_kategori: '',
    });

    // Auto-hide notifikasi
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // --- HANDLERS ---
    const showSuccess = (msg: string) => {
        setNotification({ show: true, message: msg });
    };

    const openAddModal = () => {
        setIsEditMode(false);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (category: any) => {
        setIsEditMode(true);
        setSelectedId(category.id);
        setData('nama_kategori', category.name);
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (category: any) => {
        setSelectedId(category.id);
        setSelectedName(category.name);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        reset();
    };

    const handleSubmitKategori = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && selectedId) {
            put(`/kategori/${selectedId}`, { 
                onSuccess: () => {
                    closeModal();
                    showSuccess('Kategori Berhasil Diperbarui!');
                } 
            });
        } else {
            post('/kategori', { 
                onSuccess: () => {
                    closeModal();
                    showSuccess('Kategori Baru Berhasil Ditambahkan!');
                } 
            });
        }
    };

    const handleDelete = () => {
        if (selectedId) {
            router.delete(`/kategori/${selectedId}`, { 
                onSuccess: () => {
                    closeModal();
                    showSuccess('Kategori Telah Dihapus!');
                } 
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Head title="Admin - Kategori" />
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8">
                    {/* TOAST NOTIFICATION */}
                    {notification && (
                        <div className="fixed top-8 right-8 z-[110] animate-toast-in">
                            <div className="bg-[#1a432d] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border 
                            border-emerald-400/30 backdrop-blur-md">
                                <div className="bg-emerald-500/20 p-2 rounded-full">
                                    <CheckCircle2 size={20} className="text-emerald-400" />
                                </div>
                                <span className="font-bold text-sm tracking-wide">{notification.message}</span>
                                <button onClick={() => setNotification(null)} className="ml-2 opacity-60 hover:opacity-100">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SEARCH & ADD SECTION */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Cari kategori..."
                                className="w-full pl-6 pr-12 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#1a432d]/20 
                                focus:border-[#1a432d] outline-none text-slate-900 font-medium transition-all"
                            />
                            <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
                        </div>
                        
                        <button 
                            onClick={openAddModal}
                            className="bg-[#1a432d] hover:bg-[#143524] text-white px-8 py-3 rounded-xl flex items-center gap-3 font-semibold shadow-md transition-all active:scale-95"
                        >
                            <Plus size={22} strokeWidth={3} />
                            Add
                        </button>
                    </div>

                    {/* TABLE KATEGORI */}
                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#e9eff6] text-slate-800 font-bold text-sm uppercase tracking-wider">
                                    <th className="px-6 py-5 border-r border-white w-16 text-center">no</th>
                                    <th className="px-6 py-5 border-r border-white">Nama Kategori</th>
                                    <th className="px-6 py-5 border-r border-white">Jumlah Properti</th>
                                    <th className="px-6 py-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.data.length > 0 ? (
                                    categories.data.map((item: any, index: number) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-5 text-center font-medium text-slate-600">
                                                {categories.from + index}
                                            </td>
                                            <td className="px-6 py-5 text-slate-900 font-bold">{item.name}</td>
                                            <td className="px-6 py-5 text-slate-700">
                                                <span className="bg-emerald-50 text-[#1a432d] px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                                                    {item.products_count || '0'} Properti
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex justify-center gap-3">
                                                    <button onClick={() => openEditModal(item)} className="p-2 text-orange-500 border border-orange-500 
                                                    rounded-lg hover:bg-orange-50 transition-all active:scale-90">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => openDeleteModal(item)} className="p-2 text-rose-600 border border-rose-600 
                                                    rounded-lg hover:bg-rose-50 transition-all active:scale-90">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-slate-500 italic">Belum ada data kategori.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* MODAL (ADD & EDIT) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[99] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 bg-[#f1f5f9]">
                            <h3 className="text-lg font-bold text-slate-800">
                                {isEditMode ? 'Edit Kategori Produk' : 'Tambah Kategori Baru'}
                            </h3>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitKategori} className="p-10">
                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-slate-900">
                                    Nama Kategori<span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_kategori}
                                    onChange={(e) => { setData('nama_kategori', e.target.value); clearErrors('nama_kategori'); }}
                                    placeholder="Makanan"
                                    className={`w-full p-3 rounded-lg border outline-none transition-all text-sm text-slate-600 ${errors.nama_kategori ? 
                                        'border-red-500 bg-red-50' : 'border-slate-300 focus:border-emerald-500'}`}
                                    autoFocus
                                />
                                {errors.nama_kategori && (
                                    <p className="text-red-600 text-[11px] mt-2 font-bold flex items-center gap-1">
                                        <AlertCircle size={14} /> {errors.nama_kategori}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-12">
                                <button type="button" onClick={closeModal} className="px-10 py-2.5 rounded-lg bg-[#94a3b8] text-white 
                                hover:bg-slate-500 transition-all font-bold text-xs">Batal</button>
                                <button type="submit" disabled={processing} className="px-10 py-2.5 rounded-lg bg-[#ff9800] text-white 
                                font-bold text-xs shadow-md hover:bg-[#e68a00] transition-all">
                                    {processing ? '...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL HAPUS */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up p-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-[#CC2014]">
                                    <Trash2 size={48} strokeWidth={1.5} />
                                </div>
                                <Sparkles size={16} className="absolute -top-1 -right-1 text-red-300 fill-red-300" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3">Hapus Data?</h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-10">
                                Data <span className="text-slate-900 font-bold">"{selectedName}"</span> akan dihapus secara <span className="text-red-500 font-bold text-sm">permanen.</span>
                            </p>
                            <div className="flex gap-4 w-full px-2">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 px-6 rounded-full bg-[#a3b1c6] text-white 
                                font-bold hover:bg-slate-500 transition-all active:scale-95">Batal</button>
                                <button onClick={handleDelete} className="flex-1 py-4 px-6 rounded-full bg-[#CC2014] text-white 
                                font-bold hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <span>Hapus</span>
                                    <Sparkles size={12} fill="currentColor" className="opacity-80" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes toastIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
                .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
                .animate-toast-in { animation: toastIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}} />
        </div>
    );
}