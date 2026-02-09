import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react'; 
import { 
    MessageCircle, 
    Send, 
    ChevronLeft,
    Star,
    CornerDownRight,
    X,
    Trash2 
} from 'lucide-react';

// --- INTERFACES ---
interface Review {
    id: number;
    user_id: number; 
    isi_ulasan: string;
    rating: number; 
    parent_id: number | null; 
    admin_reply: string | null;
    created_at: string;
    user?: { 
        id: number;
        username: string; 
    };
    replies?: Review[]; 
}

interface Product {
    id: number;
    nama_produk: string;
    harga: number;
    kategori: string;
    stok: number;
    status: string;
    deskripsi: string | null;
    gambar_url?: string;
    ulasans?: Review[]; 
}

interface CustomPageProps {
    auth: {
        user: { id: number; username: string; email: string; role: string } | null;
    };
}

export default function ProductDetail({ product }: { product: Product }) {
    const { props } = usePage();
    const { auth } = props as unknown as CustomPageProps;
    
    const [comment, setComment] = useState<string>('');
    const [rating, setRating] = useState<number>(0); 
    const [hover, setHover] = useState<number>(0);   
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [replyTo, setReplyTo] = useState<{id: number, username: string} | null>(null);

    const handleReplyClick = (parentId: number, targetUsername: string) => {
        setReplyTo({ id: parentId, username: targetUsername });
        setComment(`@${targetUsername} `);
        document.getElementById('input-ulasan')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
            router.delete(`/ulasan/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth?.user) {
            alert("Silahkan login terlebih dahulu.");
            return;
        }
        if (!replyTo && rating === 0) {
            alert("Berikan rating bintang terlebih dahulu!");
            return;
        }
        if (comment.trim() === '') return;

        setIsSubmitting(true);
        router.post('/ulasan', {
            produk_id: product.id,
            isi_ulasan: comment,
            rating: replyTo ? null : rating,
            parent_id: replyTo?.id || null 
        }, {
            onSuccess: () => {
                setComment('');
                setRating(0);
                setReplyTo(null);
                setIsSubmitting(false);
            },
            onError: () => setIsSubmitting(false),
            preserveScroll: true 
        });
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(`Halo, saya tertarik dengan properti: ${product.nama_produk}`);
        window.open(`https://wa.me/6287840375227?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
            <Head title={`${product?.nama_produk || 'Detail Properti'} - PropertyKu`} />

            {/* Header */}
            <div className="bg-[#1a432d] pt-8 pb-20 px-8 text-white">
                <div className="max-w-7xl mx-auto">
                    <Link href="/products" className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors font-bold text-sm group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Katalog
                    </Link>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-8 -mt-12 pb-20">
                <div className="flex flex-col lg:flex-row gap-8 items-start mb-8">
                    <div className="w-full lg:w-2/3">
                        <div className="relative h-[350px] md:h-[480px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200 border-4 border-white">
                            <img src={product?.gambar_url || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"} className="w-full h-full object-cover" alt={product?.nama_produk} />
                        </div>
                    </div>
                    <aside className="w-full lg:w-1/3">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-t-emerald-600">
                            <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black mb-4 inline-block uppercase tracking-wider">
                                {product?.status === 'aktif' ? 'Tersedia' : 'Sold Out'}
                            </span>
                            <p className="text-slate-400 font-bold text-sm">Harga Penawaran</p>
                            <h2 className="text-3xl font-black text-emerald-600 mb-6">
                                Rp {product?.harga ? Number(product.harga).toLocaleString('id-ID') : '0'}
                            </h2>
                            <button onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#1ebd58] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg">
                                <MessageCircle size={24} /> WhatsApp Agen
                            </button>
                        </div>
                    </aside>
                </div>

                <div className="space-y-8">
                    {/* BAGIAN DESKRIPSI - SETIAP BARIS ADA BULATAN + NYAMPING */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl overflow-hidden">
                        <h1 className="text-3xl md:text-4xl font-black text-[#1a432d] mb-8">{product?.nama_produk}</h1>
                        
                        <div className="columns-1 md:columns-2 gap-16 [column-rule:1px_dashed_#e2e8f0]">
                            {product?.deskripsi ? (
                                product.deskripsi.split('\n').map((line, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-start gap-4 mb-4 break-inside-avoid-column group"
                                    >
                                        {/* Bulatan Hijau di Setiap Baris */}
                                        <div className="w-5 flex justify-center pt-2.5 shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] group-hover:scale-150 transition-transform duration-300" />
                                        </div>

                                        {/* Teks Deskripsi */}
                                        <p className="flex-1 text-lg leading-relaxed text-slate-600 font-medium group-hover:text-slate-900 transition-colors duration-300">
                                            {line || "\u00A0"}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 italic">Deskripsi tidak tersedia.</p>
                            )}
                        </div>
                    </div>

                    {/* --- BAGIAN ULASAN --- */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100">
                        <h3 className="text-2xl font-black text-slate-800 mb-8">Ulasan Pembeli ({product?.ulasans?.length || 0})</h3>
                        
                        <div className="space-y-8 mb-10">
                            {product?.ulasans?.map((rev) => (
                                <div key={rev.id} id={`ulasan-${rev.id}`} className="space-y-4 scroll-mt-24">
                                    <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black uppercase ring-2 ring-white">
                                                    {rev.user?.username?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm">{rev.user?.username}</p>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {rev.user_id === auth?.user?.id && (
                                                    <button onClick={() => handleDelete(rev.id)} className="text-red-300 hover:text-red-600 transition-colors p-1">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleReplyClick(rev.id, rev.user?.username || 'User')} className="text-xs font-black uppercase text-emerald-600 hover:text-emerald-800">
                                                    Balas
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-slate-700 font-bold leading-relaxed italic mt-2 whitespace-pre-line">"{rev.isi_ulasan}"</p>
                                        {rev.admin_reply && (
                                            <div className="mt-4 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl">
                                                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase mb-1 inline-block">Admin</span>
                                                <p className="text-slate-800 text-sm font-bold whitespace-pre-line">{rev.admin_reply}</p>
                                            </div>
                                        )}
                                    </div>
                                    {rev.replies?.map((reply) => (
                                        <div key={reply.id} className="ml-8 md:ml-12 flex gap-3">
                                            <CornerDownRight className="text-slate-300 mt-2 shrink-0" size={20} />
                                            <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm w-full">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black uppercase">{reply.user?.username?.charAt(0)}</div>
                                                        <span className="font-black text-xs text-slate-800">{reply.user?.username}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => handleReplyClick(rev.id, reply.user?.username || 'User')} className="text-[10px] font-black uppercase text-emerald-600">Balas</button>
                                                        {reply.user_id === auth?.user?.id && (
                                                            <button onClick={() => handleDelete(reply.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 font-bold italic">"{reply.isi_ulasan}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Form Input */}
                        <div id="input-ulasan" className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 focus-within:border-emerald-500 transition-all">
                            {replyTo && (
                                <div className="flex items-center justify-between bg-emerald-600 text-white px-4 py-2 rounded-xl mb-4">
                                    <p className="text-sm font-bold">Membalas @{replyTo.username}</p>
                                    <button onClick={() => { setReplyTo(null); setComment(''); }}><X size={18} /></button>
                                </div>
                            )}
                            <h4 className="font-black text-xl text-[#1a432d] mb-4 uppercase">{replyTo ? 'Kirim Balasan' : 'Berikan Penilaian'}</h4>
                            {!replyTo && (
                                <div className="flex gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}>
                                            <Star size={32} className={`transition-all ${(hover || rating) >= star ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                            <textarea className="w-full p-6 bg-white border-2 border-slate-100 focus:border-emerald-500 rounded-2xl outline-none text-xl font-bold text-slate-800 min-h-[140px] resize-none mb-4" placeholder={replyTo ? `Balas @${replyTo.username}...` : "Bagaimana pengalaman Anda?"} value={comment} onChange={(e) => setComment(e.target.value)} />
                            <button onClick={handleSendComment} disabled={isSubmitting} className={`px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 transition-all ${isSubmitting ? 'bg-slate-300' : 'bg-[#1a432d] text-white hover:bg-emerald-900 shadow-md active:scale-95'}`}>
                                <Send size={20} /> {isSubmitting ? 'Mengirim...' : (replyTo ? 'Kirim Balasan' : 'Kirim Ulasan Sekarang')}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}