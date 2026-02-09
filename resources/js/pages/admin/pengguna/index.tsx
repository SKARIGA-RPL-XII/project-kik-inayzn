import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, X, Eye, EyeOff, Sparkles, UserPlus } from 'lucide-react'; 
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header';

export default function UserIndex({ admins, users }: any) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // --- LOGIKA MODAL TAMBAH ---
    const openAddModal = () => {
        reset();
        setIsAddModalOpen(true);
    };

    const handleStore = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pengguna', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    // --- LOGIKA MODAL EDIT ---
    const openEditModal = (user: any) => {
        setSelectedUser(user);
        setData({
            username: user.username,
            email: user.email,
            password: '',
            password_confirmation: '',
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            put(`/pengguna/${selectedUser.id}`, {
                onSuccess: () => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                    reset();
                },
            });
        }
    };

    // --- LOGIKA MODAL HAPUS ---
    const openDeleteModal = (user: any) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedUser) {
            router.delete(`/pengguna/${selectedUser.id}`, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                },
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Head title="Admin - Pengguna" />
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8">
                    {/* SEARCH & TOMBOL ADD */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="relative w-full max-w-lg">
                            <input
                                type="text"
                                placeholder="Cari pengguna..."
                                className="w-full pl-6 pr-12 py-3.5 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#1a432d]/20 focus:border-[#1a432d] outline-none text-slate-500 transition-all bg-white"
                            />
                            <Search className="absolute right-4 top-3.5 text-slate-400" size={22} />
                        </div>
                        <button 
                            onClick={openAddModal}
                            className="bg-[#1a432d] hover:bg-[#143524] text-white px-8 py-3.5 rounded-xl flex items-center gap-3 font-bold shadow-md transition-all active:scale-95 text-lg"
                        >
                            <Plus size={24} strokeWidth={3} /> Tambah Pengguna
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#e9eff6] text-slate-700 font-bold text-sm uppercase tracking-wider">
                                    <th className="px-6 py-5 border-r border-white w-20 text-center">#</th>
                                    <th className="px-6 py-5 border-r border-white">Username</th>
                                    <th className="px-6 py-5 border-r border-white">Email</th>
                                    <th className="px-6 py-5 border-r border-white text-center">Role</th>
                                    <th className="px-6 py-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {admins.map((admin: any, index: number) => (
                                    <tr key={admin.id} className="hover:bg-blue-50/20 transition-colors bg-blue-50/5">
                                        <td className="px-6 py-5 text-center text-blue-500 font-bold">{index + 1}</td>
                                        <td className="px-6 py-5 text-slate-800 font-bold">{admin.username}</td>
                                        <td className="px-6 py-5 text-slate-600 font-medium">{admin.email}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider border bg-blue-50 text-blue-600 border-blue-100 italic">
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => openEditModal(admin)} className="p-1.5 text-orange-400 border border-orange-400 rounded-lg hover:bg-orange-50 transition-all shadow-sm">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => openDeleteModal(admin)} className="p-1.5 text-rose-500 border border-rose-500 rounded-lg hover:bg-rose-50 transition-all shadow-sm">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.data.map((user: any, index: number) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5 text-center text-slate-500 font-medium">{admins.length + (index + 1)}</td>
                                        <td className="px-6 py-5 text-slate-700 font-semibold">{user.username}</td>
                                        <td className="px-6 py-5 text-slate-600 font-medium">{user.email}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider border bg-slate-50 text-slate-500 border-slate-100">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center text-slate-300 italic text-[10px] font-bold">READ ONLY</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* --- MODAL TAMBAH PENGGUNA --- */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[30px] shadow-2xl overflow-hidden relative border border-white/20">
                        <div className="flex justify-between items-center px-10 py-6 border-b border-slate-100 bg-[#f8fafc]">
                            <div className="flex items-center gap-3 text-[#1a432d]">
                                <div className="p-2 bg-[#1a432d]/10 rounded-lg text-[#1a432d]">
                                    <UserPlus size={24} />
                                </div>
                                <h2 className="text-2xl font-black italic tracking-tight uppercase">Tambah Pengguna</h2>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={28} /></button>
                        </div>
                        
                        <form onSubmit={handleStore} className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
                                    <input type="text" value={data.username} onChange={e => setData('username', e.target.value)} placeholder="Username" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-[#1a432d] focus:ring-4 focus:ring-[#1a432d]/5 outline-none transition-all font-bold text-slate-700" required />
                                    {errors.username && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.username}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="Email" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-[#1a432d] focus:ring-4 focus:ring-[#1a432d]/5 outline-none transition-all font-bold text-slate-700" required />
                                    {errors.email && <p className="text-red-500 text-xs mt-1 font-bold italic">{errors.email}</p>}
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-[#1a432d] focus:ring-4 focus:ring-[#1a432d]/5 outline-none transition-all font-bold text-slate-700" required />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4 text-slate-400">
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Konfirmasi</label>
                                    <input type={showPassword ? "text" : "password"} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Konfirmasi" className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-[#1a432d] outline-none transition-all font-bold" required />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-slate-50">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-8 py-4 rounded-2xl bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Batal</button>
                                <button type="submit" disabled={processing} className="px-10 py-4 rounded-2xl bg-[#1a432d] text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-[#1a432d]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                    {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                                    <Sparkles size={14} fill="white" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL EDIT */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-3xl rounded-[20px] shadow-2xl overflow-hidden relative border border-white/20">
                        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-orange-50/30">
                            <h2 className="text-xl font-bold text-slate-800">Edit Pengguna</h2>
                            <button onClick={() => { setIsEditModalOpen(false); setSelectedUser(null); }} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Nama Pengguna<span className="text-orange-500 ml-1">*</span></label>
                                    <input type="text" value={data.username} onChange={e => setData('username', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition-all text-slate-600 shadow-sm" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Email<span className="text-orange-500 ml-1">*</span></label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition-all text-slate-600 shadow-sm" required />
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="text-sm font-bold text-slate-700">Password Baru</label>
                                    <div className="relative">
                                        <input type={showPassword ? "text" : "password"} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Kosongkan jika tidak ganti" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition-all" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400">
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Konfirmasi Password</label>
                                    <input type={showPassword ? "text" : "password"} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition-all" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-10">
                                <button type="button" onClick={() => { setIsEditModalOpen(false); setSelectedUser(null); }} className="px-8 py-2.5 rounded-lg bg-slate-400 text-white font-bold italic">Batal</button>
                                <button type="submit" disabled={processing} className="px-8 py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold italic shadow-md">Simpan Perubahan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL HAPUS */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden p-10 text-center">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-[#CC2014] mx-auto mb-6">
                            <Trash2 size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3">Hapus Data?</h3>
                        <p className="text-slate-500 font-medium leading-relaxed mb-10">
                            Data <span className="text-slate-900 font-bold">"{selectedUser?.username}"</span> akan dihapus secara permanen.
                        </p>
                        <div className="flex gap-4 w-full">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 px-6 rounded-full bg-[#a3b1c6] text-white font-bold hover:bg-slate-500 transition-all">Batal</button>
                            <button onClick={handleDelete} className="flex-1 py-4 px-6 rounded-full bg-[#CC2014] text-white font-bold hover:bg-red-700 transition-all">Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}