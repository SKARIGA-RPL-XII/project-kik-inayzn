import React, { useState, useMemo } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react'; 
import { 
    MessageCircle, 
    Send, 
    ChevronLeft,
    Star,
    CornerDownRight,
    X,
    Trash2,
    Calculator 
} from 'lucide-react';

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
    tipe_penawaran: string; 
    deskripsi: string | null;
    gambar_url?: string; 
    no_agen?: string;
    ulasans?: Review[]; 
    product_images?: string[]; 
}

interface CustomPageProps {
    auth: {
        user: { id: number; username: string; email: string; role: string } | null;
    };
}

export default function ProductDetail({ product }: { product: Product }) {
    const { props } = usePage();
    const { auth } = props as unknown as CustomPageProps;
    
    const allImages = product.product_images && product.product_images.length > 0 
        ? product.product_images 
        : [product.gambar_url || "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"];

    const [activeImage, setActiveImage] = useState<string>(allImages[0]);
    const [comment, setComment] = useState<string>('');
    const [rating, setRating] = useState<number>(0); 
    const [hover, setHover] = useState<number>(0);   
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [replyTo, setReplyTo] = useState<{id: number, username: string} | null>(null);

    const [tenor, setTenor] = useState<number>(product.tipe_penawaran === 'disewa' ? 1 : 15);
    const [dpPercent, setDpPercent] = useState<number>(10);

    const calculation = useMemo(() => {
        const harga = Number(product?.harga || 0);
        
        if (product.tipe_penawaran === 'disewa') {
            return {
                label: "Total Biaya Sewa",
                primaryValue: harga * (tenor * 12),
                secondaryLabel: "Harga Per Bulan",
                secondaryValue: harga
            };
        } else {
            const uangMuka = harga * (dpPercent / 100);
            const pokokPinjaman = harga - uangMuka;
            const bungaPerTahun = 0.085; 
            const bungaPerBulan = bungaPerTahun / 12;
            const totalBulan = tenor * 12;
            const cicilan = pokokPinjaman * (bungaPerBulan * Math.pow(1 + bungaPerBulan, totalBulan)) / (Math.pow(1 + bungaPerBulan, totalBulan) - 1);
            
            return {
                label: "Estimasi Cicilan",
                primaryValue: isNaN(cicilan) ? 0 : cicilan,
                secondaryLabel: "Uang Muka",
                secondaryValue: uangMuka
            };
        }
    }, [product.harga, product.tipe_penawaran, tenor, dpPercent]);

    const handleWhatsApp = () => {
        const nomorDariBE = product?.no_agen;
        if (!nomorDariBE) { alert("Nomor agen tidak ada."); return; }

        const cleanNo = nomorDariBE.startsWith('0') ? '62' + nomorDariBE.slice(1) : nomorDariBE;
        const infoMsg = product.tipe_penawaran === 'disewa' 
            ? `Saya tertarik menyewa selama ${tenor} tahun (${tenor * 12} bulan) dengan biaya Rp ${Number(product.harga).toLocaleString('id-ID')}/bulan.`
            : `Estimasi cicilan saya: Rp ${Math.round(calculation.primaryValue).toLocaleString('id-ID')}/bln.`;

        const message = encodeURIComponent(
            `Halo Agen! Saya tertarik dengan properti: ${product.nama_produk}.\n${infoMsg}`
        );
        window.open(`https://wa.me/${cleanNo}?text=${message}`, '_blank');
    };

    const handleReplyClick = (parentId: number, targetUsername: string) => {
        setReplyTo({ id: parentId, username: targetUsername });
        setComment(`@${targetUsername} `);
        document.getElementById('input-ulasan')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = (id: number) => {
        if (confirm('Hapus ulasan?')) router.delete(`/ulasan/${id}`, { preserveScroll: true });
    };

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth?.user) { alert("Login dulu bro."); return; }
        if (!replyTo && rating === 0) { alert("Ratingnya diisi ya!"); return; }
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

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
            <Head title={`${product?.nama_produk} - PropertyKu`} />

            <div className="bg-[#1a432d] pt-8 pb-20 px-8 text-white">
                <div className="max-w-7xl mx-auto">
                    <Link href="/products" className="flex items-center gap-2 text-emerald-100 hover:text-white font-bold text-sm">
                        <ChevronLeft size={20} /> Kembali ke Katalog
                    </Link>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-8 -mt-12 pb-20">
                <div className="flex flex-col lg:flex-row gap-8 items-start mb-8">
                    <div className="w-full lg:w-2/3 space-y-6">
                        <div className="relative h-[350px] md:h-[520px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-200 border-4 border-white">
                            <img src={activeImage} className="w-full h-full object-cover" alt={product?.nama_produk} />
                        </div>
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <button key={idx} onClick={() => setActiveImage(img)} className={`w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${activeImage === img ? 'border-emerald-500 scale-105 shadow-lg' : 'border-white'}`}>
                                        <img src={img} className="w-full h-full object-cover" alt="prev" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <aside className="w-full lg:w-1/3 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-t-emerald-600">
                            <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black mb-4 inline-block uppercase tracking-wider">
                                {product?.status === 'aktif' ? 'Tersedia' : 'Sold Out'}
                            </span>
                            <p className="text-slate-400 font-bold text-sm">Harga {product.tipe_penawaran === 'disewa' ? 'Sewa' : 'Jual'}</p>
                            <h2 className="text-3xl font-black text-emerald-600 mb-1">
                                Rp {product?.harga ? Number(product.harga).toLocaleString('id-ID') : '0'}
                                {product.tipe_penawaran === 'disewa' && <span className="text-lg text-slate-400 font-medium"> /bln</span>}
                            </h2>

                            <div className="mb-6 flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${product?.tipe_penawaran === 'disewa' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {product?.tipe_penawaran === 'disewa' ? 'Disewa' : 'Dijual'}
                                </span>
                                <span className="text-slate-400 text-[10px] font-bold italic">
                                    {product?.tipe_penawaran === 'disewa' ? '*Harga Sewa Per-Bulan' : '*Harga Jual Lepas'}
                                </span>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-5 mb-6 border border-slate-100">
                                <div className="flex items-center gap-2 mb-4 text-emerald-800">
                                    <Calculator size={20} />
                                    <h4 className="font-black text-sm uppercase tracking-wide">
                                        {product.tipe_penawaran === 'disewa' ? 'Kalkulator Sewa' : 'Simulasi KPR'}
                                    </h4>
                                </div>
                                <div className="space-y-4">
                                    {product.tipe_penawaran === 'dijual' && (
                                        <div>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                                                <span>Uang Muka ({dpPercent}%)</span>
                                                <span className="text-emerald-700">Rp {calculation.secondaryValue.toLocaleString('id-ID')}</span>
                                            </div>
                                            <input type="range" min="5" max="50" step="5" value={dpPercent} onChange={(e) => setDpPercent(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                                            <span>{product.tipe_penawaran === 'disewa' ? 'Durasi Sewa' : 'Jangka Waktu'}</span>
                                            <span className="text-emerald-700">{tenor} Tahun</span>
                                        </div>
                                        <input type="range" min="1" max={product.tipe_penawaran === 'disewa' ? 10 : 30} value={tenor} onChange={(e) => setTenor(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                                    </div>
                                    <div className="pt-4 border-t border-slate-200">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{calculation.label}</p>
                                        <p className="text-2xl font-black text-slate-900">
                                            Rp {Math.round(calculation.primaryValue).toLocaleString('id-ID')}
                                            {product.tipe_penawaran === 'dijual' && <span className="text-xs text-slate-400 font-medium ml-1">/bln*</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#1ebd58] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg">
                                <MessageCircle size={24} /> {product.tipe_penawaran === 'disewa' ? 'Sewa Sekarang' : 'Hubungi Agen'}
                            </button>
                        </div>
                    </aside>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl">
                        <h1 className="text-3xl md:text-4xl font-black text-[#1a432d] mb-8">{product?.nama_produk}</h1>
                        <div className="columns-1 md:columns-2 gap-16">
                            {product?.deskripsi?.split('\n').map((line, idx) => (
                                <div key={idx} className="flex items-start gap-4 mb-4 break-inside-avoid">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                                    <p className="text-lg leading-relaxed text-slate-600 font-medium">{line || "\u00A0"}</p>
                                </div>
                            )) || <p className="text-slate-400 italic">No description.</p>}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100">
                        <h3 className="text-2xl font-black text-slate-800 mb-8">Ulasan ({product?.ulasans?.length || 0})</h3>
                        <div className="space-y-8 mb-10">
                            {product?.ulasans?.map((rev) => (
                                <div key={rev.id} className="space-y-4">
                                    <div className="bg-slate-50/80 p-6 rounded-[2rem] border border-slate-200">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black uppercase">{rev.user?.username?.charAt(0)}</div>
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
                                                {rev.user_id === auth?.user?.id && <button onClick={() => handleDelete(rev.id)} className="text-red-300 hover:text-red-600"><Trash2 size={16} /></button>}
                                                <button onClick={() => handleReplyClick(rev.id, rev.user?.username || 'User')} className="text-xs font-black uppercase text-emerald-600">Balas</button>
                                            </div>
                                        </div>
                                        <p className="text-slate-700 font-bold leading-relaxed italic mt-2">"{rev.isi_ulasan}"</p>
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
                                                    {reply.user_id === auth?.user?.id && <button onClick={() => handleDelete(reply.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>}
                                                </div>
                                                <p className="text-sm text-slate-600 font-bold italic">"{reply.isi_ulasan}"</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div id="input-ulasan" className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            {replyTo && (
                                <div className="flex items-center justify-between bg-emerald-600 text-white px-4 py-2 rounded-xl mb-4">
                                    <p className="text-sm font-bold">Membalas @{replyTo.username}</p>
                                    <button onClick={() => { setReplyTo(null); setComment(''); }}><X size={18} /></button>
                                </div>
                            )}
                            {!replyTo && (
                                <div className="flex gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}>
                                            <Star size={32} className={`transition-all ${(hover || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                            <textarea className="w-full p-6 bg-white border-2 border-slate-100 focus:border-emerald-500 rounded-2xl outline-none text-xl font-bold text-slate-800 min-h-[140px] resize-none mb-4" placeholder="Tulis pesan..." value={comment} onChange={(e) => setComment(e.target.value)} />
                            <button onClick={handleSendComment} disabled={isSubmitting} className="px-10 py-5 rounded-2xl font-black text-lg bg-[#1a432d] text-white hover:bg-emerald-900 flex items-center gap-3">
                                <Send size={20} /> {isSubmitting ? 'Mengirim...' : 'Kirim'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}