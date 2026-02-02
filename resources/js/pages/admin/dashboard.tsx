import AppLayout from '@/layouts/app-layout';
import StatCard from '@/components/StatCard';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { 
    Home, 
    MessageSquare, 
    Users, 
    LayoutGrid, 
    TrendingUp, 
    ChevronRight 
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/' }];

// Data Dummy Kategori dengan format yang lebih lengkap untuk estetika
const topCategories = [
    { 
        name: 'Rumah Subsidi', sold: 124, revenue: 'Rp18M', growth: '+12%', 
        colorClass: 'text-blue-600', bgClass: 'bg-blue-50', borderClass: 'border-blue-100' 
    },
    { 
        name: 'Rumah Komersial', sold: 42, revenue: 'Rp42M', growth: '+8%', 
        colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-100' 
    },
    { 
        name: 'Ruko & Niaga', sold: 12, revenue: 'Rp15M', growth: '+2%', 
        colorClass: 'text-amber-600', bgClass: 'bg-amber-50', borderClass: 'border-amber-100' 
    },
    { 
        name: 'Tanah Kavling', sold: 8, revenue: 'Rp4M', growth: '-1%', 
        colorClass: 'text-rose-600', bgClass: 'bg-rose-50', borderClass: 'border-rose-100' 
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* HEADER - Lebih Clean */}
                <section className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Selamat Datang, Admin 👋
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Berikut adalah ringkasan performa <span className="font-semibold text-[#1A4D2E]">PropertyKu</span> hari ini.
                    </p>
                </section>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    {/* KOLOM KIRI */}
                    <div className="lg:col-span-3 space-y-8">
                        
                        {/* 1. STAT CARDS - Terpusat & Berwarna */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="group rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
                                        <LayoutGrid size={24} />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">Properti Terjual</p>
                                    <h3 className="mt-1 text-2xl font-bold text-slate-900">18 Unit</h3>
                                </div>
                            </div>

                            <div className="group rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110">
                                        <MessageSquare size={24} />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">Total Ulasan</p>
                                    <h3 className="mt-1 text-2xl font-bold text-slate-900">260</h3>
                                </div>
                            </div>

                            <div className="group rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-transform group-hover:scale-110">
                                        <Users size={24} />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">Pengguna Aktif</p>
                                    <h3 className="mt-1 text-2xl font-bold text-slate-900">1.2k</h3>
                                </div>
                            </div>
                        </div>

                        {/* 2. KATEGORI TERLARIS - Lebih Estetik */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={18} className="text-[#1A4D2E]" />
                                    <h2 className="font-bold text-slate-800">Performa Kategori Terlaris</h2>
                                </div>
                                <button className="text-xs font-semibold text-[#1A4D2E] hover:underline">
                                    Lihat Semua
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {topCategories.map((cat, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`group flex items-center justify-between rounded-xl border p-4 transition-all hover:bg-slate-50 ${cat.borderClass}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${cat.bgClass} ${cat.colorClass}`}>
                                                    <Home size={22} strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{cat.name}</p>
                                                    <p className="text-[11px] font-medium text-slate-500">{cat.sold} Unit Terjual</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-700">{cat.revenue}</p>
                                                <span className={`text-[10px] font-bold ${cat.growth.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {cat.growth}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN (Opsional untuk aktivitas atau info tambahan) */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200 bg-[#1A4D2E] p-6 text-white shadow-lg">
                            <h3 className="text-lg font-bold">Tips Hari Ini 💡</h3>
                            <p className="mt-2 text-sm text-green-100 leading-relaxed">
                                Pastikan ulasan pelanggan segera dibalas untuk meningkatkan kepercayaan calon pembeli properti Anda!
                            </p>
                            <button className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold transition-hover hover:bg-white/20">
                                Pelajari Lanjut <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}