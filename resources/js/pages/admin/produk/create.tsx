import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/components/sidebar'; 
import { ImagePlus } from 'lucide-react';

export default function CreateProduk() {
    const { data, setData, post, processing, errors } = useForm({
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
        
        post('/produk', {
            forceFormData: true, 
            onSuccess: () => alert('Produk berhasil ditambahkan!'),
        });
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Head title="Tambah Produk - Admin" />
            <Sidebar />

            <main className="flex-1 p-8">
                {/* Header Profil */}
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
                    <h2 className="text-xl font-bold text-slate-800">Informasi Produk</h2>
                    <p className="text-sm text-slate-500 mb-8">Tambahkan informasi mengenai produk yang ingin Anda buat.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Nama Produk */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Nama Produk<span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={data.nama_produk}
                                    placeholder="Masukkan nama produk"
                                    // text-slate-900 untuk warna teks saat diketik
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none transition text-slate-900 bg-white"
                                    onChange={e => setData('nama_produk', e.target.value)}
                                />
                                {errors.nama_produk && <p className="text-red-500 text-xs mt-1">{errors.nama_produk}</p>}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Status</label>
                                <select 
                                    value={data.status}
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none bg-white text-slate-900"
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Non-Aktif</option>
                                </select>
                            </div>

                            {/* Kategori */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Kategori<span className="text-red-500">*</span></label>
                                <select 
                                    value={data.kategori}
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none bg-white text-slate-900"
                                    onChange={e => setData('kategori', e.target.value)}
                                >
                                    <option value="">Pilih kategori produk</option>
                                    <option value="Rumah">Rumah</option>
                                    <option value="Ruko">Ruko</option>
                                    <option value="Tanah">Tanah</option>
                                </select>
                                {errors.kategori && <p className="text-red-500 text-xs mt-1">{errors.kategori}</p>}
                            </div>

                            {/* Stok */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Stok<span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    value={data.stok}
                                    placeholder="Masukkan stok produk"
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none text-slate-900 bg-white"
                                    onChange={e => setData('stok', e.target.value)}
                                />
                                {errors.stok && <p className="text-red-500 text-xs mt-1">{errors.stok}</p>}
                            </div>

                            {/* Harga */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Harga<span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-slate-500 text-sm">Rp</span>
                                    <input
                                        type="number"
                                        value={data.harga}
                                        placeholder="0"
                                        className="w-full p-3 pl-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none text-slate-900 bg-white"
                                        onChange={e => setData('harga', e.target.value)}
                                    />
                                </div>
                                {errors.harga && <p className="text-red-500 text-xs mt-1">{errors.harga}</p>}
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Masukkan Deskripsi<span className="text-red-500">*</span></label>
                            <textarea
                                rows={4}
                                value={data.deskripsi}
                                placeholder="Masukkan deskripsi produk yang Anda buat"
                                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none resize-none text-slate-900 bg-white"
                                onChange={e => setData('deskripsi', e.target.value)}
                            ></textarea>
                            {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                        </div>

                        {/* Unggah Gambar */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Foto Produk</label>
                            <div className="w-40 h-40 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden bg-white">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                    onChange={e => setData('gambar', e.target.files ? e.target.files[0] : null)}
                                />
                                {data.gambar ? (
                                    <img 
                                        src={URL.createObjectURL(data.gambar)} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <ImagePlus className="text-slate-400 mb-2" size={32} />
                                        <span className="text-xs text-slate-500 font-medium text-center px-2">Unggah Gambar</span>
                                    </>
                                )}
                            </div>
                            {errors.gambar && <p className="text-red-500 text-xs mt-1">{errors.gambar}</p>}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end gap-4 mt-10">
                            <Link 
                                href="/produk"
                                className="px-8 py-2.5 rounded-lg bg-slate-400 text-white hover:bg-slate-500 transition-colors font-medium text-sm"
                            >
                                Kembali
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-8 py-2.5 rounded-lg bg-[#1A4D2E] text-white hover:bg-[#143524] transition-all font-medium text-sm shadow-sm ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'Memproses...' : 'Tambah'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}