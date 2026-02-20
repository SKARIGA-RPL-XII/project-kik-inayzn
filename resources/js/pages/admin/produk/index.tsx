import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Plus, Edit, Trash2, CheckCircle2, X, Eye, Phone } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/sidebar-header';

// --- Interfaces ---
interface Product {
    id: number;
    nama_produk: string;
    kategori: string;
    stok: number;
    harga: number;
    status: 'aktif' | 'nonaktif';
    gambar: string[];
    no_agen?: string;
}

interface Props {
    products: {
        data: Product[];
        from: number;
        to: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
    };
}

export default function ProductIndex({ products, filters }: Props) {
    const { flash } = usePage().props as any;
    
    // States
    const [showNotif, setShowNotif] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<{ id: number, name: string } | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailProduct, setDetailProduct] = useState<Product | null>(null);

    // --- LOGIKA REAL-TIME SEARCH (DEBOUNCE) ---
    useEffect(() => {
        // Kita kasih delay 300ms supaya server gak jebol kalau ngetik kecepetan
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                router.get('/produk', 
                    { search: searchQuery }, 
                    { 
                        preserveState: true, 
                        replace: true, 
                        preserveScroll: true,
                        only: ['products', 'filters'] 
                    }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Update notifikasi
    useEffect(() => {
        if (flash?.success) {
            setShowNotif(true);
            const timer = setTimeout(() => setShowNotif(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Sinkronisasi data detail jika ada perubahan di background
    useEffect(() => {
        if (isDetailOpen && detailProduct) {
            const updated = products.data.find(p => p.id === detailProduct.id);
            if (updated) setDetailProduct(updated);
        }
    }, [products.data]);

    // Handler Delete
    const confirmDelete = (id: number, name: string) => {
        setSelectedProduct({ id, name });
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedProduct) {
            router.delete(`/produk/${selectedProduct.id}`, {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const openDetail = (product: Product) => {
        setDetailProduct(product);
        setIsDetailOpen(true);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 overflow-x-hidden font-sans">
            <Head title="Admin - Daftar Properti" />

            {/* NOTIFIKASI */}
            {showNotif && (
                <div className="fixed top-6 right-6 z-[1000] animate-in slide-in-from-right-full duration-300">
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
                    {/* TOP BAR - INPUT SEKARANG REAL-TIME */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari properti..."
                                className="w-full pl-6 pr-12 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#1a432d]/20 focus:border-[#1a432d] outline-none text-slate-600 transition-all bg-white" 
                            />
                            <div className="absolute right-4 top-3.5 text-slate-400">
                                <Search size={20} />
                            </div>
                        </div>

                        <Link
                            href="/produk/create"
                            className="bg-[#1a432d] hover:bg-[#143524] text-white px-8 py-3 rounded-xl flex items-center gap-3 font-semibold shadow-md transition-all active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} strokeWidth={3} />
                            Tambah Properti
                        </Link>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider">
                                        <th className="px-6 py-5 w-16 text-center">No</th>
                                        <th className="px-6 py-5">Nama Properti</th>
                                        <th className="px-6 py-5 w-32">Stok</th>
                                        <th className="px-6 py-5 w-40">Status</th>
                                        <th className="px-6 py-5 text-center w-48">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.data.length > 0 ? (
                                        products.data.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-5 text-center font-medium text-slate-400">
                                                    {products.from + index}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <button onClick={() => openDetail(item)} className="text-slate-700 font-bold hover:text-[#1a432d] transition-colors text-left block">
                                                        {item.nama_produk}
                                                    </button>
                                                    <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{item.kategori}</span>
                                                </td>
                                                <td className="px-6 py-5 text-slate-600 font-medium">
                                                    {item.stok} <span className="text-[10px] text-slate-400 font-normal">Unit</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block ${item.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => openDetail(item)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                            <Eye size={18} />
                                                        </button>
                                                        <Link href={`/produk/${item.id}/edit`} className="p-2 text-orange-500 bg-orange-50 rounded-lg hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                                                            <Edit size={18} />
                                                        </Link>
                                                        <button onClick={() => confirmDelete(item.id, item.nama_produk)} className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center text-slate-500 italic">
                                                Tidak ada data ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINATION */}
                    {products.total > 0 && (
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="text-sm text-slate-500">
                                Menampilkan <span className="font-semibold text-slate-700">{products.from}</span> - <span className="font-semibold text-slate-700">{products.to}</span> dari <span className="font-semibold text-slate-700">{products.total}</span> data
                            </div>
                            <div className="flex items-center gap-1">
                                {products.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${link.active ? 'bg-[#1a432d] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'} ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                        preserveScroll
                                        preserveState
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* MODAL DETAIL */}
            {isDetailOpen && detailProduct && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] overflow-hidden max-w-2xl w-full shadow-2xl">
                        <div className="bg-[#1a432d] p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold uppercase tracking-tight">Detail Properti</h3>
                            <button onClick={() => setIsDetailOpen(false)} className="p-2"><X size={24} /></button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Galeri</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {detailProduct.gambar?.map((img, idx) => (
                                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden border">
                                                <img src={`/storage/${img}`} alt="properti" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <p className="text-xl font-black text-slate-800">{detailProduct.nama_produk}</p>
                                    <div className="bg-emerald-50 p-4 rounded-2xl">
                                        <p className="text-lg font-black text-[#1a432d]">Rp {Number(detailProduct.harga).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-blue-600" />
                                        <p className="font-mono font-bold text-lg">{detailProduct.no_agen || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50"><button onClick={() => setIsDetailOpen(false)} className="w-full py-3 bg-[#1a432d] text-white rounded-xl font-bold">Tutup</button></div>
                    </div>
                </div>
            )}

            {/* MODAL HAPUS */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40">
                    <div className="bg-white rounded-[32px] p-10 max-w-sm w-full shadow-xl">
                        <div className="flex flex-col items-center text-center">
                            <Trash2 size={48} className="text-red-500 mb-6" />
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Hapus Data?</h3>
                            <div className="flex gap-3 w-full mt-10">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Batal</button>
                                <button onClick={handleDelete} className="flex-1 py-3 bg-[#CC2014] text-white rounded-xl font-bold">Hapus</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}