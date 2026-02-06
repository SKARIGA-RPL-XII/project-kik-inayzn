import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Trash2, Star, MessageSquare, X } from 'lucide-react'; 
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header';

export default function ReviewIndex({ reviews }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [replyText, setReplyText] = useState('');

    const openReplyModal = (review: any) => {
        setSelectedReview(review);
        setReplyText(review.admin_reply || ''); 
        setIsModalOpen(true);
    };

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReview) return; 

        router.post('/ulasan', {
            review_id: selectedReview.id,
            admin_reply: replyText
        }, {
            onSuccess: () => {
                setIsModalOpen(false);
                setReplyText('');
                setSelectedReview(null);
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            <Head title="Admin - Ulasan" />
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Daftar Ulasan</h2>
                            <p className="text-sm text-slate-500">Lihat dan balas ulasan dari pengguna</p>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white mt-4">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#e9eff6] text-slate-700 font-bold text-sm uppercase tracking-wider">
                                    <th className="px-6 py-5 border-r border-white w-20 text-center">no</th>
                                    <th className="px-6 py-5 border-r border-white">Nama Pengguna</th>
                                    <th className="px-6 py-5 border-r border-white">Produk</th>
                                    <th className="px-6 py-5 border-r border-white text-center">Rating</th>
                                    <th className="px-6 py-5 border-r border-white">Komentar User</th>
                                    <th className="px-6 py-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {reviews.data.length > 0 ? (
                                    reviews.data.map((item: any, index: number) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors text-slate-600">
                                            <td className="px-6 py-5 text-center font-medium">{reviews.from + index}</td>
                                            <td className="px-6 py-5 font-bold text-slate-800">{item.user?.username || 'User Anonim'}</td>
                                            <td className="px-6 py-5">{item.product?.nama_produk || 'Produk'}</td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                                                    <Star size={14} fill="currentColor" />
                                                    {item.rating}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="max-w-xs">
                                                    <p className="italic text-slate-500">"{item.isi_ulasan}"</p>
                                                    {item.admin_reply && (
                                                        <p className="mt-2 text-[11px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100">
                                                            <span className="font-bold">Balasan:</span> {item.admin_reply}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => openReplyModal(item)} className="p-2 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-all">
                                                        <MessageSquare size={18} />
                                                    </button>
                                                    <button onClick={() => confirm('Hapus ulasan ini?') && router.delete(`/ulasan/${item.id}`)} className="p-2 text-rose-500 border border-rose-200 rounded-xl hover:bg-rose-50 transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 text-slate-400 italic">Belum ada ulasan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-10 flex justify-between items-center text-slate-400 text-sm font-medium">
                        <p>Menampilkan {reviews.from}-{reviews.to} dari {reviews.total} data</p>
                        <div className="flex items-center gap-2">
                            {reviews.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg border ${
                                        link.active ? 'bg-[#1A4D2E] text-white border-[#1A4D2E]' : 'bg-white text-slate-400 border-slate-200'
                                    } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* MODAL BALASAN - TEMA TERANG (PUTIH-HITAM) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Header Modal */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-2 text-emerald-600">
                                <MessageSquare size={20} />
                                <h3 className="font-bold text-lg text-slate-800">Balas Ulasan</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSendReply} className="p-6">
                            <div className="mb-5">
                                <label className="block text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-[0.15em]">Detail Reviewer</label>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-sm font-bold text-slate-800">@{selectedReview?.user?.username || 'User Anonim'}</p>
                                    <p className="text-xs text-slate-500 mt-1">Produk: {selectedReview?.product?.nama_produk}</p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-[0.15em]">Pesan Balasan Admin</label>
                                {/* TEXTAREA: BG PUTIH, TEKS HITAM */}
                                <textarea 
                                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[140px] text-sm placeholder:text-slate-400 p-4 transition-all outline-none"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Tulis balasan di sini..."
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                    Batal
                                </button>
                                <button type="submit" className="flex-[2] bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-md transition-all active:scale-[0.98]">
                                    Kirim Balasan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}