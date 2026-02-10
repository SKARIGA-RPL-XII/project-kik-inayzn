import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    Search, 
    Bookmark, 
    User, 
    LogOut, 
    MapPin, 
    Home as HomeIcon, 
    ChevronDown,
    Filter,
    Calculator,
    LayoutDashboard,
    ArrowRight,
    Lock 
} from 'lucide-react';

export default function ProductPage() {
    // Ambil data dari backend
    const { auth, products, categories, filters, savedIds = [] } = usePage().props as any;

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [showAuthModal, setShowAuthModal] = useState(false);

    // --- FITUR SEARCH & FILTER REAL-TIME ---
    const performSearch = useCallback((query: string, category?: string) => {
        const activeCategory = category !== undefined ? category : (filters?.category || '');
        
        router.get('/products', 
            { 
                search: query,
                category: activeCategory === 'Semua Kategori' ? '' : activeCategory
            }, 
            { 
                preserveState: true,
                replace: true,
                preserveScroll: true
            }
        );
    }, [filters?.category]);

    useEffect(() => {
        if (searchQuery === (filters?.search || '')) return;

        const delayDebounceFn = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, performSearch]);

    const handleCategorySelect = (category: string) => {
        setOpenDropdown(null);
        performSearch(searchQuery, category);
    };

    const handleSearchManual = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        performSearch(searchQuery);
    };

    // --- LOGIKA PROTEKSI AKSES (PENTING) ---
    const handleCardClick = (e: React.MouseEvent) => {
        // Jika user belum login, batalkan navigasi dan tampilkan modal
        if (!auth.user) {
            e.preventDefault();
            e.stopPropagation();
            setShowAuthModal(true);
        }
    };

    // --- FITUR SAVE/BOOKMARK ---
    const handleToggleSave = (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }

        router.post(`/products/${productId}/save`, {}, {
            preserveScroll: true,
        });
    };

    const dataProduk = products?.data || (Array.isArray(products) ? products : []);
    const categoryList = ['Semua Kategori', ...(categories || [])];
    const selectedCategory = filters?.category || 'Semua Kategori';

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari PropertyKu?')) {
            router.post('/logout');
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
            <Head title="Jelajahi Properti - PropertyKu" />

            {/* NAVBAR */}
            <nav className="bg-[#1a432d] px-8 py-4 flex items-center justify-between text-white sticky top-0 z-50 shadow-md">
                <div className="flex gap-8 items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-6 ml-4 border-l border-emerald-800 pl-8">
                        <Link href="/dashboard" className={`text-sm font-bold flex items-center gap-2 ${usePage().url === '/dashboard' ? 'text-emerald-400' : 'opacity-70 hover:opacity-100'}`}>
                            <LayoutDashboard size={16}/> Dashboard
                        </Link>
                        <Link href="/products" className={`text-sm font-bold flex items-center gap-2 ${usePage().url.startsWith('/products') ? 'text-emerald-400' : 'opacity-100'}`}>
                            <HomeIcon size={16}/> Properti
                        </Link>
                        <Link href="/simulator-kpr" className="text-sm font-bold flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-emerald-400 transition-colors">
                            <Calculator size={16}/> Simulator KPR
                        </Link>
                        <Link href="/saved-properties" className="text-sm font-bold flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-emerald-400 transition-colors">
                            <Bookmark size={16}/> Tersimpan
                        </Link>
                    </div>
                </div>

                <div className="flex items-center">
                    {auth.user ? (
                        <div className="flex items-center gap-6">
                            <Link href="/profile" className="flex items-center gap-2 bg-emerald-800/50 px-2 py-1.5 pr-4 rounded-full border border-emerald-700 hover:bg-emerald-700 transition-all">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400 flex items-center justify-center bg-emerald-600">
                                    {auth.user.avatar ? <img src={`/storage/${auth.user.avatar}`} className="w-full h-full object-cover" alt="Profile" /> : <User size={14} />}
                                </div>
                                <span className="text-sm font-medium">Hi, {auth.user.username || auth.user.name}</span>
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

            <div className="bg-[#1a432d] pt-12 pb-24 px-8 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Katalog Properti</h1>
                <p className="text-emerald-100/70 max-w-2xl mx-auto font-medium">Cari dan temukan hunian terbaik Anda di sini.</p>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="max-w-6xl mx-auto px-8 -mt-10 relative z-30">
                <form onSubmit={handleSearchManual} className="bg-white p-3 rounded-3xl shadow-2xl border border-slate-100 flex flex-col lg:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama properti..." 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 font-bold"
                        />
                    </div>
                    
                    <div className="flex gap-2 w-full lg:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <button 
                                type="button"
                                onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                                className="flex items-center gap-3 px-6 py-4 bg-slate-100 rounded-2xl font-black text-[#1a432d] hover:bg-slate-200 transition-all justify-center w-full min-w-[180px]"
                            >
                                <Filter size={18} /> {selectedCategory} <ChevronDown size={16} />
                            </button>
                            
                            {openDropdown === 'category' && (
                                <div className="absolute top-full mt-2 w-full bg-white shadow-2xl rounded-2xl border border-slate-100 py-2 z-[60]">
                                    {categoryList.map((item) => (
                                        <button 
                                            key={item}
                                            type="button"
                                            onClick={() => handleCategorySelect(item)}
                                            className={`w-full text-left px-6 py-3 text-sm font-black transition-colors border-none bg-transparent cursor-pointer ${selectedCategory === item ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="submit" className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg border-none cursor-pointer">
                            Cari
                        </button>
                    </div>
                </form>
            </div>

            {/* PRODUCT GRID */}
            <main className="max-w-7xl mx-auto px-8 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dataProduk.length > 0 ? dataProduk.map((product: any) => {
                        const isSaved = savedIds.includes(product.id);
                        
                        return (
                            <Link 
                                href={`/products/${product.id}`} 
                                key={product.id} 
                                onClick={handleCardClick} // <--- PERBAIKAN: Fungsi proteksi di sini
                                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col no-underline"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={product.gambar ? `/storage/${product.gambar}` : '/images/default.jpg'} 
                                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${!auth.user ? 'blur-md' : ''}`} 
                                        alt={product.nama_produk} 
                                    />
                                    
                                    <button 
                                        onClick={(e) => handleToggleSave(e, product.id)}
                                        className={`absolute top-4 right-4 p-2.5 rounded-xl shadow-lg transition-all z-20 border-none cursor-pointer ${
                                            isSaved 
                                            ? 'bg-emerald-600 text-white' 
                                            : 'bg-white/90 text-[#1a432d] hover:bg-white'
                                        }`}
                                    >
                                        <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
                                    </button>

                                    {/* Overlay Gembok jika belum login */}
                                    {!auth.user && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/5">
                                            <div className="bg-white/90 p-4 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                                                <Lock size={28} className="text-emerald-700" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute bottom-4 left-4 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-md tracking-tighter uppercase z-10">
                                        {product.kategori?.nama_kategori || product.kategori || 'Properti'}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                        {product.nama_produk}
                                    </h3>
                                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-wide mb-4">
                                        <MapPin size={12} className="text-emerald-500" /> {product.lokasi || 'Lokasi Strategis'}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-emerald-700 font-black text-lg">
                                                {formatIDR(product.harga)}
                                            </span>
                                            {!auth.user && (
                                                <span className="text-[9px] text-rose-500 font-bold uppercase mt-1 animate-pulse">
                                                    Login untuk Detail
                                                </span>
                                            )}
                                        </div>
                                        <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    }) : (
                        <div className="col-span-full py-20 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                            Properti tidak ditemukan.
                        </div>
                    )}
                </div>
            </main>
            
            {/* MODAL AUTH (PIXEL PERFECT SESUAI REFERENSI) */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-[#1a432d]/40 backdrop-blur-sm animate-in fade-in duration-300" 
                        onClick={() => setShowAuthModal(false)} 
                    />
                    
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-300 text-center overflow-hidden">
                        {/* Icon Lock Hijau Muda */}
                        <div className="w-20 h-20 bg-[#e6f7ef] rounded-[1.8rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <Lock size={42} className="text-[#00b96b]" strokeWidth={2.5} />
                        </div>

                        {/* Text */}
                        <h3 className="text-2xl font-black text-[#1a432d] mb-4 tracking-tight">Satu Langkah Lagi!</h3>
                        <p className="text-slate-500 text-[13px] leading-relaxed mb-10 px-2 font-medium">
                            Bergabunglah dengan <span className="text-[#00b96b] font-bold">PropertyKu</span> untuk melihat detail properti, lokasi tepatnya, dan melakukan simulasi cicilan.
                        </p>
                        
                        {/* Buttons */}
                        <div className="flex flex-col gap-3.5">
                            <Link 
                                href="/login" 
                                className="bg-[#1a432d] text-white font-bold py-4.5 rounded-2xl hover:bg-[#143524] transition-all no-underline shadow-lg text-[15px]"
                            >
                                Masuk ke Akun
                            </Link>
                            <Link 
                                href="/register" 
                                className="bg-[#00b96b] text-white font-bold py-4.5 rounded-2xl hover:bg-[#00a35e] transition-all no-underline shadow-lg shadow-emerald-500/20 text-[15px]"
                            >
                                Daftar Gratis
                            </Link>
                            
                            <button 
                                onClick={() => setShowAuthModal(false)} 
                                className="mt-5 text-slate-400 text-[10px] font-bold uppercase tracking-[0.25em] bg-transparent border-none cursor-pointer hover:text-slate-600 transition-colors"
                            >
                                NANTI SAJA
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="bg-slate-900 py-12 text-center">
                <div className="max-w-7xl mx-auto px-8">
                    <img src="/images/logo.png" alt="Logo" className="h-8 w-auto mx-auto mb-4 brightness-0 invert opacity-50" />
                    <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em]">&copy; 2026 PropertyKu. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}