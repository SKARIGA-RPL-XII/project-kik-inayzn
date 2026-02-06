import React, { useState } from 'react'; // Tambahkan useState
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    Search, 
    MessageCircle, 
    Bookmark, 
    User, 
    LogOut, 
    MapPin, 
    Home as HomeIcon, 
    Flame, 
    ArrowRight,
    Calculator,
    LayoutDashboard,
    Lock // Tambahkan icon kunci untuk kesan eksklusif
} from 'lucide-react';

export default function UserDashboard() {
    const { auth, products } = usePage().props as any;
    
    // 1. STATE UNTUK MODAL PERINGATAN
    const [showAuthModal, setShowAuthModal] = useState(false);

    const dataProduk = products?.data || (Array.isArray(products) ? products : []);

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari PropertyKu?')) {
            router.post('/logout');
        }
    };

    // 2. FUNGSI UNTUK CEK LOGIN SEBELUM LIHAT DETAIL
    const handleCardClick = (e: React.MouseEvent, productId: number) => {
        if (!auth.user) {
            e.preventDefault(); // Batalkan navigasi ke link
            setShowAuthModal(true); // Tampilkan modal
        }
    };

    const formatIDR = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Head title="PropertyKu - Home" />

            {/* NAVBAR */}
            <nav className="bg-[#1a432d] px-8 py-4 flex items-center justify-between text-white sticky top-0 z-50 shadow-md">
                <div className="flex gap-8 items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-6 ml-4 border-l border-emerald-800 pl-8">
                        <Link href="/dashboard" className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                            <LayoutDashboard size={16}/> Dashboard
                        </Link>
                        <Link href="/products" className="text-sm font-bold flex items-center gap-2 hover:text-emerald-400 transition-colors opacity-70 hover:opacity-100">
                            <HomeIcon size={16}/> Properti
                        </Link>
                        <Link href="/simulator-kpr" className="text-sm font-bold flex items-center gap-2 hover:text-emerald-400 transition-colors opacity-70 hover:opacity-100">
                            <Calculator size={16}/> Simulator KPR
                        </Link>
                        <Link href="/saved-properties" className="text-sm font-bold flex items-center gap-2 hover:text-emerald-400 transition-colors opacity-70 hover:opacity-100">
                            <Bookmark size={16}/> Tersimpan
                        </Link>
                    </div>
                </div>

                <div className="flex items-center">
                    {auth.user ? (
                        <div className="flex items-center gap-6">
                            <Link href="/profile" className="flex items-center gap-2 bg-emerald-800/50 px-2 py-1.5 pr-4 rounded-full border border-emerald-700 hover:bg-emerald-700 transition-all group">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400 flex items-center justify-center bg-emerald-600">
                                    {auth.user.avatar ? (
                                        <img src={`/storage/${auth.user.avatar}`} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <User size={14} className="text-white" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-white">Hi, {auth.user.username || auth.user.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-rose-300 hover:text-rose-100 transition-colors text-sm font-bold cursor-pointer bg-transparent border-none">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-6 items-center">
                            <Link href="/login" className="font-bold text-sm hover:text-emerald-200">Login</Link>
                            <Link href="/register" className="font-bold text-sm bg-emerald-500 px-4 py-2 rounded-xl hover:bg-emerald-400">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* HERO SECTION */}
            <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover brightness-[0.4]" alt="Hero" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-white z-10"></div>
                <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl">
                    <h1 className="text-white text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-2xl">
                        Temukan Hunian <span className="text-emerald-400">Impian</span> Anda
                    </h1>
                    <p className="text-gray-200 text-lg mb-8 font-medium max-w-xl opacity-90">Jelajahi berbagai pilihan properti eksklusif di lokasi paling strategis.</p>
                </div>
            </div>

            {/* QUICK LINKS */}
            <div className="max-w-6xl mx-auto px-8 -mt-16 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Carikan Properti', icon: <HomeIcon size={24} />, desc: 'Konsultasi gratis', href: '/products' },
                    { label: 'Kategori Terlaris', icon: <Flame size={24} />, desc: 'Paling banyak dicari', href: '/products' },
                    { label: 'Simulator KPR', icon: <Calculator size={24} />, desc: 'Hitung cicilanmu', href: '/simulator-kpr' }
                ].map((item) => (
                    <Link key={item.label} href={item.href} className="bg-white border border-slate-100 p-6 rounded-[1.5rem] shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-2 transition-all duration-300 text-[#1a432d] group flex items-center gap-5">
                        <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 text-emerald-600 flex-shrink-0">
                            {item.icon}
                        </div>
                        <div>
                            <h4 className="font-extrabold text-lg leading-tight">{item.label}</h4>
                            <p className="text-slate-400 text-xs font-medium">{item.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* PROPERTY LIST SECTION */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="flex items-end justify-between mb-10">
                    <div className="space-y-2">
                        <div className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Rekomendasi</div>
                        <h2 className="text-3xl font-black text-[#1a432d]">Properti Pilihan</h2>
                    </div>
                    <Link href="/products" className="text-emerald-700 font-bold hover:text-emerald-500 flex items-center gap-2 group text-sm">
                        Lihat Semua <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dataProduk.length > 0 ? (
                        dataProduk.map((product: any) => (
                            <Link 
                                href={`/products/${product.id}`} 
                                key={product.id} 
                                onClick={(e) => handleCardClick(e, product.id)} // Sesuai permintaan
                                className="group bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                <div className="relative h-60 overflow-hidden">
                                    <img 
                                        src={product.gambar ? `/storage/${product.gambar}` : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'} 
                                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${!auth.user ? 'blur-sm grayscale-[30%]' : ''}`} 
                                        alt={product.nama_produk} 
                                    />
                                    
                                    <button 
                                        onClick={(e) => { 
                                            e.preventDefault(); 
                                            e.stopPropagation(); // Biar link card gak kepicu
                                            if (!auth.user) {
                                                setShowAuthModal(true);
                                            } else {
                                                alert('Properti disimpan ke favorit!'); 
                                            }
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-lg text-[#1a432d] shadow-md hover:bg-[#1a432d] hover:text-white transition-all z-10"
                                    >
                                        <Bookmark size={16} />
                                    </button>

                                    {!auth.user && (
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                                <Lock size={20} className="text-emerald-700" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute bottom-4 left-4 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-md tracking-tighter uppercase z-10">
                                        {product.kategori}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                                {product.nama_produk}
                                            </h3>
                                            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-wide">
                                                <MapPin size={12} className="text-emerald-500" /> 
                                                {product.deskripsi ? product.deskripsi.substring(0, 30) + '...' : 'Lokasi strategis'}
                                            </p>
                                        </div>
                                        <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-emerald-700 font-black text-lg">
                                                {formatIDR(product.harga)}
                                            </span>
                                            {!auth.user && (
                                                <span className="text-[9px] text-rose-500 font-bold italic mt-1 uppercase tracking-tighter">
                                                    * Login untuk akses penuh
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-slate-400 text-[8px] uppercase font-bold">Stok</span>
                                            <span className="text-slate-600 text-xs font-black">{product.stok} unit</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-400 font-medium italic">Belum ada properti yang tersedia.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. MODAL NOTIFIKASI PERINGATAN */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Overlay Gelap */}
                    <div 
                        className="absolute inset-0 bg-[#1a432d]/60 backdrop-blur-md transition-opacity animate-in fade-in"
                        onClick={() => setShowAuthModal(false)}
                    />
                    
                    {/* Konten Modal */}
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 text-center overflow-hidden">
                        {/* Aksen Dekorasi */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 z-0" />
                        
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-sm shadow-emerald-200">
                                <Lock size={40} className="text-emerald-600 -rotate-3" />
                            </div>

                            <h3 className="text-2xl font-black text-[#1a432d] mb-3">Satu Langkah Lagi!</h3>
                            <p className="text-slate-500 text-sm mb-8 px-4">
                                Bergabunglah dengan <span className="text-emerald-600 font-bold">PropertyKu</span> untuk melihat detail properti, lokasi tepatnya, dan melakukan simulasi cicilan.
                            </p>

                            <div className="grid grid-cols-1 gap-3">
                                <Link 
                                    href="/login" 
                                    className="bg-[#1a432d] text-white font-bold py-4 rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                                >
                                    Masuk ke Akun
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                                >
                                    Daftar Gratis
                                </Link>
                                <button 
                                    onClick={() => setShowAuthModal(false)}
                                    className="mt-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-rose-500 transition-colors"
                                >
                                    Nanti Saja
                                </button>
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