import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
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
                                        <td className="px-6 py-5">{item.user?.username || 'User'}</td>
                                        <td className="px-6 py-5">{item.product?.name || 'Rumah'}</td>
                                        <td className="px-6 py-5 font-semibold">{item.rating}</td>
                                        <td className="px-6 py-5 truncate max-w-xs">{item.comment}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button 
                                                    onClick={() => confirm('Hapus ulasan?') && router.delete(`/ulasan/${item.id}`)}
                                                    className="p-1.5 text-rose-500 border border-rose-500 rounded-lg hover:bg-rose-50 transition-all"
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
                                        link.active ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
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