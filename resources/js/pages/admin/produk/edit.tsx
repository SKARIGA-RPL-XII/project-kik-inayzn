import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header'; 
import { ImagePlus, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface EditProps {
    produk: any;
    categories: Array<{ id: number; name: string }>;
}

export default function EditProduk({ produk, categories }: EditProps) {
    const [isErrorShake, setIsErrorShake] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // State untuk menyembunyikan foto lama secara visual jika user ingin menggantinya
    const [isOldImageRemoved, setIsOldImageRemoved] = useState(false);

    const { data, setData, post, processing, errors, clearErrors, setError } = useForm({
        _method: 'PUT',
        nama_produk: produk.nama_produk || '',
        kategori: produk.kategori || '',
        harga: produk.harga || '',
        status: produk.status || 'aktif',
        stok: produk.stok || '',
        deskripsi: produk.deskripsi || '',
        gambar: [] as File[],
        remove_old_image: false, // Flag tambahan untuk backend
    });

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
        setData('gambar', data.gambar.filter((_, i) => i !== index));
    };

    const handleRemoveOldImage = () => {
        setIsOldImageRemoved(true);
        setData('remove_old_image', true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        let hasError = false;
        const requiredFields = ['nama_produk', 'kategori', 'harga', 'stok', 'deskripsi'];
        
        requiredFields.forEach(field => {
            if (!data[field as keyof typeof data]) {
                setError(field as any, `${field.replace('_', ' ')} wajib diisi`);
                hasError = true;
            }
        });

        if (hasError) {
            setIsErrorShake(true);
            setTimeout(() => setIsErrorShake(false), 600);
            return;
        }

        // Inertia 'post' dengan spoofing '_method: PUT' adalah cara terbaik untuk upload file saat update
        post(`/produk/${produk.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setShowSuccess(true);
                setIsOldImageRemoved(false);
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="flex min-h-screen bg-white font-sans text-slate-900">
            <Head title={`Edit ${produk.nama_produk} - Admin`} />
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8 relative">
                    {/* Success Toast */}
                    {showSuccess && (
                        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
                            <div className="bg-[#1A4D2E] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-400">
                                <CheckCircle2 size={18} className="text-emerald-400" />
                                <span className="text-sm font-bold">Perubahan berhasil disimpan!</span>
                            </div>
                        </div>
                    )}

                    <div className="max-w-5xl">
                        <div className="mb-8">
                            <h2 className="text-2xl font-extrabold tracking-tight">Edit Properti</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Mengubah detail untuk <span className="font-bold text-slate-700">{produk.nama_produk}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Nama Produk */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Nama Properti<span className="text-red-500 ml-1">*</span></label>
                                    <input
                                        type="text"
                                        value={data.nama_produk}
                                        onChange={e => setData('nama_produk', e.target.value)}
                                        className={`w-full p-3 rounded-xl border transition-all outline-none ${errors.nama_produk ? 'border-red-500 bg-red-50 animate-shake' : 'border-slate-200 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50'}`}
                                    />
                                    {errors.nama_produk && <p className="text-red-600 text-xs font-bold flex items-center gap-1 mt-1"><AlertCircle size={14} /> {errors.nama_produk}</p>}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Status Unit</label>
                                    <select 
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50 outline-none font-bold"
                                    >
                                        <option value="aktif">Aktif (Tersedia)</option>
                                        <option value="nonaktif">Non-Aktif (Terjual/Arsip)</option>
                                    </select>
                                </div>

                                {/* Kategori */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Kategori<span className="text-red-500 ml-1">*</span></label>
                                    <select 
                                        value={data.kategori}
                                        onChange={e => setData('kategori', e.target.value)}
                                        className={`w-full p-3 rounded-xl border transition-all outline-none font-bold ${errors.kategori ? 'border-red-500 bg-red-50 animate-shake' : 'border-slate-200 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50'}`}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories?.map((cat) => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Stok */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Stok Unit<span className="text-red-500 ml-1">*</span></label>
                                    <input
                                        type="number"
                                        value={data.stok}
                                        onChange={e => setData('stok', e.target.value)}
                                        className={`w-full p-3 rounded-xl border transition-all outline-none ${errors.stok ? 'border-red-500 bg-red-50 animate-shake' : 'border-slate-200 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50'}`}
                                    />
                                </div>

                                {/* Harga */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold">Harga Jual<span className="text-red-500 ml-1">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                                        <input
                                            type="number"
                                            value={data.harga}
                                            onChange={e => setData('harga', e.target.value)}
                                            className={`w-full p-3 pl-12 rounded-xl border transition-all outline-none font-extrabold text-lg ${errors.harga ? 'border-red-500 bg-red-50 animate-shake' : 'border-slate-200 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Deskripsi Lengkap</label>
                                <textarea
                                    rows={5}
                                    value={data.deskripsi}
                                    onChange={e => setData('deskripsi', e.target.value)}
                                    className={`w-full p-4 rounded-xl border transition-all outline-none resize-none ${errors.deskripsi ? 'border-red-500 bg-red-50 animate-shake' : 'border-slate-200 focus:border-[#1A4D2E] focus:ring-4 focus:ring-emerald-50'}`}
                                    placeholder="Tuliskan spesifikasi detail properti..."
                                ></textarea>
                            </div>

                            {/* Media Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Foto Properti</label>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Mendukung Multiple Upload</span>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {/* Dropzone */}
                                    <label className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-400 transition-all group bg-slate-50">
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                                        <div className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                            <ImagePlus className="text-[#1A4D2E]" size={24} />
                                        </div>
                                        <span className="text-[10px] mt-2 font-bold text-slate-500 uppercase">Tambah</span>
                                    </label>

                                    {/* Existing Photo */}
                                    {produk.gambar && !isOldImageRemoved && (
                                        <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group shadow-sm">
                                            <img src={`/storage/${produk.gambar}`} alt="Current" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    type="button" 
                                                    onClick={handleRemoveOldImage}
                                                    className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <div className="absolute top-2 left-2 bg-slate-900/80 text-[8px] text-white px-2 py-1 rounded font-bold uppercase">Foto Saat Ini</div>
                                        </div>
                                    )}

                                    {/* New Previews */}
                                    {imagePreviews.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md animate-fade-in">
                                            <img src={url} alt="New preview" className="w-full h-full object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => removeNewImage(index)} 
                                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700"
                                            >
                                                <X size={14} />
                                            </button>
                                            <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-[8px] text-white text-center font-bold py-1 uppercase">Baru</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
                                <Link href="/produk" className="px-8 py-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors font-bold text-sm">
                                    Batal
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="px-10 py-3 rounded-xl bg-[#1A4D2E] text-white hover:bg-[#143524] transition-all font-bold text-sm shadow-lg shadow-emerald-900/20 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {processing ? 'Menyimpan...' : 'Perbarui Properti'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shakeError { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-shake { animation: shakeError 0.2s ease-in-out 0s 2; }
                .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
            `}} />
        </div>
    );
}