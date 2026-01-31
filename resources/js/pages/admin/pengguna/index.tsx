import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header';

export default function UserIndex({ users }: any) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            // Pastikan route ini sesuai dengan yang ada di web.php
            router.delete(`/pengguna/${id}`);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Head title="Admin - Pengguna" />
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8">
                    {/* SEARCH & ADD SECTION */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="relative w-full max-w-lg">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full pl-6 pr-12 py-3.5 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#1a432d]/20 focus:border-[#1a432d] outline-none text-slate-500 transition-all"
                            />
                            <Search className="absolute right-4 top-3.5 text-slate-400" size={22} />
                        </div>
                        
                        <button className="bg-[#1a432d] hover:bg-[#143524] text-white px-8 py-3.5 rounded-xl flex items-center gap-3 font-bold shadow-md transition-all active:scale-95 text-lg">
                            <Plus size={24} strokeWidth={3} />
                            Add
                        </button>
                    </div>

                    {/* TABLE PENGGUNA */}
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
                                {users.data.length > 0 ? (
                                    users.data.map((user: any, index: number) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-5 text-center text-slate-500 font-medium">
                                                {users.from + index}
                                            </td>
                                            {/* DISESUAIKAN: menggunakan user.username sesuai Model */}
                                            <td className="px-6 py-5 text-slate-700 font-semibold">{user.username}</td>
                                            <td className="px-6 py-5 text-slate-600 font-medium">{user.email}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider border ${
                                                    user.role === 'admin' 
                                                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                                                        : 'bg-slate-50 text-slate-500 border-slate-100'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-center gap-3">
                                                    <button className="p-1.5 text-orange-400 border border-orange-400 rounded-lg hover:bg-orange-50 transition-all">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-1.5 text-rose-500 border border-rose-500 rounded-lg hover:bg-rose-50 transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                                            Belum ada data pengguna ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION SESUAI DESAIN */}
                    <div className="mt-10 flex justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
                        <p>Menampilkan {users.from}-{users.to} dari {users.total} data</p>
                        
                        <div className="flex items-center gap-2">
                            {users.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    // Ini penting untuk render tanda panah &laquo; dan &raquo;
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`
                                        min-w-[38px] h-[38px] flex items-center justify-center rounded-lg transition-all border text-xs
                                        ${link.active 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                                            : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                                        }
                                        ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}
                                    `}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}