import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header';

export default function ProductIndex({ products }: any) {
    // --- STATE UNTUK MODAL HAPUS ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<{id: number, name: string} | null>(null);

    // Buka modal konfirmasi
    const confirmDelete = (id: number, name: string) => {
        setSelectedProduct({ id, name });
        setIsModalOpen(true);
    };

    // Eksekusi penghapusan
    const handleDelete = () => {
        if (selectedProduct) {
            router.delete(`/produk/${selectedProduct.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                },
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Head title="Admin - Daftar Produk" />

            {/* SIDEBAR */}
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {/* HEADER */}
                <Header />

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
                        
                        <Link 
                            href="/produk/create" 
                            className="bg-[#1a432d] hover:bg-[#143524] text-white px-10 py-3 rounded-xl flex items-center gap-3 font-semibold shadow-md transition-all active:scale-95 text-xl"
                        >
                            <Plus size={24} strokeWidth={3} />
                            Add
                        </Link>
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
                                {products?.data && products.data.length > 0 ? (
                                    products.data.map((item: any, index: number) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-5 text-center font-medium text-slate-500">
                                                {products.from + index}
                                            </td>
                                            <td className="px-6 py-5 text-slate-700 font-semibold">{item.nama_produk}</td>
                                            <td className="px-6 py-5 text-slate-600">{item.kategori}</td>
                                            <td className="px-6 py-5 text-[#1a432d] font-bold">
                                                Rp {item.harga ? Number(item.harga).toLocaleString('id-ID') : '0'}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-center gap-3">
                                                    <Link 
                                                        href={`/produk/${item.id}/edit`}
                                                        className="p-1.5 text-orange-400 border border-orange-400 rounded-md hover:bg-orange-50 transition-all"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>

                                                    {/* TOMBOL DELETE KUSTOM */}
                                                    <button 
                                                        onClick={() => confirmDelete(item.id, item.nama_produk)}
                                                        className="p-1.5 text-rose-500 border border-rose-500 rounded-md hover:bg-rose-50 transition-all"
                                                    >
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

                    {/* FOOTER: PAGINATION */}
                    <div className="mt-10 flex justify-between items-center text-slate-400 text-sm font-medium">
                        <p>Menampilkan {products?.from || 0}-{products?.to || 0} dari {products?.total || 0} data</p>
                        <div className="flex items-center gap-2">
                            {products?.links?.map((link: any, index: number) => (
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
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* MODAL KONFIRMASI HAPUS (SESUAI GAMBAR) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-xl transform transition-all animate-in zoom-in-95">
                        <div className="flex flex-col items-center text-center">
                            
                            {/* Ikon Tong Sampah Merah */}
                            <div className="relative mb-6">
                                <div className="text-red-500 bg-red-50 w-24 h-24 rounded-full flex items-center justify-center">
                                     <Trash2 size={48} strokeWidth={1.5} />
                                </div>
                                <div className="absolute -top-2 -right-2 text-red-300">✦</div>
                                <div className="absolute bottom-0 -left-2 text-red-300 text-xs">✦</div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Hapus Data?</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-10 px-4">
                                Data <span className="font-semibold text-slate-700">"{selectedProduct?.name}"</span> akan dihapus secara <span className="text-red-500 font-medium">permanen</span> dan tidak dapat dikembalikan.
                            </p>

                            <div className="flex gap-4 w-full px-2">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 px-6 rounded-full bg-slate-400 text-white font-semibold hover:bg-slate-500 transition-all active:scale-95 shadow-sm"
                                >
                                    Batalkan
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 py-3 px-6 rounded-full bg-[#CC2014] text-white font-semibold hover:bg-red-700 transition-all shadow-sm active:scale-95"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}