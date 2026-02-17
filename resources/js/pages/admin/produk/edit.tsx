import React, { useState, useEffect, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Sidebar from '@/components/sidebar'; 
import Header from '@/components/sidebar-header'; 
import { ImagePlus, X, Loader2, Phone } from 'lucide-react';

interface EditProps {
    produk: any;
    categories: Array<{ id: number; name: string }>;
}

interface FormState {
    _method: string;
    nama_produk: string;
    kategori: string;
    harga: string | number;
    status: string;
    stok: string | number;
    no_agen: string;
    deskripsi: string;
    gambar: File[]; // Hanya untuk file baru
    existing_images: string[]; 
}

export default function EditProduk({ produk, categories }: EditProps) {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const normalizedExistingImages = useMemo((): string[] => {
        if (!produk.gambar) return [];
        if (typeof produk.gambar === 'string') {
            try {
                const decoded = JSON.parse(produk.gambar);
                return Array.isArray(decoded) ? decoded : [produk.gambar];
            } catch (e) {
                return produk.gambar.split(',').map((img: string) => img.trim()).filter((img: string) => img !== '');
            }
        }
        return Array.isArray(produk.gambar) ? produk.gambar : [String(produk.gambar)];
    }, [produk.gambar]);

    const { data, setData, post, processing, errors, clearErrors, setError } = useForm<FormState>({
        _method: 'PUT', 
        nama_produk: produk.nama_produk || '',
        kategori: produk.kategori || '',
        harga: produk.harga || '',
        status: produk.status?.toLowerCase() || 'aktif',
        stok: produk.stok || '',
        no_agen: produk.no_agen || '',
        deskripsi: produk.deskripsi || '',
        gambar: [], // Mulai dengan array kosong
        existing_images: normalizedExistingImages, 
    });

    const handleNumberChange = (field: keyof FormState, value: string) => {
        const sanitizedValue = value.replace(/[^0-9]/g, '');
        setData(field, sanitizedValue);
    };

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
            // Tambahkan file baru ke array gambar
            setData('gambar', [...data.gambar, ...filesArray]);
        }
    };

    const removeNewImage = (index: number) => {
        setData('gambar', data.gambar.filter((_, i) => i !== index));
    };

    const handleRemoveOldImage = (pathToRemove: string) => {
        const updatedExisting = data.existing_images.filter(path => path !== pathToRemove);
        setData('existing_images', updatedExisting);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        
        let hasError = false;

        if (!data.nama_produk) { setError('nama_produk', 'Nama properti wajib diisi'); hasError = true; }
        if (!data.kategori) { setError('kategori', 'Pilih kategori terlebih dahulu'); hasError = true; }
        if (!data.harga) { setError('harga', 'Harga wajib diisi'); hasError = true; }
        if (!data.stok) { setError('stok', 'Stok wajib diisi'); hasError = true; }
        if (!data.no_agen) { setError('no_agen', 'Nomor agen wajib diisi'); hasError = true; }
        if (!data.deskripsi) { setError('deskripsi', 'Deskripsi properti wajib diisi'); hasError = true; }
        
        if (data.existing_images.length === 0 && data.gambar.length === 0) {
            setError('gambar' as any, 'Minimal harus ada 1 foto properti');
            hasError = true;
        }

        if (hasError) return;

        // --- PERBAIKAN LOGIC PENGIRIMAN ---
        // Karena Laravel 'gambar.*' mengharuskan file, kita hanya kirim 'gambar' 
        // jika beneran ada file baru yang dipilih.
        
        const payload = { ...data };
        if (data.gambar.length === 0) {
            // @ts-ignore
            delete payload.gambar; // Hapus key gambar jika kosong agar tidak kena validasi image
        }

        post(`/produk/${produk.id}`, {
            ...payload,
            forceFormData: true,
            preserveScroll: false,
            onSuccess: () => {
                console.log("Update Berhasil");
            },
            onError: (err) => {
                console.error("Terjadi kesalahan:", err);
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-white font-sans text-slate-900">
            <Head title={`Edit ${produk.nama_produk} - Admin`} />
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="p-8 relative">
                    <div className="max-w-5xl">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">Edit Informasi Properti</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Perbarui informasi mengenai properti **{produk.nama_produk}**.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Produk */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Nama Properti<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Rumah Mewah Minimalis"
                                        value={data.nama_produk}
                                        onChange={e => setData('nama_produk', e.target.value)}
                                        className={`w-full p-3 rounded-lg border ${errors.nama_produk ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} focus:border-[#1A4D2E] outline-none transition-all`}
                                    />
                                    {errors.nama_produk && <p className="text-red-600 text-[11px] font-medium">{errors.nama_produk}</p>}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Status</label>
                                    <select 
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-[#1A4D2E] outline-none bg-white capitalize"
                                    >
                                        <option value="aktif">Aktif</option>
                                        <option value="nonaktif">Nonaktif</option>
                                    </select>
                                </div>

                                {/* Kategori */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Kategori<span className="text-red-500">*</span></label>
                                    <select 
                                        value={data.kategori}
                                        onChange={e => setData('kategori', e.target.value)}
                                        className={`w-full p-3 rounded-lg border ${errors.kategori ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} focus:border-[#1A4D2E] outline-none bg-white`}
                                    >
                                        <option value="">Pilih kategori</option>
                                        {categories?.map((cat) => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.kategori && <p className="text-red-600 text-[11px] font-medium">{errors.kategori}</p>}
                                </div>

                                {/* Stok */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Stok Unit<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={data.stok}
                                        onChange={e => handleNumberChange('stok', e.target.value)}
                                        className={`w-full p-3 rounded-lg border ${errors.stok ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} focus:border-[#1A4D2E] outline-none`}
                                    />
                                    {errors.stok && <p className="text-red-600 text-[11px] font-medium">{errors.stok}</p>}
                                </div>

                                {/* Harga */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Harga Jual<span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">Rp</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={data.harga}
                                            onChange={e => handleNumberChange('harga', e.target.value)}
                                            className={`w-full p-3 pl-10 rounded-lg border ${errors.harga ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} focus:border-[#1A4D2E] outline-none`}
                                        />
                                    </div>
                                    {errors.harga && <p className="text-red-600 text-[11px] font-medium">{errors.harga}</p>}
                                </div>

                                {/* No Agen */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">No. WhatsApp Agen<span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="628123xxx"
                                            value={data.no_agen}
                                            onChange={e => handleNumberChange('no_agen', e.target.value)}
                                            className={`w-full p-3 pl-12 rounded-lg border ${errors.no_agen ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} focus:border-[#1A4D2E] outline-none`}
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 italic">*Gunakan kode negara (62)</p>
                                    {errors.no_agen && <p className="text-red-600 text-[11px] font-medium">{errors.no_agen}</p>}
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Deskripsi Lengkap<span className="text-red-500">*</span></label>
                                <textarea
                                    rows={6}
                                    value={data.deskripsi}
                                    onChange={e => setData('deskripsi', e.target.value)}
                                    className={`w-full p-4 rounded-lg border ${errors.deskripsi ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'} focus:border-[#1A4D2E] outline-none resize-none transition-all`}
                                    placeholder="Jelaskan detail properti..."
                                ></textarea>
                                {errors.deskripsi && <p className="text-red-600 text-[11px] font-medium">{errors.deskripsi}</p>}
                            </div>

                            {/* Media/Gambar */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold">Media Properti<span className="text-red-500">*</span></label>
                                <div className="flex flex-wrap gap-4">
                                    <label className={`w-40 h-40 border-2 border-dashed ${errors.gambar ? 'border-red-400 bg-red-50' : 'border-slate-300'} rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all bg-white`}>
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                                        <ImagePlus className="text-slate-400 mb-2" size={32} />
                                        <span className="text-[11px] font-medium text-slate-500">Tambah Foto</span>
                                    </label>

                                    {/* Gambar Lama */}
                                    {data.existing_images.map((path, idx) => (
                                        <div key={`old-${idx}`} className="relative w-40 h-40 rounded-lg overflow-hidden border border-slate-100 group shadow-sm">
                                            <img 
                                                src={path.startsWith('http') ? path : `/storage/${path}`} 
                                                className="w-full h-full object-cover" 
                                                alt="Existing"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveOldImage(path)} 
                                                    className="bg-white text-red-600 p-1.5 rounded-full hover:bg-red-50"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                            <div className="absolute top-2 left-2 bg-black/60 text-[8px] text-white px-1.5 py-0.5 rounded uppercase font-bold">Lama</div>
                                        </div>
                                    ))}

                                    {/* Preview Gambar Baru */}
                                    {imagePreviews.map((url, index) => (
                                        <div key={`new-${index}`} className="relative w-40 h-40 rounded-lg overflow-hidden border border-emerald-500 shadow-md">
                                            <img src={url} className="w-full h-full object-cover" alt="Preview" />
                                            <button 
                                                type="button" 
                                                onClick={() => removeNewImage(index)} 
                                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-lg"
                                            >
                                                <X size={14} />
                                            </button>
                                            <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-[9px] text-white text-center font-bold py-1">BARU</div>
                                        </div>
                                    ))}
                                </div>
                                {errors.gambar && <p className="text-red-600 text-xs mt-1 font-bold">{errors.gambar as any}</p>}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                <Link href="/produk" className="px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-bold transition-all">
                                    Batal
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="px-8 py-2.5 rounded-lg bg-[#1A4D2E] text-white hover:bg-[#143524] font-bold shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all"
                                >
                                    {processing ? <Loader2 size={18} className="animate-spin" /> : 'Perbarui Properti'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}