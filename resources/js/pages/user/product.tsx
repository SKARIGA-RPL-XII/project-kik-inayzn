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
    Lock,
    Flame
} from 'lucide-react';

export default function ProductPage() {
    // Logic backend asli kamu
    const { auth, products, categories, filters, savedIds = [] } = usePage().props as any;

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [showAuthModal, setShowAuthModal] = useState(false);

    // --- LOGIC ASLI KAMU (TIDAK DIUBAH) ---
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

    const handleCardClick = (e: React.MouseEvent) => {
        if (!auth.user) {
            e.preventDefault();
            e.stopPropagation();
            setShowAuthModal(true);
        }
    };

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

            {/* NAVBAR (Gaya Dashboard Baru) */}
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
                            <Link href="/login" className="font-bold text-sm hover:text-emerald-200 no-underline text-white">Login</Link>
                            <Link href="/register" className="font-bold text-sm bg-emerald-500 px-4 py-2 rounded-xl hover:bg-emerald-400 no-underline text-white">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* HERO SECTION */}
            <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover brightness-[0.3]" alt="Hero" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a432d]/20 to-white z-10"></div>
                
                <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl w-full">
                    <h1 className="text-white text-4xl md:text-5xl font-black mb-6 tracking-tight drop-shadow-2xl">
                        Katalog <span className="text-emerald-400 italic">Properti</span>
                    </h1>
                </div>
            </div>

            {/* SEARCH & FILTER BAR (Gaya Dashboard) */}
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
                                className="flex items-center gap-3 px-6 py-4 bg-slate-100 rounded-2xl font-black text-[#1a432d] hover:bg-slate-200 transition-all justify-center w-full min-w-[180px] border-none"
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

            {/* PRODUCT GRID (Gaya Dashboard Baru) */}
            <main className="max-w-7xl mx-auto px-8 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dataProduk.length > 0 ? dataProduk.map((product: any) => {
                        const isSaved = savedIds.includes(product.id);
                        
                        let firstImage = null;
                        if (product.gambar) {
                            if (Array.isArray(product.gambar)) firstImage = product.gambar[0];
                            else if (typeof product.gambar === 'string') firstImage = product.gambar.split(',')[0];
                        }
                        const imageUrl = firstImage ? `/storage/${firstImage}` : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop';

                        return (
                            <Link 
                                href={`/products/${product.id}`} 
                                key={product.id} 
                                onClick={handleCardClick}
                                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col no-underline h-full"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={imageUrl} 
                                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!auth.user ? 'blur-[2px] brightness-75' : ''}`} 
                                        alt={product.nama_produk} 
                                    />
                                    
                                    <button 
                                        onClick={(e) => handleToggleSave(e, product.id)}
                                        className={`absolute top-4 right-4 p-2.5 rounded-xl shadow-lg transition-all z-20 border-none cursor-pointer ${
                                            isSaved ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-700'
                                        }`}
                                    >
                                        <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
                                    </button>

                                    {!auth.user && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-white p-3 rounded-full shadow-xl mb-2">
                                                <Lock size={20} className="text-[#1a432d]" />
                                            </div>
                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Login untuk detail</span>
                                        </div>
                                    )}

                                    <div className="absolute bottom-4 left-4 bg-[#1a432d] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg z-10">
                                        {product.kategori?.nama_kategori || (typeof product.kategori === 'string' ? product.kategori : 'Properti')}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="font-bold text-slate-800 text-xl mb-2 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                                        {product.nama_produk}
                                    </h3>
                                    <p className="text-slate-400 text-sm flex items-center gap-2 mb-6 font-medium">
                                        <MapPin size={14} className="text-emerald-500" /> {product.lokasi || 'Lokasi Premium'}
                                    </p>

                                    <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Harga Mulai</p>
                                            <p className="text-emerald-700 font-black text-xl">{formatIDR(product.harga)}</p>
                                        </div>
                                        <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    }) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold">Properti tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL AUTH (Gaya Dashboard) */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1a432d]/80 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
                    <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock size={32} className="text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-black text-[#1a432d] mb-2">Akses Terkunci</h3>
                        <p className="text-slate-500 text-sm mb-8 font-medium">Silakan login untuk melihat detail properti dan lokasi lengkap.</p>
                        <div className="flex flex-col gap-3">
                            <Link href="/login" className="bg-[#1a432d] text-white py-4 rounded-xl font-bold hover:brightness-110 no-underline">Masuk Sekarang</Link>
                            <button onClick={() => setShowAuthModal(false)} className="mt-2 text-slate-400 text-xs font-bold uppercase tracking-widest bg-transparent border-none cursor-pointer">Tutup</button>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER (Gaya Dashboard Baru) */}
            <footer className="bg-slate-900 pt-20 pb-10 text-white">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-left">
                    <div>
                        <h2 className="text-2xl font-black mb-4">PropertyKu.</h2>
                        <p className="text-slate-400 max-w-sm text-sm leading-relaxed font-medium">Platform properti terpercaya untuk menemukan hunian impian dengan proses transparan.</p>
                    </div>
                    <div className="flex gap-12 md:justify-end">
                        <div className="flex flex-col gap-3">
                            <span className="font-bold text-emerald-400 mb-2">Menu</span>
                            <Link href="/products" className="text-slate-400 hover:text-white text-sm no-underline">Cari Properti</Link>
                            <Link href="/simulator-kpr" className="text-slate-400 hover:text-white text-sm no-underline">Simulasi KPR</Link>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-slate-800">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">&copy; 2026 PropertyKu. Built for Excellence.</p>
                </div>
            </footer>
        </div>
    );
}