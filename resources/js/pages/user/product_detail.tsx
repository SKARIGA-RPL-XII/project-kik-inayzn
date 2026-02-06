import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react'; 
import { 
    MessageCircle, 
    Send, 
    Lock, 
    ChevronLeft,
    Star
} from 'lucide-react';

interface Review {
    id: number;
    isi_ulasan: string;
    rating: number; 
    created_at: string;
    user?: { 
        // ✅ DISESUAIKAN: Pakai username sesuai migrasi DB lu
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
        // ✅ DISESUAIKAN: Auth user juga biasanya pakai username di DB lu
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

    const displayImages = product?.gambar_url 
        ? [product.gambar_url] 
        : ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"];

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!auth?.user) {
            setShowAuthModal(true);
            return;
        }

        if (rating === 0) {
            alert("Kasih bintang dulu dong bosku!");
            return;
        }

        if (comment.trim() === '') return;

        setIsSubmitting(true);
        
        router.post('/ulasan', {
            produk_id: product.id,
            isi_ulasan: comment,
            rating: rating 
        }, {
            onSuccess: () => {
                setComment('');
                setRating(0);
                setHover(0);
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

            {/* HEADER */}
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
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-800">Ulasan Pembeli ({product?.ulasans?.length || 0})</h3>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 gap-6 mb-10">
                            {product?.ulasans && product.ulasans.length > 0 ? (
                                [...product.ulasans].reverse().map((rev) => (
                                    <div key={rev.id} className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            {/* ✅ FIX: Ambil inisial dari username */}
                                            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black uppercase ring-2 ring-white shadow-sm">
                                                {rev.user?.username ? rev.user.username.charAt(0) : '?'}
                                            </div>
                                            <div>
                                                {/* ✅ FIX: Pakai rev.user.username */}
                                                <p className="font-black text-slate-900 text-sm">{rev.user?.username || 'User'}</p>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-700 font-bold leading-relaxed italic">"{rev.isi_ulasan}"</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 font-bold italic col-span-2 text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed">Belum ada ulasan.</p>
                            )}
                        </div>

                        {/* INPUT ULASAN */}
                        <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 focus-within:border-emerald-500 transition-colors">
                            <h4 className="font-black text-xl text-[#1a432d] mb-4 uppercase">Berikan Penilaian</h4>
                            <div className="flex gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="transition-transform active:scale-90"
                                    >
                                        <Star 
                                            size={32} 
                                            className={`transition-all duration-200 ${(hover || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                                        />
                                    </button>
                                ))}
                            </div>
                            <textarea 
                                className="w-full p-6 bg-white border-2 border-slate-100 focus:border-emerald-500 rounded-2xl outline-none text-xl font-bold text-slate-800 min-h-[140px] resize-none mb-4"
                                placeholder="Bagaimana pengalaman Anda?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button 
                                onClick={handleSendComment}
                                disabled={isSubmitting}
                                className={`px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 transition-all ${
                                    isSubmitting ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#1a432d] text-white hover:bg-emerald-900 shadow-md active:scale-95'
                                }`}
                            >
                                <Send size={20} /> 
                                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan Sekarang'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL AUTH */}
            {showAuthModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1a432d]/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center">
                        <Lock size={36} className="text-emerald-600 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-[#1a432d] mb-2">Akses Terbatas</h3>
                        <p className="text-slate-400 text-sm mb-8">Silakan login terlebih dahulu.</p>
                        <div className="flex flex-col gap-3">
                            <Link href="/login" className="bg-[#1a432d] text-white font-black py-4 rounded-2xl hover:bg-emerald-900 transition-all text-center">Login Sekarang</Link>
                            <button onClick={() => setShowAuthModal(false)} className="text-slate-400 font-bold py-2">Mungkin Nanti</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}