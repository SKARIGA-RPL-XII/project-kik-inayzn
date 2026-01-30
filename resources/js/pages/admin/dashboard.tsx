import AppLayout from '@/layouts/app-layout';
import StatCard from '@/components/StatCard';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/' },
];

// Data Dummy Kategori
const topCategories = [
    { name: 'Rumah Subsidi', sold: 124, revenue: 'Rp18M', growth: '+12%', color: 'bg-blue-500' },
    { name: 'Rumah Komersial', sold: 42, revenue: 'Rp42M', growth: '+8%', color: 'bg-emerald-500' },
    { name: 'Ruko & Niaga', sold: 12, revenue: 'Rp15M', growth: '+2%', color: 'bg-amber-500' },
    { name: 'Tanah Kavling', sold: 8, revenue: 'Rp4M', growth: '-1%', color: 'bg-rose-500' },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl px-6 py-6">

                {/* HEADER */}
                <section className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Selamat Datang, Admin 👋
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ringkasan statistik sistem hari ini
                    </p>
                </section>

                {/* GRID UTAMA */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-5 items-start">

                    {/* KOLOM KIRI (KOLOM LEBAR) */}
                    <div className="lg:col-span-3 space-y-6">
                        
                        {/* 1. STAT CARDS */}
                        <div className="grid grid-cols-3 gap-3">
                            <StatCard title="Produk Dijual" value="18 Unit" variant="info" />
                            <StatCard title="Ulasan" value={260} />
                            <StatCard title="Pengguna" value={260} />
                        </div>

                        {/* 2. KATEGORI TERLARIS (DIBAWAH STAT CARD) */}
                        <div className="rounded-xl border bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Performa Kategori Terlaris
                                </h2>
                                <span className="text-xs text-muted-foreground underline cursor-pointer">Detail Laporan</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {topCategories.map((cat, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 flex items-center justify-center rounded-full ${cat.color} bg-opacity-10 text-xl`}>
                                                🏠
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{cat.name}</p>
                                                <p className="text-xs text-muted-foreground">{cat.sold} Unit Terjual</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-700">{cat.revenue}</p>
                                            <p className={`text-[10px] font-bold ${cat.growth.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {cat.growth}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </section>
            </div>
        </AppLayout>
    );
}