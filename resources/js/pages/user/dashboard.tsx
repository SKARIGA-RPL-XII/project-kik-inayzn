import React from 'react';
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
    BarChart3,
    ArrowRight,
    Calculator // Tambahkan icon Calculator
} from 'lucide-react';

export default function UserDashboard() {
    const { auth } = usePage().props as any;

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari PropertyKu?')) {
            router.post('/logout');
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Head title="PropertyKu - Home" />

            {/* NAVBAR */}
            <nav className="bg-[#1a432d] px-8 py-4 flex items-center justify-between text-white sticky top-0 z-50 shadow-md">
                <div className="flex gap-8 items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                        <span className="font-black text-xl tracking-tighter">PropertyKu</span>
                    </Link>
                    <div className="hidden md:flex gap-8 items-center ml-4">
                        <Link href="/" className="font-medium hover:text-emerald-200 transition-colors">Home</Link>
                        <Link href="/about" className="font-medium hover:text-emerald-200 transition-colors">About Us</Link>
                        <Link href="/products" className="font-medium hover:text-emerald-200 transition-colors">Product</Link>
                        {/* Tambahan Link Simulator KPR di Navbar */}
                        <Link href="/kpr-simulator" className="font-medium hover:text-emerald-200 transition-colors flex items-center gap-1.5">
                            <Calculator size={16} /> Simulator KPR
                        </Link>
                    </div>
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
                            <button onClick={handleLogout} className="flex items-center gap-2 text-rose-300 hover:text-rose-100 transition-colors text-sm font-bold bg-transparent border-none cursor-pointer">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-8 items-center">
                            <Link href="/login" className="font-medium hover:text-emerald-200 transition-colors">Login</Link>
                            <Link href="/register" className="font-medium hover:text-emerald-200 transition-colors text-emerald-400">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* HERO SECTION */}
            <div className="relative h-[550px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
                        className="w-full h-full object-cover brightness-[0.4]"
                        alt="Hero Background"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-white z-10"></div>

                <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl">
                    <h1 className="text-white text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-2xl">
                        Temukan Hunian <br/>
                        <span className="text-emerald-400">Impian</span> Anda
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl mb-10 font-medium max-w-xl opacity-90">
                        Jelajahi berbagai pilihan properti eksklusif di lokasi paling strategis.
                    </p>
                    
                    <div className="relative w-full max-w-2xl group px-4">
                        <div className="relative overflow-hidden rounded-full p-[1px] bg-gradient-to-r from-white/30 to-transparent">
                            <input 
                                type="text" 
                                placeholder="Cari lokasi, nama perumahan..." 
                                className="w-full py-5 px-8 pr-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 text-lg outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-emerald-500/50"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 p-3.5 rounded-full text-white cursor-pointer hover:bg-emerald-400 hover:scale-105 transition-all shadow-lg shadow-emerald-900/20">
                                <Search size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK LINKS */}
            <div className="max-w-6xl mx-auto px-8 -mt-20 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Carikan Properti', icon: <HomeIcon size={32} />, desc: 'Konsultasi gratis', href: '/products' },
                    { label: 'Kategori Terlaris', icon: <Flame size={32} />, desc: 'Paling banyak dicari', href: '/products' },
                    { label: 'Simulator KPR', icon: <Calculator size={32} />, desc: 'Hitung cicilanmu', href: '/kpr-simulator' } // Icon diganti Calculator, Href ke simulator
                ].map((item) => (
                    <Link 
                        key={item.label} 
                        href={item.href}
                        className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-3 transition-all duration-500 text-[#1a432d] group text-left block"
                    >
                        <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white group-hover:rotate-12 transition-all duration-500 text-emerald-600">
                            {item.icon}
                        </div>
                        <h4 className="font-extrabold text-xl mb-2">{item.label}</h4>
                        <p className="text-slate-400 text-sm font-medium">{item.desc}</p>
                    </Link>
                ))}
            </div>

            {/* PROPERTY LIST SECTION */}
            <div className="max-w-7xl mx-auto px-8 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                    <div className="space-y-3">
                        <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
                            Rekomendasi
                        </div>
                        <h2 className="text-4xl font-black text-[#1a432d] tracking-tight">
                            Properti Pilihan
                        </h2>
                    </div>
                    <Link href="/products" className="text-emerald-700 font-bold hover:text-emerald-500 transition-colors flex items-center gap-2 group">
                        Lihat Semua <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[
                        { id: 1, name: 'Perum Zie Residence', loc: 'Jakarta Selatan', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop' },
                        { id: 2, name: 'Emerald Garden', loc: 'BSD City', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop' },
                        { id: 3, name: 'Pine Village', loc: 'Bandung Timur', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop' }
                    ].map((item) => (
                        <div key={item.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-sm hover:shadow-2xl transition-all duration-500">
                            <div className="relative h-80 overflow-hidden">
                                <img 
                                    src={item.img} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                    alt={item.name}
                                />
                                <button className="absolute top-6 right-6 px-5 py-2.5 bg-white/90 backdrop-blur-xl rounded-2xl text-[#1a432d] font-bold text-xs shadow-xl hover:bg-[#1a432d] hover:text-white transition-all active:scale-95 flex items-center gap-2">
                                    <Bookmark size={14} />
                                </button>
                                <div className="absolute bottom-6 left-6 bg-[#1a432d] text-white text-[10px] font-black px-4 py-2 rounded-xl tracking-widest uppercase">
                                    Hot Deal
                                </div>
                            </div>
                            <div className="p-10 flex items-center justify-between bg-white">
                                <div>
                                    <h3 className="font-black text-slate-800 text-2xl mb-2">{item.name}</h3>
                                    <p className="text-sm text-slate-400 flex items-center gap-2 font-bold uppercase tracking-wider">
                                        <MapPin size={14} className="text-emerald-500" />
                                        {item.loc}
                                    </p>
                                </div>
                                <button className="bg-emerald-50 p-5 rounded-[1.5rem] text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                    <MessageCircle size={28} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-slate-900 py-20 text-center">
                <div className="flex flex-col items-center">
                    <img src="/images/logo.png" alt="Logo" className="h-10 w-auto mb-4 brightness-0 invert" />
                    <div className="text-white font-black text-2xl mb-8 tracking-tighter">PropertyKu.</div>
                </div>
                <div className="flex justify-center gap-10 text-slate-500 text-xs uppercase tracking-[0.2em] font-black mb-10">
                    <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
                </div>
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">&copy; 2026 All rights reserved.</p>
            </footer>
        </div>
    );
}