import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header'; 
import { ImagePlus, AlertCircle, X, CheckCircle2 } from 'lucide-react';

// Tambahkan interface props untuk data produk dan categories
interface EditProps {
    produk: any;
    categories: Array<{ id: number; name: string }>;
}

export default function EditProduk({ produk, categories }: EditProps) {
    const [isErrorShake, setIsErrorShake] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    
    // --- TAMBAHAN: State untuk Notifikasi ---
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        _method: 'PUT',
        nama_produk: produk.nama_produk || '',
        kategori: produk.kategori || '',
        harga: produk.harga || '',
        status: produk.status || 'aktif',
        stok: produk.stok || '',
        deskripsi: produk.deskripsi || '',
        gambar: [] as File[], // Array untuk multiple file
    });

    // --- TAMBAHAN: Auto-hide notifikasi ---
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    useEffect(() => {
        if (data.gambar.length > 0) {
            const objectUrls = data.gambar.map(file => URL.createObjectURL(file));
            setImagePreviews(objectUrls);
            return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
        } else {
            setImagePreviews([]);
        }
    }, [data.gambar]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setData('gambar', [...data.gambar, ...filesArray]);
        }
    };

    const removeNewImage = (index: number) => {
        const updatedFiles = data.gambar.filter((_, i) => i !== index);
        setData('gambar', updatedFiles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFocusedField(null);

        const isInvalid = !data.nama_produk || !data.kategori || !data.harga || !data.stok || !data.deskripsi;

        if (isInvalid) {
            setIsErrorShake(true);
            setTimeout(() => setIsErrorShake(false), 600);
            return;
        }

        // --- DISESUAIKAN: alert diganti setShowSuccess ---
        post(`/produk/${produk.id}`, {
            forceFormData: true,
            onSuccess: () => setShowSuccess(true),
        });
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Head title="Edit Properti - Admin" />
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8 relative">
                    {/* --- TAMBAHAN: UI Notifikasi --- */}
                    {showSuccess && (
                        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
                            <div className="bg-[#1A4D2E] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 border border-emerald-400">
                                <CheckCircle2 size={18} />
                                <span className="text-sm font-bold">Propeti berhasil diperbarui!</span>
                            </div>
                        </div>
                    )}

                    <div className="max-w-5xl">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-900">Edit Informasi Properti</h2>
                            <p className="text-sm text-slate-500 border-b pb-4">
                                Perbarui informasi mengenai properti <strong>{produk.nama_produk}</strong>.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                {/* Nama Produk */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900">Nama Properti<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.nama_produk}
                                        onFocus={() => { setFocusedField('nama_produk'); clearErrors('nama_produk'); }}
                                        className={`w-full p-3 rounded-lg border outline-none transition-all text-slate-900 bg-white font-medium ${ (focusedField !== 'nama_produk' && (errors.nama_produk || (isErrorShake && !data.nama_produk))) ? 'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                        onChange={e => setData('nama_produk', e.target.value)}
                                    />
                                    {focusedField !== 'nama_produk' && (errors.nama_produk || (isErrorShake && !data.nama_produk)) && (
                                        <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in">
                                            <AlertCircle size={12} /> Nama properti tidak boleh kosong
                                        </p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900">Status</label>
                                    <select 
                                        value={data.status}
                                        className="w-full p-3 rounded-lg border border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50 outline-none bg-white text-slate-900 font-bold"
                                        onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="aktif">Aktif</option>
                                        <option value="nonaktif">Non-Aktif</option>
                                    </select>
                                </div>

                                {/* Kategori - DINAMIS */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900">Kategori<span className="text-red-500">*</span></label>
                                    <select 
                                        value={data.kategori}
                                        onFocus={() => { setFocusedField('kategori'); clearErrors('kategori'); }}
                                        className={`w-full p-3 rounded-lg border outline-none bg-white text-slate-900 font-bold ${ (focusedField !== 'kategori' && (errors.kategori || (isErrorShake && !data.kategori))) ? 'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                        onChange={e => setData('kategori', e.target.value)}
                                    >
                                        <option value="">Pilih kategori properti</option>
                                        {categories && categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {focusedField !== 'kategori' && (errors.kategori || (isErrorShake && !data.kategori)) && (
                                        <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in">
                                            <AlertCircle size={12} /> Kategori wajib dipilih
                                        </p>
                                    )}
                                </div>

                                {/* Stok */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900">Stok Unit<span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={data.stok}
                                        onFocus={() => { setFocusedField('stok'); clearErrors('stok'); }}
                                        className={`w-full p-3 rounded-lg border outline-none text-slate-900 bg-white font-medium ${ (focusedField !== 'stok' && (errors.stok || (isErrorShake && !data.stok))) ? 'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                        onChange={e => setData('stok', e.target.value)}
                                    />
                                    {focusedField !== 'stok' && (errors.stok || (isErrorShake && !data.stok)) && (
                                        <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in">
                                            <AlertCircle size={12} /> Stok unit harus diisi
                                        </p>
                                    )}
                                </div>

                                {/* Harga */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-900">Harga Jual<span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-slate-900 font-bold text-sm">Rp</span>
                                        <input
                                            type="number"
                                            value={data.harga}
                                            onFocus={() => { setFocusedField('harga'); clearErrors('harga'); }}
                                            className={`w-full p-3 pl-10 rounded-lg border outline-none text-slate-900 bg-white font-bold ${ (focusedField !== 'harga' && (errors.harga || (isErrorShake && !data.harga))) ? 'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                            onChange={e => setData('harga', e.target.value)}
                                        />
                                    </div>
                                    {focusedField !== 'harga' && (errors.harga || (isErrorShake && !data.harga)) && (
                                        <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in mt-1">
                                            <AlertCircle size={12} /> Harga properti wajib diisi
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Deskripsi Properti<span className="text-red-500">*</span></label>
                                <textarea
                                    rows={4}
                                    value={data.deskripsi}
                                    onFocus={() => { setFocusedField('deskripsi'); clearErrors('deskripsi'); }}
                                    className={`w-full p-3 rounded-lg border outline-none resize-none text-slate-900 bg-white font-medium ${ (focusedField !== 'deskripsi' && (errors.deskripsi || (isErrorShake && !data.deskripsi))) ? 'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                    onChange={e => setData('deskripsi', e.target.value)}
                                ></textarea>
                                {focusedField !== 'deskripsi' && (errors.deskripsi || (isErrorShake && !data.deskripsi)) && (
                                    <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in">
                                        <AlertCircle size={12} /> Deskripsi wajib diisi
                                    </p>
                                )}
                            </div>

                            {/* Unggah Gambar */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-900">Media / Foto Properti</label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden bg-white ${ (focusedField === 'gambar' || errors.gambar) ? 'border-red-500 bg-red-50' : 'border-slate-300' }`} >
                                        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onFocus={() => setFocusedField('gambar')} onChange={handleFileChange} />
                                        <ImagePlus className="text-slate-400 mb-2" size={32} />
                                        <span className="text-xs text-slate-500 font-bold text-center px-2">Update Foto</span>
                                    </div>

                                    {imagePreviews.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group ring-2 ring-emerald-500">
                                            <img src={url} alt="Preview Baru" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-lg z-20">
                                                <X size={14} />
                                            </button>
                                            <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-[8px] text-white text-center font-bold py-1">BARU</div>
                                        </div>
                                    ))}

                                    {produk.gambar && (
                                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm group">
                                            <img src={`/storage/${produk.gambar}`} alt="Lama" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
                                                <span className="text-[10px] bg-slate-800 text-white px-2 py-1 rounded-md font-bold uppercase shadow-sm">Foto Saat Ini</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium italic">*Kosongkan jika tidak ingin mengganti foto utama.</p>
                            </div>

                            <div className="flex justify-end gap-4 pt-6 border-t">
                                <Link href="/produk" className="px-10 py-2.5 rounded-lg bg-slate-500 text-white hover:bg-slate-600 transition-colors font-bold text-sm shadow-sm">
                                    Batal
                                </Link>
                                <button type="submit" disabled={processing} className="px-10 py-2.5 rounded-lg bg-[#1A4D2E] text-white hover:bg-[#143524] transition-all 
                                font-bold text-sm shadow-md active:scale-95 disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Perbarui Properti'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shakeError { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-shake { animation: shakeError 0.2s ease-in-out 0s 2; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            `}} />
        </div>
    );
}