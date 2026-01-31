import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header';

export default function ProductIndex({ products }: any) {
    return (
        <div className="flex min-h-screen bg-white">
            <Head title="Admin - Daftar Produk" />

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col">
                <Header />

                {/* CONTENT BODY */}
                <main className="p-8">
                    {/* BARIS ATAS: SEARCH & TOMBOL ADD */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search product..."
                                className="w-full pl-6 pr-12 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#1a432d]/20 focus:border-[#1a432d] outline-none text-slate-600 transition-all"
                            />
                            <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
                        </div>
                        
                        <button className="bg-[#1a432d] hover:bg-[#143524] text-white px-10 py-3 rounded-xl flex items-center gap-3 font-semibold shadow-md transition-all active:scale-95 text-xl">
                            <Plus size={24} strokeWidth={3} />
                            Add
                        </button>
                    </div>

                    {/* CONTAINER TABEL */}
                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#e9eff6] text-slate-700 font-bold text-sm uppercase tracking-wider">
                                    <th className="px-6 py-5 border-r border-white w-16 text-center">no</th>
                                    <th className="px-6 py-5 border-r border-white">Nama Product</th>
                                    <th className="px-6 py-5 border-r border-white">Kategori</th>
                                    <th className="px-6 py-5 border-r border-white">Harga</th>
                                    <th className="px-6 py-5 border-r border-white">Status</th>
                                    <th className="px-6 py-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.data.length > 0 ? (
                                    products.data.map((item: any, index: number) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            {/* Penomoran yang sinkron dengan halaman pagination */}
                                            <td className="px-6 py-5 text-center font-medium text-slate-500">
                                                {products.from + index}
                                            </td>
                                            <td className="px-6 py-5 text-slate-700 font-semibold">{item.name || item.nama_produk}</td>
                                            <td className="px-6 py-5 text-slate-600">{item.category || 'Rumah'}</td>
                                            <td className="px-6 py-5 text-[#1a432d] font-bold">
                                                Rp {item.price ? Number(item.price).toLocaleString('id-ID') : '0'}
                                            </td>
                                            <td className="px-6 py-5 text-slate-600">{item.status || 'Tersedia'}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-center gap-3">
                                                    <button className="p-1.5 text-orange-400 border border-orange-400 rounded-md hover:bg-orange-50 transition-all">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button className="p-1.5 text-rose-500 border border-rose-500 rounded-md hover:bg-rose-50 transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">
                                            Belum ada data produk tersedia.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER: INFO DATA & PAGINATION DINAMIS */}
                    <div className="mt-10 flex justify-between items-center text-slate-400 text-sm font-medium">
                        <p>Menampilkan {products.from || 0}-{products.to || 0} dari {products.total} data</p>
                        <div className="flex items-center gap-2">
                            {products.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`
                                        min-w-[40px] h-10 flex items-center justify-center rounded-xl border transition-all
                                        ${link.active 
                                            ? 'bg-[#1a432d] text-white border-[#1a432d] shadow-md' 
                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-[#1a432d]'
                                        }
                                        ${!link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                                    `}
                                    // Menggunakan dangerouslySetInnerHTML karena Laravel mengirim label &laquo; (Prev) dan &raquo; (Next)
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}