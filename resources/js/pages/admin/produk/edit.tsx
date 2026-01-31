import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header'; 
import { ImagePlus } from 'lucide-react';

export default function EditProduk({ produk }: any) {
    // Inisialisasi useForm dengan data lama
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', 
        nama_produk: produk.nama_produk || '',
        kategori: produk.kategori || '',
        harga: produk.harga || '',
        status: produk.status || 'aktif',
        stok: produk.stok || '',
        deskripsi: produk.deskripsi || '',
        gambar: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/produk/${produk.id}`, {
            forceFormData: true,
            onSuccess: () => alert('Produk berhasil diperbarui!'),
        });
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Head title="Edit Produk - Admin" />
            
            {/* SIDEBAR - Tetap di kiri */}
            <Sidebar />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col">
                {/* HEADER - Sekarang sama persis dengan halaman utama */}
                <Header />

                <main className="p-8">
                    <div className="max-w-5xl">
                        {/* Judul Halaman */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800">Informasi Produk</h2>
                            <p className="text-sm text-slate-500 border-b pb-4">
                                Perbarui informasi mengenai produk yang sudah ada.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                {/* Nama Produk */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Nama Produk<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.nama_produk}
                                        placeholder="Masukkan nama produk"
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none text-slate-900"
                                        onChange={e => setData('nama_produk', e.target.value)}
                                    />
                                    {errors.nama_produk && <div className="text-red-500 text-xs">{errors.nama_produk}</div>}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Status</label>
                                    <select 
                                        value={data.status}
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none bg-white text-slate-900 font-medium"
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
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none bg-white text-slate-900 font-medium"
                                        onChange={e => setData('kategori', e.target.value)}
                                    >
                                        <option value="">Pilih kategori produk</option>
                                        <option value="Rumah">Rumah</option>
                                        <option value="Ruko">Ruko</option>
                                        <option value="Tanah">Tanah</option>
                                    </select>
                                </div>

                                {/* Stok */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Stok<span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={data.stok}
                                        placeholder="0"
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none text-slate-900"
                                        onChange={e => setData('stok', e.target.value)}
                                    />
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
                                            className="w-full p-3 pl-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none text-slate-900"
                                            onChange={e => setData('harga', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Masukkan Deskripsi<span className="text-red-500">*</span></label>
                                <textarea
                                    rows={4}
                                    value={data.deskripsi}
                                    placeholder="Masukkan deskripsi produk"
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#1A4D2E] outline-none resize-none text-slate-900"
                                    onChange={e => setData('deskripsi', e.target.value)}
                                ></textarea>
                            </div>

                            {/* Unggah Gambar */}
                            <div className="w-40 h-40 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden bg-white">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                    onChange={e => setData('gambar', e.target.files ? e.target.files[0] : null)}
                                />
                                {data.gambar ? (
                                    <img src={URL.createObjectURL(data.gambar)} alt="Preview" className="w-full h-full object-cover" />
                                ) : produk.gambar ? (
                                    <img src={`/storage/${produk.gambar}`} alt="Current" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <ImagePlus className="text-slate-400 mb-2" size={32} />
                                        <span className="text-xs text-slate-400 font-medium text-center px-2">Ganti Gambar</span>
                                    </>
                                )}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end gap-4 pt-6">
                                <Link 
                                    href="/produk"
                                    className="px-10 py-2.5 rounded-lg bg-slate-400 text-white hover:bg-slate-500 transition-colors font-medium text-sm"
                                >
                                    Kembali
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-10 py-2.5 rounded-lg bg-[#F29200] text-white hover:bg-[#d88200] transition-all font-medium text-sm shadow-md active:scale-95"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}