import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header';

export default function CategoryIndex({ categories }: any) {
    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Head title="Admin - Kategori" />

            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8"> {/* Padding dikecilkan dari p-10 ke p-8 */}
                    {/* SEARCH & ADD SECTION */}
                    <div className="flex justify-between items-center mb-8"> {/* Margin bottom disamakan */}
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search category..."
                                className="w-full pl-6 pr-12 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#1a432d]/20 focus:border-[#1a432d] outline-none text-slate-500 transition-all"
                            />
                            <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
                        </div>
                        
                        <button className="bg-[#1a432d] hover:bg-[#143524] text-white px-8 py-3 rounded-xl flex items-center gap-3 font-semibold shadow-md transition-all active:scale-95">
                            <Plus size={22} strokeWidth={3} />
                            Add
                        </button>
                    </div>

                    {/* TABLE KATEGORI - UKURAN DISAMAKAN DENGAN PRODUCT */}
                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#e9eff6] text-slate-700 font-bold text-sm uppercase tracking-wider">
                                    <th className="px-6 py-5 border-r border-white w-16 text-center">no</th>
                                    <th className="px-6 py-5 border-r border-white">Nama Kategori</th>
                                    <th className="px-6 py-5 border-r border-white">Jumlah Produk</th>
                                    <th className="px-6 py-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {categories.data.length > 0 ? (
                                    categories.data.map((item: any, index: number) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-5 text-center font-medium text-slate-500">
                                                {categories.from + index}
                                            </td>
                                            <td className="px-6 py-5 text-slate-700 font-semibold">{item.name}</td>
                                            <td className="px-6 py-5 text-slate-600">
                                                <span className="bg-emerald-50 text-[#1a432d] px-3 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                                                    {item.products_count || '0'} Produk
                                                </span>
                                            </td>
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
                                        <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">
                                            Belum ada data kategori.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION SECTION - DIBUAT RAPI KE KANAN */}
                    <div className="mt-10 flex justify-between items-center text-slate-400 text-sm font-medium">
                        <p>Menampilkan {categories.from}-{categories.to} dari {categories.total} data</p>
                        
                        <div className="flex items-center gap-2">
                            {categories.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`
                                        min-w-[36px] h-9 flex items-center justify-center rounded-lg transition-all border text-xs
                                        ${link.active 
                                            ? 'bg-[#1a432d] text-white border-[#1a432d] shadow-sm' 
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