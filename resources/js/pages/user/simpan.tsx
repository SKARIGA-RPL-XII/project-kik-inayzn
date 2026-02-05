import React from 'react';
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
    HeartOff
} from 'lucide-react';

export default function SavedProperties() {
    const { auth } = usePage().props as any;

    // Fungsi Logout seragam
    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            router.post('/logout');
        }
    };

    // Data dummy untuk testing
    const savedItems = [
        {
            id: 1,
            title: "Modern Family Home",
            location: "BSD City, Tangerang",
            price: 1500000000,
            beds: 3,
            baths: 2,
            sqft: 120,
            image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800"
        }
    ];

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

            {/* NAVBAR - SERAGAM DENGAN DASHBOARD & SIMULATOR */}
            <nav className="bg-[#1a432d] px-8 py-4 flex items-center justify-between text-white sticky top-0 z-50 shadow-md">
                <div className="flex gap-8 items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                        <span className="font-black text-xl tracking-tighter"></span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-6 ml-4 border-l border-emerald-800 pl-8">
                        <Link href="/dashboard" className="text-sm font-bold flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-emerald-400 transition-all">
                            <LayoutDashboard size={16}/> Dashboard
                        </Link>
                        <Link href="/products" className="text-sm font-bold flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-emerald-400 transition-all">
                            <Home size={16}/> Properti
                        </Link>
                        <Link href="/simulator-kpr" className="text-sm font-bold flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-emerald-400 transition-all">
                            <Calculator size={16}/> Simulator KPR
                        </Link>
                        <Link href="/saved-properties" className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                            <Bookmark size={16}/> Tersimpan
                        </Link>
                    </div>
                </div>

                <div className="flex items-center">
                    {auth.user ? (
                        <div className="flex items-center gap-6">
                            <Link href="/profile" className="flex items-center gap-2 bg-emerald-800/50 px-2 py-1.5 pr-4 rounded-full border border-emerald-700 hover:bg-emerald-700 transition-all group">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400 flex items-center justify-center bg-emerald-600 text-white">
                                    {auth.user.avatar ? (
                                        <img src={`/storage/${auth.user.avatar}`} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <User size={14} />
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
                            <Link href="/register" className="font-bold text-sm bg-emerald-500 px-4 py-2 rounded-xl hover:bg-emerald-400 transition-all">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* HEADER */}
            <div className="bg-[#1a432d] pt-12 pb-32 px-8 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Koleksi Tersimpan</h1>
                <p className="text-emerald-100/70 max-w-xl mx-auto font-medium">
                    Properti impian yang kamu tandai untuk dilihat kembali nanti.
                </p>
            </div>

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-8 -mt-20 pb-20">
                {savedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 group transition-all hover:-translate-y-2">
                                <div className="relative h-60 overflow-hidden">
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-rose-500 transition-all shadow-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                
                                <div className="p-8">
                                    <h3 className="text-xl font-black text-slate-800 mb-1">{item.title}</h3>
                                    <p className="flex items-center gap-1 text-slate-400 text-sm font-medium mb-4">
                                        <MapPin size={14} className="text-emerald-500" /> {item.location}
                                    </p>

                                    <div className="flex justify-between items-center py-4 border-y border-slate-50 mb-6 font-bold text-slate-600 text-xs">
                                        <span className="flex items-center gap-1.5"><BedDouble size={16} className="text-emerald-500" /> {item.beds} KT</span>
                                        <span className="flex items-center gap-1.5"><Bath size={16} className="text-emerald-500" /> {item.baths} KM</span>
                                        <span className="flex items-center gap-1.5"><Square size={16} className="text-emerald-500" /> {item.sqft} m²</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga</p>
                                            <p className="text-xl font-black text-emerald-600">{formatRupiah(item.price)}</p>
                                        </div>
                                        <Link 
                                            href={`/products/${item.id}`}
                                            className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-emerald-500 transition-all shadow-lg"
                                        >
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
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Belum ada yang disimpan</h2>
                        <p className="text-slate-400 font-medium mb-8">Cari properti idamanmu sekarang!</p>
                        <Link href="/products" className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all inline-flex items-center gap-2">
                            Mulai Cari <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}