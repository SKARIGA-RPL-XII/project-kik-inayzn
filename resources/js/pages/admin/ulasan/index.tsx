import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Trash2, Plus, Star } from 'lucide-react'; // Tambah import Plus dan Star
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header';

export default function ReviewIndex({ reviews }: any) {
    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Head title="Admin - Ulasan" />
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8">
                    {/* HEADER SECTION DENGAN BUTTON TAMBAH */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Daftar Ulasan</h2>
                            <p className="text-sm text-slate-500">Kelola semua ulasan properti dari pengguna</p>
                        </div>
                        
                        <Link 
                            href="/ulasan/create" // Sesuaikan dengan route tambah ulasan Anda
                            className="flex items-center justify-center gap-2 bg-[#1A4D2E] hover:bg-[#143d24] text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm active:scale-95"
                        >
                            <Plus size={20} />
                            <span>Tambah Ulasan</span>
                        </Link>
                    </div>

                    {/* TABLE ULASAN */}
                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white mt-4">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#e9eff6] text-slate-700 font-bold text-sm uppercase tracking-wider">
                                    <th className="px-6 py-5 border-r border-white w-20 text-center">no</th>
                                    <th className="px-6 py-5 border-r border-white">Nama Pengguna</th>
                                    <th className="px-6 py-5 border-r border-white">Product</th>
                                    <th className="px-6 py-5 border-r border-white">Rating</th>
                                    <th className="px-6 py-5 border-r border-white">Komentar</th>
                                    <th className="px-6 py-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {reviews.data.map((item: any, index: number) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors text-slate-600">
                                        <td className="px-6 py-5 text-center font-medium">{reviews.from + index}</td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-800">{item.user?.username || 'User'}</div>
                                        </td>
                                        <td className="px-6 py-5">{item.product?.name || 'Rumah'}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                <Star size={16} fill="currentColor" />
                                                {item.rating}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 truncate max-w-xs">{item.comment}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button 
                                                    onClick={() => confirm('Hapus ulasan?') && router.delete(`/ulasan/${item.id}`)}
                                                    className="p-1.5 text-rose-500 border border-rose-500 rounded-lg hover:bg-rose-50 transition-all shadow-sm"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-10 flex justify-between items-center text-slate-400 text-sm font-medium">
                        <p>Menampilkan {reviews.from}-{reviews.to} dari {reviews.total} data</p>
                        <div className="flex items-center gap-2">
                            {reviews.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg border ${
                                        link.active ? 'bg-[#1A4D2E] text-white border-[#1A4D2E] shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                                    } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}