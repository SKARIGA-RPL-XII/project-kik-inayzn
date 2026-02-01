import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/components/sidebar'; 
import { ImagePlus, AlertCircle } from 'lucide-react';

interface CreateProps {
    categories: Array<{ id: number; name: string }>;
}

export default function CreateProduk({ categories }: CreateProps) {
    const [isErrorShake, setIsErrorShake] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        nama_produk: '',
        kategori: '',
        harga: '',
        status: 'aktif',
        stok: '',
        deskripsi: '',
        gambar: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFocusedField(null);
        
        const isInvalid = !data.nama_produk || !data.kategori || !data.harga || !data.stok || !data.deskripsi || !data.gambar;

        if (isInvalid) {
            setIsErrorShake(true);
            setTimeout(() => setIsErrorShake(false), 600); 
            return;
        }

        // Alert dihapus, Inertia akan redirect dan membawa flash message ke Index
        post('/produk', {
            forceFormData: true,
        });
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Head title="Tambah Properti - Admin" />
            <Sidebar />

            <main className="flex-1 p-8">
                {/* User Info Header */}
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
                                    ${ (focusedField !== 'nama_produk' && (errors.nama_produk || (isErrorShake && !data.nama_produk))) ? 
                                    'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                    onChange={e => setData('nama_produk', e.target.value)}
                                />
                                {focusedField !== 'nama_produk' && (errors.nama_produk || (isErrorShake && !data.nama_produk)) && (
                                    <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in">
                                        <AlertCircle size={12} /> Nama properti wajib diisi
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Status</label>
                                <select 
                                    value={data.status}
                                    className="w-full p-3 rounded-lg border border-slate-300 focus:border-[#1A4D2E] focus:ring-4 
                                    focus:ring-emerald-50 outline-none bg-white text-slate-900 font-medium cursor-pointer"
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
                                    className={`w-full p-3 rounded-lg border outline-none bg-white text-slate-900 font-medium cursor-pointer ${ (focusedField !== 'kategori' && (errors.kategori || (isErrorShake && !data.kategori))) ? 'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
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
                                        <AlertCircle size={12} /> Pilih salah satu kategori
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
                                    ${ (focusedField !== 'stok' && (errors.stok || (isErrorShake && !data.stok))) ? 
                                    'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                    onChange={e => setData('stok', e.target.value)}
                                />
                                {focusedField !== 'stok' && (errors.stok || (isErrorShake && !data.stok)) && (
                                    <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in">
                                        <AlertCircle size={12} /> Stok tidak boleh kosong
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
                                        placeholder="0"
                                        value={data.harga}
                                        onFocus={() => { setFocusedField('harga'); clearErrors('harga'); }}
                                        className={`w-full p-3 pl-10 rounded-lg border outline-none text-slate-900 bg-white font-bold 
                                        ${ (focusedField !== 'harga' && (errors.harga || (isErrorShake && !data.harga))) ? 
                                        'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
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
                            <label className="text-sm font-bold text-slate-900">Deskripsi Lengkap<span className="text-red-500">*</span></label>
                            <textarea
                                rows={4}
                                placeholder="Jelaskan detail produk..."
                                value={data.deskripsi}
                                onFocus={() => { setFocusedField('deskripsi'); clearErrors('deskripsi'); }}
                                className={`w-full p-3 rounded-lg border outline-none resize-none text-slate-900 bg-white font-medium 
                                ${ (focusedField !== 'deskripsi' && (errors.deskripsi || (isErrorShake && !data.deskripsi))) ? 
                                'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50' }`}
                                onChange={e => setData('deskripsi', e.target.value)}
                            ></textarea>
                            {focusedField !== 'deskripsi' && (errors.deskripsi || (isErrorShake && !data.deskripsi)) && (
                                <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in">
                                    <AlertCircle size={12} /> Deskripsi properti masih kosong
                                </p>
                            )}
                        </div>

                        {/* Unggah Gambar */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900">Foto Utama Properti<span className="text-red-500">*</span></label>
                            <div 
                                onClick={() => { setFocusedField('gambar'); clearErrors('gambar'); }}
                                className={`w-40 h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center 
                                cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden bg-white 
                                ${ (focusedField !== 'gambar' && (errors.gambar || (isErrorShake && !data.gambar))) ? 
                                'border-red-500 ring-2 ring-red-100 animate-shake bg-red-50' : 'border-slate-300' }`}>
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                    onChange={e => setData('gambar', e.target.files ? e.target.files[0] : null)}
                                />
                                {data.gambar ? (
                                    <img src={URL.createObjectURL(data.gambar)} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <ImagePlus className="text-slate-400 mb-2" size={32} />
                                        <span className="text-xs text-slate-500 font-bold text-center px-2">Klik untuk Unggah</span>
                                    </>
                                )}
                            </div>
                            {focusedField !== 'gambar' && (errors.gambar || (isErrorShake && !data.gambar)) && (
                                <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 animate-fade-in mt-1">
                                    <AlertCircle size={12} /> Foto properti wajib diunggah
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-10">
                            <Link href="/produk" className="px-8 py-2.5 rounded-lg bg-slate-500 text-white 
                            hover:bg-slate-600 transition-colors font-bold text-sm shadow-sm">Kembali</Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-8 py-2.5 rounded-lg bg-[#1A4D2E] text-white hover:bg-[#143524] 
                                transition-all font-bold text-sm shadow-md
                                ${processing ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}>
                                {processing ? 'Meyimpan...' : 'Simpan Properti'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Animasi */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shakeError {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-shake { animation: shakeError 0.2s ease-in-out 0s 2; }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            `}} />
        </div>
    );
}