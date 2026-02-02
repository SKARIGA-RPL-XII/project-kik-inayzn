import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    Calculator, 
    Home, 
    LayoutDashboard, 
    Bookmark, 
    User, 
    LogOut,
    ArrowRight,
    CircleDollarSign,
    Calendar,
    Percent,
    Wallet
} from 'lucide-react';

const WHATSAPP_NUMBER = "6287840375227"; 

export default function KPRSimulator() {
    const { auth } = usePage().props as any;

    // State Input
    const [propertyPrice, setPropertyPrice] = useState<number>(0);
    const [downPayment, setDownPayment] = useState<number>(0);
    const [tenure, setTenure] = useState<number>(10);
    const [interestRate, setInterestRate] = useState<number>(5);
    const [monthlyInstallment, setMonthlyInstallment] = useState<number>(0);

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari PropertyKu?')) {
            router.post('/logout');
        }
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const calculateKPR = () => {
        const principal = propertyPrice - downPayment;
        const monthlyRate = (interestRate / 100) / 12;
        const totalMonths = tenure * 12;

        if (principal > 0 && monthlyRate > 0) {
            const x = Math.pow(1 + monthlyRate, totalMonths);
            const monthly = (principal * x * monthlyRate) / (x - 1);
            setMonthlyInstallment(Math.round(monthly));
        } else {
            setMonthlyInstallment(0);
        }
    };

    const handleWhatsAppContact = () => {
        const userName = auth.user ? (auth.user.username || auth.user.name) : "Calon Pembeli";
        const message = `Halo PropertyKu, saya ${userName} ingin konsultasi mengenai KPR.%0A%0A` +
                        `*Detail Rencana KPR:*%0A` +
                        `- Harga Properti: ${formatRupiah(propertyPrice)}%0A` +
                        `- Uang Muka: ${formatRupiah(downPayment)}%0A` +
                        `- Jangka Waktu: ${tenure} Tahun%0A` +
                        `- Suku Bunga: ${interestRate}%%0A%0A` +
                        `*Estimasi Cicilan:* ${formatRupiah(monthlyInstallment)} /bulan.%0A%0A` +
                        `Mohon bantuannya untuk proses selanjutnya. Terima kasih!`;
        
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans overflow-x-hidden">
            <Head title="Simulator KPR - PropertyKu" />

            {/* NAVBAR - SEKARANG SAMA DENGAN DASHBOARD */}
            <nav className="bg-[#1a432d] px-8 py-4 flex items-center justify-between text-white sticky top-0 z-50 shadow-md">
                <div className="flex gap-8 items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain brightness-0 invert" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-6 ml-4 border-l border-emerald-800 pl-8">
                        <Link href="/dashboard" className="text-sm font-bold flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-emerald-400 transition-all">
                            <LayoutDashboard size={16}/> Dashboard
                        </Link>
                        <Link href="/products" className="text-sm font-bold flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-emerald-400 transition-all">
                            <Home size={16}/> Properti
                        </Link>
                        <Link href="/simulator-kpr" className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                            <Calculator size={16}/> Simulator KPR
                        </Link>
                        <Link href="/saved-properties" className="text-sm font-bold flex items-center gap-2 opacity-70 hover:opacity-100 hover:text-emerald-400 transition-all">
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

            {/* HEADER */}
            <div className="bg-[#1a432d] pt-12 pb-32 px-8 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Simulator KPR</h1>
                <p className="text-emerald-100/70 max-w-xl mx-auto font-medium">
                    Hitung estimasi cicilan bulanan hunian impianmu dengan kalkulator bunga efektif kami.
                </p>
            </div>

            {/* MAIN CONTENT */}
            <main className="max-w-6xl mx-auto px-8 -mt-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* FORM INPUT */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                    <CircleDollarSign size={14} className="text-emerald-500" /> Harga Properti (Rp)
                                </label>
                                <input 
                                    type="number" 
                                    placeholder="Contoh: 1000000000"
                                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 outline-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                    <Wallet size={14} className="text-emerald-500" /> Uang Muka / DP (Rp)
                                </label>
                                <input 
                                    type="number" 
                                    placeholder="Contoh: 200000000"
                                    onChange={(e) => setDownPayment(Number(e.target.value))}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 outline-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                    <Calendar size={14} className="text-emerald-500" /> Jangka Waktu ({tenure} Tahun)
                                </label>
                                <input 
                                    type="range" min="1" max="30" value={tenure}
                                    onChange={(e) => setTenure(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                    <span>1 TAHUN</span>
                                    <span>30 TAHUN</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                                    <Percent size={14} className="text-emerald-500" /> Suku Bunga (% per tahun)
                                </label>
                                <input 
                                    type="number" step="0.1" value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 outline-none"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={calculateKPR}
                            className="w-full mt-10 bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                        >
                            Hitung Sekarang
                        </button>
                    </div>

                    {/* HASIL PERHITUNGAN */}
                    <div className="bg-[#1a432d] rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Calculator size={120} />
                        </div>
                        
                        <div className="relative z-10">
                            <p className="text-emerald-300/60 text-xs font-black uppercase tracking-[0.2em] mb-2">Estimasi Cicilan</p>
                            <h2 className="text-4xl font-black mb-1">{formatRupiah(monthlyInstallment)}</h2>
                            <p className="text-emerald-100/50 text-sm font-medium">per bulan*</p>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                            <div className="flex justify-between mb-4">
                                <span className="text-emerald-100/60 text-sm">Pinjaman Pokok</span>
                                <span className="font-bold">{formatRupiah(propertyPrice - downPayment)}</span>
                            </div>
                            <div className="flex justify-between mb-8">
                                <span className="text-emerald-100/60 text-sm">Total Tenor</span>
                                <span className="font-bold">{tenure * 12} Bulan</span>
                            </div>
                            
                            <button 
                                onClick={handleWhatsAppContact}
                                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md py-4 rounded-xl font-bold text-sm transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Hubungi Konsultan <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                </div>

                <div className="mt-12 bg-white/50 border border-slate-100 p-6 rounded-2xl">
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        *Disclaimer: Hasil perhitungan ini adalah estimasi awal dan tidak bersifat mengikat. Suku bunga dapat berubah sewaktu-waktu sesuai kebijakan bank penyedia KPR.
                    </p>
                </div>
            </main>
        </div>
    );
}