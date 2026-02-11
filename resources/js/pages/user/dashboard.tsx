import React, { useState, useMemo } from 'react'; 
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
    Lock 
} from 'lucide-react'; 

// --- 1. INTERFACE DEFINITIONS ---
interface Product {
    id: number;
    nama_produk: string;
    harga: number;
    stok: number;
    deskripsi?: string;
    gambar?: string | string[];
    kategori?: { nama_kategori: string } | string;
}

interface UserAuth {
    id: number;
    name: string;
    username?: string;
    avatar?: string;
}

interface SharedProps {
    auth: {
        user: UserAuth | null;
    };
    products: {
        data: Product[];
    } | Product[];
    [key: string]: any; 
}

export default function UserDashboard() {
    // Clean from 'as any'
    const { auth, products } = usePage<SharedProps>().props;
    
    // STATE
    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
    const [favorites, setFavorites] = useState<number[]>([]); 
    const [searchQuery, setSearchQuery] = useState<string>(''); 

    // DATA NORMALIZATION
    const dataProduk = useMemo<Product[]>(() => {
        if (!products) return [];
        if ('data' in products) return products.data;
        return Array.isArray(products) ? products : [];
    }, [products]);

    // LOGIC FILTER SEARCH
    const filteredProducts = useMemo(() => {
        return dataProduk.filter((p) => {
            const searchLower = searchQuery.toLowerCase();
            const categoryName = typeof p.kategori === 'object' 
                ? p.kategori?.nama_kategori 
                : p.kategori;
                
            return (
                p.nama_produk?.toLowerCase().includes(searchLower) ||
                (categoryName && typeof categoryName === 'string' && categoryName.toLowerCase().includes(searchLower))
            );
        });
    }, [searchQuery, dataProduk]);

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari PropertyKu?')) {
            router.post('/logout'); 
        }
    };

    const toggleFavorite = (id: number) => {
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        setFavorites(prev => 
            prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
        );
    };

    const formatIDR = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop';

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
            <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover brightness-[0.3]" alt="Hero" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a432d]/20 to-white z-10"></div>
                
                <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl w-full">
                    <h1 className="text-white text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-2xl leading-[1.1]">
                        Temukan Hunian <span className="text-emerald-400 italic">Impian</span> <br/> Untuk Masa Depan
                    </h1>
                    
                    <div className="w-full max-w-2xl relative">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
                            <Search size={20} />
                        </div>
                        <input 
                            type="text"
                            placeholder="Cari perumahan, lokasi, atau tipe..."
                            className="w-full bg-white border-none py-5 pl-14 pr-10 rounded-2xl shadow-2xl focus:ring-4 focus:ring-emerald-500/30 text-slate-800 font-medium transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* QUICK LINKS */}
            <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Cari Properti', icon: <HomeIcon size={22} />, desc: 'Katalog hunian lengkap', href: '/products' },
                    { label: 'Hot Deals', icon: <Flame size={22} />, desc: 'Penawaran terbatas', href: '/products' },
                    { label: 'Simulasi KPR', icon: <Calculator size={22} />, desc: 'Estimasi cicilan bulanan', href: '/simulator-kpr' }
                ].map((item) => (
                    <Link key={item.label} href={item.href} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-5">
                        <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-700">
                            {item.icon}
                        </div>
                        <div>
                            <h4 className="font-extrabold text-[#1a432d]">{item.label}</h4>
                            <p className="text-slate-400 text-xs font-medium">{item.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* PROPERTY LIST */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Pilihan Terbaik</span>
                        <h2 className="text-3xl font-black text-[#1a432d]">Properti Terbaru</h2>
                    </div>
                    <Link href="/products" className="hidden sm:flex items-center gap-2 text-emerald-700 font-bold hover:gap-3 transition-all">
                        Semua Properti <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => {
                            let displayImage = FALLBACK_IMAGE;
                            if (product.gambar) {
                                const images = Array.isArray(product.gambar) ? product.gambar : product.gambar.split(',');
                                if (images[0]) displayImage = `/storage/${images[0].trim()}`;
                            }

                            return (
                                <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                                    <div className="relative h-64 overflow-hidden">
                                        <img 
                                            src={displayImage} 
                                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!auth.user ? 'blur-[2px] brightness-75' : ''}`} 
                                            alt={product.nama_produk}
                                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                e.currentTarget.src = FALLBACK_IMAGE;
                                            }}
                                        />
                                        
                                        <button 
                                            onClick={() => toggleFavorite(product.id)}
                                            className={`absolute top-4 right-4 p-2.5 rounded-xl shadow-lg transition-all z-10 backdrop-blur-md ${
                                                favorites.includes(product.id) ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
                                            }`}
                                        >
                                            <Bookmark size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
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
                                            {typeof product.kategori === 'object' ? product.kategori?.nama_kategori : product.kategori || 'Properti'}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-bold text-slate-800 text-xl mb-2 line-clamp-1">{product.nama_produk}</h3>
                                        <p className="text-slate-400 text-sm flex items-center gap-2 mb-6">
                                            <MapPin size={14} className="text-emerald-500" />
                                            <span className="line-clamp-1">{product.deskripsi || 'Lokasi Premium'}</span>
                                        </p>

                                        <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Harga Mulai</p>
                                                <p className="text-emerald-700 font-black text-xl">{formatIDR(product.harga)}</p>
                                            </div>
                                            <Link 
                                                href={`/products/${product.id}`}
                                                onClick={(e) => !auth.user && (e.preventDefault(), setShowAuthModal(true))}
                                                className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium">Tidak ada properti yang ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL AUTH */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#1a432d]/80 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
                    <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-300">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Lock size={32} className="text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-[#1a432d] mb-2">Akses Terbatas</h3>
                            <p className="text-slate-500 text-sm mb-8">Silakan login terlebih dahulu untuk melihat informasi detail properti dan lokasi.</p>
                            
                            <div className="flex flex-col gap-3">
                                <Link href="/login" className="bg-[#1a432d] text-white text-center font-bold py-4 rounded-xl hover:brightness-110 transition-all">Masuk Sekarang</Link>
                                <Link href="/register" className="bg-emerald-500 text-white text-center font-bold py-4 rounded-xl hover:brightness-110 transition-all">Daftar Akun Baru</Link>
                                <button onClick={() => setShowAuthModal(false)} className="mt-2 text-slate-400 text-xs font-bold uppercase tracking-widest">Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* WHATSAPP FLOAT */}
            <a href="https://wa.me/628123456789" target="_blank" className="fixed bottom-6 right-6 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group">
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap px-0 group-hover:px-2">Hubungi Agen</span>
                <MessageCircle size={24} />
            </a>

            {/* FOOTER */}
            <footer className="bg-slate-900 pt-20 pb-10 text-white">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h2 className="text-2xl font-black mb-4">PropertyKu.</h2>
                        <p className="text-slate-400 max-w-sm text-sm leading-relaxed">Platform properti terpercaya untuk menemukan hunian impian dengan proses transparan dan mudah.</p>
                    </div>
                    <div className="flex gap-12 md:justify-end">
                        <div className="flex flex-col gap-3">
                            <span className="font-bold text-emerald-400 mb-2">Menu</span>
                            <Link href="/products" className="text-slate-400 hover:text-white text-sm">Cari Properti</Link>
                            <Link href="/simulator-kpr" className="text-slate-400 hover:text-white text-sm">Simulasi KPR</Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="font-bold text-emerald-400 mb-2">Bantuan</span>
                            <Link href="#" className="text-slate-400 hover:text-white text-sm">FAQ</Link>
                            <Link href="#" className="text-slate-400 hover:text-white text-sm">Kontak Kami</Link>
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