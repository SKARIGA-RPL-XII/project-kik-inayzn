import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import { 
    Home, 
    MessageSquare, 
    Users, 
    LayoutGrid, 
    TrendingUp, 
    ArrowRight,
    Building2
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/admin/dashboard' }];

interface DashboardProps {
    stats?: { properti_terjual: number; total_ulasan: number; pengguna_aktif: number; };
    top_categories?: Array<{ name: string; sold: number; revenue: string; url: string; }>;
}

export default function Dashboard({ 
    stats = { properti_terjual: 0, total_ulasan: 0, pengguna_aktif: 0 }, 
    top_categories = [] 
}: DashboardProps) {

    const getCategoryTheme = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('subsidi')) return 'text-blue-600 bg-blue-50';
        if (n.includes('komersial')) return 'text-emerald-600 bg-emerald-50';
        if (n.includes('ruko') || n.includes('bisnis')) return 'text-amber-600 bg-amber-50';
        return 'text-[#1A4D2E] bg-slate-50';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="mx-auto max-w-7xl px-6 py-10">
                {/* HEADER SECTION */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Ringkasan</h1>
                        <p className="text-slate-500 mt-1">Pantau statistik <span className="text-[#1A4D2E] font-semibold">PropertyKu</span> Anda secara real-time.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm w-fit">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Sistem Aktif
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* STAT CARDS (BAGIAN YANG LU MAKSUD) */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {/* Properti Link */}
                            <Link href="/produk" className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#1A4D2E] flex items-center justify-center mb-4 group-hover:bg-[#1A4D2E] group-hover:text-white transition-colors">
                                    <Building2 size={24} />
                                </div>
                                <p className="text-sm font-medium text-slate-500">Total Properti</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.properti_terjual}</h3>
                                <div className="mt-4 flex items-center text-[11px] font-bold text-[#1A4D2E] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                    Kelola Data <ArrowRight size={12} className="ml-1"/>
                                </div>
                            </Link>

                            {/* Ulasan Link */}
                            <Link href="/ulasan" className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                    <MessageSquare size={24} />
                                </div>
                                <p className="text-sm font-medium text-slate-500">Total Ulasan</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total_ulasan}</h3>
                                <div className="mt-4 flex items-center text-[11px] font-bold text-amber-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                    Lihat Feedback <ArrowRight size={12} className="ml-1"/>
                                </div>
                            </Link>

                            {/* Pengguna Link */}
                            <Link href="/pengguna" className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Users size={24} />
                                </div>
                                <p className="text-sm font-medium text-slate-500">Pengguna</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.pengguna_aktif}</h3>
                                <div className="mt-4 flex items-center text-[11px] font-bold text-blue-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                    Manajemen User <ArrowRight size={12} className="ml-1"/>
                                </div>
                            </Link>
                        </div>

                        {/* KATEGORI SECTION (YANG UDAH BISA) */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h2 className="font-bold text-slate-800 text-lg">Kategori Terpopuler</h2>
                                </div>
                                <Link href="/kategori" className="text-sm font-semibold text-[#1A4D2E] hover:underline">Lihat Semua</Link>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {top_categories.map((cat, idx) => (
                                        <Link 
                                            key={idx} 
                                            href={cat.url || '#'} 
                                            className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-[#1A4D2E]/20 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm ${getCategoryTheme(cat.name)}`}>
                                                    <Home size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">{cat.name}</h4>
                                                    <p className="text-[11px] text-slate-500 font-medium">{cat.sold} Unit Terdaftar</p>
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-[#1A4D2E] font-bold uppercase group-hover:underline">
                                                {cat.revenue}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR CTA */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#1A4D2E] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-900/20">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold leading-tight">Butuh Tambah<br/>Unit Baru?</h3>
                                <p className="text-emerald-100/80 text-sm mt-3">Tambahkan listing properti terbaru Anda sekarang.</p>
                                <Link href="/produk/create" className="mt-8 flex items-center justify-center gap-2 bg-white text-[#1A4D2E] font-bold py-3 rounded-2xl hover:bg-emerald-50 transition-colors shadow-xl shadow-black/10">
                                    <LayoutGrid size={18} />
                                    Tambah Properti
                                </Link>
                                <Link href="/ulasan" className="mt-4 flex items-center justify-center gap-2 bg-white/10 text-white font-semibold py-3 rounded-2xl hover:bg-white/20 transition-colors border border-white/10">
                                    Cek Feedback User
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}