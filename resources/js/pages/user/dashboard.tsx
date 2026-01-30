import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Search, MessageCircle, Heart, User, LogOut } from 'lucide-react';

export default function UserDashboard() {
    // Mengambil data auth dari props global Inertia
    const { auth } = usePage().props as any;

    return (
        <div className="min-h-screen bg-white">
            <Head title="PropertyKu - Home" />

            {/* NAVBAR */}
            <nav className="bg-[#1a432d] px-8 py-4 flex items-center justify-between text-white sticky top-0 z-50 shadow-md">
                <div className="flex gap-8 items-center">
                    <Link href="/" className="font-medium hover:text-emerald-200 transition-colors">Home</Link>
                    <Link href="/about" className="font-medium hover:text-emerald-200 transition-colors">About Us</Link>
                    <Link href="/products" className="font-medium hover:text-emerald-200 transition-colors">Product</Link>
                </div>

                <div className="flex items-center">
                    {auth.user ? (
                        /* TAMPILAN JIKA SUDAH LOGIN */
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 bg-emerald-800/50 px-3 py-1.5 rounded-full border border-emerald-700">
                                <User size={16} className="text-emerald-400" />
                                <span className="text-sm font-medium">Hi, {auth.user.username}</span>
                            </div>
                            
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-2 text-rose-300 hover:text-rose-100 transition-colors text-sm font-bold"
                            >
                                <LogOut size={16} />
                                Logout
                            </Link>
                        </div>
                    ) : (
                        /* TAMPILAN JIKA BELUM LOGIN (SESUAI UI KAMU) */
                        <div className="flex gap-8 items-center">
                            <Link href="/login" className="font-medium hover:text-emerald-200 transition-colors">Login</Link>
                            <Link href="/register" className="font-medium hover:text-emerald-200 transition-colors">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* HERO SECTION WITH SEARCH */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <img 
                    src="/images/hero-property.jpg" 
                    className="w-full h-full object-cover brightness-[0.6]"
                    alt="Hero Property"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-white text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">
                        Cari Properti Impian Anda
                    </h1>
                    <div className="relative w-full max-w-xl">
                        <input 
                            type="text" 
                            placeholder="Cari lokasi, nama perumahan..." 
                            className="w-full py-4 px-6 pr-14 rounded-xl border-none shadow-2xl focus:ring-4 focus:ring-emerald-500/50 text-slate-700 text-lg"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1a432d] p-2 rounded-lg text-white">
                            <Search size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK LINKS / CATEGORIES (Floating Layout) */}
            <div className="max-w-7xl mx-auto px-8 -mt-12 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Carikan Properti', icon: '🏠' },
                    { label: 'Kategori Terlaris', icon: '🔥' },
                    { label: 'Simulator KPR', icon: '📊' }
                ].map((item) => (
                    <button key={item.label} className="bg-white border border-slate-100 py-8 px-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-[#1a432d] font-bold text-xl flex flex-col items-center gap-2">
                        <span className="text-3xl">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </div>

            {/* PROPERTY LIST SECTION */}
            <div className="max-w-7xl mx-auto px-8 py-20">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold text-[#1a432d] border-l-8 border-[#1a432d] pl-5">
                        Properti Pilihan Kami
                    </h2>
                    <Link href="/products" className="text-emerald-700 font-semibold hover:underline">
                        Lihat Semua &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* CARD PRODUCT */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group bg-white overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300">
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src="/images/house-card.jpg" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                                {/* Tombol Wishlist (❤️) */}
                                <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-rose-500 shadow-md transition-all active:scale-90">
                                    <Heart size={22} fill="currentColor" className="text-transparent hover:text-rose-500" />
                                </button>
                                <div className="absolute bottom-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                                    DIJUAL
                                </div>
                            </div>
                            <div className="p-6 flex items-center justify-between bg-white">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-xl mb-1">Perum Zie</h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                        📍 Jakarta Selatan
                                    </p>
                                </div>
                                <button className="bg-emerald-100 p-3 rounded-xl text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                                    <MessageCircle size={24} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER SEDERHANA */}
            <footer className="bg-slate-50 border-t py-10 text-center text-slate-400 text-sm">
                &copy; 2026 PropertyKu. All rights reserved.
            </footer>
        </div>
    );
}