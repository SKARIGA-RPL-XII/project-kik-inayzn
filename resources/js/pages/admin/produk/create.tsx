import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/components/sidebar'; 
import { ImagePlus, AlertCircle, X, Phone } from 'lucide-react';

interface CreateProps {
    categories: Array<{ id: number; name: string }>;
}

export default function CreateProduk({ categories }: CreateProps) {
    const [isErrorShake, setIsErrorShake] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const { data, setData, post, processing, errors, clearErrors, setError } = useForm({
        nama_produk: '',
        kategori: '',
        harga: '',
        status: 'aktif',
        stok: '',
        deskripsi: '',
        no_agen: '', // SUDAH DIGANTI: dari no_hp_agen ke no_agen
        gambar: [] as File[],
    });

    // Handle Preview Gambar
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

    const removeImage = (index: number) => {
        const updatedFiles = data.gambar.filter((_, i) => i !== index);
        setData('gambar', updatedFiles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFocusedField(null);
        clearErrors();
        
        let hasError = false;
        const checks = {
            nama_produk: "Nama properti wajib diisi",
            kategori: "Pilih salah satu kategori",
            harga: "Harga properti wajib diisi",
            stok: "Stok tidak boleh kosong",
            deskripsi: "Deskripsi properti masih kosong",
            no_agen: "Nomor WhatsApp agen wajib diisi", // Validasi disesuaikan
        };

        Object.entries(checks).forEach(([field, message]) => {
            const value = data[field as keyof typeof data];
            if (!value || (typeof value === 'string' && value.trim() === "")) {
                setError(field as any, message);
                hasError = true;
            }
        });

        if (data.gambar.length === 0) {
            setError('gambar', 'Minimal unggah satu foto properti');
            hasError = true;
        }

        if (hasError) {
            setIsErrorShake(true);
            setTimeout(() => setIsErrorShake(false), 600); 
            return;
        }

        post('/produk', {
            forceFormData: true,
        });
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Head title="Tambah Properti - Admin" />
            <Sidebar />

            <main className="flex-1 p-8">
                {/* Header User Info */}
                <div className="flex justify-end items-center mb-10 gap-4">
                    <div className="text-right">
                        <p className="text-xl font-semibold text-[#1A4D2E]">Ziera een</p>
                        <p className="text-sm text-slate-500">Admin</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-[#1A4D2E] overflow-hidden">
                        <img src="/images/admin-avatar.png" alt="Admin" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="max-w-4xl">
                    <h2 className="text-xl font-bold text-slate-800">Informasi Properti</h2>
                    <p className="text-sm text-slate-500 mb-8">Tambahkan informasi mengenai properti yang ingin Anda buat.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Nama Produk */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Nama Properti<span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama properti"
                                    value={data.nama_produk}
                                    onFocus={() => { setFocusedField('nama_produk'); clearErrors('nama_produk'); }}
                                    className={`w-full p-3 rounded-lg border outline-none transition-all text-slate-900 bg-white font-medium 
                                    ${ (errors.nama_produk || (isErrorShake && !data.nama_produk)) ? 
                                    'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                    onChange={e => setData('nama_produk', e.target.value)}
                                />
                                {errors.nama_produk && (
                                    <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in">
                                        <AlertCircle size={12} /> {errors.nama_produk}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Status</label>
                                <select 
                                    value={data.status}
                                    className="w-full p-3 rounded-lg border border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50 outline-none bg-white text-slate-900 font-medium cursor-pointer"
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Non-Aktif</option>
                                </select>
                            </div>

                            {/* Kategori */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Kategori<span className="text-red-500">*</span></label>
                                <select 
                                    value={data.kategori}
                                    onFocus={() => { setFocusedField('kategori'); clearErrors('kategori'); }}
                                    className={`w-full p-3 rounded-lg border outline-none bg-white text-slate-900 font-medium cursor-pointer 
                                    ${ (errors.kategori || (isErrorShake && !data.kategori)) ? 
                                    'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                    onChange={e => setData('kategori', e.target.value)}
                                >
                                    <option value="">Pilih kategori</option>
                                    {categories?.map((cat) => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.kategori && (
                                    <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in">
                                        <AlertCircle size={12} /> {errors.kategori}
                                    </p>
                                )}
                            </div>

                            {/* Stok */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Stok Unit<span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={data.stok}
                                    onFocus={() => { setFocusedField('stok'); clearErrors('stok'); }}
                                    className={`w-full p-3 rounded-lg border outline-none text-slate-900 bg-white font-medium 
                                    ${ (errors.stok || (isErrorShake && !data.stok)) ? 
                                    'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                    onChange={e => setData('stok', e.target.value)}
                                />
                            </div>

                            {/* Harga */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Harga Jual<span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-slate-900 font-bold text-sm">Rp</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={data.harga}
                                        onFocus={() => { setFocusedField('harga'); clearErrors('harga'); }}
                                        className={`w-full p-3 pl-10 rounded-lg border outline-none text-slate-900 bg-white font-bold 
                                        ${ (errors.harga || (isErrorShake && !data.harga)) ? 
                                        'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                        onChange={e => setData('harga', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* NO HP AGEN */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">No. WhatsApp Agen<span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="628123xxx"
                                        value={data.no_agen} // SUDAH DIGANTI
                                        onFocus={() => { setFocusedField('no_agen'); clearErrors('no_agen'); }}
                                        className={`w-full p-3 pl-10 rounded-lg border outline-none text-slate-900 bg-white font-medium 
                                        ${ (errors.no_agen || (isErrorShake && !data.no_agen)) ? 
                                        'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                        onChange={e => setData('no_agen', e.target.value)}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 italic font-medium">*Gunakan kode negara (Contoh: 62878...)</p>
                                {errors.no_agen && (
                                    <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in">
                                        <AlertCircle size={12} /> {errors.no_agen}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900">Deskripsi Lengkap<span className="text-red-500">*</span></label>
                            <textarea
                                rows={4}
                                placeholder="Jelaskan detail produk..."
                                value={data.deskripsi}
                                onFocus={() => { setFocusedField('deskripsi'); clearErrors('deskripsi'); }}
                                className={`w-full p-3 rounded-lg border outline-none resize-none text-slate-900 bg-white font-medium 
                                ${ (errors.deskripsi || (isErrorShake && !data.deskripsi)) ? 
                                'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                onChange={e => setData('deskripsi', e.target.value)}
                            ></textarea>
                        </div>

                        {/* Media Properti */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-900">Media Properti (Bisa banyak)<span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-all relative overflow-hidden bg-white 
                                    ${ (errors.gambar || (isErrorShake && data.gambar.length === 0)) ? 'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 hover:border-emerald-400' }`}>
                                    <input 
                                        type="file" multiple accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                        onChange={handleFileChange}
                                    />
                                    <ImagePlus className="text-slate-400 mb-2" size={32} />
                                    <span className="text-[10px] text-slate-500 font-bold">Tambah Foto</span>
                                </div>

                                {imagePreviews.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-10">
                            <Link href="/produk" className="px-8 py-2.5 rounded-lg bg-slate-500 text-white hover:bg-slate-600 transition-colors font-bold text-sm shadow-sm">Kembali</Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-8 py-2.5 rounded-lg bg-[#1A4D2E] text-white hover:bg-[#143524] transition-all font-bold text-sm shadow-md flex items-center gap-2 ${processing ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}>
                                {processing ? 'Menyimpan...' : 'Simpan Properti'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shakeError { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
                .animate-shake { animation: shakeError 0.2s ease-in-out 0s 2; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            `}} />
        </div>
    );
}