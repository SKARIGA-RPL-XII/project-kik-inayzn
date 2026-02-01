import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, CheckCircle2, X } from 'lucide-react';
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header';

export default function ProductIndex({ products, filters }: any) {
    const { flash } = usePage().props as any;
    const [showNotif, setShowNotif] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<{id: number, name: string} | null>(null);

    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/produk', { search: searchQuery }, { 
            preserveState: true, 
            replace: true 
        });
    };

    useEffect(() => {
        if (flash?.success) {
            setShowNotif(true);
            const timer = setTimeout(() => setShowNotif(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const confirmDelete = (id: number, name: string) => {
        setSelectedProduct({ id, name });
        setIsModalOpen(true);
    };

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
        <div className="flex min-h-screen bg-white overflow-x-hidden">
            <Head title="Admin - Daftar Properti" />

            {/* NOTIFIKASI */}
            {showNotif && (
                <div className="fixed top-6 right-6 z-[1000] animate-slide-in-right">
                    <div className="bg-[#1A4D2E] text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400/30 min-w-[320px] relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400"></div>
                        <div className="bg-emerald-500/20 p-2 rounded-xl">
                            <CheckCircle2 size={24} className="text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest mb-0.5">Berhasil</p>
                            <p className="text-sm font-medium leading-tight text-emerald-50">{flash.success}</p>
                        </div>
                        <button onClick={() => setShowNotif(false)} className="text-emerald-300/50 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}

            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <form onSubmit={handleSearch} className="relative w-full max-w-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari produk..."
                                className="w-full pl-6 pr-12 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#1a432d]/20 focus:border-[#1a432d] outline-none text-slate-600 transition-all"/>
                            <button type="submit" className="absolute right-4 top-3.5 text-slate-400 hover:text-[#1a432d]">
                                <Search size={20} />
                            </button>
                        </form>
                        
                        <Link 
                            href="/produk/create" 
                            className="bg-[#1a432d] hover:bg-[#143524] text-white px-10 py-3 rounded-xl flex items-center gap-3 font-semibold shadow-md transition-all active:scale-95 text-xl">
                            <Plus size={24} strokeWidth={3} />
                            Tambah
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#e9eff6] text-slate-700 font-bold text-sm uppercase tracking-wider">
                                    <th className="px-6 py-5 border-r border-white w-16 text-center">No</th>
                                    <th className="px-6 py-5 border-r border-white w-24">Gambar</th>
                                    <th className="px-6 py-5 border-r border-white">Nama Properti</th>
                                    <th className="px-6 py-5 border-r border-white">Kategori</th>
                                    <th className="px-6 py-5 border-r border-white">Stok</th>
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
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                                                    {item.gambar ? (
                                                        <img src={`/storage/${item.gambar}`} alt={item.nama_produk} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Plus size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-slate-700 font-semibold">{item.nama_produk}</td>
                                            <td className="px-6 py-5 text-slate-600">{item.kategori}</td>
                                            <td className="px-6 py-5 text-slate-600 font-medium">
                                                {item.stok} <span className="text-[10px] text-slate-400">Unit</span>
                                            </td>
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
                                                    <Link href={`/produk/${item.id}/edit`} className="p-1.5 text-orange-400 border border-orange-400 rounded-md hover:bg-orange-50 transition-all">
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button onClick={() => confirmDelete(item.id, item.nama_produk)} className="p-1.5 text-rose-500 border border-rose-500 rounded-md hover:bg-rose-50 transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center text-slate-400 italic">
                                            {searchQuery ? `Data "${searchQuery}" tidak ditemukan.` : 'Belum ada data properti tersedia.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- TAMBAHKAN BAGIAN PAGINATION DI SINI --- */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-sm text-slate-500">
                            Menampilkan <span className="font-semibold text-slate-700">{products.from || 0}</span> sampai <span className="font-semibold text-slate-700">{products.to || 0}</span> dari <span className="font-semibold text-slate-700">{products.total}</span> data
                        </div>
                        <div className="flex items-center gap-1">
                            {products.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                        link.active 
                                            ? 'bg-[#1a432d] text-white shadow-md' 
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-[#1a432d]'
                                    } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    preserveScroll
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* MODAL KONFIRMASI HAPUS */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-xl animate-in zoom-in-95">
                        <div className="flex flex-col items-center text-center">
                            <div className="text-red-500 bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <Trash2 size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Hapus Data?</h3>
                            <p className="text-slate-500 text-sm mb-10 px-4">
                                Data <span className="font-semibold text-slate-700">"{selectedProduct?.name}"</span> akan dihapus secara permanen.
                            </p>
                            <div className="flex gap-4 w-full">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-slate-400 text-white font-semibold hover:bg-slate-500 transition-colors">Batal</button>
                                <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-[#CC2014] text-white font-semibold hover:bg-red-700 transition-colors">Hapus</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}