import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    Bookmark, 
    Home, 
    LayoutDashboard, 
    Calculator, 
    User, 
    LogOut,
    MapPin, 
    BedDouble, 
    Bath, 
    Square, 
    ArrowRight,
    Trash2,
    HeartOff,
    Lock,
    Compass // Ikon untuk Lokasi Strategis
} from 'lucide-react';

// 1. Interface dengan tambahan deskripsi
interface Property {
    id: number;
    nama_produk: string;
    deskripsi: string; 
    lokasi: string;
    harga: number;
    jumlah_kamar_tidur: number;
    jumlah_kamar_mandi: number;
    luas_bangunan: number;
    gambar_url?: string;
}

interface SavedItem {
    id: number;
    produk_id: number;
    produk: Property;
}

export default function Simpan({ savedProperties }: { savedProperties: SavedItem[] }) {
    const { auth } = usePage().props as any;
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari PropertyKu?')) {
            router.post('/logout', {}, {
                replace: true,
                onSuccess: () => {
                    window.location.href = '/login';
                }
            });
        }
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans overflow-x-hidden">
            <Head title="Tersimpan - PropertyKu" />

            {/* NAVBAR */}
            <nav className="bg-[#1a432d] px-8 py-4 flex items-center justify-between text-white sticky top-0 z-50 shadow-md">
                <div className="flex gap-8 items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                    </Link>
                    <div className="hidden lg:flex items-center gap-6 ml-4 border-l border-emerald-800 pl-8">
                        <Link href="/user/dashboard" className="text-sm font-bold opacity-70 hover:opacity-100 flex items-center gap-2 transition-all">
                            <LayoutDashboard size={16}/> Dashboard
                        </Link>
                        <Link href="/products" className="text-sm font-bold opacity-70 hover:opacity-100 flex items-center gap-2 transition-all">
                            <Home size={16}/> Properti
                        </Link>
                        <Link href="/simulator-kpr" className="text-sm font-bold opacity-70 hover:opacity-100 flex items-center gap-2 transition-all">
                            <Calculator size={16}/> Simulator KPR
                        </Link>
                        <Link href="/saved-properties" className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                            <Bookmark size={16}/> Tersimpan
                        </Link>
                    </div>
                </div>

                <div className="flex items-center">
                    {auth.user ? (
                        <div className="flex items-center gap-6">
                            <Link href="/profile" className="flex items-center gap-2 bg-emerald-800/50 px-2 py-1.5 pr-4 rounded-full border border-emerald-700 hover:bg-emerald-700 transition-all">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400 flex items-center justify-center bg-emerald-600">
                                    {auth.user.avatar ? <img src={`/storage/${auth.user.avatar}`} className="w-full h-full object-cover" /> : <User size={14} />}
                                </div>
                                <span className="text-sm font-medium">Hi, {auth.user.username || auth.user.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="text-rose-300 hover:text-rose-100 text-sm font-bold flex items-center gap-2 bg-transparent border-none cursor-pointer">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-6 items-center">
                            <Link href="/login" className="font-bold text-sm hover:text-emerald-200">Login</Link>
                            <Link href="/register" className="font-bold text-sm bg-emerald-500 px-4 py-2 rounded-xl hover:bg-emerald-400 transition-all">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            <div className="bg-[#1a432d] pt-12 pb-32 px-8 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Koleksi Tersimpan</h1>
                <p className="text-emerald-100/70 max-w-xl mx-auto font-medium">Properti impian yang kamu tandai untuk dilihat kembali nanti.</p>
            </div>

            <main className="max-w-7xl mx-auto px-8 -mt-20 pb-20">
                {auth.user && savedProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedProperties.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 group transition-all hover:-translate-y-2">
                                <div className="relative h-60 overflow-hidden">
                                    <img 
                                        src={item.produk.gambar_url ? item.produk.gambar_url : '/images/placeholder-house.jpg'} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        alt={item.produk.nama_produk}
                                    />
                                    <Link 
                                        href={`/products/${item.produk_id}/save`} 
                                        method="post" 
                                        as="button"
                                        preserveScroll
                                        className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-rose-500 transition-all border-none cursor-pointer z-10"
                                    >
                                        <Trash2 size={18} />
                                    </Link>
                                </div>

                                <div className="p-8">
                                    <h3 className="text-xl font-black text-slate-800 mb-1 truncate">{item.produk.nama_produk}</h3>
                                    <p className="flex items-center gap-1 text-slate-400 text-sm mb-4">
                                    </p>

                                    {/* --- BAGIAN LOKASI STRATEGIS (DESKRIPSI) --- */}
                                    <div className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/50 mb-6">
                                        <div className="bg-emerald-500 p-1.5 rounded-lg text-white shrink-0 shadow-sm shadow-emerald-200">
                                            <Compass size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">Lokasi Strategis</p>
                                            <p className="text-xs text-slate-600 leading-tight line-clamp-2 italic">
                                                {item.produk.deskripsi || 'Akses mudah ke pusat kota dan fasilitas umum.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga</p>
                                            <p className="text-xl font-black text-emerald-600">{formatRupiah(item.produk.harga)}</p>
                                        </div>
                                        <Link href={`/products/${item.produk_id}`} className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-emerald-500 transition-all shadow-lg active:scale-90">
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-xl border border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HeartOff size={40} className="text-slate-200" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">
                            {auth.user ? "Belum ada yang disimpan" : "Koleksi Terkunci"}
                        </h2>
                        <p className="text-slate-400 font-medium mb-8">
                            {auth.user ? "Cari properti idamanmu sekarang!" : "Silakan masuk untuk melihat properti yang sudah kamu simpan."}
                        </p>
                        <button 
                            onClick={auth.user ? () => router.get('/products') : () => setShowAuthModal(true)}
                            className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all inline-flex items-center gap-2 cursor-pointer border-none shadow-lg shadow-emerald-500/20"
                        >
                            {auth.user ? 'Mulai Cari' : 'Buka Koleksi'} <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </main>

            {/* MODAL AUTH */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1a432d]/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowAuthModal(false)} />
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 text-center overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16" />
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                                <Lock size={40} className="text-emerald-600 -rotate-3" />
                            </div>
                            <h3 className="text-2xl font-black text-[#1a432d] mb-3">Satu Langkah Lagi!</h3>
                            <p className="text-slate-500 text-sm mb-8 px-4">
                                Masuk ke akun <span className="text-emerald-600 font-bold">PropertyKu</span> untuk melihat daftar properti yang telah kamu simpan.
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                <Link href="/login" className="bg-[#1a432d] text-white text-center font-bold py-4 rounded-2xl hover:bg-emerald-800 transition-all shadow-lg active:scale-95">Masuk Sekarang</Link>
                                <Link href="/register" className="bg-emerald-500 text-white text-center font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95">Daftar Akun Baru</Link>
                                <button onClick={() => setShowAuthModal(false)} className="mt-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-transparent border-none cursor-pointer">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="bg-slate-900 py-12 text-center">
                <div className="max-w-7xl mx-auto px-8">
                    <img src="/images/logo.png" alt="Logo" className="h-8 w-auto mx-auto mb-4 brightness-0 invert opacity-50" />
                    <div className="flex justify-center gap-6 mb-6">
                        <Link href="/products" className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Properti</Link>
                        <Link href="/simulator-kpr" className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">KPR</Link>
                        <Link href="/login" className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">Login</Link>
                    </div>
                    <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em]">&copy; 2026 PropertyKu. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}