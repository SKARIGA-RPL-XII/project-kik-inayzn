import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Send, MessageCircle, Quote } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/sidebar-header';

export default function ReviewReply({ pendingReviews }: any) {
    const { data, setData, post, processing, errors } = useForm({
        review_id: '',
        admin_reply: '',
    });

    const selectedReview = pendingReviews.find((r: any) => r.id == data.review_id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/ulasan'); 
    };

    return (
        <div className="flex min-h-screen bg-[#f1f5f9]">
            <Head title="Admin - Balas Ulasan" />
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8">
                    {/* BACK BUTTON & TITLE */}
                    <div className="mb-8">
                        <Link 
                            href="/ulasan" 
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors w-fit mb-3"
                        >
                            <ArrowLeft size={18} />
                            <span className="text-sm font-semibold">Kembali ke Daftar</span>
                        </Link>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Balas Ulasan</h2>
                        <p className="text-slate-600 mt-1">Berikan respon terbaik untuk meningkatkan kepuasan pelanggan.</p>
                    </div>

                    {/* FORM CARD */}
                    <div className="max-w-4xl rounded-3xl bg-white shadow-sm overflow-hidden border border-slate-200/60">
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            
                            {/* PILIH ULASAN */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pilih Ulasan User</label>
                                <select 
                                    className={`w-full rounded-2xl border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 font-medium transition-all outline-none focus:outline-none focus:ring-4 focus:ring-[#1A4D2E]/5 focus:border-[#1A4D2E] appearance-none ${errors.review_id ? 'border-red-500 focus:ring-red-500/5' : ''}`}
                                    value={data.review_id}
                                    onChange={e => setData('review_id', e.target.value)}
                                >
                                    <option value="">-- Cari Nama User atau Produk --</option>
                                    {pendingReviews.map((rev: any) => (
                                        <option key={rev.id} value={rev.id}>
                                            {rev.user?.username} — {rev.product?.name} ({rev.rating} ★)
                                        </option>
                                    ))}
                                </select>
                                {errors.review_id && <p className="text-sm text-red-600 font-medium">{errors.review_id}</p>}
                            </div>

                            {/* PREVIEW KOMENTAR USER */}
                            {selectedReview && (
                                <div className="relative p-6 bg-slate-900 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                                    <Quote className="absolute right-4 top-4 text-slate-800" size={60} />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pesan Pengguna</span>
                                        </div>
                                        <p className="text-white text-xl font-medium leading-relaxed italic">
                                            "{selectedReview.comment}"
                                        </p>
                                        <div className="mt-4 flex gap-4 text-slate-400 text-sm font-medium">
                                            <span className="flex items-center gap-1">⭐ {selectedReview.rating}/5</span>
                                            <span>•</span>
                                            <span>{selectedReview.product?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* INPUT BALASAN ADMIN */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Balasan Anda</label>
                                <textarea 
                                    rows={6}
                                    placeholder="Ketik balasan profesional..."
                                    className={`w-full rounded-2xl border-slate-200 bg-slate-50 p-5 text-slate-900 transition-all outline-none focus:outline-none focus:ring-4 focus:ring-[#1A4D2E]/5 focus:border-[#1A4D2E] placeholder:text-slate-400 ${errors.admin_reply ? 'border-red-500 focus:ring-red-500/5' : ''}`}
                                    value={data.admin_reply}
                                    onChange={e => setData('admin_reply', e.target.value)}
                                ></textarea>
                                {errors.admin_reply && <p className="text-sm text-red-600 font-medium">{errors.admin_reply}</p>}
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex justify-end items-center gap-4 pt-6">
                                <Link 
                                    href="/ulasan"
                                    className="px-6 py-3 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    Batal
                                </Link>
                                <button 
                                    type="submit"
                                    disabled={processing || !data.review_id}
                                    className="flex items-center gap-3 bg-[#1A4D2E] hover:bg-[#143d24] text-white px-10 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-[#1A4D2E]/20 active:scale-95 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                    {processing ? 'Mengirim...' : 'Kirim Balasan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}