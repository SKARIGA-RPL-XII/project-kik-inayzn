import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    Search, 
    MessageCircle, 
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
    Lock // Icon tambahan
} from 'lucide-react';

export default function ProductPage() {
    const { auth, products, categories, filters } = usePage().props as any;

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    
    // 1. STATE UNTUK MODAL PERINGATAN
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        setSearchQuery(filters?.search || '');
    }, [filters?.search]);

    const dataProduk = products?.data || (Array.isArray(products) ? products : []);
    const categoryList = ['Semua Kategori', ...(categories || [])];
    const selectedCategory = filters?.category || 'Semua Kategori';

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari PropertyKu?')) {
            router.post('/logout');
        }
    };

    // 2. FUNGSI INTERCEPTOR KLIK CARD
    const handleCardClick = (e: React.MouseEvent) => {
        if (!auth.user) {
            e.preventDefault();
            setShowAuthModal(true);
        }
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/products', { 
            search: searchQuery,
            category: selectedCategory === 'Semua Kategori' ? '' : selectedCategory
        }, { preserveState: false, replace: true });
    };

    const handleCategorySelect = (category: string) => {
        setOpenDropdown(null);
        router.get('/products', { 
            search: searchQuery,
            category: category === 'Semua Kategori' ? '' : category 
        }, { preserveState: false, replace: true });
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

            {/* HEADER SECTION */}
            <div className="bg-[#1a432d] pt-12 pb-24 px-8 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Katalog Properti</h1>
                <p className="text-emerald-100/70 max-w-2xl mx-auto font-medium">Cari dan temukan hunian terbaik Anda di sini.</p>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="max-w-6xl mx-auto px-8 -mt-10 relative z-30">
                <form onSubmit={handleSearch} className="bg-white p-3 rounded-3xl shadow-2xl border border-slate-100 flex flex-col lg:flex-row gap-3 items-center">
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
                                            className={`w-full text-left px-6 py-3 text-sm font-black transition-colors ${selectedCategory === item ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="submit" className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg">
                            Cari
                        </button>
                    </div>
                </form>
            </div>

            {/* GRID PRODUK */}
            <main className="max-w-7xl mx-auto px-8 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dataProduk.length > 0 ? dataProduk.map((product: any) => (
                        <Link 
                            href={`/products/${product.id}`} 
                            key={product.id} 
                            onClick={handleCardClick} // Tambahkan interceptor
                            className="group bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                            <div className="relative h-60 overflow-hidden">
                                <img 
                                    src={product.gambar ? `/storage/${product.gambar}` : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'} 
                                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${!auth.user ? 'blur-sm grayscale-[20%]' : ''}`} 
                                    alt={product.nama_produk} 
                                />
                                
                                <button 
                                    onClick={(e) => { 
                                        e.preventDefault(); 
                                        e.stopPropagation();
                                        if (!auth.user) {
                                            setShowAuthModal(true);
                                        } else {
                                            alert('Tersimpan!'); 
                                        }
                                    }}
                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-lg text-[#1a432d] shadow-md hover:bg-[#1a432d] hover:text-white transition-all z-10"
                                >
                                    <Bookmark size={16} />
                                </button>

                                {!auth.user && (
                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-white/90 p-3 rounded-full shadow-xl">
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
                                            {product.kategori} Strategis
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
                                            <span className="text-[9px] text-rose-500 font-bold italic mt-1 uppercase">
                                                * Login untuk detail
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
                    )) : (
                        <div className="col-span-full py-20 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                            Properti tidak ditemukan.
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                {products?.links && products.links.length > 3 && (
                    <div className="mt-16 flex justify-center items-center gap-2">
                        {products.links.map((link: any, i: number) => (
                            <Link
                                key={i}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    link.active ? 'bg-[#1a432d] text-white' : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-100'
                                } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* MODAL PERINGATAN */}
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
                                Bergabunglah dengan <span className="text-emerald-600 font-bold">PropertyKu</span> untuk melihat detail properti dan lokasi strategisnya.
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                <Link href="/login" className="bg-[#1a432d] text-white font-bold py-4 rounded-2xl hover:bg-emerald-800 transition-all shadow-lg active:scale-95">Masuk Sekarang</Link>
                                <Link href="/register" className="bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95">Daftar Akun Baru</Link>
                                <button onClick={() => setShowAuthModal(false)} className="mt-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="bg-slate-900 py-12 text-center">
                <img src="/images/logo.png" alt="Logo" className="h-8 w-auto mx-auto mb-4 brightness-0 invert opacity-50" />
                <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.2em]">&copy; 2026 PropertyKu. All rights reserved.</p>
            </footer>
        </div>
    );
}