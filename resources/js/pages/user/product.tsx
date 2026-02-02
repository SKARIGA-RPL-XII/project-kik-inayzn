import React, { useState } from 'react'; // Tambahkan useState
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    Search, 
    MapPin, 
    MessageCircle, 
    Bookmark, 
    Filter, 
    ChevronDown, 
    BedDouble, 
    Square, 
    Car,
    User,
    LogOut
} from 'lucide-react';

export default function ProductPage() {
    const { auth } = usePage().props as any;

    // State untuk Dropdown
    const [openDropdown, setOpenDropdown] = useState<string | null>(null); // 'category' atau 'price'
    const [selectedCategory, setSelectedCategory] = useState('Kategori');
    const [selectedPrice, setSelectedPrice] = useState('Harga');

    const categories = ['Semua Kategori', 'Rumah', 'Apartemen', 'Ruko', 'Villa'];
    const prices = ['Semua Harga', '< 500 Juta', '500jt - 1M', '1M - 2M', '> 2M'];

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari PropertyKu?')) {
            router.post('/logout');
        }
    };

    // Fungsi untuk toggle dropdown agar tidak terbuka bersamaan
    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            <Head title="Jelajahi Properti - PropertyKu" />

            {/* NAVBAR */}
            <nav className="bg-[#1a432d] px-8 py-4 flex items-center justify-between text-white sticky top-0 z-50 shadow-md">
                <div className="flex gap-8 items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                        <span className="font-black text-xl tracking-tighter">PropertyKu</span>
                    </Link>
                </div>

                <div className="flex items-center">
                    {auth.user ? (
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 bg-emerald-800/50 px-3 py-1.5 rounded-full border border-emerald-700">
                                <User size={16} className="text-emerald-400" />
                                <span className="text-sm font-medium">
                                    Hi, {auth.user.username || auth.user.name}
                                </span>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center gap-2 text-rose-300 hover:text-rose-100 transition-colors text-sm font-bold"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-6 items-center">
                            <Link href="/login" className="font-bold text-sm hover:text-emerald-200 transition-colors">Login</Link>
                            <Link href="/register" className="font-bold text-sm bg-emerald-500 px-4 py-2 rounded-xl hover:bg-emerald-400 transition-all">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* HERO SECTION MINI */}
            <div className="bg-[#1a432d] pt-12 pb-28 px-8 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Katalog Properti</h1>
                <p className="text-emerald-100/70 max-w-2xl mx-auto font-medium">
                    Temukan ribuan pilihan hunian eksklusif dengan harga terbaik di lokasi strategis.
                </p>
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="max-w-7xl mx-auto px-8 -mt-12">
                <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Cari lokasi, nama perumahan, atau developer..." 
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700 font-medium"
                        />
                    </div>
                    
                    <div className="flex flex-wrap md:flex-nowrap gap-3 w-full lg:w-auto">
                        {/* Dropdown Kategori */}
                        <div className="relative flex-1 md:flex-none">
                            <button 
                                onClick={() => toggleDropdown('category')}
                                className="flex items-center gap-3 px-6 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all justify-center w-full min-w-[160px]"
                            >
                                <Filter size={18} /> {selectedCategory} <ChevronDown size={16} className={`transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {openDropdown === 'category' && (
                                <div className="absolute top-full mt-2 w-full bg-white shadow-2xl rounded-2xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in duration-200">
                                    {categories.map((item) => (
                                        <button 
                                            key={item}
                                            onClick={() => { setSelectedCategory(item); setOpenDropdown(null); }}
                                            className="w-full text-left px-6 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dropdown Harga */}
                        <div className="relative flex-1 md:flex-none">
                            <button 
                                onClick={() => toggleDropdown('price')}
                                className="flex items-center gap-3 px-6 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all justify-center w-full min-w-[160px]"
                            >
                                {selectedPrice} <ChevronDown size={16} className={`transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
                            </button>

                            {openDropdown === 'price' && (
                                <div className="absolute top-full mt-2 w-full bg-white shadow-2xl rounded-2xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in duration-200">
                                    {prices.map((item) => (
                                        <button 
                                            key={item}
                                            onClick={() => { setSelectedPrice(item); setOpenDropdown(null); }}
                                            className="w-full text-left px-6 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 w-full md:w-auto">
                            Cari
                        </button>
                    </div>
                </div>
            </div>

            {/* PRODUCT LIST GRID */}
            <main className="max-w-7xl mx-auto px-8 py-20">
                <div className="flex items-center justify-between mb-10">
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                        Menampilkan <span className="text-[#1a432d]">12 Properti</span> Tersedia
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop`} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt="Properti"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">Dijual</span>
                                    <span className="bg-white/90 backdrop-blur-md text-[#1a432d] text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">Unit Baru</span>
                                </div>
                                <button className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white hover:text-rose-500 transition-all shadow-lg">
                                    <Bookmark size={18} />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-black text-xl text-slate-800 mb-1">Modern Luxury Villa</h3>
                                        <p className="text-slate-400 text-[10px] flex items-center gap-1 font-black uppercase tracking-widest">
                                            <MapPin size={12} className="text-emerald-500" /> Jakarta Selatan
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-emerald-600 font-black text-xl leading-none italic">Rp 2.5M</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Cicilan 12jt/bln</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-5 border-y border-slate-50 my-6">
                                    <div className="flex flex-col items-center border-r border-slate-50">
                                        <BedDouble size={18} className="text-slate-400 mb-1" />
                                        <p className="font-black text-slate-700 text-xs">4 Bed</p>
                                    </div>
                                    <div className="flex flex-col items-center border-r border-slate-50">
                                        <Square size={16} className="text-slate-400 mb-1" />
                                        <p className="font-black text-slate-700 text-xs">120m²</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Car size={18} className="text-slate-400 mb-1" />
                                        <p className="font-black text-slate-700 text-xs">2 Park</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Link 
                                        href={`/products/${i}`}
                                        className="flex-1 bg-[#1a432d] text-center text-white py-4 rounded-2xl font-bold text-sm hover:bg-emerald-900 transition-all active:scale-95"
                                    >
                                        Lihat Detail
                                    </Link>
                                    <button className="w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                        <MessageCircle size={22} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-20 flex justify-center gap-2">
                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-400 hover:bg-[#1a432d] hover:text-white transition-all">Prev</button>
                    <button className="px-6 py-3 bg-[#1a432d] text-white rounded-xl font-bold">1</button>
                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-[#1a432d] hover:text-white transition-all">Next</button>
                </div>
            </main>

            <footer className="bg-slate-900 py-20 text-center">
                <img src="/images/logo.png" alt="Logo" className="h-10 w-auto mb-4 mx-auto brightness-0 invert" />
                <div className="text-white font-black text-2xl mb-8 tracking-tighter">PropertyKu.</div>
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">&copy; 2026 All rights reserved.</p>
            </footer>
        </div>
    );
}