import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { 
    Search, Plus, Edit, X, Eye, ShieldAlert, Mail, 
    User as UserIcon, Calendar, Clock
} from 'lucide-react'; 
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header';

export default function UserIndex({ admins, users }: any) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); 
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Format Tanggal & Waktu Indonesia
    const formatFullDateTime = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + ' WIB';
    };

    const openDetailModal = (user: any) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const openAddModal = () => { reset(); setIsAddModalOpen(true); };
    
    const openEditModal = (user: any) => {
        setSelectedUser(user);
        setData({ username: user.username, email: user.email, password: '', password_confirmation: '' });
        setIsEditModalOpen(true);
    };

    const handleStore = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pengguna', { onSuccess: () => { setIsAddModalOpen(false); reset(); } });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            put(`/pengguna/${selectedUser.id}`, { onSuccess: () => { setIsEditModalOpen(false); setSelectedUser(null); reset(); } });
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Head title="Admin - Pengguna" />
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="relative w-full max-w-lg">
                            <input type="text" placeholder="Cari pengguna..." className="w-full pl-6 pr-12 py-3.5 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#1a432d]/20 focus:border-[#1a432d] outline-none text-slate-500 transition-all bg-white" />
                            <Search className="absolute right-4 top-3.5 text-slate-400" size={22} />
                        </div>
                        <button onClick={openAddModal} className="bg-[#1a432d] hover:bg-[#143524] text-white px-8 py-3.5 rounded-xl flex items-center gap-3 font-bold shadow-md transition-all active:scale-95 text-lg">
                            <Plus size={24} strokeWidth={3} /> Tambah Pengguna
                        </button>
                    </div>

                    {/* TABLE */}
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
                                            <span className="px-3 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider border bg-blue-50 text-blue-600 border-blue-100 italic">{admin.role}</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button onClick={() => openEditModal(admin)} className="p-1.5 text-orange-400 border border-orange-400 rounded-lg hover:bg-orange-50 transition-all shadow-sm">
                                                <Edit size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                
                                {users.data.map((user: any, index: number) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5 text-center text-slate-500 font-medium">{admins.length + (index + 1)}</td>
                                        <td className="px-6 py-5 text-slate-700 font-semibold">{user.username}</td>
                                        <td className="px-6 py-5 text-slate-600 font-medium">{user.email}</td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider border bg-slate-50 text-slate-500 border-slate-100">{user.role}</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button onClick={() => openDetailModal(user)} className="p-1.5 text-emerald-500 border border-emerald-500 rounded-lg hover:bg-emerald-50 transition-all shadow-sm flex items-center gap-2 px-3 font-bold mx-auto">
                                                <Eye size={18} /> Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* --- MODAL DETAIL USER --- */}
            {isDetailModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in duration-300">
                        <div className="h-40 bg-gradient-to-br from-[#1a432d] to-emerald-800 relative">
                            <button onClick={() => setIsDetailModalOpen(false)} className="absolute right-6 top-6 text-white/50 hover:text-white transition-colors z-10">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="px-8 pb-10 relative">
                            <div className="flex justify-center -mt-20 mb-4">
                                <div className="w-36 h-36 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center border-[10px] border-white overflow-hidden bg-slate-50">
                                    {selectedUser?.foto ? (
                                        <img 
                                            src={`/storage/${selectedUser.foto}`} 
                                            alt={selectedUser.username} 
                                            className="w-full h-full object-cover"
                                            onError={(e: any) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${selectedUser.username}&background=ecfdf5&color=059669&bold=true&size=150`;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <UserIcon size={60} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedUser?.username}</h3>
                                <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">User Terdaftar</p>
                            </div>

                            <div className="space-y-3 text-left">
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm"><Mail size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Email Address</p>
                                        <p className="text-sm font-bold text-slate-700">{selectedUser?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm"><Calendar size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Member Sejak</p>
                                        <p className="text-sm font-bold text-slate-700">{selectedUser?.created_at ? new Date(selectedUser.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="p-2 bg-white rounded-lg text-emerald-500 shadow-sm"><Clock size={18} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Pembaruan Akun</p>
                                        <p className="text-[11px] font-bold text-slate-700">{formatFullDateTime(selectedUser?.updated_at)}</p>
                                    </div>
                                </div>

                                <div className="mt-6 p-5 bg-amber-50 rounded-[1.5rem] border border-amber-100 flex gap-4 items-start">
                                    <div className="p-2 bg-amber-500 rounded-xl text-white shrink-0 shadow-lg">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-xs font-black text-amber-700 uppercase mb-1">Keamanan Data</h4>
                                        <p className="text-[11px] text-amber-600/80 font-medium leading-relaxed">
                                            Password ter-enkripsi. Perubahan data terakhir (Nama/Email/Pass) terdeteksi pada <span className="font-bold">{formatFullDateTime(selectedUser?.updated_at)}</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setIsDetailModalOpen(false)} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.1em] text-xs hover:bg-slate-800 transition-all shadow-lg">Tutup Detail</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ADD/EDIT */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-800">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative">
                        <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"><X size={24}/></button>
                        <h2 className="text-2xl font-black mb-6 tracking-tight">{isAddModalOpen ? 'Tambah Pengguna' : 'Edit Pengguna'}</h2>
                        <form onSubmit={isAddModalOpen ? handleStore : handleUpdate} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black mb-1.5 uppercase tracking-[0.15em] text-slate-400">Username</label>
                                <input value={data.username} onChange={e => setData('username', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black mb-1.5 uppercase tracking-[0.15em] text-slate-400">Email Address</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black mb-1.5 uppercase tracking-[0.15em] text-slate-400">Password {isEditModalOpen && '(Kosongkan jika tak ganti)'}</label>
                                <input type="password" onChange={e => setData('password', e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            </div>
                            <button type="submit" disabled={processing} className="w-full py-4 bg-[#1a432d] text-white rounded-xl font-black uppercase tracking-widest text-xs">
                                {processing ? 'Memproses...' : 'Simpan Data'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}