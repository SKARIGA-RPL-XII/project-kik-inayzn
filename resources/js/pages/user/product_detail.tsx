import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react'; 
import { 
    MessageCircle, 
    Send, 
    Lock, 
    ChevronLeft,
    Star,
    CornerDownRight,
    X
} from 'lucide-react';

interface Review {
    id: number;
    user_id: number; 
    isi_ulasan: string;
    rating: number; 
    parent_id: number | null; 
    created_at: string;
    user?: { 
        username: string; 
    };
}

interface Product {
    id: number;
    nama_produk: string;
    harga: number;
    kategori: string;
    stok: number;
    status: string;
    deskripsi: string | null;
    gambar: string | null;
    gambar_url?: string;
    ulasans?: Review[]; 
}

interface CustomPageProps {
    auth: {
        user: { id: number; username: string; email: string } | null;
    };
}

export default function ProductDetail({ product }: { product: Product }) {
    const { props } = usePage();
    const { auth } = props as unknown as CustomPageProps;
    
    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [rating, setRating] = useState<number>(0); 
    const [hover, setHover] = useState<number>(0);   
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [replyTo, setReplyTo] = useState<{id: number, username: string} | null>(null);

    const displayImages = product?.gambar_url 
        ? [product.gambar_url] 
        : ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"];

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!auth?.user) {
            setShowAuthModal(true);
            return;
        }

        if (!replyTo && rating === 0) {
            alert("Kasih bintang dulu dong bosku!");
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
                setHover(0);
                setReplyTo(null);
                setIsSubmitting(false);
            },
            onError: () => setIsSubmitting(false),
            preserveScroll: true 
        });
    };

    const handleWhatsApp = () => {
        if (!auth?.user) {
            setShowAuthModal(true);
        } else {
            const message = encodeURIComponent(`Halo, saya tertarik dengan properti: ${product.nama_produk}`);
            window.open(`https://wa.me/628123456789?text=${message}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
            <Head title={`${product?.nama_produk || 'Detail Properti'} - PropertyKu`} />

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
                            <img src={displayImages[activeIndex]} className="w-full h-full object-cover" alt={product?.nama_produk} />
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
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl">
                        <h1 className="text-3xl md:text-4xl font-black text-[#1a432d] mb-4">{product?.nama_produk}</h1>
                        <p className="text-slate-600 font-medium text-lg mb-8">{product?.deskripsi || "Tidak ada deskripsi."}</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100">
                        <h3 className="text-2xl font-black text-slate-800 mb-8">Ulasan Pembeli ({product?.ulasans?.length || 0})</h3>
                        
                        <div className="space-y-6 mb-10">
                            {product?.ulasans && product.ulasans.length > 0 ? (
                                product.ulasans.filter(r => !r.parent_id).reverse().map((rev) => (
                                    <div key={rev.id} className="space-y-4">
                                        <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-200">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black uppercase ring-2 ring-white shadow-sm">
                                                        {rev.user?.username ? rev.user.username.charAt(0) : '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-sm">{rev.user?.username || 'User'}</p>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={12} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/*  LOGIC: Cek apakah boleh membalas */}
                                                <button 
                                                    onClick={() => {
                                                        const replies = product.ulasans?.filter(reply => reply.parent_id === rev.id) || [];
                                                        const lastReply = replies.length > 0 ? replies[replies.length - 1] : null;

                                                        if (rev.user_id === auth.user?.id && !lastReply) {
                                                            alert("Tunggu user lain membalas ulasanmu dulu ya!");
                                                            return;
                                                        }

                                                        if (lastReply && lastReply.user_id === auth.user?.id) {
                                                            alert("Kamu sudah membalas, tunggu respon user lain ya!");
                                                            return;
                                                        }

                                                        setReplyTo({id: rev.id, username: rev.user?.username || 'User'});
                                                        document.getElementById('input-ulasan')?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    className={`text-xs font-black uppercase tracking-tighter ${
                                                        rev.user_id === auth.user?.id && !(product.ulasans?.some(r => r.parent_id === rev.id))
                                                        ? "text-slate-300 cursor-not-allowed" 
                                                        : "text-emerald-600 hover:text-emerald-800"
                                                    }`}
                                                >
                                                    Balas
                                                </button>
                                            </div>
                                            <p className="text-slate-700 font-bold leading-relaxed italic mt-2">"{rev.isi_ulasan}"</p>
                                        </div>

                                        {product.ulasans?.filter(reply => reply.parent_id === rev.id).map((reply) => (
                                            <div key={reply.id} className="ml-8 md:ml-12 flex gap-3">
                                                <CornerDownRight className="text-slate-300 mt-2 shrink-0" size={20} />
                                                <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm w-full">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black uppercase">
                                                            {reply.user?.username?.charAt(0)}
                                                        </div>
                                                        <span className="font-black text-xs text-slate-800">{reply.user?.username}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 font-bold italic">"{reply.isi_ulasan}"</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 font-bold italic text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed">Belum ada ulasan.</p>
                            )}
                        </div>

                        <div id="input-ulasan" className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 focus-within:border-emerald-500 transition-colors relative">
                            {replyTo && (
                                <div className="flex items-center justify-between bg-emerald-600 text-white px-4 py-2 rounded-xl mb-4">
                                    <p className="text-sm font-bold">Membalas ulasan @{replyTo.username}</p>
                                    <button onClick={() => setReplyTo(null)}><X size={18} /></button>
                                </div>
                            )}

                            <h4 className="font-black text-xl text-[#1a432d] mb-4 uppercase">
                                {replyTo ? 'Kirim Balasan' : 'Berikan Penilaian'}
                            </h4>
                            
                            {!replyTo && (
                                <div className="flex gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}>
                                            <Star size={32} className={`transition-all ${(hover || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <textarea 
                                className="w-full p-6 bg-white border-2 border-slate-100 focus:border-emerald-500 rounded-2xl outline-none text-xl font-bold text-slate-800 min-h-[140px] resize-none mb-4"
                                placeholder={replyTo ? "Tulis balasan anda..." : "Bagaimana pengalaman Anda?"}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            
                            <button 
                                onClick={handleSendComment}
                                disabled={isSubmitting}
                                className={`px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 transition-all ${
                                    isSubmitting ? 'bg-slate-300' : 'bg-[#1a432d] text-white hover:bg-emerald-900 shadow-md'
                                }`}
                            >
                                <Send size={20} /> 
                                {isSubmitting ? 'Mengirim...' : (replyTo ? 'Kirim Balasan' : 'Kirim Ulasan Sekarang')}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            {/* MODAL AUTH TETAP SAMA */}
        </div>
    );
}